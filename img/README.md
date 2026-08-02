# img/

Drop your photos and project screenshots in this folder, then point the page at them.

## Your portrait (hero section)

In `index.html`, find the `<image-slot id="bk-portrait" ...>` tag and add a `src`:

```html
<image-slot id="bk-portrait" src="img/portrait.jpg" shape="rect" fit="cover" placeholder="Drop your photo"></image-slot>
```

## Project screenshots (case-study modals)

In `js/main.js`, each entry in the `PROJECTS` array can take an `img` key:

```js
{ num:"01", title:"MathFlow", kind:"FBLA Website Design", year:"2025",
  img:"img/mathflow.png",
  ... }
```

## No file yet?

A slot with no `src` is empty for visitors — a plain panel, nothing to click.

In **edit mode** that same slot becomes a dashed drop target you can click or drag
an image onto, for quick mockups. Edit mode turns on automatically when you open
the file directly or serve it from localhost, and on the live site by adding
`?edit` to the URL:

```
https://your-site.pages.dev/?edit
```

A dropped image is written to your own browser's `localStorage` and marked
"local preview — not published". It is never uploaded anywhere and no other
visitor can see it. Only a committed file in `img/` referenced by `src` shows up
for real.

Keep images under ~500 KB each; JPG for photos, PNG for UI screenshots.
