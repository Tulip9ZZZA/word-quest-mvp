# Word Quest

Word Quest is a static, practice-first English vocabulary web app. Learners answer short tasks, build per-word evidence, and inspect a **5,000-word capacity index** through an F–S competency scale.

## What this release includes

- A responsive Field Test with multiple-choice and true/false prompts.
- A self-rated Card Stack that contributes to the same word-level history.
- A searchable 5,000-word competency directory with click-through details.
- Per-word attempts, misses, game-by-game evidence, a comprehension percentage, and an F–S competency tier stored locally in the browser.
- A carefully labeled vocabulary-only CEFR coverage estimate.

## Important source and assessment notes

Word Quest references the [official Oxford 3000–5000 page](https://www.oxfordlearnersdictionaries.com/us/wordlists/oxford3000-5000) for learners who want to explore Oxford’s material. It is **not affiliated with or endorsed by Oxford University Press**, and it does not reproduce Oxford’s curated word lists or PDFs.

The 5,000-word capacity index is generated independently from `wordfreq 3.1.1`. It is not an Oxford list. See [ATTRIBUTION.md](ATTRIBUTION.md) and [SOURCES_AND_DATA_POLICY.md](SOURCES_AND_DATA_POLICY.md) for license, attribution, and data-use information.

> The CEFR label is only a vocabulary-coverage estimate based on this app’s own logged practice. It is not a formal CEFR result and does not assess listening, speaking, writing, grammar, or real-world communication.

## Development

```bash
pnpm install
pnpm dev
pnpm check
pnpm build
```

To regenerate the independent word index, install `wordfreq==3.1.1` and run:

```bash
python3 scripts/generate_word_index.py
```

## Licenses

The application source is [MIT licensed](LICENSE). The generated frequency-derived vocabulary index is supplied under CC BY-SA 4.0; attribution requirements are described in [ATTRIBUTION.md](ATTRIBUTION.md).
