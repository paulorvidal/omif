import { useQuery } from "@tanstack/react-query";
import { getNoticeById } from "../services/noticeService";
import { showToast } from "../utils/events";
import { ApiError } from "../services/apiError";
import { useEffect } from "react";

export const useNoticeDetails = (noticeId: string) => {
  const { data, isLoading, isError, error } = useQuery({
    queryKey: ["notice", noticeId],
    queryFn: () => getNoticeById(noticeId),
    enabled: !!noticeId,
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

  return { data, isLoading, isError, error };
};
