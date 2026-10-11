import { ADMIN_JOURNEY_STEPS, ROLE_JOURNEYS, journeyQuestionKey, type JourneyRoleId, type LocalizedText } from './roleJourneys';
import { ROLE_INTERACTIONS, interactionSource, type RoleInteraction } from './roleInteractions';
import { WORKSHOP_STEPS } from './workshopContent';
import type { WorkshopNote } from '../db/indexedDb';

export type RoleBranchId = 'rights' | 'duties' | 'flow' | 'handoffs' | 'questions';
export type RoleKnowledgeState = 'evidenced' | 'proposal' | 'open';
export interface RoleKnowledgeItem {
  id: string;
  title: LocalizedText;
  text: LocalizedText;
  state: RoleKnowledgeState;
  source: string;
  question?: LocalizedText;
  context?: LocalizedText;
  proposal?: LocalizedText;
  noteKey?: string;
  interactionId?: string;
  processStepId?: string;
  adminStepId?: string;
}

const l = (de: string, ru: string): LocalizedText => ({ de, ru });
const teamSource = 'docs/TEAM_ENTWURF_ROLLEN_RAPPORT_2026-10-09.md · Teamvorschlag';

// These are views of the existing sources, never new permissions.
// In particular, the disputed dispatch route must not inherit a green
// interview fact from the older process view.
function fact(id: string): RoleKnowledgeItem {
  const step = WORKSHOP_STEPS.find(item => item.id === id)!;
  return {
    id: 'process-fact:' + id, title: l(step.title, step.titleRu),
    text: l(step.customerFact, step.customerFactRu),
    state: id === 'send' ? 'open' : 'evidenced',
    source: step.source + ' · ' + step.evidence,
    processStepId: id,
    ...(id === 'send' ? {
      text: l('Direkter Versand und Vorarbeiterfreigabe stehen als unterschiedliche Varianten in den Quellen. Isa muss den Versandweg festlegen.', 'В источниках есть два варианта: прямая отправка и согласование прорабом. Путь рапорта должен определить Иса.'),
      source: step.source + ' · ' + teamSource + ' · Nutzerkorrektur 11.10.2026'
    } : {})
  };
}

function relation(id: string, roleId: JourneyRoleId): RoleKnowledgeItem {
  const item = ROLE_INTERACTIONS.find(entry => entry.id === id)!;
  const source = interactionSource(item);
  const action = item.beats.filter(beat => beat.actor === roleId).map(beat => beat.action);
  return {
    id: 'role-action:' + roleId + ':' + id, title: item.title,
    text: l(action.map(text => text.de).join(' '), action.map(text => text.ru).join(' ')),
    state: 'proposal', source: source.adminStep?.source || source.processStep?.source || teamSource,
    interactionId: id
  };
}

function adminQuestion(stepId: string, questionId: string, proposal?: LocalizedText): RoleKnowledgeItem {
  const step = ADMIN_JOURNEY_STEPS.find(item => item.id === stepId)!;
  const question = step.questions.find(item => item.id === questionId)!;
  const existingProposal = proposal || (question.provenance === 'team' ? question.previousAnswer : undefined);
  return {
    id: journeyQuestionKey('admin', step.id, question.id),
    noteKey: journeyQuestionKey('admin', step.id, question.id),
    title: step.title, text: question.text, question: question.text,
    context: question.previousAnswer, proposal: existingProposal,
    state: existingProposal ? 'proposal' : 'open', source: step.source,
    adminStepId: step.id
  };
}

export function roleRights(roleId: JourneyRoleId): RoleKnowledgeItem[] {
  if (roleId === 'worker') return [
    fact('time'), fact('work'),
    adminQuestion('profile', 'worker-rights'),
    adminQuestion('prices', 'missing-price'),
    adminQuestion('correction', 'time-editor'),
    adminQuestion('report-policy', 'sender')
  ];
  if (roleId === 'foreman') return [
    fact('approval'),
    adminQuestion('assignment', 'assignment-owner'),
    adminQuestion('assignment', 'report-owner'),
    adminQuestion('report-policy', 'sender'),
    adminQuestion('correction', 'time-editor')
  ];
  return [
    adminQuestion('invite', 'inviter'),
    adminQuestion('profile', 'worker-rights'),
    adminQuestion('site', 'site-owner'),
    adminQuestion('assignment', 'assignment-owner'),
    adminQuestion('prices', 'price-owner'),
    adminQuestion('access', 'first-admin')
  ];
}

function adminFlow(): RoleKnowledgeItem[] {
  return ADMIN_JOURNEY_STEPS.map(step => ({
    id: 'admin-action:' + step.id, title: step.title, text: step.action,
    state: 'proposal', source: step.source, adminStepId: step.id
  }));
}

