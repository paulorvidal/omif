import { useState, useEffect, useRef } from 'react';
import { verifyEmail } from '../services/authService';
import { ApiError } from "../services/apiError";

export function useVerifyEmail(token: string | undefined) {
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');
  const [errorMessage, setErrorMessage] = useState('');

  const verificationStarted = useRef(false);

  useEffect(() => {
    if (verificationStarted.current) {
      return;
    }

    verificationStarted.current = true;

    if (!token) {
      setStatus('error');
      setErrorMessage('Token de verificação não encontrado na URL.');
      return;
    }

    const processVerification = async () => {
      try {
        await verifyEmail(token);
        setStatus('success');
    } catch (error) {
        setStatus('error');
        if (error instanceof ApiError) {
          console.error(`API Error: ${error.message}, Status: ${error.statusCode}`);
          setErrorMessage(error.message);
        } else {
          console.error('Unexpected error:', error);
          setErrorMessage('Ocorreu um erro inesperado. Tente novamente mais tarde.');
        }
      }
    };

    processVerification();
    
  }, [token]); 
  return { status, errorMessage };
}