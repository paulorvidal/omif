import { useSearchParams } from "react-router";
import type { PaginationState } from "@tanstack/react-table";
import {
  findAllNotices,
  type FindAllNoticesResponse,
} from "../services/noticeService";
import { useCallback, useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import type { PageResponse } from "../services/defaultTypes";
import { ApiError } from "../services/apiError";
import { showToast } from "../utils/events";
import { formatDate } from "../utils/formatDate";
import { useDebounce } from "./useDebounce";

type FilterFormValues = {
  sort: string;
  pageSize: number;
};

export const useNoticeTable = () => {
  const [searchParams, setSearchParams] = useSearchParams();

  const pageIndex = parseInt(searchParams.get("page") || "0", 10);
  const pageSize = parseInt(searchParams.get("size") || "10", 10);
  const sort = searchParams.get("sort") || "timestamp,asc";
  const globalFilter = searchParams.get("q") || "";
  const debouncedFilter = useDebounce(globalFilter, 400);

  const pagination: PaginationState = { pageIndex, pageSize };

  const [data, setData] = useState<FindAllNoticesResponse[]>([]);
  const [pageCount, setPageCount] = useState(0);
  const [isLoading, setIsLoading] = useState(false);

  const [filterDialogOpen, setFilterDialogOpen] = useState(false);

  const { control, handleSubmit, reset } = useForm<FilterFormValues>();

  const loadNotices = useCallback(async () => {
    setIsLoading(true);
    try {
      const result: PageResponse<FindAllNoticesResponse> = await findAllNotices(
        pageIndex,
        pageSize,
        debouncedFilter,
        sort,
      );

      const formatted = result.content.map((item) => ({
        ...item,
        timestamp: formatDate(item.timestamp),
      }));

      setData(formatted);
      setPageCount(result.totalPages);
    } catch (error) {
      const message =
        error instanceof ApiError ? error.message : "Erro ao carregar avisos";
      showToast(message, "error");
    } finally {
      setIsLoading(false);
    }
  }, [pageIndex, pageSize, debouncedFilter, sort]);

  useEffect(() => {
    loadNotices();
  }, [loadNotices]);

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
    data,
    pageCount,
    pagination,
    isLoading,
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
