# Fatma Kassim Abdulla Professional Portfolio

A complete static website based on Fatma's supplied CV and the cream, dark forest green and warm gold reference design. All professional facts come from her CV. The redesigned CV is included as a downloadable PDF. Plain HTML, CSS and vanilla JavaScript — no framework, no build step, no backend.

## Quick start

### Option 1 — no install (open the file)

Open `index.html` directly in a browser.

### Option 2 — npm (recommended)

Requires Node.js (which includes npm).

```bash
npm install      # installs one lightweight dev dependency (http-server)
npm run dev      # serves the site and opens http://localhost:4310
```

Other scripts:

```bash
npm run preview  # serves the site without opening a browser, on http://localhost:4311
npm start        # same as npm run dev
```

If port 4310 or 4311 is already in use on your machine, edit the port in the `scripts` block of `package.json`.

### Option 3 — any static server

```bash
python3 -m http.server 8082
# then open http://localhost:8082
```

## Files

- `index.html`: professional text and page sections.
- `style.css`: responsive styling, gold portrait arch, flip-card design and motion.
- `app.js`: role tabs, keyboard navigation, word animation, flip cards, scroll reveals, lifecycle handling and copy email.
- `assets/fatma-cutout.png`: portrait with transparent background.
- `assets/Fatma-Kassim-Abdulla-CV.pdf`: the redesigned CV (the download target).
- `references/Fatma-Kassim-Abdulla-CV-original.pdf`: the original supplied CV, preserved.
- `references/fatma-original.jpeg`: original unedited portrait.
- `references/design-reference.png`: visual reference only.
- `package.json` / `package-lock.json`: npm metadata and lockfile.
- `OPENCODE-HANDOFF.md`: continuation brief and validation requirements.

## Interactions and motion

- **Hero entrance:** portrait, name, introduction and buttons fade and rise in gently. It replays on page load, on refresh, and when the page is restored from the browser's Back/Forward cache.
- **Rotating professional words:** OPERATIONS / FINANCE / COMMUNITY slide vertically inside a fixed-width slot, so surrounding content never moves. The rotation pauses when the browser tab is hidden and resumes cleanly when the visitor returns. The slot is re-measured on resize.
- **Scroll reveals:** headings, experience, expertise and education animate in once when they enter the viewport, and **replay** after they have left the viewport by a comfortable margin (150px of hysteresis) and come back, so small scroll movements do not repeatedly trigger them. Reveals are enabled only when JavaScript runs, so content is always visible without it.
- **Flip cards:** the three approach cards flip only when the visitor clicks, taps, or presses Enter/Space. They never flip on their own, including while scrolling past.
- **Experience tabs:** roles cross-fade while the panel height animates smoothly. Full keyboard support (arrow keys, Home, End).
- **Micro-interactions:** navigation links, buttons, contact links, the WhatsApp link and CV controls have hover, focus and pressed states with subtle gold accents and arrow movement.
- **WhatsApp:** the Contact section has a labelled "Chat on WhatsApp" link to `https://wa.me/255657595304`, opened in a new tab with `rel="noopener noreferrer"`.

Motion uses only CSS transforms, opacity and IntersectionObserver. `prefers-reduced-motion: reduce` shows all content immediately, disables the word rotation and the hero/scroll animation, and switches flip cards without 3D rotation.

## Content updates

Update experience dates and responsibilities in `app.js`, with the default Jumbi content also in `index.html`. Replace `assets/Fatma-Kassim-Abdulla-CV.pdf` if the CV changes, and keep the previous version in `references/`. Do not invent quantitative achievements, awards, client projects, software skills, social accounts or testimonials.
