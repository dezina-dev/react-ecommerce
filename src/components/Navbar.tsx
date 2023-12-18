import '../css/Navbar.css'
import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { logout } from '../redux/features/auth/authSlice';
import { Link } from 'react-router-dom';
import { ShoppingCartOutlined } from '@ant-design/icons';
import { Badge } from 'antd';
import { setCartItems } from '../redux/features/cart/cartSlice';

const Navbar: React.FC = () => {
  const dispatch = useDispatch();

  const isAuthenticated = useSelector((state: any) => !!state.auth.accessToken);

  const cartItems = useSelector((state: any) => state.cart.items);
  //const cartItemsStored = JSON.parse(localStorage.getItem('cartItems') || '[]');
  const userRole = JSON.parse(localStorage.getItem('user') || '{}')?.role;

  useEffect(() => {
    // Initialize Redux state with values from localStorage
    const cartItemsStored = JSON.parse(localStorage.getItem('cartItems') || '[]');
    dispatch(setCartItems(cartItemsStored));
  }, [dispatch]);

  const handleLogout = () => {
    dispatch(logout());
  };

  return (
    <nav className="navbar">
      <ul className="navbar-list">
        {!isAuthenticated ? (
          <li className="navbar-item">
            <Link to="/register" className="navbar-link">
              Register
            </Link>
          </li>
        ) : (
          <>
            <li className="navbar-item">
              <Link to="/cart" className="navbar-link">
                <Badge count={cartItems?.length}>
                  <ShoppingCartOutlined style={{ fontSize: '24px', color: 'white' }} />
                </Badge>{' '}
              </Link>
            </li>
            <li className="navbar-item">
              <Link className="navbar-link" to={'/dashboard'}>
                Dashboard
              </Link>
            </li>
            {
              userRole === 'Admin' ? (
                <li className="navbar-item">
                  <Link className="navbar-link" to={'/manage-products'}>
                    Manage products
                  </Link>
                </li>
              ) : null
            }
            <li className="navbar-item">
              <Link onClick={handleLogout} className="navbar-link" to={''}>
                Logout
              </Link>
            </li>
          </>
        )}
      </ul>
    </nav>
  );
};

export default Navbar;
