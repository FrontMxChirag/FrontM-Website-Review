# FrontM Website

Official marketing site for FrontM — the AI-native operating platform for maritime.

Static site: plain HTML/CSS/JS, **no build step**. Any file at the repo root is served as-is.

## Repo structure

```
/                       servable site (GitHub Pages publishes the root)
  index.html            homepage
  platform.html         Platform (now also hosts the "Learn" section)
  about.html  contact.html  hiring.html
  solutions-by-industry.html  solutions-by-department.html
  legal.html  legal-privacy.html  legal-terms.html  legal-gdpr.html
  learn.html            redirect stub → platform.html#learn (Learn merged into Platform, 15 Jun)
  404.html              branded not-found
  robots.txt            Disallow: / — review build, kept out of search until launch
  site/                 6 CSS + 9 JS modules (no bundler)
  assets/               brand lockup, favicon mark, 14 partner logos, onship logo
docs/                   internal — design system, web design doc, change list, deploy notes
                        (not part of the served site; safe to keep in-repo)
```

## Hosting

- **Now (review):** GitHub Pages from `main`. `robots.txt` disallows all crawlers; the
  site must stay unindexed until the production launch.
- **Production (planned):** Next.js on Vercel; `frontm.com` apex cuts over to Vercel in a
  single DNS change. GitHub Pages is review-only and never receives the apex domain.

## Source of truth

The site is authored in **Claude Design** ("Website Design Alpha"). This repo **hosts the
export** — site files are not hand-edited here. Each new export's `deploy/` folder becomes
the repo root. Repo-only files (`robots.txt`, `.gitignore`, this README) are not part of the
export and are preserved across syncs.

See `docs/DESIGN-CHANGELIST.md` for fixes that must be folded back into the Claude Design
source, and `docs/README-DEPLOY.md` for the design team's pre-launch content blockers.

## Before going live

See `docs/README-DEPLOY.md`. Open content blockers at time of this export:
- Vessel stat is inconsistent across sections (Impact row says **1,500+**; Pillars/Pathways
  still say 15,000+ and "99% uptime SLA") — reconcile in `site/fm-data.js`.
- Nav/footer/CTA routes and Solutions sub-pages are `#` placeholders.
- "Book a Demo" and newsletter forms are front-end only (Phase 2 `/api/lead` wires them up).
- Replace placeholder stats once verified; confirm permission for all 14 partner logos.
