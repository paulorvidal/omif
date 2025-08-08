import { useParams, useNavigate } from 'react-router';
import CircularProgress from '@mui/material/CircularProgress';
import { CheckCircle, XCircle, LogIn } from 'lucide-react';
import { Button } from "../components/ui/Button";
import { useVerifyEmail } from '../hooks/useVerifyEmail';

function StatusDisplay({ icon, title, message }: { icon: React.ReactNode, title: string, message: string }) {
  return (
    <div className="flex flex-col items-center gap-4 text-center">
      {icon}
      <h1 className="text-2xl font-bold text-zinc-800">{title}</h1>
      <p className="text-zinc-600 max-w-sm">{message}</p>
    </div>
  );
}

export function VerifyEmailPage() {
  const { token } = useParams<{ token: string }>();
  const navigate = useNavigate();

  const { status, errorMessage } = useVerifyEmail(token);

  const handleNavigateToLogin = () => {
    navigate('/login');
  };

  const statusContent = {
    loading: (
      <StatusDisplay
        icon={<CircularProgress size={48} className="!text-green-600" />}
        title="Verificando seu e-mail..."
        message="Isso levará apenas um instante. Por favor, aguarde."
      />
    ),
    success: (
      <StatusDisplay
        icon={<CheckCircle className="h-16 w-16 text-green-500" />}
        title="E-mail verificado com sucesso!"
        message="Seu e-mail foi confirmado. Agora você já pode fazer o login na sua conta."
      />
    ),
    error: (
      <StatusDisplay
        icon={<XCircle className="h-16 w-16 text-red-500" />}
        title="Ocorreu um erro na verificação"
        message={errorMessage || 'Não foi possível validar seu e-mail. Tente novamente ou contate o suporte.'}
      />
    ),
  };

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-zinc-100 p-4">
      <div className="w-full max-w-md rounded-xl bg-white p-8 shadow-lg">
        <div className="flex flex-col items-center gap-6">
          {statusContent[status]}
        </div>
        {(status === 'success' || status === 'error') && (
          <div className="mt-8">
            <div className="my-6 h-px w-full bg-zinc-200" />
            <Button
              onClick={handleNavigateToLogin}
              className="w-full h-12 text-base font-semibold"
            >
              <LogIn className="mr-2 h-5 w-5" />
              Ir para o Login
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}