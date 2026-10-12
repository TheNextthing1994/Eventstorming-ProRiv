import type { IsaTeamQuestion } from '../data/isaTeamQuestions';
import type { IsaQuestionNote, IsaQuestionNotes, WorkshopNote, WorkshopNotes } from '../types';
import { catalogQuestionsForRoleSource } from '../data/roleQuestionLinks';

export function legacyEntriesForQuestion(questionId: string, legacyNotes: WorkshopNotes): Array<{ answer: string; revisedRecommendation?: string }> {
  const result: Array<{ answer: string; revisedRecommendation?: string }> = [];
  for (const [key, rawNote] of Object.entries(legacyNotes)) {
    const note = rawNote as WorkshopNote;
    if (key.includes(questionId) || key.includes('admin:') || key.includes('process:')) {
      if (note.answer || note.revisedRecommendation) {
        result.push({ answer: note.answer, revisedRecommendation: note.revisedRecommendation });
      }
    }
  }
  return result;
}

export function relatedEntriesForQuestion(question: IsaTeamQuestion, notes: IsaQuestionNotes): IsaTeamQuestion[] {
  const sourceKeys = question.sourceKeys;
  return catalogQuestionsForRoleSource(sourceKeys[0] || '').filter(q => q.id !== question.id);
}

export function reuseQuestionEntry(currentNote: IsaQuestionNote, entry: { answer: string; revisedRecommendation?: string }): Partial<IsaQuestionNote> {
  const textToReuse = entry.revisedRecommendation || entry.answer;
  const proposal = currentNote.proposal ? `${currentNote.proposal}\n\n${textToReuse}` : textToReuse;
  return {
    proposal,
    comment: currentNote.comment,
    isaConfirmed: false,
  };
}

export function isaNoteAsWorkshopNote(note: IsaQuestionNote): WorkshopNote {
  return {
    status: note.isaConfirmed ? 'decided' : note.reviewed ? 'in_progress' : 'unanswered',
    answer: note.answer || note.proposal,
    revisedRecommendation: note.proposal,
    isaConfirmed: !!note.isaConfirmed,
    owner: note.owner,
    nextStep: note.nextStep,
    updatedAt: new Date().toISOString(),
  };
}
