# Org Repo Migration

**Date:** 2026-06-21
**Performed by:** Claude Code (Stage 3 prep — safe git plumbing only)

## What this is
Landing the current clean FrontM marketing website project into the official
company GitHub account, preserving a clean starting point. This is **not** a
redesign, rebuild, styling migration, or content change.

## Source content
- Claude Design export "Website Design Alpha-handoff" (18 Jun 2026), `deploy/` build,
  reorganized into a standard static-site layout (servable pages + `site/` + `assets/`
  at root; internal docs in `docs/`).
- The prior personal repo `git@github.com:FrontMxChirag/FrontM-Website-Review.git`
  (branches `develop-v2`, `working-files`) is **intentionally abandoned**, per decision
  to "go only with the org repo." Its older history is left intact there as an archive;
  it was deliberately NOT carried into this repo.

## Target
- **Remote:** `git@github.com:frontmltd/frontm-website-revamped.git` (remote name `frontm-org`)
- **Branch:** `main`

## Migration point
- **Branch:** `main`
- **Safety tag:** `pre-org-repo-move`
- **Initial commit:** `0a696f79bc922983f3da44602877f97bf720aa1a`
- **History:** fresh, clean history on the current content (no prior personal-repo
  history carried in — see "Source content").

## Intentionally NOT changed
- No Next.js rebuild, no Tailwind, no CSS refactor.
- No page content, routes, animations, form behaviour, or assets changed.
- No files renamed.

## Push status
⏳ **Pending org access.** The local SSH key authenticates as `FrontMxChirag`, which
currently gets "Repository not found" for `frontmltd/frontm-website-revamped`
(authenticated but not a member/collaborator, or repo path not yet created).
Resolve access, then:
```
git push -u frontm-org main
git push frontm-org --tags
```

## Next expected stage
Next.js 16 / Vercel "lift-and-shell" rebuild (carry CSS + vanilla JS as-is,
plain-anchor nav first), then `/api/lead` (Turnstile → Copper → Resend → audit log → GA4).
