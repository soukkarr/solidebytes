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

## Accessibility

- Follows the system light/dark setting.
- With **Reduce Motion** on, the auto-flipping byte and pinned slider turn off; projects become a swipe carousel.
- Every control is keyboard reachable; arrow keys move between projects.
