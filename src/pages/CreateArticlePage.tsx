import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { createArticle, getCategories } from '@app/api/article';
import ArticleForm, { type ArticleFormValues } from '@app/components/ArticleForm';
import type { Category } from '@app/types';

const DRAFT_KEY = 'article_draft_create';

const CreateArticlePage: React.FC = () => {
    const [categories, setCategories] = useState<Category[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    const navigate = useNavigate();

    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const response = await getCategories();
                if (response.success) {
                    setCategories(response.data);
                }
            } catch (err) {
                console.error('Error fetching categories:', err);
                setError('Unable to load categories. Please try again.');
            } finally {
                setLoading(false);
            }
        };

        fetchCategories();
    }, []);

    const handleSubmit = async (values: ArticleFormValues) => {
        setError('');
        const response = await createArticle(values);
        if (response.success) {
            navigate(`/articles/${response.data.id}`);
            return;
        }
        throw new Error(response.message || 'Failed to create article');
    };

    return (
        <div className="max-w-3xl mx-auto space-y-6">
            <div>
                <p className="text-sm text-slate-400">New Article</p>
                <h1 className="text-3xl font-bold text-slate-100">Publish your story</h1>
                <p className="text-slate-400 mt-2">
                    Share your ideas with the community. Drafts auto-save locally while you type.
                </p>
            </div>

            {error && (
                <div className="bg-red-900/20 border border-red-700 text-red-400 px-4 py-3 rounded-lg">
                    {error}
                </div>
            )}

            {loading ? (
                <div className="space-y-4">
                    {[1, 2].map((i) => (
                        <div
                            key={i}
                            className="bg-surface h-32 rounded-lg animate-pulse border border-slate-700"
                        ></div>
                    ))}
                </div>
            ) : (
                <div className="bg-surface border border-slate-700 rounded-lg p-6 shadow-lg">
                    <ArticleForm
                        categories={categories}
                        draftKey={DRAFT_KEY}
                        submitLabel="Publish article"
                        onSubmit={handleSubmit}
                    />
                </div>
            )}
        </div>
    );
};

export default CreateArticlePage;
