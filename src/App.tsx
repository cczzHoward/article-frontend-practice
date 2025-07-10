import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import HomePage from './pages/HomePage';
import Layout from '@app/components/Layout';
import ArticleListPage from './pages/ArticleListPage'; // 引入新的頁面

const App: React.FC = () => {
    return (
        <Router>
            <Routes>
                <Route path="/" element={<Layout />}>
                    <Route index element={<HomePage />} />
                    <Route path="articles" element={<ArticleListPage />} />
                    <Route path="post-article" element={<div>發布文章</div>} />
                </Route>
            </Routes>
        </Router>
    );
};

export default App;
