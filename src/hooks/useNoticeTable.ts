import { useSearchParams } from "react-router-dom";
import type { PaginationState } from "@tanstack/react-table";
import {
  findAllNotices,
  type FindAllNoticesResponse as Notice,
} from "../services/noticeService";
import { useCallback, useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import type { PageResponse } from "../types/defaultTypes";
import { ApiError } from "../services/apiError";
import { showToast } from "../utils/events";
import { formatDate } from "../utils/formatDate";
import { useDebounce } from "./useDebounce";
import {
  keepPreviousData,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";

type FilterFormValues = {
  sort: string;
  pageSize: number;
};

export const useNoticeTable = () => {
  const [searchParams, setSearchParams] = useSearchParams();

  const pageIndex = parseInt(searchParams.get("page") || "0", 10);
  const pageSize = parseInt(searchParams.get("size") || "10", 10);
  const sort = searchParams.get("sort") || "timestamp,desc";
  const globalFilter = searchParams.get("q") || "";
  const debouncedFilter = useDebounce(globalFilter, 400);

  const pagination: PaginationState = { pageIndex, pageSize };
  const [filterDialogOpen, setFilterDialogOpen] = useState(false);
  const queryClient = useQueryClient();

  const { data, isFetching, isError, error } = useQuery<PageResponse<Notice>>({
    queryKey: ["notices", pageIndex, pageSize, debouncedFilter, sort],
    queryFn: () => findAllNotices(pageIndex, pageSize, debouncedFilter, sort),
    placeholderData: keepPreviousData,
  });

  useEffect(() => {
    if (isError) {
      const message =
        error instanceof ApiError
          ? error.message
          : "Falha ao carregar a lista de avisos.";
      showToast(message, "error");
    }
  }, [isError, error]);

  const { control, handleSubmit, reset } = useForm<FilterFormValues>();

  const handleURLChange = useCallback(
    (newParams: Record<string, string | number>) => {
      const updatedParams = new URLSearchParams(searchParams);
      Object.entries(newParams).forEach(([key, value]) => {
        if (value) {
          updatedParams.set(key, String(value));
        } else {
          updatedParams.delete(key);
        }
      });
      if (newParams.q !== undefined || newParams.sort || newParams.size) {
        updatedParams.set("page", "0");
      }
      setSearchParams(updatedParams);
    },
    [searchParams, setSearchParams],
  );

  const handleOpenFilterDialog = () => {
    reset({ sort, pageSize });
    setFilterDialogOpen(true);
  };

  const handleApplyFilters = (data: FilterFormValues) => {
    handleURLChange({ sort: data.sort, size: data.pageSize });
    setFilterDialogOpen(false);
  };

  return {
    data:
      data?.content.map((notice) => ({
        ...notice,
        timestamp: formatDate(notice.timestamp),
      })) ?? [],
    pageCount: data?.totalPages ?? 0,
    isLoading: isFetching,
    pagination,
    globalFilter,
    handleURLChange,
    filterDialog: {
      open: filterDialogOpen,
      onOpen: handleOpenFilterDialog,
      onClose: () => setFilterDialogOpen(false),
      form: {
        control,
        onSubmit: handleSubmit(handleApplyFilters),
      },
    },
  };
};
