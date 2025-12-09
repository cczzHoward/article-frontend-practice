import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, Link, useLocation } from 'react-router-dom';
import { getArticleById, likeArticle, unlikeArticle } from '@app/api/article';
import { createComment, deleteComment } from '@app/api/comment';
import { useAuth } from '@app/contexts/AuthContext';
import type { Article } from '@app/types';
import Skeleton from '@app/components/ui/Skeleton';
import Alert from '@app/components/ui/Alert';
import CommentList from '@app/components/comments/CommentList';
import CommentForm from '@app/components/comments/CommentForm';

const ArticleDetailPage: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const location = useLocation();
    const { user } = useAuth();
    const [article, setArticle] = useState<Article | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [isLiked, setIsLiked] = useState(false);
    const [likesCount, setLikesCount] = useState(0);

    // 判斷來源頁面
    const fromPath = (location.state as any)?.from;
    const isFromProfile = fromPath === '/profile';
    const backLink = isFromProfile ? '/profile' : '/articles';
    const backText = isFromProfile ? 'Back to profile' : 'Back to list';

    const fetchArticle = async () => {
        try {
            if (!id) return;
            const response = await getArticleById(id);

            if (response.success) {
                setArticle(response.data);
                setLikesCount(response.data.likes_count || response.data.likes || 0);
                if (user && response.data.likedBy) {
                    setIsLiked(response.data.likedBy.includes(user.id));
                }
            }
        } catch (err) {
            console.error(err);
            setError('無法載入文章');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchArticle();
    }, [id]);

    // Update like status when user changes (e.g. login/logout)
    useEffect(() => {
        if (article && user && article.likedBy) {
            setIsLiked(article.likedBy.includes(user.id));
        } else if (!user) {
            setIsLiked(false);
        }
    }, [user, article]);

    const handleLike = async () => {
        if (!article) return;
        if (!user) {
            alert('Please login to like this article');
            return;
        }

        const prevIsLiked = isLiked;
        const prevLikesCount = likesCount;

        // Optimistic update
        setIsLiked(!prevIsLiked);
        setLikesCount(prevIsLiked ? prevLikesCount - 1 : prevLikesCount + 1);

        try {
            if (prevIsLiked) {
                await unlikeArticle(article.id);
            } else {
                await likeArticle(article.id);
            }
            // Optionally refetch to sync with server, but optimistic update is usually enough
            // await fetchArticle();
        } catch (error) {
            // Revert on error
            setIsLiked(prevIsLiked);
            setLikesCount(prevLikesCount);
            console.error('Failed to update like status', error);
        }
    };

    const handleCreateComment = async (content: string) => {
        if (!article) return;
        try {
            const response = await createComment(article.id, content);
            if (response.success) {
                await fetchArticle();
            }
        } catch (error) {
            console.error('Failed to create comment', error);
            throw error;
        }
    };

    const handleDeleteComment = async (commentId: string) => {
        if (!article) return;
        if (!window.confirm('Are you sure you want to delete this comment?')) return;

        try {
            await deleteComment(commentId);
            await fetchArticle();
        } catch (error) {
            console.error('Failed to delete comment', error);
            alert('Failed to delete comment');
        }
    };

    // 檢查當前使用者是否為文章作者
    const isAuthor =
        user &&
        article &&
        (user.id === article.author?.id || user.username === article.author?.username);

    // 編輯圖標 SVG
    const EditIcon = (
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
            />
        </svg>
    );

    if (loading)
        return (
            <div className="max-w-4xl mx-auto mt-8">
                <Skeleton count={1} height="h-96" />
            </div>
        );
    if (error)
        return (
            <div className="max-w-4xl mx-auto mt-8">
                <Alert message={error} />
            </div>
        );
    if (!article)
        return (
            <div className="max-w-4xl mx-auto mt-8">
                <Alert message="文章不存在" />
            </div>
        );

    return (
        <div className="max-w-4xl mx-auto mt-8">
            <button
                onClick={() => navigate(backLink)}
                className="mb-6 text-sm text-slate-400 hover:text-primary transition-colors flex items-center gap-1"
            >
                ← {backText}
            </button>

            <article className="bg-surface border border-slate-700 rounded-xl p-8 shadow-sm">
                {/* Header */}
                <header className="mb-8 border-b border-slate-700 pb-6">
                    <div className="flex items-start justify-between gap-4 mb-4">
                        <h1 className="text-3xl md:text-4xl font-bold text-slate-100 flex-1">
                            {article.title}
                        </h1>
                        {isAuthor && (
                            <Link
                                to={`/articles/${id}/edit`}
                                className="flex items-center gap-2 px-4 py-2 bg-primary hover:bg-primary/90 text-white rounded-lg transition-colors whitespace-nowrap text-sm font-medium"
                            >
                                {EditIcon}
                                Edit
                            </Link>
                        )}
                    </div>

                    <div className="flex items-center gap-4 text-sm text-slate-400">
                        <span className="font-medium text-primary">
                            @{article.author?.username}
                        </span>
                        <span>•</span>
                        <span>{new Date(article.created_at).toLocaleDateString()}</span>
                        {article.category && (
                            <>
                                <span>•</span>
                                <span className="bg-slate-800 px-2 py-1 rounded text-xs border border-slate-700">
                                    {typeof article.category === 'object'
                                        ? article.category.name
                                        : article.category}
                                </span>
                            </>
                        )}
                    </div>

                    {/* Like Button */}
                    <div className="mt-6 flex items-center">
                        <button
                            onClick={handleLike}
                            className={`flex items-center gap-2 rounded-full px-4 py-2 transition-all border ${
                                isLiked
                                    ? 'bg-red-500/10 border-red-500/50 text-red-400'
                                    : 'bg-slate-800/50 border-slate-700 text-slate-400 hover:bg-slate-800 hover:text-slate-200'
                            }`}
                        >
                            {isLiked ? (
                                <svg className="w-5 h-5" viewBox="0 0 20 20" fill="currentColor">
                                    <path
                                        fillRule="evenodd"
                                        d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z"
                                        clipRule="evenodd"
                                    />
                                </svg>
                            ) : (
                                <svg
                                    className="w-5 h-5"
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={1.5}
                                        d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                                    />
                                </svg>
                            )}
                            <span className="font-medium">{likesCount} Likes</span>
                        </button>
                    </div>
                </header>

                {/* Content */}
                <div className="prose prose-invert max-w-none text-slate-300 leading-8 whitespace-pre-wrap">
                    {article.content}
                </div>
            </article>

            {/* Comments Section */}
            <div className="mt-8 bg-surface border border-slate-700 rounded-xl p-8 shadow-sm">
                <h3 className="text-lg font-bold text-white mb-6">
                    Comments ({article.comments?.length || 0})
                </h3>

                {user ? (
                    <CommentForm onSubmit={handleCreateComment} />
                ) : (
                    <div className="mb-8 p-4 bg-slate-800/50 rounded-lg text-center text-slate-400 border border-slate-700">
                        Please{' '}
                        <Link to="/login" className="text-primary hover:underline">
                            log in
                        </Link>{' '}
                        to leave a comment.
                    </div>
                )}

                <CommentList comments={article.comments || []} onDelete={handleDeleteComment} />
            </div>
        </div>
    );
};

export default ArticleDetailPage;
