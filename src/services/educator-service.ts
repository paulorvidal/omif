/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import api from "./api";
import type {
  CreateEducatorRequest,
  CreateEducatorResponse,
  Educator,
  PageResponse,
  FindAllEducatorsParams,
  FindAllEducatorsResponse,
  GetMyDataEducatorResponse,
  ProfileData,
  ChangePasswordPayload,
  ChangeInstitutionPayload,
  ChangeEmailPayload,
} from "../types/educator-types";

export const createEducator = async (
  data: CreateEducatorRequest,
): Promise<CreateEducatorResponse> => {
  const response = await api.post("/educators", data);
  return response.data;
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
  const response = await api.post("/educators/validate", {
    educatorIds: educatorIds,
  });
  return response.data;
};

export const unvalidateEducators = async (educatorIds: string[]) => {
  const response = await api.post("/educators/unvalidate", {
    educatorIds: educatorIds,
  });
  return response.data;
};

export const getMyData = async (): Promise<GetMyDataEducatorResponse> => {
  const { data: userData } =
    await api.get<GetMyDataEducatorResponse>("/educators/me");

  const localImageUrl = await getPrivateImageUrl(userData.profilePicture);

  if (localImageUrl) {
    userData.profilePictureUrl = localImageUrl;
  }
  return userData;
};

export const getPrivateImageUrl = async (
  fullUrl: string | null,
): Promise<string | null> => {
  if (!fullUrl) {
    return null;
  }

  try {
    const response = await api.get(fullUrl, {
      responseType: "blob",
    });
    return URL.createObjectURL(response.data);
  } catch (error) {
    console.error("Falha ao buscar a imagem privada:", error);
    return null;
  }
};

export const deleteMyProfilePicture = async (id: string) => {
  const response = await api.delete(`/educators/${id}/profile-picture`);
  return response.data;
};

export const saveMyProfilePicture = async (pictureFile: File, id: string) => {
  const formData = new FormData();
  formData.append("picture", pictureFile);

  const response = await api.post(
    `/educators/${id}/profile-picture`,
    formData,
    {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    },
  );
  return response.data;
};

export const saveMyProfileData = async (
  id: string,
  data: Partial<ProfileData>,
): Promise<GetMyDataEducatorResponse> => {
  const response = await api.patch(`/educators/${id}`, data);
  return response.data;
};

export const changePassword = async (
  id: string,
  data: ChangePasswordPayload,
): Promise<GetMyDataEducatorResponse> => {
  const response = await api.patch(`/educators/${id}/change-password`, data);
  return response.data;
};

export const changeInstitution = async (
  id: string,
  data: ChangeInstitutionPayload,
): Promise<GetMyDataEducatorResponse> => {
  const response = await api.patch(`/educators/${id}/change-institution`, data);
  return response.data;
};

export const changeEmail = async (
  id: string,
  data: ChangeEmailPayload,
): Promise<GetMyDataEducatorResponse> => {
  const response = await api.put(`/educators/${id}/change-email`, data);
  return response.data;
};

export async function fetchInstitutions(
  input: string,
): Promise<Array<{ label: string; value: string }>> {
  const response = await api.get<{ content: any[] }>(`/institutions`, {
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
export const getEducatorById = async (id: string): Promise<any> => {
  const response = await api.get(`/educators/${id}`);
  return response.data;
};

export const updateEducator = async (
  id: string,
  data: Partial<CreateEducatorRequest>,
): Promise<CreateEducatorResponse> => {
  const response = await api.patch(`/educators/${id}`, data);
  return response.data;
};
