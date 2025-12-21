import axios from 'axios';
import { normalizeId } from './utils/normalizeId';

// 基本 axios 設定
const baseConfig = {
    baseURL: import.meta.env.VITE_API_URL || 'http://localhost:8080/api/v1',
    headers: { 'Content-Type': 'application/json' },
};

// 不做 normalizeId 的 client
export const apiClient = axios.create(baseConfig);
apiClient.interceptors.request.use((config) => {
    const token = localStorage.getItem('auth_token');
    if (token) config.headers.Authorization = `Bearer ${token}`;
    return config;
});
apiClient.interceptors.response.use(
    (response) => response.data,
    (error) => {
        if (error.response?.status === 401) {
            localStorage.removeItem('auth_token');
        }
        return Promise.reject(error);
    }
);

// 需要 normalizeId 的 client
export const apiClientWithNormalizeId = axios.create(baseConfig);
apiClientWithNormalizeId.interceptors.request.use((config) => {
    const token = localStorage.getItem('auth_token');
    if (token) config.headers.Authorization = `Bearer ${token}`;
    return config;
});
apiClientWithNormalizeId.interceptors.response.use(
    (response) => normalizeId(response.data),
    (error) => {
        if (error.response?.status === 401) {
            localStorage.removeItem('auth_token');
        }
        return Promise.reject(error);
    }
);
