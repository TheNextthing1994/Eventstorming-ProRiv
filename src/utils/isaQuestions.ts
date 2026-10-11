import { ISA_QUESTION_GROUPS, ISA_TEAM_QUESTIONS, type IsaTeamQuestion, type IsaQuestionView } from '../data/isaTeamQuestions';
import { ISA_QUESTION_STAGES } from '../data/isaQuestionStages';
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
  return isaQuestionsForView('all').filter(question => notes[question.id]?.includeInIsa);
}

export function isaQuestionsForView(view: IsaQuestionView): IsaTeamQuestion[] {
  return view === 'all' ? ISA_QUESTION_STAGES.flatMap(stage => ISA_TEAM_QUESTIONS.filter(question => question.stageId === stage.id))
    : ISA_TEAM_QUESTIONS.filter(question => question.catalog === view);
}

export function isaGroupsForView(view: IsaQuestionView) {
  return view === 'all' ? ISA_QUESTION_STAGES : ISA_QUESTION_GROUPS.filter(group => group.catalog === view);
}

export function isaQuestionGroupId(question: IsaTeamQuestion, view: IsaQuestionView): string {
  return view === 'all' ? question.stageId : question.groupId;
}

export function isaQuestionLabel(question: IsaTeamQuestion, language: Language): string {
  const label = question.catalog === 'team' ? { de: 'Teamfrage', ru: 'Основной вопрос' }
    : question.catalog === 'roles' ? { de: 'Rollenfrage', ru: 'Вопрос по роли' } : { de: 'Ergänzung', ru: 'Дополнение' };
  return (language === 'ru' ? label.ru : label.de) + ' ' + question.number;
}

export function relatedIsaQuestions(question: IsaTeamQuestion): IsaTeamQuestion[] {
  const ids = new Set(question.relatedIds || []);
  for (const candidate of ISA_TEAM_QUESTIONS) if (candidate.relatedIds?.includes(question.id)) ids.add(candidate.id);
  return ISA_TEAM_QUESTIONS.filter(candidate => candidate.id !== question.id && ids.has(candidate.id));
}

export function isaQuestionSources(question: IsaTeamQuestion, language: Language): string[] {
  const labels: Record<string, [string, string]> = {
    amruddy: ['Fragen Amruddy · Original', 'Fragen Amruddy · оригинал'],
    admin: ['Admin-Rollen-Workshop', 'Разбор роли администратора'], process: ['Prozess-Workshop', 'Разбор процесса'],
    senior: ['Senior-Entscheidungsfragen', 'Вопросы сеньора'], open: ['Offene Projektpunkte', 'Открытые вопросы проекта'],
    sketch: ['Senior-Skizze', 'Эскиз сеньора'], event: ['Event Storming', 'Event Storming'],
    raw: ['Kundengespräch', 'Разговор с клиентом'], screenshots: ['Vergleich alter und neuerer Rapporte', 'Сравнение старых и новых рапортов'],
    gate: ['Living Process Map V0.2', 'Living Process Map V0.2'], qa: ['Event-Storming-Entscheidungen V2', 'Решения Event Storming V2'],
    diagram: ['Historischer Event-Storming-Entwurf', 'Прежний черновик Event Storming'],
    diagramv2: ['Event Storming V2', 'Event Storming V2'],
    price: ['Aktuelle Preisliste', 'Текущий прайс'], analysis: ['Ergänzung aus der Ablaufprüfung', 'Дополнение при проверке процесса'],
  };
  return [...new Set(question.sourceKeys.map(key => labels[key.split(':')[0]]?.[language === 'ru' ? 1 : 0]).filter((label): label is string => !!label))];
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
  for (const group of ISA_QUESTION_STAGES) {
      const questions = selected.filter(question => question.stageId === group.id);
      if (!questions.length) continue;
      lines.push('## ' + (ru ? group.title.ru : group.title.de), '');
      for (const question of questions) {
        const note = notes[question.id];
        lines.push('#### ' + (++number) + '. ' + t('Frage', 'Вопрос'), '', questionCopy(question, language), '');
        if (question.context) {
          const context = question.context.text;
          lines.push('**' + t('Vorhandene Grundlage · zu bestätigen', 'Имеющиеся сведения · подтвердить') + ':**', '',
            language === 'ru' ? context.ru : language === 'bilingual' ? context.de + '\n\n' + context.ru : context.de, '');
        }
        if (note.proposal.trim()) lines.push('**' + t('Unser Vorschlag an Isa', 'Наше предложение Исе') + ':**', '', note.proposal.trim(), '');
        if (includeComments && note.comment.trim()) lines.push('**' + t('Kommentar des Teams', 'Комментарий команды') + ':**', '', note.comment.trim(), '');
        lines.push('**' + t('Antwort von Isa', 'Ответ Исы') + ':** ____________________', '');
      }
  }
  return lines.join('\n');
}

/** Complete reading list; selections and meeting notes have their own export. */
export function isaCatalogMarkdown(language: Language = 'bilingual'): string {
  const ru = language === 'ru';
  const localized = (text: { de: string; ru: string }) => ru ? text.ru : language === 'bilingual' ? text.de + '\n\n' + text.ru : text.de;
  const additions = ISA_TEAM_QUESTIONS.filter(question => question.catalog === 'project').length;
  const lines = [
    '# ' + (ru ? 'Полный список вопросов · ProRiv (проект Исы)' : "Gesamtkatalog der Fragen · ProRiv (Isa's Projekt)"), '',
    ru ? `95 исходных вопросов сохранены без изменений. ${additions} дополнительных вопросов закрывают другие решения процесса.`
      : `Die 95 Originalfragen bleiben erhalten. ${additions} Ergänzungen klären zusätzliche Entscheidungen im Ablauf.`, '',
    ru ? 'Похожие вопросы могут раскрывать разные роли. Уже известные сведения служат основой обсуждения; предложения ещё не являются решениями.'
      : 'Ähnliche Fragen können unterschiedliche Rollen klären. Vorhandene Erkenntnisse dienen als Gesprächsgrundlage; Vorschläge sind noch keine Entscheidungen.', '',
  ];
  let number = 0;
  for (const stage of ISA_QUESTION_STAGES) {
    lines.push('## ' + (ru ? stage.title.ru : stage.title.de), '', localized(stage.events), '');
    for (const question of isaQuestionsForView('all').filter(question => question.stageId === stage.id)) {
      lines.push(`### ${++number}. ${isaQuestionLabel(question, language)} · ${ru ? question.title.ru : question.title.de}`, '', localized(question.text), '');
      if (question.context) lines.push(localized(question.context.text).split('\n').map(line => line ? '> ' + line : '>').join('\n'), '');
      lines.push((ru ? 'Источник: ' : 'Quelle: ') + isaQuestionSources(question, language).join(' · '), '', `ID: ${question.id}`, '');
    }
  }
  return lines.join('\n').trimEnd() + '\n';
}
