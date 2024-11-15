import NextAuth from "next-auth";
import authConfig from "@/auth/config";

const { auth } = NextAuth(authConfig);

const publicRoutes = ["/", "/about", "/contact", "/review"];
const authRoutes = ["/login"];
const apiAuthPrefix = "/api/auth";
const apiReviewPrefix = "/api/review";
const apiProjectReviewsPrefix = /^\/api\/projects\/[^/]+\/reviews/;
const apiUploadthingPrefix = "/api/uploadthing";
const apiStripeWebHookPrefix = "/api/webhook/stripe";

export default auth((req) => {
  const { nextUrl } = req;
  const isLoggedIn = !!req.auth;

  const isApiAuthRoute = nextUrl.pathname.startsWith(apiAuthPrefix);
  const isApiReviewRoute = nextUrl.pathname.startsWith(apiReviewPrefix);
  const isApiUploadthingRoute =
    nextUrl.pathname.startsWith(apiUploadthingPrefix);
  const isApiStripeWebhookRoute = nextUrl.pathname.startsWith(
    apiStripeWebHookPrefix
  );
  const isApiProjectReviewsPrefix = apiProjectReviewsPrefix.test(
    nextUrl.pathname
  );
  const isPublicRoute = publicRoutes.includes(nextUrl.pathname);
  const isAuthRoute = authRoutes.includes(nextUrl.pathname);

  if (
    isApiAuthRoute ||
    isApiReviewRoute ||
    isApiUploadthingRoute ||
    isApiStripeWebhookRoute ||
    isApiProjectReviewsPrefix
  ) {
    return;
  }

  if (isAuthRoute) {
    if (isLoggedIn) {
      return Response.redirect(new URL("/", req.url));
    }
    return;
  }

  if (!isLoggedIn && !isPublicRoute) {
    return Response.redirect(new URL("/login", req.url));
  }
  return;
});

// Configuration for the middleware matcher
export const config = {
  matcher: ["/((?!.*\\..*|_next).*)", "/", "/(api|trpc)(.*)"],
};
