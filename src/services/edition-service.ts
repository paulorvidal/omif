import api from "./api";
import type {
  FetchEditionsResponse,
  CreateEditionRequest,
  UpdateEditionRequest,
  CreateEditionResponse,
  EditionWithSteps,
  PageResponse,
  Edition,
  CurrentEdition,
  EditionStatus,
} from "../types/edition-types";
import type { Step, CreateStepDTO } from "../types/steps-types";

export async function fetchEditions(
  input?: string,
): Promise<Array<{ label: number; value: string; isActive: boolean }>> {
  const response = await api.get<{
    content: FetchEditionsResponse[];
  }>("/editions/search", {
    params: {
      q: input,
      page: 0,
      size: 100,
      sort: "year,desc",
    },
  });

  return response.data.content.map((inst) => ({
    label: inst.year,
    value: inst.id,
    isActive: inst.isActive,
  }));
}

export const createEdition = async (
  data: CreateEditionRequest,
): Promise<CreateEditionResponse> => {
  const response = await api.post("/editions", data);
  console.log(data);
  return response.data;
};

export const updateEdition = async (
  data: Partial<UpdateEditionRequest>,
): Promise<CreateEditionResponse> => {
  const { editionId, ...updateData } = data;
  const response = await api.patch(`/editions/${editionId}`, updateData);
  return response.data;
};

export const getEditionById = async (id: string) => {
  const resp = await api.get<CreateEditionRequest>(`/editions/${id}`);
  return resp.data;
};

export const getEditionStatusByYear = async (editionYear: string) => {
  const resp = await api.get<EditionStatus>(`/editions/${editionYear}/status`);
  return resp.data;
};

export const getEditionWithSteps = async (
  editionId: string,
): Promise<EditionWithSteps> => {
  const response = await api.get<EditionWithSteps>(
    `/editions/${editionId}/steps`,
  );
  return response.data;
};

export const saveStepsForEdition = async (
  editionId: string,
  steps: CreateStepDTO[],
): Promise<{ steps: Step[] }> => {
  const response = await api.post(`/editions/${editionId}/steps`, steps);
  return response.data;
};

export const findAllEditions = async (
  page: number,
  size: number,
  query: string,
  sort: string,
): Promise<PageResponse<Edition>> => {
  const params: { [key: string]: any } = {
    page,
    size,
    sort,
  };

  if (query) {
    params.q = query;
  }

  const response = await api.get<PageResponse<Edition>>("/editions", {
    params,
  });

  return response.data;
};

export const getCurrentInstitutionEnrollmentEdition =
  async (): Promise<CurrentEdition> => {
    const response = await api.get<CurrentEdition>(
      "/editions/institution-enrollment/current",
    );
    return response.data;
  };

export const deleteEdition = async (id: string): Promise<void> => {
  await api.delete(`/editions/${id}`);
};
