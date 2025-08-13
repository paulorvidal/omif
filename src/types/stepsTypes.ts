export interface Step {
  id: string;
  number: number;
  startDate: string;
  endDate: string;
  cutOffScore: number;
  endDateForReleaseOfNote: string;
}

export interface CreateStepDTO {
  number: number;
  startDate: string;
  endDate: string;
  cutOffScore?: number | null;
  endDateForReleaseOfNote?: string | null;
}

