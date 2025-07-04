import React from 'react';
import '@app/styles/ArticleCard.scss';
import { useNavigate } from 'react-router-dom';

interface ArticleCardProps {
    id: string;
    title: string;
    content: string;
    author: string;
}

const ArticleCard: React.FC<ArticleCardProps> = ({ id, title, content, author }) => {
    const navigate = useNavigate();

    const handleClick = () => {
        navigate(`/articles/${id}`);
    };

    return (
        <div className="article-card" onClick={handleClick}>
            <div className="article-card-header">
                <h2 className="article-title">{title}</h2>
                <p className="article-author">By {author}</p>
            </div>
            <div className="article-card-content">
                <p>{content.slice(0, 100)}...</p>
            </div>
            <div className="article-card-footer">
                <button className="read-more-btn">Read More</button>
            </div>
        </div>
    );
};

export default ArticleCard;
