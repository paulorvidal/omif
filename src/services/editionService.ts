import api from "./api";
import type { 
  FetchEditionsResponse,
  CreateEditionRequest,
  UpdateEditionRequest,
  CreateEditionResponse
} from "../types/editionTypes"

export async function fetchEditions(
  input: string,
): Promise<Array<{ label: number; value: string }>> {
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
  }));
}


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
