# Word Quest Design System

## Strategy

**Artifact:** responsive vocabulary-learning game MVP.

**Audience:** English learners who want a quick, honest check of which words they understand through active practice.

**Primary action:** answer one challenge, receive immediate feedback, and continue the round.

**Positioning:** a practice-first English competency check inspired by the Oxford 3000–5000 vocabulary universe; not an official Oxford product and not a complete fluency assessment.

**Brand adjectives:** bright, candid, encouraging.

**Aesthetic essence:** tactile, editorial, gameful.

## Visual commitment

The interface uses a contemporary editorial learning-tool direction grounded in risograph print language: warm paper surfaces, ink navy, muted blue structure, coral action, and mustard progress. The supplied mascot is preserved as a margin coach. The signature move is the **competency tape**, a segmented progress line that makes the learner’s current signal visible without pretending to measure every dimension of fluency.

## Tokens

| Role | Token | Value | Use |
| --- | --- | --- | --- |
| Paper background | `--paper` | `oklch(0.97 0.015 90)` | App canvas and reading surfaces |
| Ink | `--ink` | `oklch(0.23 0.035 255)` | Primary text, outlines, high-contrast controls |
| Blue structure | `--blue` | `oklch(0.53 0.12 250)` | Navigation, secondary action, supporting data |
| Quest Coral | `--coral` | `oklch(0.62 0.18 25)` | Primary action, selected states, correction |
| Mustard | `--mustard` | `oklch(0.80 0.15 85)` | Streaks, earned progress, callouts |
| Soft surface | `--surface` | `oklch(0.94 0.02 90)` | Card layers and quiet containers |
| Muted ink | `--muted-ink` | `oklch(0.48 0.035 255)` | Secondary copy |
| Success | `--success` | `oklch(0.62 0.13 150)` | Correct feedback |
| Error | `--error` | `oklch(0.58 0.16 25)` | Incorrect feedback |

**Typography:** Bree Serif for display and question words; DM Sans for interface copy. Base 16px with a 1.25 modular rhythm for display steps. Use tabular numerals for scores.

**Spacing:** 4px base unit; use 8px within controls, 16–24px within cards, and 40–72px between major regions.

**Shape:** 10px for cards, 6px for controls, with occasional clipped paper corners used as a motif rather than a global radius rule.

**Shadow:** one defined-edge shadow approach only: `0 3px 0 var(--ink)` on elevated interactive paper pieces.

## Composition

The desktop layout is a practice desk: a 280px left rail plus an expansive exam field. The left rail is information-dense but quiet; the main card has the strongest contrast and the largest type. On mobile, the rail becomes a compact header strip and the answer field remains the first readable block.

## Interaction states

Buttons must have default, hover, active, focus-visible, disabled, and selected states. Answer choices must clearly distinguish selected, correct, incorrect, and review states using label/icon text as well as color. Feedback arrives immediately after selection. Keyboard users can reach every answer and use Enter/Space to choose.

## Motion

Only transform and opacity animate. Use `cubic-bezier(0.23, 1, 0.32, 1)` for entry and feedback, with durations under 240ms. Remove non-essential movement under `prefers-reduced-motion: reduce`.

## Imagery

The supplied mascot SVG is the canonical character. Generated assets are reserved for the hero texture, card texture, small streak burst, and text-free brand glyph. The prominent hero scene keeps its busy cluster on the right so copy remains readable on the left.

## Accessibility

Maintain visible focus rings, semantic buttons, text alternatives for images, at least 44px touch targets, high-contrast text, and non-color feedback labels. The app is light-theme first in this MVP.

## Scope notes

The initial content is a small curated sample of common English words and example meanings for interaction testing. The data model is intentionally ready to expand to the full Oxford 3000–5000 word universe later. It is not an official Oxford implementation or a licensed reproduction of the full list.

