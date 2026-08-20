/* Word Quest style reminder: Paper Trail editorial workspace — tactile field sheets, candid evidence, competency tape, and a calm high-density directory. */
import { useMemo, useState } from "react";
import {
  ArrowRight,
  BarChart3,
  BookOpenCheck,
  Check,
  ChevronLeft,
  ChevronRight,
  CircleAlert,
  CircleHelp,
  ExternalLink,
  Flame,
  Layers,
  LibraryBig,
  ListFilter,
  Menu,
  Play,
  RotateCcw,
  Search,
  ShieldCheck,
  Sparkles,
  Target,
  Trophy,
  X,
} from "lucide-react";
import { VOCABULARY_INDEX } from "@/data/vocabulary";
import {
  buildCompetencyRecords,
  summarizeVocabulary,
  tierLabel,
  type Attempt,
  type CompetencyRecord,
  type CompetencyTier,
  type GameKey,
} from "@/lib/competency";

type Mode = "exam" | "flashcards" | "competency";
type Question = {
  id: number;
  word: string;
  level: string;
  partOfSpeech: string;
  kind: "multiple-choice" | "true-false";
  prompt: string;
  options?: string[];
  answer?: number;
  statement?: string;
  truth?: boolean;
  example: string;
  note: string;
};

type TierFilter = "all" | CompetencyTier;
type BandFilter = "all" | "A1" | "A2" | "B1" | "B2" | "C1" | "C2";
type SortMode = "attention" | "rank" | "comprehension" | "misses";

const MASCOT_URL = "/manus-storage/word-quest-mascot_9824378d.svg";
const GLYPH_URL = "/manus-storage/word-quest-glyph_de34f19f.png";
const HERO_URL = "/manus-storage/word-quest-hero_46b80b9f.jpg";
const BURST_URL = "/manus-storage/word-quest-streak-burst_10bd6cec.png";
const STORAGE_KEY = "word-quest-attempts-v2";
const PAGE_SIZE = 56;

const questions: Question[] = [
  { id: 1, word: "achieve", level: "A2", partOfSpeech: "verb", kind: "multiple-choice", prompt: "What does achieve mean?", options: ["To reach a goal", "To forget a plan", "To make something smaller", "To travel quickly"], answer: 0, example: "She worked steadily to achieve her reading goal.", note: "Think of a result you worked toward." },
  { id: 2, word: "benefit", level: "A2", partOfSpeech: "noun", kind: "true-false", prompt: "Is this statement true or false?", statement: "A benefit is something that helps you or gives you an advantage.", truth: true, example: "One benefit of short quizzes is fast feedback.", note: "A benefit is a useful result." },
  { id: 3, word: "aware", level: "B1", partOfSpeech: "adjective", kind: "multiple-choice", prompt: "If you are aware of a problem, you…", options: ["know about it", "hide it from everyone", "solve it by accident", "make it disappear"], answer: 0, example: "He became aware of the new words he kept missing.", note: "Awareness starts with noticing." },
  { id: 4, word: "approach", level: "B2", partOfSpeech: "verb", kind: "true-false", prompt: "Is this statement true or false?", statement: "To approach a problem means to ignore it completely.", truth: false, example: "Try a different approach when a word still feels unclear.", note: "To approach something is to move toward it, physically or mentally." },
  { id: 5, word: "accurate", level: "B2", partOfSpeech: "adjective", kind: "multiple-choice", prompt: "Which description is accurate?", options: ["Correct and free from mistakes", "Very loud and exciting", "Difficult to carry", "Done without a plan"], answer: 0, example: "Her answer was accurate, even though she answered quickly.", note: "Accuracy is about being right, not being fast." },
  { id: 6, word: "convince", level: "B1", partOfSpeech: "verb", kind: "true-false", prompt: "Is this statement true or false?", statement: "If you convince someone, you help them accept that an idea is true or right.", truth: true, example: "The example convinced her that practice was working.", note: "Convince is about changing someone’s mind with reasons." },
  { id: 7, word: "attempt", level: "B2", partOfSpeech: "noun", kind: "multiple-choice", prompt: "An attempt is…", options: ["an effort to do something", "a final celebration", "a word you already know", "a quiet place to study"], answer: 0, example: "This is your second attempt at the tricky question.", note: "An attempt can succeed or fail; the effort still counts." },
  { id: 8, word: "confidence", level: "B2", partOfSpeech: "noun", kind: "true-false", prompt: "Is this statement true or false?", statement: "Confidence is the feeling that you can handle something.", truth: true, example: "Each accurate answer gave him a little more confidence.", note: "Confidence grows when your actions give you evidence." },
];

