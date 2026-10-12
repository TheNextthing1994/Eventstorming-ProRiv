import React from 'react';
import { Check } from 'lucide-react';
import { ISA_STAGE_PLANS, ISA_STAGE_PLANNING_QUESTION_IDS, questionsForStagePlan, additionalQuestionsForStagePlan, selectedStageQuestions } from '../data/isaStagePlanning';
import type { IsaQuestionStageId } from '../data/isaQuestionStages';
import type { IsaTeamQuestion } from '../data/isaTeamQuestions';
import type { IsaQuestionNote, IsaQuestionNotes, Language } from '../types';
import type { IsaQuestionDrafts } from '../hooks/useIsaQuestionStore';
import { EMPTY_ISA_QUESTION_NOTE } from '../utils/isaQuestions';

interface QuestionProps {
  question: IsaTeamQuestion;
  note?: IsaQuestionNote;
  draft?: IsaQuestionNote;
  language: Language;
  editable: boolean;
  onSelect: (id: string, include: boolean) => void;
  onDraftChange: (id: string, change: Partial<IsaQuestionNote>) => void;
  onFinish: (id: string) => void;
  onCancel: (id: string) => void;
}

function Text({ text, language }: { text: { de: string; ru: string }; language: Language }) {
  return <>{language === 'ru' ? text.ru : text.de}{language === 'bilingual' && <span lang="ru" className="mt-2 block font-normal text-slate-500">{text.ru}</span>}</>;
}

export function IsaStageQuestion({ question, note = EMPTY_ISA_QUESTION_NOTE, draft, language, editable, onSelect, onDraftChange, onFinish, onCancel }: QuestionProps) {
  const t = (de: string, ru: string) => language === 'ru' ? ru : de;
  const title = language === 'ru' ? question.title.ru : question.title.de;
  const finish = () => { if (editable && draft) onFinish(question.id); };
  return <article id={'stage-question-' + question.id} className="rounded-xl border border-slate-200 bg-white p-4 sm:p-5 space-y-3">
    <div className="flex items-start justify-between gap-3">
      <label className="flex min-w-0 items-start gap-3 text-sm font-semibold leading-relaxed cursor-pointer">
        <input type="checkbox" aria-label={t('Für Isa übernehmen: ', 'Включить Исе: ') + title} checked={note.includeInIsa} disabled={!editable} onChange={event => onSelect(question.id, event.target.checked)} className="mt-1 h-4 w-4 shrink-0 accent-emerald-700" />
        <span><Text text={question.text} language={language} /></span>
      </label>
      {note.reviewed && <Check aria-label={t('Durchgesehen', 'Обсудили')} className="h-4 w-4 shrink-0 mt-1 text-emerald-700" />}
    </div>
    {question.context && <p className="rounded-lg bg-amber-50 p-3 text-xs leading-relaxed text-amber-900"><Text text={question.context.text} language={language} /></p>}
    <label className="block text-xs font-semibold text-emerald-900">
      {t('Teamvorschlag für Isa', 'Предложение команды Исе')}
      <textarea aria-label={t('Teamvorschlag für Isa: ', 'Предложение команды Исе: ') + title} disabled={!editable} rows={2}
        value={draft?.proposal ?? note.proposal} onChange={event => onDraftChange(question.id, { proposal: event.target.value })}
        onKeyDown={event => { if (event.key === 'Enter' && (event.ctrlKey || event.metaKey) && !event.nativeEvent.isComposing && editable && draft) { event.preventDefault(); finish(); } }}
        placeholder={t('Unser Vorschlag: Zum ersten Start brauchen wir …; später …', 'Наше предложение: к первому запуску нужно …; позже …')}
        className="mt-2 w-full rounded-lg border border-emerald-200 bg-emerald-50/30 p-2.5 text-sm leading-relaxed font-normal resize-y" />
    </label>
    <div className="flex flex-wrap items-center gap-3 text-xs">
      <button type="button" disabled={!editable || !draft} onClick={finish} className="rounded-lg bg-emerald-700 px-3 py-2 font-semibold text-white disabled:opacity-40">{t('Fertig', 'Готово')}</button>
      {draft ? <><button type="button" disabled={!editable} onClick={() => onCancel(question.id)} className="text-slate-500 underline">{t('Abbrechen', 'Отмена')}</button><span className="text-amber-800">{t('Entwurf · noch nicht gespeichert', 'Черновик · ещё не сохранён')}</span></> : <span className="text-slate-500">{note.proposal.trim() ? t('Gespeicherter Teamvorschlag', 'Предложение команды сохранено') : t('Haken: Diese Frage stellen wir Isa.', 'Отметка: этот вопрос задаём Исе.')}</span>}
    </div>
    {(note.answer?.trim() || note.comment.trim()) && <details className="text-xs text-slate-600"><summary className="cursor-pointer font-semibold">{t('Vorhandene Antwort und Teamnotizen', 'Имеющийся ответ и записи команды')}</summary>{note.answer?.trim() && <p className="mt-2 whitespace-pre-wrap"><strong>{note.isaConfirmed ? t('Von Isa bestätigt: ', 'Подтверждено Исой: ') : t('Festgehaltene Antwort: ', 'Записанный ответ: ')}</strong>{note.answer}</p>}{note.comment.trim() && <p className="mt-2 whitespace-pre-wrap"><strong>{t('Teamkommentar: ', 'Комментарий команды: ')}</strong>{note.comment}</p>}</details>}
  </article>;
}

