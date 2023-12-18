import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { Card, Button, Carousel } from 'antd';
import useTokenExpirationCheck from '../hooks/useTokenExpirationCheck';
import { RootState } from '../redux/store';
import { setProducts } from '../redux/features/products/productsSlice';
import { getProducts } from '../redux/services/productsService';
import { addToCartService, getCartItems } from '../redux/services/cartService';
import { addToCart, setCartItems } from '../redux/features/cart/cartSlice';
import '../css/ProductsList.css';
import { logout } from '../redux/features/auth/authSlice';
import slide1 from '../assets/slide1.jpg'
import slide2 from '../assets/slide2.jpg'
import slide3 from '../assets/slide3.jpg'
import slide4 from '../assets/slide4.jpg'

const { Meta } = Card;

const contentStyle: React.CSSProperties = {
  width: '100%', // Set width to 100% for full width
  height: 'auto', // Allow the height to adjust based on the image's aspect ratio
  maxHeight: '300px', // Set a maximum height to control the size
  color: '#fff',
  textAlign: 'center',
  background: '#364d79',
  objectFit: 'contain'
};

const Dashboard: React.FC = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { tokenExpiration } = useTokenExpirationCheck();
  const products = useSelector((state: RootState) => state.products.products);
  const storeduser = localStorage.getItem('user');
  const user = storeduser ? JSON.parse(storeduser) : null;

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await getProducts();
        dispatch(setProducts(response.data));
      } catch (error) {
        console.error('Error fetching products:', error);
      }
    };

    if (tokenExpiration && Date.now() > tokenExpiration) {
      dispatch(logout());
      navigate('/login');
    } else {
      fetchProducts();
    }
  }, [dispatch, navigate, tokenExpiration]);

  const handleBuyNow = () => {
    navigate('/payment');
  };

  const handleAddToCart = async (productId: string) => {
    try {
      const userId = user?._id;

      // Call addToCartService to add the item to the cart
      await addToCartService(userId, productId, 1);

      // Dispatch addToCart action to update the local state
      dispatch(addToCart({ productId, quantity: 1 }));

      // Fetch the latest cart items
      const response = await getCartItems(userId);

      // Save the latest cart items in local storage
      dispatch(setCartItems(response.data));
      localStorage.setItem('cartItems', JSON.stringify(response.data));
    } catch (error) {
      console.error('Error adding to cart:', error);
    }
  };

  return (
    <div>
      <Carousel autoplay>
        <div>
          <img src={slide1} alt='slide1' style={contentStyle} />
        </div>
        <div>
          <img src={slide2} alt='slide2' style={contentStyle} />
        </div>
        <div>
          <img src={slide3} alt='slide3' style={contentStyle} />
        </div>
        <div>
          <img src={slide4} alt='slide4' style={contentStyle} />
        </div>
      </Carousel>
      <div className="product-list">
        {products.map((product) => (
          <Card key={product._id} className="product-card">
            <img className="product-image" alt={product.name} src={product.image} />
            <div className="product-details">
              <p className="product-title">{product.name}</p>
              <p className="product-price">Price: Rs. {product.price}</p>
              <Button type="dashed" onClick={() => handleBuyNow()}>
                Buy Now
              </Button>
              <Button type="primary" onClick={() => handleAddToCart(product._id)}>Add to Cart</Button>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default Dashboard;
