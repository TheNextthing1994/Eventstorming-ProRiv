import React from 'react';
import { Check } from 'lucide-react';
import type { IsaTeamQuestion } from '../data/isaTeamQuestions';
import type { IsaQuestionNote, IsaQuestionNotes, Language } from '../types';
import type { IsaQuestionDrafts } from '../hooks/useIsaQuestionStore';
import { EMPTY_ISA_QUESTION_NOTE, isaQuestionLabel, isaQuestionsBackup } from '../utils/isaQuestions';
import { reuseQuestionEntry, type ExistingQuestionEntry } from '../utils/isaRoleQuestions';

interface FieldsProps {
  note?: IsaQuestionNote;
  draft?: IsaQuestionNote;
  language: Language;
  editable: boolean;
  onUpdate: (change: Partial<IsaQuestionNote>) => void;
  onDraftChange: (change: Partial<IsaQuestionNote>) => void;
  onFinish: () => void;
  onClose: () => void;
  legacyEntries?: ExistingQuestionEntry[];
  relatedEntries?: ExistingQuestionEntry[];
}

export function downloadIsaQuestionsBackup(notes: IsaQuestionNotes) {
  const url = URL.createObjectURL(new Blob([isaQuestionsBackup(notes)], { type: 'application/json;charset=utf-8' }));
  const a = document.createElement('a'); a.href = url; a.download = 'ProRiv_Fragen_Sicherung.json'; a.click();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}

