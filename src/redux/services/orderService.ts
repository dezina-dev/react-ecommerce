import axios from 'axios';

const baseURL = 'http://localhost:3002/order';

export const createOrder = async (userId: string, items: any[], totalPrice: number, cartId: string) => {
  try {
    const response = await axios.post(`${baseURL}/create-order`, { userId, items, totalPrice, cartId });
    localStorage.removeItem('cartItems');
    localStorage.removeItem('orderPayload');
    setTimeout(() => {
      window.location.reload()
    }, 1000)
    return response.data;
  } catch (error) {
    console.error('Error creating order:', error);
    throw error;
  }
};

export const createPayments = async (paymentsData: any) => {
  try {

    const response = await axios.post(`${baseURL}/create-checkout-session`, paymentsData);

    return response.data;
  } catch (error) {
    console.error('Error processing payments:', error);
    throw error;
  }
};
