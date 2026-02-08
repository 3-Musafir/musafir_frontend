# GEO Readiness Checklist

## Structured Data
- [ ] Organization JSON-LD validates (name, url, logo, contactPoint)
- [ ] WebSite JSON-LD validates (no SearchAction if search is absent)
- [ ] WebPage JSON-LD present on core pages
- [ ] FAQPage JSON-LD present only on pages with FAQs

## Crawlability
- [ ] `public/robots.txt` allows crawling and lists sitemap
- [ ] `/sitemap.xml` lists new GEO pages and flagship detail routes
- [ ] Canonical URLs resolve without trailing slash duplication

## On-Page GEO
- [ ] /about-3musafir has definition block + AI summary
- [ ] /trust hub links to verification, vendor onboarding, travel education
- [ ] Trust pages include "how it works" and "what we do / don’t do"
- [ ] /community/voices includes disclaimer and paraphrased themes

## Internal Linking
- [ ] Trip details link to /trust and /about-3musafir
- [ ] Trust pages link back to /explore or /home
- [ ] Footer links updated to new GEO pages

## Performance & Accessibility
- [ ] Hero images include width/height and sensible priority
- [ ] Key copy is rendered server-side (no client-only gating)
- [ ] Alt text present for meaningful images

## Manual Validation
- [ ] Run Google Rich Results Test on /about-3musafir
- [ ] Run Schema Validator on /trust/verification
- [ ] Confirm robots/sitemap in browser
