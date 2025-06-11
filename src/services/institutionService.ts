import api from "./api";

export type Institution = {
  id: string;
  name: string;
};


export async function fetchInstitutions(
  input: string
): Promise<Array<{ label: string; value: string }>> {
  try {
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
  } catch (error: any) {
    console.error("Erro ao buscar instituições:", error);
    return [];
  }
}
