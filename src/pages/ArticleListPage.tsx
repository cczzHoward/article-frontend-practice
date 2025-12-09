import React, { useState, useEffect, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import { getArticles, getCategories } from '@app/api/article';
import ArticleCard from '@app/components/ArticleCard';
import Pagination from '@app/components/Pagination';
import Skeleton from '@app/components/ui/Skeleton';
import type { Category, Article } from '@app/types';

const ArticleListPage: React.FC = () => {
    const [articles, setArticles] = useState<Article[]>([]);
    const [categories, setCategories] = useState<Category[]>([]);
    const [loading, setLoading] = useState(true);
    const [total, setTotal] = useState(0);

    const [searchParams, setSearchParams] = useSearchParams();
    const selectedCategoryId = searchParams.get('category');
    const keyword = searchParams.get('keyword') || '';
    const currentPage = parseInt(searchParams.get('page') || '1', 10);

    const limit = 10; // 每頁 10 筆
    const totalPages = Math.ceil(total / limit);

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
    const targetCategoryName = useMemo(() => {
        if (!selectedCategoryId) return undefined;
        return categories.find((c) => c.id === selectedCategoryId)?.name;
    }, [selectedCategoryId, categories]);

    // 3. 載入文章
    useEffect(() => {
        if (selectedCategoryId && !targetCategoryName) {
            return;
        }

        const fetchArticles = async () => {
            setLoading(true);
            try {
                const params: {
                    page: number;
                    limit: number;
                    category?: string;
                    keyword?: string;
                } = {
                    page: currentPage,
                    limit,
                };

                if (targetCategoryName) {
                    params.category = targetCategoryName;
                }

                if (keyword) {
                    params.keyword = keyword;
                }

                const response = await getArticles(params);
                if (response.success) {
                    setArticles(response.data.data);
                    setTotal(response.data.total);

                    // 換頁時滾動到頂部
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                }
            } catch (error) {
                console.error('Error fetching articles:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchArticles();
    }, [targetCategoryName, selectedCategoryId, currentPage, keyword]);

    // 處理換頁
    const handlePageChange = (newPage: number) => {
        setSearchParams((prev) => {
            prev.set('page', String(newPage));
            return prev;
        });
    };

    // 取得當前選中的分類名稱 (UI顯示用)
    const currentCategoryName = targetCategoryName || 'All Articles';

    // 計算當前顯示範圍
    const startItem = (currentPage - 1) * limit + 1;
    const endItem = Math.min(currentPage * limit, total);

    return (
        <div className="max-w-4xl mx-auto">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-3xl font-bold text-slate-100">
                    {keyword ? `搜尋: "${keyword}"` : currentCategoryName}
                </h1>
                {total > 0 && (
                    <p className="text-sm text-slate-400">
                        顯示第 {startItem}-{endItem} 筆，共 {total} 筆
                    </p>
                )}
            </div>

            <div className="space-y-4">
                {loading ? (
                    <Skeleton count={3} height="12rem" />
                ) : articles.length > 0 ? (
                    <>
                        {articles.map((article) => (
                            <ArticleCard key={article.id} article={article} />
                        ))}

                        {/* 分頁器 */}
                        <Pagination
                            currentPage={currentPage}
                            totalPages={totalPages}
                            onPageChange={handlePageChange}
                        />
                    </>
                ) : (
                    <div className="text-center py-12">
                        <p className="text-lg text-slate-400">
                            {keyword ? '找不到符合的文章' : '這個分類目前沒有文章喔！'}
                        </p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default ArticleListPage;
