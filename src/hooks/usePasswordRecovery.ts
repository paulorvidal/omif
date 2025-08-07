import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { recoverPassword, type PasswordRecoverRequest } from "../services/authService";
import { useMutation } from "@tanstack/react-query";
import { redirectTo, showToast } from "../utils/events";
import { ApiError } from "../services/apiError";

const passwordRecoverySchema = z.object({
  password: z.string().min(8, "A senha deve ter no mínimo 8 caracteres."),
  confirmPassword: z.string().min(8, "A confirmação de senha é obrigatória."),
})
  .refine((data) => data.password === data.confirmPassword, {
    message: "As senhas não coincidem.",
    path: ["confirmPassword"],
  });

type PasswordRecoveryFormData = z.infer<typeof passwordRecoverySchema>;

export const usePasswordRecovery = (token: string) => {
  const {
    register,
    handleSubmit: hookFormSubmit,
    formState: { errors },
    reset,
  } = useForm<PasswordRecoveryFormData>({
    resolver: zodResolver(passwordRecoverySchema),
  });

  const { mutate, isPending } = useMutation({
    mutationFn: (data: PasswordRecoverRequest) => recoverPassword(data),

    onSuccess: () => {
      showToast("Senha alterada com sucesso!", "success");
      reset();
      setTimeout(() => {
        redirectTo('/login');
      }, 200);
    },

    onError: (error) => {
      if (error instanceof ApiError) {
        showToast(error.message, "error");
      } else {
        showToast("Falha ao alterar senha.", "error");
      }
    },
  });

  const onSubmit = (data: PasswordRecoveryFormData) => {
    mutate({ token, password: data.password });
  };


  const handleSubmit = hookFormSubmit(onSubmit);

  return {
    register,
    handleSubmit,
    errors,
    isPending,
  };
};