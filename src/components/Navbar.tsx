import React from 'react';
import { Link } from 'react-router-dom';
import '../styles/Navbar.scss';

const Navbar: React.FC = () => {
    return (
        <nav className="navbar">
            <div className="navbar-container">
                <div className="navbar-logo">
                    <Link to="/">部落格Demo</Link>
                </div>
                <div className="navbar-blank"></div>
                <ul className="navbar-links">
                    <li>
                        <Link to="/articles">文章列表</Link>
                    </li>
                    <li>
                        <Link to="/post-article">發布文章</Link>
                    </li>
                </ul>
            </div>
        </nav>
    );
};

export default Navbar;
