import React from 'react';
import { Check } from 'lucide-react';
import type { IsaTeamQuestion } from '../data/isaTeamQuestions';
import type { IsaQuestionNote, IsaQuestionNotes, Language } from '../types';
import { isaQuestionLabel, isaQuestionSources, relatedIsaQuestions } from '../utils/isaQuestions';

function Text({ text, language }: { text: { de: string; ru: string }; language: Language }) {
  return <>{language === 'ru' ? text.ru : text.de}{language === 'bilingual' && <span lang="ru" className="mt-3 block font-normal text-slate-500">{text.ru}</span>}</>;
}

export function IsaQuestionAnswerFields({ note, draft, language, editable, onUpdate, onDraftChange, onClose, onFinish }: {
  note: IsaQuestionNote;
  draft?: IsaQuestionNote;
  language: Language;
  editable: boolean;
  onUpdate: (change: Partial<IsaQuestionNote>) => void;
  onDraftChange: (change: Partial<IsaQuestionNote>) => void;
  onClose: () => void;
  onFinish: () => void;
}) {
  const t = (de: string, ru: string) => language === 'ru' ? ru : de;
  const currentDraft = draft ?? note;

  return <div className="space-y-4">
    <label className="block text-xs font-semibold text-slate-700">
      {t('Vorschlag des Teams', 'Предложение команды')}
      <textarea
        aria-label={t('Unser Vorschlag an Isa', 'Наше предложение Исе')}
        disabled={!editable}
        rows={3}
        value={currentDraft.proposal}
        onChange={event => onDraftChange({ proposal: event.target.value })}
        onKeyDown={event => {
          if (event.key === 'Enter' && (event.ctrlKey || event.metaKey) && !event.nativeEvent.isComposing && editable) {
            event.preventDefault();
            onFinish();
          }
        }}
        className="mt-1 w-full rounded-lg border border-slate-300 p-2 text-xs"
        autoFocus
      />
    </label>
    <label className="block text-xs font-semibold text-slate-700">
      {t('Antwort / Ergebnis der Besprechung', 'Ответ / результат обсуждения')}
      <textarea
        aria-label={t('Antwort / Ergebnis der Besprechung', 'Ответ / результат обсуждения')}
        disabled={!editable}
        rows={2}
        value={currentDraft.answer ?? ''}
        onChange={event => onDraftChange({ answer: event.target.value })}
        className="mt-1 w-full rounded-lg border border-slate-300 p-2 text-xs"
      />
    </label>
    <div className="flex items-center gap-2">
      <button type="button" disabled={!editable} onClick={onFinish} className="rounded-lg bg-emerald-700 px-3 py-1.5 text-xs text-white font-semibold">{t('Fertig', 'Готово')}</button>
      <button type="button" disabled={!editable} onClick={onClose} className="text-xs text-slate-500 underline">{t('Abbrechen', 'Отмена')}</button>
    </div>
  </div>;
}

