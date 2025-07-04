import React, { useState, useEffect } from 'react';
import { getArticles } from '../api/article';
import ArticleCard from '@app/components/ArticleCard';
import '@app/styles/HomePage.scss';

const HomePage: React.FC = () => {
    const [articles, setArticles] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchArticles = async () => {
            try {
                const response = await getArticles({ page: 1, limit: 10 });
                setArticles(response.data.data.data); // 確保後端返回的數據結構正確
            } catch (error) {
                console.error('Error fetching articles:', error);
            } finally {
                setLoading(false);
            }
        };
        fetchArticles();
    }, []);

    return (
        <div className="homepage-container">
            <h1>最新文章</h1>
            {loading ? (
                <p>Loading...</p>
            ) : (
                <div>
                    {articles.map((article) => (
                        <ArticleCard
                            key={article.id}
                            id={article.id}
                            title={article.title}
                            content={article.content}
                            author={article.author.username}
                        />
                    ))}
                </div>
            )}
        </div>
    );
};

export default HomePage;
