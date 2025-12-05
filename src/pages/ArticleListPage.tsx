import React, { useState, useEffect } from 'react';
import { getArticles, getCategories } from '@app/api/article';
import ArticleCard from '@app/components/ArticleCard';
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
                // 修正：response 已經是 ApiResponse，response.data 直接就是 Category[]
                if (response.success) {
                    setCategories(response.data);
                }
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
                // 修正：response.data 是 { total, data: Article[] }
                // 所以文章列表在 response.data.data
                if (response.success) {
                    setArticles(response.data.data);
                }
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
    }, [selectedCategory, categories]);

    const handleCategoryClick = (categoryId: string | null) => {
        setSelectedCategory(categoryId);
    };

    return (
        <div className="max-w-4xl mx-auto">
            <h1 className="text-3xl font-bold text-slate-100 mb-6">Articles</h1>

            {/* 分類標籤 */}
            <div className="flex flex-wrap gap-2 mb-8">
                {categories.map((category) => (
                    <button
                        key={category.id}
                        onClick={() => handleCategoryClick(category.id)}
                        className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 border ${
                            selectedCategory === category.id
                                ? 'bg-primary border-primary text-white shadow-lg shadow-primary/25'
                                : 'bg-surface border-slate-700 text-slate-400 hover:border-slate-500 hover:text-slate-200'
                        }`}
                    >
                        {category.name}
                    </button>
                ))}
            </div>

            {/* 文章列表容器 */}
            <div className="space-y-4">
                {loading ? (
                    <p className="text-slate-400 text-center py-8">Loading...</p>
                ) : articles.length > 0 ? (
                    articles.map((article) => <ArticleCard key={article.id} article={article} />)
                ) : (
                    <div className="text-center py-12">
                        <p className="text-lg text-slate-400">這個分類目前沒有文章喔！</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default ArticleListPage;
