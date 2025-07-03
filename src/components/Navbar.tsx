import React from 'react';
import { Link } from 'react-router-dom';
import '../styles/Navbar.css';

const Navbar: React.FC = () => {
    return (
        <nav className="navbar">
            <div className="navbar-logo">
                <Link to="/">部落格</Link>
            </div>
            <ul className="navbar-links">
                <li>
                    <Link to="/articles">文章列表</Link>
                </li>
                <li>
                    <Link to="/about">關於我們</Link>
                </li>
                <li>
                    <Link to="/contact">聯絡我們</Link>
                </li>
            </ul>
        </nav>
    );
};

export default Navbar;
