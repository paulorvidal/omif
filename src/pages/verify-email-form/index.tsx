import { AppCard } from "@/components/app-card";
import { Spinner } from "@/components/ui/spinner";
import { useVerifyEmail } from "@/hooks/use-verify-email";
import { AtSign, Divide } from "lucide-react";
import { useParams } from "react-router";
import { useNavigate } from "react-router";

function VerifyEmailForm() {
  const navigate = useNavigate();

  const { token } = useParams<{ token: string }>();

  const { status, errorMessage } = useVerifyEmail(token);

  const handleNavigateToLogin = () => {
    navigate("/login");
  };

  const statusContent = {
    loading: (
      <AppCard
        title="Verificando seu e-mail..."
        description="Isso levará apenas um instante. Por favor, aguarde."
        type="loading"
        redirectTo="/login"
        redirectMessage="Ir para o Login"
      />
    ),
    success: (
      <AppCard
        title="E-mail verificado com sucesso!"
        description="Seu e-mail foi confirmado. Agora você já pode fazer o login na sua conta."
        type="success"
        redirectTo="/login"
        redirectMessage="Ir para o Login"
      />
    ),
    error: (
      <AppCard
        title="Ocorreu um erro na verificação"
        description={
          errorMessage ||
          "Não foi possível validar seu e-mail. Tente novamente ou contate o suporte."
        }
        type="error"
        redirectTo="/login"
        redirectMessage="Ir para o Login"
      />
    ),
  };

  return (
    <div className="flex min-h-svh w-full justify-center p-6 md:p-10">
      <div className="w-full max-w-5xl">
        <div className="mb-6 flex w-full flex-col items-center gap-4">
          {statusContent[status]}
        </div>
      </div>
    </div>
  );
}

export { VerifyEmailForm };
