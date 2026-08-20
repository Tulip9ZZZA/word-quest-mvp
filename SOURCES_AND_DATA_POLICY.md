# Sources and Data Policy

## Independent vocabulary dataset

Word Quest must **not** bundle, extract, or redistribute the supplied Oxford PDFs, Oxford definitions, example sentences, audio, or the publisher’s curated list arrangement. The supplied Oxford material is treated as a private reference only. The public app will link users to the official reference and state that Word Quest is not an Oxford University Press product.

The initial scalable word-index implementation will instead use an independently generated English frequency list based on [`wordfreq`](https://github.com/rspeer/wordfreq). The project describes itself as a multilingual word-frequency library based on multiple data sources. Its code uses Apache 2.0, while its data files may be redistributed under **CC BY-SA 4.0** and carry attribution obligations for Robyn Speer, SUBTLEX authors, OpenSubtitles, and other cited sources. The repository will keep this attribution, retain the source version, and license generated word-index data separately under CC BY-SA 4.0.

## Attribution shown in the product

> Word Quest is inspired by the Oxford 3000™ and Oxford 5000™ concept. It does not reproduce Oxford’s proprietary list files, definitions, examples, audio, or other learning content. See the official [Oxford 3000 and Oxford 5000](https://www.oxfordlearnersdictionaries.com/us/wordlists/oxford3000-5000) reference.

## Vocabulary-only CEFR limitation

Word Quest may display an **estimated vocabulary coverage band**, calculated only from a learner’s progress across this project’s word index. It must not claim to provide an official CEFR result or replace a formal language assessment. Listening, speaking, reading, writing, grammar, and communicative performance are out of scope for this estimate.

## Notes from the supplied Oxford reference PDFs

The supplied PDFs confirm that Oxford presents the material as **The Oxford 5000** and **The Oxford 5000 by CEFR level**, describing it as an expanded core list for advanced learners that adds 2,000 words at the B2–C1 range beyond the Oxford 3000 reference. The pages visibly present headwords with part-of-speech and CEFR labels. Word Quest may cite Oxford as a reference point for learners and may deep-link users to the official source, but it must not publish extracted PDF contents or present the app’s dataset as an official Oxford export.

For product design, these PDFs support two UI decisions. First, the competency area can expose **word-level CEFR metadata fields** such as B2 or C1 as an informational reference when our independent dataset provides them. Second, the interface must explicitly explain that the app’s **CEFR estimate is inferred from tracked vocabulary coverage**, not from Oxford’s own test or certification process.

## Sources

1. [Oxford Learner’s Dictionaries — Oxford 3000 and Oxford 5000](https://www.oxfordlearnersdictionaries.com/us/wordlists/oxford3000-5000)
2. [Oxford Learner’s Dictionaries — Terms and conditions](https://www.oxfordlearnersdictionaries.com/us/terms-and-conditions)
3. [wordfreq — GitHub repository and Apache 2.0 license](https://github.com/rspeer/wordfreq)
4. [wordfreq — PyPI project page](https://pypi.org/project/wordfreq/)
5. [wordfreq — NOTICE and data attribution requirements](https://raw.githubusercontent.com/rspeer/wordfreq/master/NOTICE.md)
