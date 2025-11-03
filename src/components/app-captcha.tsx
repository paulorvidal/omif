import { Turnstile } from "@marsidev/react-turnstile";
import { FieldDescription } from "./ui/field"; 

type AppCaptchaProps = {
  onVerify: (token: string) => void;
  theme?: "light" | "dark" | "auto";
  error?: string | null;
};

function AppCaptcha({ onVerify, theme = "light", error }: AppCaptchaProps) {
  const siteKey = import.meta.env.VITE_CLOUDFLARE_SITE_KEY;

  if (!siteKey) {
    return <div>Erro na configuração do CAPTCHA.</div>;
  }

  return (
    <div className="flex flex-col gap-1">
      <div className="flex w-full min-w-0 items-center justify-center overflow-hidden bg-transparent">
        <Turnstile
          siteKey={siteKey}
          onSuccess={onVerify}
          options={{
            theme: theme,
          }}
        />
      </div>
      {error && (
        <FieldDescription className="text-destructive">
          {error}
        </FieldDescription>
      )}
    </div>
  );
}

export { AppCaptcha };