export function roleDuties(roleId: JourneyRoleId): RoleKnowledgeItem[] {
  if (roleId === 'admin') return adminFlow();
  if (roleId === 'foreman') return [
    fact('approval'), relation('site-handover', 'foreman'),
    relation('team-assignment', 'foreman'), relation('exceptions', 'foreman'),
    relation('time-correction', 'foreman'), relation('site-closure', 'foreman')
  ];
  return [
    relation('permissions', 'worker'), fact('time'), fact('work'),
    relation('time-correction', 'worker'), fact('send')
  ];
}

export function roleFlow(roleId: JourneyRoleId): RoleKnowledgeItem[] {
  if (roleId === 'admin') return adminFlow();
  if (roleId === 'foreman') return [
    {
      id: 'foreman-access', title: l('Zugang annehmen', 'Принять приглашение'),
      text: l('Unser Vorschlag: Einladung öffnen, Profil ergänzen und die zugewiesenen Baustellen und Rechte prüfen.', 'Наше предложение: открыть приглашение, заполнить профиль и проверить назначенные объекты и права.'),
      state: 'proposal', source: teamSource + ' · Rollenkarte 12.10.2026', adminStepId: 'invite'
    },
    relation('site-handover', roleId), relation('team-assignment', roleId),
    relation('rapport-handover', roleId), fact('approval'),
    relation('time-correction', roleId), fact('accounting'),
    relation('site-closure', roleId)
  ];
  return [
    relation('invitation', roleId), relation('permissions', roleId),
    relation('team-assignment', roleId), fact('arrival'), fact('time'),
    fact('work'), fact('pricing'), fact('send'), fact('customer'),
    fact('export'),
    {
      id: 'worker-closure', title: l('Abschluss und Übergabe', 'Завершение и передача'),
      text: l('Unser Vorschlag: Offene Zeiten, Fotos und Rapporte vor Baustellenwechsel oder Austritt mit der zuständigen Person klären.', 'Наше предложение: перед сменой объекта или увольнением уточнить незавершённые записи времени, фото и рапорты с ответственным.'),
      state: 'proposal', source: teamSource + ' · Rollenkarte 12.10.2026', adminStepId: 'closure'
    }
  ];
}

export function roleQuestions(roleId: JourneyRoleId): RoleKnowledgeItem[] {
  const ownRole = ROLE_JOURNEYS.find(item => item.id === roleId)!;
  const relations = ROLE_INTERACTIONS.filter(item => item.participants.includes(roleId));
  const adminIds = roleId === 'admin'
    ? ADMIN_JOURNEY_STEPS.map(step => step.id)
    : [...new Set(['invite', 'profile', ...relations.map(item => item.adminStepId).filter((id): id is string => !!id)])];
  const items = ADMIN_JOURNEY_STEPS.filter(step => adminIds.includes(step.id))
    .flatMap(step => step.questions.map(question => adminQuestion(step.id, question.id)));
  for (const id of ownRole.processStepIds) {
    const step = WORKSHOP_STEPS.find(item => item.id === id)!;
    items.push({
      id: 'process-question:' + id, noteKey: id,
      title: l(step.title, step.titleRu),
      text: l(step.openQuestion, step.openQuestionRu),
      question: l(step.openQuestion, step.openQuestionRu),
      context: l(step.customerFact, step.customerFactRu),
      proposal: l(step.recommendation, step.recommendationRu),
      state: 'proposal', source: step.source, processStepId: id
    });
  }
  return items;
}

export function roleHandoffs(roleId: JourneyRoleId): RoleInteraction[] {
  return ROLE_INTERACTIONS.filter(item => item.participants.includes(roleId));
}

export function roleKnowledgeItems(roleId: JourneyRoleId, branch: RoleBranchId): RoleKnowledgeItem[] {
  return branch === 'rights' ? roleRights(roleId)
    : branch === 'duties' ? roleDuties(roleId)
    : branch === 'flow' ? roleFlow(roleId)
    : branch === 'questions' ? roleQuestions(roleId) : [];
}

export function roleKnowledgeState(item: RoleKnowledgeItem, note?: WorkshopNote): RoleKnowledgeState {
  // A decided team answer or a checked question is never client confirmation.
  if (item.question && note?.isaConfirmed && note.answer.trim()) return 'evidenced';
  if (!item.question) return item.state;
  if (note?.answer.trim()) return 'proposal';
  const proposal = note?.revisedRecommendation ?? item.proposal?.de ?? '';
  return proposal.trim() ? 'proposal' : 'open';
}
