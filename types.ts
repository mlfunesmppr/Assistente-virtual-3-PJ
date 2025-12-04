export enum AppStep {
  INITIAL_PETITION = 0,
  CONTESTATION = 1,
  REVIEW_GENERATE = 2,
  RESULT = 3
}

export interface LegalDocument {
  title: string;
  content: string;
}

export interface GenerationConfig {
  focusArea: string;
  tone: string;
}

export interface GeneratedReplication {
  analysis: string;
  draft: string;
}
