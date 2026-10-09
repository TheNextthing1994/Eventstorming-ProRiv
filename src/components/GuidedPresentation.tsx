import React, { useEffect, useMemo, useState } from 'react';
import { ArrowLeft, ArrowRight, BookOpen, CheckCircle2, ChevronDown, ClipboardList, Download, ExternalLink, FileQuestion, GitBranch, Layers3, Pencil, Save, ShieldCheck, X } from 'lucide-react';
import { DatabaseState, Language, TopicId } from '../types';
import { WORKSHOP_STEPS, WorkshopStep } from '../data/workshopContent';
import { loadWorkshopNotes, saveWorkshopNotes, WorkshopNote, WorkshopNotes } from '../db/indexedDb';

interface GuidedPresentationProps {
  databaseState: DatabaseState;
  language: Language;
  onLanguageChange: (language: Language) => void;
  onExit: () => void;
}
const QUESTION_IDS = ['arrival','work','pricing','customer','export','approval'];
const PROPOSAL_IDS = ['work','pricing','send','customer','export','accounting'];
const LABELS = [
  ['Überblick', 'Обзор'],
  ['Kundenprozess', 'Процесс клиента'],
  ['Research & Quellen', 'Исследование и источники'],
  ['Unsere Vorschläge', 'Наши предложения'],
  ['Wichtige Fragen', 'Главные вопросы'],
  ['Ergebnisse & nächste Schritte', 'Итоги и следующие шаги']
] as const;
const BLANK_NOTE: WorkshopNote = {status:'open',answer:'',owner:'',nextStep:'',updatedAt:''};
type Selection = string | null;

const outputMarkdown = (notes: WorkshopNotes) => {
  let out = '# ProRiv / ISA – Senior-Meeting\n\n';
  out += '> Gesprächsnotizen aus der geführten Präsentation und dem Senior-Workshop. Nur Status „Entschieden“ kennzeichnet bestätigte Gesprächsergebnisse.\n\n';
  for (const step of WORKSHOP_STEPS) {
    const note = notes[step.id];
    out += '## '+step.nr+'. '+step.title+'\n\n**Kundengespräch (RAW):** '+step.customerFact+
      '\n\n**Vorschlag, nicht beschlossen:** '+step.recommendation+'\n\n**Offene Frage:** '+step.openQuestion+
      '\n\n**Status:** '+(note?.status === 'decided' ? 'Entschieden' : note?.status === 'test' ? 'Zu prüfen' : 'Offen')+
      '\n\n**Antwort/Begründung:** '+(note?.answer || '—')+'\n\n**Verantwortlich:** '+(note?.owner || '—')+
      '\n\n**Nächster Schritt:** '+(note?.nextStep || '—')+'\n\n**Quelle:** '+step.source+'\n\n';
  }
  return out;
};
const downloadText = (name: string, body: string, type: string) => {
  const url = URL.createObjectURL(new Blob([body], {type}));
  const a = document.createElement('a');
  a.href = url; a.download = name; document.body.appendChild(a);
  a.click(); a.remove(); setTimeout(() => URL.revokeObjectURL(url), 1000);
};

