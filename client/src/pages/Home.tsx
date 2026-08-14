/* Word Quest style reminder: practice-first editorial desk; strong left rail, generous exam field, restrained print-like motion. */
import { useMemo, useState } from "react";
import {
  ArrowRight,
  BarChart3,
  BookOpenCheck,
  Check,
  ChevronRight,
  CircleAlert,
  CircleHelp,
  Compass,
  ExternalLink,
  Flame,
  Layers,
  LibraryBig,
  Menu,
  Play,
  RotateCcw,
  Shuffle,
  Sparkles,
  Target,
  Trophy,
  X,
} from "lucide-react";

type Mode = "exam" | "flashcards" | "review";
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

type Mastery = Record<string, number>;

const MASCOT_URL = "/manus-storage/word-quest-mascot_9824378d.svg";
const GLYPH_URL = "/manus-storage/word-quest-glyph_de34f19f.png";
const HERO_URL = "/manus-storage/word-quest-hero_46b80b9f.jpg";
const TEXTURE_URL = "/manus-storage/word-quest-card-texture_359109ee.jpg";
const BURST_URL = "/manus-storage/word-quest-streak-burst_10bd6cec.png";

const questions: Question[] = [
  {
    id: 1,
    word: "achieve",
    level: "A2",
    partOfSpeech: "verb",
    kind: "multiple-choice",
    prompt: "What does achieve mean?",
    options: ["To reach a goal", "To forget a plan", "To make something smaller", "To travel quickly"],
    answer: 0,
    example: "She worked steadily to achieve her reading goal.",
    note: "Think of a result you worked toward.",
  },
  {
    id: 2,
    word: "benefit",
    level: "A2",
    partOfSpeech: "noun",
    kind: "true-false",
    prompt: "Is this statement true or false?",
    statement: "A benefit is something that helps you or gives you an advantage.",
    truth: true,
    example: "One benefit of short quizzes is fast feedback.",
    note: "A benefit is a useful result.",
  },
  {
    id: 3,
    word: "aware",
    level: "B1",
    partOfSpeech: "adjective",
    kind: "multiple-choice",
    prompt: "If you are aware of a problem, you…",
    options: ["know about it", "hide it from everyone", "solve it by accident", "make it disappear"],
    answer: 0,
    example: "He became aware of the new words he kept missing.",
    note: "Awareness starts with noticing.",
  },
  {
    id: 4,
    word: "approach",
    level: "B2",
    partOfSpeech: "verb",
    kind: "true-false",
    prompt: "Is this statement true or false?",
    statement: "To approach a problem means to ignore it completely.",
    truth: false,
    example: "Try a different approach when a word still feels unclear.",
    note: "To approach something is to move toward it, physically or mentally.",
  },
  {
    id: 5,
    word: "accurate",
    level: "B2",
    partOfSpeech: "adjective",
    kind: "multiple-choice",
    prompt: "Which description is accurate?",
    options: ["Correct and free from mistakes", "Very loud and exciting", "Difficult to carry", "Done without a plan"],
    answer: 0,
    example: "Her answer was accurate, even though she answered quickly.",
    note: "Accuracy is about being right, not being fast.",
  },
  {
    id: 6,
    word: "convince",
    level: "B1",
    partOfSpeech: "verb",
    kind: "true-false",
    prompt: "Is this statement true or false?",
    statement: "If you convince someone, you help them accept that an idea is true or right.",
    truth: true,
    example: "The example convinced her that practice was working.",
    note: "Convince is about changing someone’s mind with reasons.",
  },
  {
    id: 7,
    word: "attempt",
    level: "B2",
    partOfSpeech: "noun",
    kind: "multiple-choice",
    prompt: "An attempt is…",
    options: ["an effort to do something", "a final celebration", "a word you already know", "a quiet place to study"],
    answer: 0,
    example: "This is your second attempt at the tricky question.",
    note: "An attempt can succeed or fail; the effort still counts.",
  },
  {
    id: 8,
    word: "confidence",
    level: "B2",
    partOfSpeech: "noun",
    kind: "true-false",
    prompt: "Is this statement true or false?",
    statement: "Confidence is the feeling that you can handle something.",
    truth: true,
    example: "Each accurate answer gave him a little more confidence.",
    note: "Confidence grows when your actions give you evidence.",
  },
];

const starterMastery: Mastery = {
  achieve: 72,
  benefit: 58,
  aware: 65,
  approach: 44,
  accurate: 61,
  convince: 52,
  attempt: 76,
  confidence: 69,
};

