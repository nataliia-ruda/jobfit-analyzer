export interface AnalyzeRequest {
  jobPosting: string;
  cvText: string;
}

export interface SkillGap {
  skill: string;
  required: boolean;     
  presentInCv: boolean;   
  note: string;           
}

export interface CvSuggestion {
  area: string;        
  suggestion: string;  
}

export interface JobAnalysis {
  jobTitle: string;
  matchScore: number;           
  matchSummary: string;         
  skillGaps: SkillGap[];
  cvSuggestions: CvSuggestion[];
}