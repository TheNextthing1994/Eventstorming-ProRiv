import React, { useState } from 'react';
import {
  ArrowLeft,
  CheckCircle2,
  HelpCircle,
  Lightbulb,
  Building2,
  FileCheck2,
  AlertCircle,
  Paperclip,
  Plus,
  Pencil,
  Trash2,
  Save,
  X,
  ExternalLink,
  ChevronRight,
  Share2
} from 'lucide-react';
import {
  TopicId,
  DatabaseState,
  SeniorQuestion,
  ResearchFinding,
  CompetitorEntry,
  ProductRecommendation,
  OpenPoint,
  Decision,
  KnowledgeStatus,
  AttachmentItem,
  Language
} from '../types';
import { TOPIC_DEFINITIONS, TOPIC_ORDER } from '../db/defaultData';
import { StatusBadge, STATUS_CONFIG } from './StatusBadge';
import { AttachmentViewer } from './AttachmentViewer';
import { getTranslation, getDualText, UI_TEXT } from '../i18n/translations';
import {
  RoleMatrixVisualizer,
  EntityHierarchyVisualizer,
  WorkReportPreviewVisualizer,
  TimeTripleDivisionVisualizer,
  ApiArchitectureVisualizer,
  MobileTechStackVisualizer
} from './DomainVisualizers';
import {
  saveTopicSummary,
  saveQuestion,
  deleteQuestion,
  saveFinding,
  deleteFinding,
  saveCompetitor,
  deleteCompetitor,
  saveRecommendation,
  deleteRecommendation,
  saveOpenPoint,
  deleteOpenPoint,
  saveDecision,
  deleteDecision,
  saveAttachment,
  deleteAttachment
} from '../db/indexedDb';

interface TopicDetailViewProps {
  topicId: TopicId;
  databaseState: DatabaseState;
  language?: Language;
  onNavigateHome: () => void;
  onSelectTopic: (topicId: TopicId) => void;
  onRefreshData: () => Promise<void>;
}

type ActiveSection = 'all' | 'summary' | 'questions' | 'findings' | 'competitors' | 'recommendations' | 'open_points' | 'decisions' | 'attachments';

