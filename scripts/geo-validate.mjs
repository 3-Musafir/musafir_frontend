import { existsSync } from "node:fs";
import { resolve } from "node:path";

const root = resolve(new URL("..", import.meta.url).pathname);
const pagesRoot = resolve(root, "src/pages");

const requiredRoutes = [
  "about-3musafir/index.tsx",
  "trust/index.tsx",
  "trust/verification.tsx",
  "trust/vendor-onboarding.tsx",
  "trust/travel-education.tsx",
  "community/voices.tsx",
];

const missing = requiredRoutes.filter((route) => !existsSync(resolve(pagesRoot, route)));

if (missing.length) {
  console.error("Missing GEO pages:");
  missing.forEach((route) => console.error(`- ${route}`));
  process.exit(1);
}

const docsPath = resolve(root, "docs/geo-checklist.md");
if (!existsSync(docsPath)) {
  console.error("Missing docs/geo-checklist.md");
  process.exit(1);
}

console.log("GEO validation passed.");
