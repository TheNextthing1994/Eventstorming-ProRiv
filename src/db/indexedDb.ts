import {
  DatabaseState,
  TopicId,
  TopicContent,
  SeniorQuestion,
  ResearchFinding,
  CompetitorEntry,
  ProductRecommendation,
  OpenPoint,
  Decision,
  AttachmentItem,
  HotspotCoordinates,
  GlobalStats
} from '../types';
import { TOPIC_DEFINITIONS, generateInitialQuestions } from './defaultData';
import {
  SEED_VERSION,
  INITIAL_RESEARCH_FINDINGS,
  INITIAL_COMPETITORS,
  INITIAL_PRODUCT_RECOMMENDATIONS,
  INITIAL_OPEN_POINTS,
  INITIAL_DECISIONS
} from './knowledgeSeed';

const DB_NAME = 'arch_research_navigator_db';
const DB_VERSION = 1;

let dbPromise: Promise<IDBDatabase> | null = null;

function openDatabase(): Promise<IDBDatabase> {
  if (dbPromise) return dbPromise;

  dbPromise = new Promise((resolve, reject) => {
    if (!window.indexedDB) {
      reject(new Error('IndexedDB not supported in this environment'));
      return;
    }

    const request = window.indexedDB.open(DB_NAME, DB_VERSION);

    request.onupgradeneeded = (event) => {
      const db = (event.target as IDBOpenDBRequest).result;

      if (!db.objectStoreNames.contains('topics')) {
        db.createObjectStore('topics', { keyPath: 'id' });
      }
      if (!db.objectStoreNames.contains('questions')) {
        db.createObjectStore('questions', { keyPath: 'id' });
      }
      if (!db.objectStoreNames.contains('findings')) {
        db.createObjectStore('findings', { keyPath: 'id' });
      }
      if (!db.objectStoreNames.contains('competitors')) {
        db.createObjectStore('competitors', { keyPath: 'id' });
      }
      if (!db.objectStoreNames.contains('recommendations')) {
        db.createObjectStore('recommendations', { keyPath: 'id' });
      }
      if (!db.objectStoreNames.contains('openPoints')) {
        db.createObjectStore('openPoints', { keyPath: 'id' });
      }
      if (!db.objectStoreNames.contains('decisions')) {
        db.createObjectStore('decisions', { keyPath: 'id' });
      }
      if (!db.objectStoreNames.contains('attachments')) {
        db.createObjectStore('attachments', { keyPath: 'id' });
      }
      if (!db.objectStoreNames.contains('settings')) {
        db.createObjectStore('settings', { keyPath: 'key' });
      }
    };

    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });

  return dbPromise;
}

// Helpers for store transactions
async function getAllFromStore<T>(storeName: string): Promise<T[]> {
  try {
    const db = await openDatabase();
    return new Promise((resolve, reject) => {
      const tx = db.transaction(storeName, 'readonly');
      const store = tx.objectStore(storeName);
      const req = store.getAll();
      req.onsuccess = () => resolve(req.result || []);
      req.onerror = () => reject(req.error);
    });
  } catch (err) {
    console.warn(`IndexedDB getAll fallback for ${storeName}`, err);
    const local = localStorage.getItem(`db_${storeName}`);
    return local ? JSON.parse(local) : [];
  }
}

async function putToStore<T>(storeName: string, item: T): Promise<void> {
  try {
    const db = await openDatabase();
    await new Promise<void>((resolve, reject) => {
      const tx = db.transaction(storeName, 'readwrite');
      const store = tx.objectStore(storeName);
      const req = store.put(item);
      req.onsuccess = () => resolve();
      req.onerror = () => reject(req.error);
    });
  } catch (err) {
    console.warn(`IndexedDB put fallback for ${storeName}`, err);
    // sync to localStorage backup
    const current = await getAllFromStore<any>(storeName);
    const key = (item as any).id || (item as any).key;
    const filtered = current.filter(x => (x.id || x.key) !== key);
    filtered.push(item);
    localStorage.setItem(`db_${storeName}`, JSON.stringify(filtered));
  }
}

