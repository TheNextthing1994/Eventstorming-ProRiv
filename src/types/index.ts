/**
 * Type definitions for ISA Architecture & Research Platform
 * Developed for ProRiv AS (Betonsäge- & Kernbohrarbeiten)
 */

export type TopicId = 'users' | 'clients' | 'raport' | 'vremya' | 'api' | 'mobile-app';

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
  shortDescription: string;
  colorType: 'green' | 'red';
  defaultHotspot: HotspotCoordinates;
  sketchQuestions: string[];
  briefing: SeniorBriefing;
}

export interface TopicContent {
  id: TopicId;
  summary: string;
  updatedAt: string;
}

export interface SeniorQuestion {
  id: string;
  topicId: TopicId;
  question: string;
  originalFromSketch?: boolean;
  germanTranslation?: string;
  answer?: string;
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
  content: string;
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
  investigationGoal?: string;   // Welche Frage wollten wir beantworten?
  observedWorkflow: string;     // Wie funktioniert der konkrete Benutzerablauf?
  keyTakeaway: string;          // Was könnten wir übernehmen?
  disadvantages?: string;       // Welche Nachteile gibt es?
  sourceOrLink?: string;        // Quelle (leer lassen falls unbelegt)
  transferability: string;      // Übertragbarkeit auf ISA
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
  description: string;
  rationale: string;
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
  clarifyWith: 'senior' | 'customer' | 'team';
  priority: 'low' | 'medium' | 'high';
  isResolved: boolean;
  resolutionNote?: string;
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
  date: string;
  rationale: string;
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
  responsiblePerson: string;
  priority: 'high' | 'medium' | 'low';
  status: 'offen' | 'in_diskussion' | 'entschieden';
  currentProposal: string;
  rationale: string;
  date: string;
  connectedTopics: TopicId[];
}

export interface DomainEventItem {
  id: string;
  name: string;
  category: 'Session & Zeit' | 'Rapport & Aufmaß' | 'Preis & Kunde' | 'ERP & Tripletex';
  description: string;
  command: string;
  aggregate: string;
  readModel: string;
  policyOrRule: string;
  externalSystem?: string;
  openDecision?: string;
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
