import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router';
import { RootState } from '../redux/store';
import { logout, setTokens } from '../redux/features/auth/authSlice';

const useTokenExpirationCheck = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const tokenExpiration = useSelector((state: RootState) => state.auth.tokenExpiration);

  useEffect(() => {
    const checkTokenExpiration = () => {
      const storedAccessToken = localStorage.getItem('accessToken');
      const storedRefreshToken = localStorage.getItem('refreshToken');

      // Check if tokens are in localStorage
      if (storedAccessToken && storedRefreshToken) {
        // Dispatch setTokens action to update the tokens in the Redux store
        dispatch(setTokens({ accessToken: storedAccessToken, refreshToken: storedRefreshToken }));

        // Extract and store the token expiration time
        const decodedToken = decodeJwt(storedAccessToken);
        if (decodedToken && typeof decodedToken.exp === 'number') {
          dispatch(setTokenExpiration(decodedToken.exp * 1000)); // Convert to milliseconds
        }
      } else {
        // If tokens are not in localStorage, perform logout
        dispatch(logout());
        navigate('/login');
      }
    };

    const intervalId = setInterval(checkTokenExpiration, 30000); // Check every 30 seconds

    return () => clearInterval(intervalId);
  }, [dispatch, navigate]);

  // You might return something if needed
  return {
    tokenExpiration, // Example: you might want to expose the token expiration value
  };
};

export default useTokenExpirationCheck;

// Function to decode a JWT
function decodeJwt(token: string): { [key: string]: any } | null {
  try {
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const payload = JSON.parse(atob(base64));
    return payload;
  } catch (error) {
    return null;
  }
}

// Action to set the token expiration in the Redux store
const setTokenExpiration = (expiration: number) => ({
  type: 'auth/setTokenExpiration',
  payload: expiration,
});
