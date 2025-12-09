import axios from 'axios';
import type { ApiResponse, Comment } from '@app/types';

// 遞迴將 MongoDB 的 _id 映射為 id
const normalizeId = (data: any): any => {
    if (Array.isArray(data)) return data.map(normalizeId);
    if (data !== null && typeof data === 'object') {
        const newObj = { ...data };
        if (newObj._id && !newObj.id) newObj.id = newObj._id;

        Object.keys(newObj).forEach((key) => {
            newObj[key] = normalizeId(newObj[key]);
        });
        return newObj;
    }
    return data;
};

const apiClient = axios.create({
    baseURL: import.meta.env.VITE_API_URL || 'http://localhost:8080/api/v1',
    headers: { 'Content-Type': 'application/json' },
});

apiClient.interceptors.request.use((config) => {
    const token = localStorage.getItem('auth_token');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

apiClient.interceptors.response.use(
    (response) => normalizeId(response.data),
    (error) => Promise.reject(error)
);

export const createComment = (
    articleId: string,
    content: string
): Promise<ApiResponse<Comment>> => {
    return apiClient.post(`/comments/${articleId}`, { content });
};

export const deleteComment = (commentId: string): Promise<ApiResponse<void>> => {
    return apiClient.delete(`/comments/${commentId}`);
};
