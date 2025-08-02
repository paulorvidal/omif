import api from "./api";

export type Edition = {
  id: string;
  year: number;
};

export async function fetchEditions(
  input: string,
): Promise<Array<{ label: number; value: string }>> {
  const response = await api.get<{
    content: Edition[];
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
  }));
}

export type CreateEditionRequest = {
  name: string;
  year: number;
  registrationStartDate: string;
  registrationEndDate: string;
  startDate: string;
  endDate: string;
  minimumWage: string;
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

export type CreateEditionResponse = {
  message?: string;
  id?: string;
};

export const createEdition = async (
  data: CreateEditionRequest,
): Promise<CreateEditionResponse> => {
  const response = await api.post("/editions", data);
  return response.data;
};

export const updateEdition = async (
  data: UpdateEditionRequest,
): Promise<CreateEditionResponse> => {
  const response = await api.post("/editions", data);
  return response.data;
};

export const getEditionById = async (id: string) => {
  const resp = await api.get<CreateEditionRequest>(`/editions/${id}`);
  return resp.data;
};
