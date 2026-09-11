# Failory — Design System Reference

## 1. Website Overview

### Design Summary

Failory is a **monochrome, content-first editorial website** built with Next.js and Tailwind CSS v4. The design philosophy is radically minimal: black text on white backgrounds, a single sans-serif typeface (Open Sans), zero decorative gradients, and no brand color beyond pure black. Every design decision prioritises readability and trust for an audience of startup founders.

### Visual Style

| Attribute              | Value                                                        |
| ---------------------- | ------------------------------------------------------------ |
| Overall style          | Clean, editorial, newspaper-like                             |
| Design philosophy      | Content-first, minimal chrome, maximum readability            |
| Target audience        | Startup founders and entrepreneurs                           |
| Tone/personality       | Serious, credible, direct — avoids playfulness               |
| Modern/minimal scale   | **Highly minimal** — near-zero visual decoration             |
| Visual density          | Medium — generous whitespace between sections                |
| Desktop/mobile approach | Responsive, mobile-friendly (hamburger nav below `md`)       |
| Primary UX pattern     | Newsletter-driven conversion (email subscribe CTA everywhere)|
| Distinctive trait      | Pure black-and-white palette with no accent/brand colour     |

### Technology Stack

- **Framework:** Next.js (App Router, React Server Components)
- **CSS:** Tailwind CSS v4 (utility-first, `@layer theme` custom properties)
- **Font loading:** `next/font` with WOFF2 subsets (variable weight 300–800)
- **Hosting:** Vercel

---

## 2. Color System

### Theme Tokens (from Tailwind CSS `@layer theme`)

| Token               | CSS Variable             | HEX / Value                   | Usage                                          |
| -------------------- | ------------------------ | ----------------------------- | ---------------------------------------------- |
| `ink`                | `--color-ink`            | `#000000`                     | Primary text, headings, logo, primary buttons  |
| `ink-2`              | `--color-ink-2`          | `rgba(0,0,0,0.6)` / `#0009`  | Secondary/body text, descriptions               |
| `ink-3`              | `--color-ink-3`          | `#555555`                     | Tertiary text, muted labels                     |
| `paper`              | `--color-paper`          | `#FFFFFF`                     | Primary background (body, header, cards)         |
| `paper-2`            | `--color-paper-2`        | `#FAFAFA`                     | Secondary background (subtle contrast areas)     |
| `line`               | `--color-line`           | `#EFEFEF`                     | Borders, dividers, header border-bottom          |
| `light-black`        | `--color-light-black`    | `#0E0E0E`                     | Dark sections, button hover, footer bg           |
| `soft-green`         | `--color-soft-green`     | `#E7F6EA`                     | Success background (interview type badges)       |
| `strong-green`       | `--color-strong-green`   | `#52C46F`                     | Success text/border                              |
| `soft-red`           | `--color-soft-red`       | `#FFE8EB`                     | Error/failure background (interview type badges) |
| `strong-red`         | `--color-strong-red`     | `#FF6173`                     | Error/failure text/border                        |
| `black`              | `--color-black`          | `#000000`                     | Absolute black                                   |
| `white`              | `--color-white`          | `#FFFFFF`                     | Absolute white                                   |

### Additional Hardcoded Colors (from HTML classes)

| Color          | HEX         | Usage                                                |
| -------------- | ----------- | ---------------------------------------------------- |
| Card border    | `#E5E7EB`   | Testimonial card borders, table borders              |
| Card bg tint   | `#F3F4F6`   | Avatar border on testimonial cards                   |
| Card bg        | `#F9FAFB`   | Avatar fallback background                           |
| Tweet name     | `#111827`   | Testimonial author name                              |
| Tweet text     | `#1F2937`   | Testimonial body text                                |
| Tweet meta     | `#6B7280`   | Testimonial handle, date, like count                 |
| Verified blue  | `#1DA1F2`   | Twitter/X verified checkmark fill                    |
| Input text     | `#333333`   | Form input text color (light theme)                  |
| Placeholder    | `#999999`   | Form input placeholder                               |
| Dark input bg  | `#1A1A1A`   | Form input background (dark sections)                |
| Dark input bdr | `#2D2D2D`   | Form input border (dark sections)                    |
| Dark header bdr| `#202020`   | Header border on dark pages (Graveyard)              |
| Focus ring     | `#3898EC`   | Input focus border color                             |
| Table alt row  | `#F5F5F5`   | Alternating table row backgrounds                    |
| Table border   | `#E5E5E5`   | Data table cell borders                              |

### Color Usage Rules

