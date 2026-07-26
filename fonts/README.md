# fonts/

Currently empty — the site loads Instrument Serif, Instrument Sans, and JetBrains Mono
from Google Fonts (the `<link>` tags in `index.html`).

If you'd rather self-host them (faster, no third-party request, works offline), drop the
`.woff2` files here and replace the Google Fonts `<link>` in `index.html` with `@font-face`
rules at the top of `css/style.css`:

```css
@font-face {
  font-family: "Instrument Serif";
  src: url("../fonts/InstrumentSerif-Regular.woff2") format("woff2");
  font-weight: 400;
  font-display: swap;
}
```

Note the `../fonts/` — paths in `style.css` are relative to the `css/` folder.
