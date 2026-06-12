# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a **static portfolio website** for Yoni Alloun, a Data Analyst, deployed via GitHub Pages at `https://allouny98-cyber.github.io/`. It is built on the [Solid State template by HTML5 UP](https://html5up.net/solid-state). The site showcases three end-to-end analytics projects built on a single VideoGamesDB dataset, demonstrating SQL, Python, and Power BI skills.

There is no build step, no package manager, and no server-side code. All assets are pre-compiled and served directly as static files.

## Development Workflow

**Local preview** — open `index.html` directly in a browser, or use any static file server:
```bash
python3 -m http.server 8080
# then visit http://localhost:8080
```

**SASS → CSS** — SASS sources live in `assets/sass/`. The compiled output is `assets/css/main.css`. If you modify SASS you must recompile manually (the repo has no npm scripts or CI to do this automatically). The SASS entry point is `assets/sass/main.scss`. Alternatively, edit `assets/css/main.css` directly for small tweaks — both approaches are valid since there is no automated pipeline.

There are no tests, no linter, and no CI/CD pipeline.

## Architecture

### Content
All visible portfolio content lives in **`index.html`** (the only page that matters). `generic.html` and `elements.html` are unused template scaffolding from HTML5 UP and can be ignored.

### Styling — two layers
1. **`assets/css/main.css`** — compiled from SASS; controls the Solid State template's layout, components, and responsive breakpoints.  
2. **Inline `<style>` block inside `index.html`** — all custom/personal overrides (accent palette, gradient, card hover effects, hero badges, gallery grid, fade-up animations). This is the primary place to make visual changes without touching the SASS pipeline.

The accent palette is defined as CSS custom properties at the top of the inline block:
```css
--accent: #2dd4bf;
--accent-2: #0ea5e9;
```

### JavaScript
**`assets/js/main.js`** is the only custom JS file (145 lines). It handles: responsive breakpoints, header scroll-state transitions, mobile menu toggle (with keyboard/ESC support), and page-load fade-up animation. All other JS files are unmodified third-party libraries (jQuery, scrollex, browser utilities).

### SASS structure (`assets/sass/`)
```
libs/        ← variables, mixins, breakpoints (edit variables here for global changes)
base/        ← reset, page defaults, typography
components/  ← buttons, forms, icons, tables, feature cards, etc.
layout/      ← header, banner, menu, footer, wrapper
```

### Images
`images/` contains: `bg.jpg` (hero background), `pic01–pic08.jpg` (project/gallery images), and SVG icons for projects and skills (`project-*.svg`, `skill-*.svg`).

## Key Conventions

- **All substantive edits happen in `index.html`** — layout, text, project descriptions, links, and quick style changes all live there.
- Custom styles go in the **inline `<style>` block in `index.html`**, not in `main.css`, unless you are working with the SASS pipeline.
- External GitHub project links point to repositories under `github.com/allouny98-cyber`.
- Font Awesome icons use `aria-hidden="true"` on the `<i>` element consistently.
- The site uses semantic HTML5 sections (`<section>`, `<article>`, `<header>`, `<footer>`).
- Google Fonts (Raleway, Source Sans Pro) are loaded via `<link>` in the `<head>`.

## Deployment

Pushing to `main` automatically publishes via GitHub Pages — no additional deploy step needed.
