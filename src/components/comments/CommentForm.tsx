import React, { useState } from 'react';
import Alert from '../ui/Alert';

interface CommentFormProps {
    onSubmit: (content: string) => Promise<void>;
}

const CommentForm: React.FC<CommentFormProps> = ({ onSubmit }) => {
    const [content, setContent] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [isExpanded, setIsExpanded] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!content.trim()) return;

        setLoading(true);
        setError('');
        try {
            await onSubmit(content);
            setContent('');
            setIsExpanded(false);
        } catch (err) {
            setError('Failed to post comment');
        } finally {
            setLoading(false);
        }
    };

    const handleCancel = () => {
        setIsExpanded(false);
        setContent('');
        setError('');
    };

    return (
        <form onSubmit={handleSubmit} className="mb-8">
            {error && <Alert type="error" message={error} className="mb-4" />}
            <div className="mb-4">
                <textarea
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    onFocus={() => setIsExpanded(true)}
                    className={`w-full bg-surface border border-slate-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-primary transition-all duration-300 ease-in-out ${
                        isExpanded ? 'min-h-[120px]' : 'min-h-[50px] resize-none overflow-hidden'
                    }`}
                    placeholder="Leave a comment..."
                    disabled={loading}
                />
            </div>

            {isExpanded && (
                <div className="flex justify-end gap-3 animate-fade-in">
                    <button
                        type="button"
                        onClick={handleCancel}
                        disabled={loading}
                        className="px-4 py-2 text-slate-300 hover:text-white transition-colors cursor-pointer"
                    >
                        Cancel
                    </button>
                    <button
                        type="submit"
                        disabled={loading || !content.trim()}
                        className="bg-primary hover:bg-primary/90 text-white font-bold py-2 px-6 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
                    >
                        {loading ? 'Posting...' : 'Post Comment'}
                    </button>
                </div>
            )}
        </form>
    );
};

export default CommentForm;
