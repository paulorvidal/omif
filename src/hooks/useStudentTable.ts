import { useState, useCallback, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { useForm } from "react-hook-form";
import type { PaginationState } from "@tanstack/react-table";
import {
  useQuery,
  useMutation,
  useQueryClient,
  keepPreviousData,
} from "@tanstack/react-query";

import { findAllStudents, deleteStudent } from "../services/studentService";
import { useDebounce } from "./useDebounce";
import { ApiError } from "../services/apiError";
import { showToast } from "../utils/events";
import type { Student } from "../types/studentTypes";
import type { PageResponse } from "../types/defaultTypes";

type FilterFormValues = {
  sort: string;
  pageSize: number;
};

export type StudentColumns = {
  id: string;
  cpf: string;
  name: string;
  email: string;
  gender: string;
  institutionName: string;
};

export const useStudentTable = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const queryClient = useQueryClient();

  const pageIndex = parseInt(searchParams.get("page") || "0", 10);
  const pageSize = parseInt(searchParams.get("size") || "10", 10);
  const sort = searchParams.get("sort") || "name,asc";
  const globalFilter = searchParams.get("q") || "";

  const debouncedFilter = useDebounce(globalFilter, 500);

  const pagination: PaginationState = { pageIndex, pageSize };

  const [confirmOpen, setConfirmOpen] = useState(false);
  const [studentToDelete, setStudentToDelete] = useState<string | null>(null);
  const [filterDialogOpen, setFilterDialogOpen] = useState(false);

  const { control, handleSubmit, reset } = useForm<FilterFormValues>();

  const {
    data: pageResponse,
    isLoading,
    isError,
    error,
  } = useQuery<PageResponse<Student>, ApiError>({
    queryKey: ['students', { pageIndex, pageSize, filter: debouncedFilter, sort }],
    queryFn: () => findAllStudents({
      page: pageIndex,
      size: pageSize,
      q: debouncedFilter,
      sort: sort,
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
      cpf: student.cpf,
      name: student.name,
      email: student.email,
      gender: student.gender,
      institutionName: student.institution?.name || "",
    })) ?? [];

  const pageCount = pageResponse?.page?.totalPages ?? 0;
  const totalElements = pageResponse?.page?.totalElements ?? 0;

  const { mutate: performDelete, isPending: isDeleting } = useMutation({
    mutationFn: (id: string) => deleteStudent(id),
    onSuccess: () => {
      showToast("Estudante deletado com sucesso", "success");
      queryClient.invalidateQueries({ queryKey: ['students'] });
    },
    onError: (err) => {
      showToast(
        err instanceof Error ? err.message : "Erro ao deletar estudante",
        "error",
      );
    },
    onSettled: () => {
      setConfirmOpen(false);
      setStudentToDelete(null);
    },
  });

  const handleConfirmDelete = () => {
    if (studentToDelete) {
      performDelete(studentToDelete);
    }
  };

  const handleURLChange = useCallback(
    (newParams: Record<string, string | number>) => {
      const updatedParams = new URLSearchParams(searchParams);
      Object.entries(newParams).forEach(([key, value]) => {
        if (value !== undefined && value !== null && String(value).length > 0) {
          updatedParams.set(key, String(value));
        } else {
          updatedParams.delete(key);
        }
      });
      if (newParams.q !== undefined || newParams.sort || newParams.size) {
        if (pageIndex !== 0) updatedParams.set("page", "0");
      }
      setSearchParams(updatedParams);
    },
    [searchParams, setSearchParams, pageIndex],
  );

  const handleDeleteClick = (id: string) => {
    setStudentToDelete(id);
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
    isDeleting,
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
    deleteDialog: {
      open: confirmOpen,
      onConfirm: handleConfirmDelete,
      onCancel: () => setConfirmOpen(false),
    },
    handleDeleteClick
  };
};