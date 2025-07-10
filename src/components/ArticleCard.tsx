import React from 'react';
import '@app/styles/ArticleCard.scss';
import { useNavigate } from 'react-router-dom';
import { formatDistanceToNow } from 'date-fns';
import { zhTW } from 'date-fns/locale';

interface ArticleCardProps {
    id: string;
    title: string;
    content: string;
    author: string;
    created_at: string;
}

const ArticleCard: React.FC<ArticleCardProps> = ({ id, title, content, author, created_at }) => {
    const navigate = useNavigate();

    const handleClick = () => {
        navigate(`/articles/${id}`);
    };

    const timeAgo = formatDistanceToNow(new Date(created_at), {
        addSuffix: true,
        locale: zhTW,
    });

    return (
        <div className="article-card" onClick={handleClick}>
            <div className="article-card-header">
                <h2 className="article-title">{title}</h2>
                <div className="article-meta">
                    <span className="article-author">{author}</span>
                    <span className="article-time">{timeAgo}</span>
                </div>
            </div>
            <div className="article-card-content">
                <p>{content.slice(0, 100)}...</p>
            </div>
        </div>
    );
};

export default ArticleCard;
