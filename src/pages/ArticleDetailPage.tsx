import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
// 修改引用來源
import { getArticleById } from '@app/api/article';
import type { Article } from '@app/types';

const ArticleDetailPage: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const [article, setArticle] = useState<Article | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchArticle = async () => {
            try {
                if (!id) return;
                // 修改呼叫方式
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

    if (loading) return <div className="text-center py-20 text-slate-400">Loading...</div>;
    if (error) return <div className="text-center py-20 text-red-400">{error}</div>;
    if (!article) return <div className="text-center py-20 text-slate-400">文章不存在</div>;

    return (
        <div className="max-w-4xl mx-auto mt-8">
            <button
                onClick={() => navigate(-1)}
                className="mb-6 text-sm text-slate-400 hover:text-primary transition-colors flex items-center gap-1"
            >
                ← Back to list
            </button>

            <article className="bg-surface border border-slate-700 rounded-xl p-8 shadow-sm">
                {/* Header */}
                <header className="mb-8 border-b border-slate-700 pb-6">
                    <h1 className="text-3xl md:text-4xl font-bold text-slate-100 mb-4">
                        {article.title}
                    </h1>

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
