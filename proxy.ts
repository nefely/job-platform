import createMiddleware from "next-intl/middleware";
import { routing } from "./i18n/routing";

// Next.js 16 renamed the `middleware` file convention to `proxy`
// (node_modules/next/dist/docs/01-app/03-api-reference/03-file-conventions/proxy.md).
// next-intl's middleware factory is otherwise unchanged — we just export its
// result as the default export this file convention expects.
export default createMiddleware(routing);

export const config = {
  matcher: ["/", "/(uk|en|pl)/:path*", "/((?!_next|.*\\..*).*)"],
};
