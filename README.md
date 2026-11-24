# Bitstraining website

React + Vite marketing and docs site for [bitstraining](https://pypi.org/project/bitstraining/)
([GitHub](https://github.com/Sudharsansm/bitstraining)). Same stack, layout and design system as the Bitsopay site
(sky / teal / navy + amber), hash routing, responsive nav, light/dark/system theme.

Pages: Home (with a run.yaml builder) · How it works · Features · Compute · Quickstart · Docs (13 pages).

## Run

```bash
npm install
npm run dev        # http://localhost:5173
npm run build && npm run preview
```

## Where things live

- `src/data.js` — all content. Edit here when bitstraining changes; bump `VERSION` on release.
- `src/styles.css` — design tokens and styles.
- `src/components.jsx` — logo, code blocks, pipeline diagram.
- `src/pages/*.jsx` — one file per page. `src/App.jsx` — nav, theme, routing.

Content comes only from the PyPI page and GitHub README (v0.1.0), including the project's own status caveats.
Deploying to Vercel: framework preset "Vite", build `npm run build`, output `dist`.