export const TopicDetailView: React.FC<TopicDetailViewProps> = ({
  topicId,
  databaseState,
  language = 'ru',
  onNavigateHome,
  onSelectTopic,
  onRefreshData
}) => {
  const meta = TOPIC_DEFINITIONS[topicId];
  const [activeSection, setActiveSection] = useState<ActiveSection>('all');

  // Summary state
  const currentSummary = databaseState.topics[topicId]?.summary || '';
  const [isEditingSummary, setIsEditingSummary] = useState(false);
  const [summaryInput, setSummaryInput] = useState(currentSummary);

  // Modal / form states for creating/editing entries
  const [editingQuestion, setEditingQuestion] = useState<SeniorQuestion | null>(null);
  const [isNewQuestionModal, setIsNewQuestionModal] = useState(false);

  const [editingFinding, setEditingFinding] = useState<ResearchFinding | null>(null);
  const [isNewFindingModal, setIsNewFindingModal] = useState(false);

  const [editingCompetitor, setEditingCompetitor] = useState<CompetitorEntry | null>(null);
  const [isNewCompetitorModal, setIsNewCompetitorModal] = useState(false);

  const [editingRecommendation, setEditingRecommendation] = useState<ProductRecommendation | null>(null);
  const [isNewRecommendationModal, setIsNewRecommendationModal] = useState(false);

  const [editingOpenPoint, setEditingOpenPoint] = useState<OpenPoint | null>(null);
  const [isNewOpenPointModal, setIsNewOpenPointModal] = useState(false);

  const [editingDecision, setEditingDecision] = useState<Decision | null>(null);
  const [isNewDecisionModal, setIsNewDecisionModal] = useState(false);

  // Filter items that belong to this topic (or cross-linked)
  const isItemForTopic = (item: { topicId: TopicId; additionalTopicIds?: TopicId[] }) =>
    item.topicId === topicId || item.additionalTopicIds?.includes(topicId);

  const [questionFilter, setQuestionFilter] = useState<'all' | 'client_only' | 'resolved'>('all');

  const topicQuestions = databaseState.questions.filter(q => q.topicId === topicId);
  const clientQuestionsInTopic = topicQuestions.filter(q => q.needsClientClarification || !!q.clientQuestion);
  const filteredTopicQuestions = questionFilter === 'client_only'
    ? clientQuestionsInTopic
    : questionFilter === 'resolved'
      ? topicQuestions.filter(q => q.isResolved)
      : topicQuestions;

  const topicFindings = databaseState.findings.filter(isItemForTopic);
  const topicCompetitors = databaseState.competitors.filter(isItemForTopic);
  const topicRecs = databaseState.recommendations.filter(isItemForTopic);
  const topicOpenPoints = databaseState.openPoints.filter(isItemForTopic);
  const topicDecisions = databaseState.decisions.filter(isItemForTopic);

  // Summary save
  const handleSaveSummary = async () => {
    await saveTopicSummary(topicId, summaryInput);
    setIsEditingSummary(false);
    await onRefreshData();
  };

  // Question handlers
  const handleSaveQuestion = async (q: SeniorQuestion) => {
    await saveQuestion(q);
    setEditingQuestion(null);
    setIsNewQuestionModal(false);
    await onRefreshData();
  };

  const handleToggleQuestionResolved = async (q: SeniorQuestion) => {
    await saveQuestion({
      ...q,
      isResolved: !q.isResolved,
      updatedAt: new Date().toISOString()
    });
    await onRefreshData();
  };

  const handleDeleteQuestion = async (id: string) => {
    if (confirm('Diese Frage wirklich löschen?')) {
      await deleteQuestion(id);
      await onRefreshData();
    }
  };

  // Finding handlers
  const handleSaveFinding = async (finding: ResearchFinding) => {
    await saveFinding(finding);
    setEditingFinding(null);
    setIsNewFindingModal(false);
    await onRefreshData();
  };

  const handleDeleteFinding = async (id: string) => {
    if (confirm('Diese Erkenntnis wirklich löschen?')) {
      await deleteFinding(id);
      await onRefreshData();
    }
  };

  // Competitor handlers
  const handleSaveCompetitor = async (comp: CompetitorEntry) => {
    await saveCompetitor(comp);
    setEditingCompetitor(null);
    setIsNewCompetitorModal(false);
    await onRefreshData();
  };

  const handleDeleteCompetitor = async (id: string) => {
    if (confirm('Diesen Wettbewerbs-Eintrag wirklich löschen?')) {
      await deleteCompetitor(id);
      await onRefreshData();
    }
  };

  // Recommendation handlers
  const handleSaveRecommendation = async (rec: ProductRecommendation) => {
    await saveRecommendation(rec);
    setEditingRecommendation(null);
    setIsNewRecommendationModal(false);
    await onRefreshData();
  };

  const handleDeleteRecommendation = async (id: string) => {
    if (confirm('Diese Empfehlung wirklich löschen?')) {
      await deleteRecommendation(id);
      await onRefreshData();
    }
  };

  // Open Point handlers
  const handleSaveOpenPoint = async (point: OpenPoint) => {
    await saveOpenPoint(point);
    setEditingOpenPoint(null);
    setIsNewOpenPointModal(false);
    await onRefreshData();
  };

  const handleDeleteOpenPoint = async (id: string) => {
    if (confirm('Diesen offenen Klärungspunkt wirklich löschen?')) {
      await deleteOpenPoint(id);
      await onRefreshData();
    }
  };

  // Decision handlers
  const handleSaveDecision = async (dec: Decision) => {
    await saveDecision(dec);
    setEditingDecision(null);
    setIsNewDecisionModal(false);
    await onRefreshData();
  };

  const handleDeleteDecision = async (id: string) => {
    if (confirm('Diese Entscheidung wirklich löschen?')) {
      await deleteDecision(id);
      await onRefreshData();
    }
  };

  // Attachments
  const handleAddAttachment = async (item: Omit<AttachmentItem, 'id' | 'createdAt'>) => {
    const newItem: AttachmentItem = {
      ...item,
      id: `att-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
      createdAt: new Date().toISOString()
    };
    await saveAttachment(newItem);
    await onRefreshData();
  };

  const handleDeleteAttachment = async (id: string) => {
    if (confirm('Diesen Anhang wirklich löschen?')) {
      await deleteAttachment(id);
      await onRefreshData();
    }
  };

  return (
    <div className="w-full min-h-[calc(100vh-3.5rem)] bg-slate-50/60 pb-16">
      {/* Top Breadcrumb & Navigation Bar */}
      <div className="bg-white border-b border-slate-200/80 sticky top-14 z-20">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-3 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <button
              onClick={onNavigateHome}
              className="flex items-center gap-1.5 text-xs font-semibold text-slate-700 hover:text-emerald-800 transition-colors bg-slate-100 hover:bg-slate-200 px-2.5 py-1.5 rounded-md"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>{getTranslation('backToSketch', language)}</span>
            </button>
            <span className="text-slate-300">/</span>
            <div className="flex items-center gap-1.5 text-xs">
              <span className="font-bold text-slate-900 tracking-tight">{meta.sketchTitle}</span>
              <span className="text-slate-500 hidden sm:inline">
                ({language === 'ru' ? meta.russianTitle : language === 'bilingual' ? `${meta.russianTitle} / ${meta.germanTitle}` : meta.germanTitle})
              </span>
            </div>
          </div>

          {/* Quick topic switcher buttons */}
          <div className="flex items-center gap-1 overflow-x-auto max-w-full py-0.5">
            {TOPIC_ORDER.map(tId => {
              const tMeta = TOPIC_DEFINITIONS[tId];
              const isCurrent = tId === topicId;
              const isGreen = tMeta.colorType === 'green';

              return (
                <button
                  key={tId}
                  onClick={() => {
                    onSelectTopic(tId);
                    setSummaryInput(databaseState.topics[tId]?.summary || '');
                    setIsEditingSummary(false);
                  }}
                  className={`px-2.5 py-1 text-xs rounded transition-colors whitespace-nowrap flex items-center gap-1.5 ${
                    isCurrent
                      ? 'bg-slate-900 text-white font-medium'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                  }`}
                  title={`${tMeta.sketchTitle} – ${language === 'ru' ? tMeta.russianTitle : tMeta.germanTitle}`}
                >
                  <span className={`w-1.5 h-1.5 rounded-full ${isGreen ? 'bg-emerald-400' : 'bg-rose-400'}`} />
                  <span>{tMeta.sketchTitle}</span>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-6 space-y-6">
        {/* Header Hero Area */}
        <div className="bg-white rounded-xl border border-slate-200/90 p-6 shadow-xs">
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div>
              <div className="flex items-center gap-2 mb-1.5">
                <span
                  className={`w-3 h-3 rounded-full ${
                    meta.colorType === 'green' ? 'bg-emerald-500' : 'bg-rose-500'
                  }`}
                />
                <span className="text-xs font-mono uppercase tracking-wider text-slate-400">
                  {meta.colorType === 'green'
                    ? (language === 'ru' ? 'Центральное архитектурное ядро (Зеленый)' : 'Zentraler Architekturbereich (Grün)')
                    : (language === 'ru' ? 'Функциональный домен эскиза (Красный)' : 'Fachbereich der Skizze (Rot)')}
                </span>
              </div>
              <h1 className="text-2xl font-bold tracking-tight text-slate-900">
                {meta.sketchTitle}
              </h1>
              <h2 className="text-sm font-medium text-slate-600 mt-0.5">
                {language === 'ru'
                  ? meta.russianTitle
                  : language === 'bilingual'
                    ? `${meta.russianTitle} (${meta.germanTitle})`
                    : meta.germanTitle}
              </h2>
              {meta.sketchSubtitle && (
                <div className="text-xs font-mono text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded mt-2 inline-block">
                  {meta.sketchSubtitle}
                </div>
              )}
            </div>

            {/* Quick Metrics */}
            <div className="flex items-center gap-4 text-xs text-slate-500 font-mono bg-slate-50 px-4 py-2.5 rounded-lg border border-slate-200/80">
              <div>
                <div className="text-slate-400 text-[10px]">
                  {language === 'ru' ? 'ВОПРОСЫ' : 'FRAGEN'}
                </div>
                <div className="font-semibold text-slate-800">
                  {topicQuestions.filter(q => q.isResolved).length}/{topicQuestions.length} {language === 'ru' ? 'решено' : 'gelöst'}
                </div>
              </div>
              <div className="border-r border-slate-200 h-6" />
              <div>
                <div className="text-slate-400 text-[10px]">
                  {language === 'ru' ? 'ДАННЫЕ' : 'ERKENNTNISSE'}
                </div>
                <div className="font-semibold text-slate-800">{topicFindings.length}</div>
              </div>
              <div className="border-r border-slate-200 h-6" />
              <div>
                <div className="text-slate-400 text-[10px]">
                  {language === 'ru' ? 'КОНКУРЕНТЫ' : 'WETTBEWERB'}
                </div>
                <div className="font-semibold text-slate-800">{topicCompetitors.length}</div>
              </div>
              <div className="border-r border-slate-200 h-6" />
              <div>
                <div className="text-slate-400 text-[10px]">
                  {language === 'ru' ? 'РЕШЕНИЯ' : 'ENTSCHEIDUNGEN'}
                </div>
                <div className="font-semibold text-slate-800">{topicDecisions.length}</div>
              </div>
            </div>
          </div>

          {/* Section Navigation Tabs */}
          <div className="flex items-center gap-1 overflow-x-auto border-t border-slate-100 mt-6 pt-4 text-xs">
            <button
              onClick={() => setActiveSection('all')}
              className={`px-3 py-1.5 rounded-md font-medium transition-colors whitespace-nowrap ${
                activeSection === 'all'
                  ? 'bg-slate-900 text-white'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              {getTranslation('allSections', language)}
            </button>
            <button
              onClick={() => setActiveSection('summary')}
              className={`px-3 py-1.5 rounded-md font-medium transition-colors whitespace-nowrap ${
                activeSection === 'summary'
                  ? 'bg-slate-900 text-white'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              {getTranslation('secA', language)}
            </button>
            <button
              onClick={() => setActiveSection('questions')}
              className={`px-3 py-1.5 rounded-md font-medium transition-colors whitespace-nowrap ${
                activeSection === 'questions'
                  ? 'bg-slate-900 text-white'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              {getTranslation('secB', language)} ({topicQuestions.length})
            </button>
            <button
              onClick={() => setActiveSection('findings')}
              className={`px-3 py-1.5 rounded-md font-medium transition-colors whitespace-nowrap ${
                activeSection === 'findings'
                  ? 'bg-slate-900 text-white'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              {getTranslation('secC', language)} ({topicFindings.length})
            </button>
            <button
              onClick={() => setActiveSection('competitors')}
              className={`px-3 py-1.5 rounded-md font-medium transition-colors whitespace-nowrap ${
                activeSection === 'competitors'
                  ? 'bg-slate-900 text-white'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              {getTranslation('secD', language)} ({topicCompetitors.length})
            </button>
            <button
              onClick={() => setActiveSection('recommendations')}
              className={`px-3 py-1.5 rounded-md font-medium transition-colors whitespace-nowrap ${
                activeSection === 'recommendations'
                  ? 'bg-slate-900 text-white'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              {getTranslation('secE', language)} ({topicRecs.length})
            </button>
            <button
              onClick={() => setActiveSection('open_points')}
              className={`px-3 py-1.5 rounded-md font-medium transition-colors whitespace-nowrap ${
                activeSection === 'open_points'
                  ? 'bg-slate-900 text-white'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              {getTranslation('secF', language)} ({topicOpenPoints.length})
            </button>
            <button
              onClick={() => setActiveSection('decisions')}
              className={`px-3 py-1.5 rounded-md font-medium transition-colors whitespace-nowrap ${
                activeSection === 'decisions'
                  ? 'bg-slate-900 text-white'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              {getTranslation('secG', language)} ({topicDecisions.length})
            </button>
            <button
              onClick={() => setActiveSection('attachments')}
              className={`px-3 py-1.5 rounded-md font-medium transition-colors whitespace-nowrap ${
                activeSection === 'attachments'
                  ? 'bg-slate-900 text-white'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              {getTranslation('secH', language)}
            </button>
          </div>
        </div>

        {/* DOMAIN SPECIFIC VISUALIZER */}
        {topicId === 'users' && <RoleMatrixVisualizer language={language} />}
        {topicId === 'clients' && <EntityHierarchyVisualizer language={language} />}
        {topicId === 'raport' && <WorkReportPreviewVisualizer language={language} />}
        {topicId === 'vremya' && <TimeTripleDivisionVisualizer language={language} />}
        {topicId === 'api' && <ApiArchitectureVisualizer language={language} />}
        {topicId === 'mobile-app' && <MobileTechStackVisualizer language={language} />}

        {/* SECTION A: ÜBERSICHT */}
        {(activeSection === 'all' || activeSection === 'summary') && (
          <section className="bg-white rounded-xl border border-slate-200/90 p-6 shadow-xs space-y-3">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div>
                <h3 className="text-sm font-bold text-slate-900 tracking-tight">
                  A. Übersicht & Zielsetzung
                </h3>
                <p className="text-xs text-slate-500">
                  Zusammenfassung des Themas und architektonische Einordnung.
                </p>
              </div>

              {!isEditingSummary && (
                <button
                  onClick={() => {
                    setSummaryInput(currentSummary);
                    setIsEditingSummary(true);
                  }}
                  className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-md transition-colors"
                >
                  <Pencil className="w-3.5 h-3.5" />
                  <span>{currentSummary ? 'Bearbeiten' : 'Zusammenfassung erfassen'}</span>
                </button>
              )}
            </div>

            {isEditingSummary ? (
              <div className="space-y-3">
                <textarea
                  rows={4}
                  value={summaryInput}
                  onChange={e => setSummaryInput(e.target.value)}
                  placeholder={`Kurze Zusammenfassung für ${meta.sketchTitle} formulieren...`}
                  className="w-full text-xs p-3 border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-emerald-600 leading-relaxed"
                />
                <div className="flex justify-end gap-2">
                  <button
                    onClick={() => setIsEditingSummary(false)}
                    className="px-3 py-1.5 text-xs text-slate-600 hover:bg-slate-100 rounded-md transition-colors"
                  >
                    Abbrechen
                  </button>
                  <button
                    onClick={handleSaveSummary}
                    className="flex items-center gap-1.5 px-4 py-1.5 text-xs font-medium bg-slate-900 text-white rounded-md hover:bg-slate-800 transition-colors"
                  >
                    <Save className="w-3.5 h-3.5" />
                    <span>Speichern</span>
                  </button>
                </div>
              </div>
            ) : currentSummary ? (
              <div className="text-xs text-slate-700 leading-relaxed whitespace-pre-wrap bg-slate-50/50 p-4 rounded-lg border border-slate-100">
                {currentSummary}
              </div>
            ) : (
              <div className="p-6 text-center bg-slate-50/40 rounded-lg border border-dashed border-slate-200 text-slate-500 text-xs">
                {meta.shortDescription}
              </div>
            )}
          </section>
        )}

        {/* SECTION B: FRAGEN DES SENIORS */}
        {(activeSection === 'all' || activeSection === 'questions') && (
          <section className="bg-white rounded-xl border border-slate-200/90 p-6 shadow-xs space-y-4">
            <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 pb-3">
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-sm font-bold text-slate-900 tracking-tight">
                    {getTranslation('secB', language)}
                  </h3>
                  {clientQuestionsInTopic.length > 0 && (
                    <span className="inline-flex items-center gap-1 text-[11px] font-semibold bg-amber-100 text-amber-900 border border-amber-300 px-2 py-0.5 rounded-full">
                      <AlertCircle className="w-3 h-3 text-amber-700" />
                      <span>{clientQuestionsInTopic.length} {language === 'ru' ? 'вопросов клиенту (Isa)' : 'Fragen an Klienten (Isa)'}</span>
                    </span>
                  )}
                </div>
                <p className="text-xs text-slate-500 mt-0.5">
                  {language === 'ru'
                    ? '2-полевая структура: 1. Наше предложение (техника) и 2. Вопрос клиенту (Иса). Неясные моменты фиксируются для сеньора на завтра.'
                    : 'Strikte 2-Felder-Struktur: 1. Unser Vorschlag (Technik) & 2. Frage an Klienten (Isa). Unklare Punkte direkt für den Senior morgen fixieren.'}
                </p>
              </div>

              <div className="flex items-center gap-2">
                {/* Filter Pills */}
                <div className="flex items-center bg-slate-100 rounded-lg p-0.5 text-xs">
                  <button
                    onClick={() => setQuestionFilter('all')}
                    className={`px-2.5 py-1 rounded font-medium transition-colors ${
                      questionFilter === 'all'
                        ? 'bg-white text-slate-900 shadow-xs'
                        : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    {language === 'ru' ? `Все (${topicQuestions.length})` : `Alle (${topicQuestions.length})`}
                  </button>
                  <button
                    onClick={() => setQuestionFilter('client_only')}
                    className={`px-2.5 py-1 rounded font-medium flex items-center gap-1 transition-colors ${
                      questionFilter === 'client_only'
                        ? 'bg-amber-500 text-white shadow-xs font-semibold'
                        : 'text-amber-800 hover:text-amber-950'
                    }`}
                  >
                    <AlertCircle className="w-3 h-3" />
                    <span>{language === 'ru' ? `Клиенту (${clientQuestionsInTopic.length})` : `Klientenfragen (${clientQuestionsInTopic.length})`}</span>
                  </button>
                  <button
                    onClick={() => setQuestionFilter('resolved')}
                    className={`px-2.5 py-1 rounded font-medium transition-colors ${
                      questionFilter === 'resolved'
                        ? 'bg-white text-emerald-800 shadow-xs'
                        : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    {language === 'ru' ? `Решено (${topicQuestions.filter(q => q.isResolved).length})` : `Geklärt (${topicQuestions.filter(q => q.isResolved).length})`}
                  </button>
                </div>

                <button
                  onClick={() => setIsNewQuestionModal(true)}
                  className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium bg-slate-900 hover:bg-slate-800 text-white rounded-md transition-colors shadow-xs"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>{getTranslation('addQuestion', language)}</span>
                </button>
              </div>
            </div>

            {/* Quick banner for client questions if any */}
            {clientQuestionsInTopic.length > 0 && questionFilter !== 'client_only' && (
              <div className="bg-amber-50/80 border border-amber-200/90 rounded-lg p-3 text-xs text-amber-950 flex items-center justify-between gap-3">
                <div className="flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 text-amber-700 shrink-0" />
                  <span>
                    {language === 'ru'
                      ? `Внимание: здесь зафиксировано ${clientQuestionsInTopic.length} вопросов, которые Сеньор должен завтра задать клиенту (Исе).`
                      : `Hinweis: Hier sind ${clientQuestionsInTopic.length} Fragen fixiert, die der Senior morgen unbedingt den Kunden (Isa) fragen muss.`}
                  </span>
                </div>
                <button
                  onClick={() => setQuestionFilter('client_only')}
                  className="shrink-0 text-[11px] font-semibold text-amber-900 hover:text-amber-950 underline"
                >
                  {language === 'ru' ? 'Показать только вопросы клиенту →' : 'Nur Klientenfragen anzeigen →'}
                </button>
              </div>
            )}

            <div className="space-y-4">
              {filteredTopicQuestions.length === 0 ? (
                <div className="p-6 text-center text-xs text-slate-500 bg-slate-50 rounded-lg border border-dashed border-slate-200">
                  {language === 'ru' ? 'Нет вопросов по выбранному фильтру.' : 'Keine Fragen für den ausgewählten Filter vorhanden.'}
                </div>
              ) : (
                filteredTopicQuestions.map((q) => (
                  <div
                    key={q.id}
                    className={`p-4 rounded-xl border transition-all ${
                      q.isResolved
                        ? 'bg-emerald-50/15 border-emerald-200/70'
                        : (q.needsClientClarification || q.clientQuestion)
                          ? 'bg-amber-50/20 border-amber-200 hover:border-amber-300'
                          : 'bg-white border-slate-200/80 hover:border-slate-300'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex items-start gap-2.5">
                        <button
                          onClick={() => handleToggleQuestionResolved(q)}
                          className={`mt-0.5 p-1 rounded-md transition-colors ${
                            q.isResolved
                              ? 'text-emerald-700 hover:bg-emerald-100'
                              : 'text-slate-400 hover:text-slate-600 hover:bg-slate-100'
                          }`}
                          title={q.isResolved
                            ? (language === 'ru' ? 'Отметить как открытый' : 'Als offen markieren')
                            : (language === 'ru' ? 'Отметить как решенный' : 'Als geklärt markieren')}
                        >
                          <CheckCircle2 className={`w-4 h-4 ${q.isResolved ? 'fill-emerald-600 text-white' : ''}`} />
                        </button>

                        <div>
                          <div className="flex flex-wrap items-center gap-2">
                            <span className={`text-xs font-bold tracking-tight ${q.isResolved ? 'text-slate-800' : 'text-slate-900'}`}>
                              {language === 'ru'
                                ? (q.questionRu || q.question)
                                : language === 'bilingual'
                                  ? (q.questionRu ? `${q.questionRu}` : q.question)
                                  : q.question}
                            </span>
                            {q.originalFromSketch && (
                              <span className="text-[10px] text-slate-500 bg-slate-100 px-1.5 py-0.2 rounded font-mono">
                                {language === 'ru' ? 'Из эскиза' : 'Original aus Skizze'}
                              </span>
                            )}
                            {(q.needsClientClarification || q.clientQuestion) && (
                              <span className="inline-flex items-center gap-1 text-[10px] font-semibold bg-amber-100 text-amber-900 border border-amber-300 px-1.5 py-0.2 rounded">
                                <AlertCircle className="w-2.5 h-2.5 text-amber-700" />
                                {language === 'ru' ? 'Вопрос клиенту (Isa)' : 'Frage an Klienten (Isa)'}
                              </span>
                            )}
                          </div>

                          {language === 'bilingual' && q.questionRu && q.question !== q.questionRu && (
                            <div className="text-[11px] text-slate-400 mt-0.5 italic">
                              DE: {q.question}
                            </div>
                          )}

                          {q.germanTranslation && q.germanTranslation !== q.question && language === 'de' && (
                            <div className="text-[11px] text-slate-500 mt-0.5">
                              Bedeutung: {q.germanTranslation}
                            </div>
                          )}
                        </div>
                      </div>

                      <div className="flex items-center gap-1 shrink-0">
                        <button
                          onClick={() => setEditingQuestion(q)}
                          className="p-1 text-slate-400 hover:text-slate-700 rounded transition-colors"
                          title={language === 'ru' ? 'Редактировать предложение и вопрос клиенту' : 'Vorschlag & Frage an Klienten bearbeiten'}
                        >
                          <Pencil className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => handleDeleteQuestion(q.id)}
                          className="p-1 text-slate-400 hover:text-rose-600 rounded transition-colors"
                          title={language === 'ru' ? 'Удалить вопрос' : 'Frage löschen'}
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>

                    {/* TWO DEDICATED FIELDS: FELD 1 (UNSER VORSCHLAG) & FELD 2 (FRAGE AN KLIENTEN ISA) */}
                    <div className="mt-3 ml-7 space-y-2.5">
                      {/* FELD 1: UNSER VORSCHLAG */}
                      <div className="p-3 bg-emerald-50/40 rounded-lg border border-emerald-200/70 text-xs text-slate-800 leading-relaxed">
                        <div className="flex items-center justify-between mb-1">
                          <span className="font-semibold text-emerald-950 text-[11px] flex items-center gap-1.5">
                            <Lightbulb className="w-3.5 h-3.5 text-emerald-700" />
                            {language === 'ru' ? '1. Наше предложение (Техника / Процесс):' : '1. Unser Vorschlag (Technik & Empfehlung):'}
                          </span>
                          {(!q.answer && !q.answerRu) && (
                            <span className="text-[10px] text-slate-400 italic">
                              {language === 'ru' ? 'пока не сформулировано' : 'noch nicht festgelegt'}
                            </span>
                          )}
                        </div>
                        {(q.answer || q.answerRu) ? (
                          <>
                            <p className="whitespace-pre-wrap text-emerald-950 font-normal">
                              {language === 'ru' ? (q.answerRu || q.answer) : q.answer}
                            </p>
                            {language === 'bilingual' && q.answerRu && q.answer && q.answer !== q.answerRu && (
                              <div className="text-[11px] text-emerald-800/80 mt-1.5 pt-1 border-t border-emerald-200/50 italic">
                                DE: {q.answer}
                              </div>
                            )}
                          </>
                        ) : (
                          <div className="flex items-center justify-between text-slate-500 pt-0.5">
                            <span className="text-[11px] italic">
                              {language === 'ru'
                                ? 'Мы не знаем что предложить — требуется запросить информацию у клиента (Исы).'
                                : 'Wir können hier noch keinen Vorschlag machen – zwingende Info vom Kunden (Isa) nötig.'}
                            </span>
                            <button
                              onClick={() => setEditingQuestion(q)}
                              className="text-[11px] text-emerald-800 hover:text-emerald-950 font-medium underline"
                            >
                              + {language === 'ru' ? 'Записать предложение' : 'Vorschlag erfassen'}
                            </button>
                          </div>
                        )}
                      </div>

                      {/* FELD 2: FRAGE AN KLIENTEN (ISA) */}
                      {(q.clientQuestion || q.clientQuestionRu) ? (
                        <div className="p-3 bg-amber-50/80 rounded-lg border border-amber-300 text-xs text-amber-950 leading-relaxed shadow-xs">
                          <div className="flex items-center justify-between mb-1">
                            <span className="font-bold text-amber-950 text-[11px] flex items-center gap-1.5">
                              <AlertCircle className="w-3.5 h-3.5 text-amber-700" />
                              {language === 'ru'
                                ? '2. Вопрос клиенту (Isa) — передать сеньору на завтра:'
                                : '2. Frage an Klienten (Isa) – Morgen an den Senior übergeben:'}
                            </span>
                            <span className="text-[10px] uppercase font-mono px-1.5 py-0.5 rounded bg-amber-200 text-amber-900 font-bold">
                              {language === 'ru' ? 'Запрос клиенту' : 'Klienten-Frage'}
                            </span>
                          </div>
                          <p className="whitespace-pre-wrap font-medium text-amber-950">
                            {language === 'ru' ? (q.clientQuestionRu || q.clientQuestion) : q.clientQuestion}
                          </p>
                          {language === 'bilingual' && q.clientQuestionRu && q.clientQuestion && q.clientQuestion !== q.clientQuestionRu && (
                            <div className="text-[11px] text-amber-800/80 mt-1.5 pt-1 border-t border-amber-200 italic">
                              DE: {q.clientQuestion}
                            </div>
                          )}
                        </div>
                      ) : q.needsClientClarification ? (
                        <div className="p-3 bg-amber-50/60 rounded-lg border border-dashed border-amber-300 text-xs text-amber-900 flex items-center justify-between">
                          <div className="flex items-center gap-1.5 text-[11px]">
                            <AlertCircle className="w-3.5 h-3.5 text-amber-700 shrink-0" />
                            <span className="font-semibold">
                              {language === 'ru'
                                ? '2. Зафиксировано: требуется запрос клиенту (Исе)! Пожалуйста, сформулируйте точный вопрос для сеньора.'
                                : '2. Fixiert: Klärung mit Klient (Isa) zwingend nötig! Bitte konkrete Frage für den Senior erfassen.'}
                            </span>
                          </div>
                          <button
                            onClick={() => setEditingQuestion(q)}
                            className="text-[11px] bg-amber-700 hover:bg-amber-800 text-white px-2.5 py-1 rounded font-medium shadow-xs shrink-0"
                          >
                            {language === 'ru' ? '+ Сформулировать вопрос' : '+ Frage an Isa formulieren'}
                          </button>
                        </div>
                      ) : (
                        <div className="pt-0.5">
                          <button
                            onClick={() => {
                              setEditingQuestion({
                                ...q,
                                needsClientClarification: true
                              });
                            }}
                            className="text-[11px] text-slate-500 hover:text-amber-800 inline-flex items-center gap-1 font-medium hover:underline transition-colors"
                          >
                            <HelpCircle className="w-3 h-3 text-slate-400" />
                            <span>
                              {language === 'ru'
                                ? '+ Зафиксировать вопрос клиенту (Isa), если нужно спросить заказчика'
                                : '+ Frage an Klienten (Isa) fixieren (falls Klärungsbedarf für den Senior)'}
                            </span>
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                ))
              )}
            </div>
          </section>
        )}

        {/* SECTION C: GESAMMELTE ERKENNTNISSE */}
        {(activeSection === 'all' || activeSection === 'findings') && (
          <section className="bg-white rounded-xl border border-slate-200/90 p-6 shadow-xs space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div>
                <h3 className="text-sm font-bold text-slate-900 tracking-tight">
                  {getTranslation('secC', language)}
                </h3>
                <p className="text-xs text-slate-500">
                  {language === 'ru'
                    ? 'Результаты исследований, технические наблюдения и проверенные факты.'
                    : 'Rechercheergebnisse, technische Beobachtungen und verifizierte Fakten.'}
                </p>
              </div>

              <button
                onClick={() => setIsNewFindingModal(true)}
                className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium bg-slate-900 hover:bg-slate-800 text-white rounded-md transition-colors shadow-xs"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>{getTranslation('addFinding', language)}</span>
              </button>
            </div>

            {topicFindings.length === 0 ? (
              <div className="p-8 text-center bg-slate-50/50 rounded-xl border border-dashed border-slate-200">
                <Lightbulb className="w-8 h-8 text-slate-300 mx-auto mb-2" />
                <h4 className="text-xs font-semibold text-slate-700">
                  {language === 'ru' ? 'Данные еще не внесены' : 'Noch keine Erkenntnisse hinterlegt'}
                </h4>
                <p className="text-xs text-slate-500 max-w-sm mx-auto mt-1">
                  {language === 'ru'
                    ? 'Здесь фиксируются технические факты, лучшие практики и результаты тестов.'
                    : 'Hier trägst du technische Fakten, Best-Practices und Ergebnisse aus Artikeln, Dokumentationen oder Tests ein.'}
                </p>
              </div>
            ) : (
              <div className="space-y-3">
                {topicFindings.map(f => (
                  <div
                    key={f.id}
                    className="p-4 bg-white rounded-lg border border-slate-200/80 hover:border-slate-300 transition-all"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <StatusBadge status={f.status} origin={f.origin} showOrigin language={language} />
                          {f.additionalTopicIds && f.additionalTopicIds.length > 0 && (
                            <span className="text-[10px] text-slate-400 font-mono">
                              · {language === 'ru' ? 'Связано с' : 'Verknüpft mit'} {f.additionalTopicIds.map(t => TOPIC_DEFINITIONS[t]?.sketchTitle).join(', ')}
                            </span>
                          )}
                        </div>
                        <h4 className="text-xs font-bold text-slate-900">
                          {language === 'ru'
                            ? (f.titleRu || f.title)
                            : language === 'bilingual'
                              ? (f.titleRu ? `${f.titleRu}` : f.title)
                              : f.title}
                        </h4>
                      </div>

                      <div className="flex items-center gap-1">
                        <button
                          onClick={() => setEditingFinding(f)}
                          className="p-1 text-slate-400 hover:text-slate-700 rounded transition-colors"
                        >
                          <Pencil className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => handleDeleteFinding(f.id)}
                          className="p-1 text-slate-400 hover:text-rose-600 rounded transition-colors"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>

                    <p className="text-xs text-slate-700 leading-relaxed mt-2 whitespace-pre-wrap">
                      {language === 'ru' ? (f.contentRu || f.content) : f.content}
                    </p>

                    {(f.sourceName || f.sourceUrl) && (
                      <div className="mt-3 pt-2 border-t border-slate-100 flex items-center gap-2 text-[11px] text-slate-500">
                        <span className="font-medium">{getTranslation('source', language)}:</span>
                        <span>{f.sourceName || 'Referenz'}</span>
                        {f.sourceUrl && (
                          <a
                            href={f.sourceUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-emerald-700 hover:text-emerald-900 inline-flex items-center gap-1"
                          >
                            <span>Link</span>
                            <ExternalLink className="w-3 h-3" />
                          </a>
                        )}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </section>
        )}

        {/* SECTION D: WETTBEWERBSRECHERCHE */}
        {(activeSection === 'all' || activeSection === 'competitors') && (
          <section className="bg-white rounded-xl border border-slate-200/90 p-6 shadow-xs space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div>
                <h3 className="text-sm font-bold text-slate-900 tracking-tight">
                  {getTranslation('secD', language)}
                </h3>
                <p className="text-xs text-slate-500">
                  {language === 'ru'
                    ? 'Анализ программных продуктов, процессов, выводов и применимости для нашего продукта.'
                    : 'Dokumentation anderer Softwareprodukte, Abläufe, Learnings und Übertragbarkeit.'}
                </p>
              </div>

              <button
                onClick={() => setIsNewCompetitorModal(true)}
                className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium bg-slate-900 hover:bg-slate-800 text-white rounded-md transition-colors shadow-xs"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>{getTranslation('addCompetitor', language)}</span>
              </button>
            </div>

            {topicCompetitors.length === 0 ? (
              <div className="p-8 text-center bg-slate-50/50 rounded-xl border border-dashed border-slate-200">
                <Building2 className="w-8 h-8 text-slate-300 mx-auto mb-2" />
                <h4 className="text-xs font-semibold text-slate-700">
                  {language === 'ru' ? 'Конкуренты еще не добавлены' : 'Noch keine Wettbewerbsprodukte erfasst'}
                </h4>
                <p className="text-xs text-slate-500 max-w-sm mx-auto mt-1">
                  {language === 'ru'
                    ? 'Добавьте SmartDok, Dalux, QuickBooks Time или Tripletex и опишите их функционал.'
                    : 'Trage z. B. Produkte wie SmartDok, Dalux, QuickBooks Time oder Tripletex ein und dokumentiere deren Workflow.'}
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {topicCompetitors.map(c => (
                  <div
                    key={c.id}
                    className="p-4 bg-white rounded-lg border border-slate-200/80 hover:border-slate-300 transition-all flex flex-col justify-between shadow-xs"
                  >
                    <div>
                      <div className="flex items-start justify-between gap-2 mb-2">
                        <div>
                          <div className="text-[11px] font-mono text-emerald-800 uppercase tracking-wider">
                            {language === 'ru' ? 'ПРОДУКТ' : 'Produkt'}
                          </div>
                          <h4 className="text-sm font-bold text-slate-900">
                            {c.productName}
                          </h4>
                          <div className="text-xs font-medium text-slate-600 mt-0.5">
                            {language === 'ru' ? 'Функция:' : 'Funktion:'} {language === 'ru' ? (c.analyzedFeatureRu || c.analyzedFeature) : c.analyzedFeature}
                          </div>
                        </div>

                        <div className="flex items-center gap-1">
                          <button
                            onClick={() => setEditingCompetitor(c)}
                            className="p-1 text-slate-400 hover:text-slate-700 rounded transition-colors"
                          >
                            <Pencil className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => handleDeleteCompetitor(c.id)}
                            className="p-1 text-slate-400 hover:text-rose-600 rounded transition-colors"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>

                      <div className="space-y-2 text-xs text-slate-700 pt-2 border-t border-slate-100">
                        <div>
                          <span className="font-semibold text-slate-800 block">
                            {language === 'ru' ? 'Изученный процесс:' : 'Beobachteter Ablauf:'}
                          </span>
                          <p className="leading-relaxed text-slate-600 mt-0.5">
                            {language === 'ru' ? (c.observedWorkflowRu || c.observedWorkflow) : c.observedWorkflow}
                          </p>
                        </div>

                        <div>
                          <span className="font-semibold text-slate-800 block">
                            {language === 'ru' ? 'Чему мы можем научиться:' : 'Was wir davon lernen können:'}
                          </span>
                          <p className="leading-relaxed text-emerald-900 bg-emerald-50/50 p-2 rounded mt-0.5 border border-emerald-100">
                            {language === 'ru' ? (c.keyTakeawayRu || c.keyTakeaway) : c.keyTakeaway}
                          </p>
                        </div>

                        <div>
                          <span className="font-semibold text-slate-800 block">
                            {language === 'ru' ? 'Применимость для нашего продукта:' : 'Übertragbarkeit auf unser Produkt:'}
                          </span>
                          <p className="leading-relaxed text-slate-600 mt-0.5">
                            {language === 'ru' ? (c.transferabilityRu || c.transferability) : c.transferability}
                          </p>
                        </div>
                      </div>
                    </div>

                    {c.sourceOrLink && (
                      <div className="mt-3 pt-2 border-t border-slate-100 text-[11px] text-slate-500">
                        <span className="font-medium">{getTranslation('source', language)}: </span>
                        {c.sourceOrLink.startsWith('http') ? (
                          <a
                            href={c.sourceOrLink}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-emerald-700 hover:underline inline-flex items-center gap-0.5"
                          >
                            <span>Link</span>
                            <ExternalLink className="w-2.5 h-2.5" />
                          </a>
                        ) : (
                          <span>{c.sourceOrLink}</span>
                        )}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </section>
        )}

        {/* SECTION E: EMPFEHLUNGEN FÜR UNSER PRODUKT */}
        {(activeSection === 'all' || activeSection === 'recommendations') && (
          <section className="bg-white rounded-xl border border-slate-200/90 p-6 shadow-xs space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div>
                <h3 className="text-sm font-bold text-slate-900 tracking-tight">
                  {getTranslation('secE', language)}
                </h3>
                <p className="text-xs text-slate-500">
                  {language === 'ru'
                    ? 'Конкретные архитектурные и технические предложения для команды проекта.'
                    : 'Konkrete Architektur- und Lösungsvorschläge für das Projektteam.'}
                </p>
              </div>

              <button
                onClick={() => setIsNewRecommendationModal(true)}
                className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium bg-slate-900 hover:bg-slate-800 text-white rounded-md transition-colors shadow-xs"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>{getTranslation('addRec', language)}</span>
              </button>
            </div>

            {topicRecs.length === 0 ? (
              <div className="p-8 text-center bg-slate-50/50 rounded-xl border border-dashed border-slate-200">
                <Lightbulb className="w-8 h-8 text-slate-300 mx-auto mb-2" />
                <h4 className="text-xs font-semibold text-slate-700">
                  {language === 'ru' ? 'Рекомендации еще не добавлены' : 'Noch keine Empfehlungen formuliert'}
                </h4>
                <p className="text-xs text-slate-500 max-w-sm mx-auto mt-1">
                  {language === 'ru'
                    ? 'Здесь фиксируются архитектурные решения и предложения для согласования с Сеньором.'
                    : 'Hier dokumentierst du eigene Lösungsvorschläge für den Senior Software Engineer zur Diskussion.'}
                </p>
              </div>
            ) : (
              <div className="space-y-3">
                {topicRecs.map(r => (
                  <div
                    key={r.id}
                    className="p-4 bg-white rounded-lg border border-slate-200/80 hover:border-slate-300 transition-all"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <div className="flex items-center gap-2 mb-1 text-xs">
                          <StatusBadge status={r.status} origin={r.origin} showOrigin language={language} />
                          <span className="text-slate-300">·</span>
                          <span className="font-mono text-[11px] text-slate-500">
                            {language === 'ru' ? 'Приоритет:' : 'Priorität:'} {r.priority.toUpperCase()}
                          </span>
                        </div>
                        <h4 className="text-xs font-bold text-slate-900">
                          {language === 'ru' ? (r.titleRu || r.title) : r.title}
                        </h4>
                      </div>

                      <div className="flex items-center gap-1">
                        <button
                          onClick={() => setEditingRecommendation(r)}
                          className="p-1 text-slate-400 hover:text-slate-700 rounded transition-colors"
                        >
                          <Pencil className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => handleDeleteRecommendation(r.id)}
                          className="p-1 text-slate-400 hover:text-rose-600 rounded transition-colors"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>

                    <p className="text-xs text-slate-700 leading-relaxed mt-2 whitespace-pre-wrap">
                      {language === 'ru' ? (r.descriptionRu || r.description) : r.description}
                    </p>

                    {(r.rationale || r.rationaleRu) && (
                      <div className="mt-2 text-xs text-slate-600 bg-slate-50 p-2.5 rounded border border-slate-100">
                        <span className="font-semibold text-slate-700">
                          {language === 'ru' ? 'Обоснование: ' : 'Begründung: '}
                        </span>
                        {language === 'ru' ? (r.rationaleRu || r.rationale) : r.rationale}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </section>
        )}

        {/* SECTION F: OFFENE PUNKTE */}
        {(activeSection === 'all' || activeSection === 'open_points') && (
          <section className="bg-white rounded-xl border border-slate-200/90 p-6 shadow-xs space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div>
                <h3 className="text-sm font-bold text-slate-900 tracking-tight">
                  {getTranslation('secF', language)}
                </h3>
                <p className="text-xs text-slate-500">
                  {language === 'ru'
                    ? 'Вопросы, требующие обсуждения с Сеньором, клиентом или командой.'
                    : 'Fragen, die noch mit dem Senior, dem Kunden oder dem Team geklärt werden müssen.'}
                </p>
              </div>

              <button
                onClick={() => setIsNewOpenPointModal(true)}
                className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium bg-slate-900 hover:bg-slate-800 text-white rounded-md transition-colors shadow-xs"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>{getTranslation('addOpenPoint', language)}</span>
              </button>
            </div>

            {topicOpenPoints.length === 0 ? (
              <div className="p-8 text-center bg-slate-50/50 rounded-xl border border-dashed border-slate-200">
                <AlertCircle className="w-8 h-8 text-slate-300 mx-auto mb-2" />
                <h4 className="text-xs font-semibold text-slate-700">
                  {language === 'ru' ? 'Нет открытых вопросов' : 'Keine offenen Klärungspunkte'}
                </h4>
                <p className="text-xs text-slate-500 max-w-sm mx-auto mt-1">
                  {language === 'ru'
                    ? 'Все аспекты данной темы предварительно согласованы.'
                    : 'Alle Aspekte dieses Themas sind entweder vorläufig geklärt oder warten auf Recherche.'}
                </p>
              </div>
            ) : (
              <div className="space-y-3">
                {topicOpenPoints.map(p => (
                  <div
                    key={p.id}
                    className={`p-4 rounded-lg border transition-all ${
                      p.isResolved
                        ? 'bg-slate-50 border-slate-200/60 opacity-80'
                        : 'bg-white border-amber-200/80'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex items-start gap-2.5">
                        <button
                          onClick={async () => {
                            await saveOpenPoint({
                              ...p,
                              isResolved: !p.isResolved,
                              updatedAt: new Date().toISOString()
                            });
                            await onRefreshData();
                          }}
                          className={`mt-0.5 p-1 rounded-md transition-colors ${
                            p.isResolved ? 'text-emerald-600' : 'text-slate-400 hover:text-slate-600'
                          }`}
                        >
                          <CheckCircle2 className={`w-4 h-4 ${p.isResolved ? 'fill-emerald-600 text-white' : ''}`} />
                        </button>

                        <div>
                          <div className="flex items-center gap-2 text-xs">
                            <span className="font-bold text-slate-900">
                              {language === 'ru' ? (p.questionRu || p.question) : p.question}
                            </span>
                            <span className="text-[10px] px-1.5 py-0.5 rounded font-mono bg-slate-100 text-slate-600">
                              {language === 'ru' ? 'К согласованию:' : 'Klärung mit:'} {p.clarifyWith.toUpperCase()}
                            </span>
                          </div>

                          {(p.resolutionNote || p.resolutionNoteRu) && (
                            <div className="text-xs text-slate-600 mt-2 bg-slate-100/70 p-2 rounded">
                              <span className="font-semibold text-slate-700">
                                {language === 'ru' ? 'Результат: ' : 'Ergebnis: '}
                              </span>
                              {language === 'ru' ? (p.resolutionNoteRu || p.resolutionNote) : p.resolutionNote}
                            </div>
                          )}
                        </div>
                      </div>

                      <div className="flex items-center gap-1 shrink-0">
                        <button
                          onClick={() => setEditingOpenPoint(p)}
                          className="p-1 text-slate-400 hover:text-slate-700 rounded transition-colors"
                        >
                          <Pencil className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => handleDeleteOpenPoint(p.id)}
                          className="p-1 text-slate-400 hover:text-rose-600 rounded transition-colors"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </section>
        )}

        {/* SECTION G: ENTSCHEIDUNGEN */}
        {(activeSection === 'all' || activeSection === 'decisions') && (
          <section className="bg-white rounded-xl border border-slate-200/90 p-6 shadow-xs space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div>
                <h3 className="text-sm font-bold text-slate-900 tracking-tight">
                  {getTranslation('secG', language)}
                </h3>
                <p className="text-xs text-slate-500">
                  {language === 'ru'
                    ? 'Обязательные архитектурные решения с датой, обоснованием и ответственным.'
                    : 'Verbindliche Beschlüsse mit Datum, Begründung und Verantwortlichem.'}
                </p>
              </div>

              <button
                onClick={() => setIsNewDecisionModal(true)}
                className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium bg-slate-900 hover:bg-slate-800 text-white rounded-md transition-colors shadow-xs"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>{getTranslation('addDecision', language)}</span>
              </button>
            </div>

            {topicDecisions.length === 0 ? (
              <div className="p-8 text-center bg-slate-50/50 rounded-xl border border-dashed border-slate-200">
                <FileCheck2 className="w-8 h-8 text-slate-300 mx-auto mb-2" />
                <h4 className="text-xs font-semibold text-slate-700">
                  {language === 'ru' ? 'Решения еще не зафиксированы' : 'Noch keine Entscheidungen festgehalten'}
                </h4>
                <p className="text-xs text-slate-500 max-w-sm mx-auto mt-1">
                  {language === 'ru'
                    ? 'Как только на встрече с Сеньором принято решение, зафиксируйте его здесь.'
                    : 'Sobald im Meeting mit dem Senior eine Entscheidung getroffen wird, trage sie hier verbindlich ein.'}
                </p>
              </div>
            ) : (
              <div className="space-y-3">
                {topicDecisions.map(d => (
                  <div
                    key={d.id}
                    className="p-4 bg-white rounded-lg border border-slate-200/80 hover:border-slate-300 transition-all"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <div className="flex items-center gap-2 mb-1 text-xs">
                          <span className="font-semibold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded text-[11px]">
                            {d.status === 'decided'
                              ? (language === 'ru' ? 'Принято' : 'Beschlossen')
                              : d.status === 'draft'
                                ? (language === 'ru' ? 'Проект' : 'Entwurf')
                                : (language === 'ru' ? 'Заменено' : 'Abgelöst')}
                          </span>
                          <span className="font-mono text-slate-400 text-[11px]">
                            {language === 'ru' ? 'Дата:' : 'Datum:'} {d.date}
                          </span>
                          {d.responsiblePerson && (
                            <span className="text-slate-500 text-[11px]">
                              · {getTranslation('responsible', language)}: {d.responsiblePerson}
                            </span>
                          )}
                        </div>
                        <h4 className="text-xs font-bold text-slate-900">
                          {language === 'ru' ? (d.titleRu || d.title) : d.title}
                        </h4>
                      </div>

                      <div className="flex items-center gap-1">
                        <button
                          onClick={() => setEditingDecision(d)}
                          className="p-1 text-slate-400 hover:text-slate-700 rounded transition-colors"
                        >
                          <Pencil className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => handleDeleteDecision(d.id)}
                          className="p-1 text-slate-400 hover:text-rose-600 rounded transition-colors"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>

                    <div className="mt-2 text-xs text-slate-700 leading-relaxed bg-slate-50/60 p-3 rounded border border-slate-100 whitespace-pre-wrap">
                      <span className="font-semibold text-slate-800 block mb-1">
                        {language === 'ru' ? 'Обоснование и последствия:' : 'Begründung & Tragweite:'}
                      </span>
                      {language === 'ru' ? (d.rationaleRu || d.rationale) : d.rationale}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </section>
        )}

        {/* SECTION H: QUELLEN UND ANHÄNGE */}
        {(activeSection === 'all' || activeSection === 'attachments') && (
          <section className="bg-white rounded-xl border border-slate-200/90 p-6 shadow-xs space-y-4">
            <div className="border-b border-slate-100 pb-3">
              <h3 className="text-sm font-bold text-slate-900 tracking-tight">
                {getTranslation('secH', language)}
              </h3>
              <p className="text-xs text-slate-500">
                {language === 'ru'
                  ? 'Скриншоты, архитектурные диаграммы, PDF-файлы и веб-ссылки — сохраненные в браузере.'
                  : 'Screenshots, Architektur-Diagramme, PDF-Dateien und Weblinks – persistent im Browser gespeichert.'}
              </p>
            </div>

            <AttachmentViewer
              topicId={topicId}
              attachments={databaseState.attachments}
              onAddAttachment={handleAddAttachment}
              onDeleteAttachment={handleDeleteAttachment}
            />
          </section>
        )}
      </div>

      {/* MODAL: Question Create/Edit */}
      {(editingQuestion || isNewQuestionModal) && (
        <QuestionModal
          initialQuestion={editingQuestion}
          topicId={topicId}
          language={language}
          onClose={() => {
            setEditingQuestion(null);
            setIsNewQuestionModal(false);
          }}
          onSave={handleSaveQuestion}
        />
      )}

      {/* MODAL: Finding Create/Edit */}
      {(editingFinding || isNewFindingModal) && (
        <FindingModal
          initialFinding={editingFinding}
          topicId={topicId}
          onClose={() => {
            setEditingFinding(null);
            setIsNewFindingModal(false);
          }}
          onSave={handleSaveFinding}
        />
      )}

      {/* MODAL: Competitor Create/Edit */}
      {(editingCompetitor || isNewCompetitorModal) && (
        <CompetitorModal
          initialCompetitor={editingCompetitor}
          topicId={topicId}
          onClose={() => {
            setEditingCompetitor(null);
            setIsNewCompetitorModal(false);
          }}
          onSave={handleSaveCompetitor}
        />
      )}

      {/* MODAL: Recommendation Create/Edit */}
      {(editingRecommendation || isNewRecommendationModal) && (
        <RecommendationModal
          initialRecommendation={editingRecommendation}
          topicId={topicId}
          onClose={() => {
            setEditingRecommendation(null);
            setIsNewRecommendationModal(false);
          }}
          onSave={handleSaveRecommendation}
        />
      )}

      {/* MODAL: Open Point Create/Edit */}
      {(editingOpenPoint || isNewOpenPointModal) && (
        <OpenPointModal
          initialPoint={editingOpenPoint}
          topicId={topicId}
          onClose={() => {
            setEditingOpenPoint(null);
            setIsNewOpenPointModal(false);
          }}
          onSave={handleSaveOpenPoint}
        />
      )}

      {/* MODAL: Decision Create/Edit */}
      {(editingDecision || isNewDecisionModal) && (
        <DecisionModal
          initialDecision={editingDecision}
          topicId={topicId}
          onClose={() => {
            setEditingDecision(null);
            setIsNewDecisionModal(false);
          }}
          onSave={handleSaveDecision}
        />
      )}
    </div>
  );
};

// --- MODAL COMPONENTS ---

interface QuestionModalProps {
  initialQuestion: SeniorQuestion | null;
  topicId: TopicId;
  language?: Language;
  onClose: () => void;
  onSave: (q: SeniorQuestion) => void;
}

const QuestionModal: React.FC<QuestionModalProps> = ({ initialQuestion, topicId, language = 'ru', onClose, onSave }) => {
  const [question, setQuestion] = useState(initialQuestion?.question || '');
  const [questionRu, setQuestionRu] = useState(initialQuestion?.questionRu || '');
  const [germanTranslation, setGermanTranslation] = useState(initialQuestion?.germanTranslation || '');
  
  // Feld 1: Unser Vorschlag
  const [answer, setAnswer] = useState(initialQuestion?.answer || '');
  const [answerRu, setAnswerRu] = useState(initialQuestion?.answerRu || '');
  
  // Feld 2: Frage an Klienten (Isa)
  const [clientQuestion, setClientQuestion] = useState(initialQuestion?.clientQuestion || '');
  const [clientQuestionRu, setClientQuestionRu] = useState(initialQuestion?.clientQuestionRu || '');
  const [needsClientClarification, setNeedsClientClarification] = useState(
    initialQuestion?.needsClientClarification !== undefined
      ? initialQuestion.needsClientClarification
      : (initialQuestion?.clientQuestion ? true : false)
  );

  const [isResolved, setIsResolved] = useState(initialQuestion?.isResolved || false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!question.trim()) return;

    onSave({
      id: initialQuestion?.id || `q-${Date.now()}`,
      topicId,
      question: question.trim(),
      questionRu: questionRu.trim() || undefined,
      germanTranslation: germanTranslation.trim() || undefined,
      russianTranslation: questionRu.trim() || undefined,
      answer: answer.trim() || undefined,
      answerRu: answerRu.trim() || undefined,
      clientQuestion: clientQuestion.trim() || undefined,
      clientQuestionRu: clientQuestionRu.trim() || undefined,
      needsClientClarification: needsClientClarification || Boolean(clientQuestion.trim() || clientQuestionRu.trim()),
      isResolved,
      originalFromSketch: initialQuestion?.originalFromSketch || false,
      origin: initialQuestion?.origin || 'sketch',
      status: initialQuestion?.status || 'open_decision',
      createdAt: initialQuestion?.createdAt || new Date().toISOString(),
      updatedAt: new Date().toISOString()
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs overflow-y-auto">
      <div className="bg-white rounded-xl shadow-2xl border border-slate-200 w-full max-w-2xl p-6 my-8 space-y-4 max-h-[90vh] overflow-y-auto">
        <div className="flex items-start justify-between border-b border-slate-100 pb-3">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-mono uppercase tracking-wider text-slate-400">
                {language === 'ru' ? '2-полевая модель' : '2-Felder-Modell'}
              </span>
              <span className="text-slate-300">/</span>
              <span className="text-xs font-semibold px-2 py-0.5 rounded bg-amber-100 text-amber-900 border border-amber-200">
                {language === 'ru' ? 'Сеньор ↔ Клиент (Isa)' : 'Senior ↔ Klient (Isa)'}
              </span>
            </div>
            <h3 className="text-base font-bold text-slate-900 mt-1">
              {initialQuestion
                ? (language === 'ru' ? 'Редактирование вопроса сеньора' : 'Frage des Seniors bearbeiten')
                : (language === 'ru' ? 'Новая формулировка вопроса' : 'Neue Frage erfassen')}
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              {language === 'ru'
                ? 'Поле 1: Наше предложение. Поле 2: Вопрос клиенту (Иса). Если мы не знаем что предложить — обязательно фиксируем вопрос клиенту для сеньора на завтра!'
                : 'Feld 1: Unser Vorschlag. Feld 2: Frage an Klienten (Isa). Wenn wir noch keinen Vorschlag machen können: Frage an Isa fixieren, damit der Senior morgen direkt weiß, was er fragen muss!'}
            </p>
          </div>

          <button
            onClick={onClose}
            className="p-1 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-100"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Question / Title */}
          <div className="space-y-2 bg-slate-50/70 p-3.5 rounded-lg border border-slate-200/80">
            <div>
              <label className="block text-xs font-bold text-slate-800 mb-1">
                {language === 'ru' ? 'Вопрос из эскиза / Оригинальный текст' : 'Frage / Text aus Originalskizze'}
              </label>
              <input
                type="text"
                required
                value={question}
                onChange={e => setQuestion(e.target.value)}
                placeholder={language === 'ru' ? 'Например: Kakie info ?' : 'z. B. Kakie info ?'}
                className="w-full text-xs px-3 py-2 bg-white border border-slate-200 rounded-md focus:outline-none focus:ring-1 focus:ring-emerald-600 font-medium"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-2 pt-1">
              <div>
                <label className="block text-[11px] font-medium text-slate-600 mb-0.5">
                  {language === 'ru' ? 'Русский перевод / Формулировка' : 'Russische Übersetzung / Kontext'}
                </label>
                <input
                  type="text"
                  value={questionRu}
                  onChange={e => setQuestionRu(e.target.value)}
                  placeholder="Вопрос на русском..."
                  className="w-full text-xs px-2.5 py-1.5 bg-white border border-slate-200 rounded-md focus:outline-none focus:ring-1 focus:ring-emerald-600"
                />
              </div>

              <div>
                <label className="block text-[11px] font-medium text-slate-600 mb-0.5">
                  {language === 'ru' ? 'Немецкий контекст / Значение' : 'Deutsche Bedeutung / Klartext'}
                </label>
                <input
                  type="text"
                  value={germanTranslation}
                  onChange={e => setGermanTranslation(e.target.value)}
                  placeholder="Klartext auf Deutsch..."
                  className="w-full text-xs px-2.5 py-1.5 bg-white border border-slate-200 rounded-md focus:outline-none focus:ring-1 focus:ring-emerald-600"
                />
              </div>
            </div>
          </div>

          {/* FELD 1: UNSER VORSCHLAG */}
          <div className="p-4 bg-emerald-50/40 rounded-xl border border-emerald-200/80 space-y-2">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold text-emerald-950 flex items-center gap-1.5">
                <Lightbulb className="w-4 h-4 text-emerald-700" />
                <span>{language === 'ru' ? 'ПОЛЕ 1: Наше предложение (Техника / Процесс)' : 'FELD 1: Unser Vorschlag (Technik & Empfehlung)'}</span>
              </label>
              <span className="text-[10px] text-emerald-800/80 bg-emerald-100/70 px-2 py-0.5 rounded font-mono">
                {language === 'ru' ? 'Необязательно, если неизвестно' : 'Optional wenn unklar'}
              </span>
            </div>
            <p className="text-[11px] text-emerald-900/80 leading-snug">
              {language === 'ru'
                ? 'Что мы предлагаем для ISA? (Если мы пока не знаем, что предложить — оставьте пустым и заполните Поле 2 ниже).'
                : 'Was schlagen wir technisch oder prozessual vor? (Kann leer bleiben, falls wir es noch nicht wissen und zwingend Info von Isa brauchen).'}
            </p>

            <div className="space-y-2 pt-1">
              <div>
                <span className="text-[10px] font-semibold text-emerald-900 block mb-0.5">
                  {language === 'ru' ? 'Предложение на русском:' : 'Vorschlag auf Deutsch:'}
                </span>
                <textarea
                  rows={2}
                  value={language === 'ru' ? (answerRu || answer) : answer}
                  onChange={e => {
                    if (language === 'ru') {
                      setAnswerRu(e.target.value);
                      if (!answer) setAnswer(e.target.value);
                    } else {
                      setAnswer(e.target.value);
                    }
                  }}
                  placeholder={language === 'ru' ? 'Наше техническое предложение для ISA...' : 'Unser technischer Lösungsvorschlag für ISA...'}
                  className="w-full text-xs px-3 py-2 bg-white border border-emerald-200 rounded-md focus:outline-none focus:ring-1 focus:ring-emerald-600"
                />
              </div>

              {(language === 'bilingual' || (language === 'ru' && answer !== answerRu)) && (
                <div>
                  <span className="text-[10px] font-semibold text-emerald-900 block mb-0.5">
                    {language === 'ru' ? 'Немецкий вариант предложения (DE):' : 'Russischer Vorschlag (RU):'}
                  </span>
                  <textarea
                    rows={2}
                    value={language === 'ru' ? answer : answerRu}
                    onChange={e => {
                      if (language === 'ru') {
                        setAnswer(e.target.value);
                      } else {
                        setAnswerRu(e.target.value);
                      }
                    }}
                    placeholder={language === 'ru' ? 'Vorschlag auf Deutsch...' : 'Vorschlag auf Russisch...'}
                    className="w-full text-xs px-3 py-2 bg-white border border-emerald-200 rounded-md focus:outline-none focus:ring-1 focus:ring-emerald-600"
                  />
                </div>
              )}
            </div>
          </div>

          {/* FELD 2: FRAGE AN KLIENTEN (ISA) */}
          <div className="p-4 bg-amber-50/70 rounded-xl border-2 border-amber-300 space-y-2.5 shadow-xs">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <label className="text-xs font-bold text-amber-950 flex items-center gap-1.5">
                <AlertCircle className="w-4 h-4 text-amber-700" />
                <span>{language === 'ru' ? 'ПОЛЕ 2: Вопрос клиенту (Isa) — для Сеньора на завтра' : 'FELD 2: Frage an Klienten (Isa) – Morgen an Senior übergeben!'}</span>
              </label>

              <label className="inline-flex items-center gap-1.5 bg-amber-100 hover:bg-amber-200 text-amber-950 px-2.5 py-1 rounded-md cursor-pointer border border-amber-300 text-xs font-semibold transition-colors">
                <input
                  type="checkbox"
                  checked={needsClientClarification}
                  onChange={e => setNeedsClientClarification(e.target.checked)}
                  className="accent-amber-700 rounded"
                />
                <span>{language === 'ru' ? '⚠️ Запрос клиенту обязателен' : '⚠️ Klienten-Rückfrage erforderlich'}</span>
              </label>
            </div>

            <p className="text-[11px] text-amber-900 leading-snug">
              {language === 'ru'
                ? 'Если мы не знаем, что предложить — здесь мы фиксируем точный вопрос, который Сеньор завтра должен задать клиенту (Исе), чтобы получить необходимые данные.'
                : 'Hier exakt fixieren, was der Senior morgen den Klienten Isa fragen muss, falls wir es noch nicht wissen und die Info vom Kunden zwingend brauchen.'}
            </p>

            <div className="space-y-2 pt-1">
              <div>
                <span className="text-[10px] font-semibold text-amber-950 block mb-0.5">
                  {language === 'ru' ? 'Вопрос клиенту (Исе):' : 'Frage an den Kunden (Isa):'}
                </span>
                <textarea
                  rows={2}
                  value={language === 'ru' ? (clientQuestionRu || clientQuestion) : clientQuestion}
                  onChange={e => {
                    if (language === 'ru') {
                      setClientQuestionRu(e.target.value);
                      if (!clientQuestion) setClientQuestion(e.target.value);
                    } else {
                      setClientQuestion(e.target.value);
                    }
                    if (!needsClientClarification) setNeedsClientClarification(true);
                  }}
                  placeholder={language === 'ru' ? 'Что сеньор должен спросить у Исы? Например: Используется ли номер клиента из Tripletex как главный ключ...' : 'Was muss der Senior den Kunden Isa fragen? z. B. Gibt es bei ProRiv Pauschalverträge...'}
                  className="w-full text-xs px-3 py-2 bg-white border border-amber-300 rounded-md focus:outline-none focus:ring-2 focus:ring-amber-500 font-medium"
                />
              </div>

              {(language === 'bilingual' || (language === 'ru' && clientQuestion !== clientQuestionRu)) && (
                <div>
                  <span className="text-[10px] font-semibold text-amber-950 block mb-0.5">
                    {language === 'ru' ? 'Немецкий вариант вопроса клиенту (DE):' : 'Russische Version der Frage (RU):'}
                  </span>
                  <textarea
                    rows={2}
                    value={language === 'ru' ? clientQuestion : clientQuestionRu}
                    onChange={e => {
                      if (language === 'ru') {
                        setClientQuestion(e.target.value);
                      } else {
                        setClientQuestionRu(e.target.value);
                      }
                      if (!needsClientClarification) setNeedsClientClarification(true);
                    }}
                    placeholder={language === 'ru' ? 'Frage an Klienten auf Deutsch...' : 'Вопрос клиенту на русском...'}
                    className="w-full text-xs px-3 py-2 bg-white border border-amber-300 rounded-md focus:outline-none focus:ring-1 focus:ring-amber-600"
                  />
                </div>
              )}
            </div>
          </div>

          {/* STATUS: GEKLÄRT */}
          <div className="flex items-center gap-2 pt-2 px-1">
            <input
              type="checkbox"
              id="isResolved"
              checked={isResolved}
              onChange={e => setIsResolved(e.target.checked)}
              className="accent-emerald-600 rounded w-4 h-4"
            />
            <label htmlFor="isResolved" className="text-xs font-semibold text-slate-800 cursor-pointer">
              {language === 'ru' ? 'Вопрос полностью закрыт / согласован' : 'Frage als vollständig geklärt markieren'}
            </label>
          </div>

          <div className="flex justify-end gap-2 pt-3 border-t border-slate-100">
            <button
              type="button"
              onClick={onClose}
              className="px-3.5 py-1.5 text-xs text-slate-600 hover:bg-slate-100 rounded-md transition-colors"
            >
              {getTranslation('cancel', language)}
            </button>
            <button
              type="submit"
              className="px-4 py-1.5 text-xs font-semibold bg-slate-900 hover:bg-slate-800 text-white rounded-md transition-colors shadow-xs"
            >
              {getTranslation('save', language)}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

// Finding Modal
interface FindingModalProps {
  initialFinding: ResearchFinding | null;
  topicId: TopicId;
  onClose: () => void;
  onSave: (f: ResearchFinding) => void;
}

const FindingModal: React.FC<FindingModalProps> = ({ initialFinding, topicId, onClose, onSave }) => {
  const [title, setTitle] = useState(initialFinding?.title || '');
  const [content, setContent] = useState(initialFinding?.content || '');
  const [status, setStatus] = useState<KnowledgeStatus>(initialFinding?.status || 'finding');
  const [sourceName, setSourceName] = useState(initialFinding?.sourceName || '');
  const [sourceUrl, setSourceUrl] = useState(initialFinding?.sourceUrl || '');
  const [targetTopicId, setTargetTopicId] = useState<TopicId>(initialFinding?.topicId || topicId);
  const [additionalTopicIds, setAdditionalTopicIds] = useState<TopicId[]>(initialFinding?.additionalTopicIds || []);

  const toggleAdditionalTopic = (t: TopicId) => {
    if (t === targetTopicId) return;
    setAdditionalTopicIds(prev => prev.includes(t) ? prev.filter(x => x !== t) : [...prev, t]);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !content.trim()) return;

    onSave({
      id: initialFinding?.id || `f-${Date.now()}`,
      topicId: targetTopicId,
      additionalTopicIds,
      title: title.trim(),
      content: content.trim(),
      origin: initialFinding?.origin || 'project_context',
      status,
      sourceName: sourceName.trim() || undefined,
      sourceUrl: sourceUrl.trim() || undefined,
      createdAt: initialFinding?.createdAt || new Date().toISOString(),
      updatedAt: new Date().toISOString()
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
      <div className="bg-white rounded-xl shadow-2xl border border-slate-200 w-full max-w-lg p-6">
        <h3 className="text-sm font-bold text-slate-900 mb-4">
          {initialFinding ? 'Erkenntnis bearbeiten' : 'Neue Erkenntnis hinzufügen'}
        </h3>
        <form onSubmit={handleSubmit} className="space-y-3">
          <div>
            <label className="block text-xs font-medium text-slate-700 mb-1">Titel der Erkenntnis</label>
            <input
              type="text"
              required
              value={title}
              onChange={e => setTitle(e.target.value)}
              className="w-full text-xs px-3 py-2 border border-slate-200 rounded-md focus:outline-none focus:ring-1 focus:ring-emerald-600"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-medium text-slate-700 mb-1">Status</label>
              <select
                value={status}
                onChange={e => setStatus(e.target.value as KnowledgeStatus)}
                className="w-full text-xs px-3 py-2 border border-slate-200 rounded-md focus:outline-none focus:ring-1 focus:ring-emerald-600 bg-white"
              >
                <option value="finding">Rechercheergebnis</option>
                <option value="confirmed">Bestätigt</option>
                <option value="recommendation">Empfehlung</option>
                <option value="open">Offen / ungeklärt</option>
                <option value="verify">Technisch zu verifizieren</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-700 mb-1">Hauptthema verschieben</label>
              <select
                value={targetTopicId}
                onChange={e => setTargetTopicId(e.target.value as TopicId)}
                className="w-full text-xs px-3 py-2 border border-slate-200 rounded-md focus:outline-none focus:ring-1 focus:ring-emerald-600 bg-white"
              >
                {TOPIC_ORDER.map(t => (
                  <option key={t} value={t}>{TOPIC_DEFINITIONS[t].sketchTitle}</option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-700 mb-1">Mit weiteren Themen verknüpfen</label>
            <div className="flex flex-wrap gap-1.5 pt-1">
              {TOPIC_ORDER.filter(t => t !== targetTopicId).map(t => (
                <button
                  type="button"
                  key={t}
                  onClick={() => toggleAdditionalTopic(t)}
                  className={`px-2 py-0.5 text-[11px] rounded transition-colors ${
                    additionalTopicIds.includes(t)
                      ? 'bg-slate-900 text-white font-medium'
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  {TOPIC_DEFINITIONS[t].sketchTitle}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-700 mb-1">Inhalt / Technische Ausführung</label>
            <textarea
              rows={4}
              required
              value={content}
              onChange={e => setContent(e.target.value)}
              className="w-full text-xs px-3 py-2 border border-slate-200 rounded-md focus:outline-none focus:ring-1 focus:ring-emerald-600"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-medium text-slate-700 mb-1">Quelle / Dokument</label>
              <input
                type="text"
                placeholder="z. B. AWS Whitepaper"
                value={sourceName}
                onChange={e => setSourceName(e.target.value)}
                className="w-full text-xs px-3 py-2 border border-slate-200 rounded-md focus:outline-none focus:ring-1 focus:ring-emerald-600"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-700 mb-1">Quellen-URL</label>
              <input
                type="url"
                placeholder="https://..."
                value={sourceUrl}
                onChange={e => setSourceUrl(e.target.value)}
                className="w-full text-xs px-3 py-2 border border-slate-200 rounded-md focus:outline-none focus:ring-1 focus:ring-emerald-600"
              />
            </div>
          </div>

          <div className="flex justify-end gap-2 pt-3 border-t border-slate-100">
            <button
              type="button"
              onClick={onClose}
              className="px-3 py-1.5 text-xs text-slate-600 hover:bg-slate-100 rounded-md"
            >
              Abbrechen
            </button>
            <button
              type="submit"
              className="px-4 py-1.5 text-xs font-medium bg-slate-900 text-white rounded-md hover:bg-slate-800"
            >
              Speichern
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

// Competitor Modal
interface CompetitorModalProps {
  initialCompetitor: CompetitorEntry | null;
  topicId: TopicId;
  onClose: () => void;
  onSave: (c: CompetitorEntry) => void;
}

const CompetitorModal: React.FC<CompetitorModalProps> = ({ initialCompetitor, topicId, onClose, onSave }) => {
  const [productName, setProductName] = useState(initialCompetitor?.productName || '');
  const [analyzedFeature, setAnalyzedFeature] = useState(initialCompetitor?.analyzedFeature || '');
  const [observedWorkflow, setObservedWorkflow] = useState(initialCompetitor?.observedWorkflow || '');
  const [sourceOrLink, setSourceOrLink] = useState(initialCompetitor?.sourceOrLink || '');
  const [keyTakeaway, setKeyTakeaway] = useState(initialCompetitor?.keyTakeaway || '');
  const [transferability, setTransferability] = useState(initialCompetitor?.transferability || '');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!productName.trim() || !analyzedFeature.trim()) return;

    onSave({
      id: initialCompetitor?.id || `c-${Date.now()}`,
      topicId,
      productName: productName.trim(),
      analyzedFeature: analyzedFeature.trim(),
      observedWorkflow: observedWorkflow.trim(),
      sourceOrLink: sourceOrLink.trim(),
      keyTakeaway: keyTakeaway.trim(),
      transferability: transferability.trim(),
      origin: initialCompetitor?.origin || 'competitor_research',
      status: initialCompetitor?.status || 'externally_unverified',
      createdAt: initialCompetitor?.createdAt || new Date().toISOString(),
      updatedAt: new Date().toISOString()
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
      <div className="bg-white rounded-xl shadow-2xl border border-slate-200 w-full max-w-lg p-6 max-h-[90vh] overflow-y-auto">
        <h3 className="text-sm font-bold text-slate-900 mb-4">
          {initialCompetitor ? 'Wettbewerbsanalyse bearbeiten' : 'Wettbewerbsprodukt erfassen'}
        </h3>
        <form onSubmit={handleSubmit} className="space-y-3">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-medium text-slate-700 mb-1">Produktname</label>
              <input
                type="text"
                required
                placeholder="z. B. 123erfasst / PlanRadar"
                value={productName}
                onChange={e => setProductName(e.target.value)}
                className="w-full text-xs px-3 py-2 border border-slate-200 rounded-md focus:outline-none focus:ring-1 focus:ring-emerald-600"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-700 mb-1">Untersuchte Funktion</label>
              <input
                type="text"
                required
                placeholder="z. B. GPS-Stempeluhr / Offline Sync"
                value={analyzedFeature}
                onChange={e => setAnalyzedFeature(e.target.value)}
                className="w-full text-xs px-3 py-2 border border-slate-200 rounded-md focus:outline-none focus:ring-1 focus:ring-emerald-600"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-700 mb-1">Beobachteter Ablauf</label>
            <textarea
              rows={3}
              required
              placeholder="Wie läuft der Prozess in diesem Produkt konkret ab?"
              value={observedWorkflow}
              onChange={e => setObservedWorkflow(e.target.value)}
              className="w-full text-xs px-3 py-2 border border-slate-200 rounded-md focus:outline-none focus:ring-1 focus:ring-emerald-600"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-700 mb-1">Was wir davon lernen können (Key Takeaway)</label>
            <textarea
              rows={2}
              required
              placeholder="Welche Vor- und Nachteile hat dieser Ansatz für uns?"
              value={keyTakeaway}
              onChange={e => setKeyTakeaway(e.target.value)}
              className="w-full text-xs px-3 py-2 border border-slate-200 rounded-md focus:outline-none focus:ring-1 focus:ring-emerald-600"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-700 mb-1">Übertragbarkeit auf unser Produkt</label>
            <textarea
              rows={2}
              required
              placeholder="Können oder sollten wir das adaptieren? Welcher Aufwand entsteht?"
              value={transferability}
              onChange={e => setTransferability(e.target.value)}
              className="w-full text-xs px-3 py-2 border border-slate-200 rounded-md focus:outline-none focus:ring-1 focus:ring-emerald-600"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-700 mb-1">Quelle oder Link</label>
            <input
              type="text"
              placeholder="https://... oder Handbuchseite"
              value={sourceOrLink}
              onChange={e => setSourceOrLink(e.target.value)}
              className="w-full text-xs px-3 py-2 border border-slate-200 rounded-md focus:outline-none focus:ring-1 focus:ring-emerald-600"
            />
          </div>

          <div className="flex justify-end gap-2 pt-3 border-t border-slate-100">
            <button
              type="button"
              onClick={onClose}
              className="px-3 py-1.5 text-xs text-slate-600 hover:bg-slate-100 rounded-md"
            >
              Abbrechen
            </button>
            <button
              type="submit"
              className="px-4 py-1.5 text-xs font-medium bg-slate-900 text-white rounded-md hover:bg-slate-800"
            >
              Speichern
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

// Recommendation Modal
interface RecommendationModalProps {
  initialRecommendation: ProductRecommendation | null;
  topicId: TopicId;
  onClose: () => void;
  onSave: (r: ProductRecommendation) => void;
}

const RecommendationModal: React.FC<RecommendationModalProps> = ({ initialRecommendation, topicId, onClose, onSave }) => {
  const [title, setTitle] = useState(initialRecommendation?.title || '');
  const [description, setDescription] = useState(initialRecommendation?.description || '');
  const [rationale, setRationale] = useState(initialRecommendation?.rationale || '');
  const [priority, setPriority] = useState<'low' | 'medium' | 'high'>(initialRecommendation?.priority || 'medium');
  const [status, setStatus] = useState<KnowledgeStatus>(initialRecommendation?.status || 'recommendation');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !description.trim()) return;

    onSave({
      id: initialRecommendation?.id || `r-${Date.now()}`,
      topicId,
      title: title.trim(),
      description: description.trim(),
      rationale: rationale.trim(),
      priority,
      origin: initialRecommendation?.origin || 'architecture_recommendation',
      status,
      createdAt: initialRecommendation?.createdAt || new Date().toISOString(),
      updatedAt: new Date().toISOString()
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
      <div className="bg-white rounded-xl shadow-2xl border border-slate-200 w-full max-w-lg p-6">
        <h3 className="text-sm font-bold text-slate-900 mb-4">
          {initialRecommendation ? 'Empfehlung bearbeiten' : 'Neue Empfehlung formulieren'}
        </h3>
        <form onSubmit={handleSubmit} className="space-y-3">
          <div>
            <label className="block text-xs font-medium text-slate-700 mb-1">Titel der Empfehlung</label>
            <input
              type="text"
              required
              value={title}
              onChange={e => setTitle(e.target.value)}
              className="w-full text-xs px-3 py-2 border border-slate-200 rounded-md focus:outline-none focus:ring-1 focus:ring-emerald-600"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-medium text-slate-700 mb-1">Priorität</label>
              <select
                value={priority}
                onChange={e => setPriority(e.target.value as any)}
                className="w-full text-xs px-3 py-2 border border-slate-200 rounded-md bg-white focus:outline-none focus:ring-1 focus:ring-emerald-600"
              >
                <option value="high">Hoch</option>
                <option value="medium">Mittel</option>
                <option value="low">Niedrig</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-700 mb-1">Status</label>
              <select
                value={status}
                onChange={e => setStatus(e.target.value as KnowledgeStatus)}
                className="w-full text-xs px-3 py-2 border border-slate-200 rounded-md bg-white focus:outline-none focus:ring-1 focus:ring-emerald-600"
              >
                <option value="recommendation">Empfehlung</option>
                <option value="confirmed">Bestätigt</option>
                <option value="open">Offen / ungeklärt</option>
                <option value="verify">Technisch zu verifizieren</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-700 mb-1">Lösungsvorschlag</label>
            <textarea
              rows={3}
              required
              value={description}
              onChange={e => setDescription(e.target.value)}
              className="w-full text-xs px-3 py-2 border border-slate-200 rounded-md focus:outline-none focus:ring-1 focus:ring-emerald-600"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-700 mb-1">Begründung</label>
            <textarea
              rows={2}
              value={rationale}
              onChange={e => setRationale(e.target.value)}
              className="w-full text-xs px-3 py-2 border border-slate-200 rounded-md focus:outline-none focus:ring-1 focus:ring-emerald-600"
            />
          </div>

          <div className="flex justify-end gap-2 pt-3 border-t border-slate-100">
            <button
              type="button"
              onClick={onClose}
              className="px-3 py-1.5 text-xs text-slate-600 hover:bg-slate-100 rounded-md"
            >
              Abbrechen
            </button>
            <button
              type="submit"
              className="px-4 py-1.5 text-xs font-medium bg-slate-900 text-white rounded-md hover:bg-slate-800"
            >
              Speichern
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

// Open Point Modal
interface OpenPointModalProps {
  initialPoint: OpenPoint | null;
  topicId: TopicId;
  onClose: () => void;
  onSave: (p: OpenPoint) => void;
}

const OpenPointModal: React.FC<OpenPointModalProps> = ({ initialPoint, topicId, onClose, onSave }) => {
  const [question, setQuestion] = useState(initialPoint?.question || '');
  const [clarifyWith, setClarifyWith] = useState<'senior' | 'customer' | 'team'>(initialPoint?.clarifyWith || 'senior');
  const [priority, setPriority] = useState<'low' | 'medium' | 'high'>(initialPoint?.priority || 'medium');
  const [resolutionNote, setResolutionNote] = useState(initialPoint?.resolutionNote || '');
  const [isResolved, setIsResolved] = useState(initialPoint?.isResolved || false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!question.trim()) return;

    onSave({
      id: initialPoint?.id || `op-${Date.now()}`,
      topicId,
      question: question.trim(),
      clarifyWith,
      priority,
      isResolved,
      origin: initialPoint?.origin || 'project_context',
      status: initialPoint?.status || 'open_decision',
      resolutionNote: resolutionNote.trim() || undefined,
      createdAt: initialPoint?.createdAt || new Date().toISOString(),
      updatedAt: new Date().toISOString()
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
      <div className="bg-white rounded-xl shadow-2xl border border-slate-200 w-full max-w-lg p-6">
        <h3 className="text-sm font-bold text-slate-900 mb-4">
          {initialPoint ? 'Klärungspunkt bearbeiten' : 'Neuen Klärungspunkt anlegen'}
        </h3>
        <form onSubmit={handleSubmit} className="space-y-3">
          <div>
            <label className="block text-xs font-medium text-slate-700 mb-1">Frage / Unklarheit</label>
            <input
              type="text"
              required
              value={question}
              onChange={e => setQuestion(e.target.value)}
              className="w-full text-xs px-3 py-2 border border-slate-200 rounded-md focus:outline-none focus:ring-1 focus:ring-emerald-600"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-medium text-slate-700 mb-1">Zu klären mit</label>
              <select
                value={clarifyWith}
                onChange={e => setClarifyWith(e.target.value as any)}
                className="w-full text-xs px-3 py-2 border border-slate-200 rounded-md bg-white focus:outline-none focus:ring-1 focus:ring-emerald-600"
              >
                <option value="senior">Senior Software Engineer</option>
                <option value="customer">Kunde / Fachbereich</option>
                <option value="team">Technisches Team</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-700 mb-1">Priorität</label>
              <select
                value={priority}
                onChange={e => setPriority(e.target.value as any)}
                className="w-full text-xs px-3 py-2 border border-slate-200 rounded-md bg-white focus:outline-none focus:ring-1 focus:ring-emerald-600"
              >
                <option value="high">Hoch</option>
                <option value="medium">Mittel</option>
                <option value="low">Niedrig</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-700 mb-1">Ergebnis / Klärungsnotiz</label>
            <textarea
              rows={3}
              value={resolutionNote}
              onChange={e => setResolutionNote(e.target.value)}
              placeholder="Falls bereits besprochen: Was war das Ergebnis?"
              className="w-full text-xs px-3 py-2 border border-slate-200 rounded-md focus:outline-none focus:ring-1 focus:ring-emerald-600"
            />
          </div>

          <div className="flex items-center gap-2 pt-1">
            <input
              type="checkbox"
              id="opResolved"
              checked={isResolved}
              onChange={e => setIsResolved(e.target.checked)}
              className="accent-emerald-600 rounded"
            />
            <label htmlFor="opResolved" className="text-xs text-slate-700">
              Punkt ist geklärt / gelöst
            </label>
          </div>

          <div className="flex justify-end gap-2 pt-3 border-t border-slate-100">
            <button
              type="button"
              onClick={onClose}
              className="px-3 py-1.5 text-xs text-slate-600 hover:bg-slate-100 rounded-md"
            >
              Abbrechen
            </button>
            <button
              type="submit"
              className="px-4 py-1.5 text-xs font-medium bg-slate-900 text-white rounded-md hover:bg-slate-800"
            >
              Speichern
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

// Decision Modal
interface DecisionModalProps {
  initialDecision: Decision | null;
  topicId: TopicId;
  onClose: () => void;
  onSave: (d: Decision) => void;
}

const DecisionModal: React.FC<DecisionModalProps> = ({ initialDecision, topicId, onClose, onSave }) => {
  const [title, setTitle] = useState(initialDecision?.title || '');
  const [date, setDate] = useState(initialDecision?.date || new Date().toISOString().split('T')[0]);
  const [rationale, setRationale] = useState(initialDecision?.rationale || '');
  const [responsiblePerson, setResponsiblePerson] = useState(initialDecision?.responsiblePerson || '');
  const [status, setStatus] = useState<'decided' | 'draft' | 'superseded'>(initialDecision?.status || 'decided');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !rationale.trim()) return;

    onSave({
      id: initialDecision?.id || `dec-${Date.now()}`,
      topicId,
      title: title.trim(),
      date,
      rationale: rationale.trim(),
      responsiblePerson: responsiblePerson.trim() || undefined,
      status,
      createdAt: initialDecision?.createdAt || new Date().toISOString(),
      updatedAt: new Date().toISOString()
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
      <div className="bg-white rounded-xl shadow-2xl border border-slate-200 w-full max-w-lg p-6">
        <h3 className="text-sm font-bold text-slate-900 mb-4">
          {initialDecision ? 'Entscheidung bearbeiten' : 'Entscheidung dokumentieren'}
        </h3>
        <form onSubmit={handleSubmit} className="space-y-3">
          <div>
            <label className="block text-xs font-medium text-slate-700 mb-1">Titel der Entscheidung</label>
            <input
              type="text"
              required
              value={title}
              onChange={e => setTitle(e.target.value)}
              className="w-full text-xs px-3 py-2 border border-slate-200 rounded-md focus:outline-none focus:ring-1 focus:ring-emerald-600"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-medium text-slate-700 mb-1">Datum</label>
              <input
                type="date"
                required
                value={date}
                onChange={e => setDate(e.target.value)}
                className="w-full text-xs px-3 py-2 border border-slate-200 rounded-md focus:outline-none focus:ring-1 focus:ring-emerald-600"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-700 mb-1">Verantwortliche(r)</label>
              <input
                type="text"
                placeholder="z. B. Senior Lead Architekt"
                value={responsiblePerson}
                onChange={e => setResponsiblePerson(e.target.value)}
                className="w-full text-xs px-3 py-2 border border-slate-200 rounded-md focus:outline-none focus:ring-1 focus:ring-emerald-600"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-700 mb-1">Begründung und Konsequenzen</label>
            <textarea
              rows={4}
              required
              placeholder="Warum wurde diese Entscheidung getroffen und welche Auswirkungen hat sie?"
              value={rationale}
              onChange={e => setRationale(e.target.value)}
              className="w-full text-xs px-3 py-2 border border-slate-200 rounded-md focus:outline-none focus:ring-1 focus:ring-emerald-600"
            />
          </div>

          <div className="flex justify-end gap-2 pt-3 border-t border-slate-100">
            <button
              type="button"
              onClick={onClose}
              className="px-3 py-1.5 text-xs text-slate-600 hover:bg-slate-100 rounded-md"
            >
              Abbrechen
            </button>
            <button
              type="submit"
              className="px-4 py-1.5 text-xs font-medium bg-slate-900 text-white rounded-md hover:bg-slate-800"
            >
              Speichern
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
