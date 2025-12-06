import React, { useState, useEffect, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import { getArticles, getCategories } from '@app/api/article';
import ArticleCard from '@app/components/ArticleCard';
import type { Category, Article } from '@app/types';

const ArticleListPage: React.FC = () => {
    const [articles, setArticles] = useState<Article[]>([]);
    const [categories, setCategories] = useState<Category[]>([]);
    const [loading, setLoading] = useState(true);

    const [searchParams] = useSearchParams();
    const selectedCategoryId = searchParams.get('category');

    // 1. 載入分類
    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const response = await getCategories();
                if (response.success) {
                    setCategories(response.data);
                }
            } catch (error) {
                console.error('Error fetching categories:', error);
            }
        };
        fetchCategories();
    }, []);

    // 2. 使用 useMemo 計算出真正要傳給 API 的分類名稱
    // 只有當 "有選分類" 且 "分類資料已載入" 時，才會計算出名稱
    const targetCategoryName = useMemo(() => {
        if (!selectedCategoryId) return undefined;
        return categories.find((c) => c.id === selectedCategoryId)?.name;
    }, [selectedCategoryId, categories]);

    // 3. 載入文章
    useEffect(() => {
        // 如果使用者選了分類 ID，但我們還沒轉換出 Name (代表分類還在載入中)，則先不發送請求
        // 這樣可以避免發送一次沒有帶分類參數的錯誤請求
        if (selectedCategoryId && !targetCategoryName) {
            return;
        }

        const fetchArticles = async () => {
            setLoading(true);
            try {
                const params: { page: number; limit: number; category?: string } = {
                    page: 1,
                    limit: 10,
                };

                if (targetCategoryName) {
                    params.category = targetCategoryName;
                }

                const response = await getArticles(params);
                if (response.success) {
                    setArticles(response.data.data);
                }
            } catch (error) {
                console.error('Error fetching articles:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchArticles();
    }, [targetCategoryName, selectedCategoryId]);

    // 取得當前選中的分類名稱 (UI顯示用)
    const currentCategoryName = targetCategoryName || 'All Articles';

    return (
        <div className="max-w-4xl mx-auto">
            <h1 className="text-3xl font-bold text-slate-100 mb-6">{currentCategoryName}</h1>

            <div className="space-y-4">
                {loading ? (
                    <div className="space-y-4">
                        {[1, 2, 3].map((i) => (
                            <div
                                key={i}
                                className="bg-surface h-48 rounded-lg animate-pulse border border-slate-700"
                            ></div>
                        ))}
                    </div>
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
