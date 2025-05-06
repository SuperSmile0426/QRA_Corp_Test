export interface Requirement {
  displayId: string;
  text: string;
}

export interface ReportOptions {
  sections: string[];
}

export interface AnalysisOptions {
  analysisTypes: string[];
  mode: string;
  configurationId: string;
  report: ReportOptions;
}

export interface AnalyzeRequirementsRequest {
  requirements: Requirement[];
  options: AnalysisOptions;
}

export interface Units {
  found: string[];
  missing: string[];
}

export interface Terms {
  found: string[];
  missing: string[];
}

export interface Quality {
  issues: string[];
  suggestions: string[];
}

export interface Similarity {
  requirementId1: string;
  requirementId2: string;
  score: number;
  text1: string;
  text2: string;
}

export interface AnalyzeRequirementsResponse {
  overallScore: number;
  warningCount: number;
  units: Units;
  terms: Terms;
  quality: Quality;
  similarity: Similarity[];
}

export interface AnalysisHistoryItem {
  id: string;
  timestamp: string;
  requirements: Requirement[];
  configurationId: string | null;
  overallScore: number;
  warningCount: number;
}

export type AnalysisHistoryResponse = AnalysisHistoryItem[];

export interface ConfigurationSummary {
  configurationId: string;
  configurationVersion: number;
  configurationName: string;
  configurationSchemaVersion: string;
  minClientVersion: string;
  publishedBy: string;
  modifiedDate: number;
} 