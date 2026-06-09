/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface Framework {
  id: string;
  name: string;
  description: string;
  developer: string;
  languageSupports: string[];
  coreStrength: string;
  bestUseCase: string;
  codeSnippet: string;
  officialDocs: string;
  architectureType: "Sequential" | "Graph/Cyclic" | "Role-Playing" | "Data-Centric" | "Agent-Centric";
  stars?: string;
}

export interface DictionaryTerm {
  term: string;
  definition: string;
  category: "Architectures" | "Cognitive Patterns" | "Memory & Context" | "Tools & Actions";
  explanation: string;
  diagramPattern?: string; // Representation of the flowchart or cycle
}

export interface NewsletterIssue {
  id: string;
  title: string;
  date: string;
  summary: string;
  content: string;
  category: "Market Report" | "Framework Deep-Dive" | "Strategy Review" | "Engineering Insights";
  reads: number;
}

export interface TaskStep {
  name: string;
  executor: string;
  description: string;
  dependencies: string[];
}

export interface WealthStrategy {
  id: string;
  title: string;
  objective: string;
  difficulty: "Beginner" | "Intermediate" | "Advanced";
  timeToDeploy: string;
  estimatedReturnPattern: string;
  recommendedFrameworks: string[];
  workflow: TaskStep[];
  codeExample: string;
  tips: string[];
  executionSafetyGuidelines: string;
}
