import axios from 'axios';
import type { ApiResponse, Article, ArticleListResponseData, Category } from '@app/types';

// ==========================================
// 1. 工具函式：解決 MongoDB _id 問題
// ==========================================
const normalizeId = (data: any): any => {
    if (Array.isArray(data)) {
        return data.map(normalizeId);
    }
    if (data !== null && typeof data === 'object') {
        const newObj = { ...data };
        // 如果有 _id 但沒有 id，就補上 id
        if (newObj._id && !newObj.id) {
            newObj.id = newObj._id;
        }
        // 遞迴處理所有屬性
        Object.keys(newObj).forEach((key) => {
            newObj[key] = normalizeId(newObj[key]);
        });
        return newObj;
    }
    return data;
};

// ==========================================
// 2. Axios 設定
// ==========================================
const apiClient = axios.create({
    baseURL: 'http://localhost:8080/api/v1',
    headers: {
        'Content-Type': 'application/json',
    },
});

// Interceptor: 自動解包 + ID 轉換
apiClient.interceptors.response.use(
    (response) => {
        return normalizeId(response.data);
    },
    (error) => {
        return Promise.reject(error);
    }
);

// ==========================================
// 3. API Functions (Pure API Calls)
// ==========================================

// 注意：參數改為物件形式，方便擴充
export const getArticles = (params?: {
    keyword?: string;
    page?: number;
    limit?: number;
    category?: string; // 後端 API 接收的是分類名稱 (name)
}): Promise<ApiResponse<ArticleListResponseData>> => {
    return apiClient.get('/articles/list', { params });
};

export const getArticleById = (id: string): Promise<ApiResponse<Article>> => {
    return apiClient.get(`/articles/${id}`);
};

export const getCategories = (): Promise<ApiResponse<Category[]>> => {
    return apiClient.get('/categories/list');
};
