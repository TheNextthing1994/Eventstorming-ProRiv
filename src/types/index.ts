/**
 * Type definitions for ISA Architecture & Research Platform
 * Developed for ProRiv AS (Betonsäge- & Kernbohrarbeiten)
 */

export type TopicId = 'users' | 'clients' | 'raport' | 'vremya' | 'api' | 'mobile-app';

export type Language = 'de' | 'ru' | 'bilingual';

/**
 * A. Herkunft (Origin) – Pflichtfeld zur Nachvollziehbarkeit
 */
export type KnowledgeOrigin =
  | 'sketch'                      // Originalskizze des Seniors
  | 'project_context'            // Bisherige Projektinformationen
  | 'event_storming'             // Event-Storming-Entwurf
  | 'competitor_research'        // Wettbewerbsrecherche
  | 'architecture_recommendation'; // Eigene Architektur-/Produkt-Empfehlung

/**
 * B. Erkenntnisstatus (Knowledge status) – Pflichtfeld zur Abgrenzung
 */
export type KnowledgeStatus =
  | 'project_known'          // Bekannt aus dem Projektkontext (Achtung: nicht automatisch freigegeben!)
  | 'recommended'            // Empfohlen (Architektur-/Produktvorschlag)
  | 'open_decision'          // Offen – fachlich zu entscheiden
  | 'technical_verify'       // Technisch zu verifizieren (PoC / API-Test erforderlich)
  | 'externally_unverified'  // Extern noch nicht belegt (keine überprüfbare Quelle vorhanden)
  // Legacy compatibility fallbacks:
  | 'confirmed'
  | 'finding'
  | 'recommendation'
  | 'open'
  | 'verify';

export interface HotspotCoordinates {
  x: number;      // percentage 0 - 100
  y: number;      // percentage 0 - 100
  radius: number; // percentage 0 - 100
}

export interface SeniorBriefing {
  seniorAsked: string;       // 1. Was hat der Senior gefragt?
  findingsSummary: string;   // 2. Was haben wir bisher herausgefunden?
  competitorSummary: string; // 3. Was machen andere Programme?
  recommendationSummary: string; // 4. Was empfehlen wir für ISA?
  openSummary: string;       // 5. Was ist noch offen?
}

export interface TopicMeta {
  id: TopicId;
  sketchTitle: string;
  sketchSubtitle?: string;
  germanTitle: string;
  russianTitle: string;
  shortDescription: string;
  russianDescription?: string;
  colorType: 'green' | 'red';
  defaultHotspot: HotspotCoordinates;
  sketchQuestions: string[];
  briefing: SeniorBriefing;
  briefingRu?: SeniorBriefing;
}

export interface TopicContent {
  id: TopicId;
  summary: string;
  summaryRu?: string;
  updatedAt: string;
}

