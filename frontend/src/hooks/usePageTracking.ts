import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import axios from 'axios';

export const usePageTracking = () => {
  const location = useLocation();

  useEffect(() => {
    const recordVisit = async () => {
      try {
        const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
        await axios.post(`${apiUrl}/analytics/visit`, {
          path: location.pathname,
          referrer: document.referrer || '',
          userAgent: navigator.userAgent
        });
      } catch (error) {
        console.error('Failed to record page visit:', error);
      }
    };

    recordVisit();
  }, [location.pathname]);
};
