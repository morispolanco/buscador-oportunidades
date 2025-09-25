export interface ProposalEmail {
  subject: string;
  body: string;
}

// Data shape from Gemini API
export interface ApiBusinessOpportunity {
  businessType: string;
  urgentNeed: string;
  aiSolutionName: string;
  aiSolutionDescription: string;
  appCreationPrompt: string;
  managerEmail: string;
  proposalEmail: ProposalEmail;
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