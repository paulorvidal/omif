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
  findAllInstitutionEnrollments,
  approveEnrollment,
  refuseEnrollment,
} from "../services/enrollment-institution-service";
import { ApiError } from "../services/api-error";
import { showToast } from "../utils/events";
import type { EnrollmentInstitution } from "../types/enrollment-institution-types";
import type { PageResponse } from "../types/default-types";

type FilterFormValues = {
  sort: string;
  pageSize: number;
};

type EnrollmentDecisionPayload = {
  enrollmentId: string;
  confirmChange: boolean;
};

// 1. Removi o argumento 'editionYear' pois vamos pegá-lo internamente
export const useEnrollmentInstitutionTable = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const queryClient = useQueryClient();

  // --- LÓGICA NOVA: ESCUTAR O HEADER ---

  // Função auxiliar para ler o localStorage
  const getStoredEdition = useCallback(() => {
    const stored = localStorage.getItem("edition");
    // Se for "all" ou nulo, retorna string vazia ou trata conforme sua API espera
    return stored && stored !== "all" ? stored : "";
  }, []);

  // Estado local para guardar o ano
  const [editionYear, setEditionYear] = useState<string>(getStoredEdition());

  useEffect(() => {
    // Função que atualiza o estado quando o evento dispara
    const handleEditionChange = () => {
      setEditionYear(getStoredEdition());
    };

    // Adiciona o ouvinte para o evento que o seu useNavbar já dispara
    window.addEventListener("editionChange", handleEditionChange);

    // Limpeza ao desmontar
    return () => {
      window.removeEventListener("editionChange", handleEditionChange);
    };
  }, [getStoredEdition]);

  // -------------------------------------

  const pageIndex = parseInt(searchParams.get("page") || "0", 10);
  const pageSize = parseInt(searchParams.get("size") || "10", 10);
  const sort = searchParams.get("sort") || "institution.name,asc";
  const globalFilter = searchParams.get("q") || "";

  const debouncedFilter = useDebounce(globalFilter, 400);

  const pagination: PaginationState = { pageIndex, pageSize };

  const [filterDialogOpen, setFilterDialogOpen] = useState(false);
  const { control, handleSubmit, reset } = useForm<FilterFormValues>();

  const queryKey = [
    "institutionEnrollments",
    editionYear, // 2. O React Query vai reagir a mudança desse estado
    { pageIndex, pageSize, filter: debouncedFilter, sort },
  ];

  const {
    data: pageResponse,
    isLoading,
    isError,
    error,
  } = useQuery<PageResponse<EnrollmentInstitution>, ApiError>({
    queryKey,
    queryFn: () =>
      findAllInstitutionEnrollments(
        editionYear, // Passa o estado atualizado
        pageIndex,
        pageSize,
        debouncedFilter,
        sort,
      ),
    placeholderData: keepPreviousData,
    // 3. Só busca se tiver um ano selecionado (evita erro 404 se a rota exigir ID)
    enabled: !!editionYear,
    refetchOnMount: true,
  });

  const {
    mutate: approveEnrollmentMutate,
    mutateAsync: approveEnrollmentMutateAsync,
    isPending: isApproving,
  } = useMutation({
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

  const {
    mutate: refuseEnrollmentMutate,
    mutateAsync: refuseEnrollmentMutateAsync,
    isPending: isRefusing,
  } = useMutation({
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
      mutateAsync: approveEnrollmentMutateAsync,
      isPending: isApproving,
    },
    refuseEnrollment: {
      mutate: refuseEnrollmentMutate,
      mutateAsync: refuseEnrollmentMutateAsync,
      isPending: isRefusing,
    },
  };
};
