import type { Comment } from './comment';

export interface Article {
    id: string;
    title: string;
    content: string;
    author: Author;
    category?: { name: string; id?: string };
    tags?: string[];
    cover_image?: string;
    likes?: number;
    likes_count?: number;
    likedBy?: string[];
    comments_count?: number;
    comments?: Comment[];
    created_at: string;
    updated_at: string;
}

export interface Author {
    id: string;
    username: string;
    avatar?: string;
}

export interface ArticleListResponseData {
    total: number;
    page: number;
    limit: number;
    data: Article[];
}

export interface CreateArticleRequest {
    title: string;
    content: string;
    category: string;
    tags?: string[];
    cover_image?: string;
}

export interface UpdateArticleRequest {
    title?: string;
    content?: string;
    tags?: string[];
    cover_image?: string;
}
