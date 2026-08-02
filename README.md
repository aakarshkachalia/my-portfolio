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

## Who can change what

Everything on this site is a static file. There is no database, no admin panel,
and no upload endpoint — a visitor's browser can only read what you published, so
there is nothing for anyone to change. Editing the site means editing these files
and pushing.

The image slots have a drop-an-image affordance for mocking things up. It's hidden
from visitors and only appears in **edit mode**: automatically on localhost or when
opening the file directly, and on the live site by adding `?edit` to the URL. Even
then, a dropped image is stored only in that one browser (`localStorage`) and is
labelled "not published". Real images ship as files in `img/`.

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
