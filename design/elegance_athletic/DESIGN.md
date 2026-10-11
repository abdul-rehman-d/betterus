---
name: Elegance Athletic
colors:
  surface: '#fff8f8'
  surface-dim: '#f7d0df'
  surface-bright: '#fff8f8'
  surface-container-lowest: '#ffffff'
  surface-container-low: '#fff0f4'
  surface-container: '#ffe8ef'
  surface-container-high: '#ffe0eb'
  surface-container-highest: '#ffd8e7'
  on-surface: '#2b141f'
  on-surface-variant: '#584145'
  inverse-surface: '#422934'
  inverse-on-surface: '#ffecf2'
  outline: '#8c7074'
  outline-variant: '#dfbec3'
  surface-tint: '#b22353'
  primary: '#ae2050'
  on-primary: '#ffffff'
  primary-container: '#d03c68'
  on-primary-container: '#fffbff'
  inverse-primary: '#ffb1c0'
  secondary: '#8a4b60'
  on-secondary: '#ffffff'
  secondary-container: '#ffb0c8'
  on-secondary-container: '#7c3f54'
  tertiary: '#625a5a'
  on-tertiary: '#ffffff'
  tertiary-container: '#7b7372'
  on-tertiary-container: '#fffbff'
  error: '#ba1a1a'
  on-error: '#ffffff'
  error-container: '#ffdad6'
  on-error-container: '#93000a'
  primary-fixed: '#ffd9df'
  primary-fixed-dim: '#ffb1c0'
  on-primary-fixed: '#3f0016'
  on-primary-fixed-variant: '#90003c'
  secondary-fixed: '#ffd9e2'
  secondary-fixed-dim: '#ffb0c8'
  on-secondary-fixed: '#39081d'
  on-secondary-fixed-variant: '#6e3449'
  tertiary-fixed: '#ece0df'
  tertiary-fixed-dim: '#cfc4c3'
  on-tertiary-fixed: '#201a1a'
  on-tertiary-fixed-variant: '#4c4545'
  background: '#fff8f8'
  on-background: '#2b141f'
  surface-variant: '#ffd8e7'
typography:
  headline-lg:
    fontFamily: Epilogue
    fontSize: 36px
    fontWeight: '700'
    lineHeight: 44px
    letterSpacing: -0.02em
  headline-lg-mobile:
    fontFamily: Epilogue
    fontSize: 28px
    fontWeight: '700'
    lineHeight: 34px
    letterSpacing: -0.015em
  headline-md:
    fontFamily: Epilogue
    fontSize: 24px
    fontWeight: '600'
    lineHeight: 30px
    letterSpacing: -0.01em
  headline-sm:
    fontFamily: Epilogue
    fontSize: 20px
    fontWeight: '600'
    lineHeight: 26px
  body-lg:
    fontFamily: Plus Jakarta Sans
    fontSize: 17px
    fontWeight: '400'
    lineHeight: 24px
  body-md:
    fontFamily: Plus Jakarta Sans
    fontSize: 15px
    fontWeight: '400'
    lineHeight: 22px
  body-sm:
    fontFamily: Plus Jakarta Sans
    fontSize: 13px
    fontWeight: '400'
    lineHeight: 18px
  label-lg:
    fontFamily: Plus Jakarta Sans
    fontSize: 15px
    fontWeight: '600'
    lineHeight: 20px
  label-md:
    fontFamily: Plus Jakarta Sans
    fontSize: 13px
    fontWeight: '600'
    lineHeight: 16px
    letterSpacing: 0.01em
  label-sm:
    fontFamily: Plus Jakarta Sans
    fontSize: 11px
    fontWeight: '700'
    lineHeight: 14px
    letterSpacing: 0.04em
rounded:
  sm: 0.5rem
  DEFAULT: 1rem
  md: 1.5rem
  lg: 2rem
  xl: 3rem
  full: 9999px
spacing:
  gutter: 1rem
  gutter-sm: 0.75rem
  margin: 1.25rem
  margin-tablet: 2rem
  space-xs: 0.25rem
  space-sm: 0.5rem
  space-md: 1rem
  space-lg: 1.5rem
  space-xl: 2.25rem
---

## Brand & Style

The design system projects an elevated, nurturing, and high-performance lifestyle identity. Tailored for conscious self-care and holistic body tracking, it rejects aggressive neon gym tropes in favor of an inviting, editorial athletic aesthetic. The emotional tone is supportive, refined, and distinctly premium.

The visual style synthesizes modern iOS precision with soft tactile elegance. It combines gentle layered translucent surfaces, graceful curves, crisp editorial typography, and high-contrast berry text over luminous warm blush foundations to foster daily engagement without visual fatigue.

## Colors

