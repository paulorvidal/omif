import React from 'react';
import { Turnstile } from '@marsidev/react-turnstile';

interface CaptchaProps {
  onVerify: (token: string) => void;
  theme?: 'light' | 'dark' | 'auto';
  error?: string | null;
}

const Captcha: React.FC<CaptchaProps> = ({ onVerify, theme = 'auto', error }) => {
  const siteKey = import.meta.env.VITE_CLOUDFLARE_SITE_KEY;

  if (!siteKey) {
    return <div>Erro na configuração do CAPTCHA.</div>;
  }

  return (
    <div>
      <div
        className={`
          w-[300px] h-[65px] 
          border-1 rounded-md 
          overflow-hidden transition-colors
          ${error ? 'border-red-500' : 'border-gray-200 dark:border-gray-300'}
        `}
      >
        <Turnstile
          siteKey={siteKey}
          onSuccess={onVerify}
          options={{
            theme: theme,
          }}
        />

      </div>
      {error && (
        <p className="text-red-500 text-sm mt-2">
          {error}
        </p>
      )}
    </div>

  );
};

export default Captcha;