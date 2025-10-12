import { useEffect, useState } from 'react';
import { handleUserAfterAuth } from '../lib/authentication/userService';
import { handleOAuthCallback } from '../lib/authentication/authSession';

export const useOAuthCallback = () => {
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const processOAuthCallback = async () => {
      // Check if we're returning from OAuth flow
      const urlParams = new URLSearchParams(window.location.search);
      const hasAuthParams = urlParams.get('code') || urlParams.get('state');

      if (hasAuthParams) {
        setIsProcessing(true);
        try {
          // Handle OAuth callback
          const authResult = await handleOAuthCallback();
          
          if (authResult.success) {
            // Save user profile to database
            const userResult = await handleUserAfterAuth();
            
            if (!userResult.success) {
              setError(userResult.error || 'Failed to save user profile');
            }
            
            // Clean up URL parameters
            window.history.replaceState({}, document.title, window.location.pathname);
          } else {
            setError(authResult.error || 'Authentication failed');
          }
        } catch (err) {
          setError('Failed to process authentication');
          console.error('OAuth callback error:', err);
        } finally {
          setIsProcessing(false);
        }
      }
    };

    processOAuthCallback();
  }, []);

  return { isProcessing, error };
};