import Stripe from "stripe";
import { headers } from "next/headers";
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { SubscriptionPlan } from "@prisma/client";
import { plans } from "@/lib/data";

// Initialize the Stripe instance with the secret key
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2024-10-28.acacia",
  typescript: true,
});

type StripeError = {
  message: string;
};

export async function POST(req: NextRequest) {
  // Get the raw body of the request as text (used to verify webhook signature)
  const body = await req.text();

  // Get the Stripe signature header from the incoming request
  const signature = headers().get("stripe-signature") as string;

  let event: Stripe.Event;

  // Verify the Stripe webhook signature to ensure the request is from Stripe
  try {
    event = stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET!
    );
  } catch (error: unknown) {
    if (error instanceof Error) {
      return new NextResponse(`Webhook Error: ${error.message}`, {
        status: 400,
      });
    }
    return new NextResponse("Webhook Error occurred", { status: 400 });
  }

  // Extract the event data from the Stripe event
  const data = event.data;

  switch (event.type) {
    // Event when a checkout session has been completed successfully
    case "checkout.session.completed": {
      // Retrieve the session object from Stripe
      const session = await stripe.checkout.sessions.retrieve(
        (data.object as Stripe.Checkout.Session).id,
        {
          expand: ["line_items"],
        }
      );

      // Extract customer ID and email from the session
      const customerId = session?.customer as string;
      const customer = await stripe.customers.retrieve(customerId);
      const priceId = session?.line_items?.data[0]?.price?.id;
      const plan = plans.find(
        (p: { priceId: string }) => p.priceId === priceId
      );

      // Retrieve subscription details from Stripe
      const subscription = await stripe.subscriptions.retrieve(
        session.subscription as string
      );

      // Extract customer email from session details
      const customerEmail = session.customer_details?.email;

      // If no customer email is found, respond with an error
      if (!customerEmail) {
        return new NextResponse("Customer email is required", { status: 400 });
      }

      // Check if a user with the given email exists in the database
      const user = await prisma.user.findUnique({
        where: {
          email: customerEmail,
        },
      });

      // If no user is found, return an error response
      if (!user) {
        return new NextResponse("User not found", { status: 404 });
      }

      // Update or create a subscription record in the database for the user
      await prisma.subscription.upsert({
        where: { userId: user.id },
        update: {
          stripeSubscriptionId: subscription.id,
          stripeCustomerId: subscription.customer as string,
          plan:
            plan?.value === "yearly"
              ? SubscriptionPlan.YEARLY
              : SubscriptionPlan.MONTHLY,
        },
        create: {
          userId: user.id,
          stripeSubscriptionId: subscription.id,
          stripeCustomerId: subscription.customer as string,
          plan:
            plan?.value === "yearly"
              ? SubscriptionPlan.YEARLY
              : SubscriptionPlan.MONTHLY,
        },
      });
      break;
    }

    // Event when an invoice payment succeeds
    case "invoice.payment_succeeded": {
      // Get invoice data from the event
      const invoiceData = event.data.object as Stripe.Invoice;

      // Retrieve subscription details related to the invoice
      const subscription = await stripe.subscriptions.retrieve(
        invoiceData.subscription as string
      );

      // Check if the subscription exists in the database
      const existingSubscription = await prisma.subscription.findFirst({
        where: {
          stripeSubscriptionId: subscription.id,
        },
      });

      // If no existing subscription is found, return an error
      if (!existingSubscription) {
        return new NextResponse("Subscription not found", { status: 404 });
      }

      // Get the priceId of the subscription and find the associated plan
      const priceId = subscription.items.data[0].price.id;
      const plan = plans.find((p) => p.priceId === priceId);

      // Update the subscription record in the database with the new plan
      await prisma.subscription.update({
        where: {
          id: existingSubscription.id,
        },
        data: {
          plan:
            plan?.value === "yearly"
              ? SubscriptionPlan.YEARLY
              : SubscriptionPlan.MONTHLY,
        },
      });
      break;
    }

    // Event when a subscription is deleted (canceled)
    case "customer.subscription.deleted": {
      // Retrieve subscription data from the event
      const subscription = event.data.object as Stripe.Subscription;

      // Check if the subscription exists in the database
      const existingSubscription = await prisma.subscription.findFirst({
        where: {
          stripeSubscriptionId: subscription.id,
        },
      });

      // If no existing subscription is found, return an error
      if (!existingSubscription) {
        return new NextResponse("Subscription not found", { status: 404 });
      }

      // Retrieve all projects associated with the user of the subscription
      const userProjects = await prisma.project.findMany({
        where: {
          members: {
            some: {
              userId: existingSubscription.userId,
            },
          },
        },
        orderBy: {
          createdAt: "asc",
        },
      });

      // Update the project statuses based on the subscription cancellation
      const projectUpdates = userProjects.map((project, index) => {
        return prisma.project.update({
          where: { id: project.id },
          data: { active: index < 3 },
        });
      });

      // Perform the updates within a transaction
      await prisma.$transaction([
        ...projectUpdates,
        prisma.subscription.update({
          where: {
            id: existingSubscription.id,
          },
          data: {
            plan: SubscriptionPlan.FREE,
            stripeSubscriptionId: null,
          },
        }),
      ]);
      break;
    }
  }

  return new NextResponse(null, { status: 200 });
}