function loadMastery(): Mastery {
  try {
    const saved = window.localStorage.getItem("word-quest-mastery");
    return saved ? { ...starterMastery, ...JSON.parse(saved) } : starterMastery;
  } catch {
    return starterMastery;
  }
}

function getLevel(value: number) {
  if (value >= 80) return "Ready";
  if (value >= 60) return "Building";
  return "Review";
}

function Metric({ icon, label, value, detail }: { icon: React.ReactNode; label: string; value: string; detail: string }) {
  return (
    <div className="metric-card">
      <div className="metric-icon">{icon}</div>
      <div>
        <span>{label}</span>
        <strong>{value}</strong>
        <small>{detail}</small>
      </div>
    </div>
  );
}

export default function Home() {
  const [mode, setMode] = useState<Mode>("exam");
  const [questionIndex, setQuestionIndex] = useState(0);
  const [selected, setSelected] = useState<number | boolean | null>(null);
  const [submitted, setSubmitted] = useState(false);
  const [roundComplete, setRoundComplete] = useState(false);
  const [score, setScore] = useState(0);
  const [answered, setAnswered] = useState(0);
  const [mastery, setMastery] = useState<Mastery>(loadMastery);
  const [flashcardIndex, setFlashcardIndex] = useState(0);
  const [flipped, setFlipped] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  const competency = useMemo(() => {
    const values = Object.values(mastery);
    return Math.round(values.reduce((sum, value) => sum + value, 0) / values.length);
  }, [mastery]);

  const currentQuestion = questions[questionIndex];
  const reviewWords = useMemo(
    () => questions.filter((question) => (mastery[question.word] ?? 0) < 70),
    [mastery],
  );
  const flashcardWord = reviewWords[flashcardIndex % Math.max(reviewWords.length, 1)] ?? questions[0];
  const isCurrentCorrect = currentQuestion?.kind === "multiple-choice"
    ? selected === currentQuestion.answer
    : selected === currentQuestion.truth;

  function updateWord(word: string, correct: boolean) {
    setMastery((previous) => {
      const next = { ...previous, [word]: Math.max(0, Math.min(100, (previous[word] ?? 50) + (correct ? 8 : -6))) };
      window.localStorage.setItem("word-quest-mastery", JSON.stringify(next));
      return next;
    });
  }

  function submitAnswer() {
    if (selected === null || submitted) return;
    const correct = isCurrentCorrect;
    setSubmitted(true);
    setAnswered((value) => value + 1);
    setScore((value) => value + (correct ? 1 : 0));
    updateWord(currentQuestion.word, correct);
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
  }

  function chooseMode(nextMode: Mode) {
    setMode(nextMode);
    setMenuOpen(false);
    if (nextMode === "exam") startRound();
  }

  function rateFlashcard(correct: boolean) {
    updateWord(flashcardWord.word, correct);
    setFlipped(false);
    setFlashcardIndex((value) => value + 1);
  }

  const answeredPercent = Math.round((questionIndex / questions.length) * 100);

  return (
    <div className="app-shell">
      <header className="topbar">
        <button className="brand-lockup" onClick={startRound} aria-label="Return to Word Quest exam">
          <span className="brand-mark"><img src={GLYPH_URL} alt="" /></span>
          <span className="brand-word"><span className="brand-name">word</span><span className="brand-name quest">quest</span><i className="brand-underline"><b /></i></span>
        </button>
        <div className="topbar-meta">
          <span className="status-dot" />
          <span>Daily field test</span>
          <button className="mobile-menu" onClick={() => setMenuOpen((value) => !value)} aria-label="Open navigation"><Menu size={20} /></button>
        </div>
      </header>

      <div className="workspace">
        <aside className={`side-rail ${menuOpen ? "is-open" : ""}`}>
          <div className="rail-heading">
            <div>
              <span className="eyebrow">YOUR STUDY DESK</span>
              <h1>Build your word sense.</h1>
            </div>
            <span className="rail-date">14<br />AUG</span>
          </div>

          <div className="mascot-note">
            <img className="mascot" src={MASCOT_URL} alt="Learning mascot wearing a blue cap and glasses" />
            <div className="note-copy">
              <span className="note-pin" />
              <p>{mode === "exam" ? "No peeking. Your first instinct is useful data." : "Tiny rounds make big words less intimidating."}</p>
            </div>
          </div>

          <nav className="mode-nav" aria-label="Study modes">
            <button className={mode === "exam" ? "active" : ""} onClick={() => chooseMode("exam")}>
              <span className="nav-icon"><Target size={17} /></span><span>Field test</span><ChevronRight size={16} />
            </button>
            <button className={mode === "flashcards" ? "active" : ""} onClick={() => chooseMode("flashcards")}>
              <span className="nav-icon"><Layers size={17} /></span><span>Card stack</span><span className="nav-count">{reviewWords.length}</span>
            </button>
            <button className={mode === "review" ? "active" : ""} onClick={() => chooseMode("review")}>
              <span className="nav-icon"><BarChart3 size={17} /></span><span>Competency</span><ChevronRight size={16} />
            </button>
          </nav>

          <div className="rail-divider" />

          <div className="competency-mini">
            <div className="mini-label"><span>WORD SENSE</span><strong>{competency}%</strong></div>
            <div className="competency-tape" aria-label={`Current word sense ${competency}%`}>
              {Array.from({ length: 10 }, (_, index) => <i key={index} className={index < Math.round(competency / 10) ? "filled" : ""} />)}
            </div>
            <p>{competency >= 70 ? "A strong start. Keep the edges sharp." : "A few words are asking for another pass."}</p>
          </div>

          <div className="rail-footer">
            <div className="source-stamp"><LibraryBig size={15} /><span>Inspired by the<br /><a href="https://www.oxfordlearnersdictionaries.com/us/wordlists/oxford3000-5000" target="_blank" rel="noreferrer">Oxford 3000–5000 <ExternalLink size={11} /></a></span></div>
            <small>Starter sample only — not an official Oxford product.</small>
          </div>
        </aside>

        <main className="main-field">
          <section className="hero-strip" style={{ backgroundImage: `url(${HERO_URL})` }}>
            <div className="hero-copy">
              <span className="eyebrow light">ROUND 01 / 12</span>
              <h2>Let’s see what sticks.</h2>
              <p>Answer from memory. Then use the feedback to decide what deserves another look.</p>
            </div>
            <div className="hero-stat"><span>STREAK</span><strong><Flame size={18} fill="currentColor" /> 3</strong><small>days in a row</small></div>
          </section>

          {mode === "exam" && (
            <>
              {!roundComplete && currentQuestion ? (
                <section className="exam-layout" aria-live="polite">
                  <div className="exam-head">
                    <div className="round-label"><span className="stamp">ROUND {String(questionIndex + 1).padStart(2, "0")} / {String(questions.length).padStart(2, "0")}</span><span className="mode-tag">{currentQuestion.kind === "true-false" ? "TRUE / FALSE" : "MULTIPLE CHOICE"}</span></div>
                    <div className="step-progress"><span style={{ width: `${Math.max(answeredPercent, 7)}%` }} /></div>
                  </div>

                  <article className={`question-card field-sheet ${submitted ? (isCurrentCorrect ? "correct" : "incorrect") : ""}`}>
                    <div className="question-topline"><span className="word-level">{currentQuestion.level} · {currentQuestion.partOfSpeech}</span><span className="question-id">0{currentQuestion.id}</span></div>
                    <h3>{currentQuestion.prompt}</h3>
                    {currentQuestion.kind === "true-false" ? (
                      <div className="statement-box"><span className="quote-mark">“</span><p>{currentQuestion.statement}</p><span className="quote-mark end">”</span></div>
                    ) : null}

                    <div className={`answer-grid ${currentQuestion.kind === "true-false" ? "binary" : ""}`}>
                      {(currentQuestion.kind === "true-false" ? [true, false] : currentQuestion.options ?? []).map((option, index) => {
                        const value = currentQuestion.kind === "true-false" ? option as boolean : index;
                        const isSelected = selected === value;
                        const isAnswer = currentQuestion.kind === "true-false" ? value === currentQuestion.truth : value === currentQuestion.answer;
                        const stateClass = submitted && isAnswer ? "is-answer" : submitted && isSelected ? "is-wrong" : isSelected ? "is-selected" : "";
                        return <button key={String(option)} className={`answer-option ${stateClass}`} onClick={() => !submitted && setSelected(value)} aria-pressed={isSelected}>
                          <span className="answer-letter">{currentQuestion.kind === "true-false" ? (value ? "T" : "F") : String.fromCharCode(65 + index)}</span><span>{currentQuestion.kind === "true-false" ? (value ? "True" : "False") : option}</span>{submitted && isAnswer ? <Check size={19} /> : submitted && isSelected ? <X size={19} /> : <ArrowRight size={17} />}
                        </button>;
                      })}
                    </div>

                    <div className="question-actions">
                      <span className="hint"><CircleHelp size={16} /> {currentQuestion.note}</span>
                      {!submitted ? <button className="primary-button" onClick={submitAnswer} disabled={selected === null}>Check answer <ArrowRight size={17} /></button> : <button className="primary-button" onClick={nextQuestion}>{questionIndex === questions.length - 1 ? "See results" : "Next card"} <ArrowRight size={17} /></button>}
                    </div>
                  </article>

                  {submitted && <div className={`feedback-note ${isCurrentCorrect ? "good" : "needs-work"}`}><div className="feedback-icon">{isCurrentCorrect ? <Check size={18} /> : <CircleAlert size={18} />}</div><div><strong>{isCurrentCorrect ? "That one landed." : "That word needs another pass."}</strong><p>{currentQuestion.example}</p></div><span className="feedback-score">{isCurrentCorrect ? "+8%" : "-6%"}<small>word sense</small></span></div>}
                </section>
              ) : (
                <section className="completion-card">
                  <div className="completion-art"><img src={BURST_URL} alt="Celebration burst" /><Trophy size={36} /></div>
                  <span className="eyebrow">FIELD TEST COMPLETE</span>
                  <h2>{score >= 6 ? "A solid round." : "Useful evidence."}</h2>
                  <p>You answered <strong>{score} of {answered || questions.length}</strong> correctly. The point is not a perfect score; it is knowing which words to meet again.</p>
                  <div className="result-grid"><div><strong>{Math.round((score / questions.length) * 100)}%</strong><span>round accuracy</span></div><div><strong>{competency}%</strong><span>word sense</span></div><div><strong>{reviewWords.length}</strong><span>cards to revisit</span></div></div>
                  <div className="completion-actions"><button className="primary-button" onClick={startRound}><RotateCcw size={17} /> Run it again</button><button className="quiet-button" onClick={() => setMode("review")}>View competency <BarChart3 size={17} /></button></div>
                </section>
              )}
            </>
          )}

          {mode === "flashcards" && (
            <section className="mode-panel flashcard-panel">
              <div className="panel-intro"><div><span className="eyebrow">CARD STACK</span><h2>Meet the words you almost know.</h2><p>Flip a card, make a guess, and tell the desk how it felt.</p></div><span className="card-counter">{Math.min(flashcardIndex + 1, Math.max(reviewWords.length, 1))} / {Math.max(reviewWords.length, 1)}</span></div>
              <button className={`flashcard ${flipped ? "flipped" : ""}`} onClick={() => setFlipped((value) => !value)} aria-label={flipped ? "Show word side" : "Reveal definition"}>
                <span className="flashcard-side front"><span className="stamp">REVIEW CARD</span><strong>{flashcardWord.word}</strong><small>{flashcardWord.level} · {flashcardWord.partOfSpeech}</small><span className="flip-prompt"><Shuffle size={16} /> Tap to reveal</span></span>
                <span className="flashcard-side back"><span className="stamp">CAN YOU USE IT?</span><strong>{flashcardWord.example}</strong><small>{flashcardWord.note}</small><span className="flip-prompt">Tap to flip back</span></span>
              </button>
              <div className="flash-actions"><button className="quiet-button" onClick={() => rateFlashcard(false)}><CircleAlert size={17} /> Still learning</button><button className="primary-button" onClick={() => rateFlashcard(true)} disabled={!flipped}><Check size={17} /> I knew this</button></div>
            </section>
          )}

          {mode === "review" && (
            <section className="mode-panel review-panel">
              <div className="panel-intro"><div><span className="eyebrow">COMPETENCY MAP</span><h2>Your current word signal.</h2><p>A private, local snapshot of the starter set. It changes when you practice.</p></div><div className="big-competency"><strong>{competency}%</strong><span>overall</span></div></div>
              <div className="review-list">{questions.map((word) => { const value = mastery[word.word] ?? 0; return <div className="review-row" key={word.word}><div className="review-word"><strong>{word.word}</strong><span>{word.level} · {getLevel(value)}</span></div><div className="review-bar"><span style={{ width: `${value}%` }} /></div><strong className="review-value">{value}%</strong></div>; })}</div>
              <div className="review-footer"><span><Sparkles size={17} /> The next best move is a short round, not a long cram session.</span><button className="primary-button" onClick={startRound}><Play size={17} /> Start a field test</button></div>
            </section>
          )}

          <footer className="main-footer"><span><Compass size={15} /> Made for learning by doing.</span><span>Local progress · No account needed for this MVP.</span></footer>
        </main>
      </div>
    </div>
  );
}
