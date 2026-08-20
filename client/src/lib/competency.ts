/* Word Quest style reminder: competency evidence stays candid, inspectable, and game-agnostic. */
import type { VocabularyEntry } from "@/data/vocabulary";

export type GameKey = "field-test" | "card-stack";

export type Attempt = {
  id: string;
  wordId: string;
  game: GameKey;
  correct: boolean;
  at: string;
};

export type CompetencyTier = "F" | "E" | "D" | "C" | "B" | "A" | "S";

export type GameEvidence = {
  attempts: number;
  correct: number;
  misses: number;
};

export type CompetencyRecord = VocabularyEntry & {
  attempts: number;
  correct: number;
  misses: number;
  accuracy: number | null;
  comprehension: number;
  tier: CompetencyTier;
  byGame: Record<GameKey, GameEvidence>;
  latestAttempt?: Attempt;
};

export type VocabularySummary = {
  wordSense: number;
  knownEquivalent: number;
  testedWords: number;
  totalAttempts: number;
  accuracy: number | null;
  tierCounts: Record<CompetencyTier, number>;
  cefrEstimate: string;
  cefrDetail: string;
};

const EMPTY_GAME_EVIDENCE: GameEvidence = { attempts: 0, correct: 0, misses: 0 };

export const TIER_ORDER: CompetencyTier[] = ["S", "A", "B", "C", "D", "E", "F"];

export function getTier(score: number, attempted: boolean): CompetencyTier {
  if (!attempted) return "F";
  if (score >= 95) return "S";
  if (score >= 85) return "A";
  if (score >= 70) return "B";
  if (score >= 55) return "C";
  if (score >= 40) return "D";
  if (score >= 20) return "E";
  return "F";
}

export function tierLabel(tier: CompetencyTier) {
  return ({ S: "Secure", A: "Strong", B: "Growing", C: "Familiar", D: "Fragile", E: "Early", F: "Fresh" })[tier];
}

function getComprehension(correct: number, attempts: number) {
  if (attempts === 0) return 0;
  const accuracy = correct / attempts;
  const evidenceBonus = Math.min(attempts * 8, 32);
  return Math.round(Math.min(100, accuracy * 68 + evidenceBonus));
}

export function buildCompetencyRecords(entries: VocabularyEntry[], attempts: Attempt[]) {
  const grouped = new Map<string, Attempt[]>();
  attempts.forEach((attempt) => {
    const current = grouped.get(attempt.wordId) ?? [];
    current.push(attempt);
    grouped.set(attempt.wordId, current);
  });

  const records = entries.map<CompetencyRecord>((entry) => {
    const wordAttempts = (grouped.get(entry.id) ?? []).sort((a, b) => b.at.localeCompare(a.at));
    const byGame: Record<GameKey, GameEvidence> = {
      "field-test": { ...EMPTY_GAME_EVIDENCE },
      "card-stack": { ...EMPTY_GAME_EVIDENCE },
    };
    wordAttempts.forEach((attempt) => {
      const game = byGame[attempt.game];
      game.attempts += 1;
      if (attempt.correct) game.correct += 1;
      else game.misses += 1;
    });
    const correct = wordAttempts.filter((attempt) => attempt.correct).length;
    const misses = wordAttempts.length - correct;
    const comprehension = getComprehension(correct, wordAttempts.length);
    return {
      ...entry,
      attempts: wordAttempts.length,
      correct,
      misses,
      accuracy: wordAttempts.length ? Math.round((correct / wordAttempts.length) * 100) : null,
      comprehension,
      tier: getTier(comprehension, wordAttempts.length > 0),
      byGame,
      latestAttempt: wordAttempts[0],
    };
  });

  return new Map(records.map((record) => [record.id, record]));
}

function getCefrEstimate(knownEquivalent: number, testedWords: number) {
  if (testedWords < 10) {
    return { label: "Baseline forming", detail: "Log at least 10 words before using the vocabulary-coverage estimate." };
  }
  if (knownEquivalent < 350) return { label: "Below A1 coverage", detail: "Early evidence across the 5,000-word index." };
  if (knownEquivalent < 1000) return { label: "A1 coverage", detail: "Core everyday vocabulary coverage is emerging." };
  if (knownEquivalent < 2000) return { label: "A2 coverage", detail: "Everyday vocabulary coverage is building." };
  if (knownEquivalent < 3200) return { label: "B1 coverage", detail: "Independent-user vocabulary coverage is developing." };
  if (knownEquivalent < 4300) return { label: "B2 coverage", detail: "Upper-intermediate vocabulary coverage is developing." };
  if (knownEquivalent < 5000) return { label: "C1 coverage", detail: "Advanced vocabulary coverage is developing." };
  return { label: "C2 coverage", detail: "Near-complete coverage of this app’s 5,000-word index." };
}

export function summarizeVocabulary(records: Iterable<CompetencyRecord>): VocabularySummary {
  const all = Array.from(records);
  const tested = all.filter((record) => record.attempts > 0);
  const totalAttempts = tested.reduce((sum, record) => sum + record.attempts, 0);
  const totalCorrect = tested.reduce((sum, record) => sum + record.correct, 0);
  const knownEquivalent = all.reduce((sum, record) => sum + record.comprehension / 100, 0);
  const estimate = getCefrEstimate(knownEquivalent, tested.length);
  const tierCounts = all.reduce<Record<CompetencyTier, number>>((counts, record) => {
    if (record.attempts > 0) counts[record.tier] += 1;
    return counts;
  }, { S: 0, A: 0, B: 0, C: 0, D: 0, E: 0, F: 0 });

  return {
    wordSense: Math.round((knownEquivalent / all.length) * 1000) / 10,
    knownEquivalent: Math.round(knownEquivalent * 10) / 10,
    testedWords: tested.length,
    totalAttempts,
    accuracy: totalAttempts ? Math.round((totalCorrect / totalAttempts) * 100) : null,
    tierCounts,
    cefrEstimate: estimate.label,
    cefrDetail: estimate.detail,
  };
}