export function IsaQuestionAnswerFields({ note = EMPTY_ISA_QUESTION_NOTE, draft, language, editable, onUpdate, onDraftChange, onFinish, onClose, legacyEntries = [], relatedEntries = [] }: FieldsProps) {
  const t = (de: string, ru: string) => language === 'ru' ? ru : de;
  const references = [...legacyEntries, ...relatedEntries];
  const finishWithKeyboard = (event: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (editable && event.key === 'Enter' && (event.ctrlKey || event.metaKey) && !event.nativeEvent.isComposing) { event.preventDefault(); onFinish(); }
  };
  return <div className="space-y-3">
    <label className="flex items-center gap-2 text-xs font-semibold text-emerald-900">
      <input type="checkbox" disabled={!editable} checked={note.includeInIsa} onChange={e => onUpdate({ includeInIsa: e.target.checked })} className="h-4 w-4 accent-emerald-700" />
      {t('Für Isa übernehmen', 'Включить в вопросы Исе')}
    </label>
    {draft ? <div className="space-y-3 rounded-xl border border-slate-200 bg-white p-3">
      <label className="block text-xs font-semibold text-emerald-900">{t('Unser Vorschlag an Isa', 'Наше предложение Исе')}
        <textarea autoFocus aria-label={t('Unser Vorschlag an Isa', 'Наше предложение Исе')} disabled={!editable} rows={2} value={draft.proposal} onChange={e => onDraftChange({ proposal: e.target.value })} onKeyDown={finishWithKeyboard} className="mt-1 w-full rounded-lg border border-emerald-200 bg-emerald-50/30 p-2.5 text-sm font-normal" />
      </label>
      <label className="block text-xs font-semibold text-slate-700">{t('Antwort / Ergebnis der Besprechung', 'Ответ / результат обсуждения')}
        <textarea aria-label={t('Antwort / Ergebnis der Besprechung', 'Ответ / результат обсуждения')} disabled={!editable} rows={2} value={draft.answer ?? ''} onChange={e => onDraftChange({ answer: e.target.value })} onKeyDown={finishWithKeyboard} className="mt-1 w-full rounded-lg border border-slate-300 p-2.5 text-sm font-normal" />
      </label>
      <label className="flex items-start gap-2 text-xs text-slate-600">
        <input type="checkbox" checked={!!draft.isaConfirmed} disabled={!editable || !draft.answer?.trim()} onChange={e => onDraftChange({ isaConfirmed: e.target.checked })} className="mt-0.5 accent-emerald-700" />
        <span><strong>{t('Von Isa bestätigt', 'Подтверждено Исой')}</strong><span className="mt-1 block">{t('Nur anhaken, wenn Isa diese Antwort tatsächlich bestätigt hat.', 'Отметьте только если Иса действительно подтвердил этот ответ.')}</span></span>
      </label>
      <details className="text-xs text-slate-600"><summary className="cursor-pointer font-semibold">{t('Teamkommentar und nächste Schritte', 'Комментарий команды и следующие шаги')}</summary>
        <label className="mt-2 block">{t('Teamkommentar', 'Комментарий команды')}<textarea disabled={!editable} rows={2} value={draft.comment} onChange={e => onDraftChange({ comment: e.target.value })} className="mt-1 w-full rounded-lg border border-slate-300 p-2 font-normal" /></label>
        <div className="mt-2 grid gap-2 sm:grid-cols-2"><label>{t('Verantwortlich', 'Ответственный')}<input disabled={!editable} value={draft.owner ?? ''} onChange={e => onDraftChange({ owner: e.target.value })} className="mt-1 w-full rounded-lg border border-slate-300 p-2" /></label><label>{t('Nächster Schritt', 'Следующий шаг')}<input disabled={!editable} value={draft.nextStep ?? ''} onChange={e => onDraftChange({ nextStep: e.target.value })} className="mt-1 w-full rounded-lg border border-slate-300 p-2" /></label></div>
      </details>
      <div className="flex items-center gap-3"><button type="button" disabled={!editable} onClick={() => { if (editable) onFinish(); }} className="rounded-lg bg-emerald-700 px-3 py-2 text-xs font-semibold text-white disabled:opacity-50">{t('Fertig', 'Готово')}</button><button type="button" disabled={!editable} onClick={onClose} className="text-xs text-slate-500 underline">{t('Abbrechen', 'Отмена')}</button><span className="text-[11px] text-slate-500">{t('Mit „Fertig“ speichern.', 'Сохранить кнопкой «Готово».')}</span></div>
    </div> : <>
      {note.proposal.trim() && <p className="whitespace-pre-wrap rounded-lg bg-emerald-50/60 p-3 text-sm"><strong className="block text-xs text-emerald-900">{t('Unser Vorschlag an Isa', 'Наше предложение Исе')}</strong>{note.proposal}</p>}
      {note.answer?.trim() && <p className="whitespace-pre-wrap rounded-lg bg-slate-50 p-3 text-sm"><strong className="block text-xs text-slate-700">{t('Festgehaltene Antwort / Ergebnis', 'Записанный ответ / результат')}{note.isaConfirmed && ' · ' + t('Von Isa bestätigt', 'Подтверждено Исой')}</strong>{note.answer}</p>}
      {!!note.comment.trim() && <details className="text-xs text-slate-500"><summary>{t('Teamkommentar', 'Комментарий команды')}</summary><p className="mt-1 whitespace-pre-wrap">{note.comment}</p></details>}
      <button type="button" disabled={!editable} onClick={() => onDraftChange({})} className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs font-semibold text-slate-600 disabled:opacity-50">{t('Vorschlag / Antwort festhalten', 'Записать предложение / ответ')}</button>
    </>}
    {references.length > 0 && <details className="rounded-lg border border-amber-200 bg-amber-50/40 p-3 text-xs"><summary className="cursor-pointer font-semibold text-amber-900">{t('Vorhandene Notizen zu diesem Thema', 'Имеющиеся записи по этой теме')} ({references.length})</summary><p className="mt-2 text-slate-600">{t('Prüfen, ob die Notiz diese ganze Frage beantwortet. Übernehmen öffnet einen Entwurf.', 'Проверьте, отвечает ли запись на весь вопрос. Перенос открывает черновик.')}</p>
      {references.map(entry => <div key={entry.key} className="mt-3 space-y-2 border-t border-amber-200 pt-2"><p className="font-semibold">{entry.text}</p>{entry.proposal && <p className="whitespace-pre-wrap">{t('Vorschlag: ', 'Предложение: ')}{entry.proposal}</p>}{entry.answer && <p className="whitespace-pre-wrap">{t('Ergebnis: ', 'Результат: ')}{entry.answer}</p>}<button type="button" disabled={!editable} onClick={() => onDraftChange(reuseQuestionEntry(draft ?? note, entry))} className="font-semibold text-emerald-800 underline disabled:opacity-50">{t('Als Entwurf übernehmen', 'Перенести в черновик')}</button></div>)}
    </details>}
  </div>;
}

