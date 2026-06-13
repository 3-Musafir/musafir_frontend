import { existsSync, readFileSync } from "node:fs";
import { resolve } from "node:path";

const root = resolve(new URL("..", import.meta.url).pathname);
const pagesRoot = resolve(root, "src/pages");
const seoConfigPath = resolve(root, "src/lib/seo/seoConfig.ts");
const sitemapPath = resolve(root, "src/pages/sitemap.xml.tsx");
const robotsPath = resolve(root, "public/robots.txt");
const llmsPath = resolve(root, "public/llms.txt");

const read = (path) => readFileSync(path, "utf8");

const routeToPageFile = (route) => {
  if (route === "/") return resolve(pagesRoot, "index.tsx");
  const clean = route.replace(/^\//, "");
  const directPage = resolve(pagesRoot, `${clean}.tsx`);
  if (existsSync(directPage)) return directPage;
  return resolve(pagesRoot, clean, "index.tsx");
};

const requiredFiles = [
  seoConfigPath,
  sitemapPath,
  robotsPath,
  llmsPath,
  resolve(root, "docs/geo-checklist.md"),
];

const missingFiles = requiredFiles.filter((path) => !existsSync(path));

if (missingFiles.length) {
  console.error("Missing SEO/GEO files:");
  missingFiles.forEach((path) => console.error(`- ${path}`));
  process.exit(1);
}

const seoConfig = read(seoConfigPath);
const indexableMatch = seoConfig.match(/INDEXABLE_PATHS\s*=\s*\[([\s\S]*?)\]\s*as const/);

if (!indexableMatch) {
  console.error("Could not parse INDEXABLE_PATHS from src/lib/seo/seoConfig.ts");
  process.exit(1);
}

const indexablePaths = Array.from(
  indexableMatch[1].matchAll(/"([^"]+)"/g),
  (match) => match[1],
);

const missingPages = indexablePaths.filter((route) => !existsSync(routeToPageFile(route)));

if (missingPages.length) {
  console.error("INDEXABLE_PATHS contains routes without matching page files:");
  missingPages.forEach((route) => console.error(`- ${route}`));
  process.exit(1);
}

const sitemapSource = read(sitemapPath);
if (!sitemapSource.includes("INDEXABLE_PATHS")) {
  console.error("sitemap.xml.tsx must be generated from INDEXABLE_PATHS");
  process.exit(1);
}

const robots = read(robotsPath);
if (!robots.includes("Sitemap: https://3musafir.com/sitemap.xml")) {
  console.error("robots.txt must list https://3musafir.com/sitemap.xml");
  process.exit(1);
}

if (!/Disallow:\s*\/api\b/.test(robots)) {
  console.error("robots.txt must block API routes");
  process.exit(1);
}

const llms = read(llmsPath);
const siteUrls = Array.from(llms.matchAll(/https:\/\/3musafir\.com([^\s)\]]*)/g), (match) => {
  const path = match[1] || "/";
  return path === "" ? "/" : path.replace(/\/$/, "") || "/";
});

const allowedUtilityPaths = new Set(["/llms.txt", "/sitemap.xml"]);
const unexpectedUrls = Array.from(
  new Set(siteUrls.filter((path) => !indexablePaths.includes(path) && !allowedUtilityPaths.has(path))),
);

if (unexpectedUrls.length) {
  console.error("llms.txt references non-indexable 3Musafir URLs:");
  unexpectedUrls.forEach((path) => console.error(`- ${path}`));
  process.exit(1);
}

const missingLlmsUrls = indexablePaths.filter((route) => {
  const url = `https://3musafir.com${route === "/" ? "" : route}`;
  return !llms.includes(url);
});

if (missingLlmsUrls.length) {
  console.error("llms.txt is missing indexable URLs:");
  missingLlmsUrls.forEach((route) => console.error(`- ${route}`));
  process.exit(1);
}

console.log(`GEO validation passed for ${indexablePaths.length} indexable routes.`);
