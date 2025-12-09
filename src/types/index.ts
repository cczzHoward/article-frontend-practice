export interface Category {
    id: string;
    name: string;
    created_at: string;
    updated_at: string;
}

export interface Author {
    id: string;
    username: string;
    avatar?: string;
}

export interface Comment {
    id: string;
    content: string;
    user: Author;
    created_at: string;
}

export interface Article {
    id: string;
    title: string;
    content: string;
    author: Author;
    category?: { name: string; id?: string };
    tags?: string[];
    cover_image?: string;
    likes?: number;
    comments_count?: number;
    comments?: Comment[];
    created_at: string;
    updated_at: string;
}

export interface ArticleListResponseData {
    total: number;
    page: number;
    limit: number;
    data: Article[];
}

export interface ApiResponse<T> {
    success: boolean;
    message?: string;
    data: T;
}

// Navigation Item Type
export interface NavItem {
    label: string;
    path: string;
    icon?: React.ReactNode;
}

// ============ Auth Types ============
export interface LoginRequest {
    username: string;
    password: string;
}

export interface RegisterRequest {
    username: string;
    password: string;
}

export interface AuthResponse {
    token: string;
}

export interface User {
    id: string;
    username: string;
    role: 'admin' | 'user';
}

// ============ Article Mutation Types ============
export interface CreateArticleRequest {
    title: string;
    content: string;
    category: string; // backend expects category name
}

export interface UpdateArticleRequest {
    title?: string;
    content?: string;
}
