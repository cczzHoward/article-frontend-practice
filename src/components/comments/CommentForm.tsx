import React, { useState } from 'react';
import Alert from '../ui/Alert';

interface CommentFormProps {
    onSubmit: (content: string) => Promise<void>;
}

const CommentForm: React.FC<CommentFormProps> = ({ onSubmit }) => {
    const [content, setContent] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!content.trim()) return;

        setLoading(true);
        setError('');
        try {
            await onSubmit(content);
            setContent('');
        } catch (err) {
            setError('Failed to post comment');
        } finally {
            setLoading(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="mb-8">
            <h3 className="text-lg font-bold text-white mb-4">Leave a comment</h3>
            {error && <Alert type="error" message={error} className="mb-4" />}
            <div className="mb-4">
                <textarea
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    className="w-full bg-surface border border-slate-700 rounded-lg p-4 text-white focus:outline-none focus:border-primary min-h-[100px]"
                    placeholder="Write your thoughts..."
                    disabled={loading}
                />
            </div>
            <div className="flex justify-end">
                <button
                    type="submit"
                    disabled={loading || !content.trim()}
                    className="bg-primary hover:bg-primary/90 text-white font-bold py-2 px-6 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
                >
                    {loading ? 'Posting...' : 'Post Comment'}
                </button>
            </div>
        </form>
    );
};

export default CommentForm;