async function deleteFromStore(storeName: string, key: string): Promise<void> {
  try {
    const db = await openDatabase();
    await new Promise<void>((resolve, reject) => {
      const tx = db.transaction(storeName, 'readwrite');
      const store = tx.objectStore(storeName);
      const req = store.delete(key);
      req.onsuccess = () => resolve();
      req.onerror = () => reject(req.error);
    });
  } catch (err) {
    console.warn(`IndexedDB delete fallback for ${storeName}`, err);
    const current = await getAllFromStore<any>(storeName);
    const filtered = current.filter(x => (x.id || x.key) !== key);
    localStorage.setItem(`db_${storeName}`, JSON.stringify(filtered));
  }
}

async function clearStore(storeName: string): Promise<void> {
  try {
    const db = await openDatabase();
    await new Promise<void>((resolve, reject) => {
      const tx = db.transaction(storeName, 'readwrite');
      const store = tx.objectStore(storeName);
      const req = store.clear();
      req.onsuccess = () => resolve();
      req.onerror = () => reject(req.error);
    });
  } catch {
    localStorage.removeItem(`db_${storeName}`);
  }
}

/**
 * Initialize default state if stores are empty
 */
export async function initializeDatabase(): Promise<DatabaseState> {
  const settingsList = await getAllFromStore<{ key: string; value: any }>('settings');
  const seedSetting = settingsList.find(s => s.key === 'seed_version');
  const currentSeedVersion = seedSetting ? Number(seedSetting.value) : 0;

  // 1. Initialise baseline if completely empty
  const existingQuestions = await getAllFromStore<SeniorQuestion>('questions');
  if (existingQuestions.length === 0) {
    const initialQuestions = generateInitialQuestions();
    for (const q of initialQuestions) {
      await putToStore('questions', q);
    }

    const defaultHotspots: Record<TopicId, HotspotCoordinates> = {
      'mobile-app': TOPIC_DEFINITIONS['mobile-app'].defaultHotspot,
      'users': TOPIC_DEFINITIONS['users'].defaultHotspot,
      'clients': TOPIC_DEFINITIONS['clients'].defaultHotspot,
      'raport': TOPIC_DEFINITIONS['raport'].defaultHotspot,
      'vremya': TOPIC_DEFINITIONS['vremya'].defaultHotspot,
      'api': TOPIC_DEFINITIONS['api'].defaultHotspot,
    };
    await putToStore('settings', { key: 'hotspots', value: defaultHotspots });
  }

  // 2. Versioned Seed Upgrade: populate project findings, competitors, recommendations, decisions, open points
  if (currentSeedVersion < SEED_VERSION) {
    const [
      currentFindings,
      currentCompetitors,
      currentRecs,
      currentPoints,
      currentDecs,
      currentTopics
    ] = await Promise.all([
      getAllFromStore<ResearchFinding>('findings'),
      getAllFromStore<CompetitorEntry>('competitors'),
      getAllFromStore<ProductRecommendation>('recommendations'),
      getAllFromStore<OpenPoint>('openPoints'),
      getAllFromStore<Decision>('decisions'),
      getAllFromStore<TopicContent>('topics')
    ]);

    const findingMap = new Map(currentFindings.map(f => [f.id, f]));
    for (const item of INITIAL_RESEARCH_FINDINGS) {
      const existing = findingMap.get(item.id);
      if (!existing) {
        await putToStore('findings', item);
      } else {
        await putToStore('findings', {
          ...existing,
          titleRu: item.titleRu || existing.titleRu,
          contentRu: item.contentRu || existing.contentRu
        });
      }
    }

    const compMap = new Map(currentCompetitors.map(c => [c.id, c]));
    for (const item of INITIAL_COMPETITORS) {
      const existing = compMap.get(item.id);
      if (!existing) {
        await putToStore('competitors', item);
      } else {
        await putToStore('competitors', {
          ...existing,
          analyzedFeatureRu: item.analyzedFeatureRu || existing.analyzedFeatureRu,
          investigationGoalRu: item.investigationGoalRu || existing.investigationGoalRu,
          observedWorkflowRu: item.observedWorkflowRu || existing.observedWorkflowRu,
          keyTakeawayRu: item.keyTakeawayRu || existing.keyTakeawayRu,
          disadvantagesRu: item.disadvantagesRu || existing.disadvantagesRu,
          transferabilityRu: item.transferabilityRu || existing.transferabilityRu
        });
      }
    }

    const recMap = new Map(currentRecs.map(r => [r.id, r]));
    for (const item of INITIAL_PRODUCT_RECOMMENDATIONS) {
      const existing = recMap.get(item.id);
      if (!existing) {
        await putToStore('recommendations', item);
      } else {
        await putToStore('recommendations', {
          ...existing,
          titleRu: item.titleRu || existing.titleRu,
          descriptionRu: item.descriptionRu || existing.descriptionRu,
          rationaleRu: item.rationaleRu || existing.rationaleRu
        });
      }
    }

    const pointMap = new Map(currentPoints.map(p => [p.id, p]));
    for (const item of INITIAL_OPEN_POINTS) {
      const existing = pointMap.get(item.id);
      if (!existing) {
        await putToStore('openPoints', item);
      } else {
        await putToStore('openPoints', {
          ...existing,
          questionRu: item.questionRu || existing.questionRu
        });
      }
    }

    const decMap = new Map(currentDecs.map(d => [d.id, d]));
    // Old research seed mistakenly marked three unapproved architecture proposals
    // as decided. Correct ONLY untouched copies of those original seed records.
    // User-edited, genuinely agreed or newer records must never be downgraded.
    const originalDecisionTexts: Record<string, string> = {
      'dec-1': 'WorkSession (Anwesenheit/Stempeln), TimesheetEntry (Abrechnungsstunden)',
      'dec-2': 'Verbindliche Festlegung auf React Native, AWS Cognito und AWS S3',
      'dec-3': 'Fachliche Freigaben in ISA sind unabhängig'
    };
    for (const item of INITIAL_DECISIONS) {
      const existing = decMap.get(item.id);
      if (!existing) {
        await putToStore('decisions', item);
      } else {
        const isUntouchedOldSeed = currentSeedVersion < 6
          && existing.status === 'decided'
          && existing.updatedAt === '2026-10-08T00:00:00Z'
          && Boolean(originalDecisionTexts[item.id])
          && existing.rationale.startsWith(originalDecisionTexts[item.id]);
        if (isUntouchedOldSeed) {
          await putToStore('decisions', {
            ...existing,
            title: item.title,
            titleRu: item.titleRu,
            rationale: item.rationale,
            rationaleRu: item.rationaleRu,
            status: 'draft',
            decisionStatus: item.decisionStatus
          });
        } else {
          // Existing conversation or manual changes win over new research seeds.
          await putToStore('decisions', existing);
        }
      }
    }

    // Upgrade existing questions so that Feld 1 (answer) and Feld 2 (clientQuestion) and needsClientClarification are populated
    const initialQuestions = generateInitialQuestions();
    const initQMap = new Map(initialQuestions.map(q => [q.id, q]));
    for (const q of existingQuestions) {
      const seedQ = initQMap.get(q.id);
      if (seedQ) {
        await putToStore('questions', {
          ...q,
          answer: q.answer || seedQ.answer,
          answerRu: q.answerRu || seedQ.answerRu,
          clientQuestion: q.clientQuestion || seedQ.clientQuestion,
          clientQuestionRu: q.clientQuestionRu || seedQ.clientQuestionRu,
          needsClientClarification: q.needsClientClarification !== undefined ? q.needsClientClarification : seedQ.needsClientClarification,
          questionRu: q.questionRu || seedQ.questionRu,
          germanTranslation: q.germanTranslation || seedQ.germanTranslation,
          russianTranslation: q.russianTranslation || seedQ.russianTranslation
        });
      }
    }

    // Initialize topic summaries from senior briefings if empty
    const now = new Date().toISOString();
    const topicMap = new Map(currentTopics.map(t => [t.id, t]));
    for (const topicId of Object.keys(TOPIC_DEFINITIONS) as TopicId[]) {
      const existing = topicMap.get(topicId);
      if (!existing || !existing.summary) {
        await putToStore('topics', {
          id: topicId,
          summary: TOPIC_DEFINITIONS[topicId].briefing.findingsSummary,
          updatedAt: now
        });
      }
    }

    await putToStore('settings', { key: 'seed_version', value: SEED_VERSION });
  }

  return loadEntireDatabase();
}