export function IsaQuestionCard({ question, note, draft, language, editable, onUpdate, onOpenQuestion, onDraftChange, onClose, onFinish, references }: {
  question: IsaTeamQuestion;
  note: IsaQuestionNote;
  draft?: IsaQuestionNote;
  language: Language;
  editable: boolean;
  onUpdate: (change: Partial<IsaQuestionNote>) => void;
  onOpenQuestion?: (id: string) => void;
  onDraftChange?: (change: Partial<IsaQuestionNote>) => void;
  onClose?: () => void;
  onFinish?: () => void;
  references?: (question: IsaTeamQuestion) => { legacyEntries: any[]; relatedEntries: any[] };
}) {
  const t = (de: string, ru: string) => language === 'ru' ? ru : de;
  const currentDraft = draft ?? note;
  const refs = references?.(question);

  return <article aria-label={t('Frage ', 'Вопрос ') + question.number} className="rounded-2xl border border-slate-200 bg-white shadow-sm overflow-hidden">
    <div className="p-5 sm:p-7 border-b border-slate-100">
      <div className="flex flex-wrap justify-between items-center gap-3 mb-4">
        <span className="text-xs font-semibold text-emerald-800">{isaQuestionLabel(question, language)}</span>
        <label className="flex items-center gap-2 text-xs text-slate-500 cursor-pointer">
          <input
            type="checkbox"
            checked={note.reviewed}
            disabled={!editable}
            onChange={event => onUpdate({ reviewed: event.target.checked })}
            className="w-4 h-4 accent-emerald-700"
          />
          {t('Im Team durchgesehen', 'Обсудили в команде')}
        </label>
      </div>
      <h2 className="text-xl sm:text-2xl font-semibold leading-relaxed tracking-tight"><Text text={question.text} language={language} /></h2>
      {question.context && <div className="mt-4 rounded-xl border border-amber-200 bg-amber-50/60 p-4 text-sm leading-relaxed"><p className="text-xs font-bold text-amber-900 mb-2">{question.context.kind === 'interview' ? t('Vorhandene Gesprächsgrundlage', 'По исходному разговору') : question.context.kind === 'evidence' ? t('Bereits aus den Quellen bekannt', 'Уже известно из источников') : t('Hinweis aus dem Entwurf · noch zu klären', 'Примечание из черновика · уточнить')} </p><Text text={question.context.text} language={language} /></div>}
      <p className="mt-3 text-xs text-slate-500">{t('Quelle: ', 'Источник: ')}{isaQuestionSources(question, language).join(' · ')}</p>

      {refs && (refs.legacyEntries.length > 0 || refs.relatedEntries.length > 0) && (
        <div className="mt-4 rounded-xl border border-slate-200 bg-slate-50 p-4 text-xs space-y-3">
          <p className="font-semibold text-slate-700">{t('Vorhandene Notizen und Rollenantworten zu diesem Thema', 'Имеющиеся заметки и ответы по этой теме')}</p>
          {refs.legacyEntries.map((entry, idx) => (
            <div key={idx} className="rounded-lg bg-white p-3 border border-slate-200 space-y-1.5">
              <p className="font-medium text-slate-800">{entry.answer}</p>
              {entry.revisedRecommendation && <p className="text-slate-500">{entry.revisedRecommendation}</p>}
            </div>
          ))}
          {refs.relatedEntries.map((other, idx) => (
            <button key={idx} type="button" onClick={() => onOpenQuestion?.(other.id)} className="block w-full text-left rounded-lg p-2 bg-white border border-slate-200 hover:bg-slate-100 text-emerald-900">
              <strong>{isaQuestionLabel(other, language)}</strong> · {language === 'ru' ? other.title.ru : other.title.de}
            </button>
          ))}
        </div>
      )}

      {!!relatedIsaQuestions(question).length && onOpenQuestion && <details className="mt-4 text-xs rounded-xl border border-slate-200 p-3"><summary className="font-semibold cursor-pointer">{t('Verwandte Fragen und andere Rollenperspektiven', 'Связанные вопросы и другие роли')} ({relatedIsaQuestions(question).length})</summary><p className="mt-2 text-slate-500 leading-relaxed">{t('Die Fragen bleiben einzeln auswählbar. Prüft, welche Perspektiven ihr Isa tatsächlich vorlegen wollt.', 'Вопросы выбираются отдельно. Решите, какие точки зрения нужно обсудить с Исой.')}</p><div className="mt-2 space-y-1">{relatedIsaQuestions(question).map(other => <button key={other.id} type="button" onClick={() => onOpenQuestion(other.id)} className="block w-full text-left rounded-lg p-2 hover:bg-slate-50 text-emerald-900"><strong>{isaQuestionLabel(other, language)}</strong> · {language === 'ru' ? other.title.ru : other.title.de}</button>)}</div></details>}

      <label className={`mt-6 flex items-center gap-3 cursor-pointer rounded-xl border p-4 ${note.includeInIsa ? 'bg-emerald-50 border-emerald-300 text-emerald-950' : 'bg-slate-50 border-slate-200 text-slate-700'}`}>
        <input type="checkbox" checked={note.includeInIsa} disabled={!editable} onChange={event => onUpdate({ includeInIsa: event.target.checked })} className="w-5 h-5 shrink-0 accent-emerald-700" />
        <span><span className="block text-sm font-bold">{t('Für Isa übernehmen', 'Включить в вопросы Исе')}</span><span className="block mt-1 text-xs opacity-75">{t('Diese Frage erscheint in eurer Isa-Vorlage.', 'Этот вопрос появится в вашей подборке для Исы.')}</span></span>
      </label>
    </div>
    <div className="p-5 sm:p-7 space-y-5">
      <div className="text-xs font-semibold text-emerald-900">{t('Vorschlag / Antwort festhalten', 'Зафиксировать предложение / ответ')}</div>
      <label className="block"><span className="text-sm font-semibold">{t('Teamkommentar', 'Комментарий команды')}</span>
        <textarea disabled={!editable} rows={3} value={currentDraft.comment} onChange={event => {
          if (onDraftChange) onDraftChange({ comment: event.target.value });
          else onUpdate({ comment: event.target.value });
        }} placeholder={t('Was habt ihr dazu besprochen?', 'Что вы обсудили?')} className="mt-2 w-full rounded-xl border border-slate-300 p-3 text-sm leading-relaxed resize-y focus:outline-2 focus:outline-emerald-600 disabled:opacity-50" />
      </label>
      <label className="block"><span className="text-sm font-semibold text-emerald-900">{t('Unser Vorschlag an Isa', 'Наше предложение Исе')}</span>
        <textarea disabled={!editable} rows={4} value={currentDraft.proposal} onChange={event => {
          if (onDraftChange) onDraftChange({ proposal: event.target.value });
          else onUpdate({ proposal: event.target.value });
        }} placeholder={t('Wir schlagen vor, dass …', 'Мы предлагаем …')} className="mt-2 w-full rounded-xl border border-emerald-200 bg-emerald-50/30 p-3 text-sm leading-relaxed resize-y focus:outline-2 focus:outline-emerald-600 disabled:opacity-50" />
      </label>
      {(currentDraft.answer || note.answer) && <p className="text-xs text-slate-700"><strong>{t('Antwort:', 'Ответ:')}</strong> {currentDraft.answer || note.answer}</p>}
    </div>
  </article>;
}

