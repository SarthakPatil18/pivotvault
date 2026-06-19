# PivotVault Design System

## Design Audit

The frontend already had a recognizable black-and-gold identity and broad use of semantic names such as `bg`, `surface`, `border`, and `accent`. The main consistency problems were:

- Two incompatible theme mechanisms: `data-theme="blue|beige"` and legacy `.dark` classes.
- Hard-coded Slate, Indigo, Orange, white, and framework palette values in shared controls.
- Duplicate font loading and a mismatch between the configured body font and the font loaded by the document.
- Repeated one-off button, card, form, and navigation styles.
- No shared focus-ring, disabled, hover, or reduced-motion behavior.
- Radius and shadow values were named but did not form a complete elevation system.
- Tables had no shared density, header, row, or overflow treatment.

No page layout, route, or business flow is changed by the design-system foundation.

## Principles

- **Clarity:** quiet borders, explicit hierarchy, predictable interaction states.
- **Polish:** restrained motion, optical spacing, consistent elevation and focus.
- **Density:** compact controls and tabular numeric typography for analytical views.
- **Identity:** warm professional light surfaces; black, graphite, and gold in dark mode.

## Tokens

Tokens live in `src/index.css` and are exposed to Tailwind in `tailwind.config.js`.

### Color

Use semantic utilities rather than framework colors:

- Surfaces: `bg-bg`, `bg-surface`, `bg-surface-2`, `bg-surface-3`
- Borders: `border-border`, `border-border-strong`
- Brand: `accent`, `accent-2`, `accent-contrast`
- Content: `text-primary`, `text-secondary`, `text-muted`
- Status: `info`, `success`, `warning`, `danger`

### Spacing

The base scale is Tailwind's 4px scale. Use `gap-1` through `gap-8` rather than arbitrary values where practical. Named control heights are:

- `h-control-sm`: 32px
- `h-control`: 40px
- `h-control-lg`: 48px
- `section`: 64px

### Typography

- Display: Space Grotesk, for product identity and page headings.
- Body: Plus Jakarta Sans, for UI and long-form readability.
- Data: JetBrains Mono with tabular numerals, for metrics and dense analysis.
- Named levels: `display-lg`, `display-sm`, `heading-lg`, `heading-md`, `heading-sm`, `body-sm`, `label`, and `data`.

### Radius

The system uses 4, 6, 8, 12, and 16px radii. Prefer `rounded-badge`, `rounded-button`, `rounded-card`, and `rounded-modal` by role.

### Elevation

Use `shadow-xs`, `shadow-sm`, `shadow-card`, and `shadow-elevated`. Focus uses `shadow-focus`; avoid custom colored shadows.

## Reusable Primitives

- `components/ui/Button.jsx`: primary, secondary, ghost, danger, size, and icon-only variants.
- `components/ui/Card.jsx`: default, muted, and interactive cards.
- `components/ui/Field.jsx`: input, select, textarea, label, and help text.
- `components/ui/Table.jsx`: responsive table wrapper and dense table base.
- `components/layout/PageContainer.jsx`: shared maximum width and responsive gutters.

CSS equivalents (`pv-*`) support incremental migration of existing pages without layout rewrites: `pv-btn-*`, `pv-card*`, `pv-field`, `pv-table`, and `pv-nav-item`.

## Theme Contract

Theme switching remains controlled by `ThemeContext` using `data-theme` on the root element. `blue` is the existing dark theme key and `beige` is the light theme key; these values remain unchanged for persisted user preferences.

## Application Layout

The application shell uses a responsive CSS grid instead of a fixed sidebar plus compensating content padding. The grid owns both sidebar and content widths, preventing overlap and width drift.

- Desktop: 72px collapsed rail or 280px expanded sidebar with a 240ms grid transition.
- Tablet and mobile: fixed 64px header with an off-canvas navigation drawer.
- The desktop sidebar is sticky and remains in normal grid flow.
- Main content always uses `minmax(0, 1fr)` and `min-width: 0` to contain wide charts, tables, and flex children.
- `pv-content-container` provides a shared 1280px maximum width with 16/24/32px responsive gutters.
