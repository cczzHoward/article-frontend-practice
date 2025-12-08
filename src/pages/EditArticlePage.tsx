import React, { useEffect, useState, useMemo } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { getArticleById, getCategories, updateArticle } from '@app/api/article';
import ArticleForm, { type ArticleFormValues } from '@app/components/ArticleForm';
import type { Article, Category } from '@app/types';

const EditArticlePage: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();

    const [article, setArticle] = useState<Article | null>(null);
    const [categories, setCategories] = useState<Category[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchData = async () => {
            if (!id) {
                setError('Article id is missing.');
                setLoading(false);
                return;
            }

            try {
                const [articleResponse, categoriesResponse] = await Promise.all([
                    getArticleById(id),
                    getCategories(),
                ]);

                if (articleResponse.success) {
                    setArticle(articleResponse.data);
                } else {
                    setError(articleResponse.message || 'Unable to load article');
                }

                if (categoriesResponse.success) {
                    setCategories(categoriesResponse.data);
                }
            } catch (err) {
                console.error('Error loading article:', err);
                setError('Unable to load article. Please try again.');
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [id]);

    const draftKey = useMemo(() => (id ? `article_draft_edit_${id}` : 'article_draft_edit'), [id]);

    const initialValues = useMemo(() => {
        if (!article) return undefined;
        const categoryName =
            typeof article.category === 'object'
                ? article.category?.name || ''
                : article.category || '';
        return {
            title: article.title,
            content: article.content,
            category: categoryName,
        };
    }, [article]);

    const handleSubmit = async (values: ArticleFormValues) => {
        if (!id) {
            throw new Error('Missing article id');
        }
        setError('');
        const payload = { title: values.title, content: values.content };
        const response = await updateArticle(id, payload);
        if (response.success) {
            navigate(`/articles/${id}`);
            return;
        }
        throw new Error(response.message || 'Failed to update article');
    };

    if (loading) {
        return (
            <div className="space-y-4">
                {[1, 2].map((i) => (
                    <div
                        key={i}
                        className="bg-surface h-32 rounded-lg animate-pulse border border-slate-700"
                    ></div>
                ))}
            </div>
        );
    }

    if (error) {
        return (
            <div className="bg-red-900/20 border border-red-700 text-red-400 px-4 py-3 rounded-lg">
                {error}
            </div>
        );
    }

    if (!article) {
        return <div className="text-slate-400">Article not found.</div>;
    }

    return (
        <div className="max-w-3xl mx-auto space-y-6">
            <div>
                <p className="text-sm text-slate-400">Edit Article</p>
                <h1 className="text-3xl font-bold text-slate-100">Update your story</h1>
                <p className="text-slate-400 mt-2">
                    Title and content can be updated. Category stays the same for existing posts.
                </p>
            </div>

            <div className="bg-surface border border-slate-700 rounded-lg p-6 shadow-lg">
                <ArticleForm
                    categories={categories}
                    initialValues={initialValues}
                    draftKey={draftKey}
                    submitLabel="Update article"
                    disableCategory
                    onSubmit={handleSubmit}
                />
            </div>
        </div>
    );
};

export default EditArticlePage;