export function IsaQuestionOverview({ questions, notes, proposalDrafts, language, editable, onOpen, onSelect, onUpdate, onDraftChange, onDraftClose, onFinish, references }: {
  questions: IsaTeamQuestion[];
  notes: IsaQuestionNotes;
  proposalDrafts: Record<string, IsaQuestionNote>;
  language: Language;
  editable: boolean;
  onOpen?: (id: string) => void;
  onSelect: (id: string, include: boolean) => void;
  onUpdate: (id: string, change: Partial<IsaQuestionNote>) => void;
  onDraftChange: (id: string, change: Partial<IsaQuestionNote>) => void;
  onDraftClose: (id: string) => void;
  onFinish: (id: string) => void;
  references?: (question: IsaTeamQuestion) => { legacyEntries: any[]; relatedEntries: any[] };
}) {
  const t = (de: string, ru: string) => language === 'ru' ? ru : de;
  const openField = (id: string) => {
    if (editable) onDraftChange(id, { proposal: notes[id]?.proposal ?? '', comment: notes[id]?.comment ?? '', answer: notes[id]?.answer ?? '', isaConfirmed: notes[id]?.isaConfirmed ?? false });
  };
  const finishField = (id: string) => {
    if (!editable || !Object.hasOwn(proposalDrafts, id)) return;
    onFinish(id);
    onDraftClose(id);
  };

  return <ol aria-label={t('Fragen dieses Abschnitts', 'Вопросы этого раздела')} className="space-y-3">{questions.map(question => {
    const isOpen = Object.hasOwn(proposalDrafts, question.id);
    const note = notes[question.id] || { includeInIsa: false, reviewed: false, comment: '', proposal: '', answer: '', isaConfirmed: false };
    const draft = proposalDrafts[question.id] || note;
    return <li key={question.id} id={`question-${question.id}`} className="rounded-xl border border-slate-200 bg-white p-4 sm:p-5 space-y-3">
      <div className="flex flex-wrap gap-2 justify-between text-xs">
        <span className="font-semibold text-emerald-800">{isaQuestionLabel(question, language)}</span>
        {note.reviewed && <span className="text-slate-500 flex items-center gap-1"><Check className="inline h-3.5 w-3.5 text-emerald-700" />{t('Durchgesehen', 'Обсудили')}</span>}
      </div>
      <p className="text-sm leading-relaxed font-medium"><Text text={question.text} language={language} /></p>
      {question.context && <p className="text-xs leading-relaxed text-amber-900 bg-amber-50 rounded-lg p-3"><Text text={question.context.text} language={language} /></p>}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <label className="inline-flex gap-2 items-center text-xs font-semibold text-emerald-900 cursor-pointer shrink-0">
          <input type="checkbox" checked={!!note.includeInIsa} disabled={!editable} onChange={event => onSelect(question.id, event.target.checked)} className="w-4 h-4 accent-emerald-700" />
          {t('Für Isa übernehmen', 'Включить в вопросы Исе')}
        </label>
        {isOpen ? (
          <div className="w-full mt-3 p-4 rounded-xl border border-emerald-200 bg-emerald-50/20 space-y-4">
            <IsaQuestionAnswerFields
              note={note}
              draft={draft}
              language={language}
              editable={editable}
              onUpdate={change => onUpdate(question.id, change)}
              onDraftChange={change => onDraftChange(question.id, change)}
              onClose={() => onDraftClose(question.id)}
              onFinish={() => finishField(question.id)}
            />
          </div>
        ) : (
          <button
            type="button"
            disabled={!editable}
            onClick={() => {
              openField(question.id);
              onOpen?.(question.id);
            }}
            className="text-xs rounded-lg border border-slate-200 bg-white px-3 py-2 hover:bg-slate-50 text-slate-700 font-medium flex items-center gap-1.5 shrink-0 transition-colors"
          >
            {t('Vorschlag / Antwort festhalten', 'Зафиксировать предложение / ответ')}
          </button>
        )}
      </div>
      {(note.proposal || note.answer || note.comment) && !isOpen && (
        <div className="rounded-lg bg-emerald-50/50 border border-emerald-200/70 px-3 py-2 text-xs text-slate-700 flex justify-between items-start gap-2">
          <div className="leading-relaxed space-y-1">
            {note.proposal && <p><strong className="text-emerald-950 mr-1.5">{t('Vorschlag:', 'Предложение:')}</strong>{note.proposal}</p>}
            {note.answer && <p><strong className="text-emerald-950 mr-1.5">{t('Antwort:', 'Ответ:')}</strong>{note.answer} {note.isaConfirmed && <span className="text-[10px] bg-emerald-100 text-emerald-800 px-1.5 py-0.5 rounded font-medium">{t('Bestätigt', 'Подтверждено')}</span>}</p>}
          </div>
          <button type="button" disabled={!editable} onClick={() => openField(question.id)} className="text-[11px] text-emerald-800 hover:underline shrink-0 font-medium disabled:opacity-50">
            {t('Bearbeiten', 'Изменить')}
          </button>
        </div>
      )}
    </li>;
  })}</ol>;
}
