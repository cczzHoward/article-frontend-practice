import axios from 'axios';

const apiClient = axios.create({
    baseURL: 'http://localhost:8080/api/v1',
    headers: {
        'Content-Type': 'application/json',
    },
});

export const getArticles = (params?: { keyword?: string; page?: number; limit?: number }) =>
    apiClient.get('/articles/list', { params });

export const getArticleById = (id: string) => apiClient.get(`/articles/${id}`);
