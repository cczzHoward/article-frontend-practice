import React from 'react';
import { Link } from 'react-router-dom';
import type { Article } from '../types';

interface ArticleCardProps {
    article: Article;
    isFirst?: boolean; // Highlight the first article
}

const ArticleCard: React.FC<ArticleCardProps> = ({ article, isFirst = false }) => {
    // 格式化日期
    const dateStr = new Date(article.created_at).toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
    });

    // 預設頭像 (如果沒有 avatar)
    const defaultAvatar = `https://ui-avatars.com/api/?name=${article.author.username}&background=random`;

    return (
        <div className="group mb-4 overflow-hidden rounded-lg border border-slate-700 bg-surface transition-colors hover:border-slate-500">
            {/* Cover Image (Only for first item or if exists) */}
            {article.cover_image && (
                <Link to={`/articles/${article.id}`} className="block h-64 w-full overflow-hidden">
                    <img
                        src={article.cover_image}
                        alt={article.title}
                        className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                </Link>
            )}

            <div className="p-5">
                {/* Author Info */}
                <div className="mb-3 flex items-center">
                    <div className="mr-2 h-8 w-8 overflow-hidden rounded-full bg-slate-600">
                        <img
                            src={article.author.avatar || defaultAvatar}
                            alt="avatar"
                            className="h-full w-full object-cover"
                        />
                    </div>
                    <div className="text-sm">
                        <p className="cursor-pointer font-medium text-slate-200 hover:text-slate-100">
                            {article.author.username}
                        </p>
                        <p className="text-xs text-slate-400">{dateStr}</p>
                    </div>
                </div>

                {/* Title */}
                <Link
                    to={`/articles/${article.id}`}
                    className="block transition-colors group-hover:text-primary"
                >
                    <h2
                        className={`mb-2 font-bold text-slate-100 ${
                            isFirst ? 'text-3xl' : 'text-xl'
                        }`}
                    >
                        {article.title}
                    </h2>
                </Link>

                {/* Tags */}
                <div className="mb-4 flex flex-wrap gap-2">
                    {article.tags?.map((tag) => (
                        <span
                            key={tag}
                            className="cursor-pointer rounded px-1 text-sm text-slate-400 transition-colors hover:bg-slate-700/50 hover:text-slate-200"
                        >
                            #{tag}
                        </span>
                    ))}
                    {/* 如果沒有 tags，顯示分類作為 fallback */}
                    {!article.tags?.length && article.category && (
                        <span className="cursor-pointer rounded px-1 text-sm text-slate-400 transition-colors hover:bg-slate-700/50 hover:text-slate-200">
                            #
                            {typeof article.category === 'object'
                                ? article.category.name
                                : article.category}
                        </span>
                    )}
                </div>

                {/* Footer Meta: Reactions & Comments */}
                <div className="flex items-center justify-between text-sm text-slate-400">
                    <div className="flex gap-4">
                        <button className="flex items-center gap-1 rounded px-2 py-1 transition-colors hover:bg-slate-700/50 hover:text-slate-200">
                            <span>❤️</span>
                            <span>{article.likes || 0} Reactions</span>
                        </button>
                        <Link
                            to={`/articles/${article.id}#comments`}
                            className="flex items-center gap-1 rounded px-2 py-1 transition-colors hover:bg-slate-700/50 hover:text-slate-200"
                        >
                            <span>💬</span>
                            <span>{article.comments_count || 0} Comments</span>
                        </Link>
                    </div>
                    <div className="text-xs">
                        {Math.ceil(article.content.length / 500)} min read
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ArticleCard;
