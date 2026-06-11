# DESIGN CHANGELIST — repo fixes that must reach Claude Design

> **Why this file exists:** the repo (develop-v2) and Claude Design both edit the same site files.
> Every repo-side fix below touches files that Claude Design exports — if it isn't applied in the
> design tool too, **the next export silently regresses it**. Paste the entries below into your
> Claude Design session (one block or individually). Check an entry off only when a subsequent
> export arrives already containing it. The sync procedure must diff fresh exports against this
> list and re-apply anything missing BEFORE pushing.
>
> Status legend: ☐ not yet in Claude Design · ☑ confirmed present in a fresh export

---

## Paste-ready block for Claude Design

```text
Apply these production fixes to the FrontM Homepage v2 working file AND the deploy build.
They are already live on the review site — this keeps the design source in sync so the
next export doesn't undo them.

1. HERO RESPONSIVE (critical): Delete the inline style attributes on the hero h1 and the
   hero lede entirely. Express the typography in fm-chrome.css instead:
   .hero h1 { font-size: clamp(2.2rem, 5vw, 54px); max-width: min(947px, 100%);
              font-weight: 500; letter-spacing: 1.3px; line-height: 1.2; text-align: center; }
   .hero .lede { max-width: min(744px, 100%); font-size: 15px; }  /* no fixed height */
   Also: .hero-inner max-width 880px → 960px (keeps the h1's 2-line wrap at desktop).
   Reason: inline width:947px clipped the headline on every viewport under ~990px.

2. HERO CTAs: The hero CTA row is now: primary <button data-open-demo> "Book a Demo →"
   + secondary "Explore the Platform" (data-route="platform"). Remove "Build on frontm.ai"
   and "Join the Marketplace" from the hero — they already exist as the Buy/Build/Integrate
   track CTAs. Remove the hero-trust line if still present (already removed in latest export).

3. CTA HIERARCHY (fm-rebuild.js): demoBtn() now renders class "btn btn-primary";
   platBtn() renders "btn btn-secondary" (+ btn-pill when its primary flag is set).
   Reason: demo booking is the page goal; "Explore Platform Plans" routes to a page
   that doesn't exist yet, so it must not hold the primary slot.

4. CLOSING CTA BAND: After the Testimonials section, before the footer, add a closing
   section reusing the .impact-cta pattern:
   h3 "See it on your fleet." · p "A 20-minute walkthrough against your own workflows —
   crewing, HSQE, technical, operations or welfare. No deck, no obligation."
   · primary Book a Demo button (data-open-demo) · secondary "Explore Platform Plans".

5. IMPACT CTA ORDER (index.html impact section): "Book a Value Assessment"
   (data-open-demo) is now btn-primary and listed FIRST; "Explore Platform Plans"
   is btn-secondary, second.

6. VESSEL COUNT (fm-data.js): every "15,000+" is now "1,500+" — NAV App Marketplace line,
   PILLARS Scalable body + first check, PATHWAYS Maritime Service Providers.
   Also REMOVED the unverified "99% uptime SLA" from the PILLARS Scalable checks
   (now "Low-bandwidth optimised"). Do not reintroduce either.

7. DEMO MODAL MARKUP (index.html):
   - h3 is now "See FrontM running against your fleet's workflows in 20 minutes."
     (was "your real bulletin" — CONNECT-module jargon)
   - All three form fields have label for= / input id= pairs + autocomplete
     (demo-name / demo-email / demo-fleet)
   - Pane 2 has a "← Back to day" button (data-back="1"); pane 3 has "← Back to time"
     (data-back="2", inside the form, type="button")
   - #demo-success has aria-live="polite"

8. DEMO MODAL CSS (fm-chrome.css):
   - .modal gains position: relative (the close button was detaching to the viewport
     corner once the open transition finished)
   - .modal-scrim transition is now "opacity .3s, visibility 0s .3s" and
     .modal-scrim.open overrides to "opacity .3s, visibility 0s"
     (visibility flips instantly on open so focus can land; only delays on close)

9. DEMO MODAL JS (fm.js): open() stores the trigger, defers focus into the dialog by
   ~80ms, traps Tab inside the dialog, closes on Escape only while open, restores focus
   to the trigger on close, and wires [data-back] buttons to gotoStep().

10. JS HARDENING (fm.js / fm-rebuild.js / fm-pflow.js):
    - All three files guard window.FM at the top and abort with a console.error
      instead of throwing if fm-data.js failed
    - fm.js wraps every init block in safe(name, fn) try/catch — one block failing
      no longer kills everything after it
    - fm.js init ORDER: reveal observer FIRST, demo modal SECOND, then nav and the rest
    - Marquee logo <img> elements remove their .logo pill on a 404 error
    - Null guards on #t-prev/#t-next/#t-dots/.nrail .fill

11. NO-JS FALLBACK (fm.css + page head): the .reveal hidden state is now gated on a
    .js class: ".js .reveal:not(.in) { opacity: 0; transform: translateY(26px) }".
    The plain .reveal rule keeps only the transition. The reduced-motion override
    targets both. Every page <head> adds, as its FIRST script:
    <script>document.documentElement.className += ' js';</script>

12. FONT LOADING (fm.css + page head): the Google Fonts @import is REMOVED from
    fm.css. Every page <head> instead carries:
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=IBM+Plex+Sans+Condensed:ital,wght@0,400;0,500;0,600;0,700;1,400&family=Hanken+Grotesk:wght@400;500;600;700;800&family=JetBrains+Mono:wght@400;500;600&display=swap" rel="stylesheet">
    Reason: @import inside CSS = render-blocking 3-hop chain.

13. SEO/HEAD (index.html / deploy only — review-site specific, do NOT carry the noindex
    into production designs): noindex meta, twitter:card, JSON-LD Organization schema.
    robots.txt (Disallow: /) and a branded 404.html exist at the deploy root.
```

---

## Entry status

| # | Fix | Status |
|---|---|---|
| 1 | Hero inline styles → CSS clamp + hero-inner 960px | ☐ |
| 2 | Hero CTA row (Book a Demo primary) | ☐ |
| 3 | fm-rebuild.js CTA hierarchy flip | ☐ |
| 4 | Closing CTA band | ☐ |
| 5 | Impact CTA order | ☐ |
| 6 | Vessel count 1,500+ / SLA removal | ☐ |
| 7 | Modal markup (labels, back, aria-live, headline) | ☐ |
| 8 | Modal CSS (position relative, visibility timing) | ☐ |
| 9 | Modal JS (focus trap/restore, back buttons) | ☐ |
| 10 | JS hardening (guards, safe(), init order, onerror) | ☐ |
| 11 | No-JS .reveal gate + .js head script | ☐ |
| 12 | Font link in head, @import removed | ☐ |
| 13 | SEO head additions (review-site only) | ☐ |

**Collision watch:** any Claude Design rework of the Why-Subscribe section rewrites
`fm-rebuild.js` — entry #3 MUST survive that rewrite. Same for the cinematic merge and
`fm-pflow.js`'s window.FM guard (#10).