- **Light pages** (Homepage, Blog, Interviews, Products, Subscribe): white background, black text
- **Dark pages** (Graveyard): black background, white text — header switches to dark variant
- **Dark CTA sections**: `bg-light-black` (#0E0E0E) with white text, appears at bottom of every page
- **Footer**: always `bg-ink` (#000) with `border-t-[3px] border-light-black`
- **No accent/brand color** — the site's identity is entirely monochrome

---

## 3. Typography

### Font Family

```css
--font-sans: var(--font-open-sans), "Open Sans", ui-sans-serif, system-ui, sans-serif;
--font-mono: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace;
```

- **Primary font:** Open Sans (variable, weight 300–800, loaded via `next/font`)
- **Fallback:** Open Sans Fallback (local Arial with adjusted metrics: ascent 101.65%, descent 27.86%, size-adjust 105.15%)
- **Testimonial cards** override to: `-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif`

### Typography Scale

| Element            | Size        | Weight          | Line Height | Usage                                    |
| ------------------ | ----------: | --------------: | ----------: | ---------------------------------------- |
| H1 (hero, desktop) | `60px`      | 800 (extrabold) | `60px`      | Main page title                          |
| H1 (hero, mobile)  | `50px`      | 800 (extrabold) | `50px`      | Main page title on smaller screens       |
| Section H2         | `50px`      | 800 (extrabold) | `60px`      | Section headings ("Latest Issues", etc.) |
| Section H2 (mobile)| `40px`      | 800 (extrabold) | `50px`      | Section headings ≤767px                  |
| H3 (features)      | `30px`      | 800 (extrabold) | `36px`      | Feature/card titles                      |
| H3 (mobile)        | `30px`      | 700 (bold)      | `36px`      | Feature titles ≤767px (weight drops)     |
| H3 (products, md+) | `36px`      | 800 (extrabold) | `44px`      | Product card titles at md+               |
| Body large         | `22px`      | 400 (normal)    | `32px`      | Hero subtitle, page descriptions         |
| Body (article)     | `20px`      | 400 (normal)    | `30px`      | Article body, feature descriptions       |
| Nav links          | `16px`      | 700 (bold)      | `20px`      | Header navigation                        |
| Button text        | `16px`      | 700 (bold)      | `20px`      | All buttons and CTAs                     |
| Card title (issues)| `22px`      | 700 (bold)      | `28px`      | Newsletter issue card title              |
| Card meta          | `16px`      | 400 (normal)    | `20px`      | Date labels, descriptions                |
| Card description   | `16px`      | 400 (normal)    | `22px`      | Issue card subtitle                      |
| Footer heading     | `20px`      | 700 (bold)      | `20px`      | Footer section titles ("Learn", "Other") |
| Footer links       | `16px`      | 400 (normal)    | `20px`      | Footer navigation links                  |
| Logo text          | `20px`      | 800 (extrabold) | `30px`      | "Failory" wordmark next to icon          |
| Tweet author       | `0.9375rem` | 700 (bold)      | `20px`      | Testimonial card author name             |
| Tweet body         | `0.9375rem` | 400 (normal)    | `1.625`     | Testimonial card content                 |
| Tweet meta         | `0.875rem`  | 400 (normal)    | —           | Testimonial handle, date                 |
| Badge text         | `12px`      | 700 (bold)      | `16px`      | Category badges on interview cards       |
| Table header       | `10px`      | 700 (bold)      | `20px`      | Data table column headers (uppercase)    |
| Table cell         | `12-14px`   | 400-700         | `20px`      | Data table content                       |

### Text Colors

| Role              | Token/Class    | Value                    |
| ----------------- | -------------- | ------------------------ |
| Primary text      | `text-ink`     | `#000`                   |
| Secondary text    | `text-ink-2`   | `rgba(0,0,0,0.6)`       |
| Tertiary text     | `text-ink-3`   | `#555`                   |
| Inverted (dark bg)| `text-white`   | `#FFF`                   |
| Muted on dark     | `text-white/60`| `rgba(255,255,255,0.6)`  |
| Muted on dark 2   | `text-white/25`| `rgba(255,255,255,0.25)` |

### Text Transforms

- Table headers: `uppercase` with `letter-spacing: 0.04em`
- Badge text: none (case as-is)
- Navigation: none
- Body: `antialiased` font smoothing globally

---

## 4. Layout System

### Container

```css
.site-container {
  max-width: 1150px;
  margin-left: auto;
  margin-right: auto;
  padding-left: 20px;
  padding-right: 20px;
}

@media (max-width: 479px) {
  .site-container {
    padding-left: 10px;
    padding-right: 10px;
  }
}
```

### Grid System

| Pattern             | Implementation                                              |
| ------------------- | ----------------------------------------------------------- |
| Hero layout         | Flexbox, 58.333% / 41.667% split at ≥992px                 |
| Newsletter cards    | CSS Grid: 3 cols at ≥992px, 2 cols at ≥480px, 1 col below  |
| Feature columns     | CSS Grid: 3 cols at ≥md, 1 col below                       |
| Testimonials        | CSS Multi-column: 3 cols at ≥lg, 2 cols at ≥md, 1 col below|
| Interview directory | CSS Grid: 2 cols at ≥md, 1 col below                       |
| Footer columns      | Flexbox: 41.667% / 58.333% split at ≥md                    |
| Blog articles       | 12-col CSS Grid at ≥md (7-col content + 5-col sidebar)     |
| Products            | Flexbox: row at ≥md, column below (25%/75% image/content)  |

### Spacing Scale (Tailwind `--spacing: 0.25rem`)

| Token      | Value    | Common Usage                           |
| ---------- | -------- | -------------------------------------- |
| `2.5`      | `10px`   | Small gaps, avatar margin              |
| `5`        | `20px`   | Standard section padding, margins      |
| `[15px]`   | `15px`   | Card internal padding-top, gaps        |
| `[25px]`   | `25px`   | Grid gutters between cards             |
| `[30px]`   | `30px`   | Medium section spacing                 |
| `10`       | `40px`   | Desktop section top padding (`pt-10`)  |
| `[50px]`   | `50px`   | Major section separators               |
| `[70px]`   | `70px`   | Footer bottom padding                  |
| `[75px]`   | `75px`   | CTA section top padding                |

### Section Spacing Pattern

- Sections use `pt-5 md:pt-10` (20px / 40px top padding)
- Between major sections: `h-[50px]` spacer div
- `mb-10` on hero wrapper
- CTA dark section: `pt-[75px] pb-[70px]`
- Footer: `py-[50px] max-md:py-[30px]`

---

## 5. Responsive Design

### Breakpoints

| Breakpoint   | Pixel Value | Tailwind Prefix      | Usage                           |
| ------------ | ----------: | -------------------- | ------------------------------- |
| Mobile small | `479px`     | `max-[479px]:`       | Smallest phone adjustments      |
| Mobile       | `480px`     | `min-[480px]:`       | Small-to-medium phone layouts   |
| Tablet small | `767px`     | `max-[767px]:`       | Pre-tablet type scale changes   |
| Tablet       | `768px`     | `md:`                | Major layout shift (2-col grids)|
| Desktop sm   | `991px`     | `max-[991px]:`       | Nav padding adjustments         |
| Desktop      | `992px`     | `min-[992px]:`       | Full desktop layout (3-col)     |
| Desktop lg   | `1024px`    | `lg:`                | 3-col testimonials, sidebars    |

### Key Responsive Changes

- **Navigation:** Full horizontal nav at ≥md, hamburger menu below md
- **Hero:** 2-column at ≥992px (text 58% + newsletter preview 42%), single column below
- **Newsletter preview image:** Hidden below 992px
- **Issue cards grid:** 3→2→1 columns
- **Feature columns:** 3→1 (horizontal icon+text layout on mobile)
- **Testimonials:** 3→2→1 columns (CSS multi-column)
- **H1:** 60px→50px below md
- **Section H2:** 50px→40px below 767px
- **Container padding:** 20px→10px below 479px
- **Header padding:** `py-5` on desktop, `py-0` on mobile (button provides height)

---

## 6. Navigation

### Header Structure

```
<header> — sticky top-0, z-50, border-b, bg-paper
  └── <div> — max-w-[1150px], mx-auto, flex, justify-between
      ├── Logo link — flex, items-center
      │   ├── Logo SVG icon (23×30px, mr-2.5)
      │   └── "Failory" text span
      └── <nav> — flex, items-center
          ├── Nav links (hidden on mobile, px-5 each)
          │   ├── "Interviews"
          │   ├── "Blog"
          │   ├── "Graveyard"
          │   └── "Products"
          ├── "Subscribe →" CTA button (hidden on mobile)
          └── Hamburger button (md:hidden)
```

### Header Specs

| Property         | Light Header                  | Dark Header (Graveyard)       |
| ---------------- | ----------------------------- | ----------------------------- |
| Background       | `bg-paper` (#FFF)             | `bg-black` (#000)             |
| Border bottom    | `border-line` (#EFEFEF)       | `border-[#202020]`            |
| Text color       | `text-ink` (#000)             | `text-white`                  |
| Link hover       | `hover:text-ink-2`            | `hover:text-white/70`         |
| CTA button bg    | `bg-ink` (black)              | `bg-white`                    |
| CTA button text  | `text-white`                  | `text-ink` (black)            |
| CTA hover        | `hover:bg-light-black`        | `hover:bg-white/85`           |
| Position         | `sticky top-0`                | `sticky top-0`                |
| Z-index          | `z-50`                        | `z-50`                        |
| Padding          | `py-5 max-md:py-0`            | `py-5 max-md:py-0`            |
| Content padding  | `pl-5 pr-0 max-md:pr-[2px]`   | `pl-5 pr-0 max-md:pr-[2px]`   |

### Hamburger Menu Button

- Size: `68px × 68px`
- Three bars: `26px × 3px` each, gap `6px`
- Color: matches theme (`bg-ink` or `bg-white`)
- Transition on bars for open/close animation

### Navigation Link Specs

- Font: 16px, bold (700), leading-5
- Horizontal padding: `px-5` (desktop), `px-[15px]` (≤991px)
- Subscribe CTA: `rounded-[5px] px-[15px] py-[9px] mx-5`

---

## 7. Buttons & CTAs

### Primary Button (Subscribe / CTA)

```css
/* Light theme */
background: var(--color-ink);         /* #000 */
color: var(--color-paper);            /* #FFF */
border-radius: 5px;
padding: 17px 30px;
font-size: 16px;
font-weight: 700 (bold);
line-height: 20px;
cursor: pointer;

/* Hover */
background: var(--color-light-black); /* #0E0E0E */

/* Disabled */
opacity: 0.6;
```

### Inverted Button (Dark sections)

```css
background: var(--color-white);       /* #FFF */
color: var(--color-ink);              /* #000 */
border-radius: 5px;
padding: 17px 30px;
font-size: 16px;
font-weight: 700;
line-height: 20px;

/* Hover */
background: rgba(255,255,255,0.9);
```

### Header Nav CTA

```css
border-radius: 5px;
padding: 9px 15px;
font-size: 16px;
font-weight: 700;
line-height: 20px;
```

### Link-Style CTA

- Text: `text-ink`, `font-bold`, `text-[16px]`, `leading-[22px]`
- Arrow suffix: ` →`
- Example: "Go to the Archive →"
- No underline, right-aligned (`float-right`)

### CTA Hierarchy

1. **Primary CTA**: Black filled button with "Subscribe For Free →"
2. **Product CTA**: Black filled button with product-specific text + optional strikethrough price
3. **Text link CTA**: Bold black text with arrow → suffix
4. **Nav CTA**: Smaller black filled button "Subscribe →"

---

## 8. Cards & Containers

### Newsletter Issue Card

```
Structure: <a> block link
├── <img> — full width, no border-radius
└── <div> pt-[15px]
    ├── Date — 16px, text-ink-2, mb-2.5
    ├── Title — 22px bold (24px on mobile), text-ink
    └── Description — 16px, text-ink-2, leading-[22px]

Hover: scale(1.02) transform
```

### Testimonial Card (Twitter/X embed style)

```css
border-radius: var(--radius-xl);      /* 12px */
border: 1px solid #E5E7EB;
background: #FFFFFF;
padding: 24px;                         /* p-6 */
box-shadow: 0 1px 3px rgba(0,0,0,0.1), 0 1px 2px -1px rgba(0,0,0,0.1); /* shadow-sm */
break-inside: avoid;                   /* for masonry columns */
margin-bottom: 24px;                   /* mb-6 */
font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
```

Internal structure:
- Avatar: 48×48px, rounded-full, border `#F3F4F6`, bg `#F9FAFB`
- Author name: 0.9375rem, bold, `#111827` + optional verified SVG
- Handle: sm, `#6B7280`
- X logo: 20×20px, `fill-ink`
- Body: 0.9375rem, `#1F2937`, whitespace-pre-wrap, leading-relaxed
- Post image: rounded-xl, border `#E5E7EB`, full width
- Footer: heart icon + count, bullet, date link

### Product Card

```css
background: rgba(0,0,0,0.04);         /* bg-black/[0.04] */
padding: 40px 15px (mobile) / 50px 30px (desktop);
text-align: center (mobile) / left (desktop);

/* Layout: column on mobile, row on desktop */
/* Image column: 25% width (md), contains product image */
/* Content column: 75% width (md) */

/* Hover */
transform: scale(1.02);
```

### Feature Card (The Failory Way)

```
No border, no shadow, no background
├── Icon — 40×40px
├── H3 — 30px extrabold, text-ink
└── <p> — 20px, text-ink-2, leading-[30px]

Mobile: icon and title on same row (flex)
Desktop: icon above title (block)
```

### Interview Directory Card

- Border: `1px solid #D2D6DC`
- Background: `bg-paper`
- Padding: `20px` (p-5)
- Contains subscribe form variant

### Data Table (`.failory-table`)

```css
border: 1px solid #E5E5E5;
border-radius: 5px;
background: #FFF;
/* Alternating rows: #F5F5F5 */
/* Hover rows: #FAFAFA */
/* Header: 10px uppercase bold, letter-spacing 0.04em */
/* Cell padding: 8px 16px */
```

### Info Table (`.info-table`)

```css
border-collapse: collapse;
font-size: 14px;
/* Row border: 1px solid #EAEAEA */
/* Label: bold, width 180px (max 40%) */
/* Cell padding: 14px 0 */
```

---

## 9. Forms & Inputs

### Email Input (Light Theme)

```css
height: 55px;
width: 100%;
padding: 15px;
border: 2px solid var(--color-ink);    /* #000 */
border-radius: 5px;
background: var(--color-paper);        /* #FFF */
font-size: 16px;
font-weight: 400;
color: #333;
outline: none;

/* Placeholder */
color: #999;

/* Focus */
border-color: #3898EC;
```

### Email Input (Dark Theme)

```css
height: 55px;
border: 2px solid #2D2D2D;
border-radius: 5px;
background: #1A1A1A;
color: #FFF;
font-size: 16px;

/* Placeholder */
color: #999;
```

### Form Layout

- Flex row at ≥480px, column below
- Input takes flex-1, button is `shrink-0 w-auto`
- Gap: `16px` (gap-4) between input and button
- Mobile: input full width with `mb-[10px]`, button full width

---

## 10. Images & Media

### Image Patterns

| Context            | Treatment                                              |
| ------------------ | ------------------------------------------------------ |
| Newsletter cards   | Full width, no border-radius, no shadow                |
| Product images     | `w-[200px]` (mobile) / full width (desktop within 25%) |
| Product shadow     | `1px 1px 8px rgba(0,0,0,0.1)`                         |
| Avatar (hero)      | `60×60px`, `rounded-full`, `object-cover`              |
| Avatar (tweets)    | `48×48px`, `rounded-full`, border `#F3F4F6`            |
| Tweet images       | `rounded-xl`, border `#E5E7EB`, full width             |
| Feature icons      | `40×40px`, loaded lazily                               |
| Interview thumbs   | `150×150px` (from source), `object-cover`              |
| Logo icon          | `23×30px` SVG (black and white variants)               |
| Newsletter preview | `250px` width, hidden below 992px, uses `<picture>`    |

### Image Formats

- Primary: WebP
- Fallback: AVIF (for newsletter preview via `<picture>`)
- External images: Served via Beehiiv CDN and Vercel Blob Storage
- Lazy loading: `loading="lazy"` on below-fold images
- Hero images: `loading="eager"` with `fetchPriority` preloads

---

## 11. Icons

### Icon System

- **No icon library detected** — all icons are inline SVGs
- X/Twitter logo: custom path SVG, `20×20px`, `fill-ink` or `fill-black`
- Heart icon: stroke-based SVG, `18×18px`, `stroke-current stroke-2`, `fill-none`
- Verified badge: filled SVG, `16×16px`, `fill-[#1DA1F2]`
- Feature icons: raster images (WebP), `40×40px` — NOT vector icons
- Hamburger bars: CSS `<span>` elements, `26×3px`, transition-transform
- Arrow in CTAs: text character `→` (not an icon)

---

## 12. Borders, Shadows & Effects

### Border Radius Scale

| Token           | Value    | Usage                                         |
| --------------- | -------- | --------------------------------------------- |
| `rounded-[5px]` | `5px`    | Buttons, inputs, badges, table wrapper         |
| `rounded-xl`    | `12px`   | Testimonial cards, tweet images                |
| `rounded-full`  | `9999px` | Avatars                                        |
| `rounded-[10px]`| `10px`   | Some containers (article embeds)               |
| `rounded-[20px]`| `20px`   | Larger rounded containers                      |

### Shadow Scale

| Token                   | Value                                                     | Usage                  |
| ----------------------- | --------------------------------------------------------- | ---------------------- |
| `shadow-sm`             | `0 1px 3px rgba(0,0,0,0.1), 0 1px 2px -1px rgba(0,0,0,0.1)` | Testimonial cards  |
| Custom product shadow   | `1px 1px 8px rgba(0,0,0,0.1)`                            | Product images         |
| Custom dropdown shadow  | `0 2px 5px rgba(0,0,0,0.2)`                              | Dropdown menus         |

### Border Patterns

| Context         | Border                                |
| --------------- | ------------------------------------- |
| Header          | `border-b border-line` (#EFEFEF)      |
| Footer top      | `border-t-[3px] border-light-black`   |
| Input (light)   | `border-2 border-ink`                 |
| Input (dark)    | `border-2 border-[#2d2d2d]`          |
| Card (tweets)   | `border border-[#e5e7eb]`            |
| Interview card  | `border border-[#d2d6dc]`            |
| Article body blockquote | `border-left: 5px solid #E2E2E2` |
| Table cells     | `border-bottom: 1px solid #E5E5E5`   |

### Effects

- **No gradients** anywhere on the site
- **No glassmorphism** or blur effects
- **No noise/textures**
- **No background images** (beyond content images)
- `antialiased` font smoothing on body
- `transition-transform` on hamburger bars

---

## 13. Motion & Interaction

### Observed Animations

| Element            | Trigger | Effect                   | Duration  | Easing                              |
| ------------------ | ------- | ------------------------ | --------- | ----------------------------------- |
| Card hover         | Hover   | `scale(1.02)`            | `150ms`   | `cubic-bezier(0.4, 0, 0.2, 1)`     |
| Button hover       | Hover   | Background color change  | `150ms`   | Default Tailwind transition         |
| Nav link hover     | Hover   | Text color change        | `150ms`   | Default Tailwind transition         |
| Footer link hover  | Hover   | `text-white/60 → white`  | `150ms`   | Default Tailwind transition         |
| Hamburger bars     | Click   | Rotate ±45° + translate  | `150ms`   | Default Tailwind transition         |
| Table row hover    | Hover   | `background-color`       | `120ms`   | —                                   |

### Default Transition Settings (from Tailwind theme)

```css
--default-transition-duration: 0.15s;
--default-transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
```

### Not Observed

- No page transitions
- No scroll-triggered animations
- No entrance animations
- No parallax effects
- No loading spinners (SSR/SSG pages)

---

## 14. Component Inventory

| Component              | Variants                                  | Location              |
| ---------------------- | ----------------------------------------- | --------------------- |
| **Header**             | Light, Dark                               | All pages             |
| **Mobile Nav**         | Slide-down with hamburger toggle          | All pages (≤md)       |
| **Hero Section**       | 2-column with newsletter form             | Homepage, Subscribe   |
| **Subscribe Form**     | `hero-light`, `hero-dark`, `card-light`   | Multiple locations    |
| **Newsletter Card**    | Image + date + title + description        | Homepage              |
| **Feature Column**     | Icon + title + description                | Homepage, Subscribe   |
| **Testimonial Card**   | Twitter/X embed style (masonry)           | Homepage, Subscribe   |
| **Product Card**       | Image + badge + title + desc + CTA        | Products page         |
| **Interview Card**     | Thumbnail + title + meta + description    | Interviews directory  |
| **Data Table**         | Desktop table / mobile card stack          | Blog articles         |
| **Info Table**         | Label-value pairs                         | Blog articles         |
| **Failory Card**       | Logo + title + badges                     | Article embeds        |
| **Article Body**       | Rich text with custom styles              | Blog posts            |
| **Dark CTA Section**   | Full-width dark bg + heading + form       | Most pages (bottom)   |
| **Footer**             | Logo + desc + 4-column link grid          | All pages             |
| **Badge**              | Category labels with border               | Interview cards       |
| **Exit Intent Popup**  | Modal subscribe form                      | Triggered on intent   |

---

## 15. Page Structure

### Homepage Sections (top to bottom)

1. **Sticky Header** — logo + nav + subscribe CTA
2. **Hero** — H1 + subtitle + subscribe form + founder photo/quote + newsletter preview
3. **Latest Issues** — H2 + 3-column grid of newsletter cards + archive link
4. **The Failory Way** — H2 + 3-column features (Always Free, Actionable Advice, Focus on Failure)
5. **Trusted By +40K Founders** — H2 + masonry testimonial grid
6. **Dark CTA Section** — `bg-light-black`, H2 + subtitle + subscribe form
7. **Footer** — `bg-ink`, logo + desc + link columns

### Blog Page Sections

1. Header
2. H1 "Blog" + description
3. Subscribe card (bordered)
4. Article grid with sidebar
5. Dark CTA section
6. Footer

### Graveyard Page (Dark Theme)

1. **Dark Header** — `bg-black`, white text, `border-[#202020]`
2. Content area — `bg-black`, all text in white
3. Footer — same as other pages

### Common Page Pattern

Every page follows: **Header → Content → Dark CTA Section → Footer**

---

## 16. UX Patterns

- **Newsletter-first conversion:** Subscribe forms appear in hero, sidebar cards, dark CTA sections, and exit-intent popup
- **Arrow CTAs:** All primary CTAs use ` →` suffix for forward motion
- **Social proof:** Twitter/X testimonial masonry wall + "40,000+ founders" counter
- **Content hierarchy:** Large bold H1 → descriptive subtitle → CTA form
- **Founder personal touch:** Nico's photo + italic personal message next to CTA
- **Archive links:** `float-right` "Go to the Archive →" after card grids
- **Dark/light duality:** Light theme by default, full dark variant for Graveyard
- **Progressive disclosure:** Interview directory uses filterable grid with load-more
- **Product pricing:** Strikethrough original price pattern (`$50` → `$25`)

---

## 17. Design Tokens

```css
/* ── Colors ── */
--color-ink: #000;
--color-ink-2: rgba(0, 0, 0, 0.6);
--color-ink-3: #555;
--color-paper: #fff;
--color-paper-2: #fafafa;
--color-line: #efefef;
--color-light-black: #0e0e0e;
--color-soft-green: #e7f6ea;
--color-strong-green: #52c46f;
--color-soft-red: #ffe8eb;
--color-strong-red: #ff6173;

/* ── Typography ── */
--font-sans: "Open Sans", ui-sans-serif, system-ui, sans-serif;
--font-weight-normal: 400;
--font-weight-semibold: 600;
--font-weight-bold: 700;
--font-weight-extrabold: 800;

/* ── Spacing (base = 0.25rem = 4px) ── */
--space-xs: 5px;
--space-sm: 10px;
--space-md: 15px;
--space-lg: 20px;
--space-xl: 25px;
--space-2xl: 30px;
--space-3xl: 40px;
--space-4xl: 50px;
--space-5xl: 70px;
--space-6xl: 75px;

/* ── Border Radius ── */
--radius-sm: 5px;
--radius-md: 10px;
--radius-lg: 12px;    /* Tailwind --radius-xl */
--radius-xl: 20px;
--radius-full: 9999px;

/* ── Shadows ── */
--shadow-sm: 0 1px 3px rgba(0,0,0,0.1), 0 1px 2px -1px rgba(0,0,0,0.1);
--shadow-product: 1px 1px 8px rgba(0,0,0,0.1);

/* ── Container ── */
--container-max: 1150px;
--container-padding: 20px;
--container-padding-mobile: 10px;

/* ── Breakpoints ── */
--bp-mobile: 479px;
--bp-mobile-md: 480px;
--bp-tablet-sm: 767px;
--bp-tablet: 768px;
--bp-desktop-sm: 991px;
--bp-desktop: 992px;
--bp-desktop-lg: 1024px;

/* ── Component Heights ── */
--input-height: 55px;
--header-height-mobile: 68px; /* hamburger button height */
--icon-size-feature: 40px;
--avatar-hero: 60px;
--avatar-tweet: 48px;
--logo-icon-w: 22.8px;
--logo-icon-h: 30px;

/* ── Animation ── */
--duration-fast: 0.12s;
--duration-default: 0.15s;
--duration-medium: 0.2s;
--easing-default: cubic-bezier(0.4, 0, 0.2, 1);
```

---

## 18. Design Rules

1. **Stay monochrome.** The entire palette is black, white, and shades of grey. The only non-grey colours are success green and failure red for content-type badges. Never introduce accent/brand colours.

2. **Use Open Sans everywhere.** The site uses a single font family. Headings are differentiated by size and weight (extrabold 800), not by font change. Testimonial cards exceptionally use system fonts for a native feel.

3. **Respect the 1150px container.** All content sits inside `max-width: 1150px` with `20px` horizontal padding (10px on smallest mobile). Full-bleed sections (dark CTA, footer) extend their backgrounds but constrain content to this width.

4. **Headings are always extrabold black.** H1 at 50–60px, section H2 at 40–50px, H3 at 30–36px. All use `font-weight: 800` and `color: #000` (or `#FFF` on dark backgrounds).

5. **Buttons are black rectangles.** Primary buttons are `bg-ink text-white rounded-[5px]`. On dark backgrounds, buttons invert to `bg-white text-ink`. Hover darkens slightly. No outlines, no ghosts, no gradients.

6. **Cards have minimal decoration.** Testimonial cards get `rounded-xl border shadow-sm`. Newsletter issue cards have no border, no shadow, no radius — just hover scale. Product cards have tinted backgrounds (`bg-black/4%`).

7. **Consistent 5px border-radius** for interactive elements (buttons, inputs, badges, table wrappers). 12px for content cards. Full-round for avatars only.

8. **Every page ends with the dark CTA section + footer.** The dark section uses `bg-light-black` (#0E0E0E) with the subscribe form in its inverted variant. The footer is always `bg-ink` (#000).

9. **Typography hierarchy creates visual structure, not colours or decoration.** Size jumps are large (60→22→20→16→14→12), and weight shifts (800→700→400) carry the hierarchy.

10. **Animations are subtle and functional.** Only hover states have transitions — `scale(1.02)` on cards, background-color shifts on buttons. Default duration: 150ms. No entrance animations, no scroll effects.

---

## 19. DO / DON'T

### ✅ DO

- Use generous whitespace between major sections (50px spacer divs)
- Keep primary CTAs as solid black buttons with ` →` suffix
- Use `text-ink-2` (60% black) for secondary text — never light grey
- Maintain the sticky header with `z-50`
- Use the exact same subscribe form component in multiple contexts
- Show social proof through real embedded tweets in masonry layout
- Keep images full-width within their grid cells (no forced aspect ratios on newsletter cards)
- Use the 58.333% / 41.667% column split for hero layouts
- Include Nico's personal photo/message near the primary CTA for trust
- Use `antialiased` font rendering globally

### ❌ DON'T

- Don't introduce any brand/accent colour — the identity IS black and white
- Don't add border-radius to newsletter issue card images (they are square-edged)
- Don't use a different font — Open Sans is the only typeface
- Don't add box shadows to elements that don't have them (only testimonial cards and product images get shadows)
- Don't make buttons rounded-full or pill-shaped — always `5px` radius
- Don't add entrance animations, parallax, or scroll-triggered effects
- Don't use outlined/ghost buttons — buttons are always filled
- Don't add gradients or background patterns to any section
- Don't use icon libraries — all icons are inline SVGs or text characters (→)
- Don't break the "Header → Content → Dark CTA → Footer" page structure
- Don't use coloured backgrounds for section alternation (only the dark CTA section and footer break from white)
- Don't use `underline` on links by default — only article body links and specific "All-In-One" emphasis use underlines

---

## 20. Final Design Summary

### Design Identity

Failory's visual identity is a **deliberately austere, newspaper-inspired monochrome design** that communicates authority and seriousness about its subject matter (startup failure analysis). The absence of colour forces content to the foreground and creates an unmistakable brand through restraint.

### Core Principles

1. **Monochrome is the brand** — black and white IS the identity
2. **Content over chrome** — zero decorative elements
3. **Trust through simplicity** — the founder's face and real tweets
4. **Consistent conversion pattern** — subscribe forms in every context
5. **Typography carries hierarchy** — size and weight, never colour
6. **Generous breathing room** — large spacers between sections
7. **Responsive but not adaptive** — same design language at every breakpoint
8. **Dark sections for emphasis** — the dark CTA band creates urgency contrast
9. **Functional motion only** — hover states exist, entrance animations don't
10. **Single typeface unity** — Open Sans at all sizes and weights

### Recreation Priority

| Priority | Characteristic                                                    |
| :------: | ----------------------------------------------------------------- |
| **1**    | Black-and-white colour scheme (NO accent colours)                 |
| **2**    | Open Sans typeface with extrabold (800) headings                  |
| **3**    | 1150px container with 20px padding                                |
| **4**    | Solid black buttons with 5px radius and → arrow                  |
| **5**    | Sticky header with logo + nav links + Subscribe CTA               |
| **6**    | Dark CTA section (#0E0E0E) at bottom of every page               |
| **7**    | Dark footer (#000) with 4-column link grid                        |
| **8**    | Hero layout with 58%/42% split and subscribe form                 |
| **9**    | Masonry testimonial wall (Twitter/X card style)                   |
| **10**   | Minimal hover animations (scale 1.02 on cards, bg shift on buttons)|
