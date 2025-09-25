export interface ProposalEmail {
  subject: string;
  body: string;
}

export interface AcceptanceProbability {
  rating: 'Alta' | 'Media' | 'Baja';
  justification: string;
  score: number; // Score from 1-10
}

// Data shape from Gemini API
export interface ApiBusinessOpportunity {
  sector: string;
  businessType: string;
  urgentNeed: string;
  aiSolutionName: string;
  aiSolutionDescription: string;
  appCreationPrompt: string;
  managerEmail: string;
  proposalEmail: ProposalEmail;
  acceptanceProbability: AcceptanceProbability;
  easeOfCreation: number; // Score from 1-10
  opportunityForGain: number; // Score from 1-10
}

// Data shape used in the React components, including tracking state
export interface BusinessOpportunity extends ApiBusinessOpportunity {
  tracking: {
    emailSent: boolean;
    emailSentDate: string | null;
    responseReceived: boolean;
    responseReceivedDate: string | null;
    inProduction: boolean;
  };
}


export enum AppState {
  IDLE,
  LOADING,
  SUCCESS,
  ERROR,
}