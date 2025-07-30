  import { useState, useCallback, useEffect } from "react"; 
  import { useForm } from "react-hook-form";
  import { useDebounce } from "./useDebounce";
  import {
    findAllEducators,
    validateMultipleEducators,
    unvalidateEducators,
    type PageResponse,
    type FindAllEducatorsResponse as Educator, 
  } from "../services/educatorService"; 
  import { showToast } from "../utils/events";
  import type { PaginationState } from "@tanstack/react-table";
  import { ApiError } from "../services/apiError";
  import { useMutation, useQueryClient, useQuery, keepPreviousData } from '@tanstack/react-query';
  import { useSearchParams } from "react-router";

  type FilterFormValues = {
    sort: string;
    pageSize: number;
  };

  export const useEducatorTable = () => {
    const [searchParams, setSearchParams] = useSearchParams();

    const pageIndex = parseInt(searchParams.get("page") || "0", 10);
    const pageSize = parseInt(searchParams.get("size") || "10", 10); 
    const sort = searchParams.get("sort") || "socialName,asc";
    const globalFilter = searchParams.get("q") || "";
    const debouncedFilter = useDebounce(globalFilter, 400);

    const pagination: PaginationState = { pageIndex, pageSize };
    const [filterDialogOpen, setFilterDialogOpen] = useState(false);
    const queryClient = useQueryClient();

    const { data, isFetching, isError, error } = useQuery<PageResponse<Educator>>({
      queryKey: ['educators', pageIndex, pageSize, debouncedFilter, sort],
      queryFn: () => findAllEducators(pageIndex, pageSize, debouncedFilter, sort),
      placeholderData: keepPreviousData, 
    });

    useEffect(() => {
      if (isError) {
        const message = error instanceof ApiError ? error.message : "Falha ao carregar a lista de educadores.";
        showToast(message, "error");
      }
    }, [isError, error]);

    const { mutate: validateEducators, isPending: isUpdating } = useMutation({
      mutationFn: validateMultipleEducators,
      onSuccess: () => {
        showToast("Educadores validados com sucesso!", "success");
        queryClient.invalidateQueries({ queryKey: ['educators'] });
      },
      onError: (error) => {
        const message = error instanceof ApiError ? error.message : "Falha ao validar educadores";
        showToast(message, "error");
      }
    });

    const { mutate: bulkUnvalidate, isPending: isUnvalidating } = useMutation({
      mutationFn: unvalidateEducators, 
      onSuccess: () => {
        showToast("Validação dos educadores revertida.", "success");
        queryClient.invalidateQueries({ queryKey: ['educators'] });
      },
      onError: (error) => {
        const message = error instanceof ApiError ? error.message : "Falha ao reverter validação.";
        showToast(message, "error");
      }
    });


    const { control, handleSubmit, reset } = useForm<FilterFormValues>();

    const handleURLChange = useCallback((newParams: Record<string, string | number>) => {
      const updatedParams = new URLSearchParams(searchParams);
      Object.entries(newParams).forEach(([key, value]) => {
        if (value) {
          updatedParams.set(key, String(value));
        } else {
          updatedParams.delete(key);
        }
      });
      if (newParams.q !== undefined || newParams.sort || newParams.size) {
        updatedParams.set('page', '0');
      }
      setSearchParams(updatedParams);
    }, [searchParams, setSearchParams]);

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
      validateEducators,
      isUpdating,
      bulkUnvalidate,
      isUnvalidating,
    };
  };