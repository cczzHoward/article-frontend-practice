import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { getArticleById } from '@app/api/article';
import type { Article } from '@app/types';
import { format } from 'date-fns';
import { zhTW } from 'date-fns/locale';
import '@app/styles/ArticleDetailPage.scss';

const ArticleDetailPage: React.FC = () => {
    // useParams a-hook 可以從 URL 中取得動態參數 (例如 :id)
    const { id } = useParams<{ id: string }>();
    const [article, setArticle] = useState<Article | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (!id) return;

        const fetchArticle = async () => {
            try {
                setLoading(true);
                const response = await getArticleById(id);
                setArticle(response.data.data);
            } catch (err) {
                setError('無法載入文章，請稍後再試。');
                console.error(err);
            } finally {
                setLoading(false);
            }
        };

        fetchArticle();
    }, [id]); // 當 id 改變時，重新執行這個 effect

    if (loading) {
        // 這裡也可以換成更精緻的骨架屏
        return <div className="loading-container">正在載入文章...</div>;
    }

    if (error) {
        return <div className="error-container">{error}</div>;
    }

    if (!article) {
        return <div className="error-container">找不到這篇文章。</div>;
    }

    return (
        <div className="article-detail-container">
            <h1 className="article-title">{article.title}</h1>
            <div className="article-meta">
                <span className="author">作者：{article.author.username}</span>
                <span className="publish-date">
                    發布於：
                    {format(new Date(article.created_at), 'yyyy年MM月dd日', { locale: zhTW })}
                </span>
            </div>
            <div className="article-content">
                {/* 為了安全，直接顯示文字內容。如果內容是 HTML，需要特殊處理 */}
                <p>{article.content}</p>
            </div>
        </div>
    );
};

export default ArticleDetailPage;
