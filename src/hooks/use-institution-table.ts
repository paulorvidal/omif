import { useState, useCallback, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { useDebounce } from "./use-debounce";
import type { PaginationState } from "@tanstack/react-table";
import {
  useQuery,
  useMutation,
  useQueryClient,
  keepPreviousData,
} from "@tanstack/react-query";
import { useForm } from "react-hook-form"; 

import {
  deleteInstitution,
  findAllInstitutions,
} from "../services/institution-service";
import { ApiError } from "../services/api-error";
import { showToast } from "../utils/events";
import { type FindAllInstitutionsResponse } from "../types/institution-types";
import type { PageResponse } from "../types/default-types";

export type InstitutionCollumns = {
  id: string;
  name: string;
  inep: string;
  email: string;
  coordinatorName: string;
};

type FilterFormData = {
  sort: string;
  pageSize: number;
};

const useDebounceFallback = (value: string, delay: number) => {
  const [debouncedValue, setDebouncedValue] = useState(value);
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);
    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);
  return debouncedValue;
};

export const useInstitutionTable = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const queryClient = useQueryClient();

  const pageIndex = parseInt(searchParams.get("page") || "0", 10);
  const pageSize = parseInt(searchParams.get("size") || "10", 10);
  const sort = searchParams.get("sort") || "name,asc";
  const globalFilter = searchParams.get("q") || "";

  const debouncedFilter =
    typeof useDebounce === "function"
      ? useDebounce(globalFilter, 400)
      : useDebounceFallback(globalFilter, 400);

  const pagination: PaginationState = { pageIndex, pageSize };

  const [confirmOpen, setConfirmOpen] = useState(false);
  const [institutionToDelete, setInstitutionToDelete] = useState<string | null>(
    null,
  );

  const [filterDialogOpen, setFilterDialogOpen] = useState(false);
  

  const filterForm = useForm<FilterFormData>({
    defaultValues: {
      sort: sort,
      pageSize: pageSize,
    },
  });

  const {
    data: pageResponse,
    isLoading,
    isError,
    error,
  } = useQuery<PageResponse<FindAllInstitutionsResponse>, ApiError>({
    queryKey: [
      "institutions",
      { pageIndex, pageSize, filter: debouncedFilter, sort },
    ],
    queryFn: () =>
      findAllInstitutions({
        page: pageIndex,
        size: pageSize,
        q: debouncedFilter,
        sort: sort,
      }),
    placeholderData: keepPreviousData,
  });

  useEffect(() => {
    if (isError && error) {
      showToast(error.message || "Erro ao carregar instituições", "error");
    }
  }, [isError, error]);

  const data: InstitutionCollumns[] =
    pageResponse?.content.map((institution) => ({
      id: institution.id,
      name: institution.name,
      inep: institution.inep,
      email: institution.email,
      coordinatorName: institution.coordinatorName,
    })) ?? [];

  const pageCount = pageResponse?.page.totalPages ?? 0;
  const totalElements = pageResponse?.page.totalElements ?? 0;

  const { mutate: performDelete, isPending: isDeleting } = useMutation({
    mutationFn: (id: string) => deleteInstitution(id),
    onSuccess: () => {
      showToast("Instituição deletada com sucesso", "success");
      queryClient.invalidateQueries({ queryKey: ["institutions"] });
    },
    onError: (err) => {
      showToast(
        err instanceof Error ? err.message : "Erro ao deletar instituição",
        "error",
      );
    },
    onSettled: () => {
      setConfirmOpen(false);
      setInstitutionToDelete(null);
    },
  });

  const handleConfirmDelete = () => {
    if (institutionToDelete) {
      performDelete(institutionToDelete);
    }
  };

  const handleURLChange = useCallback(
    (newParams: Record<string, string | number>) => {
      const updatedParams = new URLSearchParams(searchParams);
      Object.entries(newParams).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          updatedParams.set(key, String(value));
        } else {
          updatedParams.delete(key);
        }
      });
      const qChanged = newParams.q !== undefined;
      const sortChanged =
        newParams.sort !== undefined && newParams.sort !== sort;
      const sizeChanged =
        newParams.size !== undefined && newParams.size !== pageSize;

      if (qChanged || sortChanged || sizeChanged) {
        if (pageIndex !== 0) updatedParams.set("page", "0");
      }
      setSearchParams(updatedParams);
    },
    [searchParams, setSearchParams, pageIndex, sort, pageSize],
  );

  const handleDeleteClick = (id: string) => {
    setInstitutionToDelete(id);
    setConfirmOpen(true);
  };

  const handleOpenFilterDialog = () => {
    filterForm.reset({ sort: sort, pageSize: pageSize });
    setFilterDialogOpen(true);
  };

  const handleApplyFilters = (data: FilterFormData) => {
    handleURLChange({ sort: data.sort, size: data.pageSize });
    setFilterDialogOpen(false);
  };

  return {
    data,
    pageCount,
    pagination,
    isLoading,
    isDeleting,
    globalFilter,
    totalElements,
    handleURLChange,
    filterDialog: {
      open: filterDialogOpen,
      onOpen: handleOpenFilterDialog,
      onClose: () => setFilterDialogOpen(false),
      
      onSubmit: filterForm.handleSubmit(handleApplyFilters),
      formControl: filterForm.control,
      formErrors: filterForm.formState.errors,
    },
    deleteDialog: {
      open: confirmOpen,
      onConfirm: handleConfirmDelete,
      onCancel: () => setConfirmOpen(false),
    },
    handleDeleteClick,
  };
};