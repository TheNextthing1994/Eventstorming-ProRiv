import { ISA_TEAM_QUESTIONS } from './isaTeamQuestions';
import type { IsaTeamQuestion } from './isaTeamQuestions';
import { ISA_PROJECT_SOURCE_COVERAGE } from './isaQuestionCoverage';

export function catalogQuestionsForRoleSource(sourceKey: string): IsaTeamQuestion[] {
  const coverageItem = ISA_PROJECT_SOURCE_COVERAGE.find(item => item.sourceKey === sourceKey);
  const ids = new Set(coverageItem?.questionIds || []);
  return ISA_TEAM_QUESTIONS.filter(question => question.sourceKeys.includes(sourceKey) || ids.has(question.id));
}