/**
 * Load the complete state
 */
export async function loadEntireDatabase(): Promise<DatabaseState> {
  const [
    rawTopics,
    questions,
    findings,
    competitors,
    recommendations,
    openPoints,
    decisions,
    attachments,
    settingsList
  ] = await Promise.all([
    getAllFromStore<TopicContent>('topics'),
    getAllFromStore<SeniorQuestion>('questions'),
    getAllFromStore<ResearchFinding>('findings'),
    getAllFromStore<CompetitorEntry>('competitors'),
    getAllFromStore<ProductRecommendation>('recommendations'),
    getAllFromStore<OpenPoint>('openPoints'),
    getAllFromStore<Decision>('decisions'),
    getAllFromStore<AttachmentItem>('attachments'),
    getAllFromStore<{ key: string; value: any }>('settings')
  ]);

  const topicsMap: Record<TopicId, TopicContent> = {
    'mobile-app': { id: 'mobile-app', summary: '', updatedAt: '' },
    'users': { id: 'users', summary: '', updatedAt: '' },
    'clients': { id: 'clients', summary: '', updatedAt: '' },
    'raport': { id: 'raport', summary: '', updatedAt: '' },
    'vremya': { id: 'vremya', summary: '', updatedAt: '' },
    'api': { id: 'api', summary: '', updatedAt: '' }
  };

  rawTopics.forEach(t => {
    if (t.id && topicsMap[t.id]) {
      topicsMap[t.id] = t;
    }
  });

  const hotspotSetting = settingsList.find(s => s.key === 'hotspots');
  const hotspots: Record<TopicId, HotspotCoordinates> = hotspotSetting?.value || {
    'mobile-app': TOPIC_DEFINITIONS['mobile-app'].defaultHotspot,
    'users': TOPIC_DEFINITIONS['users'].defaultHotspot,
    'clients': TOPIC_DEFINITIONS['clients'].defaultHotspot,
    'raport': TOPIC_DEFINITIONS['raport'].defaultHotspot,
    'vremya': TOPIC_DEFINITIONS['vremya'].defaultHotspot,
    'api': TOPIC_DEFINITIONS['api'].defaultHotspot,
  };

  const customImgSetting = settingsList.find(s => s.key === 'custom_image');

  return {
    topics: topicsMap,
    questions,
    findings,
    competitors,
    recommendations,
    openPoints,
    decisions,
    attachments,
    hotspotSettings: hotspots,
    customImage: customImgSetting?.value,
    workshopNotes: settingsList.find(item => item.key === 'senior_workshop_notes_v1')?.value || {}
  };
}

