import { useParams } from "react-router";
import { PasswordRecoveryForm } from "../components/form/PasswordRecoveryForm";

export const PasswordRecoveryPage = () => {
  const { token } = useParams<{ token: string }>();

  if (!token) {
    return <div>O link de recuperação de senha é inválido ou está incompleto.</div>
  }

  return (
    <div className="flex w-full flex-col items-center p-4 md:p-8">
      <PasswordRecoveryForm token={token} />
    </div>
  );
};