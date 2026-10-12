import { roleLegacyKeysForQuestion } from '../data/roleQuestionLinks';
import type { WorkshopNote, WorkshopNotes } from '../db/indexedDb';
import type { IsaQuestionNote, IsaQuestionNotes } from '../types';
import { relatedIsaQuestions } from './isaQuestions';
import type { IsaTeamQuestion } from '../data/isaTeamQuestions';

export function isaNoteAsWorkshopNote(note?: IsaQuestionNote): WorkshopNote {
  return { status: note?.status ?? (note?.reviewed ? 'test' : 'open'), answer: note?.answer ?? '',
    revisedRecommendation: note?.proposal ?? '', isaConfirmed: note?.isaConfirmed ?? false,
    owner: note?.owner ?? '', nextStep: note?.nextStep ?? '', updatedAt: note?.updatedAt ?? '' };
}
export interface ExistingQuestionEntry { key: string; text: string; proposal: string; answer: string; comment?: string }
export function legacyEntriesForQuestion(id: string, notes: WorkshopNotes): ExistingQuestionEntry[] {
  return roleLegacyKeysForQuestion(id).flatMap(({ key, text }) => {
    const note = notes[key];
    return note && (note.answer.trim() || note.revisedRecommendation?.trim())
      ? [{ key, text, proposal: note.revisedRecommendation ?? '', answer: note.answer }] : [];
  });
}
export function relatedEntriesForQuestion(question: IsaTeamQuestion, notes: IsaQuestionNotes): ExistingQuestionEntry[] {
  return relatedIsaQuestions(question).flatMap(other => {
    const note = notes[other.id];
    return note && (note.answer?.trim() || note.proposal.trim())
      ? [{ key: other.id, text: other.text.de, proposal: note.proposal, answer: note.answer ?? '', comment: note.comment }] : [];
  });
}
// Reuse is explicit, as a draft. It never marks a broader related question
// complete or imports somebody else's client-confirmation flag.
export function reuseQuestionEntry(current: IsaQuestionNote, entry: ExistingQuestionEntry): Partial<IsaQuestionNote> {
  const append = (old: string, text: string) => !text.trim() || old === text ? old : old.trim() ? old + '\n\n' + text : text;
  return { proposal: append(current.proposal, entry.proposal), answer: append(current.answer ?? '', entry.answer),
    comment: append(current.comment, entry.comment ?? ''), isaConfirmed: false };
}
