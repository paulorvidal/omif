import { useState, useCallback, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { useForm } from "react-hook-form";
import { useDebounce } from "./useDebounce";
import type { PaginationState } from "@tanstack/react-table";
import {
  useQuery,
  keepPreviousData,
  useMutation,
  useQueryClient
} from "@tanstack/react-query";

import {
  findAllInstitutionEnrollments,
  approveEnrollment,
  refuseEnrollment,
} from "../services/institutionEnrollmentService";
import { ApiError } from "../services/apiError";
import { showToast } from "../utils/events";
import type { EnrollmentInstitution } from "../types/institutionEnrollmentTypes";
import type { PageResponse } from "../types/defaultTypes";

type FilterFormValues = {
  sort: string;
  pageSize: number;
};

type EnrollmentDecisionPayload = {
  enrollmentId: string;
  confirmChange: boolean;
};

export const useInstitutionEnrollmentTable = (editionYear: string) => {

  const [searchParams, setSearchParams] = useSearchParams();
  const queryClient = useQueryClient();

  const pageIndex = parseInt(searchParams.get("page") || "0", 10);
  const pageSize = parseInt(searchParams.get("size") || "10", 10);
  const sort = searchParams.get("sort") || "institution.name,asc";
  const globalFilter = searchParams.get("q") || "";

  const debouncedFilter = useDebounce(globalFilter, 400);

  const pagination: PaginationState = { pageIndex, pageSize };

  const [filterDialogOpen, setFilterDialogOpen] = useState(false);
  const { control, handleSubmit, reset } = useForm<FilterFormValues>();

  const queryKey = ['institutionEnrollments', editionYear, { pageIndex, pageSize, filter: debouncedFilter, sort }];

  const {
    data: pageResponse,
    isLoading,
    isError,
    error,
  } = useQuery<PageResponse<EnrollmentInstitution>, ApiError>({
    queryKey,
    queryFn: () => findAllInstitutionEnrollments(editionYear!, pageIndex, pageSize, debouncedFilter, sort),
    placeholderData: keepPreviousData,
    enabled: !!editionYear,
    refetchOnMount: true,
  });

  const { mutate: approveEnrollmentMutate, isPending: isApproving } = useMutation({
    mutationFn: ({ enrollmentId, confirmChange }: EnrollmentDecisionPayload) =>
      approveEnrollment(editionYear, enrollmentId, confirmChange),
    onSuccess: () => {
      showToast("Inscrição aprovada com sucesso!", "success");
      queryClient.invalidateQueries({ queryKey });
    },
    onError: (error: ApiError) => {
      showToast(error.message || "Erro ao aprovar inscrição", "error");
    },
  });

  const { mutate: refuseEnrollmentMutate, isPending: isRefusing } = useMutation({
    mutationFn: ({ enrollmentId, confirmChange }: EnrollmentDecisionPayload) =>
      refuseEnrollment(editionYear, enrollmentId, confirmChange),
    onSuccess: () => {
      showToast("Inscrição recusada com sucesso.", "success");
      queryClient.invalidateQueries({ queryKey });
    },
    onError: (error: ApiError) => {
      showToast(error.message || "Erro ao recusar inscrição", "error");
    },
  });


  useEffect(() => {
    if (isError && error) {
      showToast(error.message || "Erro ao carregar inscrições", "error");
    }
  }, [isError, error]);

  const data = pageResponse?.content ?? [];
  const pageCount = pageResponse?.page.totalPages ?? 0;
  const totalElements = pageResponse?.page.totalElements ?? 0;

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
      if (newParams.q !== undefined || newParams.sort || (newParams.size && newParams.page === undefined)) {
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
    totalElements,
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
    approveEnrollment: {
      mutate: approveEnrollmentMutate,
      isPending: isApproving,
    },
    refuseEnrollment: {
      mutate: refuseEnrollmentMutate,
      isPending: isRefusing,
    },
  };
};