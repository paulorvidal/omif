import { useState, useCallback, useEffect } from "react";
import { useSearchParams } from "react-router";
import { useForm } from "react-hook-form";
import { useDebounce } from "./useDebounce";
import type { PaginationState } from "@tanstack/react-table";
import {
  deleteInstitution,
  findAllInstitutions,
  type FindAllInstitutionsResponse,
} from "../services/institutionService";
import type { PageResponse } from "../types/defaultTypes";
import { ApiError } from "../services/apiError";
import { showToast } from "../utils/events";

type FilterFormValues = {
  sort: string;
  pageSize: number;
};

export const useInstitutionTable = () => {
  const [searchParams, setSearchParams] = useSearchParams();

  const pageIndex = parseInt(searchParams.get("page") || "0", 10);
  const pageSize = parseInt(searchParams.get("size") || "10", 10);
  const sort = searchParams.get("sort") || "name,asc";
  const globalFilter = searchParams.get("q") || "";
  const debouncedFilter = useDebounce(globalFilter, 400);

  const pagination: PaginationState = { pageIndex, pageSize };

  const [data, setData] = useState<FindAllInstitutionsResponse[]>([]);
  const [pageCount, setPageCount] = useState(0);
  const [isLoading, setIsLoading] = useState(false);

  const [confirmOpen, setConfirmOpen] = useState(false);
  const [institutionToDelete, setInstitutionToDelete] = useState<string | null>(
    null,
  );
  const [filterDialogOpen, setFilterDialogOpen] = useState(false);

  const { control, handleSubmit, reset } = useForm<FilterFormValues>();

  const loadInstitutions = useCallback(async () => {
    setIsLoading(true);
    try {
      const result: PageResponse<FindAllInstitutionsResponse> =
        await findAllInstitutions(pageIndex, pageSize, debouncedFilter, sort);
      setData(result.content);
      setPageCount(result.totalPages);
    } catch (error) {
      const message =
        error instanceof ApiError
          ? error.message
          : "Erro ao carregar instituições";
      showToast(message, "error");
    } finally {
      setIsLoading(false);
    }
  }, [pageIndex, pageSize, debouncedFilter, sort]);

  useEffect(() => {
    loadInstitutions();
  }, [loadInstitutions]);

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

  const handleConfirmDelete = async (): Promise<void> => {
    if (!institutionToDelete) return;
    try {
      await deleteInstitution(institutionToDelete);
      showToast("Instituição deletada com sucesso", "success");
      setConfirmOpen(false);
      setInstitutionToDelete(null);
      await loadInstitutions();
    } catch (error) {
      showToast(
        error instanceof Error ? error.message : "Erro ao deletar instituição",
        "error",
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteClick = (id: string) => {
    setInstitutionToDelete(id);
    setConfirmOpen(true);
  };

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
    deleteDialog: {
      open: confirmOpen,
      onConfirm: handleConfirmDelete,
      onCancel: () => setConfirmOpen(false),
    },
    handleDeleteClick,
  };
};
