# GEO Readiness Checklist

## Structured Data
- [ ] Organization JSON-LD validates (name, url, logo, contactPoint)
- [ ] WebSite JSON-LD validates (no SearchAction if search is absent)
- [ ] WebPage JSON-LD present on core pages
- [ ] FAQPage JSON-LD present only on pages with FAQs

## Crawlability
- [ ] `public/robots.txt` allows page crawling, blocks API routes, and lists sitemap
- [ ] `/sitemap.xml` is generated from `INDEXABLE_PATHS` only
- [ ] `public/llms.txt` lists the same indexable public sources as `INDEXABLE_PATHS`
- [ ] Non-indexable pages remain crawlable so crawlers can see `noindex,follow`
- [ ] Canonical URLs resolve without trailing slash duplication

## On-Page GEO
- [ ] /about-3musafir has definition block + AI summary
- [ ] /hc is the indexable trust, help, and safety hub
- [ ] Noindex trust child pages link back to indexable public source pages where appropriate

## Internal Linking
- [ ] Trip details link to /hc and /about-3musafir
- [ ] Trust/help pages link back to /explore or /
- [ ] Footer links stay aligned with `INDEXABLE_PATHS`

## Performance & Accessibility
- [ ] Hero images include width/height and sensible priority
- [ ] Key copy is rendered server-side (no client-only gating)
- [ ] Alt text present for meaningful images

## Manual Validation
- [ ] Run Google Rich Results Test on /about-3musafir
- [ ] Run Schema Validator on /hc and /pakistan-dmc
- [ ] Confirm robots/sitemap in browser
