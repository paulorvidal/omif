import { useState, useCallback, useEffect } from "react";
import { useForm } from "react-hook-form";
import { useSearchParams } from "react-router-dom";
import {
  useQueryClient,
  useQuery,
  useMutation,
  keepPreviousData,
} from "@tanstack/react-query";
import type { PaginationState } from "@tanstack/react-table";
import { useDebounce } from "./use-debounce";
import { findAllEditions, deleteEdition } from "../services/edition-service";
import { showToast } from "../utils/events";
import { ApiError } from "../services/api-error";
import type { PageResponse, Edition } from "../types/edition-types";
import type { Step } from "../types/steps-types";

export type EditionColumns = {
  id: string;
  name: string;
  year: number;
  startDate: string;
  endDate: string;
  minimumWage: string;
  steps: Step[];
};

type FilterFormValues = {
  sort: string;
  pageSize: number;
};

export const useEditionTable = () => {
  const [searchParams, setSearchParams] = useSearchParams();

  const pageIndex = parseInt(searchParams.get("page") || "0", 10);
  const pageSize = parseInt(searchParams.get("size") || "10", 10);
  const sort = searchParams.get("sort") || "year,desc";
  const globalFilter = searchParams.get("q") || "";
  const debouncedFilter = useDebounce(globalFilter, 400);

  const pagination: PaginationState = { pageIndex, pageSize };
  const [filterDialogOpen, setFilterDialogOpen] = useState(false);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [editionToDelete, setEditionToDelete] = useState<string | null>(null);
  const queryClient = useQueryClient();

  const { data: pageResponse, isLoading, isError, error } = useQuery<PageResponse<Edition>>({
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

  const data: EditionColumns[] =
    pageResponse?.content.map((edition) => ({
      id: edition.id,
      name: edition.name,
      year: edition.year,
      startDate: edition.startDate,
      endDate: edition.endDate,
      minimumWage: edition.minimumWage,
      steps: edition.steps || [],
    })) ?? [];

  const pageCount = pageResponse?.page.totalPages ?? 0;
  const totalElements = pageResponse?.page.totalElements ?? 0;

  const { mutate: performDelete, isPending: isDeleting } = useMutation({
    mutationFn: (id: string) => deleteEdition(id),
    onSuccess: () => {
      showToast("Edição deletada com sucesso", "success");
      queryClient.invalidateQueries({ queryKey: ["editions"] });
    },
    onError: (err) => {
      showToast(
        err instanceof Error ? err.message : "Erro ao deletar edição",
        "error",
      );
    },
    onSettled: () => {
      setConfirmOpen(false);
      setEditionToDelete(null);
    },
  });

  const handleConfirmDelete = () => {
    if (editionToDelete) {
      performDelete(editionToDelete);
    }
  };

  const { control, handleSubmit, reset, formState: { errors } } = useForm<FilterFormValues>();

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

  const handleDeleteClick = (id: string) => {
    setEditionToDelete(id);
    setConfirmOpen(true);
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
      onSubmit: handleSubmit(handleApplyFilters),
      formControl: control,
      formErrors: errors,
    },
    deleteDialog: {
      open: confirmOpen,
      onConfirm: handleConfirmDelete,
      onCancel: () => setConfirmOpen(false),
    },
    handleDeleteClick,
  };
};
