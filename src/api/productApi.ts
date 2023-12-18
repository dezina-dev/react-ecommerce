import axios from 'axios';
import { toast } from "react-toastify";
import { register } from '../redux/services/authService';

const baseURL = 'http://localhost:3002/products'; // Replace with your actual API endpoint

const axiosInstance = axios.create({
  baseURL,
});

export const getProducts = async () => {
  try {
    const response = await axiosInstance.get('/get-products');
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const getProductbyId = async (productId: string) => {
  try {
    const response = await axiosInstance.get(`/get-product/${productId}`);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const uploadImage = async (formData: FormData) => {
  try {
    const response = await axiosInstance.post('/upload-image', formData);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const addProduct = async (newProduct: any) => {
  try {

    const response = await axiosInstance.post('/add-product', newProduct);
    if (response.data.success) {
      toast.success(response.data.message, {
        position: "top-right",
      });
    }
    else {
      toast.error('Error: could not delete product', {
        position: "top-right",
      });
    }
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const updateProduct = async (productId: string, updatedProduct: any) => {
  try {
    const response = await axiosInstance.put(`/update-product/${productId}`, updatedProduct);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const deleteProduct = async (productId: string) => {
  try {
    const response = await axiosInstance.delete(`/delete-product/${productId}`);
    if (response.data.success) {
      toast.success(response.data.message, {
        position: "top-right",
      });
    }
    else {
      toast.error('Error: could not delete product', {
        position: "top-right",
      });
    }
    return response.data;
  } catch (error) {
    throw error;
  }
};
