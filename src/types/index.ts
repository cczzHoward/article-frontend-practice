export interface Category {
    id: string;
    name: string;
    created_at: string;
    updated_at: string;
}

export interface Article {
    id: string;
    title: string;
    content: string;
    author: {
        id: string;
        username: string;
    };
    category: {
        name: string;
    };
    created_at: string;
    updated_at: string;
}
