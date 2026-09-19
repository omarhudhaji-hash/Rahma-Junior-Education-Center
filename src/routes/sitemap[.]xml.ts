import { createFileRoute } from "@tanstack/react-router";

const publicPaths = ["/", "/about", "/academics", "/admissions", "/contact", "/gallery"];

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

function escapeXml(value: string) {
  return value.replace(
    /[<>&'"]/g,
    (character) =>
      ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", "\"": "&quot;", "'": "&apos;" })[
        character
      ] ?? character,
  );
}

export const Route = createFileRoute("/sitemap.xml")({
  server: {
    handlers: {
      GET: ({ request, env }) => {
        const siteUrl = getSiteUrl(request, env);
        const urls = publicPaths
          .map((path) => `  <url><loc>${escapeXml(`${siteUrl}${path}`)}</loc></url>`)
          .join("\n");
        const sitemap = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls}\n</urlset>\n`;

        return new Response(sitemap, {
          headers: {
            "Cache-Control": "public, max-age=3600, s-maxage=86400",
            "Content-Type": "application/xml; charset=utf-8",
          },
        });
      },
    },
  },
});