// Topic summary
export async function saveTopicSummary(id: TopicId, summary: string): Promise<void> {
  const content: TopicContent = {
    id,
    summary,
    updatedAt: new Date().toISOString()
  };
  await putToStore('topics', content);
}

// Question CRUD
export async function saveQuestion(question: SeniorQuestion): Promise<void> {
  await putToStore('questions', question);
}

export async function deleteQuestion(id: string): Promise<void> {
  await deleteFromStore('questions', id);
}

// Finding CRUD
export async function saveFinding(finding: ResearchFinding): Promise<void> {
  await putToStore('findings', finding);
}

export async function deleteFinding(id: string): Promise<void> {
  await deleteFromStore('findings', id);
}

// Competitor CRUD
export async function saveCompetitor(entry: CompetitorEntry): Promise<void> {
  await putToStore('competitors', entry);
}

export async function deleteCompetitor(id: string): Promise<void> {
  await deleteFromStore('competitors', id);
}

// Recommendation CRUD
export async function saveRecommendation(rec: ProductRecommendation): Promise<void> {
  await putToStore('recommendations', rec);
}

export async function deleteRecommendation(id: string): Promise<void> {
  await deleteFromStore('recommendations', id);
}

// Open Point CRUD
export async function saveOpenPoint(point: OpenPoint): Promise<void> {
  await putToStore('openPoints', point);
}

