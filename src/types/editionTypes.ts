
import type { Step } from "./stepsTypes"

export type FetchEditionsResponse = {
  id: string;
  year: number;
};


export type CreateEditionResponse = {
  message?: string;
  id?: string;
};

export type PageResponse<T> = {
  content: T[];
  totalPages: number;
  totalElements?: number;
  size?: number;
  number?: number;
};

export type CreateEditionRequest = {
  name: string;
  year: number;
  minimumWage: string;
  registrationStartDate: string;
  registrationEndDate: string;
};

export type UpdateEditionRequest = {
  editionId: string;
  name: string;
  year: number;
  minimumWage: string;
  registrationStartDate: string;
  registrationEndDate: string;
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
  registrationStartDate: string;
  registrationEndDate: string;
  steps: Step[];
}

export interface CurrentEdition {
  isActive: boolean;
  editionName: string;
  editionYear: number;
  endEnrollmentDate: string;
}