import axios from 'axios';
import type {
    ApiResponse,
    Article,
    ArticleListResponseData,
    Category,
    CreateArticleRequest,
    UpdateArticleRequest,
} from '@app/types';

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

export const getArticles = (params?: {
    keyword?: string;
    page?: number;
    limit?: number;
    category?: string; // 注意：後端接收的是分類名稱 (name)
    author?: string;
}): Promise<ApiResponse<ArticleListResponseData>> => {
    return apiClient.get('/articles/list', { params });
};

export const getArticleById = (id: string): Promise<ApiResponse<Article>> => {
    return apiClient.get(`/articles/${id}`);
};

export const getCategories = (): Promise<ApiResponse<Category[]>> => {
    return apiClient.get('/categories/list');
};

export const createArticle = (payload: CreateArticleRequest): Promise<ApiResponse<Article>> => {
    return apiClient.post('/articles', payload);
};

export const updateArticle = (
    id: string,
    payload: UpdateArticleRequest
): Promise<ApiResponse<Article>> => {
    return apiClient.patch(`/articles/${id}`, payload);
};

export const likeArticle = (id: string): Promise<ApiResponse<Article>> => {
    return apiClient.post(`/articles/${id}/like`);
};

export const unlikeArticle = (id: string): Promise<ApiResponse<Article>> => {
    return apiClient.delete(`/articles/${id}/like`);
};
