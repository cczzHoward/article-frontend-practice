import React, { useState, useEffect } from 'react';
import { getArticles } from '../api/article';

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
        <div>
            <h1>部落格文章</h1>
            {loading ? (
                <p>Loading...</p>
            ) : (
                <ul>
                    {articles.map((article) => (
                        <li key={article.id}>
                            <h2>{article.title}</h2>
                            <p>{article.content.slice(0, 100)}...</p>
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
};

export default HomePage;
