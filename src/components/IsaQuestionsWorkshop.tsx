import React, { useEffect, useRef, useState } from 'react';
import { ArrowLeft, ArrowRight, Check, CheckCheck, ClipboardList, Copy, Download, FileText, Search, Upload } from 'lucide-react';
import { ISA_TEAM_QUESTIONS, type IsaTeamQuestion } from '../data/isaTeamQuestions';
import { ISA_QUESTION_STAGES } from '../data/isaQuestionStages';
import { ISA_QUESTION_DEPTH_STORAGE_KEY, isaDepthForQuestion, isaQuestionsAtDepth, parseIsaQuestionDepth, type IsaQuestionDepth } from '../data/isaQuestionDepth';
import { IsaQuestionDepthControl } from './IsaQuestionDepthControl';
import type { IsaQuestionNotes, Language } from '../types';
import { useIsaQuestionStore } from '../hooks/useIsaQuestionStore';
import { IsaQuestionCard, IsaQuestionOverview } from './IsaSharedQuestion';
import { legacyEntriesForQuestion, relatedEntriesForQuestion } from '../utils/isaRoleQuestions';
import { EMPTY_ISA_QUESTION_NOTE, isaCatalogMarkdown, isaGroupsForView, isaQuestionGroupId, isaQuestionLabel, isaQuestionSources, isaQuestionsBackup, isaTemplateMarkdown, parseIsaQuestionsBackup, selectedIsaQuestions } from '../utils/isaQuestions';

function Text({ text, language }: { text: { de: string; ru: string }; language: Language }) {
  return <>{language === 'ru' ? text.ru : text.de}{language === 'bilingual' && <span lang="ru" className="mt-3 block font-normal text-slate-500">{text.ru}</span>}</>;
}

function download(filename: string, content: string, mime: string) {
  const url = URL.createObjectURL(new Blob([content], { type: mime + ';charset=utf-8' }));
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  a.remove();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}

export { IsaQuestionCard, IsaQuestionOverview } from './IsaSharedQuestion';

