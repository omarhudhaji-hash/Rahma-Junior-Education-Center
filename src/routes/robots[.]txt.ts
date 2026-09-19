import { createFileRoute } from "@tanstack/react-router";

function getSiteUrl(request: Request, env: unknown) {
  const runtimeEnv = env && typeof env === "object" ? (env as Record<string, unknown>) : {};
  const processEnv = (globalThis as typeof globalThis & {
    process?: { env?: Record<string, string | undefined> };
  }).process?.env;
  const configuredUrl = runtimeEnv.NEXT_PUBLIC_SITE_URL ?? processEnv?.NEXT_PUBLIC_SITE_URL;

  try {
    return new URL(typeof configuredUrl === "string" ? configuredUrl : request.url).origin;
  } catch {
    return new URL(request.url).origin;
  }
}

export const Route = createFileRoute("/robots.txt")({
  server: {
    handlers: {
      GET: ({ request, env }) => {
        const siteUrl = getSiteUrl(request, env);
        const robots = `User-agent: *\nAllow: /\nDisallow: /auth\nDisallow: /dashboard\nDisallow: /portal\nSitemap: ${siteUrl}/sitemap.xml\n`;

        return new Response(robots, {
          headers: {
            "Cache-Control": "public, max-age=3600, s-maxage=86400",
            "Content-Type": "text/plain; charset=utf-8",
          },
        });
      },
    },
  },
});