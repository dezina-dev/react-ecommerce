import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router';
import { loadStripe } from '@stripe/stripe-js';
import { RootState } from '../redux/store';
import CartItem from '../pages/CartItem';
import { incrementItem, decrementItem, removeItem, setCartItems } from '../redux/features/cart/cartSlice';
import { createPayments } from '../redux/services/orderService';
import emptyCart from '../assets/empty-cart.png';
import { getCartItems, removeFromCartService, updateCartItemService } from '../redux/services/cartService';

const storeduser = localStorage.getItem('user');
const user = storeduser ? JSON.parse(storeduser) : null;
const userId = user?._id;
console.log('userId', userId)
const stripePromise = loadStripe("pk_test_51ONVBLSFbdVcxDmemPF23TmV57uUZDS15qP6i8q3mbq5fcvJqnBzu4ObTMV4Rq6T3ITGfTLHKrFrjTdfiHizhPq000lJj6ZZKq");

const Cart: React.FC = () => {
  const dispatch = useDispatch();
  const cartItems = useSelector((state: RootState) => state.cart.items);

  useEffect(() => {
    const cartItemsStored = JSON.parse(localStorage.getItem('cartItems') || '[]');
    dispatch(setCartItems(cartItemsStored));
  }, [dispatch]);

  const handleIncrement = (productId: string, user_id: string) => {
    updateCartItemService(user_id, productId, 'increment')
      .then((response: any) => {
        // Handle success if needed
      })
      .catch((error) => {
        console.error('Error removing item from cart:', error);
      });
    dispatch(incrementItem(productId));
    fetchCart();
  };

  const handleDecrement = (productId: string, user_id: string) => {
    updateCartItemService(user_id, productId, 'decrement')
      .then((response: any) => {
        // Handle success if needed
      })
      .catch((error) => {
        console.error('Error removing item from cart:', error);
      });
    dispatch(decrementItem(productId));
    fetchCart();
  };

  const handleRemove = (productId: string, user_id: string) => {
    dispatch(removeItem(productId));
    updateLocalStorage();
    // Remove from the server-side (database)
    removeFromCartService(user_id, productId)
      .then((response: any) => {
        // Handle success if needed
      })
      .catch((error) => {
        console.error('Error removing item from cart:', error);
      });
  };

  const updateLocalStorage = () => {
    // Update localStorage with the current Redux state
    localStorage.setItem('cartItems', JSON.stringify(cartItems));
  };

  const fetchCart = async () => {
    // Fetch the latest cart items
    const response = await getCartItems(userId);

    // Save the latest cart items in local storage
    dispatch(setCartItems(response.data));
  }

  const [paydetails, setPaydetails] = useState<{ [key: string]: any }>({});

  useEffect(() => {
    setPaydetails({
      product_name: "ponds cream",
      price: 500 * 100,
      quantity: 1
    });
  }, []);

  const handleFinalCheckout = async () => {
    try {
      let productArray: { productId: string; quantity: number }[] = [];
      let cart_id = '';
      let user_id = '';
      let total = 0;

      cartItems.forEach((item: any) => {
        user_id = item.userId;
        cart_id = item._id;
        total += item.items.productData[0].price;

        productArray.push({
          productId: item.items.productId,
          quantity: item.items.quantity
        });
      });

      const payload = {
        userId: user_id,
        items: productArray,
        totalPrice: total,
        cartId: cart_id
      };

      localStorage.setItem('orderPayload', JSON.stringify(payload));

      const stripe: any = await stripePromise;

      const paymentResponses = await createPayments(cartItems);

      const result = stripe.redirectToCheckout({
        sessionId: paymentResponses.data.id,
      });

    } catch (error) {
      console.error('Error:', error);
    }
  };

  return (
    <>
      {cartItems.length === 0 ? (
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
          <img src={emptyCart} alt='empty cart' style={{ width: '400px', height: '400px', objectFit: 'contain' }} />
        </div>
      ) : (
        <div>
          <h3>Your Cart</h3>
          {cartItems.map((item: any) => (
            <CartItem
              key={item.productId}
              item={item}
              onIncrement={handleIncrement}
              onDecrement={handleDecrement}
              onRemove={handleRemove}
            />
          ))}
          <button onClick={handleFinalCheckout}>Final Checkout</button>
        </div>
      )}
    </>
  );
};

export default Cart;
