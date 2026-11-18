# solidebytes

Portfolio site for SolideBytes, an independent app & game studio.

Plain HTML, CSS and JavaScript — no build step.

| File | What it holds |
| --- | --- |
| `index.html` | All page content. Each project is one `<article class="slide">` in the **Selected work** section. |
| `styles.css` | Design tokens at the top (colors, type, motion), then one block per section. |
| `script.js` | The flipping byte in the hero, the scroll-driven project slider, and the small animations. |

## Edit your projects

In `index.html`, find `<!-- Slide 1 · App -->` and change the name, text, role and year.
`data-tint="#2B59F0"` sets the background tint while that slide is on screen.
Add or remove `<article class="slide">` blocks; the slider counts them automatically.

## Run locally

Open `index.html` in a browser, or run `python3 -m http.server` in this folder and visit http://localhost:8000.

## Publish on GitHub Pages

Repository **Settings → Pages → Build and deployment → Deploy from a branch**, choose `main` and `/ (root)`.
The site appears at `https://soukkarr.github.io/solidebytes/`.

## Legal pages and the Apple Developer Program

| Page | Use it for |
| --- | --- |
| `privacy.html` | **Privacy Policy URL** in App Store Connect (App Privacy), Google Play's privacy policy field, and the Privacy Policy link inside each app (Settings screen and paywall). |
| `support.html` | **Support URL** in App Store Connect (version information). `support.html#delete-account` is the account-deletion web link Google Play asks for. |
| `terms.html` | Terms of Use. Apps with subscriptions must link Terms of Use (EULA) in the app and in the App Store description. |
| `index.html` | **Marketing URL** (optional). |

When an app launches, add a row for it to the "App by app" table in `privacy.html` (there's a comment showing the format). Keep that row, the app's App Store privacy label and its privacy manifest in agreement.

For apps with auto-renewing subscriptions, end the App Store description with:

```
Terms of Use (EULA): https://www.apple.com/legal/internet-services/itunes/dev/stdeula/
Privacy Policy: https://soukkarr.github.io/solidebytes/privacy.html
```

These pages are a starting point written in plain English, not legal advice. Have them checked if your apps handle sensitive data, are made for children, or use advertising SDKs.

## Accessibility

- Follows the system light/dark setting.
- With **Reduce Motion** on, the auto-flipping byte and pinned slider turn off; projects become a swipe carousel.
- Every control is keyboard reachable; arrow keys move between projects.
