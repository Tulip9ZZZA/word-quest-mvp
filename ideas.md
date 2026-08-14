# Word Quest — Design Direction

## Three directions considered

### Paper Trail

A tactile study-desk game with risograph ink, index-card surfaces, and a warm editorial rhythm. It should feel like a clever notebook that turns practice into a small daily ritual.

**Probability:** 0.07

### Arcade Recall

A high-energy quiz-room direction with bold score readouts, crisp challenge states, and a more competitive cadence. It would make speed and streaks the visual center of the experience.

**Probability:** 0.04

### Quiet Lexicon

A calmer, library-like vocabulary tool with restrained typography, generous whitespace, and a measured progress view. It would put reflection and accuracy ahead of game spectacle.

**Probability:** 0.03

## Chosen direction: Paper Trail

### Design Movement

Contemporary editorial learning tool with **risograph print language**, translated into a responsive web app. The mascot becomes the encouraging desk companion; the interface behaves like a field notebook rather than a generic dashboard.

### Core Principles

1. **Learning is an action, not a page view.** Every screen funnels the learner toward choosing, recalling, checking, and trying again.
2. **Printed artifacts make progress tangible.** Index cards, check marks, pencil marks, and small paper slips turn abstract competency into visible evidence.
3. **Warmth without clutter.** The interface is expressive, but every decorative mark must reinforce the study loop or give the eye a place to rest.
4. **Competency is honest and local.** Scores are framed as a current signal for the selected word set, not as a claim of overall fluency.

### Color Philosophy

The base is warm paper and ink navy to make long practice sessions feel calm and legible. Muted blue carries structure and orientation. Coral is reserved for action and correction; mustard marks earned momentum. The palette feels like a well-used notebook with a sharp modern edge, not a toy store or a neon arcade.

### Layout Paradigm

Use a **split practice desk**: a narrow left rail holds the learner’s current mission, mascot, and competency snapshot; the main field is a large exam card with one clear question and a short response path. On smaller screens the rail folds into a compact top strip, keeping the question-first hierarchy intact.

### Signature Elements

- **Competency tape:** a segmented progress line that shows how much of the current word set is understood, reviewed, and still uncertain.
- **Stamped question number:** each challenge begins with a small ink-stamp label such as `ROUND 04 / 12`, making the exam feel like a short field test.
- **Mascot margin notes:** the supplied character appears beside feedback as a quiet coach, changing pose through simple CSS treatments rather than competing with the question.

### Interaction Philosophy

Clicks should feel like placing a card on a desk. Answer choices have a clear pressed state and an immediate explanation. The learner can retry without punishment, and the end-of-round summary turns mistakes into a specific “review next” list. The interface avoids timer pressure in this first MVP.

### Animation

Use short 160–240ms ease-out transitions for answer selection, progress updates, and card changes. A question card should lift by a few pixels and fade between prompts; feedback should arrive with a small stamped-in motion. Celebration is restrained: a brief burst and number tick, never a full-screen confetti takeover. Respect `prefers-reduced-motion` by removing transforms and keeping only opacity changes.

### Typography System

Use **Bree Serif** for display labels and question words, paired with **DM Sans** for body copy, controls, and scores. Headings are compact and assertive; support copy stays at readable line lengths. Use tabular numerals for competency percentages and round progress.

### Brand Essence

**Word Quest is a practice-first English vocabulary exam for learners who want evidence of what they can actually understand, not another passive list.** Personality: **bright, candid, encouraging**.

### Brand Voice

Headlines sound like a coach who respects the learner’s time. CTAs are direct and active. Microcopy names the next useful action instead of praising vaguely.

Example lines:

- “Let’s see what sticks.”
- “Missed it? Good. Now it has somewhere to land.”

### Wordmark & Logo

The wordmark is set in a compact serif with a hand-drawn underline that breaks into a compass tick. The symbol is a text-free open-book / compass glyph, used in the header and favicon; the supplied mascot remains the character mark for learning feedback.

### Signature Brand Color

**Quest Coral — `oklch(0.62 0.18 25)`**. It is the ownable action color: warm, visible, and a little editorial rather than the expected tech blue.

## Style Decisions

- Riso texture lives primarily in hero imagery, margins, stamps, tapes, dividers, and supporting surfaces; the active question and answer slips stay calm paper with crisp ink hierarchy.
- The main practice view must read as one printed field-test sheet: stamped round marker first, one dominant question, clean answer slips, one coral action.
- The Word Quest wordmark uses a compact serif treatment plus a hand-drawn underline and compass tick so the brand reads like an editorial notebook cover.
