import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '@app/contexts/AuthContext';
import { likeArticle, unlikeArticle } from '@app/api/article';
import type { Article } from '../types';

interface ArticleCardProps {
    article: Article;
    isFirst?: boolean; // Highlight the first article
}

const ArticleCard: React.FC<ArticleCardProps> = ({ article, isFirst = false }) => {
    const navigate = useNavigate();
    const location = useLocation();
    const { user } = useAuth();
    const [isLiked, setIsLiked] = useState(false);
    const [likesCount, setLikesCount] = useState(0);

    useEffect(() => {
        if (user && article.likedBy) {
            setIsLiked(article.likedBy.includes(user.id));
        }
        setLikesCount(article.likes_count || article.likes || 0);
    }, [article, user]);

    const handleLike = async (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();

        if (!user) {
            alert('Please login to like this article');
            return;
        }

        const prevIsLiked = isLiked;
        const prevLikesCount = likesCount;

        // Optimistic update
        setIsLiked(!prevIsLiked);
        setLikesCount(prevIsLiked ? prevLikesCount - 1 : prevLikesCount + 1);

        try {
            if (prevIsLiked) {
                await unlikeArticle(article.id);
            } else {
                await likeArticle(article.id);
            }
        } catch (error) {
            // Revert on error
            setIsLiked(prevIsLiked);
            setLikesCount(prevLikesCount);
            console.error('Failed to update like status', error);
        }
    };

    // 格式化日期
    const dateStr = new Date(article.created_at).toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
    });

    // 預設頭像 (如果沒有 avatar)
    const defaultAvatar = `https://ui-avatars.com/api/?name=${article.author.username}&background=random`;

    // 處理卡片點擊
    const handleCardClick = (e: React.MouseEvent) => {
        // 如果使用者點擊的是卡片內部的連結 (a) 或按鈕 (button)，則不觸發卡片整體的跳轉
        if ((e.target as HTMLElement).closest('a') || (e.target as HTMLElement).closest('button')) {
            return;
        }
        navigate(`/articles/${article.id}`, { state: { from: location.pathname } });
    };

    return (
        <div
            onClick={handleCardClick}
            className="group mb-4 overflow-hidden rounded-lg border border-slate-700 bg-surface transition-all hover:border-slate-500 hover:shadow-lg cursor-pointer hover:bg-slate-800/30"
        >
            {/* Cover Image (Only for first item or if exists) */}
            {article.cover_image && (
                <Link
                    to={`/articles/${article.id}`}
                    state={{ from: location.pathname }}
                    className="block h-64 w-full overflow-hidden"
                >
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
                    state={{ from: location.pathname }}
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
                        <button
                            onClick={handleLike}
                            className={`flex items-center gap-2 rounded px-2 py-1 transition-colors hover:bg-slate-700/50 group/btn ${
                                isLiked ? 'text-red-400' : 'hover:text-slate-200'
                            }`}
                        >
                            {isLiked ? (
                                <svg
                                    className="w-4 h-4 -translate-y-[1px]"
                                    viewBox="0 0 20 20"
                                    fill="currentColor"
                                >
                                    <path
                                        fillRule="evenodd"
                                        d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z"
                                        clipRule="evenodd"
                                    />
                                </svg>
                            ) : (
                                <svg
                                    className="w-4 h-4 transition-colors group-hover/btn:text-red-400 -translate-y-[1px]"
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={1.5}
                                        d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                                    />
                                </svg>
                            )}
                            <span>
                                {likesCount} <span className="hidden sm:inline">Reactions</span>
                            </span>
                        </button>
                        <Link
                            to={`/articles/${article.id}#comments`}
                            state={{ from: location.pathname }}
                            className="flex items-center gap-2 rounded px-2 py-1 transition-colors hover:bg-slate-700/50 hover:text-slate-200 group/btn"
                        >
                            <svg
                                className="w-4 h-4 transition-colors group-hover/btn:text-primary -translate-y-[1px]"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={1.5}
                                    d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z"
                                />
                            </svg>
                            <span>
                                {article.comments_count || 0}{' '}
                                <span className="hidden sm:inline">Comments</span>
                            </span>
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
