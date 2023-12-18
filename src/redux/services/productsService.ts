import axios, { AxiosInstance } from 'axios';

const baseURL = 'http://localhost:3002/products';

const axiosInstance: AxiosInstance = axios.create({
  baseURL,
});

export const getProducts = () => axiosInstance.get('/get-products');
