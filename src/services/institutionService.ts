import api from "./api";
import type { PageParams, PageResponse } from "../types/defaultTypes";

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

export type FindAllInstitutionsParams = {
  page: number;
  size: number;
  q?: string;
  sort?: string;
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

export const findAllInstitutions = async (
  page: number,
  size: number = 10,
  q?: string,
  sort?: string,
): Promise<PageResponse<FindAllInstitutionsResponse>> => {
  const params: PageParams = { page, size };

  if (q?.trim()) {
    params.q = q.trim();
  }

  if (sort?.trim()) {
    params.sort = sort.trim();
  }

  const response = await api.get<PageResponse<FindAllInstitutionsResponse>>(
    "/institutions",
    { params },
  );
  return response.data;
};

export async function fetchInstitutions(
  input: string,
): Promise<Array<{ label: string; value: string }>> {
  const response = await api.get<{
    content: Institution[];
  }>("/institutions/search", {
    params: {
      q: input,
      page: 0,
      size: 10,
    },
  });

  return response.data.content.map((inst) => ({
    label: inst.name,
    value: inst.id,
  }));
}

export const createInstitution = async (
  data: CreateInstitutionRequest,
): Promise<CreateInstitutionResponse> => {
  const response = await api.post("/institutions", data);
  return response.data;
};

export const getInstitutionById = async (id: string) => {
  const resp = await api.get<FindInstitutionsResponse>(`/institutions/${id}`);
  return resp.data;
};

export const updateInstitution = async (
  id: string,
  data: CreateInstitutionRequest,
) => {
  const resp = await api.put<CreateInstitutionResponse>(
    `/institutions/${id}`,
    data,
  );
  return resp.data;
};

export const deleteInstitution = async (id: string): Promise<void> => {
  await api.delete(`/institutions/${id}`);
};