interface OverviewProps {
  questions: IsaTeamQuestion[];
  notes: IsaQuestionNotes;
  proposalDrafts: IsaQuestionDrafts;
  language: Language;
  editable: boolean;
  onOpen?: (id: string) => void;
  onSelect: (id: string, include: boolean) => void;
  onUpdate: (id: string, change: Partial<IsaQuestionNote>) => void;
  onDraftChange: (id: string, change: Partial<IsaQuestionNote>) => void;
  onDraftClose: (id: string) => void;
  onFinish: (id: string) => void;
  references?: (question: IsaTeamQuestion) => { legacyEntries: ExistingQuestionEntry[]; relatedEntries: ExistingQuestionEntry[] };
}
function QuestionText({ text, language }: { text: { de: string; ru: string }; language: Language }) {
  return <>{language === 'ru' ? text.ru : text.de}{language === 'bilingual' && <span lang="ru" className="mt-2 block font-normal text-slate-500">{text.ru}</span>}</>;
}
export function IsaQuestionOverview({ questions, notes, proposalDrafts, language, editable, onSelect, onUpdate, onDraftChange, onDraftClose, onFinish, references }: OverviewProps) {
  const t = (de: string, ru: string) => language === 'ru' ? ru : de;
  return <ol aria-label={t('Fragen dieses Abschnitts', 'Вопросы этого раздела')} className="space-y-3">{questions.map(question => <li key={question.id} id={'question-' + question.id} className="space-y-3 rounded-xl border border-slate-200 bg-white p-4 sm:p-5">
    <div className="flex flex-wrap justify-between gap-2 text-xs"><span className="font-semibold text-emerald-800">{isaQuestionLabel(question, language)}</span>{notes[question.id]?.reviewed && <span className="inline-flex items-center gap-1 text-slate-500"><Check className="h-3.5 w-3.5 text-emerald-700" />{t('Durchgesehen', 'Обсудили')}</span>}</div>
    <p className="text-sm font-medium leading-relaxed"><QuestionText text={question.text} language={language} /></p>
    {question.context && <p className="rounded-lg bg-amber-50 p-3 text-xs leading-relaxed text-amber-900"><QuestionText text={question.context.text} language={language} /></p>}
    <IsaQuestionAnswerFields note={notes[question.id]} draft={proposalDrafts[question.id]} language={language} editable={editable}
      onUpdate={change => change.includeInIsa !== undefined ? onSelect(question.id, change.includeInIsa) : onUpdate(question.id, change)} onDraftChange={change => onDraftChange(question.id, change)} onClose={() => onDraftClose(question.id)} onFinish={() => onFinish(question.id)} {...references?.(question)} />
  </li>)}</ol>;
}

export function IsaQuestionCard({ question, note, language, editable, onUpdate, draft, onDraftChange = () => {}, onDraftClose = () => {}, onFinish = () => {}, references, onOpenQuestion }: {
  question: IsaTeamQuestion; note: IsaQuestionNote; language: Language; editable: boolean;
  onUpdate: (change: Partial<IsaQuestionNote>) => void; draft?: IsaQuestionNote;
  onDraftChange?: (change: Partial<IsaQuestionNote>) => void; onDraftClose?: () => void; onFinish?: () => void;
  references?: OverviewProps['references']; onOpenQuestion?: (id: string) => void;
}) {
  return <IsaQuestionOverview questions={[question]} notes={{ [question.id]: note }} proposalDrafts={draft ? { [question.id]: draft } : {}} language={language} editable={editable}
    onSelect={(_, includeInIsa) => onUpdate({ includeInIsa })} onUpdate={(_, change) => onUpdate(change)} onDraftChange={(_, change) => onDraftChange(change)} onDraftClose={onDraftClose} onFinish={onFinish} references={references} />;
}
