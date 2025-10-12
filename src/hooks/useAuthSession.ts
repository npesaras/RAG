import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router';
import { checkSession } from '../lib/authentication/authSession';
import type { SessionStatus } from '../lib/authentication/authSession';
import { ROUTES } from '../lib/constants';

// Custom hook for authentication session management
export const useAuthSession = (redirectToDashboard: boolean = false) => {
  const [sessionStatus, setSessionStatus] = useState<SessionStatus>({
    isAuthenticated: false,
    loading: true
  });
  
  const navigate = useNavigate();

  useEffect(() => {
    const checkAuthSession = async () => {
      try {
        const status = await checkSession();
        setSessionStatus({
          ...status,
          loading: false
        });

        // Redirect to dashboard if user is authenticated and redirect is enabled
        if (status.isAuthenticated && redirectToDashboard) {
          navigate(ROUTES.DASHBOARD);
        }
      } catch {
        setSessionStatus({
          isAuthenticated: false,
          loading: false
        });
      }
    };

    checkAuthSession();
  }, [navigate, redirectToDashboard]);

  return sessionStatus;
};