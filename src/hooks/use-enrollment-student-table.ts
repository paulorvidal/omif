import { useState, useCallback, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { useForm } from "react-hook-form";
import { useDebounce } from "./use-debounce";
import type { PaginationState } from "@tanstack/react-table";
import {
  useQuery,
  keepPreviousData,
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";
import {
  findAllEnrollments,
  approveEnrollmentStudent,
  refuseEnrollmentStudent,
  approveEnrollmentStudentsBulk,
  refuseEnrollmentStudentsBulk,
} from "../services/enrollment-student-service";
import { ApiError } from "../services/api-error";
import { showToast } from "../utils/events";
import type { EnrollmentStudent } from "../types/enrollment-student-types";
import type { PageResponse } from "../types/default-types";

export const ENROLLMENT_PARAM_KEYS = {
  page: "enrollmentPage",
  size: "enrollmentSize",
  sort: "enrollmentSort",
  q: "enrollmentQ",
} as const;

type FilterFormValues = {
  sort: string;
  pageSize: number;
};

type EnrollmentDecisionPayload = {
  enrollmentId: string;
};

type EnrollmentBulkDecisionPayload = {
  enrollmentIds: string[];
};

export const useEnrollmentStudentTable = (editionYear: string) => {
  const [searchParams, setSearchParams] = useSearchParams();
  const queryClient = useQueryClient();

  const pageIndex = parseInt(
    searchParams.get(ENROLLMENT_PARAM_KEYS.page) || "0",
    10,
  );
  const pageSize = parseInt(
    searchParams.get(ENROLLMENT_PARAM_KEYS.size) || "10",
    10,
  );
  const sort =
    searchParams.get(ENROLLMENT_PARAM_KEYS.sort) || "enrollmentDate,desc";
  const globalFilter = searchParams.get(ENROLLMENT_PARAM_KEYS.q) || "";

  const debouncedFilter = useDebounce(globalFilter, 400);
  const pagination: PaginationState = { pageIndex, pageSize };

  const [filterDialogOpen, setFilterDialogOpen] = useState(false);
  const {
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<FilterFormValues>({
    defaultValues: {
      sort,
      pageSize,
    },
  });

  const queryKey = [
    "studentEnrollments",
    editionYear,
    { pageIndex, pageSize, filter: debouncedFilter, sort },
  ];

  const {
    data: pageResponse,
    isLoading,
    isError,
    error,
  } = useQuery<PageResponse<EnrollmentStudent>, ApiError>({
    queryKey,
    queryFn: () =>
      findAllEnrollments(Number(editionYear), {
        page: pageIndex,
        size: pageSize,
        q: debouncedFilter,
        sort,
      }),
    placeholderData: keepPreviousData,
    enabled: !!editionYear,
    refetchOnMount: true,
  });

  const { mutate: approveEnrollmentMutate, isPending: isApproving } =
    useMutation({
      mutationFn: ({ enrollmentId }: EnrollmentDecisionPayload) =>
        approveEnrollmentStudent(editionYear, enrollmentId),
      onSuccess: () => {
        showToast("Inscrição aprovada com sucesso!", "success");
        queryClient.invalidateQueries({ queryKey });
      },
      onError: (error: ApiError) =>
        showToast(error.message || "Erro ao aprovar inscrição", "error"),
    });

  const { mutate: refuseEnrollmentMutate, isPending: isRefusing } = useMutation(
    {
      mutationFn: ({ enrollmentId }: EnrollmentDecisionPayload) =>
        refuseEnrollmentStudent(editionYear, enrollmentId),
      onSuccess: () => {
        showToast("Inscrição recusada com sucesso.", "success");
        queryClient.invalidateQueries({ queryKey });
      },
      onError: (error: ApiError) =>
        showToast(error.message || "Erro ao recusar inscrição", "error"),
    },
  );

  const {
    mutate: approveEnrollmentBulkMutate,
    isPending: isBulkApproving,
  } = useMutation({
    mutationFn: ({ enrollmentIds }: EnrollmentBulkDecisionPayload) =>
      approveEnrollmentStudentsBulk(editionYear, enrollmentIds),
    onSuccess: () => {
      showToast("Inscrições aprovadas com sucesso!", "success");
      queryClient.invalidateQueries({ queryKey });
    },
    onError: (error: ApiError) =>
      showToast(
        error.message || "Erro ao aprovar inscrições em massa",
        "error",
      ),
  });

  const { mutate: refuseEnrollmentBulkMutate, isPending: isBulkRefusing } =
    useMutation({
      mutationFn: ({ enrollmentIds }: EnrollmentBulkDecisionPayload) =>
        refuseEnrollmentStudentsBulk(editionYear, enrollmentIds),
      onSuccess: () => {
        showToast("Inscrições recusadas com sucesso.", "success");
        queryClient.invalidateQueries({ queryKey });
      },
      onError: (error: ApiError) =>
        showToast(
          error.message || "Erro ao recusar inscrições em massa",
          "error",
        ),
    });

  useEffect(() => {
    if (isError && error) {
      showToast(error.message || "Erro ao carregar inscrições", "error");
    }
  }, [isError, error]);

  const data = pageResponse?.content ?? [];
  const pageCount = pageResponse?.page.totalPages ?? 0;
  const totalElements = pageResponse?.page.totalElements ?? 0;

  const mapKey = useCallback((key: string) => {
    if (key in ENROLLMENT_PARAM_KEYS) {
      return ENROLLMENT_PARAM_KEYS[key as keyof typeof ENROLLMENT_PARAM_KEYS];
    }
    return key;
  }, []);

  const handleURLChange = useCallback(
    (newParams: Record<string, string | number>) => {
      const updatedParams = new URLSearchParams(searchParams);
      let shouldResetPage = false;

      Object.entries(newParams).forEach(([rawKey, value]) => {
        const key = mapKey(rawKey);
        if (value !== undefined && value !== null && value !== "") {
          updatedParams.set(key, String(value));
        } else {
          updatedParams.delete(key);
        }

        if (rawKey === "q" || rawKey === "sort" || rawKey === "size") {
          shouldResetPage = true;
        }
      });

      if (shouldResetPage && newParams.page === undefined) {
        updatedParams.set(ENROLLMENT_PARAM_KEYS.page, "0");
      }

      setSearchParams(updatedParams);
    },
    [mapKey, searchParams, setSearchParams],
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
      onSubmit: handleSubmit(handleApplyFilters),
      formControl: control,
      formErrors: errors,
    },
    approveEnrollment: {
      mutate: approveEnrollmentMutate,
      isPending: isApproving,
    },
    refuseEnrollment: { mutate: refuseEnrollmentMutate, isPending: isRefusing },
    bulkApproveEnrollment: {
      mutate: approveEnrollmentBulkMutate,
      isPending: isBulkApproving,
    },
    bulkRefuseEnrollment: {
      mutate: refuseEnrollmentBulkMutate,
      isPending: isBulkRefusing,
    },
  };
};
