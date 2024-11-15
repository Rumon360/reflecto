import {
  Bell,
  Blocks,
  CircleDollarSign,
  LayoutDashboard,
  User,
} from "lucide-react";

export const sidebarItems = [
  {
    id: 1,
    title: "Navigation",
    items: [
      {
        id: 1,
        title: "Dashboard",
        icon: LayoutDashboard,
        href: "/dashboard",
      },
    ],
  },
  {
    id: 2,
    title: "Settings",
    items: [
      {
        id: 1,
        title: "Billing",
        icon: CircleDollarSign,
        href: "/dashboard/billing",
      },
      {
        id: 2,
        title: "Profile",
        icon: User,
        href: "/dashboard/profile",
      },
      {
        id: 4,
        title: "Integrations",
        href: `/dashboard/integrations`,
        icon: Blocks,
      },
    ],
  },
];

export const subscriptionPlansData = {
  limits: 3,
  reviewLimit: 2,
};

export const plans = [
  {
    id: 1,
    link: "https://buy.stripe.com/test_3cs3elcYV1mT6jedQS",
    priceId: "price_1QKKTYG4rZm86TC8luXygakr",
    price: 9.99,
    value: "monthly",
    duration: "/month",
    description: "Billed monthly",
  },
  {
    id: 2,
    link: "https://buy.stripe.com/test_eVa6qx8IF1mTfTOaEH",
    priceId: "price_1QKKVNG4rZm86TC8lJouRCW7",
    price: 99.99,
    value: "yearly",
    duration: "/year",
    description: " Billed yearly (save 16%)",
  },
];
