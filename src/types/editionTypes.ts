
import type { Step } from "./stepsTypes"

export type FetchEditionsResponse = {
  id: string;
  year: number;
};


export type CreateEditionResponse = {
  message?: string;
  id?: string;
};

type PageInfo = {
  size: number;
  number: number;
  totalElements: number;
  totalPages: number;
};

export type PageResponse<T> = {
  content: T[];
  page: PageInfo;
};

export type CreateEditionRequest = {
  name: string;
  year: number;
  minimumWage: string;
  startDate: string;
  endDate: string;
  institutionRegistrationStartDate: string;
  institutionRegistrationEndDate: string;
  studentRegistrationStartDate: string;
  studentRegistrationEndDate: string;
};


export type UpdateEditionRequest = {
  editionId: string;
  name: string;
  year: number;
  minimumWage: string;
  startDate: string;
  endDate: string;
  institutionRegistrationStartDate: string;
  institutionRegistrationEndDate: string;
  studentRegistrationStartDate: string;
  studentRegistrationEndDate: string;
};

export interface EditionWithSteps {
  id: string;
  name: string;
  year: number;
  steps: Step[];
}


export interface Edition {
  id: string;
  name: string;
  year: number;
  startDate: string;
  endDate: string;
  institutionRegistrationStartDate: string;
  institutionRegistrationEndDate: string;
  studentRegistrationStartDate: string;
  studentRegistrationEndDate: string;
  minimumWage: number;
  steps: Step[];
}

export interface CurrentEdition {
  isActive: boolean;
  editionName: string;
  editionYear: number;
  endEnrollmentDate: string;
}