import { ISA_QUESTION_GROUPS, ISA_TEAM_QUESTIONS, type IsaTeamQuestion } from '../data/isaTeamQuestions';
import type { IsaQuestionNote, IsaQuestionNotes, Language } from '../types';

export const EMPTY_ISA_QUESTION_NOTE: IsaQuestionNote = {
  includeInIsa: false, reviewed: false, comment: '', proposal: '', updatedAt: '',
};

const questionIds = new Set(ISA_TEAM_QUESTIONS.map(question => question.id));

export function changeIsaQuestionNote(notes: IsaQuestionNotes, id: string, change: Partial<IsaQuestionNote>): IsaQuestionNotes {
  if (!questionIds.has(id)) throw new Error('Unknown question');
  const current = notes[id] || EMPTY_ISA_QUESTION_NOTE;
  return { ...notes, [id]: {
    ...current, ...change,
    reviewed: change.includeInIsa === true ? true : change.reviewed ?? current.reviewed,
    updatedAt: new Date().toISOString(),
  } };
}

/** Strict validation protects existing notes from malformed or unrelated imports. */
export function parseIsaQuestionNotes(input: unknown): IsaQuestionNotes {
  if (!input || typeof input !== 'object' || Array.isArray(input)) throw new Error('Invalid question notes');
  const result: IsaQuestionNotes = {};
  for (const [id, item] of Object.entries(input)) {
    if (!questionIds.has(id) || !item || typeof item !== 'object') throw new Error('Unknown question in backup');
    const note = item as IsaQuestionNote;
    if (typeof note.includeInIsa !== 'boolean' || typeof note.reviewed !== 'boolean'
      || typeof note.comment !== 'string' || typeof note.proposal !== 'string' || typeof note.updatedAt !== 'string') {
      throw new Error('Invalid question note');
    }
    result[id] = { includeInIsa: note.includeInIsa, reviewed: note.reviewed, comment: note.comment, proposal: note.proposal, updatedAt: note.updatedAt };
  }
  return result;
}

export function isaQuestionsBackup(notes: IsaQuestionNotes): string {
  return JSON.stringify({ format: 'proriv-isa-questions', version: 1, createdAt: new Date().toISOString(), notes }, null, 2);
}

export function parseIsaQuestionsBackup(json: string): IsaQuestionNotes {
  const backup = JSON.parse(json);
  if (backup?.format !== 'proriv-isa-questions' || backup.version !== 1) throw new Error('Not an Isa question backup');
  return parseIsaQuestionNotes(backup.notes);
}

export function selectedIsaQuestions(notes: IsaQuestionNotes): IsaTeamQuestion[] {
  return ISA_TEAM_QUESTIONS.filter(question => notes[question.id]?.includeInIsa);
}

export function questionCopy(question: IsaTeamQuestion, language: Language): string {
  return language === 'ru' ? question.text.ru : language === 'bilingual' ? question.text.de + '\n\n' + question.text.ru : question.text.de;
}

export function isaTemplateMarkdown(notes: IsaQuestionNotes, language: Language = 'ru', includeComments = false): string {
  const ru = language === 'ru';
  const t = (de: string, russian: string) => ru ? russian : de;
  const selected = selectedIsaQuestions(notes);
  const lines = [
    '# ' + t("Fragen an Isa · ProRiv (Isa's Projekt)", 'Вопросы Исе · ProRiv (проект Исы)'), '',
    t('Bitte besprechen wir die folgenden Fragen. Unsere Vorschläge dienen als Gesprächsgrundlage.', 'Просим обсудить следующие вопросы. Наши предложения — основа для обсуждения.'), '',
    t('Ausgewählte Fragen: ', 'Выбранных вопросов: ') + selected.length, '',
  ];
  let number = 0;
  for (const catalog of ['team', 'roles'] as const) {
    const entries = selected.filter(question => question.catalog === catalog);
    if (!entries.length) continue;
    lines.push('## ' + (catalog === 'team' ? t('Team-Fragen', 'Основные вопросы') : t('Vertiefung nach Rollen', 'Уточнения по ролям')), '');
    for (const group of ISA_QUESTION_GROUPS.filter(item => item.catalog === catalog)) {
      const questions = entries.filter(question => question.groupId === group.id);
      if (!questions.length) continue;
      lines.push('### ' + (ru ? group.title.ru : group.title.de), '');
      for (const question of questions) {
        const note = notes[question.id];
        lines.push('#### ' + (++number) + '. ' + t('Frage', 'Вопрос'), '', questionCopy(question, language), '');
        if (note.proposal.trim()) lines.push('**' + t('Unser Vorschlag an Isa', 'Наше предложение Исе') + ':**', '', note.proposal.trim(), '');
        if (includeComments && note.comment.trim()) lines.push('**' + t('Kommentar des Teams', 'Комментарий команды') + ':**', '', note.comment.trim(), '');
        lines.push('**' + t('Antwort von Isa', 'Ответ Исы') + ':** ____________________', '');
      }
    }
  }
  return lines.join('\n');
}
