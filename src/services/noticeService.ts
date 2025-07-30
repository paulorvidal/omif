import api from "./api";
import type { ApiError } from "./apiError";
import type { PageParams, PageResponse } from "./defaultTypes";

export type FindAllNoticesResponse = {
  id: string;
  title: string;
  timestamp: string;
};

export type CreateNoticeRequest = {
  title: string;
  content: string;
  deliveryMethod: string;
  recipient: string;
};

export type CreateNoticeResponse = {
  message: string;
};

export const findAllNotices = async (
  page: number,
  size: number = 10,
  q?: string,
  sort?: string,
): Promise<PageResponse<FindAllNoticesResponse>> => {
  const params: PageParams = { page, size };

  if (q?.trim()) {
    params.q = q.trim();
  }

  if (sort?.trim()) {
    params.sort = sort.trim();
  }

  const response = await api.get<PageResponse<FindAllNoticesResponse>>(
    "/notices",
    { params },
  );
  return response.data;
};

export const createNotice = async (
  data: CreateNoticeRequest,
): Promise<CreateNoticeResponse> => {
  try {
    const response = await api.post<CreateNoticeResponse>("/notices", data);
    return response.data;
  } catch (error) {
    const axiosError = error as AxiosError<ApiError>;

    const message =
      axiosError.response?.data?.message ||
      axiosError.message ||
      "Erro inesperado. Aguarde ou tente novamente.";

    throw new Error(message);
  }
};
