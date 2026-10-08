import React, { useState } from 'react';
import {
  HelpCircle,
  ArrowLeft,
  CheckCircle2,
  Clock,
  AlertCircle,
  ArrowRight,
  Copy,
  Check,
  Lightbulb,
  ExternalLink,
  MessageSquareQuote
} from 'lucide-react';
import { SENIOR_DECISION_QUESTIONS } from '../db/knowledgeSeed';
import { TopicId, SeniorDecisionItem, Language, DatabaseState, SeniorQuestion } from '../types';
import { TOPIC_DEFINITIONS, TOPIC_ORDER } from '../db/defaultData';
import { getTranslation } from '../i18n/translations';
import { saveQuestion } from '../db/indexedDb';

interface SeniorDecisionsHubProps {
  language: Language;
  databaseState?: DatabaseState | null;
  onNavigateHome: () => void;
  onSelectTopic: (topicId: TopicId) => void;
  onRefreshData?: () => Promise<void>;
}

export const SeniorDecisionsHub: React.FC<SeniorDecisionsHubProps> = ({
  language,
  databaseState,
  onNavigateHome,
  onSelectTopic,
  onRefreshData
}) => {
  const [activeTab, setActiveTab] = useState<'client_questions' | 'core_decisions'>('client_questions');
  const [questionsList, setQuestionsList] = useState<SeniorDecisionItem[]>(SENIOR_DECISION_QUESTIONS);
  const [filterPriority, setFilterPriority] = useState<string>('all');
  const [topicFilter, setTopicFilter] = useState<string>('all');
  const [isCopied, setIsCopied] = useState(false);

  // Client questions aggregated from databaseState
  const allDbQuestions = databaseState?.questions || [];
  const clientQuestions = allDbQuestions.filter(
    q => q.needsClientClarification || Boolean(q.clientQuestion?.trim() || q.clientQuestionRu?.trim())
  );
  const unresolvedClientCount = clientQuestions.filter(q => !q.isResolved).length;

  const filteredClientQuestions = clientQuestions.filter(q => {
    if (topicFilter === 'all') return true;
    return q.topicId === topicFilter;
  });

  const handleToggleDecisionStatus = (id: string) => {
    setQuestionsList(prev => prev.map(q => {
      if (q.id === id) {
        const nextStatus = q.status === 'offen' ? 'in_diskussion' : q.status === 'in_diskussion' ? 'entschieden' : 'offen';
        return { ...q, status: nextStatus };
      }
      return q;
    }));
  };

  const handleToggleQuestionResolved = async (q: SeniorQuestion) => {
    await saveQuestion({
      ...q,
      isResolved: !q.isResolved,
      updatedAt: new Date().toISOString()
    });
    if (onRefreshData) {
      await onRefreshData();
    }
  };

  const handleCopyAgenda = () => {
    let text = language === 'ru'
      ? `=== ВОПРОСЫ КЛИЕНТУ (ISA) ДЛЯ СЕНЬОРА ===\nДата: ${new Date().toLocaleDateString('ru-RU')}\n\n`
      : `=== FRAGEN AN KLIENTEN (ISA) – SENIOR BRIEFING ===\nDatum: ${new Date().toLocaleDateString('de-DE')}\n\n`;

    clientQuestions.forEach((q, idx) => {
      const topicMeta = TOPIC_DEFINITIONS[q.topicId];
      const topicName = topicMeta ? `${topicMeta.sketchTitle} (${topicMeta.germanTitle})` : q.topicId;
      const qText = language === 'ru' ? (q.questionRu || q.question) : q.question;
      const proposalText = (language === 'ru' ? (q.answerRu || q.answer) : q.answer) || (language === 'ru' ? '(предложение не сформировано — требуется инфо от клиента)' : '(noch kein Vorschlag – Info von Isa zwingend nötig)');
      const clientQ = (language === 'ru' ? (q.clientQuestionRu || q.clientQuestion) : q.clientQuestion) || (language === 'ru' ? '(вопрос уточняется)' : '(Klärung erforderlich)');

      text += `${idx + 1}. [${topicName}]\n`;
      text += `   Frage / Вопрос: ${qText}\n`;
      text += `   1. Unser Vorschlag: ${proposalText}\n`;
      text += `   2. FRAGE AN KLIENTEN (ISA): ${clientQ}\n`;
      text += `   Status: ${q.isResolved ? 'GEKLÄRT' : 'OFFEN'}\n\n`;
    });

    navigator.clipboard.writeText(text);
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2500);
  };

  const filteredDecisions = filterPriority === 'all'
    ? questionsList
    : questionsList.filter(q => q.priority === filterPriority);

  const getStatusLabel = (status: string) => {
    if (language === 'ru') {
      if (status === 'entschieden') return 'РЕШЕНО';
      if (status === 'in_diskussion') return 'В ОБСУЖДЕНИИ';
      return 'ОТКРЫТО';
    }
    if (language === 'bilingual') {
      if (status === 'entschieden') return 'РЕШЕНО / ENTSCHIEDEN';
      if (status === 'in_diskussion') return 'В ДИСКУССИИ / DISKUSSION';
      return 'ОТКРЫТО / OFFEN';
    }
    return status.toUpperCase();
  };

  return (
    <div className="w-full min-h-[calc(100vh-3.5rem)] bg-slate-50/70 p-4 sm:p-6 lg:p-8 space-y-6 max-w-6xl mx-auto">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-200/80 pb-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs font-mono uppercase tracking-wider text-slate-400">
              {language === 'ru' ? 'Сеньор & Клиент' : 'Senior & Klient'}
            </span>
            <span className="text-slate-300">/</span>
            <span className="text-xs font-mono text-amber-800 bg-amber-50 border border-amber-200 px-2 py-0.5 rounded font-semibold">
              {language === 'ru' ? `${clientQuestions.length} вопросов клиенту (Isa)` : `${clientQuestions.length} Fragen an Klienten (Isa)`}
            </span>
          </div>
          <h1 className="text-xl font-bold tracking-tight text-slate-900">
            {language === 'ru'
              ? 'Вопросы на согласование с Сеньором и Клиентом (Isa)'
              : 'Senior Decisions & Klienten-Fragen (Isa)'}
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            {language === 'ru'
              ? 'Здесь зафиксированы все пункты, где мы не знаем точного решения и сеньор должен запросить клиента (Ису).'
              : 'Hier sind alle Punkte fixiert, bei denen wir noch keinen Vorschlag machen können und der Senior morgen den Kunden (Isa) fragen muss.'}
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleCopyAgenda}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-amber-950 bg-amber-100/80 hover:bg-amber-200 border border-amber-300 rounded-md transition-colors shadow-xs"
            title={language === 'ru' ? 'Скопировать все вопросы клиенту в буфер обмена для встречи' : 'Alle Klientenfragen als formatierte Agenda kopieren'}
          >
            {isCopied ? <Check className="w-3.5 h-3.5 text-emerald-700" /> : <Copy className="w-3.5 h-3.5 text-amber-800" />}
            <span>
              {isCopied
                ? (language === 'ru' ? 'Скопировано!' : 'Agenda kopiert!')
                : (language === 'ru' ? 'Скопировать повестку для Сеньора' : 'Agenda für Senior kopieren')}
            </span>
          </button>

          <button
            onClick={onNavigateHome}
            className="px-3.5 py-1.5 text-xs font-semibold text-slate-700 hover:text-emerald-800 bg-white border border-slate-200 rounded-md hover:bg-slate-50 transition-colors shadow-xs"
          >
            {getTranslation('backToSketch', language)}
          </button>
        </div>
      </div>

      {/* Primary Switcher Tabs */}
      <div className="flex flex-wrap items-center gap-2 border-b border-slate-200 pb-2">
        <button
          onClick={() => setActiveTab('client_questions')}
          className={`px-4 py-2 text-xs font-bold rounded-lg transition-all flex items-center gap-2 ${
            activeTab === 'client_questions'
              ? 'bg-amber-500 text-white shadow-sm'
              : 'bg-white text-slate-700 border border-slate-200 hover:bg-slate-50'
          }`}
        >
          <AlertCircle className="w-4 h-4" />
          <span>
            {language === 'ru'
              ? `⚡ Вопросы клиенту (Isa) для сеньора (${clientQuestions.length})`
              : `⚡ Fragen an Klienten (Isa) für den Senior (${clientQuestions.length})`}
          </span>
          {unresolvedClientCount > 0 && (
            <span className={`px-1.5 py-0.2 rounded-full text-[10px] font-mono ${
              activeTab === 'client_questions' ? 'bg-amber-700 text-amber-100' : 'bg-amber-100 text-amber-900'
            }`}>
              {unresolvedClientCount} {language === 'ru' ? 'открыто' : 'offen'}
            </span>
          )}
        </button>

        <button
          onClick={() => setActiveTab('core_decisions')}
          className={`px-4 py-2 text-xs font-bold rounded-lg transition-all flex items-center gap-2 ${
            activeTab === 'core_decisions'
              ? 'bg-slate-900 text-white shadow-sm'
              : 'bg-white text-slate-700 border border-slate-200 hover:bg-slate-50'
          }`}
        >
          <HelpCircle className="w-4 h-4" />
          <span>
            {language === 'ru' ? '10 Ключевых решений архитектуры' : '10 Offene Kernentscheidungen'}
          </span>
        </button>
      </div>

      {/* TAB 1: FRAGEN AN KLIENTEN (ISA) */}
      {activeTab === 'client_questions' && (
        <div className="space-y-4">
          {/* Info Banner */}
          <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 text-xs text-amber-950 flex flex-wrap items-center justify-between gap-3 shadow-xs">
            <div className="flex items-start gap-2.5">
              <AlertCircle className="w-5 h-5 text-amber-700 shrink-0 mt-0.5" />
              <div>
                <strong className="block text-amber-950 font-bold mb-0.5">
                  {language === 'ru'
                    ? 'Список вопросов, которые Сеньор должен задать клиенту (Исе) завтра:'
                    : 'Übersicht der Klientenfragen für das morgige Senior-Meeting:'}
                </strong>
                <p className="text-amber-900 leading-relaxed">
                  {language === 'ru'
                    ? 'Если команда не знает точных параметров реализации (тарифы, обязательные поля, форс-мажоры), мы зафиксировали их здесь. Нажмите на название темы, чтобы перейти сразу в нужный круг.'
                    : 'Für alle Punkte, die noch nicht final entschieden sind, ist hier die konkrete Frage an den Kunden Isa formuliert. Klicken Sie auf den Kreis, um direkt in die Detailansicht zu springen.'}
                </p>
              </div>
            </div>

            <button
              onClick={handleCopyAgenda}
              className="shrink-0 px-3 py-1.5 text-xs font-bold text-amber-900 bg-amber-200/80 hover:bg-amber-300 rounded-lg flex items-center gap-1.5 transition-colors"
            >
              {isCopied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{isCopied ? 'Kopiert!' : 'Agenda kopieren'}</span>
            </button>
          </div>

          {/* Topic Filter Pills */}
          <div className="flex flex-wrap items-center gap-1.5">
            <span className="text-xs text-slate-500 font-medium mr-1">
              {language === 'ru' ? 'Круг / Раздел:' : 'Bereich:'}
            </span>
            <button
              onClick={() => setTopicFilter('all')}
              className={`px-2.5 py-1 text-xs rounded-md font-medium transition-colors ${
                topicFilter === 'all'
                  ? 'bg-slate-900 text-white'
                  : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'
              }`}
            >
              {language === 'ru' ? `Все (${clientQuestions.length})` : `Alle (${clientQuestions.length})`}
            </button>
            {TOPIC_ORDER.map(tId => {
              const meta = TOPIC_DEFINITIONS[tId];
              const count = clientQuestions.filter(q => q.topicId === tId).length;
              if (count === 0) return null;
              return (
                <button
                  key={tId}
                  onClick={() => setTopicFilter(tId)}
                  className={`px-2.5 py-1 text-xs rounded-md font-medium transition-colors ${
                    topicFilter === tId
                      ? 'bg-slate-900 text-white font-semibold'
                      : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'
                  }`}
                >
                  {meta?.sketchTitle} ({count})
                </button>
              );
            })}
          </div>

          {/* Client Questions List */}
          <div className="space-y-3.5">
            {filteredClientQuestions.map((q, idx) => {
              const topicMeta = TOPIC_DEFINITIONS[q.topicId];
              return (
                <div
                  key={q.id}
                  className={`bg-white rounded-xl border p-5 shadow-xs space-y-3 transition-all ${
                    q.isResolved
                      ? 'border-emerald-200 bg-emerald-50/15'
                      : 'border-amber-200 hover:border-amber-300'
                  }`}
                >
                  <div className="flex flex-wrap items-start justify-between gap-3">
                    <div className="flex items-start gap-3">
                      <span className="w-6 h-6 rounded-full bg-amber-500 text-white text-xs font-bold font-mono flex items-center justify-center shrink-0 mt-0.5">
                        {idx + 1}
                      </span>

                      <div>
                        <div className="flex flex-wrap items-center gap-2 mb-1">
                          <button
                            onClick={() => onSelectTopic(q.topicId)}
                            className="px-2 py-0.5 rounded text-[11px] font-bold bg-slate-100 hover:bg-slate-200 text-slate-800 transition-colors flex items-center gap-1"
                          >
                            <span>{topicMeta?.sketchTitle}</span>
                            <span className="text-slate-400">·</span>
                            <span className="font-normal text-slate-600">
                              {language === 'ru' ? topicMeta?.russianTitle : topicMeta?.germanTitle}
                            </span>
                            <ExternalLink className="w-3 h-3 text-slate-400 ml-0.5" />
                          </button>

                          <span className="text-[10px] font-semibold bg-amber-100 text-amber-900 border border-amber-300 px-1.5 py-0.2 rounded uppercase font-mono">
                            {language === 'ru' ? 'Запрос клиенту' : 'Klienten-Rückfrage'}
                          </span>

                          {q.isResolved && (
                            <span className="text-[10px] font-semibold bg-emerald-100 text-emerald-800 px-1.5 py-0.2 rounded">
                              {language === 'ru' ? 'РЕШЕНО' : 'GEKLÄRT'}
                            </span>
                          )}
                        </div>

                        <h3 className="text-sm font-bold text-slate-900 leading-snug">
                          {language === 'ru'
                            ? (q.questionRu || q.question)
                            : language === 'bilingual'
                              ? (q.questionRu ? `${q.questionRu}` : q.question)
                              : q.question}
                        </h3>

                        {language === 'bilingual' && q.questionRu && q.question !== q.questionRu && (
                          <div className="text-xs text-slate-400 mt-0.5 italic">
                            DE: {q.question}
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="flex items-center gap-2 shrink-0">
                      <button
                        onClick={() => handleToggleQuestionResolved(q)}
                        className={`px-2.5 py-1 text-xs font-semibold rounded transition-colors flex items-center gap-1.5 ${
                          q.isResolved
                            ? 'bg-emerald-100 text-emerald-800'
                            : 'bg-amber-100 hover:bg-amber-200 text-amber-900'
                        }`}
                        title={language === 'ru' ? 'Отметить статус' : 'Status umschalten'}
                      >
                        <CheckCircle2 className={`w-3.5 h-3.5 ${q.isResolved ? 'fill-emerald-600 text-white' : ''}`} />
                        <span>{q.isResolved ? (language === 'ru' ? 'РЕШЕНО' : 'GEKLÄRT') : (language === 'ru' ? 'ОТКРЫТО' : 'OFFEN')}</span>
                      </button>
                    </div>
                  </div>

                  {/* 2 Dedicated Fields: Feld 1 & Feld 2 */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs pt-2 border-t border-slate-100">
                    {/* FELD 1: UNSER VORSCHLAG */}
                    <div className="p-3 bg-emerald-50/50 rounded-lg border border-emerald-100 space-y-1">
                      <span className="font-semibold text-emerald-950 flex items-center gap-1.5">
                        <Lightbulb className="w-3.5 h-3.5 text-emerald-700" />
                        <span>{language === 'ru' ? '1. Наше предложение (Техника / Процесс):' : '1. Unser Vorschlag (Technik & Empfehlung):'}</span>
                      </span>
                      {(q.answer || q.answerRu) ? (
                        <>
                          <p className="text-emerald-900 leading-relaxed font-normal whitespace-pre-wrap">
                            {language === 'ru' ? (q.answerRu || q.answer) : q.answer}
                          </p>
                          {language === 'bilingual' && q.answerRu && q.answer && q.answer !== q.answerRu && (
                            <p className="text-[11px] text-emerald-700/80 italic pt-1 border-t border-emerald-200/50">
                              DE: {q.answer}
                            </p>
                          )}
                        </>
                      ) : (
                        <p className="text-slate-500 italic text-[11px]">
                          {language === 'ru'
                            ? 'Пока нет предложения — мы не знаем точных требований и должны спросить клиента.'
                            : 'Noch kein Vorschlag formuliert – wir müssen zwingend den Klienten fragen.'}
                        </p>
                      )}
                    </div>

                    {/* FELD 2: FRAGE AN KLIENTEN (ISA) */}
                    <div className="p-3 bg-amber-50/80 rounded-lg border border-amber-300 space-y-1">
                      <span className="font-bold text-amber-950 flex items-center gap-1.5">
                        <AlertCircle className="w-3.5 h-3.5 text-amber-700" />
                        <span>{language === 'ru' ? '2. Вопрос клиенту (Isa) — задать завтра:' : '2. Frage an Klienten (Isa) – Morgen fragen:'}</span>
                      </span>
                      {(q.clientQuestion || q.clientQuestionRu) ? (
                        <>
                          <p className="text-amber-950 font-medium leading-relaxed whitespace-pre-wrap">
                            {language === 'ru' ? (q.clientQuestionRu || q.clientQuestion) : q.clientQuestion}
                          </p>
                          {language === 'bilingual' && q.clientQuestionRu && q.clientQuestion && q.clientQuestion !== q.clientQuestionRu && (
                            <p className="text-[11px] text-amber-800/80 italic pt-1 border-t border-amber-200">
                              DE: {q.clientQuestion}
                            </p>
                          )}
                        </>
                      ) : (
                        <p className="text-amber-900 font-semibold italic text-[11px]">
                          {language === 'ru'
                            ? 'Зафиксировано: требуется запрос клиенту! Точный текст вопроса еще не внесен.'
                            : 'Klärungsbedarf mit Klient (Isa) ist fixiert! Konkrete Frage muss noch formuliert werden.'}
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Jump button */}
                  <div className="flex justify-end pt-1">
                    <button
                      onClick={() => onSelectTopic(q.topicId)}
                      className="text-[11px] text-slate-500 hover:text-emerald-800 inline-flex items-center gap-1 font-medium transition-colors"
                    >
                      <span>{language === 'ru' ? 'Открыть и редактировать в теме' : 'In Themenansicht bearbeiten'}</span>
                      <ArrowRight className="w-3 h-3" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* TAB 2: 10 KERN-ENTSCHEIDUNGEN */}
      {activeTab === 'core_decisions' && (
        <div className="space-y-4">
          {/* Filter Tabs */}
          <div className="flex items-center gap-2">
            <span className="text-xs text-slate-500 font-medium mr-1">
              {language === 'ru' ? 'Приоритет:' : 'Priorität:'}
            </span>
            {['all', 'high', 'medium', 'low'].map(p => (
              <button
                key={p}
                onClick={() => setFilterPriority(p)}
                className={`px-3 py-1 text-xs rounded-md font-medium transition-colors ${
                  filterPriority === p
                    ? 'bg-slate-900 text-white'
                    : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'
                }`}
              >
                {p === 'all'
                  ? getTranslation('prioAll', language)
                  : (language === 'ru'
                      ? (p === 'high' ? 'ВЫСОКИЙ' : p === 'medium' ? 'СРЕДНИЙ' : 'НИЗКИЙ')
                      : p.toUpperCase())}
              </button>
            ))}
          </div>

          {/* 10 Decision Cards */}
          <div className="space-y-4">
            {filteredDecisions.map(item => (
              <div
                key={item.id}
                className="bg-white rounded-xl border border-slate-200/90 p-5 shadow-xs space-y-3 transition-all hover:border-slate-300"
              >
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div className="flex items-start gap-3">
                    <span className="w-6 h-6 rounded-full bg-slate-900 text-white text-xs font-bold font-mono flex items-center justify-center shrink-0 mt-0.5">
                      0{item.number}
                    </span>

                    <div>
                      <h3 className="text-sm font-bold text-slate-900 leading-snug">
                        {language === 'ru'
                          ? (item.questionRu || item.question)
                          : language === 'bilingual'
                            ? (item.questionRu ? `${item.questionRu}` : item.question)
                            : item.question}
                      </h3>
                      {language === 'bilingual' && item.questionRu && item.question !== item.questionRu && (
                        <div className="text-xs text-slate-400 mt-0.5 italic">
                          DE: {item.question}
                        </div>
                      )}

                      <div className="flex flex-wrap items-center gap-2 text-[11px] text-slate-500 mt-1">
                        <span>
                          {getTranslation('responsible', language)}: <strong>{item.responsiblePerson}</strong>
                        </span>
                        <span>·</span>
                        <span className="font-mono">
                          {language === 'ru' ? 'Приоритет:' : 'Prio:'} {item.priority.toUpperCase()}
                        </span>
                        <span>·</span>
                        <span className="font-mono">{item.date}</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleToggleDecisionStatus(item.id)}
                      className={`px-2.5 py-1 text-xs font-medium rounded transition-colors ${
                        item.status === 'entschieden'
                          ? 'bg-emerald-100 text-emerald-800 font-semibold'
                          : item.status === 'in_diskussion'
                          ? 'bg-amber-100 text-amber-900 font-semibold'
                          : 'bg-rose-100 text-rose-800'
                      }`}
                      title={language === 'ru' ? 'Нажмите для изменения статуса' : 'Klicken zum Weiterschalten des Status'}
                    >
                      {getStatusLabel(item.status)}
                    </button>
                  </div>
                </div>

                {/* Proposal & Rationale */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs pt-2 border-t border-slate-100">
                  <div className="p-3 bg-emerald-50/50 rounded-lg border border-emerald-100 space-y-1">
                    <span className="font-semibold text-emerald-950 block">
                      {getTranslation('currentProposal', language)}
                    </span>
                    <p className="text-emerald-900 leading-relaxed">
                      {language === 'ru' ? (item.currentProposalRu || item.currentProposal) : item.currentProposal}
                    </p>
                    {language === 'bilingual' && item.currentProposalRu && item.currentProposal !== item.currentProposalRu && (
                      <p className="text-[11px] text-emerald-700/80 italic pt-1 border-t border-emerald-200/50">
                        DE: {item.currentProposal}
                      </p>
                    )}
                  </div>

                  <div className="p-3 bg-slate-50 rounded-lg border border-slate-100 space-y-1">
                    <span className="font-semibold text-slate-800 block">
                      {getTranslation('rationale', language)}
                    </span>
                    <p className="text-slate-600 leading-relaxed">
                      {language === 'ru' ? (item.rationaleRu || item.rationale) : item.rationale}
                    </p>
                    {language === 'bilingual' && item.rationaleRu && item.rationale !== item.rationaleRu && (
                      <p className="text-[11px] text-slate-400 italic pt-1 border-t border-slate-200">
                        DE: {item.rationale}
                      </p>
                    )}
                  </div>
                </div>

                {/* Linked Topics */}
                <div className="flex items-center justify-between text-xs pt-1">
                  <div className="flex items-center gap-1.5 text-[11px]">
                    <span className="text-slate-400">{getTranslation('linkedToCircle', language)}</span>
                    {item.connectedTopics.map(tId => (
                      <button
                        key={tId}
                        onClick={() => onSelectTopic(tId)}
                        className="px-2 py-0.5 rounded bg-slate-100 hover:bg-slate-200 text-slate-700 font-medium transition-colors"
                      >
                        {TOPIC_DEFINITIONS[tId]?.sketchTitle}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
