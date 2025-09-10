import api from "./api";
import type { PageParams, PageResponse } from "../types/defaultTypes";
import type {
  FindAllInstitutionsResponse,
  Institution,
  CreateInstitutionRequest,
  CreateInstitutionResponse,
  FindInstitutionsResponse
} from "../types/institutionTypes"

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
