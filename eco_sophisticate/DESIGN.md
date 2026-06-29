---
name: Eco-Sophisticate
colors:
  surface: '#f1fdea'
  surface-dim: '#d2ddcc'
  surface-bright: '#f1fdea'
  surface-container-lowest: '#ffffff'
  surface-container-low: '#ecf7e5'
  surface-container: '#e6f1df'
  surface-container-high: '#e0ecda'
  surface-container-highest: '#dae6d4'
  on-surface: '#141e13'
  on-surface-variant: '#3c4b39'
  inverse-surface: '#293327'
  inverse-on-surface: '#e9f4e2'
  outline: '#6c7b67'
  outline-variant: '#bacbb4'
  surface-tint: '#006e1b'
  primary: '#006e1b'
  on-primary: '#ffffff'
  primary-container: '#19e647'
  on-primary-container: '#006117'
  inverse-primary: '#16e546'
  secondary: '#026e1c'
  on-secondary: '#ffffff'
  secondary-container: '#97f592'
  on-secondary-container: '#0c7320'
  tertiary: '#356944'
  on-tertiary: '#ffffff'
  tertiary-container: '#9cd4a7'
  on-tertiary-container: '#295d39'
  error: '#ba1a1a'
  on-error: '#ffffff'
  error-container: '#ffdad6'
  on-error-container: '#93000a'
  primary-fixed: '#71ff75'
  primary-fixed-dim: '#16e546'
  on-primary-fixed: '#002204'
  on-primary-fixed-variant: '#005312'
  secondary-fixed: '#99f894'
  secondary-fixed-dim: '#7edb7b'
  on-secondary-fixed: '#002204'
  on-secondary-fixed-variant: '#005312'
  tertiary-fixed: '#b7f0c1'
  tertiary-fixed-dim: '#9cd4a6'
  on-tertiary-fixed: '#00210c'
  on-tertiary-fixed-variant: '#1c502e'
  background: '#f1fdea'
  on-background: '#141e13'
  surface-variant: '#dae6d4'
typography:
  headline-lg:
    fontFamily: Playfair Display
    fontSize: 40px
    fontWeight: '700'
    lineHeight: '1.2'
  headline-md:
    fontFamily: Playfair Display
    fontSize: 32px
    fontWeight: '600'
    lineHeight: '1.3'
  body-lg:
    fontFamily: Inter
    fontSize: 18px
    fontWeight: '400'
    lineHeight: '1.6'
  body-md:
    fontFamily: Inter
    fontSize: 16px
    fontWeight: '400'
    lineHeight: '1.5'
  label-md:
    fontFamily: Inter
    fontSize: 14px
    fontWeight: '500'
    lineHeight: '1.4'
    letterSpacing: 0.02em
rounded:
  sm: 0.5rem
  DEFAULT: 1rem
  md: 1.5rem
  lg: 2rem
  xl: 3rem
  full: 9999px
spacing:
  base: 8px
  xs: 4px
  sm: 12px
  md: 24px
  lg: 48px
  xl: 80px
---

# Design System: Eco-Sophisticate

## Brand & Style
The brand identity has shifted from a high-energy, industrial orange to a sophisticated, organic, and growth-oriented aesthetic. The personality is professional yet deeply connected to nature and sustainability. It balances a high-end editorial feel with modern efficiency.

The design style is **Corporate Modern with a touch of Minimalism**. It utilizes generous whitespace, refined typography, and a palette inspired by lush botanical environments to evoke a sense of trust, vitality, and premium quality.

## Colors
The color palette is anchored in a vibrant, "fidelity" green that signifies life and technology.

*   **Primary (#0be243):** A vivid, high-visibility green used for key actions and brand emphasis.
*   **Secondary (#2b8833):** A deep forest green that provides grounding and professional contrast for navigation and secondary accents.
*   **Tertiary (#4a7e57):** A muted moss green that creates a monochromatic, harmonious layering effect, replacing previous high-contrast accents for a more cohesive botanical feel.
*   **Neutral (#6f7a6b):** A sage-tinted slate used for text and structural elements to maintain the organic theme.

## Typography
The typography system uses a pairing of a classic serif and a high-performance sans-serif to create an editorial, premium feel.

*   **Headlines:** Playfair Display provides a sophisticated, high-contrast serif look for titles and marketing headers.
*   **Body & Labels:** Inter is used for all functional text, ensuring maximum readability and a clean, modern interface.
*   Large headlines (above 32px) should transition to a more compact `headline-lg-mobile` (28px) on mobile devices to maintain layout integrity.

## Layout & Spacing
The system follows a fluid grid philosophy with a base-8 rhythm.

*   **Desktop:** 12-column grid with 24px gutters and 48px margins.
*   **Tablet:** 8-column grid with 24px gutters.
*   **Mobile:** 4-column grid with 16px gutters.
Layouts should prioritize vertical rhythm and breathing room, leaning into the minimalist brand pillar.

## Elevation & Depth
The system uses **Tonal Layers** supplemented by soft, ambient shadows. Instead of heavy shadows, depth is communicated through subtle shifts in background color (using the neutral sage palette) and very soft, diffused shadows with a slight green tint (e.g., 5-10% opacity of the secondary color) to maintain the organic aesthetic.

## Shapes
The shape language is friendly and approachable. With a **roundedness setting of 3 (Pill-shaped)**, buttons and input fields utilize large corner radii (1rem base). This softness contrasts with the sharp serifs of the headline typography, creating a balanced and modern visual tension.

## Components
*   **Buttons:** Primary buttons use the Pill-shape with the vibrant green background and white text. Secondary buttons use the forest green outline.
*   **Cards:** Use a high corner radius (rounded-xl) with a very subtle neutral-tinted stroke or soft ambient shadow.
*   **Inputs:** Fully rounded containers with Inter medium labels. Focus states should use a 2px stroke of the Primary Green.
*   **Chips:** Highly rounded, using light tints of the tertiary moss green or primary green for categorization.