export const GuidedPresentation: React.FC<GuidedPresentationProps> = ({
  databaseState, language, onLanguageChange, onExit
}) => {
  const t = (de: string, ru: string) => language === 'ru' ? ru : de;
  const [slide, setSlide] = useState(0);
  const [selectedId, setSelectedId] = useState<Selection>(null);
  const [notes, setNotes] = useState<WorkshopNotes>({});
  const [loaded, setLoaded] = useState(false);
  const [saveStatus, setSaveStatus] = useState<'idle'|'saved'|'saving'|'error'>('idle');
  const [sourcesOpen, setSourcesOpen] = useState(false);
  const [editOpen, setEditOpen] = useState(false);

  useEffect(() => {
    let mounted = true;
    loadWorkshopNotes().then(saved => {
      if (mounted) {setNotes(saved);setLoaded(true);}
    }).catch(() => {
      if (mounted) {setLoaded(true);setSaveStatus('error');}
    });
    return () => {mounted=false;};
  }, []);
  const selected = WORKSHOP_STEPS.find(s => s.id === selectedId);
  const currentNote = selected ? (notes[selected.id] || BLANK_NOTE) : BLANK_NOTE;
  const decidedCount = WORKSHOP_STEPS.filter(s => notes[s.id]?.status === 'decided').length;
  const toTestCount = WORKSHOP_STEPS.filter(s => notes[s.id]?.status === 'test').length;
  const onlyOriginalQuestions = databaseState.questions.filter(q => q.originalFromSketch).length;

  const select = (id: string) => {
    setSelectedId(id);setEditOpen(true);setSourcesOpen(false);setSaveStatus('idle');
  };
  const changeSlide = (next: number) => {
    setSlide(Math.min(Math.max(next,0),LABELS.length-1));
    setSelectedId(null);setEditOpen(false);setSourcesOpen(false);setSaveStatus('idle');
  };
  const updateNote = (change: Partial<WorkshopNote>) => {
    if (!selected || !loaded) return;
    setNotes(prev => ({
      ...prev, [selected.id]: {...(prev[selected.id] || BLANK_NOTE),...change,updatedAt:new Date().toISOString()}
    }));
    setSaveStatus('idle');
  };
  const saveNote = async () => {
    if (!selected || !loaded) return;
    if (currentNote.status === 'decided' && !currentNote.answer.trim()) {
      alert(t('Für eine Entscheidung ist eine begründete Antwort erforderlich.',
        'Для решения нужно записать обоснование.'));
      return;
    }
    setSaveStatus('saving');
    try {
      // Merge again with storage so unrelated workshop notes are not discarded.
      const latest = await loadWorkshopNotes();
      const merged = {...latest, [selected.id]: notes[selected.id] || BLANK_NOTE};
      await saveWorkshopNotes(merged);
      setNotes(merged);setSaveStatus('saved');
    } catch (e) {console.error('Could not save meeting note',e);setSaveStatus('error');}
  };
  const StepCard: React.FC<{step:WorkshopStep; field:'customer'|'recommendation'|'question'; compact?:boolean}> = ({step,field,compact}) => (
    <button type="button" onClick={() => select(step.id)}
      className="text-left w-full border border-slate-200 hover:border-emerald-500 hover:bg-emerald-50/30 rounded-xl bg-white p-4 transition-colors flex flex-col gap-2 h-full group">
      <div className="flex items-center justify-between gap-2">
        <span className="text-[10px] uppercase font-semibold tracking-wider text-slate-500">{String(step.nr).padStart(2,'0')} · {t(step.title,step.titleRu)}</span>
        <span className="text-[10px] text-emerald-800 group-hover:underline">{t('Öffnen ↗','Открыть ↗')}</span>
      </div>
      <p className={"text-slate-800 leading-relaxed "+(compact?"text-xs":"text-sm")}>
        {field === 'customer' ? t(step.customerFact,step.customerFactRu) :
          field === 'question' ? t(step.openQuestion,step.openQuestionRu) :
            t(step.recommendation,step.recommendationRu)}
      </p>
      {notes[step.id]?.status === 'decided' &&
        <span className="text-[11px] text-emerald-800 font-semibold flex items-center gap-1"><CheckCircle2 className="w-3.5 h-3.5" />{t('Im Meeting entschieden','Решено на встрече')}</span>}
    </button>
  );
  const groupedSources = useMemo(() => {
    const map = new Map<string, {name:string;kind:string;why:string;link?:string;step:string}>();
    for (const step of WORKSHOP_STEPS) {
      for (const choice of step.choices) {
        if (!map.has(choice.name)) map.set(choice.name, {
          name:choice.name,kind:choice.kind,why:t(choice.why,choice.whyRu),link:choice.link,step:step.title
        });
      }
    }
    return Array.from(map.values());
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [language]);

  useEffect(() => {
    const key = (e: KeyboardEvent) => {
      const target = e.target as HTMLElement;
      if (target && ['INPUT','TEXTAREA','SELECT'].includes(target.tagName)) return;
      if (e.key === 'ArrowRight' && !editOpen) changeSlide(slide+1);
      if (e.key === 'ArrowLeft' && !editOpen) changeSlide(slide-1);
      if (e.key === 'Escape' && editOpen) setEditOpen(false);
    };
    window.addEventListener('keydown',key);
    return () => window.removeEventListener('keydown',key);
  }, [slide,editOpen]);

  return (
    <div className="min-h-screen bg-slate-100 text-slate-900 font-sans">
      <header className="sticky top-0 z-20 bg-slate-950 text-white border-b border-slate-800 px-4 sm:px-6 py-3 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <button onClick={onExit} className="p-2 rounded-lg hover:bg-slate-800" aria-label={t('Workshop verlassen','Выйти')}><ArrowLeft className="w-4 h-4"/></button>
          <div>
            <p className="text-[10px] text-emerald-300 uppercase tracking-widest font-semibold">{t('Geführtes Senior-Meeting','Презентация для сеньора')}</p>
            <h1 className="font-bold text-sm sm:text-base">ProRiv / ISA · {t(LABELS[slide][0], LABELS[slide][1])}</h1>
          </div>
        </div>
        <div className="flex flex-wrap gap-1.5 items-center">
          {(['de','ru','bilingual'] as Language[]).map(lang => (
            <button key={lang} onClick={() => onLanguageChange(lang)}
              className={"text-[11px] rounded px-2 py-1.5 "+(language===lang?'bg-emerald-600 text-white':'bg-slate-800 text-slate-300 hover:bg-slate-700')}>
              {lang==='bilingual'?'DE+RU':lang.toUpperCase()}
            </button>
          ))}
          <button onClick={()=>downloadText('ProRiv_Senior_Meeting.md',outputMarkdown(notes),'text/markdown')}
            className="bg-slate-800 hover:bg-slate-700 rounded-lg px-3 py-2 ml-2 text-xs font-semibold inline-flex items-center gap-1.5">
            <Download className="w-4 h-4"/>{t('Protokoll','Протокол')}
          </button>
        </div>
      </header>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-5">
        <div className="flex flex-wrap items-center gap-1.5 mb-5">
          {LABELS.map((label,i)=>(
            <button key={i} onClick={()=>changeSlide(i)}
              className={"px-3 py-2 rounded-lg text-xs font-semibold "+(i===slide?'bg-slate-900 text-white':'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50')}>
              {i+1}. {t(label[0], label[1])}
            </button>
          ))}
        </div>

        <div className={"grid items-start gap-4 "+(editOpen&&selected?"grid-cols-1 xl:grid-cols-[minmax(0,1fr)_380px]":"grid-cols-1")}>
          <main className="rounded-2xl bg-white border border-slate-200 shadow-sm p-5 sm:p-7 space-y-5 min-h-[510px]">
            <div className="border-b border-slate-100 pb-4">
              <p className="text-[11px] uppercase font-semibold tracking-widest text-emerald-800">
                {t('Schritt','Шаг')} {slide+1} / {LABELS.length} · {t('Gemeinsam verstehen und entscheiden','Понять и решить вместе')}
              </p>
              <h2 className="mt-1 text-xl sm:text-2xl font-bold">{t(LABELS[slide][0], LABELS[slide][1])}</h2>
            </div>

            {slide===0 && <>
              <p className="text-base leading-relaxed font-medium">{t(
                'Ziel: Nicht noch eine große Bau-App, sondern eine einfache mobile Erfassung für Kernbohren, Betonsägen und Projektstunden mit Übergabe an Tripletex.',
                'Цель: не ещё одна большая строительная система, а простое мобильное приложение для бурения, резки бетона и учёта времени с передачей в Tripletex.'
              )}</p>
              <div className="grid sm:grid-cols-3 gap-3">
                <div className="p-4 bg-slate-50 rounded-xl border border-slate-100">
                  <span className="text-[11px] text-slate-500 font-bold">{t('HEUTE','СЕЙЧАС')}</span>
                  <p className="text-sm mt-2">{t('AppSheet für Rapporte; Tripletex für Zeiten und Buchhaltung.','AppSheet для рапортов, Tripletex для времени и бухгалтерии.')}</p>
                </div>
                <div className="p-4 bg-slate-50 rounded-xl border border-slate-100">
                  <span className="text-[11px] text-slate-500 font-bold">{t('GEWÜNSCHT','НУЖНО')}</span>
                  <p className="text-sm mt-2">{t('Wenige Eingaben, automatische Preise, Fotos, Rapport direkt an den Kunden.','Мало полей, автоматическая цена, фото, отправка рапорта клиенту.')}</p>
                </div>
                <div className="p-4 bg-emerald-50 rounded-xl border border-emerald-100">
                  <span className="text-[11px] text-emerald-900 font-bold">{t('UNSER ARBEITSZIEL','НАША ЦЕЛЬ')}</span>
                  <p className="text-sm mt-2">{t('Den Ablauf bestätigen, offene Entscheidungen klären, danach erst den MVP festlegen.','Подтвердить процесс, выяснить вопросы и только потом утвердить MVP.')}</p>
                </div>
              </div>
              <div className="p-3 bg-amber-50 border border-amber-100 text-amber-900 text-xs rounded-lg">
                {t('Quelle: vorläufiges Kundengespräch (RAW). Keine akzeptierte Spezifikation.',
                  'Источник: предварительный разговор с клиентом (RAW), ещё не утверждённая спецификация.')}
              </div>
            </>}

            {slide===1 && <>
              <p className="text-sm text-slate-600">{t('Klicke auf einen Schritt: Anforderung, Empfehlung und offene Frage erscheinen rechts – mit Speichern.',
                'Нажмите этап, чтобы увидеть требования, предложение и записать ответ справа.')}</p>
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-2">
                {WORKSHOP_STEPS.filter(s=>!['approval','accounting','export'].includes(s.id)).map(step=><StepCard key={step.id} step={step} field="customer" compact/>)}
              </div>
              <div className="p-4 border border-sky-200 bg-sky-50 rounded-xl space-y-2">
                <h3 className="text-sm font-bold flex gap-2 items-center"><GitBranch className="w-4 h-4"/>{t('Separater Stundenpfad → Tripletex','Отдельный путь часов → Tripletex')}</h3>
                <div className="grid sm:grid-cols-3 gap-2">
                  {WORKSHOP_STEPS.filter(s=>['export','approval','accounting'].includes(s.id)).map(step=><StepCard key={step.id} step={step} field="customer" compact/>)}
                </div>
                <p className="text-[11px] text-sky-900">{t('Ob die Kundenantwort zwingend vor dem Stundenexport erfolgen muss, ist noch offen.', 'Нужно ли ждать ответ клиента до экспорта часов — открытый вопрос.')}</p>
              </div>
            </>}

            {slide===2 && <>
              <p className="text-sm text-slate-600">{t('Wichtig ist nicht die Menge recherchierter Programme, sondern welche konkrete Funktion wir übernehmen können und welche Lücke bleibt.',
                'Важно не количество программ, а какая их функция помогает и что всё равно надо разработать.')}</p>
              <div className="grid sm:grid-cols-2 gap-3">
                {[
                  {kind:'vorbild',title:t('Fachliche Vorbilder','Отраслевые примеры'),desc:t('CoreDocket: spezialisierte Betonrapporte. SmartDok/Jobbkontroll: Baustellenzeit und Anwesenheit.','CoreDocket: специализированные рапорты. SmartDok/Jobbkontroll: учёт времени и присутствия.')},
                  {kind:'oss',title:t('Open Source / Bausteine','Open Source / компоненты'),desc:t('ODK: Formular-Prototyp. Expo: schlanke mobile App. pdfme: PDF. ERPNext: Preisregeln als Vorbild.','ODK: прототип формы. Expo: приложение. pdfme: PDF. ERPNext: примеры ценовых правил.')},
                  {kind:'bestand',title:t('Bestandssysteme','Текущие системы'),desc:t('AppSheet läuft heute; Tripletex bleibt für Stundenprüfung und Buchhaltung.','Сейчас AppSheet; Tripletex остаётся для часов и бухгалтерии.')},
                  {kind:'option',title:t('Noch technisch zu prüfen','Ещё проверить'),desc:t('Tripletex-API, Kundenfreigabe, HMS/QR/GPS, echte Offline-Anforderungen.','API Tripletex, согласование клиента, HMS/QR/GPS, реальный офлайн.')}
                ].map(item=><div key={item.kind} className="border border-slate-200 rounded-xl p-4">
                  <div className="text-xs font-bold text-emerald-800 uppercase tracking-widest">{item.title}</div>
                  <p className="mt-2 text-sm">{item.desc}</p>
                </div>)}
              </div>
              <details className="border border-slate-200 rounded-xl overflow-hidden">
                <summary className="px-4 py-3 cursor-pointer text-sm font-semibold">{t('Originale Produktlinks und Recherchegründe öffnen','Открыть ссылки и причины выбора')} ({groupedSources.length})</summary>
                <div className="p-4 border-t border-slate-200 grid sm:grid-cols-2 gap-2 max-h-[390px] overflow-auto">
                  {groupedSources.map(src=><div key={src.name} className="bg-slate-50 rounded-lg p-3 text-xs">
                    <div className="flex justify-between gap-2 font-semibold">{src.name} <span className="text-[10px] uppercase text-slate-500">{src.kind}</span></div>
                    <div className="mt-1 text-slate-600">{src.why}</div>
                    {src.link&&<a href={src.link} target="_blank" rel="noreferrer" className="mt-2 inline-flex gap-1 text-emerald-700 hover:underline"><ExternalLink className="w-3 h-3"/>{t('Quelle öffnen','Открыть ссылку')}</a>}
                  </div>)}
                </div>
              </details>
            </>}

            {slide===3 && <>
              <p className="text-sm text-slate-600">{t('Vorläufige Umsetzungsempfehlungen, keine beschlossenen Architekturentscheidungen. Klicke für Begründung und konkrete offene Frage.',
                'Предварительные рекомендации, ещё не утверждённая архитектура. Откройте карточку для обсуждения.')}</p>
              <div className="grid sm:grid-cols-2 gap-3">
                {WORKSHOP_STEPS.filter(s=>PROPOSAL_IDS.includes(s.id)).map(step=><StepCard key={step.id} step={step} field="recommendation" compact/>)}
              </div>
              <div className="text-xs text-slate-500 flex items-start gap-2"><ShieldCheck className="w-4 h-4 shrink-0"/>{t('Leitlinie: Tripletex nicht nachbauen; HMS-Liste nur nach Prüfung der Baustellenverantwortung; spezialisierte Rapporte vor allgemeinem ERP.',
                'Не заменять Tripletex; отдельный HMS-реестр только после выяснения ответственности; сначала специализированные рапорты.')}</div>
            </>}

            {slide===4 && <>
              <p className="text-sm text-slate-600">{t('Diese Fragen können MVP-Umfang, Datenmodell oder Schnittstellen verändern. Sie sind für morgen priorisiert; das vollständige Fragenarchiv bleibt erhalten.',
                'Эти вопросы влияют на MVP, данные и интеграции. Остальные вопросы сохранены в архиве.')}</p>
              <div className="grid sm:grid-cols-2 gap-3">
                {WORKSHOP_STEPS.filter(s=>QUESTION_IDS.includes(s.id)).map(step=><StepCard key={step.id} step={step} field="question" compact/>)}
              </div>
              <div className="rounded-lg bg-slate-50 border border-slate-200 px-4 py-3 text-xs text-slate-600">
                <FileQuestion className="w-4 h-4 inline mr-1.5"/>{t('Ein Teil der Fragen muss Isa fachlich beantworten, ein Teil benötigt eine technische Prüfung durch den Senior. Nicht alles als „Frage an Isa“ behandeln.',
                  'Часть вопросов адресована Исе, часть требует технической проверки сеньором. Не все вопросы предназначены клиенту.')}
              </div>
            </>}

            {slide===5 && <>
              <div className="grid sm:grid-cols-3 gap-3">
                <div className="rounded-xl p-4 bg-emerald-50 border border-emerald-100">
                  <div className="text-3xl font-bold text-emerald-800">{decidedCount}</div><div className="text-xs mt-1">{t('Im Meeting entschieden','Решено на встрече')}</div>
                </div>
                <div className="rounded-xl p-4 bg-amber-50 border border-amber-100">
                  <div className="text-3xl font-bold text-amber-800">{toTestCount}</div><div className="text-xs mt-1">{t('Weitere Prüfung','Требует проверки')}</div>
                </div>
                <div className="rounded-xl p-4 bg-slate-50 border border-slate-100">
                  <div className="text-3xl font-bold">{WORKSHOP_STEPS.length-decidedCount-toTestCount}</div><div className="text-xs mt-1">{t('Noch offen','Ещё открыто')}</div>
                </div>
              </div>
              <div className="space-y-2">
                {WORKSHOP_STEPS.map(step=> {
                  const note=notes[step.id], st=note?.status || 'open';
                  return <button key={step.id} onClick={()=>select(step.id)} className="w-full flex flex-wrap items-center gap-2 text-left border border-slate-200 rounded-lg px-3 py-3 hover:bg-slate-50">
                    <span className="text-xs text-slate-500 font-mono">{String(step.nr).padStart(2,'0')}</span>
                    <span className="text-sm font-semibold flex-1">{t(step.title,step.titleRu)}</span>
                    <span className={"text-xs "+(st==='decided'?'text-emerald-700':st==='test'?'text-amber-700':'text-slate-400')}>
                      {st==='decided'?t('Entschieden','Решено'):st==='test'?t('Zu prüfen','Проверить'):t('Offen','Открыто')}
                    </span>
                    <Pencil className="w-3.5 h-3.5 text-slate-400"/>
                    {note?.nextStep&&<p className="basis-full pl-5 text-xs text-slate-500">{note.nextStep}</p>}
                  </button>;
                })}
              </div>
              <button onClick={()=>downloadText('ProRiv_Senior_Meeting.md',outputMarkdown(notes),'text/markdown')}
                className="bg-emerald-700 text-white hover:bg-emerald-800 rounded-lg px-4 py-2.5 text-sm font-semibold inline-flex items-center gap-2">
                <Download className="w-4 h-4"/>{t('Meeting-Protokoll exportieren','Скачать протокол')}
              </button>
            </>}

            <div className="flex justify-between items-center pt-3 border-t border-slate-100 gap-3">
              <button onClick={()=>changeSlide(slide-1)} disabled={slide===0} className="rounded-lg px-4 py-2 border border-slate-200 text-xs font-semibold disabled:opacity-30">
                ← {t('Zurück','Назад')}
              </button>
              <span className="text-xs text-slate-500">{slide+1} / {LABELS.length}</span>
              <button onClick={()=>changeSlide(slide+1)} disabled={slide===LABELS.length-1} className="rounded-lg px-4 py-2 bg-slate-900 text-white text-xs font-semibold disabled:opacity-30">
                {t('Weiter','Далее')} →
              </button>
            </div>
          </main>

          {editOpen&&selected&&<aside className="bg-white rounded-2xl border border-slate-200 shadow-sm xl:sticky xl:top-[85px] overflow-hidden">
            <div className="bg-slate-900 text-white px-4 py-3 flex items-start gap-2">
              <div className="flex-1">
                <div className="text-[10px] uppercase tracking-wide text-emerald-300">{String(selected.nr).padStart(2,'0')} · {t('Diskussion & Entscheidung','Обсуждение и решение')}</div>
                <h3 className="font-bold text-base mt-0.5">{t(selected.title,selected.titleRu)}</h3>
              </div>
              <button onClick={()=>setEditOpen(false)} className="p-1 rounded hover:bg-slate-800" aria-label={t('Schließen','Закрыть')}><X className="w-4 h-4"/></button>
            </div>
            <div className="p-4 space-y-3 max-h-[calc(100vh-165px)] overflow-y-auto">
              <div><div className="text-[10px] uppercase text-slate-500 font-bold">{t('Kunde (Gesprächsnotiz)','Клиент (запись разговора)')}</div><p className="text-xs mt-1 leading-relaxed">{t(selected.customerFact,selected.customerFactRu)}</p></div>
              <div><div className="text-[10px] uppercase text-emerald-700 font-bold">{t('Unser Vorschlag – nicht beschlossen','Наше предложение — не утверждено')}</div><p className="text-xs mt-1 leading-relaxed">{t(selected.recommendation,selected.recommendationRu)}</p></div>
              <div className="bg-amber-50 border border-amber-200 rounded-lg p-3">
                <div className="text-[10px] uppercase font-bold text-amber-900">{t('Offene Frage','Открытый вопрос')}</div>
                <p className="text-xs mt-1 leading-relaxed text-amber-900">{t(selected.openQuestion,selected.openQuestionRu)}</p>
              </div>
              <details open={sourcesOpen} onToggle={e=>setSourcesOpen(e.currentTarget.open)} className="border border-slate-200 rounded-lg">
                <summary className="px-3 py-2 cursor-pointer text-xs font-semibold flex items-center justify-between">{t('Quellen / OSS / Konkurrenz','Источники / OSS / конкуренты')} <ChevronDown className="w-4 h-4"/></summary>
                <div className="p-3 border-t border-slate-100 space-y-2">
                  <p className="text-[11px] text-slate-500">{selected.source}<br/>{selected.evidence}</p>
                  {selected.choices.map(choice=><div key={choice.name} className="text-xs border-t border-slate-100 pt-2">
                    <span className="font-semibold">{choice.name}</span> <span className="text-slate-400">({choice.kind})</span>
                    <p className="text-slate-600 mt-1">{t(choice.why,choice.whyRu)}</p>
                    {choice.link&&<a href={choice.link} target="_blank" rel="noreferrer" className="text-emerald-700 inline-flex items-center gap-1 mt-1"><ExternalLink className="w-3 h-3"/>{t('Quelle','Источник')}</a>}
                  </div>)}
                </div>
              </details>
              <div className="border-t border-slate-200 pt-3 space-y-2">
                <label className="text-xs font-bold">{t('Ergebnisstatus','Статус')}</label>
                <div className="grid grid-cols-3 gap-1.5">
                  {(['open','test','decided'] as const).map(status=><button key={status} onClick={()=>updateNote({status})} disabled={!loaded||status==='decided'&&!currentNote.answer.trim()}
                    className={"py-2 px-1 text-[11px] rounded-lg border disabled:opacity-40 "+(currentNote.status===status?'bg-emerald-50 border-emerald-600 font-bold':'bg-slate-50 border-slate-200')}>
                    {status==='open'?t('Offen','Открыто'):status==='test'?t('Prüfen','Проверить'):t('Entschieden','Решено')}
                  </button>)}
                </div>
                <label className="block text-xs font-semibold">{t('Antwort / Begründung','Ответ / обоснование')}
                  <textarea rows={3} value={currentNote.answer} onChange={e=>updateNote({answer:e.target.value})} disabled={!loaded}
                    className="mt-1 w-full border border-slate-200 rounded-lg p-2 text-xs font-normal resize-y" placeholder={t('Was haben wir besprochen?','О чём договорились?')}/>
                </label>
                <label className="block text-xs font-semibold">{t('Verantwortlich','Ответственный')}
                  <input value={currentNote.owner} onChange={e=>updateNote({owner:e.target.value})} disabled={!loaded}
                    className="mt-1 w-full border border-slate-200 rounded-lg p-2 text-xs font-normal" placeholder="Isa / Senior / ..."/>
                </label>
                <label className="block text-xs font-semibold">{t('Nächster Schritt','Следующий шаг')}
                  <input value={currentNote.nextStep} onChange={e=>updateNote({nextStep:e.target.value})} disabled={!loaded}
                    className="mt-1 w-full border border-slate-200 rounded-lg p-2 text-xs font-normal"/>
                </label>
                <div className="flex justify-between items-center gap-2">
                  <span className={"text-[11px] "+(saveStatus==='error'?'text-rose-700':'text-slate-500')}>
                    {saveStatus==='saved'?t('Gespeichert','Сохранено'):saveStatus==='saving'?t('Speichern…','Сохранение…'):saveStatus==='error'?t('Fehler beim Speichern','Ошибка сохранения'):t('Noch nicht gespeichert','Ещё не сохранено')}
                  </span>
                  <button onClick={saveNote} disabled={!loaded||saveStatus==='saving'}
                    className="bg-emerald-700 hover:bg-emerald-800 text-white rounded-lg px-4 py-2.5 text-xs font-bold inline-flex items-center gap-1.5 disabled:opacity-50">
                    <Save className="w-4 h-4"/>{t('Speichern','Сохранить')}
                  </button>
                </div>
                <p className="text-[11px] text-slate-400">{t('Diese Notiz wird auch im Senior-Workshop angezeigt. Browserlokal; vor Gerätewechsel exportieren.',
                  'Эта запись доступна и в Workshop. Данные хранятся в браузере; перед сменой устройства экспортируйте.')}</p>
              </div>
            </div>
          </aside>}
        </div>
      </div>
    </div>
  );
};
