export type DrillType = 'substitution' | 'response' | 'transformation' | 'expansion' | 'integration';

export interface Word {
  text: string;
  isInteractive: boolean;
  alternatives?: string[];
  type?: 'subject' | 'verb' | 'adverb' | 'object' | 'adjective';
}

export interface DrillSentence {
  id: string;
  english: Word[];
  korean: string;
  instruction?: string;
  instructionKorean?: string;
}

export interface SubstitutionDrill extends DrillSentence {
  type: 'substitution';
}

export interface ResponseDrill extends DrillSentence {
  type: 'response';
  prompt: string;
  promptKorean: string;
  expectedResponses: string[];
}

export interface TransformationDrill extends DrillSentence {
  type: 'transformation';
  targetForm: string;
  targetFormKorean: string;
  answer: string;
  answerKorean: string;
}

export interface ExpansionDrill extends DrillSentence {
  type: 'expansion';
  expansionCue: string;
  expansionCueKorean: string;
  answer: string;
  answerKorean: string;
}

export interface IntegrationDrill {
  id: string;
  type: 'integration';
  context: string;
  contextKorean: string;
  sentences: DrillSentence[];
  instruction: string;
  instructionKorean: string;
}

export interface DrillSet {
  id: string;
  title: string;
  titleKorean: string;
  description: string;
  descriptionKorean: string;
  substitution: SubstitutionDrill[];
  response: ResponseDrill[];
  transformation: TransformationDrill[];
  expansion: ExpansionDrill[];
  integration: IntegrationDrill[];
  createdAt: Date;
}

export interface UploadedFile {
  id: string;
  name: string;
  content: string;
  uploadedAt: Date;
  processed: boolean;
  drillSet?: DrillSet;
}
