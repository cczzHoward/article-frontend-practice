import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, Link, useLocation } from 'react-router-dom';
import { getArticleById } from '@app/api/article';
import { useAuth } from '@app/contexts/AuthContext';
import type { Article } from '@app/types';
import Skeleton from '@app/components/ui/Skeleton';
import Alert from '@app/components/ui/Alert';

const ArticleDetailPage: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const location = useLocation();
    const { user } = useAuth();
    const [article, setArticle] = useState<Article | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    // 判斷來源頁面
    const fromPath = (location.state as any)?.from;
    const isFromProfile = fromPath === '/profile';
    const backLink = isFromProfile ? '/profile' : '/articles';
    const backText = isFromProfile ? 'Back to profile' : 'Back to list';

    useEffect(() => {
        const fetchArticle = async () => {
            try {
                if (!id) return;
                const response = await getArticleById(id);

                if (response.success) {
                    setArticle(response.data);
                }
            } catch (err) {
                console.error(err);
                setError('無法載入文章');
            } finally {
                setLoading(false);
            }
        };
        fetchArticle();
    }, [id]);

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
                </header>

                {/* Content */}
                <div className="prose prose-invert max-w-none text-slate-300 leading-8 whitespace-pre-wrap">
                    {article.content}
                </div>
            </article>
        </div>
    );
};

export default ArticleDetailPage;