export function IsaQuestionsWorkshop({ language, refreshKey }: { language: Language; refreshKey?: unknown }) {
  const t = (de: string, ru: string) => language === 'ru' ? ru : de;
  const store = useIsaQuestionStore(refreshKey);
  const { notes, notesRef, drafts: proposalDrafts, loaded, loadError, saveStatus, persist, update } = store;
  const [depth, setDepth] = useState<IsaQuestionDepth>(() => {
    try { return typeof window === 'undefined' ? 0 : parseIsaQuestionDepth(window.localStorage.getItem(ISA_QUESTION_DEPTH_STORAGE_KEY)); }
    catch { return 0; }
  });
  const [activeId, setActiveId] = useState('amruddy:team:01');
  const [filter, setFilter] = useState<'all' | 'pending' | 'selected'>('all');
  const [search, setSearch] = useState('');
  const [preview, setPreview] = useState(false);
  const [templateLanguage, setTemplateLanguage] = useState<Language>('ru');
  const [includeComments, setIncludeComments] = useState(false);
  const [copyStatus, setCopyStatus] = useState<'idle' | 'copied' | 'error'>('idle');
  const [importError, setImportError] = useState(false);
  const [pendingImport, setPendingImport] = useState<IsaQuestionNotes | null>(null);
  const fileInput = useRef<HTMLInputElement>(null);

  useEffect(() => {
    try { window.localStorage.setItem(ISA_QUESTION_DEPTH_STORAGE_KEY, String(depth)); }
    catch { /* Interview filtering works even when preference storage is unavailable. */ }
  }, [depth]);

  useEffect(() => {
    if (!loaded) return;
    try {
      const last = sessionStorage.getItem('isa_questions_last');
      if (ISA_TEAM_QUESTIONS.some(question => question.id === last)) setActiveId(last!);
    } catch { /* Navigation memory is optional. */ }
  }, [loaded]);

  useEffect(() => {
    if (!loaded) return;
    try { sessionStorage.setItem('isa_questions_last', activeId); } catch { /* Optional navigation memory. */ }
  }, [activeId, loaded]);

  const unfinishedProposalIds = Object.keys(proposalDrafts);
  const references = (question: IsaTeamQuestion) => ({ legacyEntries: legacyEntriesForQuestion(question.id, store.legacyNotes), relatedEntries: relatedEntriesForQuestion(question, notes) });

  const catalogQuestions = isaQuestionsAtDepth(depth);
  const groupId = (question: IsaTeamQuestion) => isaQuestionGroupId(question, 'all');
  const groups = isaGroupsForView('all').filter(group => catalogQuestions.some(question => groupId(question) === group.id));
  const selected = selectedIsaQuestions(notes);
  const depthIds = new Set(isaQuestionsAtDepth(depth).map(question => question.id));
  const hiddenSelected = selected.filter(question => !depthIds.has(question.id)).length;
  const reviewed = catalogQuestions.filter(question => notes[question.id]?.reviewed).length;
  const query = search.trim().toLocaleLowerCase();
  const visible = catalogQuestions.filter(question => (
    filter === 'all' || filter === 'pending' && !notes[question.id]?.reviewed || filter === 'selected' && notes[question.id]?.includeInIsa
  ) && (!query || (question.text.de + ' ' + question.text.ru + ' ' + question.number).toLocaleLowerCase().includes(query)));
  const current = visible.find(question => question.id === activeId) || visible[0];
  const currentIndex = current ? visible.indexOf(current) : -1;
  const currentGroup = groups.find(group => current && group.id === groupId(current));
  const stage = ISA_QUESTION_STAGES.find(stage => stage.id === current?.stageId);
  const template = isaTemplateMarkdown(notes, templateLanguage, includeComments);
  const visibleGroups = groups.filter(group => visible.some(question => groupId(question) === group.id));
  const moveGroup = (offset: number) => {
    if (!currentGroup) return;
    const nextGroup = visibleGroups[visibleGroups.indexOf(currentGroup) + offset];
    const next = visible.find(question => groupId(question) === nextGroup?.id);
    if (next) setActiveId(next.id);
  };

  const [viewMode, setViewMode] = useState<'single' | 'topic'>('topic');

  const openQuestion = (id: string) => {
    const question = ISA_TEAM_QUESTIONS.find(question => question.id === id);
    if (!question) return;
    if (!depthIds.has(id)) setDepth(isaDepthForQuestion(id));
    if (!visible.some(question => question.id === id)) { setSearch(''); setFilter('all'); }
    setActiveId(id);
    setViewMode('single');
    setTimeout(() => {
      const el = document.getElementById(`question-${id}`);
      el?.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }, 50);
  };
  const readBackup = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    event.target.value = '';
    if (!file) return;
    try {
      const restored = parseIsaQuestionsBackup(await file.text());
      setPendingImport(restored);
      setImportError(false);
    } catch { setImportError(true); }
  };

  const saveMessage = saveStatus === 'loading' ? t('Lade euren Stand …', 'Загружаем ваши записи …')
    : saveStatus === 'saving' ? t('Speichere …', 'Сохраняем …')
    : saveStatus === 'saved' ? t('In diesem Browser gespeichert.', 'Сохранено в этом браузере.')
    : !loaded ? t('Gespeicherter Stand konnte nicht geladen werden.', 'Не удалось загрузить сохранённые записи.')
    : t('Speichern fehlgeschlagen. Eure Eingaben sind noch hier; bitte eine Sicherung herunterladen.', 'Не удалось сохранить. Ваши записи ещё здесь; скачайте резервную копию.');

  return <section aria-label={t('Team-Fragen für Isa', 'Вопросы команды для Исы')} className="space-y-4">
    <div className="rounded-2xl bg-slate-900 text-white p-5 sm:p-6 flex flex-wrap justify-between items-center gap-4">
      <div className="max-w-2xl"><p className="text-emerald-300 font-semibold text-xs uppercase tracking-wide">{t('Euer Gespräch mit dem Team', 'Ваше обсуждение в команде')}</p><h2 className="mt-2 text-xl font-bold">{t('Durchgehen. Vorschlag notieren. Für Isa auswählen.', 'Обсудить. Записать предложение. Выбрать для Исы.')}</h2><p className="mt-2 text-sm leading-relaxed text-slate-300">{t('Jeder Haken bei „Für Isa übernehmen“ nimmt die Frage in die Vorlage auf. Ihr könnt die Vorlage jederzeit ansehen.', 'Каждая отметка «Включить в вопросы Исе» добавляет вопрос в подборку. Её можно посмотреть в любой момент.')}</p></div>
      <button type="button" disabled={!loaded} onClick={() => { setPreview(!preview); setCopyStatus('idle'); }} className="rounded-xl bg-emerald-400 hover:bg-emerald-300 text-emerald-950 px-4 py-3 text-sm font-bold inline-flex gap-2 items-center disabled:opacity-50">{preview ? <ArrowLeft className="w-4 h-4" /> : <FileText className="w-4 h-4" />}{preview ? t('Zurück zu den Fragen', 'Вернуться к вопросам') : t('Isa-Vorlage ansehen', 'Посмотреть вопросы Исе')} {!preview && <span className="rounded-md bg-emerald-950/10 px-2 py-0.5 tabular-nums">{selected.length}</span>}</button>
    </div>

    <IsaQuestionDepthControl value={depth} onChange={setDepth} hiddenSelected={hiddenSelected} language={language} />

    <div className="flex flex-wrap items-center justify-between gap-3 text-xs text-slate-500">
      <p role="status" aria-live="polite" className={saveStatus === 'error' ? 'text-rose-800' : ''}>{saveMessage}{saveStatus === 'error' && loaded && <button type="button" onClick={() => void persist(notesRef.current)} className="ml-2 underline font-semibold">{t('Erneut speichern', 'Сохранить ещё раз')}</button>}</p>
      <span>{t('Für ein anderes Gerät oder fürs Team: Sicherung herunterladen und dort laden.', 'Для другого устройства или команды: скачайте копию и загрузите её там.')}</span>
    </div>
    {loadError && <div role="alert" className="p-4 rounded-xl border border-rose-200 bg-rose-50 text-sm">{t('Euer gespeicherter Stand konnte nicht geladen werden. Die Bearbeitung bleibt gesperrt. Erneut laden oder eine Sicherung einlesen.', 'Не удалось загрузить сохранённые записи. Редактирование заблокировано. Обновите страницу или загрузите резервную копию.')} <button type="button" onClick={() => window.location.reload()} className="underline font-bold">{t('Erneut laden', 'Обновить')}</button></div>}
    {importError && <p role="alert" className="rounded-xl bg-rose-50 border border-rose-200 p-3 text-sm text-rose-900">{t('Diese Datei ist keine gültige Fragen-Sicherung. Euer bisheriger Stand wurde nicht verändert.', 'Этот файл не является корректной резервной копией вопросов. Ваши записи не изменились.')}</p>}
    {pendingImport && <div role="alert" className="rounded-xl border border-amber-200 bg-amber-50 p-4 text-sm space-y-3"><p>{t('Diese Sicherung enthält ', 'В этой копии ')}{Object.keys(pendingImport).length} {t('bearbeitete Fragen und ', 'обработанных вопросов и ')}{selectedIsaQuestions(pendingImport).length} {t('Auswahlen für Isa. Beim Übernehmen wird euer bisheriger Fragenstand ersetzt.', 'выбранных вопросов Исе. При загрузке текущие записи вопросов будут заменены.')}{unfinishedProposalIds.length > 0 && ' ' + t('Dabei werden auch noch offene Vorschläge verworfen.', 'Незавершённые предложения также будут удалены.')}</p><div className="flex flex-wrap gap-2"><button type="button" onClick={() => { const restored = pendingImport; setPendingImport(null); store.restore(restored); }} className="px-3 py-2 rounded-lg bg-slate-900 text-white font-semibold">{t('Sicherung übernehmen', 'Загрузить копию')}</button><button type="button" onClick={() => setPendingImport(null)} className="px-3 py-2 rounded-lg bg-white border border-slate-200">{t('Abbrechen', 'Отмена')}</button>{loaded && <button type="button" onClick={() => download('ProRiv_Fragen_Sicherung.json', isaQuestionsBackup(notesRef.current), 'application/json')} className="px-3 py-2 underline">{t('Aktuellen Stand zuerst sichern', 'Сначала сохранить текущие записи')}</button>}</div></div>}

    {preview && unfinishedProposalIds.length > 0 && <p className="rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-xs text-amber-900">
      {t('Noch offene Vorschläge mit „Fertig“ speichern, damit sie in der Vorlage erscheinen.', 'Сохраните незавершённые предложения кнопкой «Готово», чтобы включить их в подборку.')}
      <button type="button" onClick={() => { setPreview(false); openQuestion(unfinishedProposalIds[0]); }} className="ml-2 font-semibold underline">{t('Offenen Vorschlag bearbeiten', 'Продолжить предложение')}</button>
    </p>}

    {preview ? <div className="rounded-2xl border border-slate-200 bg-white overflow-hidden">
      <div className="bg-slate-50 p-4 sm:p-5 border-b border-slate-200 flex flex-wrap gap-4 items-center justify-between">
        <div className="space-y-2"><label className="text-xs font-semibold">{t('Sprache der Vorlage', 'Язык подборки')} <select value={templateLanguage} onChange={event => { setTemplateLanguage(event.target.value as Language); setCopyStatus('idle'); }} className="ml-2 border border-slate-300 rounded-lg p-2 bg-white"><option value="ru">Русский</option><option value="de">Deutsch</option><option value="bilingual">Deutsch + Русский</option></select></label><label className="flex items-center gap-2 text-xs"><input type="checkbox" checked={includeComments} onChange={event => { setIncludeComments(event.target.checked); setCopyStatus('idle'); }} className="w-4 h-4 accent-emerald-700" />{t('Teamkommentare ebenfalls in die Vorlage aufnehmen', 'Также включить комментарии команды')}</label></div>
        <div className="flex flex-wrap gap-2"><button type="button" disabled={!selected.length} onClick={() => download('ProRiv_Fragen_fuer_Isa.md', template, 'text/markdown')} className="rounded-lg px-3 py-2 bg-emerald-700 text-white text-sm font-semibold inline-flex items-center gap-2 disabled:opacity-40"><Download className="w-4 h-4" />{t('Vorlage herunterladen', 'Скачать подборку')}</button><button type="button" disabled={!selected.length} onClick={async () => { try { await navigator.clipboard.writeText(template); setCopyStatus('copied'); } catch { setCopyStatus('error'); } }} className="rounded-lg px-3 py-2 bg-white border border-slate-200 text-sm font-semibold inline-flex items-center gap-2 disabled:opacity-40"><Copy className="w-4 h-4" />{copyStatus === 'copied' ? t('Kopiert', 'Скопировано') : t('Text kopieren', 'Скопировать текст')}</button></div>
      </div>
      {copyStatus === 'error' && <p role="alert" className="px-5 pt-4 text-sm text-amber-800">{t('Kopieren war nicht möglich. Bitte die Vorlage herunterladen.', 'Не удалось скопировать. Скачайте подборку.')}</p>}
      {!selected.length ? <div className="p-8 text-center text-slate-500"><ClipboardList className="w-9 h-9 mx-auto mb-3" /><p className="font-semibold">{t('Noch keine Fragen ausgewählt.', 'Пока ни одного вопроса не выбрано.')}</p><p className="mt-2 text-sm">{t('Bei einer Frage „Für Isa übernehmen“ anhaken.', 'Отметьте у нужного вопроса «Включить в вопросы Исе».')}</p></div>
        : <div className="p-5 sm:p-8 max-w-4xl mx-auto space-y-8"><div><h2 className="text-2xl font-bold">{templateLanguage === 'ru' ? 'Вопросы Исе · ProRiv (проект Исы)' : "Fragen an Isa · ProRiv (Isa's Projekt)"}</h2><p className="mt-2 text-sm text-slate-500">{templateLanguage === 'ru' ? 'Наши предложения — основа для обсуждения.' : 'Unsere Vorschläge dienen als Gesprächsgrundlage.'}</p></div>
          {ISA_QUESTION_STAGES.filter(group => selected.some(question => question.stageId === group.id)).map(group => <section key={group.id} className="space-y-5"><h3 className="text-sm font-bold uppercase tracking-wide text-emerald-800 border-b border-emerald-100 pb-2">{templateLanguage === 'ru' ? group.title.ru : group.title.de}</h3>{selected.filter(question => question.stageId === group.id).map(question => <article key={question.id} className="space-y-3"><h4 className="text-base leading-relaxed font-semibold"><span className="text-slate-400 mr-2">{selected.indexOf(question) + 1}.</span><Text text={question.text} language={templateLanguage} /></h4>{question.context && <div className="rounded-lg bg-amber-50/60 p-3 text-sm leading-relaxed"><p className="font-semibold mb-1">{templateLanguage === 'ru' ? 'Имеющиеся сведения · подтвердить' : 'Vorhandene Grundlage · zu bestätigen'}</p><Text text={question.context.text} language={templateLanguage} /></div>}{notes[question.id].proposal.trim() && <div className="border-l-2 border-emerald-300 pl-4 text-sm"><p className="font-semibold text-emerald-900">{templateLanguage === 'ru' ? 'Наше предложение Исе' : 'Unser Vorschlag an Isa'}</p><p className="mt-1 whitespace-pre-wrap break-words leading-relaxed">{notes[question.id].proposal}</p></div>}{includeComments && notes[question.id].comment.trim() && <div className="text-sm text-slate-600"><p className="font-semibold">{templateLanguage === 'ru' ? 'Комментарий команды' : 'Kommentar des Teams'}</p><p className="mt-1 whitespace-pre-wrap break-words leading-relaxed">{notes[question.id].comment}</p></div>}{notes[question.id].answer?.trim() ? <div className="whitespace-pre-wrap rounded-lg bg-slate-50 p-3 text-sm"><p className="font-semibold">{templateLanguage === 'ru' ? 'Записанный ответ / результат' : 'Festgehaltene Antwort / Ergebnis'} · {notes[question.id].isaConfirmed ? (templateLanguage === 'ru' ? 'Подтверждено Исой' : 'Von Isa bestätigt') : (templateLanguage === 'ru' ? 'Ещё не подтверждено' : 'Noch nicht bestätigt')}</p><p className="mt-1">{notes[question.id].answer}</p></div> : <p className="text-xs text-slate-400">{templateLanguage === 'ru' ? 'Ответ Исы: ____________________' : 'Antwort von Isa: ____________________'}</p>}</article>)}</section>)}
        </div>}
    </div> : <>
      <div aria-label={t('Fragenfortschritt', 'Прогресс обсуждения')} className="flex flex-wrap justify-between items-center gap-3 text-xs text-slate-500">
        <p><strong className="text-slate-800 tabular-nums">{reviewed} / {catalogQuestions.length}</strong> {t('durchgesehen', 'обсудили')}</p>
        <p><strong className="text-emerald-800 tabular-nums">{selected.length}</strong> {t('für Isa · gesamter Katalog', 'для Исы · из всех вопросов')}</p>
      </div>
      <details className="text-xs text-slate-500"><summary className="cursor-pointer font-semibold">{t('Vollständiger Fragenbestand · ', 'Полный список · ') + ISA_TEAM_QUESTIONS.length}</summary><p className="mt-2 leading-relaxed">{t('95 Originalfragen und 62 Ergänzungen bleiben erhalten. Der Bestand dient der Vorbereitung; nicht jede Frage muss erneut an Isa gestellt werden. Bei 100 % werden alle angezeigt. Eure Auswahl und Notizen bleiben erhalten.', '95 исходных вопросов и 62 дополнения сохранены. Это материал для подготовки; не каждый вопрос нужно снова задавать Исе. На уровне 100 % виден весь список. Ваши отметки и записи сохраняются.')}</p><a href="https://github.com/TheNextthing1994/Eventstorming-ProRiv/blob/main/docs/ISA_FRAGENPRUEFUNG_2026-10-12.md" target="_blank" rel="noreferrer" className="mt-2 inline-block font-semibold text-emerald-800 underline">{t('Prüfung aller Fragen ansehen', 'Посмотреть разбор всех вопросов')}</a></details>
      <div className="flex flex-wrap gap-2 items-center"><label className="relative flex-1 min-w-[200px]"><span className="sr-only">{t('Fragen durchsuchen', 'Поиск вопросов')}</span><Search className="absolute left-3 top-3 w-4 h-4 text-slate-400" /><input value={search} onChange={event => setSearch(event.target.value)} placeholder={t('Frage oder Stichwort suchen …', 'Поиск вопроса или слова …')} className="w-full pl-9 pr-3 py-2.5 text-sm rounded-xl bg-white border border-slate-200" /></label><select aria-label={t('Fragen filtern', 'Фильтр вопросов')} value={filter} onChange={event => setFilter(event.target.value as typeof filter)} className="rounded-xl border border-slate-200 bg-white p-2.5 text-sm"><option value="all">{t('Alle Fragen', 'Все вопросы')}</option><option value="pending">{t('Noch durchgehen', 'Ещё не обсудили')}</option><option value="selected">{t('Für Isa ausgewählt', 'Выбраны для Исы')}</option></select></div>
      <div className="grid gap-4 lg:grid-cols-[260px_minmax(0,1fr)] items-start">
        <div className="lg:hidden grid sm:grid-cols-2 gap-2">
          <label className="text-xs font-semibold text-slate-500">{t('Thema', 'Тема')}<select value={current ? groupId(current) : ''} onChange={event => { const next = visible.find(question => groupId(question) === event.target.value); if (next) { setActiveId(next.id); setViewMode('topic'); } }} className="mt-1 rounded-xl w-full border border-slate-200 bg-white p-3 text-sm text-slate-800">{groups.filter(group => visible.some(question => groupId(question) === group.id)).map(group => <option key={group.id} value={group.id}>{language === 'ru' ? group.title.ru : group.title.de}</option>)}</select></label>
          <label className="text-xs font-semibold text-slate-500">{t('Frage direkt wählen', 'Выбрать вопрос')}<select value={current?.id || ''} onChange={event => openQuestion(event.target.value)} className="mt-1 rounded-xl w-full border border-slate-200 bg-white p-3 text-sm text-slate-800">{visible.filter(question => current && groupId(question) === groupId(current)).map(question => <option key={question.id} value={question.id}>{isaQuestionLabel(question, language)} · {language === 'ru' ? question.title.ru : question.title.de}</option>)}</select></label>
        </div>
        <aside aria-label={t('Themen und Fragen', 'Темы и вопросы')} className="hidden lg:block rounded-2xl border border-slate-200 bg-white p-3 lg:sticky lg:top-4">
          <p className="px-2 pt-1 pb-3 text-[11px] uppercase tracking-wide font-bold text-slate-400">{t('Themen', 'Темы')}</p>
          <div className="space-y-1">{groups.map(group => {
            const matches = visible.filter(question => groupId(question) === group.id);
            const groupQuestions = catalogQuestions.filter(question => groupId(question) === group.id);
            const done = groupQuestions.filter(question => notes[question.id]?.reviewed).length;
            const active = group.id === currentGroup?.id;
            return <div key={group.id}><button type="button" disabled={!matches.length} aria-pressed={active} onClick={() => { setActiveId(matches[0].id); setViewMode('topic'); }} className={`w-full text-left rounded-xl px-3 py-2.5 flex justify-between gap-3 text-sm disabled:opacity-35 ${active ? 'bg-emerald-50 text-emerald-900 font-semibold' : 'text-slate-600 hover:bg-slate-50'}`}><span>{language === 'ru' ? group.title.ru : group.title.de}</span><span className="shrink-0 text-[11px] text-slate-400 tabular-nums">{done}/{groupQuestions.length}</span></button>{active && <div className="mt-1 mb-2 space-y-1 border-l border-emerald-100 ml-3 pl-2 max-h-[300px] overflow-y-auto">{matches.map(question => <button type="button" key={question.id} aria-current={question.id === current.id ? 'step' : undefined} onClick={() => openQuestion(question.id)} className={`w-full flex items-start gap-2 text-left rounded-lg p-2 text-xs leading-relaxed ${question.id === current.id ? 'bg-slate-100 text-slate-900 font-semibold' : 'text-slate-500 hover:bg-slate-50'}`}><span className="shrink-0 mt-0.5 text-slate-400 tabular-nums">{question.catalog === 'roles' ? 'R' : question.catalog === 'team' ? 'T' : '+'}{question.number}</span><span className="flex-1 line-clamp-2">{language === 'ru' ? question.title.ru : question.title.de}</span>{notes[question.id]?.includeInIsa ? <CheckCheck aria-label={t('Für Isa ausgewählt', 'Выбрано для Исы')} className="w-3.5 h-3.5 shrink-0 mt-1 text-emerald-700" /> : notes[question.id]?.reviewed && <Check aria-label={t('Durchgesehen', 'Обсудили')} className="w-3.5 h-3.5 shrink-0 mt-1 text-slate-400" />}</button>)}</div>}</div>;
          })}</div>
        </aside>
        <div className="min-w-0 space-y-3">
          {current ? <>
            <div className="rounded-xl border border-slate-200 bg-slate-50 p-4 space-y-3">
              <div className="flex flex-wrap justify-between gap-3 items-center">
                <p className="text-sm font-semibold">{language === 'ru' ? currentGroup?.title.ru : currentGroup?.title.de}</p>
                <div className="flex items-center gap-2">
                  {viewMode === 'single' ? (
                    <button
                      type="button"
                      onClick={() => setViewMode('topic')}
                      className="text-xs font-semibold px-3 py-1.5 rounded-lg border border-slate-300 bg-white hover:bg-slate-100 text-slate-700"
                    >
                      ← {t('Alle Fragen dieses Themas anzeigen', 'Показать все вопросы этой темы')} ({visible.filter(q => groupId(q) === currentGroup?.id).length})
                    </button>
                  ) : (
                    <div className="flex items-center gap-2">
                      <span className="text-xs text-slate-500 font-medium">
                        {visible.filter(q => groupId(q) === currentGroup?.id).length} {t('Fragen in diesem Abschnitt', 'вопросов в этом разделе')}
                      </span>
                      <button
                        type="button"
                        onClick={() => { setViewMode('single'); }}
                        className="text-xs font-semibold px-2.5 py-1 rounded-lg border border-slate-300 bg-white hover:bg-slate-100 text-slate-700"
                      >
                        {t('Nur ausgewählte Frage anzeigen', 'Показать только выбранный вопрос')}
                      </button>
                    </div>
                  )}
                </div>
              </div>
              {stage && <p className="text-xs leading-relaxed text-slate-500"><strong>{t('Ereignisse im Gesprächsmodell: ', 'События в модели обсуждения: ')}</strong><Text text={stage.events} language={language} /></p>}
              <p className="text-xs text-slate-500">{t('Klären: Wer handelt, welche Angaben werden benötigt, was folgt danach und was passiert bei Fehlern?', 'Уточнить: кто действует, какие данные нужны, что происходит дальше и что делать при ошибках?')}</p>
            </div>

            {viewMode === 'single' ? (
              <div className="space-y-3">
                <IsaQuestionCard
                  question={current}
                  note={notes[current.id] || EMPTY_ISA_QUESTION_NOTE}
                  language={language}
                  editable={loaded && saveStatus !== 'saving'}
                  onUpdate={change => update(current.id, change)}
                  onOpenQuestion={openQuestion}
                  draft={proposalDrafts[current.id]}
                  onDraftChange={change => store.changeDraft(current.id, change)}
                  onDraftClose={() => store.closeDraft(current.id)}
                  onFinish={() => void store.finishDraft(current.id)}
                  references={references}
                />
                <div className="flex justify-between items-center pt-2">
                  <button
                    type="button"
                    onClick={() => setViewMode('topic')}
                    className="text-xs rounded-xl px-4 py-2.5 border border-slate-200 bg-white font-semibold text-slate-700 hover:bg-slate-50"
                  >
                    ← {t('Zurück zur Themen-Übersicht', 'Назад к списку вопросов темы')}
                  </button>
                  <div className="flex gap-2">
                    <button
                      type="button"
                      disabled={currentIndex <= 0}
                      onClick={() => {
                        const prev = visible[currentIndex - 1];
                        if (prev) openQuestion(prev.id);
                      }}
                      className="text-xs rounded-xl px-3 py-2 border border-slate-200 bg-white disabled:opacity-40 hover:bg-slate-50"
                    >
                      ← {t('Vorherige Frage', 'Предыдущий вопрос')}
                    </button>
                    <button
                      type="button"
                      disabled={currentIndex >= visible.length - 1}
                      onClick={() => {
                        const next = visible[currentIndex + 1];
                        if (next) openQuestion(next.id);
                      }}
                      className="text-xs rounded-xl px-3 py-2 border border-slate-200 bg-white disabled:opacity-40 hover:bg-slate-50"
                    >
                      {t('Nächste Frage', 'Следующий вопрос')} →
                    </button>
                  </div>
                </div>
              </div>
            ) : (
              <IsaQuestionOverview
                questions={visible.filter(question => groupId(question) === currentGroup?.id)}
                notes={notes}
                proposalDrafts={proposalDrafts}
                language={language}
                editable={loaded && saveStatus !== 'saving'}
                onOpen={openQuestion}
                onSelect={(id, includeInIsa) => update(id, { includeInIsa })}
                onUpdate={update}
                onDraftChange={store.changeDraft}
                onDraftClose={store.closeDraft}
                onFinish={id => void store.finishDraft(id)}
                references={references}
              />
            )}

            <div className="flex justify-between gap-2">
              <button type="button" disabled={visibleGroups.indexOf(currentGroup!) <= 0} onClick={() => { moveGroup(-1); setViewMode('topic'); }} className="rounded-xl px-4 py-3 border border-slate-200 bg-white text-sm disabled:opacity-40 hover:bg-slate-50">
                {t('Vorheriger Abschnitt', 'Предыдущий раздел')}
              </button>
              <button type="button" disabled={visibleGroups.indexOf(currentGroup!) >= visibleGroups.length - 1} onClick={() => { moveGroup(1); setViewMode('topic'); }} className="rounded-xl px-4 py-3 border border-slate-200 bg-white text-sm disabled:opacity-40 hover:bg-slate-50">
                {t('Nächster Abschnitt', 'Следующий раздел')} <ArrowRight className="inline w-4 h-4 ml-1" />
              </button>
            </div>
          </> : <div className="rounded-2xl border border-slate-200 bg-white p-8 text-center text-slate-500"><p>{t('Keine Fragen für diese Auswahl.', 'Нет вопросов для этого фильтра.')}</p><button type="button" onClick={() => { setSearch(''); setFilter('all'); }} className="mt-3 text-emerald-800 underline">{t('Filter zurücksetzen', 'Сбросить фильтры')}</button>{depth !== 100 && <button type="button" onClick={() => { setDepth(100); setSearch(''); setFilter('all'); }} className="mt-3 ml-4 text-emerald-800 underline">{t('Vollständigen Katalog öffnen', 'Открыть полный каталог')}</button>}</div>}
          {catalogQuestions.length > 0 && reviewed === catalogQuestions.length && <div role="status" className="rounded-xl bg-emerald-50 border border-emerald-200 p-4 text-sm text-emerald-950"><strong>{depth === 100 ? t('Diesen Katalog habt ihr vollständig durchgesehen.', 'Вы обсудили весь этот список.') : t('Diese Gesprächsauswahl habt ihr vollständig durchgesehen.', 'Вы обсудили всю эту подборку.')}</strong><p className="mt-1">{t('Die angehakten Fragen und eure Vorschläge stehen jetzt in der Isa-Vorlage.', 'Отмеченные вопросы и ваши предложения находятся в подборке для Исы.')}</p><button type="button" onClick={() => setPreview(true)} className="mt-2 underline font-semibold">{t('Vorlage ansehen', 'Посмотреть подборку')}</button></div>}
        </div>
      </div>
    </>}
    <footer className="flex flex-wrap items-center justify-between gap-3 border-t border-slate-200 pt-4 text-xs text-slate-500">
      <span>{t('Grundlagen: Originalfragen, Kundengespräch, Rollen-Workshop, Event Storming, neuere Rapporte und Preisliste.', 'Основа: исходные вопросы, разговор с клиентом, разбор ролей, Event Storming, новые рапорты и прайс.')}</span>
      <div className="flex flex-wrap gap-2"><button type="button" onClick={() => download('ProRiv_Gesamtkatalog_Fragen.md', isaCatalogMarkdown(language), 'text/markdown')} className="rounded-lg bg-white border border-slate-200 px-3 py-2 inline-flex items-center gap-2"><Download className="w-3.5 h-3.5" />{t('Alle Fragen herunterladen', 'Скачать все вопросы')}</button><button type="button" disabled={!loaded} onClick={() => download('ProRiv_Fragen_Sicherung.json', isaQuestionsBackup(notesRef.current), 'application/json')} className="rounded-lg bg-white border border-slate-200 px-3 py-2 inline-flex items-center gap-2 disabled:opacity-40"><Download className="w-3.5 h-3.5" />{t('Sicherung herunterladen', 'Скачать резервную копию')}</button><button type="button" onClick={() => fileInput.current?.click()} className="rounded-lg bg-white border border-slate-200 px-3 py-2 inline-flex items-center gap-2"><Upload className="w-3.5 h-3.5" />{t('Sicherung laden', 'Загрузить резервную копию')}</button><input ref={fileInput} type="file" accept=".json,application/json" aria-label={t('Fragen-Sicherung auswählen', 'Выбрать резервную копию вопросов')} onChange={readBackup} className="hidden" /></div>
    </footer>
  </section>;
}
