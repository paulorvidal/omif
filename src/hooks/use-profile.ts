import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  getMyData,
  saveMyProfileData,
  saveMyProfilePicture,
  deleteMyProfilePicture,
  changeEmail,
  changePassword,
  changeInstitution,
} from "../services/educator-service";
import { showToast } from "../utils/events";
import { ApiError } from "../services/api-error";
import { fetchInstitutions } from "../services/institution-service";
import { useDebounce } from "@/hooks/use-debounce";
import type { Institution } from "@/types/institution-types";
import type { PageResponse } from "@/types/default-types";
import type { ChangeEmailFormData } from "@/pages/profile-form/change-email-dialog";
import type { ChangePasswordFormData } from "@/pages/profile-form/change-password-dialog";
import type { ChangeInstitutionFormData } from "@/pages/profile-form/change-institution-dialog";

const profileValidationSchema = z.object({
  name: z.string().min(3, "O nome completo é obrigatório"),
  socialName: z.string().nullable().optional(),
  cpf: z.string().length(14, "CPF inválido. Ex: 999.999.999-99"),
  dateOfBirth: z.string().min(1, "Data de nascimento é obrigatória"),
  siape: z.string().min(1, "SIAPE é obrigatório"),
  phoneNumber: z
    .string()
    .nonempty("O telefone é obrigatório")
    .regex(
      /^\(\d{2}\)\s?9?\d{4}-\d{4}$/,
      "O número deve estar no formato (XX)9XXXX-XXXX ou (XX)XXXX-XXXX.",
    ),
});

export type ProfileFormInput = z.infer<typeof profileValidationSchema>;
const profileSchema = profileValidationSchema.extend({
  socialName: z.string().transform((val) => val ?? ""),
});
export type ProfileFormData = z.infer<typeof profileSchema>;

