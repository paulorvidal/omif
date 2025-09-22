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
  params: PageParams,
): Promise<PageResponse<FindAllInstitutionsResponse>> => {
  const response = await api.get<PageResponse<FindAllInstitutionsResponse>>(
    "/institutions",
    { params }, 
  );
  return response.data;
};

export const fetchInstitutions = async (
  params: PageParams,
): Promise<PageResponse<Institution>> => {
  const response = await api.get<PageResponse<Institution>>(
    "/institutions/search",
    { params },
  );
  return response.data;
};

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
