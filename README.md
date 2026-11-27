# Counter-Strike Stats

A browser extension that shows Counter-Strike stats from csstats.gg, FACEIT and Leetify directly on Steam profiles. It is a single Manifest V3 code base for every supported browser, written in vanilla JavaScript with no dependencies.

## Features

Open any Steam profile (`steamcommunity.com/id/*` or `steamcommunity.com/profiles/*`) and the extension adds these sections at the top of the profile:

- **CSSTATS.GG**: wins and current and best Premier rating for every season (the 3 most recent are shown, the rest with "Show all"), plus the last and best CS:GO competitive rank and CS:GO matchmaking wins.
- **FACEIT**: level, ELO, K/D, win rate, headshot percentage and matches for CS2 and CS:GO, with a warning if the account is banned. The CS2 stats leave out the CS:GO history that FACEIT migrated into CS2.
- **LEETIFY**: Aim Rating, time to damage, crosshair placement, K/D, headshot kill percentage, Utility Rating, win rate, accuracy on spotted enemies, spray accuracy and counter-strafing. Each value is colored by how far it is from the average player, and shows the average value on hover when Leetify provides it.
- **ACCOUNT STATS**: Steam account creation date (from the Years of Service badge), FACEIT account creation date, and the number of days between them.

Every section has a link to the player's page on the source site. Sections with stats for both CS2 and CS:GO have a toggle to switch between them, and a button that copies the stats shown to the clipboard. If a source has no data for the player, the section says so instead of showing empty values.

### Why csstats.gg no longer shows K/D, HS% or ADR

csstats.gg serves those stats from an endpoint (`/player/{id}/stats`) behind a Cloudflare challenge, which a browser extension cannot pass. Only the public profile page can be read, so the section shows the rank information found there. FACEIT and Leetify cover K/D, win rate and the other performance stats.

## Installation

### From the stores

- Chromium-based browsers (Chrome, Edge, Brave, Opera…): [Chrome Web Store](https://chromewebstore.google.com/detail/nklafihgaifhoahbfcfiaemfmpoplkch)
- Firefox: [Firefox Add-ons](https://addons.mozilla.org/firefox/addon/2947359/)

### Unpacked (development)

1. Clone the repository:

   ```bash
   git clone https://github.com/jagobainda/CounterStrikeStatsExtension.git
   ```

2. Load it in your browser:
   - **Chromium-based browsers** (121 or later): open `chrome://extensions/`, enable "Developer mode", click "Load unpacked" and select the project folder.
   - **Firefox** (140 or later): open `about:debugging#/runtime/this-firefox`, click "Load Temporary Add-on…" and select `manifest.json`.

## Permissions

| Permission                                                             | Why                                                                            |
| ---------------------------------------------------------------------- | ------------------------------------------------------------------------------ |
| Content scripts on `https://steamcommunity.com/id/*` and `/profiles/*` | Read the profile's SteamID64 and show the stats on the page.                   |
| `https://steamcommunity.com/*`                                         | Read the account creation date from the profile's Years of Service badge page. |
| `https://csstats.gg/*`                                                 | Read the player's public csstats.gg page, which has no API or CORS support.    |
| `https://open.faceit.com/*`                                            | Query the FACEIT Data API.                                                     |

Leetify's public API allows cross-origin requests, so it needs no extra permission.

All network requests are made by the background script, which only accepts a valid SteamID64 and a known data source. Responses are kept in memory for 5 minutes. Nothing is stored and there is no server of our own. The only data sent to third parties is the SteamID64 of the profile you are viewing, which goes to Steam, csstats.gg, FACEIT and Leetify. The manifest declares this as `browsingActivity` in `data_collection_permissions`.

### About the `cswatch@jagoba.dev` id

The manifest keeps the Gecko id `cswatch@jagoba.dev` from the extension's previous name. Firefox Add-ons identifies a listing by this id, so changing it would create a new listing, and existing users would stop getting updates.

## Project structure

```
├── manifest.json                    # Single Manifest V3 for every browser
├── build.bat                        # Builds counter-strike-stats-<version>.zip
├── imgs/                            # Icons, source logos and rank images
├── src/
│   ├── popup.html                   # Popup skeleton
│   ├── scripts/
│   │   ├── service-worker.js        # Background (ES module): fetches, parses and caches data
│   │   ├── http.js                  # Shared fetch helper with timeout and error codes
│   │   ├── faceit.js                # FACEIT Data API lookup and mapping
│   │   ├── leetify.js               # Leetify summary mapping
│   │   ├── parsers/                 # Pure parsers used by the background and the tests
│   │   ├── content.js               # Entry point on Steam profiles
│   │   ├── popup.js                 # Popup content
│   │   ├── sections/                # One file per section (build, load and render)
│   │   └── utils/                   # DOM helper, section pattern, messaging and constants
│   └── styles/                      # Content (scoped under #css-root) and popup styles
├── tests/                           # node:test suites and real response fixtures
└── .github/                         # CI workflow and Dependabot
```

The interface is built from JavaScript with a small `el(tag, props, ...children)` helper. External data is only ever inserted as text.

## Development

You need Node.js 24. The extension itself has no dependencies; npm only installs the development tools ([Prettier](https://prettier.io/) and [web-ext](https://github.com/mozilla/web-ext)):

```bash
npm ci
npm run format        # Format every file with Prettier
npm run format:check  # Check the formatting without changing files
npm test              # node:test suites, run against real responses saved in tests/fixtures/
npm run lint          # Lint the extension with web-ext
```

The CI workflow (`.github/workflows/ci.yml`) runs the formatting check, the tests and the lint on every pull request and on every push to `main`. Dependabot keeps the development tools and the GitHub Actions up to date.

## Build

On Windows, run `build.bat`. It copies the extension files (skipping everything listed in `.buildignore`, including the tests) and creates `counter-strike-stats-<version>.zip` with `tar`. The same zip can be uploaded to both stores.

## License

This project is under the MIT license. See the [LICENSE](LICENSE) file for more details.

## Disclaimer

This extension is not affiliated with Valve Corporation, Steam, FACEIT, Leetify or csstats.gg. It is an independent community project.
