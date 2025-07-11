import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import HomePage from './pages/HomePage';
import Layout from '@app/components/Layout';
import ArticleListPage from './pages/ArticleListPage';
import ArticleDetailPage from '@app/pages/ArticleDetailPage';

const App: React.FC = () => {
    return (
        <Router>
            <Routes>
                <Route path="/" element={<Layout />}>
                    <Route index element={<HomePage />} />
                    <Route path="articles" element={<ArticleListPage />} />
                    <Route path="articles/:id" element={<ArticleDetailPage />} />
                    <Route path="post-article" element={<div>發布文章</div>} />
                    <Route path="login" element={<div>登入頁面</div>}></Route>
                </Route>
            </Routes>
        </Router>
    );
};

export default App;
