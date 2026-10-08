import React from 'react';
import { ArrowRight, BookOpen, Building2, CheckCircle2, CircleHelp, Code2, Compass, GitBranch, Layers3, Search, ShieldCheck, Workflow } from 'lucide-react';
import { DatabaseState, Language, TopicId } from '../types';

/**
 * High-level orientation for the senior meeting.
 * No duplicate research storage: all actions navigate to existing research and workshop views.
 */
interface WorkshopFlowViewProps {
  databaseState: DatabaseState;
  language: Language;
  onStartWorkshop: () => void;
  onSelectTopic: (topic: TopicId) => void;
  onNavigateSection: (section: string) => void;
}
export const WorkshopFlowView: React.FC<WorkshopFlowViewProps> = ({
  databaseState, language, onStartWorkshop, onSelectTopic, onNavigateSection
}) => {
  const t = (de: string, ru: string) => language === 'ru' ? ru : de;
  const questions = databaseState.questions.length;
  const resolved = databaseState.questions.filter(q => q.isResolved).length;

  const phases = [
    {
      number: '01', icon: CircleHelp,
      title: t('Kundenbedarf', 'Запрос клиента'),
      question: t('Was braucht ProRiv wirklich?', 'Что на самом деле нужно ProRiv?'),
      action: t('Kundenfragen', 'Вопросы клиента'),
      onClick: () => onNavigateSection('senior-decisions')
    },
    {
      number: '02', icon: GitBranch,
      title: 'Event Storming',
      question: t('Wer macht was, wann und warum?', 'Кто, что, когда и почему делает?'),
      action: t('Ereignisse ansehen', 'Смотреть события'),
      onClick: () => onNavigateSection('event-storming')
    },
    {
      number: '03', icon: Search,
      title: 'Deep Research',
      question: t('Was gibt es bereits? Was können wir übernehmen?', 'Что уже существует? Что можно использовать?'),
      action: t('Vergleiche öffnen', 'Открыть сравнение'),
      onClick: () => onNavigateSection('competitors')
    },
    {
      number: '04', icon: Compass,
      title: t('Living Workshop', 'Живая карта'),
      question: t('Kundenaussage, Belege und Vorschlag am gleichen Prozessschritt.', 'Запрос, доказательства и решение на одном шаге процесса.'),
      action: t('Workshop starten', 'Открыть мастерскую'),
      onClick: onStartWorkshop
    },
    {
      number: '05', icon: Layers3,
      title: t('Architektur & nächste Schritte', 'Архитектура и следующие шаги'),
      question: t('Was bauen wir? Was testen wir zuerst?', 'Что строим? Что сначала проверяем?'),
      action: t('Entscheidungen öffnen', 'Открыть решения'),
      onClick: () => onNavigateSection('senior-decisions')
    }
  ];
  const research = [
    {
      icon: Building2,
      title: t('Branche & Prozesse', 'Отрасль и процессы'),
      why: t('Was ist bei norwegischen Baustellen üblich?', 'Какие процессы приняты на стройках Норвегии?'),
      action: () => onSelectTopic('clients')
    },
    {
      icon: Search,
      title: t('Markt & Open Source', 'Рынок и Open Source'),
      why: t('Bestehende Produkte, fertige Bausteine und Lücken.', 'Готовые продукты, OSS-компоненты и пробелы.'),
      action: () => onNavigateSection('competitors')
    },
    {
      icon: Code2,
      title: t('Technik & APIs', 'Технологии и API'),
      why: t('React Native, Offline, Tripletex und Schnittstellen.', 'React Native, офлайн, Tripletex и интеграции.'),
      action: () => onSelectTopic('api')
    },
    {
      icon: ShieldCheck,
      title: t('Regeln & Risiken', 'Правила и риски'),
      why: t('HMS, Datenschutz und ungeklärte Entscheidungen.', 'HMS, защита данных и открытые решения.'),
      action: () => onStartWorkshop()
    }
  ];

  return (
    <section className="w-full max-w-5xl space-y-4" aria-label={t('Workshop-Flow-Ansicht','Карта этапов проекта')}>
      <div className="rounded-2xl bg-slate-900 text-white p-5 sm:p-6 border border-slate-800 shadow-sm">
        <div className="text-[10px] font-bold tracking-[0.17em] uppercase text-emerald-300">
          {t('Gesprächsleitfaden · ProRiv (Isa\'s Projekt)', 'План встречи · ProRiv (проект Исы)')}
        </div>
        <h1 className="font-bold text-xl sm:text-2xl mt-1">{t('Vom Kundenwunsch zur Architektur', 'От запроса клиента к архитектуре')}</h1>
        <p className="text-sm text-slate-300 mt-2">
          {t('Fünf Phasen statt vieler Menüs. Jeder Schritt führt zu den vorhandenen Originaldaten – nichts ist dupliziert oder gelöscht.',
            'Пять этапов вместо множества меню. Каждый шаг открывает существующие материалы — ничего не потеряно и не дублируется.')}
        </p>
        <div className="mt-4 flex flex-wrap gap-3 items-center">
          <button onClick={onStartWorkshop} className="flex items-center gap-2 rounded-lg bg-emerald-400 hover:bg-emerald-300 text-slate-950 font-bold text-xs px-4 py-2.5">
            <Workflow className="w-4 h-4" />{t('Interaktive Prozesslandkarte öffnen', 'Открыть интерактивную карту')}
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
          <span className="text-xs text-slate-300">{resolved} / {questions} {t('Senior-Fragen geklärt', 'вопросов выяснено')}</span>
        </div>
      </div>

      <div className="relative grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-2">
        {phases.map((phase, i) => {
          const Icon = phase.icon;
          return (
            <div key={phase.number} className="relative bg-white border border-slate-200 rounded-xl p-3.5 flex flex-col min-h-[184px] shadow-sm">
              <div className="flex justify-between items-center">
                <span className="text-[11px] text-slate-400 font-mono font-semibold">{phase.number}</span>
                <Icon className="w-4 h-4 text-emerald-700" />
              </div>
              <h2 className="mt-2 font-bold text-sm text-slate-900">{phase.title}</h2>
              <p className="text-xs leading-relaxed text-slate-600 mt-1 flex-1">{phase.question}</p>
              <button onClick={phase.onClick} className="mt-3 inline-flex items-center justify-between gap-1 text-left rounded-md px-2.5 py-2 bg-slate-100 hover:bg-emerald-50 text-slate-800 hover:text-emerald-800 text-xs font-semibold">
                {phase.action}<ArrowRight className="w-3.5 h-3.5 shrink-0" />
              </button>
              {i < phases.length - 1 && <ArrowRight className="hidden lg:block absolute -right-2.5 top-[47%] w-4 h-4 z-10 text-slate-500 bg-slate-50 rounded-full" />}
            </div>
          );
        })}
      </div>

      <div className="bg-white rounded-2xl border border-slate-200 p-4 sm:p-5 shadow-sm">
        <div className="flex items-center gap-2">
          <BookOpen className="w-4 h-4 text-emerald-700" />
          <h2 className="font-bold text-sm">{t('Vier Blickwinkel für Deep Research', 'Четыре направления исследования')}</h2>
        </div>
        <p className="mt-1 text-xs text-slate-500">
          {t('Vier Recherchefelder, aber nicht automatisch vier kostenpflichtige Deep-Research-Läufe.',
            'Четыре области исследования — не обязательно четыре отдельных платных исследования.')}
        </p>
        <div className="mt-3 grid grid-cols-1 sm:grid-cols-2 gap-2.5">
          {research.map(item => {
            const Icon = item.icon;
            return (
              <button key={item.title} onClick={item.action} className="group flex items-start gap-3 rounded-xl bg-slate-50 border border-slate-100 hover:border-emerald-200 hover:bg-emerald-50/40 p-3.5 text-left">
                <span className="p-2 bg-white rounded-md border border-slate-100 text-emerald-800"><Icon className="w-4 h-4" /></span>
                <span className="flex-1">
                  <span className="block text-sm font-semibold text-slate-900">{item.title}</span>
                  <span className="block text-xs text-slate-500 mt-1">{item.why}</span>
                </span>
                <ArrowRight className="w-3.5 h-3.5 text-slate-400 group-hover:text-emerald-800" />
              </button>
            );
          })}
        </div>
      </div>

      <div className="text-[11px] text-slate-500 flex gap-1.5 items-start">
        <CheckCircle2 className="w-3.5 h-3.5 shrink-0 mt-0.5" />
        {t('ProRiv ist die Pilot-Referenz für den späteren wiederverwendbaren Kundenprojekt-Workshop. Offene Fragen und Architekturvorschläge sind noch keine Kundenfreigaben.',
          'ProRiv — пилотный пример для будущих проектов. Открытые вопросы и архитектурные предложения не являются согласованными решениями клиента.')}
      </div>
    </section>
  );
};
