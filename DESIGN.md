# Design System: ReviewLoom
**Project ID:** 17586142877303387450

## 1. Visual Theme & Atmosphere
**The Living Canvas & Structural Silence**
In a world of overstimulated interfaces, this system treats the mobile screen not as a container to be filled, but as a gallery wall where every element is curated. The experience is high-end, editorial, and emotionally intuitive. We break the "template" look by utilizing intentional asymmetry—placing key actions off-center or overlapping containers—to create a sense of bespoke craftsmanship. Space is defined not by rigid lines, but by light, shadow, and soft tonal shifts.

## 2. Color Palette & Roles

*   **Breathable Off-White** (`#f7f9fb`): Background / `surface`. A soft, breathable base that reduces eye strain compared to pure white.
*   **Floating White** (`#ffffff`): Primary interactive surface / `surface_container_lowest`. Used for floating cards and primary objects sitting above the background.
*   **Emerald Pulse** (`#10b981`): Primary Accent / `primary_container`. Our "Positive" pulse. Used for success moments, primary calls to action, and vital data points.
*   **Deep Forest Green** (`#006c49`): Primary Base / `primary`. Used in gradients and as a stabilizing foundation for the Emerald Pulse.
*   **Grounded Slate** (`#505f76`): Secondary Accent / `secondary`. Used for "Negative" or "Neutral" states, providing a sophisticated counterweight to the vibrant Emerald.
*   **Deep Charcoal** (`#191c1e`): Text Primary / `on_background` & `on_surface`. Provides deep contrast for legibility without the harshness of pure black.
*   **Muted Spruce** (`#3c4a42`): Text Secondary / `on_surface_variant`. Used for metadata, subtitles, and supporting context.
*   **Ghost Silver** (`#bbcabf`): Borders / `outline_variant`. Used sparingly for subtle boundary definition when accessibility demands it.

## 3. Typography Rules
**Manrope (The Editorial Voice)**
We use **Manrope** exclusively for its geometric yet warm character. The hierarchy is designed to feel like a high-end magazine.
*   **Display & Headline:** Use `display-lg` (3.5rem) and `headline-lg` (2rem) to create "Hero" moments. Allow headlines to breathe and occupy significant screen real estate.
*   **Body & Labels:** `body-md` (0.875rem) is the workhorse for readable text. `label-sm` (0.6875rem) in the secondary color is reserved for precise metadata.
*   **Signature Pairing:** Pair a large `display-sm` headline with a `label-md` uppercase tag above it for a curated, authoritative look.

## 4. Component Stylings

*   **Buttons:** 
    *   **Primary:** High-pill shape (`rounded-full`). Background uses a vertical gradient from Deep Forest Green (`primary`) to Emerald Pulse (`primary_container`). Text is crisp white (`on_primary`).
    *   **Secondary:** Soft background fill (`surface_container_low`) with dark text (`on_surface`). No borders.
    *   **Behavior:** On press, buttons scale down slightly (0.96) with an increase in shadow density. Success actions emit a soft, expanding ring of `primary_fixed_dim` at 10% opacity.
*   **Cards/Containers:** 
    *   **Shape:** Softly rounded corners, using 8px (`DEFAULT`) to 16px (`lg`) radii to maintain an emotionally intuitive feel. Never use sharp, squared-off edges.
    *   **Separation:** **No Dividers.** Never use a horizontal line to separate content. Use a change in text style or an 8px increase in vertical padding instead.
*   **Inputs/Forms:** 
    *   **Idle:** Subtle `surface_container_low` background fill.
    *   **Focus:** Smoothly transitions (300ms ease-in-out) to pure white (`surface_container_lowest`) with an Emerald "Ghost Border" at 20% opacity.

## 5. Layout Principles

*   **Embrace the Void:** Use massive margins (24px to 32px) to make the content feel "expensive" and carefully placed.
*   **Asymmetric Balance:** Contrast large, sweeping elements with small, precise metadata (e.g., a small label balancing a massive headline).
*   **Tonal Layering & Depth:** Avoid 1px solid borders. Place lighter cards on slightly darker backgrounds. The subtle 2-3% difference in value signifies a new layer.
*   **Ambient Shadows:** When elements must float (like a Floating Action Button or dropdown), use highly diffused shadows (e.g., Y: 20px, Blur: 40px, Spread: 0, Color: rgba(15, 23, 42, 0.06)). Shadows should mimic natural ambient light, never harsh black drops.
*   **No Vertical Scroll (Mobile):** For the mobile feedback funnel, shift the user's mental model from "browsing" to "interacting" by keeping actions above the fold. Use horizontal carousels or progressive disclosure (drawers) if content exceeds the screen.
