import React, { useEffect, useRef, useState } from 'react';
import { ArrowLeft, ArrowRight, Check, CheckCheck, ClipboardList, Copy, Download, FileText, Search, Upload } from 'lucide-react';
import { ISA_QUESTION_GROUPS, ISA_TEAM_QUESTIONS, type IsaQuestionCatalog, type IsaTeamQuestion } from '../data/isaTeamQuestions';
import type { IsaQuestionNote, IsaQuestionNotes, Language } from '../types';
import { loadIsaQuestionNotes, saveIsaQuestionNotes } from '../db/indexedDb';
import { changeIsaQuestionNote, EMPTY_ISA_QUESTION_NOTE, isaQuestionsBackup, isaTemplateMarkdown, parseIsaQuestionsBackup, selectedIsaQuestions } from '../utils/isaQuestions';

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

export function IsaQuestionCard({ question, note, language, editable, onUpdate }: {
  question: IsaTeamQuestion;
  note: IsaQuestionNote;
  language: Language;
  editable: boolean;
  onUpdate: (change: Partial<IsaQuestionNote>) => void;
}) {
  const t = (de: string, ru: string) => language === 'ru' ? ru : de;
  return <article aria-label={t('Frage ', 'Вопрос ') + question.number} className="rounded-2xl border border-slate-200 bg-white shadow-sm overflow-hidden">
    <div className="p-5 sm:p-7 border-b border-slate-100">
      <div className="flex flex-wrap justify-between items-center gap-3 mb-4">
        <span className="text-xs font-semibold text-emerald-800">{question.catalog === 'team' ? t('Teamfrage', 'Основной вопрос') : t('Rollenfrage', 'Вопрос по роли')} {question.number}</span>
        <label className="flex items-center gap-2 text-xs text-slate-500 cursor-pointer"><input type="checkbox" checked={note.reviewed} disabled={!editable} onChange={event => onUpdate({ reviewed: event.target.checked })} className="w-4 h-4 accent-emerald-700" />{t('Im Team durchgesehen', 'Обсудили в команде')}</label>
      </div>
      <h2 className="text-xl sm:text-2xl font-semibold leading-relaxed tracking-tight"><Text text={question.text} language={language} /></h2>
      <label className={`mt-6 flex items-center gap-3 cursor-pointer rounded-xl border p-4 ${note.includeInIsa ? 'bg-emerald-50 border-emerald-300 text-emerald-950' : 'bg-slate-50 border-slate-200 text-slate-700'}`}>
        <input type="checkbox" checked={note.includeInIsa} disabled={!editable} onChange={event => onUpdate({ includeInIsa: event.target.checked })} className="w-5 h-5 shrink-0 accent-emerald-700" />
        <span><span className="block text-sm font-bold">{t('Für Isa übernehmen', 'Включить в вопросы Исе')}</span><span className="block mt-1 text-xs opacity-75">{t('Diese Frage erscheint in eurer Isa-Vorlage.', 'Этот вопрос появится в вашей подборке для Исы.')}</span></span>
      </label>
    </div>
    <div className="p-5 sm:p-7 space-y-5">
      <label className="block"><span className="text-sm font-semibold">{t('Teamkommentar', 'Комментарий команды')}</span><span className="block mt-1 text-xs text-slate-500">{t('Gedanken, bisherige Antworten oder Punkte aus eurer Besprechung.', 'Мысли, уже известные ответы и заметки из обсуждения.')}</span>
        <textarea disabled={!editable} rows={3} value={note.comment} onChange={event => onUpdate({ comment: event.target.value })} placeholder={t('Was habt ihr dazu besprochen?', 'Что вы обсудили?')} className="mt-2 w-full rounded-xl border border-slate-300 p-3 text-sm leading-relaxed resize-y focus:outline-2 focus:outline-emerald-600 disabled:opacity-50" />
      </label>
      <label className="block"><span className="text-sm font-semibold text-emerald-900">{t('Unser Vorschlag an Isa', 'Наше предложение Исе')}</span><span className="block mt-1 text-xs text-slate-500">{t('Eure Formulierung für Isa. Sie wird zusammen mit der ausgewählten Frage übernommen.', 'Формулировка для Исы. Она попадёт в подборку вместе с выбранным вопросом.')}</span>
        <textarea disabled={!editable} rows={4} value={note.proposal} onChange={event => onUpdate({ proposal: event.target.value })} placeholder={t('Wir schlagen vor, dass …', 'Мы предлагаем …')} className="mt-2 w-full rounded-xl border border-emerald-200 bg-emerald-50/30 p-3 text-sm leading-relaxed resize-y focus:outline-2 focus:outline-emerald-600 disabled:opacity-50" />
      </label>
    </div>
  </article>;
}