export async function deleteOpenPoint(id: string): Promise<void> {
  await deleteFromStore('openPoints', id);
}

// Decision CRUD
export async function saveDecision(dec: Decision): Promise<void> {
  await putToStore('decisions', dec);
}

export async function deleteDecision(id: string): Promise<void> {
  await deleteFromStore('decisions', id);
}

// Attachment CRUD
export async function saveAttachment(att: AttachmentItem): Promise<void> {
  await putToStore('attachments', att);
}

export async function deleteAttachment(id: string): Promise<void> {
  await deleteFromStore('attachments', id);
}

// Hotspots calibration
export async function saveHotspots(coords: Record<TopicId, HotspotCoordinates>): Promise<void> {
  await putToStore('settings', { key: 'hotspots', value: coords });
}

export async function resetHotspotsToDefault(): Promise<Record<TopicId, HotspotCoordinates>> {
  const defaultHotspots: Record<TopicId, HotspotCoordinates> = {
    'mobile-app': TOPIC_DEFINITIONS['mobile-app'].defaultHotspot,
    'users': TOPIC_DEFINITIONS['users'].defaultHotspot,
    'clients': TOPIC_DEFINITIONS['clients'].defaultHotspot,
    'raport': TOPIC_DEFINITIONS['raport'].defaultHotspot,
    'vremya': TOPIC_DEFINITIONS['vremya'].defaultHotspot,
    'api': TOPIC_DEFINITIONS['api'].defaultHotspot,
  };
  await putToStore('settings', { key: 'hotspots', value: defaultHotspots });
  return defaultHotspots;
}

// Custom Image persistence
export async function saveCustomImage(dataUrl: string): Promise<void> {
  await putToStore('settings', { key: 'custom_image', value: dataUrl });
}

export async function removeCustomImage(): Promise<void> {
  await deleteFromStore('settings', 'custom_image');
}

/**
 * Calculate Global Statistics accurately from live data
 */
