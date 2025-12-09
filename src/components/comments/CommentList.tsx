import React from 'react';
import { useAuth } from '@app/contexts/AuthContext';
import type { Comment } from '@app/types';

interface CommentListProps {
    comments: Comment[];
    onDelete: (commentId: string) => Promise<void>;
}

const CommentList: React.FC<CommentListProps> = ({ comments, onDelete }) => {
    const { user } = useAuth();

    if (comments.length === 0) {
        return (
            <div className="text-center py-8 text-slate-400 border-t border-slate-800">
                No comments yet. Be the first to share your thoughts!
            </div>
        );
    }

    return (
        <div className="space-y-6 border-t border-slate-800 pt-8">
            <h3 className="text-lg font-bold text-white mb-4">Comments ({comments.length})</h3>
            {comments.map((comment) => {
                const isAuthor = user && user.id === comment.user.id;
                const dateStr = new Date(comment.created_at).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'short',
                    day: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit',
                });

                return (
                    <div key={comment.id} className="flex gap-4">
                        <div className="flex-shrink-0">
                            <div className="h-10 w-10 rounded-full bg-slate-700 flex items-center justify-center text-slate-300 font-bold border border-slate-600">
                                {comment.user.username.charAt(0).toUpperCase()}
                            </div>
                        </div>
                        <div className="flex-grow">
                            <div className="bg-surface border border-slate-700 rounded-lg p-4">
                                <div className="flex justify-between items-start mb-2">
                                    <div>
                                        <span className="font-bold text-white mr-2">
                                            {comment.user.username}
                                        </span>
                                        <span className="text-xs text-slate-400">{dateStr}</span>
                                    </div>
                                    {isAuthor && (
                                        <button
                                            onClick={() => onDelete(comment.id)}
                                            className="text-slate-400 hover:text-red-400 text-sm transition-colors cursor-pointer"
                                        >
                                            Delete
                                        </button>
                                    )}
                                </div>
                                <p className="text-slate-300 whitespace-pre-wrap">
                                    {comment.content}
                                </p>
                            </div>
                        </div>
                    </div>
                );
            })}
        </div>
    );
};

export default CommentList;
