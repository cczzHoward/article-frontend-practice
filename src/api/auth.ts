import axios from 'axios';
import type { ApiResponse, LoginRequest, RegisterRequest, AuthResponse, User } from '@app/types';

const apiClient = axios.create({
    baseURL: import.meta.env.VITE_API_URL || 'http://localhost:8080/api/v1',
    headers: { 'Content-Type': 'application/json' },
});

// Request Interceptor: 自動帶入 Token
apiClient.interceptors.request.use((config) => {
    const token = localStorage.getItem('auth_token');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

// Response Interceptor: 處理 401 (Token 過期)
apiClient.interceptors.response.use(
    (response) => response.data,
    (error) => {
        if (error.response?.status === 401) {
            localStorage.removeItem('auth_token');
            window.location.href = '/login';
        }
        return Promise.reject(error);
    }
);

// 登入
export const login = (data: LoginRequest): Promise<ApiResponse<AuthResponse>> => {
    return apiClient.post('/users/login', data);
};

// 註冊
export const register = (data: RegisterRequest): Promise<ApiResponse<AuthResponse>> => {
    return apiClient.post('/users/register', data);
};

// 取得目前使用者資訊
export const getCurrentUser = (): Promise<ApiResponse<User>> => {
    return apiClient.get('/users/me');
};

// 登出 (前端清除 Token)
export const logout = (): void => {
    localStorage.removeItem('auth_token');
    window.location.href = '/login';
};
