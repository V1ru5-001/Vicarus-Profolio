# Rex Nwogbo — Portfolio

Personal portfolio site. Static HTML, CSS and JavaScript — no build step.

**Live:** not yet deployed

## Structure

```
index.html      markup
styles.css      all styles
main.js         preloader, glitch effects, scroll animations
assets/         favicon, images
vercel.json     headers + caching
```

## Dependencies

Loaded from CDN, no install required:

- [GSAP](https://gsap.com) — animation
- [ScrollTrigger](https://gsap.com/docs/v3/Plugins/ScrollTrigger/) — scroll-linked animation
- [Lenis](https://lenis.darkroom.engineering/) — smooth scrolling

The page degrades gracefully: if any script fails to load, content still renders.

## Running locally

Any static server works:

```bash
python3 -m http.server 8000
# open http://localhost:8000
```

## Deploying

1. Push this repo to GitHub.
2. Import it at [vercel.com/new](https://vercel.com/new).
3. Name the project `vicarus` — Vercel will host it at `vicarus.vercel.app`.
4. No build settings needed; it's static.

After deploying, point the hardcoded URLs at your real domain:

```bash
./set-domain.sh https://vicarus.vercel.app
```

That updates the canonical link, Open Graph tags, `robots.txt` and `sitemap.xml` in one pass.

## Accessibility

- Respects `prefers-reduced-motion` (disables rain, scanlines, glitch)
- Skip-to-content link
- Semantic landmarks, contrast meets WCAG AA
