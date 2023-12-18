import axios, { AxiosInstance } from 'axios';

const baseURL = 'http://localhost:3002/cart';

const axiosInstance: AxiosInstance = axios.create({
  baseURL,
});

export const getCartItems = (userId: string) => axiosInstance.get(`/get-cart/${userId}`);
export const addToCartService = (userId: string, productId: string, quantity: number) =>
  axiosInstance.post(`/add-to-cart/${userId}`, { productId, quantity });
export const removeFromCartService = (userId: string, productId: string) =>
  axiosInstance.delete(`/remove-item/${userId}/${productId}`);
export const updateCartItemService = (userId: string, productId: string, action: 'increment' | 'decrement') =>
  axiosInstance.put(`/update-cart/${userId}/${productId}/${action}`);