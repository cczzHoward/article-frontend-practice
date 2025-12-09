import React, { useEffect, useState } from 'react';
import { useAuth } from '@app/contexts/AuthContext';
import { getArticles } from '@app/api/article';
import ArticleCard from '@app/components/ArticleCard';
import type { Article } from '@app/types';

const ProfilePage: React.FC = () => {
    const { user } = useAuth();
    const [articles, setArticles] = useState<Article[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchMyArticles = async () => {
            if (!user) return;
            try {
                setLoading(true);
                const response = await getArticles({ author: user.id });
                if (response.success) {
                    setArticles(response.data.data);
                }
            } catch (err) {
                console.error('Failed to fetch articles', err);
                setError('無法載入文章');
            } finally {
                setLoading(false);
            }
        };

        fetchMyArticles();
    }, [user]);

    if (!user) {
        return <div className="text-white text-center mt-10">請先登入</div>;
    }

    return (
        <div className="max-w-4xl mx-auto">
            {/* Profile Header */}
            <div className="bg-surface border border-slate-700 rounded-lg p-8 mb-8 flex items-center gap-6">
                <div className="h-24 w-24 rounded-full bg-primary/20 flex items-center justify-center text-3xl font-bold text-primary border-2 border-primary">
                    {user.username.charAt(0).toUpperCase()}
                </div>
                <div>
                    <h1 className="text-3xl font-bold text-white mb-2">{user.username}</h1>
                    <div className="flex gap-4 text-slate-400 text-sm">
                        <span className="bg-slate-800 px-3 py-1 rounded-full border border-slate-700">
                            {user.role === 'admin' ? '管理員' : '一般會員'}
                        </span>
                        <span className="flex items-center">
                            <span className="font-bold text-white mr-1">{articles.length}</span>{' '}
                            篇文章
                        </span>
                    </div>
                </div>
            </div>

            {/* Articles List */}
            <h2 className="text-xl font-bold text-white mb-4 border-l-4 border-primary pl-3">
                我的文章
            </h2>

            {loading ? (
                <div className="text-slate-400 text-center py-10">載入中...</div>
            ) : error ? (
                <div className="text-red-400 text-center py-10">{error}</div>
            ) : articles.length === 0 ? (
                <div className="text-slate-400 text-center py-10 bg-surface/50 rounded-lg border border-slate-800 border-dashed">
                    尚未發布任何文章
                </div>
            ) : (
                <div className="grid gap-4">
                    {articles.map((article) => (
                        <ArticleCard key={article.id} article={article} />
                    ))}
                </div>
            )}
        </div>
    );
};

export default ProfilePage;
