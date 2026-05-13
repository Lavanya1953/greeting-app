# Technical Approach Document

**Project:** Custom Greetings & Wishes App  
**Purpose:** Personalized greeting cards with the user’s display name and profile photo composited over template artwork, with export/share as a single PNG.

---

## 1. Problem-solving approach: image overlay logic

The product requirement is to show **template background + user identity** as one coherent card, both on screen and when flattened for sharing. The solution uses **DOM composition**, not a separate canvas editor for the live preview.

### 1.1 Layered layout (live preview)

The card is a single React component (`GreetingCardPreview`) with a **fixed aspect ratio** (3:4) and `position: relative` on the root. Content is stacked with absolute positioning:

1. **Background layer** — A full-bleed `<img>` for the template (`object-cover`), with `crossOrigin="anonymous"` so the browser may load it in a CORS-safe way when same-origin or CORS-enabled CDN rules allow it.
2. **Readability layer** — A gradient overlay (`from-black/80` upward) so text and the avatar remain legible on busy backgrounds.
3. **Identity overlay** — An absolutely positioned footer region (`bottom-0`, centered column) containing:
   - A circular **avatar** (user photo or initial letter on a solid fallback when no photo).
   - The **display name** with responsive typography controlled by props (`compact` for thumbnails vs `prominentOverlay` for the preview modal and template strip).

This mirrors how many marketing sites build “cards”: it stays accessible to CSS, responsive, and easy to reason about compared to drawing everything on `<canvas>` for every frame.

### 1.2 From preview to shareable PNG

Sharing does not reimplement the layout in canvas code. Instead:

1. A `ref` targets the same DOM subtree as the visible card (`TemplatePreviewModal` passes `ref` into `GreetingCardPreview`).
2. **`requestAnimationFrame` is awaited twice** before capture so layout and fonts have settled after the modal opens.
3. **`html2canvas`** rasterizes that element to a bitmap, with `scale: 2` for sharper output and a dark `backgroundColor` fallback.
4. The canvas is converted to a **PNG blob** (`canvas.toBlob`), then either the **Web Share API** (`navigator.share` with a `File`) or a **programmatic download** if sharing is unavailable or the user dismisses the sheet.

### 1.3 Export safety and CORS

Rasterizing DOM that includes cross-origin images can **taint** the canvas, after which `toBlob` fails. The capture utility (`captureShare.ts`) uses `html2canvas`’s **`onclone`** hook to walk cloned `<img>` nodes:

- If an image URL is cross-origin HTTP(S), the clone is adjusted so the exported canvas stays usable: foreign images that are not part of a specially marked avatar slot can be replaced with a **1×1 transparent data URL**, and the utility supports an optional **`[data-capture-avatar]`** path to swap a problematic avatar bitmap for an **initial letter** using cloned DOM (same visual idea as the live preview fallback).
- Capture first runs with **`useCORS: true`** and **`allowTaint: false`**; on failure it **retries** with a more permissive configuration so edge-case content still produces an image when possible.

Together, this keeps **one source of truth** for layout (the React tree) while handling real-world image hosting constraints at export time.

---

## 2. Tech stack

| Area | Choice |
|------|--------|
| Language | TypeScript |
| UI library | React 18 |
| Build / dev server | Vite 5 |
| Styling | Tailwind CSS 3, PostCSS, Autoprefixer |
| Routing | React Router 6 |
| DOM-to-image | html2canvas |
| Icons | lucide-react |

**Runtime dependencies:** `react`, `react-dom`, `react-router-dom`, `html2canvas`, `lucide-react`.  
**Dev tooling:** `@vitejs/plugin-react`, `typescript`, `tailwindcss`, `postcss`, `autoprefixer`, React type packages.

Template images are referenced as versioned URLs built from `import.meta.env.BASE_URL` so assets work under configurable deploy paths.

---

## 3. Challenges and mitigations

| Challenge | Mitigation |
|-----------|------------|
| **Canvas taint from cross-origin images** | `crossOrigin="anonymous"` on template and avatar `<img>` where applicable; clone-time sanitization in `onclone` to strip or replace problematic sources before `toBlob`. |
| **html2canvas strict mode failures** | Try strict CORS settings first; catch errors and retry with `allowTaint: true` so users still get a file when the environment allows it. |
| **Share API inconsistency** | Use `navigator.share` with files when present; catch non-abort errors and fall back to **download**. Treat user cancel (`AbortError`) as success. |
| **Timing / blank capture after modal open** | Double `requestAnimationFrame` delay before reading the ref and invoking html2canvas so paint and fonts are stable. |
| **Variable template density** | Same overlay component with prop-driven type scale (`compact` vs `prominentOverlay`) so grid, strip, and modal stay visually consistent without duplicating markup. |

---

## 4. Future improvements and scalability

- **Server-side rendering** — For guaranteed pixel-perfect exports and no CORS taint, render final cards on the server (e.g. headless Chromium or an image service) using the same data model (template ID, name, photo URL). The client could keep the current path for instant preview and use the server for high-fidelity or social-meta images.
- **Asset pipeline** — Host all template and user images behind a **CDN with explicit CORS** headers and cache keys; optionally proxy user uploads through the app origin to simplify canvas export.
- **Performance** — Cache html2canvas output per `(templateId, name hash, photo hash)` for repeat shares; lower `scale` on low-end devices; consider `OffscreenCanvas` or WASM compositors if animation or video cards are added later.
- **Product scale** — Move templates from a static array to a CMS or API; add pagination/virtualization for large catalogs; internationalize strings and RTL layout for name/avatar placement.
- **Accessibility** — Richer `alt` text for template art where licensing allows; ensure share/download actions remain keyboard-operable and announced to assistive tech when the modal opens.

---

*This document describes the implementation in this repository as of the delivery date.*
