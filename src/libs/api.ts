import axios from 'axios'
import { useAuthStore } from '@/stores/AuthStore';

//todo substituir por env.backurl
export const api = axios.create({
    baseURL: "http://localhost:3000"
})

api.interceptors.request.use((config) => {
    const token = useAuthStore.getState().token;
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
}, (error) => {
    return Promise.reject(error);
});

api.interceptors.response.use((response) => {
    return response;
}, (error) => {
    if (error.response?.status === 401) {
        useAuthStore.getState().logout();
    }
    return Promise.reject(error);
});