export const useProfile = () => {
  const queryClient = useQueryClient();
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isPasswordDialogOpen, setIsPasswordDialogOpen] = useState(false);
  const [isEmailDialogOpen, setIsEmailDialogOpen] = useState(false);
  const [isInstitutionDialogOpen, setIsInstitutionDialogOpen] = useState(false);
  const [institutionInput, setInstitutionInput] = useState("");
  const debouncedInstitutionInput = useDebounce(institutionInput, 500);

  const {
    register,
    handleSubmit,
    control,
    formState: { errors, isDirty, dirtyFields },
    reset,
  } = useForm<ProfileFormData>({
    resolver: zodResolver(profileSchema),
  });

  const { data: user, isLoading: isLoadingUser } = useQuery({
    queryKey: ["myData"],
    queryFn: getMyData,
  });

  const { data: institutionOptions, isLoading: isInstitutionsLoading } =
    useQuery({
      queryKey: ["institutions", debouncedInstitutionInput],
      queryFn: () =>
        fetchInstitutions({
          q: debouncedInstitutionInput,
          page: 0,
          size: 10,
        }),
      select: (data: PageResponse<Institution>) =>
        data.content.map((institution) => ({
          label: institution.name,
          value: institution.id,
        })),
      enabled: !!debouncedInstitutionInput || institutionInput.length > 0,
    });

  useEffect(() => {
    if (user) {
      reset(user);
    }
  }, [user, reset]);

  const profileUpdateMutation = useMutation({
    mutationFn: (variables: { id: string; data: Partial<ProfileFormData> }) =>
      saveMyProfileData(variables.id, variables.data),
    onSuccess: () => {
      showToast("Dados do perfil atualizados com sucesso!", "success");
      queryClient.invalidateQueries({ queryKey: ["myData"] });
    },
    onError: (error) => {
      if (error instanceof ApiError) {
        showToast(error.message, "error");
      } else {
        showToast("Erro ao atualizar os dados.", "error");
      }
    },
  });

  const pictureUploadMutation = useMutation({
    mutationFn: (variables: { pictureFile: File; id: string }) =>
      saveMyProfilePicture(variables.pictureFile, variables.id),
    onSuccess: () => {
      showToast("Foto de perfil atualizada com sucesso!", "success");
      queryClient.invalidateQueries({ queryKey: ["myData"] });
      setIsEditDialogOpen(false);
    },
    onError: (error) => {
      if (error instanceof ApiError) {
        showToast(error.message, "error");
      } else {
        showToast("Erro ao salvar a foto.", "error");
      }
    },
  });

  const pictureDeleteMutation = useMutation({
    mutationFn: (id: string) => deleteMyProfilePicture(id),
    onSuccess: () => {
      showToast("Foto de perfil excluída com sucesso!", "success");
      queryClient.invalidateQueries({ queryKey: ["myData"] });
      setIsEditDialogOpen(false);
    },
    onError: (error) => {
      if (error instanceof ApiError) {
        showToast(error.message, "error");
      } else {
        showToast("Erro ao excluir a foto.", "error");
      }
    },
  });

  const passwordChangeMutation = useMutation({
    mutationFn: (variables: { id: string; data: ChangePasswordFormData }) => {
      const payload = {
        password: variables.data.currentPassword,
        newPassword: variables.data.newPassword,
      };
      return changePassword(variables.id, payload);
    },
    onSuccess: () => {
      showToast("Senha alterada com sucesso!", "success");
      setIsPasswordDialogOpen(false);
    },
    onError: (error) => {
      if (error instanceof ApiError) {
        showToast(error.message, "error");
      } else {
        showToast("Erro ao alterar a senha.", "error");
      }
    },
  });

  const emailChangeMutation = useMutation({
    mutationFn: (variables: { id: string; data: ChangeEmailFormData }) =>
      changeEmail(variables.id, variables.data),
    onSuccess: () => {
      showToast(
        "Link de confirmação enviado! Verifique sua caixa de entrada.",
        "success",
      );
      queryClient.invalidateQueries({ queryKey: ["myData"] });
      setIsEmailDialogOpen(false);
    },
    onError: (error) => {
      if (error instanceof ApiError) {
        showToast(error.message, "error");
      } else {
        showToast("Erro ao solicitar a alteração de e-mail.", "error");
      }
    },
  });

  const institutionChangeMutation = useMutation({
    mutationFn: (variables: {
      userId: string;
      formData: ChangeInstitutionFormData;
    }) => {
      const { userId, formData } = variables;
      const payload = {
        institutionId: formData.institution,
      };
      return changeInstitution(userId, payload);
    },
    onSuccess: () => {
      showToast("Instituição alterada com sucesso!", "success");
      queryClient.invalidateQueries({ queryKey: ["myData"] });
      setIsInstitutionDialogOpen(false);
    },
    onError: (error) => {
      if (error instanceof ApiError) {
        showToast(error.message, "error");
      } else {
        showToast("Erro ao alterar a instituição.", "error");
      }
    },
  });

  const onSubmit = (data: ProfileFormData) => {
    if (!isDirty) {
      showToast("Seus dados já estão atualizados.", "info");
      return;
    }

    const dirtyData: Partial<ProfileFormData> = {};
    for (const key in dirtyFields) {
      if (key in data) {
        const typedKey = key as keyof ProfileFormData;
        dirtyData[typedKey] = data[typedKey];
      }
    }

    if (Object.keys(dirtyData).length === 0) {
      showToast("Nenhuma alteração detectada para salvar.", "info");
      return;
    }

    if (user?.id) {
      profileUpdateMutation.mutate({ id: user.id, data: dirtyData });
    } else {
      showToast("Erro: ID do usuário não encontrado.", "error");
    }
  };

  const handleSavePicture = (file: File) => {
    if (user?.id) {
      pictureUploadMutation.mutate({ pictureFile: file, id: user.id });
    }
  };

  const handleDeletePicture = () => {
    if (user?.id) {
      pictureDeleteMutation.mutate(user.id);
    }
  };

  const handleResetForm = () => {
    if (user) {
      reset(user);
    }
  };

  const handleEmailEditClick = () => {
    setIsEmailDialogOpen(true);
  };

  const handleChangePassword = (data: ChangePasswordFormData) => {
    if (user?.id) {
      passwordChangeMutation.mutate({ id: user.id, data });
    } else {
      showToast("Erro: ID do usuário não encontrado.", "error");
    }
  };

  const handleChangeEmail = (data: ChangeEmailFormData) => {
    if (user?.id) {
      emailChangeMutation.mutate({ id: user.id, data });
    } else {
      showToast("Erro: ID do usuário não encontrado.", "error");
    }
  };

  const handleChangeInstitution = (data: ChangeInstitutionFormData) => {
    if (user?.id) {
      institutionChangeMutation.mutate({ userId: user.id, formData: data });
    } else {
      showToast("Erro: ID do usuário não encontrado.", "error");
    }
  };

  return {
    user,
    isLoading: isLoadingUser || profileUpdateMutation.isPending,
    isSavingPicture: pictureUploadMutation.isPending,
    isDeletingPicture: pictureDeleteMutation.isPending,
    register,
    control,
    errors,
    handleProfileSubmit: handleSubmit(onSubmit),
    handleResetForm,
    isEditDialogOpen,
    openPictureEditDialog: () => setIsEditDialogOpen(true),
    closePictureEditDialog: () => setIsEditDialogOpen(false),
    handleSavePicture,
    handleDeletePicture,
    isDirty,
    isPasswordDialogOpen,
    openPasswordDialog: () => setIsPasswordDialogOpen(true),
    closePasswordDialog: () => setIsPasswordDialogOpen(false),
    handleChangePassword,
    isChangingPassword: passwordChangeMutation.isPending,
    isEmailDialogOpen,
    openEmailDialog: () => setIsEmailDialogOpen(true),
    closeEmailDialog: () => setIsEmailDialogOpen(false),
    handleChangeEmail,
    isChangingEmail: emailChangeMutation.isPending,
    isInstitutionDialogOpen,
    openInstitutionDialog: () => setIsInstitutionDialogOpen(true),
    closeInstitutionDialog: () => setIsInstitutionDialogOpen(false),
    handleChangeInstitution,
    isChangingInstitution: institutionChangeMutation.isPending,
    handleEmailEditClick,
    institutionOptions: institutionOptions ?? [],
    isInstitutionsLoading,
    setInstitutionInput,
  };
};
