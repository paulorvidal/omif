import api from "./api";


export type CreateEducatorRequest = {
  name: string;
  socialName: string;
  cpf: string;
  gender: string;
  email: string;
  password: string;
  siape: string;
  coordinator: string;
};

export type CreateEducatorResponse = {
  id: string;
  message?: string;
};

export const createEducator = async (
  data: CreateEducatorRequest,
): Promise<CreateEducatorResponse> => {
  const response = await api.post("/educators", data);
  return response.data;
};

export type Educator = {
  id: string;
  socialName: string;
};

export async function fetchEducators(
  input: string,
  institutionId: string,
): Promise<Array<{ label: string; value: string }>> {
  const response = await api.get<{ content: Educator[] }>(
    `/educators/institution/${institutionId}`,
    {
      params: {
        q: input,
        page: 0,
        size: 10,
      },
    },
  );

  return response.data.content.map((educator) => ({
    label: educator.socialName,
    value: educator.id,
  }));
}

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

interface FindAllEducatorsParams {
  page: number;
  size: number;
  q?: string;
  sort?: string;
};

export const findAllEducators = async (
  page: number,
  size: number = 10,
  q?: string,
  sort?: string, 
): Promise<PageResponse<FindAllEducatorsResponse>> => {
  const params: FindAllEducatorsParams = { page, size };
  if (q?.trim()) {
    params.q = q.trim();
  }
  
  if (sort?.trim()) {
    params.sort = sort.trim(); 
  }

  const response = await api.get<PageResponse<FindAllEducatorsResponse>>(
    "/educators",
    { params },
  );
  return response.data;
};

export const validateMultipleEducators = async (educatorIds: string[]) => {
  console.log(educatorIds)
  const response = await api.post('/educators/validate', { 
      educatorIds: educatorIds 
  });
  return response.data;
};

export const unvalidateEducators = async (educatorIds: string[]) => {
  console.log(educatorIds)
  const response = await api.post('/educators/unvalidate', { 
      educatorIds: educatorIds 
  });
  return response.data;
};