The color palette centers on radiant rose-tinted hues paired with grounding dark berry tones.

- **Primary (`#E04874`)**: An energetic, saturated rose pink for focal call-to-actions, primary state changes, and progress completions.
- **Secondary (`#F4A6BE`)**: A warm petal pink for soft progress bars, supportive highlights, and hover/active indicator washes.
- **Tertiary (`#F9EDEC`)**: A pale rose cream used as the foundational canvas layer to provide a warm, non-glare surface.
- **Neutral (`#301924`)**: A rich deep plum black providing high legibility for headlines, body copy, and iconography, keeping the interface rooted and accessible.

Complementary surfaces rely on pure white (`#FFFFFF`) cards to float above the rose-cream base, bound together by gentle berry borders at 8% opacity (`rgba(48, 25, 36, 0.08)`).

## Typography

Typography establishes an editorial atmosphere balanced with ergonomic legibility:

- **Epilogue** delivers distinctive geometry for top-level headlines, numeric fitness metrics, and milestone banners.
- **Plus Jakarta Sans** provides soft, modern, and open apertures for descriptive copy, body text, and operational data readouts.

Metrics, timer displays, and body stats pair bold Epilogue numbers alongside small, capitalized Plus Jakarta Sans units to maintain visual hierarchy.

## Layout & Spacing

The interface employs a responsive fluid grid optimized for mobile ergonomics:

- **Mobile (<768px)**: 4-column layout with 20px outer margins and 16px gutters. Structural touch targets maintain a minimum 44px hit-box.
- **Tablet / Large Mobile (≥768px)**: 8-column layout with 32px margins and 24px gutters, enabling side-by-side metric tiles and weekly trajectory comparisons.

The vertical rhythm strictly adheres to an 8px base grid, using compact 4px increments for tightly grouped micro-labels and measurement tags.

## Elevation & Depth

Visual hierarchy uses warm, diffuse ambient drop shadows coupled with translucent surface layering:

- **Surface Floor**: `#F9EDEC` (warm rose cream base).
- **Cards & Surfaces**: Pure `#FFFFFF` or translucent white (`rgba(255, 255, 255, 0.85)`) overlaid with a `16px` backdrop blur for floating headers and nav bars.
- **Shadow Low (Base Cards)**: `0 4px 20px -2px rgba(48, 25, 36, 0.05)` with an ultra-fine border `1px solid rgba(48, 25, 36, 0.06)`.
- **Shadow High (Active Modals, Quick Logs)**: `0 12px 32px -4px rgba(224, 72, 116, 0.18)`.
- **Primary Accent Glow**: `0 6px 16px rgba(224, 72, 116, 0.3)` applied strictly under key action buttons to establish intent.

## Shapes

The design system standardizes on a friendly, organic roundedness scale:

- **Pill (Fully Rounded / 9999px)**: Reserved for primary action buttons, search fields, metric chips, and segmented control thumbs.
- **Cards & Containers (32px / `rounded-xl`)**: Applied to habit blocks, workout modules, and analytics panels.
- **Inner Modules & Thumbnails (16px / `rounded-md`)**: Used for workout preview assets, avatar frames, and data progress enclosures.

## Components

### Buttons
- **Primary**: Full pill radius, solid `#E04874` fill, crisp white typography (`#FFFFFF`), subtle bloom shadow. Active states scale down to `0.98`.
- **Secondary**: Translucent petal-pink background (`rgba(244, 166, 190, 0.25)`), `#E04874` label, no outer shadow.
- **Tertiary / Ghost**: Transparent fill, neutral berry label with subtle hover underline or background wash.

### Segmented Controls & Chips
- Segmented switches nest inside a pill container (`#F4A6BE` at 20% opacity). The active item uses a sliding pure white pill with a micro-shadow (`0 2px 8px rgba(48, 25, 36, 0.08)`) and bold deep plum text.
- Chips leverage full pill borders (`1px solid rgba(48, 25, 36, 0.1)`) when inactive, and transition to a solid `#E04874` with white text when active.

### Cards & Trackers
- Encased in 24px–32px corner radius containers.
- Visual separation is achieved via pure white card backgrounds layered against the blush-tinted page, framed with gentle borders (`rgba(48, 25, 36, 0.05)`).
- Progress rings use a track of `#F4A6BE` at 30% opacity with a vibrant `#E04874` stroke cap.

### Form Inputs & Checkboxes
- **Inputs**: 52px height pill fields, tinted background (`rgba(255, 255, 255, 0.8)`), border in `rgba(48, 25, 36, 0.08)`. Focus rings transition cleanly to `#E04874`.
- **Checkboxes & Radios**: Smooth circular selectors. Inactive items show a thin berry border; active items trigger an animated scale fill in `#E04874` containing a centered white micro-check.