interface Props {
  language: Language;
  activeStageId: IsaQuestionStageId;
  onStageChange: (id: IsaQuestionStageId) => void;
  notes: IsaQuestionNotes;
  drafts: IsaQuestionDrafts;
  editable: boolean;
  onSelect: QuestionProps['onSelect'];
  onDraftChange: QuestionProps['onDraftChange'];
  onFinish: QuestionProps['onFinish'];
  onCancel: QuestionProps['onCancel'];
}

export function IsaStagePlanning({ language, activeStageId, onStageChange, notes, drafts, editable, onSelect, onDraftChange, onFinish, onCancel }: Props) {
  const t = (de: string, ru: string) => language === 'ru' ? ru : de;
  const stage = ISA_STAGE_PLANS.find(item => item.id === activeStageId) || ISA_STAGE_PLANS[0];
  const index = ISA_STAGE_PLANS.indexOf(stage);
  const primary = questionsForStagePlan(stage.id);
  const additional = additionalQuestionsForStagePlan(stage.id);
  const selected = selectedStageQuestions(stage.id, notes);
  const chosenAdditional = additional.filter(q => notes[q.id]?.includeInIsa);
  const otherAdditional = additional.filter(q => !notes[q.id]?.includeInIsa);
  const row = (question: IsaTeamQuestion) => <IsaStageQuestion key={question.id} question={question} note={notes[question.id]} draft={drafts[question.id]} language={language} editable={editable} onSelect={onSelect} onDraftChange={onDraftChange} onFinish={onFinish} onCancel={onCancel} />;
  return <div className="space-y-4">
    <p className="text-xs font-semibold text-emerald-800">{ISA_STAGE_PLANS.length} {t('Etappen', 'этапов')} · {ISA_STAGE_PLANNING_QUESTION_IDS.length} {t('Fragen zum Arbeitsumfang', 'вопросов об объёме работ')}</p>
    <p className="text-sm text-slate-600">{t('Geht jede Etappe durch und legt fest, welche Fragen ihr Isa stellt. Notiert euren Vorschlag zur ersten Version. Die Auswahl erscheint in derselben Isa-Vorlage wie die Fragen aus dem Katalog.', 'Пройдите каждый этап и выберите вопросы Исе. Запишите предложение по первой версии. Выбор попадёт в ту же подборку, что и вопросы из каталога.')}</p>
    <div className="grid gap-4 lg:grid-cols-[260px_minmax(0,1fr)] items-start">
      <nav aria-label={t('Etappen vorbereiten', 'Подготовить этапы')} className="rounded-2xl border border-slate-200 bg-white p-3 lg:sticky lg:top-4">
        <ol className="grid gap-1 sm:grid-cols-2 lg:grid-cols-1">{ISA_STAGE_PLANS.map(item => {
          const count = selectedStageQuestions(item.id, notes).length;
          return <li key={item.id}><button type="button" aria-current={stage.id === item.id ? 'step' : undefined} onClick={() => onStageChange(item.id)} className={`w-full flex justify-between gap-2 rounded-lg p-3 text-left text-xs leading-relaxed ${stage.id === item.id ? 'bg-emerald-50 text-emerald-900 font-semibold' : 'text-slate-600 hover:bg-slate-50'}`}><span>{language === 'ru' ? item.title.ru : item.title.de}</span><span aria-label={t('Für Isa ausgewählt: ', 'Выбрано Исе: ') + count} className="shrink-0 text-emerald-800 tabular-nums">{count}</span></button></li>;
        })}</ol>
      </nav>
      <section aria-label={t('Fragen der Etappe', 'Вопросы этапа')} className="min-w-0 space-y-3">
        <div className="rounded-xl border border-slate-200 bg-slate-50 p-4 space-y-2"><h2 className="text-base font-bold"><Text text={stage.title} language={language} /></h2><p className="text-xs leading-relaxed text-slate-600"><strong>{t('Für die Aufwandsschätzung: ', 'Для оценки трудозатрат: ')}</strong><Text text={stage.impact} language={language} /></p><p className="text-xs font-semibold text-emerald-800">{selected.length} {t('Fragen dieser Etappe für Isa ausgewählt', 'вопросов этого этапа выбрано Исе')}</p></div>
        {primary.map(row)}
        {chosenAdditional.length > 0 && <div className="space-y-3"><h3 className="px-1 text-xs font-semibold text-emerald-900">{t('Weitere ausgewählte Fragen dieser Etappe', 'Другие выбранные вопросы этого этапа')}</h3>{chosenAdditional.map(row)}</div>}
        {otherAdditional.length > 0 && <details key={stage.id} className="rounded-xl border border-slate-200 bg-white p-4"><summary className="cursor-pointer text-xs font-semibold text-slate-600">{t('Weitere vorhandene Fragen zu dieser Etappe', 'Другие имеющиеся вопросы по этому этапу')} ({otherAdditional.length})</summary><div className="mt-4 space-y-3">{otherAdditional.map(row)}</div></details>}
        <div className="flex justify-between gap-3 pt-2"><button type="button" disabled={index === 0} onClick={() => onStageChange(ISA_STAGE_PLANS[index - 1].id)} className="rounded-lg border border-slate-200 bg-white px-4 py-2 text-sm disabled:opacity-40">{t('Vorherige Etappe', 'Предыдущий этап')}</button><button type="button" disabled={index === ISA_STAGE_PLANS.length - 1} onClick={() => onStageChange(ISA_STAGE_PLANS[index + 1].id)} className="rounded-lg border border-slate-200 bg-white px-4 py-2 text-sm disabled:opacity-40">{t('Nächste Etappe', 'Следующий этап')}</button></div>
      </section>
    </div>
  </div>;
}
