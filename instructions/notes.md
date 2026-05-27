# Actor Portfolio Website — Project Brief

## Overview
A professional portfolio website for a full-time actor (3 years of experience) to showcase work,
photographs, videos, and performances. The primary audience is casting directors and agents.
The website must be highly visual, modern, responsive, and easy to navigate.

---

## Reference Websites
- https://rohitranjan8252.wixsite.com/actor
- https://www.robertcaro.org/

Use these as design inspiration. Match the overall feel and structure, while allowing room
for custom textures, colors, and layout adjustments later.

---

## Design Goals
- World-class, modern design aesthetic
- Fully responsive — must look great on both **mobile and desktop**
- Highly visual and attention-grabbing on first glance
- Smooth, elegant animations throughout
- Easy navigation from any point on the page

---

## Site Structure & Sections

### 1. Navigation Bar (Top Ribbon)
- Minimal height — should not dominate the screen
- Contains anchor links to all sections of the page
- Links should have **hover animations** (e.g. underline slide, color fade)
- Should remain **sticky/fixed** so user can navigate from anywhere on the page
- Quick **contact icons** (phone, WhatsApp, Instagram, email) always visible in the nav or
  as a floating button — accessible at all times

### 2. Hero / Landing Section (First Glance)
- Must be **visually striking** — captures user attention immediately
- Includes a **profile picture** with a **short bio**
- Text animations:
  - Words/sentences **fade in slowly**
  - Some text **slides in slightly from top or bottom**
- Should set the tone for the entire website

### 3. Photo Gallery Section
- Display **6 to 8 professional photos** in different styles:
  - Headshot
  - Side view
  - Shoulder length
  - Full length
  - Any other relevant styles
- Layout should feel **modern** (e.g. asymmetric grid, masonry, or horizontal scroll)
- **Live animation on photos**: a red string/line with a round head travelling along the
  perimeter of one or more photos (always running, not on hover)
- Clicking any photo opens it **full screen** (lightbox) on both mobile and desktop
- Each photo must be **downloadable** in three quality options:
  - Small (high compression)
  - Medium (average compression)
  - Large (original/minimal compression)

### 4. Introduction Video Section
- Display a **full introduction/self-tape video**
- Video should be embeddable and playable directly on the page
- Clicking the video opens it in **full screen** on both mobile and desktop
- User can **download the video** in three quality options:
  - Low quality (compressed)
  - Medium quality
  - High quality

### 5. Show Reel Section
- Same structure and functionality as the Introduction Video section
- Separate section clearly labelled as **Show Reel**

### 6. Short Performances Section
- A curated collection of **short performance clips**
- Same playback and download functionality as videos above

### 7. YouTube Performances Section
- Display **all YouTube video links** (approximately 20 videos)
- Show as a **visual grid of thumbnails** with titles
- Clicking a thumbnail opens/plays the YouTube video
- Should feel like a personal YouTube showcase, not just a list of links

---

## Animations & Interactions

| Element | Animation |
|---|---|
| Text (headings, bio) | Fade in on scroll |
| Text (some sections) | Slide in from top or bottom on scroll |
| Nav links (hover) | Smooth color/underline transition |
| Photo perimeter | Red string with round head travelling along edge (always running) |
| Photos (click) | Full screen lightbox |
| Videos (click) | Full screen player |
| Page load | Smooth entrance animation |

All animations should feel **refined and subtle** — not overdone.

---

## Contact Options
Must be accessible at **all times** (sticky nav or floating contact button):
- 📞 Phone
- 💬 WhatsApp
- 📸 Instagram
- 📧 Email

---

## Technical Requirements
- **Responsive design** — mobile first, works perfectly on desktop too
- All photos and videos must support **download in 3 quality options** (small / medium / large)
- Clicking any photo or video goes **full screen** on any device
- Smooth **scroll-based animations** (use a library like AOS or GSAP)
- **Sticky navigation** so user can jump to any section at any time
- Clean, semantic HTML structure for future maintainability

---

## Assets Needed (To Be Added Later)
- [ ] Profile photo (hero section)
- [ ] 6–8 gallery photos (various styles)
- [ ] Introduction video (high quality master file)
- [ ] Show reel video (high quality master file)
- [ ] Short performance clips
- [ ] ~20 YouTube video links
- [ ] Contact details (phone, WhatsApp handle, Instagram handle, email)

---

## Architecture & Development Approach
- **No backend** — keep it purely frontend/static
- All photos and videos will be stored in a local **`/assets`** folder inside the project
- Code should reference files directly from the assets folder — no server, no database, no API
- Structure the assets folder clearly:
  ```
  /assets
    /images        ← all gallery and profile photos
    /videos        ← intro video, show reel, short performances
    /fonts         ← any custom fonts if needed locally
  ```
- This keeps development simple, fast, and easy to maintain

---

## Color Palette
- **Background**: slightly off-white with a very light gray tint
  - Exact value: `#F5F5F5` or `#FAFAFA` (similar to Claude's UI background)
- **Surface / Cards**: `#FFFFFF` pure white for contrast on top of background
- **Primary Text**: `#1A1A1A` (near black, soft on the eyes)
- **Secondary Text**: `#6B6B6B` (medium gray for subtitles, captions)
- **Accent / Highlight**: a single subtle accent color to be decided — start with a soft warm tone
- **Border / Divider**: `#E0E0E0` (very light gray)
- Keep the overall feel **light, clean, and minimal** — no dark backgrounds

---

## Typography
- **Primary Font**: `Bookmania` — start with this, evaluate, and swap if needed
- **Fallback Font**: `Georgia, serif` in case Bookmania doesn't load
- Since fonts are modular (see below), switching fonts later requires changing **one line only**

---

## Modular Design System (Easy to Customise)
All design tokens — colors, fonts, sizes, shapes — must be defined in **one single place**
so any change is instant and global. Use CSS custom properties at the `:root` level:

```css
:root {
  /* Colors */
  --color-bg:         #F5F5F5;
  --color-surface:    #FFFFFF;
  --color-text:       #1A1A1A;
  --color-text-muted: #6B6B6B;
  --color-border:     #E0E0E0;
  --color-accent:     #C9A87C;   /* can be swapped easily */

  /* Typography */
  --font-primary:     'Bookmania', Georgia, serif;
  --font-size-base:   16px;
  --font-size-lg:     1.25rem;
  --font-size-xl:     2rem;
  --font-size-hero:   3.5rem;
  --font-weight-normal: 400;
  --font-weight-bold:   700;
  --line-height:      1.6;

  /* Spacing */
  --spacing-sm:   0.5rem;
  --spacing-md:   1rem;
  --spacing-lg:   2rem;
  --spacing-xl:   4rem;

  /* Shape / Radius */
  --radius-sm:    4px;
  --radius-md:    8px;
  --radius-lg:    16px;
  --radius-full:  9999px;

  /* Transitions */
  --transition-fast:   0.2s ease;
  --transition-normal: 0.4s ease;
  --transition-slow:   0.7s ease;
}
```

> 💡 To change the entire website's font — update `--font-primary` in one place.
> To change the background color — update `--color-bg` in one place.
> Everything else updates automatically.

---

## Notes for Development
- Build as a **single page application (SPA)** with smooth anchor scrolling
- Start with placeholder images and videos — swap with real assets later
- All design tokens live in **one CSS `:root` block** — never hardcode colors or fonts inline
- Prioritise **mobile layout first**, then scale up to desktop
- Keep component styles in **separate CSS blocks per section** for easy editing
