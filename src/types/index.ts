export interface Category {
    id: string;
    name: string;
    created_at: string;
    updated_at: string;
}

export interface Author {
    id: string;
    username: string;
    avatar?: string; // Extended for UI
}

export interface Article {
    id: string;
    title: string;
    content: string;
    author: Author;
    category?: { name: string; id?: string };
    tags?: string[]; // Extended for UI (Dev.to style tags)
    cover_image?: string; // Extended for UI
    likes?: number; // Extended for UI
    comments_count?: number; // Extended for UI
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
