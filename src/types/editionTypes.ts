// import type { Step } from "./stepsTypes";

export type FetchEditionsResponse = {
  id: string;
  year: number;
};

export type CreateEditionRequest = {
  name: string;
  year: number;
  registrationStartDate: string;
  registrationEndDate: string;
  startDate: string;
  endDate: string;
  minimumWage: string;
};

export type CreateEditionResponse = {
  message?: string;
  id?: string;
};

export type UpdateEditionRequest = {
  editionId: string;
  name: string;
  year: number;
  registrationStartDate: string;
  registrationEndDate: string;
  startDate: string;
  endDate: string;
  minimumWage: string;
};

