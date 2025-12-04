export interface Step {
  id: string;
  number: number;
  startDate: string;
  endDate: string;
  endDateForReleaseOfNote: string;
  cutOffScore?: number;
}

export interface CreateStepDTO {
  number: number;
  startDate: string;
  endDate: string;
  endDateForReleaseOfNote?: string;
  cutOffScore?: number;
}

export interface UpdateStepDTO {
  startDate?: string;
  endDate?: string;
  endDateForReleaseOfNote?: string;
  cutOffScore?: number;
}
