import type { Author } from './article';

export interface Comment {
    id: string;
    content: string;
    user: Author;
    created_at: string;
}
