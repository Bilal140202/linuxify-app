# AGENTS.md — working on the linuxify-app site

This document tells any future agent (human or AI) how to work in this
repository without breaking its design system or its honesty guarantees.

## Ground truth (do not drift from these facts)

- App: `com.linuxify.app` — native Android, Kotlin + Jetpack Compose.
- Production repository: `https://github.com/superz1402/linuxify` (main cycle — never move it here).
- Userspace: Ubuntu 24.04.5 LTS (noble), `ubuntu-base-24.04.5-base-arm64.tar.gz`, checksum-pinned.
- Runtime: proot 5.1.107.96 (Termux build) + libtalloc 2.5.0 + libandroid-shmem 0.7 + Termux PTY JNI (termux-app v0.118.0 stack), all SHA-256-pinned, all vendored.
- Terminal: vendored Termux terminal-emulator / terminal-view (GPLv3).
- Requirements: Android 8.0+ (API 26), arm64 primary. targetSdk 28 is deliberate (documented in the app repo).
- Latest mirrored release: v0.1.0-alpha.15 — APK 12,568,978 bytes — SHA-256 `bb40ef63c643436f0527cf7e36ac9bbabe2813803b65b9f6dd1d03beb34e4177` — published 2026-10-19.
- Developer: Ansari Mohammad Bilal — site https://ansaribilal.com — GitHub @Bilal140202.

## When a new app release ships

1. Download the APK from `https://github.com/superz1402/linuxify/releases/tag/<TAG>`.
2. Verify its SHA-256 against the checksum in that release's notes.
3. Create a release in THIS repo with the identical tag, the verbatim release
   notes, and the APK as the only asset:
   ```
   gh release create <TAG> linuxify-<version>-release.apk \
     --title "<official release title>" --notes "<verbatim notes>"
   ```
4. Update version strings in: `index.html` (eyebrow, download card, footer),
   all subpage footers, `404.html`, `sitemap.xml` lastmod, and this file.
5. Update the hero terminal boot-log version in `assets/js/home.js` (BOOT array).
6. Update the changelog page (`changelog/index.html`) with a new `<article class="rel">`.

## Design rules (do not break these)

- Tokens live in `assets/css/style.css` under `:root`. Never hardcode colors in
  components; add a token if you need a new one.
- One accent (`#FF4D00`). Terminal green lives inside terminal mockups only.
- Type: Clash Display (display), Satoshi (body), JetBrains Mono (mono). Loaded
  from Fontshare + Google Fonts CDNs. Do not introduce new typefaces.
- Sharp corners; hairline rules; no gradients-as-decoration; no stock photos.
- Every interactive element must work with keyboard and screen readers
  (aria-expanded on accordions, skip link, focus-visible styles).
- Every animation must have a `prefers-reduced-motion` path. JS checks
  `prefersReduced` at start; CSS has a global reduced-motion block.
- Motion stack: GSAP 3.12.5 + ScrollTrigger + Lenis 1.1.18 from CDNs, all
  optional — if they fail to load the page must remain fully readable (the JS
  guards for this; keep those guards).

## Honesty rules (project invariant)

- Never claim a feature that is not documented in the main repository.
- Never present the stylized terminal mockups as real screenshots (the caption
  "Stylized recreation… not a screenshot" must stay).
- Distinguish build-verified / host-verified / device-verified claims if you
  ever write about verification.
- Privacy policy and terms must be versioned (top of page) and dated on change.

## Deployment

Push to `main` → `.github/workflows/deploy.yml` deploys to GitHub Pages
(https://bilal140202.github.io/linuxify-app/). No build step exists; do not add
one without updating the workflow and this file. `.nojekyll` is present on
purpose — keep it.
