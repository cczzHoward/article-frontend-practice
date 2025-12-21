import { apiClientWithNormalizeId } from './client';
import type {
    ApiResponse,
    Article,
    ArticleListResponseData,
    Category,
    CreateArticleRequest,
    UpdateArticleRequest,
} from '@app/types';

export const getArticles = (params?: {
    keyword?: string;
    page?: number;
    limit?: number;
    category?: string; // 注意：後端接收的是分類名稱 (name)
    author?: string;
}): Promise<ApiResponse<ArticleListResponseData>> => {
    return apiClientWithNormalizeId.get('/articles/list', { params });
};

export const getLikedArticles = (params?: {
    page?: number;
    limit?: number;
}): Promise<ApiResponse<ArticleListResponseData>> => {
    return apiClientWithNormalizeId.get('/articles/liked', { params });
};

export const getArticleById = (id: string): Promise<ApiResponse<Article>> => {
    return apiClientWithNormalizeId.get(`/articles/${id}`);
};

export const getCategories = (): Promise<ApiResponse<Category[]>> => {
    return apiClientWithNormalizeId.get('/categories/list');
};

export const createArticle = (payload: CreateArticleRequest): Promise<ApiResponse<Article>> => {
    return apiClientWithNormalizeId.post('/articles', payload);
};

export const updateArticle = (
    id: string,
    payload: UpdateArticleRequest
): Promise<ApiResponse<Article>> => {
    return apiClientWithNormalizeId.patch(`/articles/${id}`, payload);
};

export const likeArticle = (id: string): Promise<ApiResponse<Article>> => {
    return apiClientWithNormalizeId.post(`/articles/${id}/like`);
};

export const unlikeArticle = (id: string): Promise<ApiResponse<Article>> => {
    return apiClientWithNormalizeId.delete(`/articles/${id}/like`);
};
