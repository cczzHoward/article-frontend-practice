import { apiClientWithNormalizeId } from './client';
import type { ApiResponse, Comment } from '@app/types';

export const createComment = (
    articleId: string,
    content: string
): Promise<ApiResponse<Comment>> => {
    return apiClientWithNormalizeId.post(`/comments/${articleId}`, { content });
};

export const deleteComment = (commentId: string): Promise<ApiResponse<void>> => {
    return apiClientWithNormalizeId.delete(`/comments/${commentId}`);
};
