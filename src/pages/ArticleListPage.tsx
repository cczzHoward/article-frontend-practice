import React, { useState, useEffect } from 'react';
import { getArticles, getCategories } from '@app/api/article';
import ArticleCard from '@app/components/ArticleCard';
import '@app/styles/ArticleListPage.scss';
import type { Category, Article } from '@app/types';

const ArticleListPage: React.FC = () => {
    const [articles, setArticles] = useState<Article[]>([]);
    const [categories, setCategories] = useState<Category[]>([]);
    const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
    const [loading, setLoading] = useState(true);

    // 載入所有分類
    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const response = await getCategories();
                setCategories(response.data.data);
            } catch (error) {
                console.error('Error fetching categories:', error);
            }
        };
        fetchCategories();
    }, []);

    // 當 selectedCategory 改變時，重新載入文章
    useEffect(() => {
        const fetchArticles = async () => {
            setLoading(true);
            try {
                const params: { page: number; limit: number; category?: string } = {
                    page: 1,
                    limit: 10,
                };
                if (selectedCategory) {
                    const categoryObject = categories.find((c) => c.id === selectedCategory);
                    if (categoryObject) {
                        params.category = categoryObject.name;
                    }
                }
                const response = await getArticles(params);
                setArticles(response.data.data.data);
            } catch (error) {
                console.error('Error fetching articles:', error);
            } finally {
                setLoading(false);
            }
        };
        // 確保 categories 載入後再 fetch articles
        if (categories.length > 0 || !selectedCategory) {
            fetchArticles();
        }
    }, [selectedCategory]);

    const handleCategoryClick = (categoryId: string | null) => {
        setSelectedCategory(categoryId);
    };

    return (
        <div className="article-list-page-container">
            <h1>文章列表</h1>
            <div className="category-tags">
                <button
                    className={`tag-button ${!selectedCategory ? 'active' : ''}`}
                    onClick={() => handleCategoryClick(null)}
                >
                    全部
                </button>
                {categories.map((category) => (
                    <button
                        key={category.id}
                        className={`tag-button ${selectedCategory === category.id ? 'active' : ''}`}
                        onClick={() => handleCategoryClick(category.id)}
                    >
                        {category.name}
                    </button>
                ))}
            </div>
            {loading ? (
                <p>Loading...</p>
            ) : (
                <div className="article-list-container">
                    {articles.length > 0 ? (
                        articles.map((article) => (
                            <ArticleCard
                                key={article.id}
                                id={article.id}
                                title={article.title}
                                content={article.content}
                                author={article.author.username}
                                created_at={article.created_at}
                            />
                        ))
                    ) : (
                        <p className="no-articles-message">這個分類目前沒有文章喔！</p>
                    )}
                </div>
            )}
        </div>
    );
};

export default ArticleListPage;
