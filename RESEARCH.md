# Word Quest — MVP Research Notes

## Vocabulary reference

The prototype uses the **Oxford 3000–5000 word lists** as its content north star and deliberately ships with a small starter sample rather than copying a full proprietary list. The official reference is [Oxford Learner’s Dictionaries: Oxford 3000 and Oxford 5000](https://www.oxfordlearnersdictionaries.com/us/wordlists/oxford3000-5000).

The current eight-word set is an original starter sample built around common, high-utility vocabulary across A2–B2 difficulty: `achieve`, `benefit`, `aware`, `approach`, `accurate`, `convince`, `attempt`, and `confidence`. Each item includes part of speech, an example sentence, a short learning note, and a competency score.

## Learning-by-doing loop

The MVP starts with an answer-from-memory **field test**, then provides immediate correctness feedback and updates the word’s local competency score. Words below 70% are surfaced in the **card stack** for another retrieval attempt. The **competency map** makes the learner’s current signal visible without pretending that a single round equals fluency.

Progress is stored in browser `localStorage` for this frontend-only MVP. There is no account system, cloud sync, official Oxford content feed, or claim that the score measures full-language proficiency yet.

