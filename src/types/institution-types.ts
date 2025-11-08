export type Institution = {
  id: string;
  name: string;
};

export type FindAllInstitutionsResponse = {
  id: string;
  inep: string;
  name: string;
  coordinatorName: string;
  email: string;
};

export type CreateInstitutionRequest = {
  name: string;
  inep: string;
  email1: string;
  email2: string | undefined;
  email3: string | undefined;
  phoneNumber: string;
};

export type UpdateInstitutionRequest = CreateInstitutionRequest & {
  coordinatorId?: string;
};

export type CreateInstitutionResponse = {
  id: string;
  message?: string;
};

export type FindInstitutionsResponse = {
  name: string;
  inep: string;
  email1: string;
  email2: string;
  email3: string;
  phoneNumber: string;
  coordinator?: { id: string; socialName: string };
};


export type InstitutionSummary = {
  id: string;
  name: string;
};