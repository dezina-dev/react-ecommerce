import React, { ReactNode, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { RootState } from './redux/store';
import { setTokens } from './redux/features/auth/authSlice';
import Login from './components/Login';
import Register from './components/Register';
import Dashboard from './components/Dashboard';
import Cart from './components/Cart';
import Navbar from './components/Navbar';
import StripePaymentSuccess from './pages/StripePaymentSuccess';
import StripePaymentCancel from './pages/StripePaymentCancel';
import ProductManagement from './components/ProductManagement';

interface PrivateRouteProps {
  children: ReactNode;
}

const PrivateRoute: React.FC<PrivateRouteProps> = ({ children }) => {
  // const isAuthenticated = useSelector((state: RootState) => !!state.auth.accessToken);
  const isAuthenticated = localStorage.getItem('accessToken');
  return isAuthenticated ? <>{children}</> : <Navigate to="/login" />;
};

interface PublicRouteProps {
  children: ReactNode;
}

const PublicRoute: React.FC<PublicRouteProps> = ({ children }) => {
  const isAuthenticated = localStorage.getItem('accessToken');
  return isAuthenticated ? <Navigate to="/dashboard" /> : <>{children}</>;
};

const App: React.FC = () => {
  const dispatch = useDispatch();

  // Load tokens from localStorage when the app mounts
  useEffect(() => {
    const storedAccessToken = localStorage.getItem('accessToken');
    const storedRefreshToken = localStorage.getItem('refreshToken');

    if (storedAccessToken && storedRefreshToken) {
      dispatch(setTokens({ accessToken: storedAccessToken, refreshToken: storedRefreshToken }));
    }
  }, [dispatch]);

  return (
    <Router>
      <Navbar />
      <ToastContainer></ToastContainer>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route
          path="/dashboard"
          element={
            <PrivateRoute>
              <Dashboard />
            </PrivateRoute>
          }
        />
        <Route
          path="/cart"
          element={
            <PrivateRoute>
              <Cart />
            </PrivateRoute>
          }
        />
        <Route
          path="/order-success"
          element={
            <PrivateRoute>
              <StripePaymentSuccess />
            </PrivateRoute>
          }
        />
        <Route
          path="/order-cancel"
          element={
            <PrivateRoute>
              <StripePaymentCancel />
            </PrivateRoute>
          }
        />
        <Route
          path="/manage-products"
          element={
            <PrivateRoute>
              <ProductManagement />
            </PrivateRoute>
          }
        />
        {/* Additional public routes go here */}
        <Route path="*" element={<Navigate to="/login" />} />
      </Routes>
    </Router>
  );
};

export default App;