export interface SeniorQuestion {
  id: string;
  topicId: TopicId;
  question: string;
  questionRu?: string;
  originalFromSketch?: boolean;
  germanTranslation?: string;
  russianTranslation?: string;
  // Feld 1: Unser Vorschlag / Technische Empfehlung
  answer?: string;
  answerRu?: string;
  // Feld 2: Frage an den Klienten (Isa) / Rückfragebedarf beim Kunden
  clientQuestion?: string;
  clientQuestionRu?: string;
  needsClientClarification?: boolean;
  isResolved: boolean;
  origin?: KnowledgeOrigin;
  status?: KnowledgeStatus;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

export interface ResearchFinding {
  id: string;
  topicId: TopicId;
  additionalTopicIds?: TopicId[];
  title: string;
  titleRu?: string;
  content: string;
  contentRu?: string;
  origin: KnowledgeOrigin;
  status: KnowledgeStatus;
  sourceUrl?: string;
  sourceName?: string;
  createdAt: string;
  updatedAt: string;
}

export interface CompetitorEntry {
  id: string;
  topicId: TopicId;
  additionalTopicIds?: TopicId[];
  productName: string;
  analyzedFeature: string;
  analyzedFeatureRu?: string;
  investigationGoal?: string;   // Welche Frage wollten wir beantworten?
  investigationGoalRu?: string;
  observedWorkflow: string;     // Wie funktioniert der konkrete Benutzerablauf?
  observedWorkflowRu?: string;
  keyTakeaway: string;          // Was könnten wir übernehmen?
  keyTakeawayRu?: string;
  disadvantages?: string;       // Welche Nachteile gibt es?
  disadvantagesRu?: string;
  sourceOrLink?: string;        // Quelle (leer lassen falls unbelegt)
  transferability: string;      // Übertragbarkeit auf ISA
  transferabilityRu?: string;
  origin: KnowledgeOrigin;
  status: KnowledgeStatus;
  createdAt: string;
  updatedAt: string;
}

export interface ProductRecommendation {
  id: string;
  topicId: TopicId;
  additionalTopicIds?: TopicId[];
  title: string;
  titleRu?: string;
  description: string;
  descriptionRu?: string;
  rationale: string;
  rationaleRu?: string;
  origin: KnowledgeOrigin;
  status: KnowledgeStatus;
  priority: 'low' | 'medium' | 'high';
  createdAt: string;
  updatedAt: string;
}

export interface OpenPoint {
  id: string;
  topicId: TopicId;
  additionalTopicIds?: TopicId[];
  question: string;
  questionRu?: string;
  clarifyWith: 'senior' | 'customer' | 'team';
  priority: 'low' | 'medium' | 'high';
  isResolved: boolean;
  resolutionNote?: string;
  resolutionNoteRu?: string;
  origin: KnowledgeOrigin;
  status: KnowledgeStatus;
  createdAt: string;
  updatedAt: string;
}

export interface Decision {
  id: string;
  topicId: TopicId;
  additionalTopicIds?: TopicId[];
  title: string;
  titleRu?: string;
  date: string;
  rationale: string;
  rationaleRu?: string;
  responsiblePerson?: string;
  status: 'draft' | 'decided' | 'superseded';
  decisionStatus?: KnowledgeStatus;
  origin?: KnowledgeOrigin;
  createdAt: string;
  updatedAt: string;
}

export interface SeniorDecisionItem {
  id: string;
  number: number;
  question: string;
  questionRu?: string;
  responsiblePerson: string;
  priority: 'high' | 'medium' | 'low';
  status: 'offen' | 'in_diskussion' | 'entschieden';
  currentProposal: string;
  currentProposalRu?: string;
  rationale: string;
  rationaleRu?: string;
  date: string;
  connectedTopics: TopicId[];
}

export interface DomainEventItem {
  id: string;
  name: string;
  category: 'Session & Zeit' | 'Rapport & Aufmaß' | 'Preis & Kunde' | 'ERP & Tripletex';
  categoryRu?: string;
  description: string;
  descriptionRu?: string;
  command: string;
  aggregate: string;
  readModel: string;
  policyOrRule: string;
  policyOrRuleRu?: string;
  externalSystem?: string;
  openDecision?: string;
  openDecisionRu?: string;
}

export interface AttachmentItem {
  id: string;
  topicId: TopicId;
  title: string;
  type: 'link' | 'note' | 'file';
  url?: string;
  fileData?: string;
  fileName?: string;
  fileSize?: number;
  mimeType?: string;
  notes?: string;
  createdAt: string;
}

export interface DatabaseState {
  topics: Record<TopicId, TopicContent>;
  questions: SeniorQuestion[];
  findings: ResearchFinding[];
  competitors: CompetitorEntry[];
  recommendations: ProductRecommendation[];
  openPoints: OpenPoint[];
  decisions: Decision[];
  attachments: AttachmentItem[];
  hotspotSettings: Record<TopicId, HotspotCoordinates>;
  customImage?: string;
}

export interface GlobalStats {
  totalQuestions: number;
  resolvedQuestions: number;
  openQuestionsCount: number;
  clientQuestionsCount?: number;
  unresolvedClientQuestionsCount?: number;
  totalOpenPoints: number;
  unresolvedOpenPoints: number;
  totalFindings: number;
  totalCompetitors: number;
  totalRecommendations: number;
  totalDecisions: number;
  topicBreakdown: Record<TopicId, {
    questionsTotal: number;
    questionsResolved: number;
    findingsCount: number;
    competitorCount: number;
    recommendationsCount: number;
    decisionsCount: number;
    openPointsCount: number;
  }>;
}
