import type {
    Institution
} from "../types/institutionTypes"

export type CreateEducatorRequest = {
  name: string;
  socialName: string;
  cpf: string;
  email: string;
  password: string;
  phoneNumber: string;
  dateOfBirth: string;
  siape: string;
  institutionId: string;
  captchaToken: string;
};

export type CreateEducatorResponse = {
  id: string;
  message?: string;
};

export type Educator = {
  id: string;
  socialName: string;
};

export type PageResponse<T> = {
  content: T[];
  totalPages: number;
  totalElements?: number;
  size?: number;
  number?: number;
};

export type FindAllEducatorsResponse = {
  id: string;
  siape: string;
  socialName: string;
  email: string;
  role: string;
  phoneNumber: string;
  validated: boolean;
  institutionName: string;
};

export interface FindAllEducatorsParams {
  page: number;
  size: number;
  q?: string;
  sort?: string;
};

export type GetMyDataEducatorResponse = {
  id: string;
  name: string;
  socialName: string;
  profilePicture: string | null;
  profilePictureUrl?: string;
  role: string;
  email: string;
  institution: Institution;
};


export type ProfileData = {
  name?: string;
  socialName?: string; 
  cpf?: string;
  dateOfBirth?: string;
  siape?: string;
  phoneNumber?: string;
};