export function calculateGlobalStats(state: DatabaseState): GlobalStats {
  const totalQuestions = state.questions.length;
  const resolvedQuestions = state.questions.filter(q => q.isResolved).length;
  const openQuestionsCount = totalQuestions - resolvedQuestions;

  const totalOpenPoints = state.openPoints.length;
  const unresolvedOpenPoints = state.openPoints.filter(p => !p.isResolved).length;

  const totalFindings = state.findings.length;
  const totalCompetitors = state.competitors.length;
  const totalRecommendations = state.recommendations.length;
  const totalDecisions = state.decisions.length;

  const topicBreakdown: GlobalStats['topicBreakdown'] = {
    'mobile-app': { questionsTotal: 0, questionsResolved: 0, findingsCount: 0, competitorCount: 0, recommendationsCount: 0, decisionsCount: 0, openPointsCount: 0 },
    'users': { questionsTotal: 0, questionsResolved: 0, findingsCount: 0, competitorCount: 0, recommendationsCount: 0, decisionsCount: 0, openPointsCount: 0 },
    'clients': { questionsTotal: 0, questionsResolved: 0, findingsCount: 0, competitorCount: 0, recommendationsCount: 0, decisionsCount: 0, openPointsCount: 0 },
    'raport': { questionsTotal: 0, questionsResolved: 0, findingsCount: 0, competitorCount: 0, recommendationsCount: 0, decisionsCount: 0, openPointsCount: 0 },
    'vremya': { questionsTotal: 0, questionsResolved: 0, findingsCount: 0, competitorCount: 0, recommendationsCount: 0, decisionsCount: 0, openPointsCount: 0 },
    'api': { questionsTotal: 0, questionsResolved: 0, findingsCount: 0, competitorCount: 0, recommendationsCount: 0, decisionsCount: 0, openPointsCount: 0 }
  };

  const getTopicsForItem = (item: { topicId: TopicId; additionalTopicIds?: TopicId[] }): TopicId[] => {
    const list = [item.topicId];
    if (item.additionalTopicIds) {
      item.additionalTopicIds.forEach(t => {
        if (!list.includes(t)) list.push(t);
      });
    }
    return list;
  };

  state.questions.forEach(q => {
    if (topicBreakdown[q.topicId]) {
      topicBreakdown[q.topicId].questionsTotal++;
      if (q.isResolved) topicBreakdown[q.topicId].questionsResolved++;
    }
  });

  state.findings.forEach(f => {
    getTopicsForItem(f).forEach(t => {
      if (topicBreakdown[t]) topicBreakdown[t].findingsCount++;
    });
  });

  state.competitors.forEach(c => {
    getTopicsForItem(c).forEach(t => {
      if (topicBreakdown[t]) topicBreakdown[t].competitorCount++;
    });
  });

  state.recommendations.forEach(r => {
    getTopicsForItem(r).forEach(t => {
      if (topicBreakdown[t]) topicBreakdown[t].recommendationsCount++;
    });
  });

  state.decisions.forEach(d => {
    getTopicsForItem(d).forEach(t => {
      if (topicBreakdown[t]) topicBreakdown[t].decisionsCount++;
    });
  });

  state.openPoints.forEach(p => {
    getTopicsForItem(p).forEach(t => {
      if (topicBreakdown[t]) topicBreakdown[t].openPointsCount++;
    });
  });

  const clientQuestionsCount = state.questions.filter(q => q.needsClientClarification || !!q.clientQuestion).length;
  const unresolvedClientQuestionsCount = state.questions.filter(q => (q.needsClientClarification || !!q.clientQuestion) && !q.isResolved).length;

  return {
    totalQuestions,
    resolvedQuestions,
    openQuestionsCount,
    clientQuestionsCount,
    unresolvedClientQuestionsCount,
    totalOpenPoints,
    unresolvedOpenPoints,
    totalFindings,
    totalCompetitors,
    totalRecommendations,
    totalDecisions,
    topicBreakdown
  };
}

/**
 * Export complete state as clean JSON
 */
export async function exportStateAsJson(): Promise<string> {
  const state = await loadEntireDatabase();
  return JSON.stringify(state, null, 2);
}

/**
 * Export complete state as readable Markdown document for the Senior
 */
