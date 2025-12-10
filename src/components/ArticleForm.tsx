import React, { useEffect, useState } from 'react';
import type { Category } from '@app/types';

export type ArticleFormValues = {
    title: string;
    content: string;
    category: string;
    tags?: string[];
    cover_image?: string;
};

interface ArticleFormProps {
    categories: Category[];
    initialValues?: Partial<ArticleFormValues>;
    draftKey: string;
    submitLabel?: string;
    disableCategory?: boolean;
    onSubmit: (values: ArticleFormValues) => Promise<void>;
}

const ArticleForm: React.FC<ArticleFormProps> = ({
    categories,
    initialValues,
    draftKey,
    submitLabel = 'Publish',
    disableCategory = false,
    onSubmit,
}) => {
    const [values, setValues] = useState<ArticleFormValues>({
        title: initialValues?.title || '',
        content: initialValues?.content || '',
        category: initialValues?.category || '',
        tags: initialValues?.tags || [],
        cover_image: initialValues?.cover_image || '',
    });
    const [tagInput, setTagInput] = useState('');
    const [error, setError] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [lastSavedAt, setLastSavedAt] = useState<string | null>(null);
    const [hasLoadedDraft, setHasLoadedDraft] = useState(false);

    // Load draft once; if none, fall back to provided initial values.
    useEffect(() => {
        if (hasLoadedDraft) return;
        const draft = localStorage.getItem(draftKey);
        if (draft) {
            try {
                const parsed = JSON.parse(draft) as ArticleFormValues;
                setValues((prev) => ({ ...prev, ...parsed }));
            } catch (e) {
                localStorage.removeItem(draftKey);
            }
        } else if (initialValues) {
            setValues((prev) => ({ ...prev, ...initialValues }));
        }
        setHasLoadedDraft(true);
    }, [draftKey, hasLoadedDraft, initialValues]);

    // Auto-select first category if none chosen.
    useEffect(() => {
        if (values.category || categories.length === 0) return;
        setValues((prev) => ({ ...prev, category: categories[0].name }));
    }, [categories, values.category]);

    // Persist draft to localStorage when values change.
    useEffect(() => {
        if (!hasLoadedDraft) return;
        try {
            localStorage.setItem(draftKey, JSON.stringify(values));
            setLastSavedAt(new Date().toLocaleTimeString());
        } catch (e) {
            // Ignore storage errors; draft is a best-effort feature.
        }
    }, [draftKey, values, hasLoadedDraft]);

    const handleChange =
        (field: keyof ArticleFormValues) =>
        (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
            setError('');
            setValues((prev) => ({ ...prev, [field]: e.target.value }));
        };

    const handleTagChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setTagInput(e.target.value);
    };

    const handleTagKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (['Enter', 'Tab', ','].includes(e.key)) {
            e.preventDefault();
            const newTag = tagInput.trim();
            if (newTag && !values.tags?.includes(newTag)) {
                setValues((prev) => ({
                    ...prev,
                    tags: [...(prev.tags || []), newTag],
                }));
                setTagInput('');
            }
        } else if (e.key === 'Backspace' && !tagInput && values.tags?.length) {
            // Optional: Remove last tag on backspace if input is empty
            e.preventDefault();
            const newTags = [...(values.tags || [])];
            newTags.pop();
            setValues((prev) => ({ ...prev, tags: newTags }));
        }
    };

    const removeTag = (tagToRemove: string) => {
        setValues((prev) => ({
            ...prev,
            tags: prev.tags?.filter((tag) => tag !== tagToRemove),
        }));
    };

    const validate = (): boolean => {
        if (!values.title.trim()) {
            setError('Title is required');
            return false;
        }
        if (!values.content.trim()) {
            setError('Content is required');
            return false;
        }
        if (!values.category) {
            setError('Category is required');
            return false;
        }
        return true;
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        if (!validate()) return;

        setIsSubmitting(true);
        try {
            await onSubmit(values);
            localStorage.removeItem(draftKey);
        } catch (err: any) {
            const message = err?.response?.data?.message || err?.message || 'Unable to submit';
            setError(message);
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-6">
            {error && (
                <div className="bg-red-900/20 border border-red-700 text-red-400 px-4 py-3 rounded-lg">
                    {error}
                </div>
            )}

            <div className="space-y-2">
                <label className="block text-sm font-medium text-slate-300">Title</label>
                <input
                    type="text"
                    value={values.title}
                    onChange={handleChange('title')}
                    className="w-full px-4 py-3 border border-slate-700 rounded-lg bg-slate-900 text-slate-100 focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
                    placeholder="Enter article title"
                    maxLength={128}
                    disabled={isSubmitting}
                    required
                />
                <p className="text-xs text-slate-500">Max 128 characters</p>
            </div>

            <div className="space-y-2">
                <label className="block text-sm font-medium text-slate-300">Cover Image URL</label>
                <input
                    type="url"
                    value={values.cover_image || ''}
                    onChange={handleChange('cover_image')}
                    className="w-full px-4 py-3 border border-slate-700 rounded-lg bg-slate-900 text-slate-100 focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
                    placeholder="https://example.com/image.jpg"
                    disabled={isSubmitting}
                />
                <p className="text-xs text-slate-500">Optional</p>
            </div>

            <div className="space-y-2">
                <label className="block text-sm font-medium text-slate-300">Category</label>
                <select
                    value={values.category}
                    onChange={handleChange('category')}
                    className="w-full px-4 py-3 border border-slate-700 rounded-lg bg-slate-900 text-slate-100 focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
                    disabled={isSubmitting || categories.length === 0 || disableCategory}
                    required
                >
                    <option value="" disabled>
                        Select a category
                    </option>
                    {categories.map((category) => (
                        <option key={category.id} value={category.name}>
                            {category.name}
                        </option>
                    ))}
                </select>
                {disableCategory && (
                    <p className="text-xs text-slate-500">
                        Category cannot be changed after publish.
                    </p>
                )}
            </div>

            <div className="space-y-2">
                <label className="block text-sm font-medium text-slate-300">Tags</label>
                <div className="flex flex-wrap gap-2 p-2 border border-slate-700 rounded-lg bg-slate-900 focus-within:border-primary focus-within:ring-1 focus-within:ring-primary">
                    {values.tags?.map((tag) => (
                        <span
                            key={tag}
                            className="flex items-center gap-1 px-2 py-1 text-sm rounded bg-primary/20 text-primary border border-primary/30"
                        >
                            {tag}
                            <button
                                type="button"
                                onClick={() => removeTag(tag)}
                                className="hover:text-white focus:outline-none"
                            >
                                <svg
                                    className="w-3 h-3"
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M6 18L18 6M6 6l12 12"
                                    />
                                </svg>
                            </button>
                        </span>
                    ))}
                    <input
                        type="text"
                        value={tagInput}
                        onChange={handleTagChange}
                        onKeyDown={handleTagKeyDown}
                        className="flex-1 min-w-[120px] bg-transparent border-none focus:ring-0 text-slate-100 placeholder-slate-500 focus:outline-none py-1 px-1"
                        placeholder={values.tags?.length ? '' : 'Type tag and press Enter...'}
                        disabled={isSubmitting}
                    />
                </div>
                <p className="text-xs text-slate-500">Press Enter, Tab or Comma to add a tag</p>
            </div>

            <div className="space-y-2">
                <label className="block text-sm font-medium text-slate-300">Content</label>
                <textarea
                    value={values.content}
                    onChange={handleChange('content')}
                    className="w-full h-64 px-4 py-3 border border-slate-700 rounded-lg bg-slate-900 text-slate-100 focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary resize-vertical"
                    placeholder="Write your article content here..."
                    maxLength={25565}
                    disabled={isSubmitting}
                    required
                />
                <div className="flex items-center justify-between text-xs text-slate-500">
                    <span>{values.content.length} / 25565</span>
                    {lastSavedAt && <span>Draft saved at {lastSavedAt}</span>}
                </div>
            </div>

            <div className="flex items-center justify-between text-sm text-slate-400">
                <span>Drafts auto-save locally while you type.</span>
                <button
                    type="button"
                    onClick={() => {
                        localStorage.removeItem(draftKey);
                        setLastSavedAt(null);
                    }}
                    className="text-primary hover:text-primary/90"
                    disabled={isSubmitting}
                >
                    Clear draft
                </button>
            </div>

            <button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-primary hover:bg-primary/90 disabled:bg-slate-700 text-white font-bold py-3 px-4 rounded-lg transition-colors"
            >
                {isSubmitting ? 'Submitting...' : submitLabel}
            </button>
        </form>
    );
};

export default ArticleForm;
