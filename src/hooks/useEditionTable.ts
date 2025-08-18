import { useState, useCallback, useEffect } from "react";
import { useForm } from "react-hook-form";
import { useSearchParams } from "react-router";
import {  useQueryClient, useQuery, keepPreviousData } from '@tanstack/react-query';
import type { PaginationState } from "@tanstack/react-table";
import { useDebounce } from "./useDebounce";
import {
  findAllEditions
} from "../services/editionService"; // Adapte o caminho para o seu serviço de edição
import { showToast } from "../utils/events";
import { ApiError } from "../services/apiError";
import type {
  PageResponse,
  Edition
} from "../types/editionTypes"

type FilterFormValues = {
  sort: string;
  pageSize: number;
};

export const useEditionsTable = () => {
  const [searchParams, setSearchParams] = useSearchParams();

  // Extrai parâmetros da URL ou usa valores padrão
  const pageIndex = parseInt(searchParams.get("page") || "0", 10);
  const pageSize = parseInt(searchParams.get("size") || "10", 10);
  const sort = searchParams.get("sort") || "year,desc"; // Ordena por ano descendente por padrão
  const globalFilter = searchParams.get("q") || "";
  const debouncedFilter = useDebounce(globalFilter, 400);

  const pagination: PaginationState = { pageIndex, pageSize };
  const [filterDialogOpen, setFilterDialogOpen] = useState(false);
  const queryClient = useQueryClient();

  // Hook para buscar os dados paginados de edições
  const { data, isFetching, isError, error } = useQuery<PageResponse<Edition>>({
    queryKey: ['editions', pageIndex, pageSize, debouncedFilter, sort],
    queryFn: () => findAllEditions(pageIndex, pageSize, debouncedFilter, sort),
    placeholderData: keepPreviousData,
  });

  // Exibe um toast de erro caso a busca falhe
  useEffect(() => {
    if (isError) {
      const message = error instanceof ApiError ? error.message : "Falha ao carregar a lista de edições.";
      showToast(message, "error");
    }
  }, [isError, error]);

  const { control, handleSubmit, reset } = useForm<FilterFormValues>();

  // Atualiza a URL com novos parâmetros de busca, paginação ou ordenação
  const handleURLChange = useCallback((newParams: Record<string, string | number>) => {
    const updatedParams = new URLSearchParams(searchParams);
    Object.entries(newParams).forEach(([key, value]) => {
      if (value) {
        updatedParams.set(key, String(value));
      } else {
        updatedParams.delete(key);
      }
    });
    // Reseta para a primeira página ao aplicar um novo filtro, busca ou tamanho de página
    if (newParams.q !== undefined || newParams.sort || newParams.size) {
      updatedParams.set('page', '0');
    }
    setSearchParams(updatedParams);
  }, [searchParams, setSearchParams]);

  // Abre o diálogo de filtros, populando com os valores atuais
  const handleOpenFilterDialog = () => {
    reset({ sort, pageSize });
    setFilterDialogOpen(true);
  };

  // Aplica os filtros do diálogo e fecha o mesmo
  const handleApplyFilters = (data: FilterFormValues) => {
    handleURLChange({ sort: data.sort, size: data.pageSize });
    setFilterDialogOpen(false);
  };

  return {
    data: data?.content ?? [],
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