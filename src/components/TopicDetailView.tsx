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
  AttachmentItem
} from '../types';
import { TOPIC_DEFINITIONS, TOPIC_ORDER } from '../db/defaultData';
import { StatusBadge, STATUS_CONFIG } from './StatusBadge';
import { AttachmentViewer } from './AttachmentViewer';
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
  onNavigateHome: () => void;
  onSelectTopic: (topicId: TopicId) => void;
  onRefreshData: () => Promise<void>;
}

type ActiveSection = 'all' | 'summary' | 'questions' | 'findings' | 'competitors' | 'recommendations' | 'open_points' | 'decisions' | 'attachments';

export const TopicDetailView: React.FC<TopicDetailViewProps> = ({
  topicId,
  databaseState,
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

  const topicQuestions = databaseState.questions.filter(q => q.topicId === topicId);
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
              <span>Zurück zur Originalskizze</span>
            </button>
            <span className="text-slate-300">/</span>
            <div className="flex items-center gap-1.5 text-xs">
              <span className="font-bold text-slate-900 tracking-tight">{meta.sketchTitle}</span>
              <span className="text-slate-500 hidden sm:inline">({meta.germanTitle})</span>
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
                  title={`${tMeta.sketchTitle} – ${tMeta.germanTitle}`}
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
                  {meta.colorType === 'green' ? 'Zentraler Architekturbereich (Grün)' : 'Fachbereich der Skizze (Rot)'}
                </span>
              </div>
              <h1 className="text-2xl font-bold tracking-tight text-slate-900">
                {meta.sketchTitle}
              </h1>
              <h2 className="text-sm font-medium text-slate-600 mt-0.5">
                {meta.germanTitle}
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
                <div className="text-slate-400 text-[10px]">FRAGEN</div>
                <div className="font-semibold text-slate-800">
                  {topicQuestions.filter(q => q.isResolved).length}/{topicQuestions.length} gelöst
                </div>
              </div>
              <div className="border-r border-slate-200 h-6" />
              <div>
                <div className="text-slate-400 text-[10px]">ERKENNTNISSE</div>
                <div className="font-semibold text-slate-800">{topicFindings.length}</div>
              </div>
              <div className="border-r border-slate-200 h-6" />
              <div>
                <div className="text-slate-400 text-[10px]">WETTBEWERB</div>
                <div className="font-semibold text-slate-800">{topicCompetitors.length}</div>
              </div>
              <div className="border-r border-slate-200 h-6" />
              <div>
                <div className="text-slate-400 text-[10px]">ENTSCHEIDUNGEN</div>
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
              Alle Bereiche
            </button>
            <button
              onClick={() => setActiveSection('summary')}
              className={`px-3 py-1.5 rounded-md font-medium transition-colors whitespace-nowrap ${
                activeSection === 'summary'
                  ? 'bg-slate-900 text-white'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              A. Übersicht
            </button>
            <button
              onClick={() => setActiveSection('questions')}
              className={`px-3 py-1.5 rounded-md font-medium transition-colors whitespace-nowrap ${
                activeSection === 'questions'
                  ? 'bg-slate-900 text-white'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              B. Fragen des Seniors ({topicQuestions.length})
            </button>
            <button
              onClick={() => setActiveSection('findings')}
              className={`px-3 py-1.5 rounded-md font-medium transition-colors whitespace-nowrap ${
                activeSection === 'findings'
                  ? 'bg-slate-900 text-white'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              C. Erkenntnisse ({topicFindings.length})
            </button>
            <button
              onClick={() => setActiveSection('competitors')}
              className={`px-3 py-1.5 rounded-md font-medium transition-colors whitespace-nowrap ${
                activeSection === 'competitors'
                  ? 'bg-slate-900 text-white'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              D. Wettbewerb ({topicCompetitors.length})
            </button>
            <button
              onClick={() => setActiveSection('recommendations')}
              className={`px-3 py-1.5 rounded-md font-medium transition-colors whitespace-nowrap ${
                activeSection === 'recommendations'
                  ? 'bg-slate-900 text-white'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              E. Empfehlungen ({topicRecs.length})
            </button>
            <button
              onClick={() => setActiveSection('open_points')}
              className={`px-3 py-1.5 rounded-md font-medium transition-colors whitespace-nowrap ${
                activeSection === 'open_points'
                  ? 'bg-slate-900 text-white'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              F. Offene Punkte ({topicOpenPoints.length})
            </button>
            <button
              onClick={() => setActiveSection('decisions')}
              className={`px-3 py-1.5 rounded-md font-medium transition-colors whitespace-nowrap ${
                activeSection === 'decisions'
                  ? 'bg-slate-900 text-white'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              G. Entscheidungen ({topicDecisions.length})
            </button>
            <button
              onClick={() => setActiveSection('attachments')}
              className={`px-3 py-1.5 rounded-md font-medium transition-colors whitespace-nowrap ${
                activeSection === 'attachments'
                  ? 'bg-slate-900 text-white'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              H. Quellen & Anhänge
            </button>
          </div>
        </div>

        {/* COMPACT SENIOR BRIEFING (5-Punkte-Sofortübersicht) */}
        {meta.briefing && (
          <div className="bg-slate-900 text-white rounded-xl p-5 shadow-sm border border-slate-800 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-2">
              <span className="text-xs font-mono uppercase tracking-wider text-emerald-400 font-bold">
                Senior-Briefing: Das Wichtigste auf einen Blick
              </span>
              <span className="text-[11px] font-mono text-slate-400">
                Bereich: {meta.sketchTitle}
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-3 text-xs">
              <div className="p-3 bg-slate-800/80 rounded-lg border border-slate-700/80 space-y-1">
                <span className="text-[10px] font-mono text-slate-400 uppercase block font-semibold">
                  1. Was hat der Senior gefragt?
                </span>
                <p className="text-slate-200 leading-snug font-medium">
                  {meta.briefing.seniorAsked}
                </p>
              </div>

              <div className="p-3 bg-slate-800/80 rounded-lg border border-slate-700/80 space-y-1">
                <span className="text-[10px] font-mono text-sky-400 uppercase block font-semibold">
                  2. Bisher herausgefunden
                </span>
                <p className="text-slate-200 leading-snug">
                  {meta.briefing.findingsSummary}
                </p>
              </div>

              <div className="p-3 bg-slate-800/80 rounded-lg border border-slate-700/80 space-y-1">
                <span className="text-[10px] font-mono text-amber-400 uppercase block font-semibold">
                  3. Andere Programme
                </span>
                <p className="text-slate-200 leading-snug">
                  {meta.briefing.competitorSummary}
                </p>
              </div>

              <div className="p-3 bg-slate-800/80 rounded-lg border border-slate-700/80 space-y-1">
                <span className="text-[10px] font-mono text-emerald-400 uppercase block font-semibold">
                  4. Empfehlung für ISA
                </span>
                <p className="text-emerald-100 leading-snug font-medium">
                  {meta.briefing.recommendationSummary}
                </p>
              </div>

              <div className="p-3 bg-slate-800/80 rounded-lg border border-slate-700/80 space-y-1">
                <span className="text-[10px] font-mono text-rose-400 uppercase block font-semibold">
                  5. Noch zu klären
                </span>
                <p className="text-rose-200 leading-snug">
                  {meta.briefing.openSummary}
                </p>
              </div>
            </div>
          </div>
        )}

        {/* DOMAIN SPECIFIC VISUALIZER */}
        {topicId === 'users' && <RoleMatrixVisualizer />}
        {topicId === 'clients' && <EntityHierarchyVisualizer />}
        {topicId === 'raport' && <WorkReportPreviewVisualizer />}
        {topicId === 'vremya' && <TimeTripleDivisionVisualizer />}
        {topicId === 'api' && <ApiArchitectureVisualizer />}
        {topicId === 'mobile-app' && <MobileTechStackVisualizer />}

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
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div>
                <h3 className="text-sm font-bold text-slate-900 tracking-tight">
                  B. Fragen des Seniors
                </h3>
                <p className="text-xs text-slate-500">
                  Die konkreten Fragestellungen aus der Originalskizze. Jede Frage kann beantwortet und als geklärt markiert werden.
                </p>
              </div>

              <button
                onClick={() => setIsNewQuestionModal(true)}
                className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium bg-slate-900 hover:bg-slate-800 text-white rounded-md transition-colors shadow-xs"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Frage hinzufügen</span>
              </button>
            </div>

            <div className="space-y-3">
              {topicQuestions.map((q) => (
                <div
                  key={q.id}
                  className={`p-4 rounded-lg border transition-all ${
                    q.isResolved
                      ? 'bg-emerald-50/20 border-emerald-200/70'
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
                        title={q.isResolved ? 'Als offen markieren' : 'Als geklärt markieren'}
                      >
                        <CheckCircle2 className={`w-4 h-4 ${q.isResolved ? 'fill-emerald-600 text-white' : ''}`} />
                      </button>

                      <div>
                        <div className="flex items-center gap-2">
                          <span className={`text-xs font-bold tracking-tight ${q.isResolved ? 'text-slate-800' : 'text-slate-900'}`}>
                            {q.question}
                          </span>
                          {q.originalFromSketch && (
                            <span className="text-[10px] text-slate-500 bg-slate-100 px-1.5 py-0.2 rounded font-mono">
                              Original aus Skizze
                            </span>
                          )}
                        </div>

                        {q.germanTranslation && q.germanTranslation !== q.question && (
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
                        title="Antwort erfassen / bearbeiten"
                      >
                        <Pencil className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => handleDeleteQuestion(q.id)}
                        className="p-1 text-slate-400 hover:text-rose-600 rounded transition-colors"
                        title="Frage löschen"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>

                  {/* Answer display */}
                  {q.answer ? (
                    <div className="mt-3 ml-7 p-3 bg-slate-50 rounded-lg border border-slate-100 text-xs text-slate-800 leading-relaxed whitespace-pre-wrap">
                      <div className="font-semibold text-slate-700 text-[11px] mb-1">
                        Antwort / Recherche-Ergebnis:
                      </div>
                      {q.answer}
                    </div>
                  ) : (
                    <div className="mt-2 ml-7">
                      <button
                        onClick={() => setEditingQuestion(q)}
                        className="text-[11px] text-emerald-800 hover:text-emerald-950 font-medium inline-flex items-center gap-1"
                      >
                        <span>+ Antwort jetzt erfassen</span>
                      </button>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </section>
        )}

        {/* SECTION C: GESAMMELTE ERKENNTNISSE */}
        {(activeSection === 'all' || activeSection === 'findings') && (
          <section className="bg-white rounded-xl border border-slate-200/90 p-6 shadow-xs space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div>
                <h3 className="text-sm font-bold text-slate-900 tracking-tight">
                  C. Gesammelte Erkenntnisse
                </h3>
                <p className="text-xs text-slate-500">
                  Rechercheergebnisse, technische Beobachtungen und verifizierte Fakten.
                </p>
              </div>

              <button
                onClick={() => setIsNewFindingModal(true)}
                className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium bg-slate-900 hover:bg-slate-800 text-white rounded-md transition-colors shadow-xs"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Erkenntnis hinzufügen</span>
              </button>
            </div>

            {topicFindings.length === 0 ? (
              <div className="p-8 text-center bg-slate-50/50 rounded-xl border border-dashed border-slate-200">
                <Lightbulb className="w-8 h-8 text-slate-300 mx-auto mb-2" />
                <h4 className="text-xs font-semibold text-slate-700">Noch keine Erkenntnisse hinterlegt</h4>
                <p className="text-xs text-slate-500 max-w-sm mx-auto mt-1">
                  Hier trägst du technische Fakten, Best-Practices und Ergebnisse aus Artikeln, Dokumentationen oder Tests ein.
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
                          <StatusBadge status={f.status} origin={f.origin} showOrigin />
                          {f.additionalTopicIds && f.additionalTopicIds.length > 0 && (
                            <span className="text-[10px] text-slate-400 font-mono">
                              · Verknüpft mit {f.additionalTopicIds.map(t => TOPIC_DEFINITIONS[t]?.sketchTitle).join(', ')}
                            </span>
                          )}
                        </div>
                        <h4 className="text-xs font-bold text-slate-900">{f.title}</h4>
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
                      {f.content}
                    </p>

                    {(f.sourceName || f.sourceUrl) && (
                      <div className="mt-3 pt-2 border-t border-slate-100 flex items-center gap-2 text-[11px] text-slate-500">
                        <span className="font-medium">Quelle:</span>
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
                  D. Wettbewerbsrecherche (Competitor Benchmarking)
                </h3>
                <p className="text-xs text-slate-500">
                  Dokumentation anderer Softwareprodukte, Abläufe, Learnings und Übertragbarkeit.
                </p>
              </div>

              <button
                onClick={() => setIsNewCompetitorModal(true)}
                className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium bg-slate-900 hover:bg-slate-800 text-white rounded-md transition-colors shadow-xs"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Wettbewerber analysieren</span>
              </button>
            </div>

            {topicCompetitors.length === 0 ? (
              <div className="p-8 text-center bg-slate-50/50 rounded-xl border border-dashed border-slate-200">
                <Building2 className="w-8 h-8 text-slate-300 mx-auto mb-2" />
                <h4 className="text-xs font-semibold text-slate-700">Noch keine Wettbewerbsprodukte erfasst</h4>
                <p className="text-xs text-slate-500 max-w-sm mx-auto mt-1">
                  Trage z. B. Produkte wie 123erfasst, BauMaster, Craftnote, PlanRadar oder SAP ein und dokumentiere deren Workflow.
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
                            Produkt
                          </div>
                          <h4 className="text-sm font-bold text-slate-900">
                            {c.productName}
                          </h4>
                          <div className="text-xs font-medium text-slate-600 mt-0.5">
                            Funktion: {c.analyzedFeature}
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
                          <span className="font-semibold text-slate-800 block">Beobachteter Ablauf:</span>
                          <p className="leading-relaxed text-slate-600 mt-0.5">{c.observedWorkflow}</p>
                        </div>

                        <div>
                          <span className="font-semibold text-slate-800 block">Was wir davon lernen können:</span>
                          <p className="leading-relaxed text-emerald-900 bg-emerald-50/50 p-2 rounded mt-0.5 border border-emerald-100">
                            {c.keyTakeaway}
                          </p>
                        </div>

                        <div>
                          <span className="font-semibold text-slate-800 block">Übertragbarkeit auf unser Produkt:</span>
                          <p className="leading-relaxed text-slate-600 mt-0.5">{c.transferability}</p>
                        </div>
                      </div>
                    </div>

                    {c.sourceOrLink && (
                      <div className="mt-3 pt-2 border-t border-slate-100 text-[11px] text-slate-500">
                        <span className="font-medium">Quelle / Demo: </span>
                        {c.sourceOrLink.startsWith('http') ? (
                          <a
                            href={c.sourceOrLink}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-emerald-700 hover:underline inline-flex items-center gap-0.5"
                          >
                            <span>Link öffnen</span>
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
                  E. Empfehlungen für unser Produkt
                </h3>
                <p className="text-xs text-slate-500">
                  Konkrete Architektur- und Lösungsvorschläge für das Projektteam.
                </p>
              </div>

              <button
                onClick={() => setIsNewRecommendationModal(true)}
                className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium bg-slate-900 hover:bg-slate-800 text-white rounded-md transition-colors shadow-xs"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Empfehlung hinzufügen</span>
              </button>
            </div>

            {topicRecs.length === 0 ? (
              <div className="p-8 text-center bg-slate-50/50 rounded-xl border border-dashed border-slate-200">
                <Lightbulb className="w-8 h-8 text-slate-300 mx-auto mb-2" />
                <h4 className="text-xs font-semibold text-slate-700">Noch keine Empfehlungen formuliert</h4>
                <p className="text-xs text-slate-500 max-w-sm mx-auto mt-1">
                  Hier dokumentierst du eigene Lösungsvorschläge für den Senior Software Engineer zur Diskussion.
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
                          <StatusBadge status={r.status} origin={r.origin} showOrigin />
                          <span className="text-slate-300">·</span>
                          <span className="font-mono text-[11px] text-slate-500">
                            Priorität: {r.priority.toUpperCase()}
                          </span>
                        </div>
                        <h4 className="text-xs font-bold text-slate-900">{r.title}</h4>
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
                      {r.description}
                    </p>

                    {r.rationale && (
                      <div className="mt-2 text-xs text-slate-600 bg-slate-50 p-2.5 rounded border border-slate-100">
                        <span className="font-semibold text-slate-700">Begründung: </span>
                        {r.rationale}
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
                  F. Offene Punkte (Klärungsbedarf)
                </h3>
                <p className="text-xs text-slate-500">
                  Fragen, die noch mit dem Senior, dem Kunden oder dem Team geklärt werden müssen.
                </p>
              </div>

              <button
                onClick={() => setIsNewOpenPointModal(true)}
                className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium bg-slate-900 hover:bg-slate-800 text-white rounded-md transition-colors shadow-xs"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Punkt hinzufügen</span>
              </button>
            </div>

            {topicOpenPoints.length === 0 ? (
              <div className="p-8 text-center bg-slate-50/50 rounded-xl border border-dashed border-slate-200">
                <AlertCircle className="w-8 h-8 text-slate-300 mx-auto mb-2" />
                <h4 className="text-xs font-semibold text-slate-700">Keine offenen Klärungspunkte</h4>
                <p className="text-xs text-slate-500 max-w-sm mx-auto mt-1">
                  Alle Aspekte dieses Themas sind entweder vorläufig geklärt oder warten auf Recherche.
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
                            <span className="font-bold text-slate-900">{p.question}</span>
                            <span className="text-[10px] px-1.5 py-0.5 rounded font-mono bg-slate-100 text-slate-600">
                              Klärung mit: {p.clarifyWith.toUpperCase()}
                            </span>
                          </div>

                          {p.resolutionNote && (
                            <div className="text-xs text-slate-600 mt-2 bg-slate-100/70 p-2 rounded">
                              <span className="font-semibold text-slate-700">Ergebnis: </span>
                              {p.resolutionNote}
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
                  G. Getroffene Architekturentscheidungen
                </h3>
                <p className="text-xs text-slate-500">
                  Verbindliche Beschlüsse mit Datum, Begründung und Verantwortlichem.
                </p>
              </div>

              <button
                onClick={() => setIsNewDecisionModal(true)}
                className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium bg-slate-900 hover:bg-slate-800 text-white rounded-md transition-colors shadow-xs"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Entscheidung dokumentieren</span>
              </button>
            </div>

            {topicDecisions.length === 0 ? (
              <div className="p-8 text-center bg-slate-50/50 rounded-xl border border-dashed border-slate-200">
                <FileCheck2 className="w-8 h-8 text-slate-300 mx-auto mb-2" />
                <h4 className="text-xs font-semibold text-slate-700">Noch keine Entscheidungen festgehalten</h4>
                <p className="text-xs text-slate-500 max-w-sm mx-auto mt-1">
                  Sobald im Meeting mit dem Senior eine Entscheidung getroffen wird, trage sie hier verbindlich ein.
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
                            {d.status === 'decided' ? 'Beschlossen' : d.status === 'draft' ? 'Entwurf' : 'Abgelöst'}
                          </span>
                          <span className="font-mono text-slate-400 text-[11px]">
                            Datum: {d.date}
                          </span>
                          {d.responsiblePerson && (
                            <span className="text-slate-500 text-[11px]">
                              · Verantwortlich: {d.responsiblePerson}
                            </span>
                          )}
                        </div>
                        <h4 className="text-xs font-bold text-slate-900">{d.title}</h4>
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
                      <span className="font-semibold text-slate-800 block mb-1">Begründung & Tragweite:</span>
                      {d.rationale}
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
                H. Quellen, Notizen & Dateianhänge
              </h3>
              <p className="text-xs text-slate-500">
                Screenshots, Architektur-Diagramme, PDF-Dateien und Weblinks – persistent im Browser gespeichert.
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
  onClose: () => void;
  onSave: (q: SeniorQuestion) => void;
}

const QuestionModal: React.FC<QuestionModalProps> = ({ initialQuestion, topicId, onClose, onSave }) => {
  const [question, setQuestion] = useState(initialQuestion?.question || '');
  const [germanTranslation, setGermanTranslation] = useState(initialQuestion?.germanTranslation || '');
  const [answer, setAnswer] = useState(initialQuestion?.answer || '');
  const [isResolved, setIsResolved] = useState(initialQuestion?.isResolved || false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!question.trim()) return;

    onSave({
      id: initialQuestion?.id || `q-${Date.now()}`,
      topicId,
      question: question.trim(),
      germanTranslation: germanTranslation.trim() || undefined,
      answer: answer.trim() || undefined,
      isResolved,
      originalFromSketch: initialQuestion?.originalFromSketch || false,
      createdAt: initialQuestion?.createdAt || new Date().toISOString(),
      updatedAt: new Date().toISOString()
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
      <div className="bg-white rounded-xl shadow-2xl border border-slate-200 w-full max-w-lg p-6">
        <h3 className="text-sm font-bold text-slate-900 mb-4">
          {initialQuestion ? 'Frage des Seniors bearbeiten' : 'Neue Frage erfassen'}
        </h3>
        <form onSubmit={handleSubmit} className="space-y-3">
          <div>
            <label className="block text-xs font-medium text-slate-700 mb-1">Frage</label>
            <input
              type="text"
              required
              value={question}
              onChange={e => setQuestion(e.target.value)}
              className="w-full text-xs px-3 py-2 border border-slate-200 rounded-md focus:outline-none focus:ring-1 focus:ring-emerald-600"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-700 mb-1">Deutsche Übersetzung / Kontext</label>
            <input
              type="text"
              value={germanTranslation}
              onChange={e => setGermanTranslation(e.target.value)}
              className="w-full text-xs px-3 py-2 border border-slate-200 rounded-md focus:outline-none focus:ring-1 focus:ring-emerald-600"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-700 mb-1">Antwort / Klärung</label>
            <textarea
              rows={4}
              value={answer}
              onChange={e => setAnswer(e.target.value)}
              placeholder="Antwort oder Ergebnis der Recherche..."
              className="w-full text-xs px-3 py-2 border border-slate-200 rounded-md focus:outline-none focus:ring-1 focus:ring-emerald-600"
            />
          </div>

          <div className="flex items-center gap-2 pt-1">
            <input
              type="checkbox"
              id="isResolved"
              checked={isResolved}
              onChange={e => setIsResolved(e.target.checked)}
              className="accent-emerald-600 rounded"
            />
            <label htmlFor="isResolved" className="text-xs text-slate-700">
              Frage als geklärt markieren
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