export async function exportStateAsMarkdown(): Promise<string> {
  const state = await loadEntireDatabase();
  const stats = calculateGlobalStats(state);
  const dateStr = new Date().toLocaleDateString('de-DE', { day: '2-digit', month: '2-digit', year: 'numeric' });

  let md = `# Architecture & Research Platform – Statusbericht\n`;
  md += `**Erstellt am:** ${dateStr}\n\n`;
  md += `## 1. Executive Summary & Statusüberblick\n\n`;
  md += `- **Erfasste Fragen:** ${stats.totalQuestions} (davon beantwortet: ${stats.resolvedQuestions}, offen: ${stats.openQuestionsCount})\n`;
  md += `- **Fragen an Klienten (Isa) für den Senior:** ${stats.clientQuestionsCount} (davon ungelöst: ${stats.unresolvedClientQuestionsCount})\n`;
  md += `- **Offene Klärungspunkte:** ${stats.totalOpenPoints} (davon ungelöst: ${stats.unresolvedOpenPoints})\n`;
  md += `- **Gesammelte Erkenntnisse:** ${stats.totalFindings}\n`;
  md += `- **Wettbewerbsanalysen:** ${stats.totalCompetitors}\n`;
  md += `- **Empfehlungen für unser Produkt:** ${stats.totalRecommendations}\n`;
  md += `- **Dokumentierte Architekturentscheidungen:** ${stats.totalDecisions}\n\n`;
  md += `---\n\n`;

  const topicOrder: TopicId[] = ['mobile-app', 'users', 'raport', 'vremya', 'clients', 'api'];

  for (const topicId of topicOrder) {
    const meta = TOPIC_DEFINITIONS[topicId];
    const topicQuestions = state.questions.filter(q => q.topicId === topicId);
    const topicFindings = state.findings.filter(f => f.topicId === topicId || f.additionalTopicIds?.includes(topicId));
    const topicCompetitors = state.competitors.filter(c => c.topicId === topicId || c.additionalTopicIds?.includes(topicId));
    const topicRecs = state.recommendations.filter(r => r.topicId === topicId || r.additionalTopicIds?.includes(topicId));
    const topicDecs = state.decisions.filter(d => d.topicId === topicId || d.additionalTopicIds?.includes(topicId));
    const topicOpenPoints = state.openPoints.filter(p => p.topicId === topicId || p.additionalTopicIds?.includes(topicId));
    const summary = state.topics[topicId]?.summary || '';

    md += `## Thema: ${meta.sketchTitle} – ${meta.germanTitle}\n\n`;
    if (summary) {
      md += `### Übersicht\n${summary}\n\n`;
    }

    // Questions
    md += `### Fragen des Seniors (${topicQuestions.length})\n\n`;
    if (topicQuestions.length === 0) {
      md += `*Keine Fragen hinterlegt.*\n\n`;
    } else {
      topicQuestions.forEach(q => {
        const status = q.isResolved ? '✅ Geklärt' : '⏳ Offen';
        md += `- **[${status}] ${q.question}**\n`;
        if (q.germanTranslation && q.germanTranslation !== q.question) {
          md += `  *Bedeutung:* ${q.germanTranslation}\n`;
        }
        if (q.answer) {
          md += `  *1. Unser Vorschlag:* ${q.answer}\n`;
        }
        if (q.clientQuestion) {
          md += `  *2. ⚠️ FRAGE AN KLIENTEN (ISA):* ${q.clientQuestion}\n`;
        }
      });
      md += `\n`;
    }

    // Findings
    md += `### Gesammelte Erkenntnisse (${topicFindings.length})\n\n`;
    if (topicFindings.length === 0) {
      md += `*Keine Erkenntnisse erfasst.*\n\n`;
    } else {
      topicFindings.forEach(f => {
        md += `#### ${f.title} [Status: ${f.status}]\n`;
        md += `${f.content}\n`;
        if (f.sourceName || f.sourceUrl) {
          md += `*Quelle:* ${f.sourceName || ''} ${f.sourceUrl ? `(${f.sourceUrl})` : ''}\n`;
        }
        md += `\n`;
      });
    }

    // Competitor
    md += `### Wettbewerbsrecherche (${topicCompetitors.length})\n\n`;
    if (topicCompetitors.length === 0) {
      md += `*Keine Wettbewerbsanalysen erfasst.*\n\n`;
    } else {
      topicCompetitors.forEach(c => {
        md += `#### Produkt: ${c.productName} – ${c.analyzedFeature}\n`;
        md += `- **Beobachteter Ablauf:** ${c.observedWorkflow}\n`;
        md += `- **Was wir lernen können:** ${c.keyTakeaway}\n`;
        md += `- **Übertragbarkeit auf unser Produkt:** ${c.transferability}\n`;
        if (c.sourceOrLink) md += `- **Quelle / Referenz:** ${c.sourceOrLink}\n`;
        md += `\n`;
      });
    }

    // Recommendations
    md += `### Empfehlungen für unser Produkt (${topicRecs.length})\n\n`;
    if (topicRecs.length === 0) {
      md += `*Keine Empfehlungen hinterlegt.*\n\n`;
    } else {
      topicRecs.forEach(r => {
        md += `#### ${r.title} (Priorität: ${r.priority.toUpperCase()}, Status: ${r.status})\n`;
        md += `${r.description}\n`;
        if (r.rationale) md += `*Begründung:* ${r.rationale}\n`;
        md += `\n`;
      });
    }

    // Decisions
    md += `### Getroffene Entscheidungen (${topicDecs.length})\n\n`;
    if (topicDecs.length === 0) {
      md += `*Keine Entscheidungen dokumentiert.*\n\n`;
    } else {
      topicDecs.forEach(d => {
        md += `#### ${d.title} (Datum: ${d.date}, Status: ${d.status})\n`;
        md += `${d.rationale}\n`;
        if (d.responsiblePerson) md += `*Verantwortlich:* ${d.responsiblePerson}\n`;
        md += `\n`;
      });
    }

    // Open points
    md += `### Offene Punkte mit Senior / Kunde (${topicOpenPoints.length})\n\n`;
    if (topicOpenPoints.length === 0) {
      md += `*Keine offenen Punkte verzeichnet.*\n\n`;
    } else {
      topicOpenPoints.forEach(p => {
        const stateStr = p.isResolved ? '✅ Gelöst' : '⏳ Offen';
        md += `- **[${stateStr}] ${p.question}** (Klärung mit: ${p.clarifyWith}, Priorität: ${p.priority})\n`;
        if (p.resolutionNote) md += `  *Ergebnis:* ${p.resolutionNote}\n`;
      });
      md += `\n`;
    }

    md += `---\n\n`;
  }

  return md;
}