function loadAttempts(): Attempt[] {
  try {
    const stored = window.localStorage.getItem(STORAGE_KEY);
    const parsed = stored ? JSON.parse(stored) : [];
    return Array.isArray(parsed) ? parsed.filter((item): item is Attempt => Boolean(item?.wordId && item?.game && typeof item.correct === "boolean" && item?.at)) : [];
  } catch {
    return [];
  }
}

function makeAttempt(wordId: string, game: GameKey, correct: boolean): Attempt {
  return { id: `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`, wordId, game, correct, at: new Date().toISOString() };
}

function formatAttemptTime(iso?: string) {
  if (!iso) return "No practice logged yet";
  const date = new Date(iso);
  return Number.isNaN(date.getTime()) ? "Practice logged" : date.toLocaleDateString(undefined, { month: "short", day: "numeric", year: "numeric" });
}

function TierBadge({ tier }: { tier: CompetencyTier }) {
  return <span className={`tier-badge tier-${tier.toLowerCase()}`} aria-label={`${tier} tier: ${tierLabel(tier)}`}>{tier}</span>;
}

function EvidenceMeter({ value }: { value: number }) {
  return <div className="evidence-meter" aria-label={`${value}% comprehension`}><span style={{ width: `${value}%` }} /></div>;
}

export default function Home() {
  const [mode, setMode] = useState<Mode>("exam");
  const [questionIndex, setQuestionIndex] = useState(0);
  const [selected, setSelected] = useState<number | boolean | null>(null);
  const [submitted, setSubmitted] = useState(false);
  const [roundComplete, setRoundComplete] = useState(false);
  const [score, setScore] = useState(0);
  const [answered, setAnswered] = useState(0);
  const [attempts, setAttempts] = useState<Attempt[]>(loadAttempts);
  const [flashcardIndex, setFlashcardIndex] = useState(0);
  const [flipped, setFlipped] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [tierFilter, setTierFilter] = useState<TierFilter>("all");
  const [bandFilter, setBandFilter] = useState<BandFilter>("all");
  const [sortMode, setSortMode] = useState<SortMode>("attention");
  const [directoryPage, setDirectoryPage] = useState(0);
  const [selectedWordId, setSelectedWordId] = useState("approach");

  const recordMap = useMemo(() => buildCompetencyRecords(VOCABULARY_INDEX, attempts), [attempts]);
  const summary = useMemo(() => summarizeVocabulary(recordMap.values()), [recordMap]);
  const currentQuestion = questions[questionIndex];
  const isCurrentCorrect = currentQuestion?.kind === "multiple-choice" ? selected === currentQuestion.answer : selected === currentQuestion?.truth;
  const flashcardWord = questions[flashcardIndex % questions.length];
  const selectedRecord = recordMap.get(selectedWordId) ?? recordMap.get("approach")!;
  const selectedQuestion = questions.find((question) => question.word === selectedRecord.word);

  const filteredRecords = useMemo(() => {
    const normalized = search.trim().toLowerCase();
    const records = Array.from(recordMap.values()).filter((record) => {
      const textMatch = !normalized || record.word.includes(normalized);
      const tierMatch = tierFilter === "all" || record.tier === tierFilter;
      const bandMatch = bandFilter === "all" || record.referenceBand === bandFilter;
      return textMatch && tierMatch && bandMatch;
    });
    return records.sort((a, b) => {
      if (sortMode === "rank") return a.rank - b.rank;
      if (sortMode === "comprehension") return b.comprehension - a.comprehension || a.rank - b.rank;
      if (sortMode === "misses") return b.misses - a.misses || b.attempts - a.attempts || a.rank - b.rank;
      return (b.misses * 8 + b.attempts - b.comprehension / 18) - (a.misses * 8 + a.attempts - a.comprehension / 18) || a.rank - b.rank;
    });
  }, [bandFilter, recordMap, search, sortMode, tierFilter]);

  const pageCount = Math.max(1, Math.ceil(filteredRecords.length / PAGE_SIZE));
  const visibleRecords = filteredRecords.slice(directoryPage * PAGE_SIZE, directoryPage * PAGE_SIZE + PAGE_SIZE);
  const selectedAttempts = attempts.filter((attempt) => attempt.wordId === selectedRecord.id).sort((a, b) => b.at.localeCompare(a.at));
  const missedGames = (["field-test", "card-stack"] as GameKey[]).filter((game) => selectedRecord.byGame[game].misses > 0);

  function saveAttempts(next: Attempt[]) {
    setAttempts(next);
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
    } catch {
      // Progress remains available for this session if browser storage is unavailable.
    }
  }

  function recordAttempt(wordId: string, game: GameKey, correct: boolean) {
    saveAttempts([...attempts, makeAttempt(wordId, game, correct)]);
    setSelectedWordId(wordId);
  }

  function submitAnswer() {
    if (selected === null || submitted) return;
    setSubmitted(true);
    setAnswered((value) => value + 1);
    if (isCurrentCorrect) setScore((value) => value + 1);
    recordAttempt(currentQuestion.word, "field-test", isCurrentCorrect);
  }

  function nextQuestion() {
    if (questionIndex === questions.length - 1) {
      setRoundComplete(true);
      return;
    }
    setQuestionIndex((value) => value + 1);
    setSelected(null);
    setSubmitted(false);
  }

  function startRound() {
    setMode("exam");
    setQuestionIndex(0);
    setSelected(null);
    setSubmitted(false);
    setRoundComplete(false);
    setScore(0);
    setAnswered(0);
    setMenuOpen(false);
  }

  function chooseMode(nextMode: Mode) {
    setMode(nextMode);
    setMenuOpen(false);
    if (nextMode === "exam") startRound();
  }

  function rateFlashcard(correct: boolean) {
    recordAttempt(flashcardWord.word, "card-stack", correct);
    setFlipped(false);
    setFlashcardIndex((value) => value + 1);
  }

  function chooseDirectoryRecord(record: CompetencyRecord) {
    setSelectedWordId(record.id);
    setMode("competency");
  }

  function resetDirectoryPage() {
    setDirectoryPage(0);
  }

  const roundProgress = Math.round((questionIndex / questions.length) * 100);

  return (
    <div className="app-shell">
      <header className="topbar">
        <button className="brand-lockup" onClick={startRound} aria-label="Return to Word Quest field test">
          <span className="brand-mark"><img src={GLYPH_URL} alt="" /></span>
          <span className="brand-word"><span className="brand-name">word</span><span className="brand-name quest">quest</span><i className="brand-underline"><b /></i></span>
        </button>
        <div className="topbar-meta"><span className="status-dot" /><span>Open practice ledger</span><button className="mobile-menu" onClick={() => setMenuOpen((value) => !value)} aria-label="Open navigation"><Menu size={20} /></button></div>
      </header>

      <div className="workspace">
        <aside className={`side-rail ${menuOpen ? "is-open" : ""}`}>
          <div className="rail-heading"><div><span className="eyebrow">YOUR STUDY DESK</span><h1>Build your word sense.</h1></div><span className="rail-date">5K<br />INDEX</span></div>
          <div className="mascot-note"><img className="mascot" src={MASCOT_URL} alt="Learning mascot wearing a blue cap and glasses" /><div className="note-copy"><span className="note-pin" /><p>{mode === "competency" ? "A miss is a useful trail marker. Follow it back into practice." : "No peeking. Your first instinct is useful data."}</p></div></div>
          <nav className="mode-nav" aria-label="Study modes">
            <button className={mode === "exam" ? "active" : ""} onClick={() => chooseMode("exam")}><span className="nav-icon"><Target size={17} /></span><span>Field test</span><ChevronRight size={16} /></button>
            <button className={mode === "flashcards" ? "active" : ""} onClick={() => chooseMode("flashcards")}><span className="nav-icon"><Layers size={17} /></span><span>Card stack</span><span className="nav-count">{questions.length}</span></button>
            <button className={mode === "competency" ? "active" : ""} onClick={() => chooseMode("competency")}><span className="nav-icon"><BarChart3 size={17} /></span><span>Competency</span><ChevronRight size={16} /></button>
          </nav>
          <div className="rail-divider" />
          <div className="competency-mini"><div className="mini-label"><span>WORD SENSE</span><strong>{summary.wordSense}%</strong></div><div className="competency-tape" aria-label={`Current word sense ${summary.wordSense}%`}>{Array.from({ length: 10 }, (_, index) => <i key={index} className={index < Math.round(summary.wordSense / 10) ? "filled" : ""} />)}</div><p>{summary.testedWords ? `${summary.testedWords} words tested · ${summary.totalAttempts} evidence marks` : "Run a quick round to start leaving evidence."}</p></div>
          <div className="rail-footer"><div className="source-stamp"><LibraryBig size={15} /><span>Reference point<br /><a href="https://www.oxfordlearnersdictionaries.com/us/wordlists/oxford3000-5000" target="_blank" rel="noreferrer">Oxford 3000–5000 <ExternalLink size={11} /></a></span></div><small>Independent 5,000-word index. Not an official Oxford product.</small></div>
        </aside>

        <main className="main-field">
          <section className="hero-strip" style={{ backgroundImage: `url(${HERO_URL})` }}>
            <div className="hero-copy"><span className="eyebrow light">5,000-WORD CAPACITY · LOCAL LEDGER</span><h2>{mode === "competency" ? "See the evidence, word by word." : "Let’s see what sticks."}</h2><p>{mode === "competency" ? "Search every word in the independent index, then inspect exactly where your evidence came from." : "Answer from memory. Each move adds useful evidence to one word’s competency trail."}</p></div>
            <div className="hero-stat"><span>TESTED</span><strong><Flame size={18} fill="currentColor" /> {summary.testedWords}</strong><small>of 5,000 words</small></div>
          </section>

          {mode === "exam" && (!roundComplete && currentQuestion ? (
            <section className="exam-layout" aria-live="polite">
              <div className="exam-head"><div className="round-label"><span className="stamp">ROUND {String(questionIndex + 1).padStart(2, "0")} / {String(questions.length).padStart(2, "0")}</span><span className="mode-tag">{currentQuestion.kind === "true-false" ? "TRUE / FALSE" : "MULTIPLE CHOICE"}</span></div><div className="step-progress"><span style={{ width: `${Math.max(roundProgress, 7)}%` }} /></div></div>
              <article className={`question-card field-sheet ${submitted ? (isCurrentCorrect ? "correct" : "incorrect") : ""}`}>
                <div className="question-topline"><span className="word-level">{currentQuestion.level} · {currentQuestion.partOfSpeech} · logged to competency</span><span className="question-id">0{currentQuestion.id}</span></div>
                <h3>{currentQuestion.prompt}</h3>
                {currentQuestion.kind === "true-false" ? <div className="statement-box"><span className="quote-mark">“</span><p>{currentQuestion.statement}</p><span className="quote-mark end">”</span></div> : null}
                <div className={`answer-grid ${currentQuestion.kind === "true-false" ? "binary" : ""}`}>{(currentQuestion.kind === "true-false" ? [true, false] : currentQuestion.options ?? []).map((option, index) => { const value = currentQuestion.kind === "true-false" ? option as boolean : index; const isSelected = selected === value; const isAnswer = currentQuestion.kind === "true-false" ? value === currentQuestion.truth : value === currentQuestion.answer; const stateClass = submitted && isAnswer ? "is-answer" : submitted && isSelected ? "is-wrong" : isSelected ? "is-selected" : ""; return <button key={String(option)} className={`answer-option ${stateClass}`} onClick={() => !submitted && setSelected(value)} aria-pressed={isSelected}><span className="answer-letter">{currentQuestion.kind === "true-false" ? (value ? "T" : "F") : String.fromCharCode(65 + index)}</span><span>{currentQuestion.kind === "true-false" ? (value ? "True" : "False") : option}</span>{submitted && isAnswer ? <Check size={19} /> : submitted && isSelected ? <X size={19} /> : <ArrowRight size={17} />}</button>; })}</div>
                <div className="question-actions"><span className="hint"><CircleHelp size={16} /> {currentQuestion.note}</span>{!submitted ? <button className="primary-button" onClick={submitAnswer} disabled={selected === null}>Check answer <ArrowRight size={17} /></button> : <button className="primary-button" onClick={nextQuestion}>{questionIndex === questions.length - 1 ? "See results" : "Next card"} <ArrowRight size={17} /></button>}</div>
              </article>
              {submitted && <div className={`feedback-note ${isCurrentCorrect ? "good" : "needs-work"}`}><div className="feedback-icon">{isCurrentCorrect ? <Check size={18} /> : <CircleAlert size={18} />}</div><div><strong>{isCurrentCorrect ? "That one landed." : "That word needs another pass."}</strong><p>{currentQuestion.example}</p></div><span className="feedback-score">{isCurrentCorrect ? "Logged +" : "Miss logged"}<small>field test evidence</small></span></div>}
            </section>
          ) : (
            <section className="completion-card"><div className="completion-art"><img src={BURST_URL} alt="Celebration burst" /><Trophy size={36} /></div><span className="eyebrow">FIELD TEST COMPLETE</span><h2>{score >= 6 ? "A solid round." : "Useful evidence."}</h2><p>You answered <strong>{score} of {answered || questions.length}</strong> correctly. Every response now belongs to a word-level trail you can inspect.</p><div className="result-grid"><div><strong>{Math.round((score / questions.length) * 100)}%</strong><span>round accuracy</span></div><div><strong>{summary.wordSense}%</strong><span>word sense</span></div><div><strong>{summary.testedWords}</strong><span>words with evidence</span></div></div><div className="completion-actions"><button className="primary-button" onClick={startRound}><RotateCcw size={17} /> Run it again</button><button className="quiet-button" onClick={() => setMode("competency")}>View competency <BarChart3 size={17} /></button></div></section>
          ))}

          {mode === "flashcards" && <section className="mode-panel flashcard-panel"><div className="panel-intro"><div><span className="eyebrow">CARD STACK · EVIDENCE MODE</span><h2>Meet the words you almost know.</h2><p>Reveal the context, then make an honest call. Your choice contributes to the same word record as the field test.</p></div><span className="card-counter">{(flashcardIndex % questions.length) + 1} / {questions.length}</span></div><button className={`flashcard ${flipped ? "flipped" : ""}`} onClick={() => setFlipped((value) => !value)} aria-label={flipped ? "Show word side" : "Reveal definition"}><span className="flashcard-side front"><span className="stamp">REVIEW CARD</span><strong>{flashcardWord.word}</strong><small>{flashcardWord.level} · {flashcardWord.partOfSpeech} · card stack evidence</small><span className="flip-prompt"><Layers size={16} /> Tap to reveal</span></span><span className="flashcard-side back"><span className="stamp">CAN YOU USE IT?</span><strong>{flashcardWord.example}</strong><small>{flashcardWord.note}</small><span className="flip-prompt">Tap to flip back</span></span></button><div className="flash-actions"><button className="quiet-button" onClick={() => rateFlashcard(false)}><CircleAlert size={17} /> Still learning</button><button className="primary-button" onClick={() => rateFlashcard(true)} disabled={!flipped}><Check size={17} /> I knew this</button></div></section>}

          {mode === "competency" && <section className="competency-workspace">
            <div className="competency-heading"><div><span className="eyebrow">COMPETENCY LEDGER</span><h2>Every word. One honest trail.</h2><p>All 5,000 entries are browseable. Click a word to see accuracy, misses, comprehension, and which game created the evidence.</p></div><a className="source-link" href="https://www.oxfordlearnersdictionaries.com/us/wordlists/oxford3000-5000" target="_blank" rel="noreferrer"><LibraryBig size={17} /> Oxford reference <ExternalLink size={14} /></a></div>
            <div className="competency-scorecards"><article className="scorecard scorecard-main"><span className="card-kicker">WORD SENSE</span><strong>{summary.wordSense}%</strong><EvidenceMeter value={summary.wordSense} /><p>{summary.knownEquivalent} known-word equivalent across this 5,000-word capacity index.</p></article><article className="scorecard"><span className="card-kicker">VOCABULARY COVERAGE</span><strong>{summary.cefrEstimate}</strong><p>{summary.cefrDetail}</p><span className="caution-line"><CircleAlert size={14} /> Not a CEFR test.</span></article><article className="scorecard"><span className="card-kicker">EVIDENCE</span><strong>{summary.totalAttempts}</strong><p>{summary.testedWords} tested words · {summary.accuracy ?? "—"}% accuracy</p><div className="mini-tiers">{(["S", "A", "B", "C", "D", "E"] as CompetencyTier[]).map((tier) => <span key={tier}><TierBadge tier={tier} /> {summary.tierCounts[tier]}</span>)}</div></article></div>
            <div className="cefr-disclaimer"><ShieldCheck size={20} /><p><strong>Read this as vocabulary evidence, not a language diagnosis.</strong> The coverage label uses only logged activity in this independent index. Listening, speaking, writing, grammar, and formal test performance are not measured here.</p></div>
            <div className="directory-grid"><section className="word-directory" aria-label="Vocabulary directory"><div className="directory-toolbar"><div className="directory-title"><div><span className="stamp">THE 5,000</span><h3>Vocabulary directory</h3></div><span>{filteredRecords.length.toLocaleString()} matches</span></div><label className="search-box"><Search size={18} /><span className="sr-only">Search words</span><input value={search} onChange={(event) => { setSearch(event.target.value); resetDirectoryPage(); }} placeholder="Find a word…" /></label><div className="filter-row"><label><ListFilter size={15} /><span className="sr-only">Filter by tier</span><select value={tierFilter} onChange={(event) => { setTierFilter(event.target.value as TierFilter); resetDirectoryPage(); }}><option value="all">All tiers</option>{(["S", "A", "B", "C", "D", "E", "F"] as CompetencyTier[]).map((tier) => <option key={tier} value={tier}>{tier} · {tierLabel(tier)}</option>)}</select></label><label><span className="sr-only">Filter by reference band</span><select value={bandFilter} onChange={(event) => { setBandFilter(event.target.value as BandFilter); resetDirectoryPage(); }}><option value="all">All bands</option>{(["A1", "A2", "B1", "B2", "C1", "C2"] as BandFilter[]).filter((band): band is Exclude<BandFilter, "all"> => band !== "all").map((band) => <option key={band} value={band}>{band} reference band</option>)}</select></label><label><span className="sr-only">Sort directory</span><select value={sortMode} onChange={(event) => { setSortMode(event.target.value as SortMode); resetDirectoryPage(); }}><option value="attention">Needs attention</option><option value="misses">Most misses</option><option value="comprehension">Best comprehension</option><option value="rank">Frequency rank</option></select></label></div></div>
              <div className="directory-list" role="list">{visibleRecords.map((record) => <button className={`directory-row ${selectedRecord.id === record.id ? "selected" : ""}`} key={record.id} onClick={() => chooseDirectoryRecord(record)} role="listitem"><span className="rank-number">{String(record.rank).padStart(4, "0")}</span><strong>{record.word}</strong><span className="reference-band">{record.referenceBand}</span><EvidenceMeter value={record.comprehension} /><span className="row-misses">{record.misses ? `${record.misses} miss${record.misses === 1 ? "" : "es"}` : record.attempts ? "clear" : "new"}</span><TierBadge tier={record.tier} /></button>)}</div>
              <div className="directory-pager"><span>Showing {filteredRecords.length ? directoryPage * PAGE_SIZE + 1 : 0}–{Math.min((directoryPage + 1) * PAGE_SIZE, filteredRecords.length)} of {filteredRecords.length.toLocaleString()}</span><div><button className="pager-button" disabled={directoryPage === 0} onClick={() => setDirectoryPage((value) => Math.max(0, value - 1))}><ChevronLeft size={17} /> Previous</button><span>Page {directoryPage + 1} / {pageCount}</span><button className="pager-button" disabled={directoryPage >= pageCount - 1} onClick={() => setDirectoryPage((value) => Math.min(pageCount - 1, value + 1))}>Next <ChevronRight size={17} /></button></div></div></section>
              <aside className="word-detail" aria-live="polite"><div className="detail-paper"><div className="detail-topline"><span className="eyebrow">WORD RECORD / {String(selectedRecord.rank).padStart(4, "0")}</span><TierBadge tier={selectedRecord.tier} /></div><h3>{selectedRecord.word}</h3><div className="detail-meta"><span>{selectedQuestion ? `${selectedQuestion.level} · ${selectedQuestion.partOfSpeech}` : `${selectedRecord.referenceBand} reference band`}</span><span>Zipf {selectedRecord.zipf}</span></div><div className="detail-score"><div><strong>{selectedRecord.comprehension}%</strong><span>comprehension</span></div><EvidenceMeter value={selectedRecord.comprehension} /></div><div className="detail-stat-grid"><div><strong>{selectedRecord.attempts}</strong><span>attempts</span></div><div><strong>{selectedRecord.correct}</strong><span>correct</span></div><div><strong>{selectedRecord.misses}</strong><span>misses</span></div></div>{selectedQuestion ? <blockquote>“{selectedQuestion.example}”</blockquote> : <p className="detail-note">This entry is ready for evidence. Definitions and additional game prompts can be added as the study library grows.</p>}<div className="game-evidence"><h4>Where the evidence came from</h4>{(["field-test", "card-stack"] as GameKey[]).map((game) => { const evidence = selectedRecord.byGame[game]; return <div key={game} className="game-evidence-row"><span>{game === "field-test" ? <Target size={15} /> : <Layers size={15} />}{game === "field-test" ? "Field test" : "Card stack"}</span><strong>{evidence.attempts ? `${evidence.correct}/${evidence.attempts}` : "No attempts"}</strong><small>{evidence.misses ? `${evidence.misses} miss${evidence.misses === 1 ? "" : "es"}` : evidence.attempts ? "Clear" : "—"}</small></div>})}</div><div className="detail-history"><h4>Recent marks</h4>{selectedAttempts.length ? <ul>{selectedAttempts.slice(0, 5).map((attempt) => <li key={attempt.id}><span className={attempt.correct ? "mark-good" : "mark-miss"}>{attempt.correct ? <Check size={13} /> : <X size={13} />}</span><span><strong>{attempt.game === "field-test" ? "Field test" : "Card stack"}</strong><small>{formatAttemptTime(attempt.at)}</small></span></li>)}</ul> : <p>No attempts yet. Try a word in Field Test or Card Stack to begin this record.</p>}</div>{missedGames.length > 0 && <div className="attention-note"><CircleAlert size={16} /><span>Missed in {missedGames.map((game) => game === "field-test" ? "Field Test" : "Card Stack").join(" and ")}. A second pass here can sharpen the signal.</span></div>}</div></aside></div>
          </section>}
          <footer className="main-footer"><span><Sparkles size={15} /> Made for learning by doing.</span><span>Local progress · Open-source practice ledger.</span></footer>
        </main>
      </div>
    </div>
  );
}
