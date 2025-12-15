import { useState, useCallback, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import type { PaginationState } from "@tanstack/react-table";
import { useForm } from "react-hook-form";
import {
  useQuery,
  keepPreviousData,
} from "@tanstack/react-query";
import { useDebounce } from "./use-debounce";
import type { PageResponse } from "@/types/default-types";
import type { Student } from "@/types/student-types";
import { findAllStudents } from "@/services/student-service";
import { ApiError } from "@/services/api-error";
import { showToast } from "@/utils/events";

export type StudentColumns = {
  id: string;
  name: string;
  cpf: string;
  email?: string;
  institutionName?: string;
};

type FilterFormData = {
  sort: string;
  pageSize: number;
};

export const STUDENT_PARAM_KEYS = {
  page: "studentPage",
  size: "studentSize",
  sort: "studentSort",
  q: "studentQ",
} as const;

export const useStudentTable = () => {
  const [searchParams, setSearchParams] = useSearchParams();

  const pageIndex = parseInt(
    searchParams.get(STUDENT_PARAM_KEYS.page) || "0",
    10,
  );
  const pageSize = parseInt(
    searchParams.get(STUDENT_PARAM_KEYS.size) || "10",
    10,
  );
  const sort = searchParams.get(STUDENT_PARAM_KEYS.sort) || "name,asc";
  const globalFilter = searchParams.get(STUDENT_PARAM_KEYS.q) || "";

  const debouncedFilter = useDebounce(globalFilter, 400);

  const pagination: PaginationState = { pageIndex, pageSize };

  const [filterDialogOpen, setFilterDialogOpen] = useState(false);

  const filterForm = useForm<FilterFormData>({
    defaultValues: {
      sort,
      pageSize,
    },
  });

  const queryKey = [
    "students",
    { pageIndex, pageSize, filter: debouncedFilter, sort },
  ];

  const {
    data: pageResponse,
    isLoading,
    isError,
    error,
  } = useQuery<PageResponse<Student>, ApiError>({
    queryKey,
    queryFn: () =>
      findAllStudents({
        page: pageIndex,
        size: pageSize,
        q: debouncedFilter,
        sort,
      }),
    placeholderData: keepPreviousData,
  });

  useEffect(() => {
    if (isError && error) {
      showToast(error.message || "Erro ao carregar estudantes", "error");
    }
  }, [isError, error]);

  const data: StudentColumns[] =
    pageResponse?.content.map((student) => ({
      id: student.id,
      name: student.socialName || student.name,
      cpf: student.cpf,
      email: student.email,
      institutionName: student.institution?.name ?? "",
    })) ?? [];

  const pageCount = pageResponse?.page.totalPages ?? 0;
  const totalElements = pageResponse?.page.totalElements ?? 0;

  const mapKey = useCallback((key: string) => {
    if (key in STUDENT_PARAM_KEYS) {
      return STUDENT_PARAM_KEYS[key as keyof typeof STUDENT_PARAM_KEYS];
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
        updatedParams.set(STUDENT_PARAM_KEYS.page, "0");
      }

      setSearchParams(updatedParams);
    },
    [mapKey, searchParams, setSearchParams],
  );

  const handleOpenFilterDialog = () => {
    filterForm.reset({ sort, pageSize });
    setFilterDialogOpen(true);
  };

  const handleApplyFilters = (formData: FilterFormData) => {
    handleURLChange({ sort: formData.sort, size: formData.pageSize });
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
      onSubmit: filterForm.handleSubmit(handleApplyFilters),
      formControl: filterForm.control,
      formErrors: filterForm.formState.errors,
    },
  };
};
