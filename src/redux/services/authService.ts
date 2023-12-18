import axios, { AxiosInstance } from 'axios';

const baseURL = 'http://localhost:3001/user';

const axiosInstance: AxiosInstance = axios.create({
  baseURL,
});

export const register = (payload: any) => axiosInstance.post('/register', payload);
export const login = (payload: any) => axiosInstance.post('/login', payload);
