import { ISA_TEAM_QUESTIONS } from './isaTeamQuestions';
import { ADMIN_JOURNEY_STEPS } from './roleJourneys';
import { WORKSHOP_STEPS } from './workshopContent';

const t = (n: number) => `amruddy:team:${String(n).padStart(2, '0')}`;
const r = (n: number) => `amruddy:roles:${String(n).padStart(2, '0')}`;
const p = (id: string) => `proriv:project:${id}`;

// A source question may contain several decisions. Each target is an actual
// catalog question, with exactly its text and its own shared answer identity.
// Related questions are not automatically marked answered.
export const ROLE_QUESTION_LINKS: Record<string, string[]> = {
  'admin:access:first-admin': [p('first-admin')],
  'admin:access:deputy': [t(5)],
  'admin:company:master-data': [t(6)],
  'admin:company:connection-owner': [p('tripletex-test-owner')],
  'admin:company:payroll-system': [p('hours-approval-location')],
  'admin:invite:inviter': [p('invitation-channel')],
  'admin:invite:channel': [p('invitation-channel')],
  'admin:invite:expiry': [p('invitation-expiry')],
  'admin:profile:required-data': [p('employee-profile')],
  'admin:profile:worker-rights': [t(4), p('role-combination'), p('send-without-price')],
  'admin:site:site-owner': [t(1), t(7)],
  'admin:site:recipient': [r(8)],
  'admin:site:location-policy': [p('presence-method')],
  'admin:assignment:assignment-owner': [t(2), r(6), t(31)],
  'admin:assignment:report-owner': [t(10), t(5)],
  'admin:prices:price-owner': [t(17), r(50)],
  'admin:prices:missing-price': [p('send-without-price'), t(17)],
  'admin:report-policy:sender': [p('rapport-sender-policy')],
  'admin:report-policy:customer-wait': [p('customer-gates')],
  'admin:report-policy:foreman-replacement': [p('rapport-sender-policy')],
  'admin:monitor:dashboard': [t(1)],
  'admin:monitor:alert': [r(42), t(38)],
  'admin:correction:time-editor': [r(16), t(33), r(43)],
  'admin:correction:report-editor': [p('sent-report-correction'), p('absent-author-correction')],
  'admin:correction:error-owner': [t(24)],
  'admin:closure:close-site': [t(25), r(10)],
  'admin:closure:disable-user': [r(3), p('login-method'), p('offline-new-assignment')],
  'admin:closure:retention': [t(42), p('reopen-site')],
  'process:arrival': [p('hms-responsibility'), p('hms-app-scope'), p('arrival-vs-start'), p('presence-method')],
  'process:time': [p('break-rules'), r(16), p('weekly-overtime')],
  'process:work': [t(11), t(10), p('legacy-work-categories'), p('helper-400')],
  'process:pricing': [p('price-priority'), t(17), r(50)],
  'process:send': [p('rapport-sender-policy'), p('send-without-price'), p('pending-photo-send'), p('delivery-failure')],
  'process:customer': [t(35), r(36), p('customer-gates'), p('late-customer-response')],
  'process:export': [t(22), p('tripletex-report-view'), p('tripletex-test-owner')],
  'process:approval': [p('tripletex-report-view'), p('foreman-app-purpose')],
  'process:accounting': [p('tripletex-feedback')]
};

const catalog = new Map(ISA_TEAM_QUESTIONS.map(question => [question.id, question]));
for (const [source, ids] of Object.entries(ROLE_QUESTION_LINKS)) {
  if (!ids.length || new Set(ids).size !== ids.length || ids.some(id => !catalog.has(id))) throw new Error('Invalid shared role questions: ' + source);
}
for (const step of ADMIN_JOURNEY_STEPS) for (const q of step.questions) if (!ROLE_QUESTION_LINKS[`admin:${step.id}:${q.id}`]) throw new Error('Unmapped role question');
for (const step of WORKSHOP_STEPS) if (!ROLE_QUESTION_LINKS[`process:${step.id}`]) throw new Error('Unmapped process question');

export function catalogQuestionsForRoleSource(source: string) {
  return (ROLE_QUESTION_LINKS[source] || []).map(id => catalog.get(id)!);
}

export function roleLegacyKeysForQuestion(id: string): { key: string; text: string }[] {
  return Object.entries(ROLE_QUESTION_LINKS).filter(([, ids]) => ids.includes(id)).map(([source]) => {
    if (source.startsWith('admin:')) {
      const [, stepId, questionId] = source.split(':');
      return { key: 'role:' + source, text: ADMIN_JOURNEY_STEPS.find(s => s.id === stepId)!.questions.find(q => q.id === questionId)!.text.de };
    }
    const step = WORKSHOP_STEPS.find(s => 'process:' + s.id === source)!;
    return { key: step.id, text: step.openQuestion };
  });
}
