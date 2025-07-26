import api from "./api";

export type Edition = {
  id: string;
  year: string;
};

export async function fetchEditions(
  input: string,
): Promise<Array<{ label: string; value: string }>> {
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