/**
 * Import state from parsed JSON
 */
export async function importFromJson(jsonString: string): Promise<boolean> {
  try {
    const data = JSON.parse(jsonString) as DatabaseState;
    if (!data.questions || !data.topics) {
      throw new Error('Ungültiges Datenformat: questions oder topics fehlen');
    }

    // Clear and restore
    await clearStore('topics');
    await clearStore('questions');
    await clearStore('findings');
    await clearStore('competitors');
    await clearStore('recommendations');
    await clearStore('openPoints');
    await clearStore('decisions');
    await clearStore('attachments');

    for (const t of Object.values(data.topics)) await putToStore('topics', t);
    for (const q of data.questions || []) await putToStore('questions', q);
    for (const f of data.findings || []) await putToStore('findings', f);
    for (const c of data.competitors || []) await putToStore('competitors', c);
    for (const r of data.recommendations || []) await putToStore('recommendations', r);
    for (const o of data.openPoints || []) await putToStore('openPoints', o);
    for (const d of data.decisions || []) await putToStore('decisions', d);
    for (const a of data.attachments || []) await putToStore('attachments', a);

    if (data.hotspotSettings) {
      await putToStore('settings', { key: 'hotspots', value: data.hotspotSettings });
    }
    if (data.customImage) {
      await putToStore('settings', { key: 'custom_image', value: data.customImage });
    }
    if (data.workshopNotes && typeof data.workshopNotes === 'object') {
      await putToStore('settings', { key: 'senior_workshop_notes_v1', value: data.workshopNotes });
    }

    return true;
  } catch (err) {
    console.error('Import failed', err);
    return false;
  }
}


/**
 * Workshop notes belong to the current browser (IndexedDB settings store).
 * They are deliberately separate from the seed, so future content upgrades
 * never overwrite what was agreed during the senior meeting.
 */
export interface WorkshopNote {
  status: 'open' | 'test' | 'decided';
  /** Current working interpretation; never overwrites the source interview seed. */
  revisedCustomerFact?: string;
  /** Editable working proposal; never overwrites the original proposal. */
  revisedRecommendation?: string;
  answer: string;
  owner: string;
  nextStep: string;
  updatedAt: string;
}
export type WorkshopNotes = Record<string, WorkshopNote>;

export async function loadWorkshopNotes(): Promise<WorkshopNotes> {
  const items = await getAllFromStore<{ key: string; value: WorkshopNotes }>('settings');
  return items.find(item => item.key === 'senior_workshop_notes_v1')?.value || {};
}

export async function saveWorkshopNotes(notes: WorkshopNotes): Promise<void> {
  await putToStore('settings', { key: 'senior_workshop_notes_v1', value: notes });
}
