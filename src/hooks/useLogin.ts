import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { login, resendVerificationLink, type LoginRequest } from "../services/authService";
import { redirectTo, showToast } from "../utils/events";
import { ApiError } from "../services/apiError";

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
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [isVerificationDialogOpen, setIsVerificationDialogOpen] = useState(false);
  const [emailForVerification, setEmailForVerification] = useState("");
  const [isResending, setIsResending] = useState(false);

  const [isApprovalDialogOpen, setIsApprovalDialogOpen] = useState(false);


  const [countdown, setCountdown] = useState(0);

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
  } = useForm<LoginRequest>({ 
    resolver: zodResolver(loginFormSchema),
  });

  const onSubmit = async (data: LoginRequest) => {
    setIsSubmitting(true);
    try {
      const response = await login(data);

      if (response.token) {
        localStorage.setItem("token", response.token);
        localStorage.setItem("role", response.role);
        showToast("Login realizado com sucesso", "success");
        redirectTo("/dashboard");
      } else {
        showToast("Resposta inválida do servidor", "error");
      }
    } catch (error) {
      if (error instanceof ApiError) {
        if (error.code === 'EMAIL_NOT_VALIDATED') {
          setEmailForVerification(data.email);
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
      
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleResendVerificationLink = async (email: string) => {
    setIsResending(true);
    try {
      await resendVerificationLink(email);
      showToast("Um novo link foi enviado para seu e-mail.", "success");
      const endTime = Date.now() + COUNTDOWN_SECONDS * 1000;
      localStorage.setItem(COOLDOWN_STORAGE_KEY, endTime.toString());
      setCountdown(COUNTDOWN_SECONDS); 

    } catch (error) {
      if (error instanceof ApiError) {
        showToast(error.message, "error");
      } else {
        console.error("Erro ao reenviar link:", error);
        showToast("Falha ao reenviar o link.", "error");
      }
    } finally {
      setIsResending(false);
    }
  };

  return {
    register,
    handleLoginSubmit: handleSubmit(onSubmit), 
    errors,
    isSubmitting,
    isVerificationDialogOpen,
    emailForVerification,
    isResending,
    handleResendVerificationLink,
    closeVerificationDialog: () => setIsVerificationDialogOpen(false),
    countdown,
    isApprovalDialogOpen,
    closeApprovalDialog: () => setIsApprovalDialogOpen(false),
  };
};