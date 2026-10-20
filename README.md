# linuxify-app — the official Linuxify landing page & release mirror

This repository is the **standalone home of the Linuxify landing page** and the
**public APK release mirror** for the Linuxify Android app. It intentionally
contains **no application source code** — the app's production lives in its own
release cycle at [superz1402/linuxify](https://github.com/superz1402/linuxify).

- **Live site:** https://bilal140202.github.io/linuxify-app/
- **App source & issues:** https://github.com/superz1402/linuxify
- **Latest mirrored APK:** [v0.1.0-alpha.15](https://github.com/Bilal140202/linuxify-app/releases)
  (`linuxify-0.1.0-alpha.15-release.apk`, SHA-256 `bb40ef63c643436f0527cf7e36ac9bbabe2813803b65b9f6dd1d03beb34e4177`)

> Always verify the SHA-256 checksum of any APK you install. The authoritative
> checksum is published with each official release on the main repository.

## What's inside

```
.
├── index.html              Landing page (hero, capabilities, showcase, download, FAQ)
├── about/                  About the developer (Ansari Mohammad Bilal)
├── privacy/                Privacy policy
├── terms/                  Terms of use
├── license/                Licenses & attributions (app, bundled components, site, fonts)
├── changelog/              Full release history with links to official releases
├── 404.html                Terminal-style not-found page
├── assets/
│   ├── css/style.css       Design system (tokens, layout, hero, nav, footer)
│   ├── css/pages.css       Page components (capabilities, download card, legal, about…)
│   ├── js/main.js          Shared interactions (nav, cursor, reveals, accordions, Lenis)
│   ├── js/home.js          Home-only motion (boot preloader, hero reveal, terminal typing)
│   └── img/                favicon, OG image, icons
├── .github/workflows/deploy.yml   GitHub Pages deployment
├── sitemap.xml / robots.txt
└── AGENTS.md               Notes for AI agents working on this repo
```

## Releases

Releases in this repository **mirror** the official app releases from the main
repository. Each mirrored release:

1. Is tagged with the exact same version tag (e.g. `v0.1.0-alpha.15`).
2. Contains the byte-identical APK from the official release (verify against the
   published SHA-256).
3. Carries the official release notes verbatim.

**Production remains on the main cycle:** to update this mirror when a new
version ships, download the APK from the main repo's release and publish it here
with the same tag and notes (see `AGENTS.md` for the exact procedure).

## Design system (for editors)

The visual language is a terminal-native editorial system:

| Token | Value | Role |
|---|---|---|
| `--bg-0` | `#0B0B0C` | Page background |
| `--ink` | `#F4F2ED` | Primary text (warm paper white) |
| `--accent` | `#FF4D00` | The single accent — CTAs, active states, highlights |
| `--term-green` | `#57E389` | Terminal mockups only |
| Display face | Clash Display (Fontshare) | Headlines, uppercase, tight leading |
| Body face | Satoshi (Fontshare) | Paragraphs |
| Mono face | JetBrains Mono (Google) | Annotations, labels, specs |

Rules of the house: sharp corners (2px max), hairline borders
(`rgba(244,242,237,.09)`), one accent color used sparingly, no stock imagery,
no gradients-as-decoration, every animation respects `prefers-reduced-motion`,
and every claim on the page must match the app's documentation.

## Deployment

GitHub Pages deploys automatically from `main` via
`.github/workflows/deploy.yml` (actions/configure-pages + deploy-pages).
No build step — it is a fully static site by design: no cookies, no trackers,
no analytics, no server.

## License

Site code: MIT (see `LICENSE`). Written content & design © Ansari Mohammad Bilal.
The Linuxify app itself: GPL-3.0-or-later, from its own repository.
Component attribution: see the site's [licenses page](https://bilal140202.github.io/linuxify-app/license/).
