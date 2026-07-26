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

Any slot without a `src` shows a dashed placeholder you can click or drag an image
onto. That preview is stored in your browser only (`localStorage`) — it will not
appear for anyone visiting the deployed site. Use `src` for anything real.

Keep images under ~500 KB each; JPG for photos, PNG for UI screenshots.