export function IsaQuestionsWorkshop({ language, refreshKey }: { language: Language; refreshKey?: unknown }) {
  const t = (de: string, ru: string) => language === 'ru' ? ru : de;
  const [notes, setNotes] = useState<IsaQuestionNotes>({});
  const notesRef = useRef<IsaQuestionNotes>({});
  const revision = useRef(0);
  const [loaded, setLoaded] = useState(false);
  const [saveStatus, setSaveStatus] = useState<'loading' | 'saving' | 'saved' | 'error'>('loading');
  const [loadError, setLoadError] = useState(false);
  const [catalog, setCatalog] = useState<IsaQuestionCatalog>('team');
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
    let alive = true;
    ++revision.current;
    setLoaded(false);
    setLoadError(false);
    setSaveStatus('loading');
    loadIsaQuestionNotes().then(current => {
      if (!alive) return;
      notesRef.current = current;
      setNotes(current);
      setLoaded(true);
      setSaveStatus('saved');
      try {
        const last = sessionStorage.getItem('isa_questions_last');
        const question = ISA_TEAM_QUESTIONS.find(item => item.id === last);
        if (question) { setCatalog(question.catalog); setActiveId(question.id); }
      } catch { /* Meeting navigation also works without session storage. */ }
    }).catch(() => { if (alive) { setLoadError(true); setSaveStatus('error'); } });
    return () => { alive = false; };
  }, [refreshKey]);

  useEffect(() => {
    if (!loaded) return;
    try { sessionStorage.setItem('isa_questions_last', activeId); } catch { /* Optional navigation memory. */ }
  }, [activeId, loaded]);

  const persist = async (next: IsaQuestionNotes) => {
    const edit = ++revision.current;
    notesRef.current = next;
    setNotes(next);
    setSaveStatus('saving');
    try {
      await saveIsaQuestionNotes(next);
      if (revision.current === edit) setSaveStatus('saved');
    } catch {
      if (revision.current === edit) setSaveStatus('error');
    }
  };

  const update = (id: string, change: Partial<IsaQuestionNote>) => {
    if (loaded) void persist(changeIsaQuestionNote(notesRef.current, id, change));
  };

  const catalogQuestions = ISA_TEAM_QUESTIONS.filter(question => question.catalog === catalog);
  const groups = ISA_QUESTION_GROUPS.filter(group => group.catalog === catalog);
  const selected = selectedIsaQuestions(notes);
  const reviewed = catalogQuestions.filter(question => notes[question.id]?.reviewed).length;
  const query = search.trim().toLocaleLowerCase();
  const visible = catalogQuestions.filter(question => (
    filter === 'all' || filter === 'pending' && !notes[question.id]?.reviewed || filter === 'selected' && notes[question.id]?.includeInIsa
  ) && (!query || (question.text.de + ' ' + question.text.ru + ' ' + question.number).toLocaleLowerCase().includes(query)));
  const current = visible.find(question => question.id === activeId) || visible[0];
  const currentIndex = current ? visible.indexOf(current) : -1;
  const currentGroup = groups.find(group => group.id === current?.groupId);
  const template = isaTemplateMarkdown(notes, templateLanguage, includeComments);

  const move = (offset: number) => {
    const next = visible[currentIndex + offset];
    if (next) { setActiveId(next.id); setCopyStatus('idle'); }
  };
  const switchCatalog = (next: IsaQuestionCatalog) => {
    setCatalog(next);
    setFilter('all');
    setSearch('');
    setActiveId(ISA_TEAM_QUESTIONS.find(question => question.catalog === next)!.id);
  };
  const markAndContinue = () => {
    if (!current) return;
    update(current.id, { reviewed: true });
    move(1);
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
    : saveStatus === 'saved' ? t('Automatisch in diesem Browser gespeichert.', 'Автоматически сохранено в этом браузере.')
    : !loaded ? t('Gespeicherter Stand konnte nicht geladen werden.', 'Не удалось загрузить сохранённые записи.')
    : t('Speichern fehlgeschlagen. Eure Eingaben sind noch hier; bitte eine Sicherung herunterladen.', 'Не удалось сохранить. Ваши записи ещё здесь; скачайте резервную копию.');

  return <section aria-label={t('Team-Fragen für Isa', 'Вопросы команды для Исы')} className="space-y-4">
    <div className="rounded-2xl bg-slate-900 text-white p-5 sm:p-6 flex flex-wrap justify-between items-center gap-4">
      <div className="max-w-2xl"><p className="text-emerald-300 font-semibold text-xs uppercase tracking-wide">{t('Euer Gespräch mit dem Team', 'Ваше обсуждение в команде')}</p><h2 className="mt-2 text-xl font-bold">{t('Durchgehen. Vorschlag notieren. Für Isa auswählen.', 'Обсудить. Записать предложение. Выбрать для Исы.')}</h2><p className="mt-2 text-sm leading-relaxed text-slate-300">{t('Jeder Haken bei „Für Isa übernehmen“ nimmt die Frage in die Vorlage auf. Ihr könnt die Vorlage jederzeit ansehen.', 'Каждая отметка «Включить в вопросы Исе» добавляет вопрос в подборку. Её можно посмотреть в любой момент.')}</p></div>
      <button type="button" disabled={!loaded} onClick={() => { setPreview(!preview); setCopyStatus('idle'); }} className="rounded-xl bg-emerald-400 hover:bg-emerald-300 text-emerald-950 px-4 py-3 text-sm font-bold inline-flex gap-2 items-center disabled:opacity-50">{preview ? <ArrowLeft className="w-4 h-4" /> : <FileText className="w-4 h-4" />}{preview ? t('Zurück zu den Fragen', 'Вернуться к вопросам') : t('Isa-Vorlage ansehen', 'Посмотреть вопросы Исе')} {!preview && <span className="rounded-md bg-emerald-950/10 px-2 py-0.5 tabular-nums">{selected.length}</span>}</button>
    </div>

    <div className="flex flex-wrap items-center justify-between gap-3 text-xs text-slate-500">
      <p role="status" aria-live="polite" className={saveStatus === 'error' ? 'text-rose-800' : ''}>{saveMessage}{saveStatus === 'error' && loaded && <button type="button" onClick={() => void persist(notesRef.current)} className="ml-2 underline font-semibold">{t('Erneut speichern', 'Сохранить ещё раз')}</button>}</p>
      <span>{t('Für ein anderes Gerät oder fürs Team: Sicherung herunterladen und dort laden.', 'Для другого устройства или команды: скачайте копию и загрузите её там.')}</span>
    </div>
    {loadError && <div role="alert" className="p-4 rounded-xl border border-rose-200 bg-rose-50 text-sm">{t('Euer gespeicherter Stand konnte nicht geladen werden. Die Bearbeitung bleibt gesperrt. Erneut laden oder eine Sicherung einlesen.', 'Не удалось загрузить сохранённые записи. Редактирование заблокировано. Обновите страницу или загрузите резервную копию.')} <button type="button" onClick={() => window.location.reload()} className="underline font-bold">{t('Erneut laden', 'Обновить')}</button></div>}
    {importError && <p role="alert" className="rounded-xl bg-rose-50 border border-rose-200 p-3 text-sm text-rose-900">{t('Diese Datei ist keine gültige Fragen-Sicherung. Euer bisheriger Stand wurde nicht verändert.', 'Этот файл не является корректной резервной копией вопросов. Ваши записи не изменились.')}</p>}
    {pendingImport && <div role="alert" className="rounded-xl border border-amber-200 bg-amber-50 p-4 text-sm space-y-3"><p>{t('Diese Sicherung enthält ', 'В этой копии ')}{Object.keys(pendingImport).length} {t('bearbeitete Fragen und ', 'обработанных вопросов и ')}{selectedIsaQuestions(pendingImport).length} {t('Auswahlen für Isa. Beim Übernehmen wird euer bisheriger Fragenstand ersetzt.', 'выбранных вопросов Исе. При загрузке текущие записи вопросов будут заменены.')}</p><div className="flex flex-wrap gap-2"><button type="button" onClick={() => { const restored = pendingImport; setPendingImport(null); setLoadError(false); setLoaded(true); void persist(restored); }} className="px-3 py-2 rounded-lg bg-slate-900 text-white font-semibold">{t('Sicherung übernehmen', 'Загрузить копию')}</button><button type="button" onClick={() => setPendingImport(null)} className="px-3 py-2 rounded-lg bg-white border border-slate-200">{t('Abbrechen', 'Отмена')}</button>{loaded && <button type="button" onClick={() => download('ProRiv_Fragen_Sicherung.json', isaQuestionsBackup(notesRef.current), 'application/json')} className="px-3 py-2 underline">{t('Aktuellen Stand zuerst sichern', 'Сначала сохранить текущие записи')}</button>}</div></div>}

    {preview ? <div className="rounded-2xl border border-slate-200 bg-white overflow-hidden">
      <div className="bg-slate-50 p-4 sm:p-5 border-b border-slate-200 flex flex-wrap gap-4 items-center justify-between">
        <div className="space-y-2"><label className="text-xs font-semibold">{t('Sprache der Vorlage', 'Язык подборки')} <select value={templateLanguage} onChange={event => { setTemplateLanguage(event.target.value as Language); setCopyStatus('idle'); }} className="ml-2 border border-slate-300 rounded-lg p-2 bg-white"><option value="ru">Русский</option><option value="de">Deutsch</option><option value="bilingual">Deutsch + Русский</option></select></label><label className="flex items-center gap-2 text-xs"><input type="checkbox" checked={includeComments} onChange={event => { setIncludeComments(event.target.checked); setCopyStatus('idle'); }} className="w-4 h-4 accent-emerald-700" />{t('Teamkommentare ebenfalls in die Vorlage aufnehmen', 'Также включить комментарии команды')}</label></div>
        <div className="flex flex-wrap gap-2"><button type="button" disabled={!selected.length} onClick={() => download('ProRiv_Fragen_fuer_Isa.md', template, 'text/markdown')} className="rounded-lg px-3 py-2 bg-emerald-700 text-white text-sm font-semibold inline-flex items-center gap-2 disabled:opacity-40"><Download className="w-4 h-4" />{t('Vorlage herunterladen', 'Скачать подборку')}</button><button type="button" disabled={!selected.length} onClick={async () => { try { await navigator.clipboard.writeText(template); setCopyStatus('copied'); } catch { setCopyStatus('error'); } }} className="rounded-lg px-3 py-2 bg-white border border-slate-200 text-sm font-semibold inline-flex items-center gap-2 disabled:opacity-40"><Copy className="w-4 h-4" />{copyStatus === 'copied' ? t('Kopiert', 'Скопировано') : t('Text kopieren', 'Скопировать текст')}</button></div>
      </div>
      {copyStatus === 'error' && <p role="alert" className="px-5 pt-4 text-sm text-amber-800">{t('Kopieren war nicht möglich. Bitte die Vorlage herunterladen.', 'Не удалось скопировать. Скачайте подборку.')}</p>}
      {!selected.length ? <div className="p-8 text-center text-slate-500"><ClipboardList className="w-9 h-9 mx-auto mb-3" /><p className="font-semibold">{t('Noch keine Fragen ausgewählt.', 'Пока ни одного вопроса не выбрано.')}</p><p className="mt-2 text-sm">{t('Bei einer Frage „Für Isa übernehmen“ anhaken.', 'Отметьте у нужного вопроса «Включить в вопросы Исе».')}</p></div>
        : <div className="p-5 sm:p-8 max-w-4xl mx-auto space-y-8"><div><h2 className="text-2xl font-bold">{templateLanguage === 'ru' ? 'Вопросы Исе · ProRiv (проект Исы)' : "Fragen an Isa · ProRiv (Isa's Projekt)"}</h2><p className="mt-2 text-sm text-slate-500">{templateLanguage === 'ru' ? 'Наши предложения — основа для обсуждения.' : 'Unsere Vorschläge dienen als Gesprächsgrundlage.'}</p></div>
          {ISA_QUESTION_GROUPS.filter(group => selected.some(question => question.groupId === group.id)).map(group => <section key={group.id} className="space-y-5"><h3 className="text-sm font-bold uppercase tracking-wide text-emerald-800 border-b border-emerald-100 pb-2">{templateLanguage === 'ru' ? group.title.ru : group.title.de}</h3>{selected.filter(question => question.groupId === group.id).map(question => <article key={question.id} className="space-y-3"><h4 className="text-base leading-relaxed font-semibold"><span className="text-slate-400 mr-2">{selected.indexOf(question) + 1}.</span><Text text={question.text} language={templateLanguage} /></h4>{notes[question.id].proposal.trim() && <div className="border-l-2 border-emerald-300 pl-4 text-sm"><p className="font-semibold text-emerald-900">{templateLanguage === 'ru' ? 'Наше предложение Исе' : 'Unser Vorschlag an Isa'}</p><p className="mt-1 whitespace-pre-wrap break-words leading-relaxed">{notes[question.id].proposal}</p></div>}{includeComments && notes[question.id].comment.trim() && <div className="text-sm text-slate-600"><p className="font-semibold">{templateLanguage === 'ru' ? 'Комментарий команды' : 'Kommentar des Teams'}</p><p className="mt-1 whitespace-pre-wrap break-words leading-relaxed">{notes[question.id].comment}</p></div>}<p className="text-xs text-slate-400">{templateLanguage === 'ru' ? 'Ответ Исы: ____________________' : 'Antwort von Isa: ____________________'}</p></article>)}</section>)}
        </div>}
    </div> : <>
      <div className="flex flex-wrap justify-between items-start gap-3">
        <div className="inline-flex flex-wrap gap-1 rounded-xl border border-slate-200 bg-white p-1" role="group" aria-label={t('Fragenkatalog', 'Список вопросов')}>
          {(['team', 'roles'] as const).map(item => <button key={item} type="button" aria-pressed={catalog === item} onClick={() => switchCatalog(item)} className={`px-3 py-2 rounded-lg text-sm font-semibold ${catalog === item ? 'bg-emerald-700 text-white' : 'text-slate-500 hover:bg-slate-50'}`}>{item === 'team' ? t('Teamgespräch · 45 Fragen', 'Обсуждение · 45 вопросов') : t('Rollen-Vertiefung · 50 Fragen', 'По ролям · 50 вопросов')}</button>)}
        </div>
        <div className="text-right text-xs text-slate-500 pt-1"><p><strong className="text-slate-800 tabular-nums">{reviewed} / {catalogQuestions.length}</strong> {t('durchgesehen', 'обсудили')}</p><p className="mt-1"><strong className="text-emerald-800 tabular-nums">{selected.length}</strong> {t('für Isa · beide Kataloge', 'для Исы · оба списка')}</p></div>
      </div>
      <p className="text-xs text-slate-500">{catalog === 'team' ? t('Kompakter Einstieg fürs Teamgespräch. Die ausführlichen Rollenfragen vertiefen dieselben Themen.', 'Краткий список для встречи. Вопросы по ролям подробнее раскрывают те же темы.') : t('Ausführliche Rollenperspektiven aus derselben Datei. Einige Themen überschneiden sich mit dem Teamkatalog.', 'Подробные вопросы по ролям из того же файла. Часть тем повторяется в основном списке.')}</p>
      <div className="flex flex-wrap gap-2 items-center"><label className="relative flex-1 min-w-[200px]"><span className="sr-only">{t('Fragen durchsuchen', 'Поиск вопросов')}</span><Search className="absolute left-3 top-3 w-4 h-4 text-slate-400" /><input value={search} onChange={event => setSearch(event.target.value)} placeholder={t('Frage oder Stichwort suchen …', 'Поиск вопроса или слова …')} className="w-full pl-9 pr-3 py-2.5 text-sm rounded-xl bg-white border border-slate-200" /></label><select aria-label={t('Fragen filtern', 'Фильтр вопросов')} value={filter} onChange={event => setFilter(event.target.value as typeof filter)} className="rounded-xl border border-slate-200 bg-white p-2.5 text-sm"><option value="all">{t('Alle Fragen', 'Все вопросы')}</option><option value="pending">{t('Noch durchgehen', 'Ещё не обсудили')}</option><option value="selected">{t('Für Isa ausgewählt', 'Выбраны для Исы')}</option></select></div>
      <div className="grid gap-4 lg:grid-cols-[260px_minmax(0,1fr)] items-start">
        <div className="lg:hidden grid sm:grid-cols-2 gap-2">
          <label className="text-xs font-semibold text-slate-500">{t('Thema', 'Тема')}<select value={current?.groupId || ''} onChange={event => { const next = visible.find(question => question.groupId === event.target.value); if (next) setActiveId(next.id); }} className="mt-1 rounded-xl w-full border border-slate-200 bg-white p-3 text-sm text-slate-800">{groups.filter(group => visible.some(question => question.groupId === group.id)).map(group => <option key={group.id} value={group.id}>{language === 'ru' ? group.title.ru : group.title.de}</option>)}</select></label>
          <label className="text-xs font-semibold text-slate-500">{t('Frage direkt wählen', 'Выбрать вопрос')}<select value={current?.id || ''} onChange={event => setActiveId(event.target.value)} className="mt-1 rounded-xl w-full border border-slate-200 bg-white p-3 text-sm text-slate-800">{visible.filter(question => question.groupId === current?.groupId).map(question => <option key={question.id} value={question.id}>{question.number}. {language === 'ru' ? question.title.ru : question.title.de}</option>)}</select></label>
        </div>
        <aside aria-label={t('Themen und Fragen', 'Темы и вопросы')} className="hidden lg:block rounded-2xl border border-slate-200 bg-white p-3 lg:sticky lg:top-4">
          <p className="px-2 pt-1 pb-3 text-[11px] uppercase tracking-wide font-bold text-slate-400">{t('Themen', 'Темы')}</p>
          <div className="space-y-1">{groups.map(group => {
            const matches = visible.filter(question => question.groupId === group.id);
            const groupQuestions = catalogQuestions.filter(question => question.groupId === group.id);
            const done = groupQuestions.filter(question => notes[question.id]?.reviewed).length;
            const active = group.id === currentGroup?.id;
            return <div key={group.id}><button type="button" disabled={!matches.length} aria-pressed={active} onClick={() => setActiveId(matches[0].id)} className={`w-full text-left rounded-xl px-3 py-2.5 flex justify-between gap-3 text-sm disabled:opacity-35 ${active ? 'bg-emerald-50 text-emerald-900 font-semibold' : 'text-slate-600 hover:bg-slate-50'}`}><span>{language === 'ru' ? group.title.ru : group.title.de}</span><span className="shrink-0 text-[11px] text-slate-400 tabular-nums">{done}/{groupQuestions.length}</span></button>{active && <div className="mt-1 mb-2 space-y-1 border-l border-emerald-100 ml-3 pl-2 max-h-[300px] overflow-y-auto">{matches.map(question => <button type="button" key={question.id} aria-current={question.id === current.id ? 'step' : undefined} onClick={() => setActiveId(question.id)} className={`w-full flex items-start gap-2 text-left rounded-lg p-2 text-xs leading-relaxed ${question.id === current.id ? 'bg-slate-100 text-slate-900 font-semibold' : 'text-slate-500 hover:bg-slate-50'}`}><span className="shrink-0 mt-0.5 text-slate-400 w-5 tabular-nums">{question.number}.</span><span className="flex-1 line-clamp-2">{language === 'ru' ? question.title.ru : question.title.de}</span>{notes[question.id]?.includeInIsa ? <CheckCheck aria-label={t('Für Isa ausgewählt', 'Выбрано для Исы')} className="w-3.5 h-3.5 shrink-0 mt-1 text-emerald-700" /> : notes[question.id]?.reviewed && <Check aria-label={t('Durchgesehen', 'Обсудили')} className="w-3.5 h-3.5 shrink-0 mt-1 text-slate-400" />}</button>)}</div>}</div>;
          })}</div>
        </aside>
        <div className="min-w-0 space-y-3">
          {current ? <>
            <p className="px-1 text-xs font-semibold text-slate-500">{currentIndex + 1} / {visible.length} · {language === 'ru' ? currentGroup?.title.ru : currentGroup?.title.de}</p>
            <IsaQuestionCard question={current} note={notes[current.id] || EMPTY_ISA_QUESTION_NOTE} language={language} editable={loaded} onUpdate={change => update(current.id, change)} />
            <div className="flex flex-wrap justify-between gap-2"><button type="button" disabled={currentIndex <= 0} onClick={() => move(-1)} className="rounded-xl px-4 py-3 border border-slate-200 bg-white text-sm inline-flex items-center gap-2 disabled:opacity-40"><ArrowLeft className="w-4 h-4" />{t('Vorherige', 'Предыдущий')}</button><div className="flex flex-wrap gap-2"><button type="button" disabled={currentIndex >= visible.length - 1} onClick={() => move(1)} className="rounded-xl px-4 py-3 border border-slate-200 bg-white text-sm disabled:opacity-40">{t('Nächste', 'Следующий')} <ArrowRight className="inline w-4 h-4 ml-1" /></button><button type="button" disabled={!loaded} onClick={markAndContinue} className="rounded-xl px-4 py-3 bg-emerald-700 text-white text-sm font-semibold disabled:opacity-40"><Check className="inline w-4 h-4 mr-1.5" />{currentIndex === visible.length - 1 ? t('Als durchgesehen markieren', 'Отметить как обсуждённый') : t('Durchgesehen & weiter', 'Обсудили — дальше')}</button></div></div>
            {catalog === 'team' && current.number <= 3 && <p className="rounded-xl bg-amber-50/70 border border-amber-100 p-3 text-xs text-amber-900 leading-relaxed">{t('Bei Rollen konkret werden: Was sieht die Person → was gibt sie ein → welche Aktion führt sie aus → wem übergibt sie das Ergebnis?', 'Для ролей нужен конкретный ответ: что человек видит → что вводит → какие действия выполняет → кому передаёт результат?')}</p>}
          </> : <div className="rounded-2xl border border-slate-200 bg-white p-8 text-center text-slate-500"><p>{t('Keine Fragen für diese Auswahl.', 'Нет вопросов для этого фильтра.')}</p><button type="button" onClick={() => { setSearch(''); setFilter('all'); }} className="mt-3 text-emerald-800 underline">{t('Alle Fragen anzeigen', 'Показать все вопросы')}</button></div>}
          {reviewed === catalogQuestions.length && <div role="status" className="rounded-xl bg-emerald-50 border border-emerald-200 p-4 text-sm text-emerald-950"><strong>{t('Diesen Katalog habt ihr vollständig durchgesehen.', 'Вы обсудили весь этот список.')}</strong><p className="mt-1">{t('Die angehakten Fragen und eure Vorschläge stehen jetzt in der Isa-Vorlage.', 'Отмеченные вопросы и ваши предложения находятся в подборке для Исы.')}</p><button type="button" onClick={() => setPreview(true)} className="mt-2 underline font-semibold">{t('Vorlage ansehen', 'Посмотреть подборку')}</button></div>}
        </div>
      </div>
    </>}
    <footer className="flex flex-wrap items-center justify-between gap-3 border-t border-slate-200 pt-4 text-xs text-slate-500">
      <span>{t('Quelle: Fragen Amruddy(1).txt · Russisches Original und deutsche Lesefassung.', 'Источник: Fragen Amruddy(1).txt · Русский оригинал и немецкий перевод.')}</span>
      <div className="flex flex-wrap gap-2"><button type="button" disabled={!loaded} onClick={() => download('ProRiv_Fragen_Sicherung.json', isaQuestionsBackup(notesRef.current), 'application/json')} className="rounded-lg bg-white border border-slate-200 px-3 py-2 inline-flex items-center gap-2 disabled:opacity-40"><Download className="w-3.5 h-3.5" />{t('Sicherung herunterladen', 'Скачать резервную копию')}</button><button type="button" onClick={() => fileInput.current?.click()} className="rounded-lg bg-white border border-slate-200 px-3 py-2 inline-flex items-center gap-2"><Upload className="w-3.5 h-3.5" />{t('Sicherung laden', 'Загрузить резервную копию')}</button><input ref={fileInput} type="file" accept=".json,application/json" aria-label={t('Fragen-Sicherung auswählen', 'Выбрать резервную копию вопросов')} onChange={readBackup} className="hidden" /></div>
    </footer>
  </section>;
}
