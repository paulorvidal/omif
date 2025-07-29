import api from "./api";

export type CreateNoticeRequest = {
  title: string;
  content: string;
  deliveryMethod: string;
  recipient: string;
};

type CreateNoticeResponse = {
  message: string;
};

export const createNotice = async (data: CreateNoticeRequest): Promise<CreateNoticeResponse> => {
  const response = await api.post<CreateNoticeResponse>("/notices", data);
  return response.data;
};

