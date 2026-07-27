# my-portfolio

Aakarsh Kachalia — personal site. Plain HTML, CSS, and JavaScript. No build step,
no dependencies to install.

```
my-portfolio/
├── index.html      ← entry point (Cloudflare Pages serves this)
├── css/
│   └── style.css
├── js/
│   └── main.js
├── img/            ← your photos and project screenshots
└── fonts/          ← optional self-hosted font files
```

## Editing

| What | Where |
| --- | --- |
| Case studies (title, blurb, problem/approach/outcome, links) | `PROJECTS` array at the top of `js/main.js` |
| Page copy — about, awards, experience, community, programs, contact | `index.html` |
| Colours, type, spacing | `:root` variables at the top of `css/style.css` |
| Images | see `img/README.md` |

Dark mode is the `html[data-th="dark"]` block in `style.css`; the moon/sun button in
the nav toggles it.

## Running it locally

Open `index.html` in a browser, or serve the folder:

```
python3 -m http.server 4567
```

then visit http://localhost:4567

## Deploying to Cloudflare Pages

Push this folder to a GitHub repo, then in Cloudflare Pages → Create a project →
Connect to Git:

- **Framework preset:** None
- **Build command:** *(leave empty)*
- **Build output directory:** `/` — or `my-portfolio` if this folder sits inside a
  larger repo

Cloudflare serves `index.html` at the root automatically. Every push to `main`
redeploys.

## Page order

`01` Work · `02` About · `03` By the numbers · `04` Five worlds · `05` Awards ·
`06` Skills · `07` Experience · `08` Community & service · `09` Programs &
certifications · `10` Contact

## Still to add

- `resume.pdf` in this folder — the "Résumé ↓" buttons link to `./resume.pdf`
- Real project links — every `href:"#"` in `PROJECTS`, especially the Spotify and
  Apple Podcasts links for *AI for Young Minds* and the SolveFire link
- Real screenshots in `img/`
- Dates worth double-checking: the community/programs sections use the years given
  for each program — fix any that are off
