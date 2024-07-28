// hooks/useUserInfo.js
import { useState, useEffect } from 'react';
import { getUserInfo } from '../api/callApi';

const useUserInfo = (token) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!token) {
      setError('No token provided');
      setLoading(false);
      return;
    }

    const fetchUserInfo = async () => {
      try {
        const response = await getUserInfo(token);
        setUser(response);
        console.log(response);
      } catch (err) {
        setError(err.message || 'Error fetching user data');
      } finally {
        setLoading(false);
      }
    };

    fetchUserInfo();
  }, [token]);

  return { user, loading, error };
};

export default useUserInfo;
