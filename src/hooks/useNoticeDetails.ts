import { useQuery } from "@tanstack/react-query";
import { getNoticeById } from "../services/noticeService";
import { showToast } from "../utils/events";
import { ApiError } from "../services/apiError";
import { useEffect } from "react";
import { formatDate } from "../utils/formatDate";

export const useNoticeDetails = (noticeId: string, enabled = true) => {
  const { data, isLoading, isError, error } = useQuery({
    queryKey: ["notice", noticeId],
    queryFn: () => getNoticeById(noticeId),
    enabled: !!noticeId && enabled,
  });

  useEffect(() => {
    if (isError) {
      const message =
        error instanceof ApiError
          ? error.message
          : "Falha ao carregar o aviso.";
      showToast(message, "error");
    }
  }, [isError, error]);

  return {
    data: data
      ? {
          ...data,
          timestamp: formatDate(data.timestamp),
        }
      : null,
    isLoading,
  };
};
