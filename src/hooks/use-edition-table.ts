import { useState, useCallback, useEffect } from "react";
import { useForm } from "react-hook-form";
import { useSearchParams } from "react-router-dom";
import {
  useQueryClient,
  useQuery,
  keepPreviousData,
} from "@tanstack/react-query";
import type { PaginationState } from "@tanstack/react-table";
import { useDebounce } from "./use-debounce";
import { findAllEditions } from "../services/edition-service";
import { showToast } from "../utils/events";
import { ApiError } from "../services/api-error";
import type { PageResponse, Edition } from "../types/edition-types";

type FilterFormValues = {
  sort: string;
  pageSize: number;
};

export const useEditionsTable = () => {
  const [searchParams, setSearchParams] = useSearchParams();

  const pageIndex = parseInt(searchParams.get("page") || "0", 10);
  const pageSize = parseInt(searchParams.get("size") || "10", 10);
  const sort = searchParams.get("sort") || "year,desc";
  const globalFilter = searchParams.get("q") || "";
  const debouncedFilter = useDebounce(globalFilter, 400);

  const pagination: PaginationState = { pageIndex, pageSize };
  const [filterDialogOpen, setFilterDialogOpen] = useState(false);
  const queryClient = useQueryClient();

  const { data, isFetching, isError, error } = useQuery<PageResponse<Edition>>({
    queryKey: ["editions", pageIndex, pageSize, debouncedFilter, sort],
    queryFn: () => findAllEditions(pageIndex, pageSize, debouncedFilter, sort),
    placeholderData: keepPreviousData,
  });

  useEffect(() => {
    if (isError) {
      const message =
        error instanceof ApiError
          ? error.message
          : "Falha ao carregar a lista de edições.";
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
      if (
        newParams.q !== undefined ||
        newParams.sort ||
        (newParams.size && newParams.page === undefined)
      ) {
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
    data: data?.content ?? [],
    pageCount: data?.page.totalPages ?? 0,
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
