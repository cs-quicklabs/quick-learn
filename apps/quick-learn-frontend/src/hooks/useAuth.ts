import { useState } from 'react';
import { loginApiCall } from '../apiServices/authService';
import { LoginCredentials } from '../shared/types/authTypes';

export const useLogin = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const loginUser = async (credentials: LoginCredentials) => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await loginApiCall(credentials);
      localStorage.setItem('accessToken', response.accessToken);
      setIsLoading(false);
      return response;
    } catch (err) {
      setError(
        err instanceof Error ? err : new Error('An unknown error occurred'),
      );
      setIsLoading(false);
      throw err;
    }
  };
  return { loginUser, isLoading, error };
};
