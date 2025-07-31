import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { login, resendVerificationLink, type LoginRequest } from "../services/authService";
import { redirectTo, showToast } from "../utils/events";
import { ApiError } from "../services/apiError";
import { useMutation } from "@tanstack/react-query";

const loginFormSchema = z.object({
  email: z
    .string()
    .nonempty("O email é obrigatório")
    .email("Formato de email inválido"),
  password: z.string().nonempty("A senha é obrigatória"),
});

const COUNTDOWN_SECONDS = 60;
const COOLDOWN_STORAGE_KEY = 'resendVerificationCooldownEnd';

export const useLogin = () => {

  const [captchaToken, setCaptchaToken] = useState<string | null>(null);
  const [captchaResetKey, setCaptchaResetKey] = useState(0);
  const [captchaError, setCaptchaError] = useState<string | null>(null);
  const [isVerificationDialogOpen, setIsVerificationDialogOpen] = useState(false);
  const [emailForVerification, setEmailForVerification] = useState("");
  const [isApprovalDialogOpen, setIsApprovalDialogOpen] = useState(false);
  const [countdown, setCountdown] = useState(0);

  const resetCaptcha = () => {
    setCaptchaToken(null);
    setCaptchaResetKey((prevKey) => prevKey + 1);
  };

  const handleVerifyCaptcha = (token: string) => {
    setCaptchaToken(token);
    if (token) {
      setCaptchaError(null);
    }
  };


  useEffect(() => {
    const cooldownEndTime = localStorage.getItem(COOLDOWN_STORAGE_KEY);
    if (cooldownEndTime) {
      const remainingTime = Number(cooldownEndTime) - Date.now();
      if (remainingTime > 0) {
        setCountdown(Math.ceil(remainingTime / 1000));
      } else {
        localStorage.removeItem(COOLDOWN_STORAGE_KEY);
      }
    }
  }, []);

  useEffect(() => {
    if (countdown <= 0) {
      localStorage.removeItem(COOLDOWN_STORAGE_KEY);
      return;
    }
    const intervalId = setInterval(() => {
      setCountdown((currentCountdown) => currentCountdown - 1);
    }, 1000);
    return () => clearInterval(intervalId);
  }, [countdown]);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<Omit<LoginRequest, 'captchaToken'>>({
    resolver: zodResolver(loginFormSchema),
  });

  const loginMutation = useMutation({
    mutationFn: (payload: LoginRequest) => login(payload),
    onSuccess: (response) => {
      if (response.token) {
        localStorage.setItem("token", response.token);
        localStorage.setItem("role", response.role);
        showToast("Login realizado com sucesso", "success");
        redirectTo("/dashboard");
      } else {
        showToast("Resposta inválida do servidor", "error");
      }
    },
    onError: (error, variables) => {
      if (error instanceof ApiError) {
        if (error.code === 'EMAIL_NOT_VALIDATED') {
          setEmailForVerification(variables.email);
          setIsVerificationDialogOpen(true);
        } else if (error.code === 'ACCOUNT_NOT_APPROVED') {
          setIsApprovalDialogOpen(true);
        } else {
          showToast(error.message, "error");
        }
      } else {
        console.error("Erro não capturado pela API:", error);
        showToast("Ocorreu um erro inesperado.", "error");
      }
    },
    onSettled: () => {
      resetCaptcha();
    },
  });


  const resendLinkMutation = useMutation({
    mutationFn: (email: string) => resendVerificationLink(email),
    onSuccess: () => {
      showToast("Um novo link foi enviado para seu e-mail.", "success");
      const endTime = Date.now() + COUNTDOWN_SECONDS * 1000;
      localStorage.setItem(COOLDOWN_STORAGE_KEY, endTime.toString());
      setCountdown(COUNTDOWN_SECONDS);
    },
    onError: (error) => {
      if (error instanceof ApiError) {
        showToast(error.message, "error");
      } else {
        console.error("Erro ao reenviar link:", error);
        showToast("Falha ao reenviar o link.", "error");
      }
    },
  });

  const onSubmit = (data: Omit<LoginRequest, 'captchaToken'>) => {
    if (!captchaToken) {
      setCaptchaError("Por favor, complete a verificação.");
      return;
    }
    const payload: LoginRequest = { ...data, captchaToken };
    loginMutation.mutate(payload);
  };

  const handleResendVerificationLink = (email: string) => {
    resendLinkMutation.mutate(email);
  };

  return {
    register,
    handleLoginSubmit: handleSubmit(onSubmit),
    errors,
    isSubmitting: loginMutation.isPending,
    captchaToken,
    setCaptchaToken: handleVerifyCaptcha,
    captchaResetKey,
    captchaError,
    isVerificationDialogOpen,
    emailForVerification,
    isResending: resendLinkMutation.isPending,
    handleResendVerificationLink,
    closeVerificationDialog: () => setIsVerificationDialogOpen(false),
    countdown,
    isApprovalDialogOpen,
    closeApprovalDialog: () => setIsApprovalDialogOpen(false),
  };
};