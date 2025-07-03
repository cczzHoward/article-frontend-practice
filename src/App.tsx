import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import HomePage from './pages/HomePage';
import Layout from '@app/components/Layout';

const App: React.FC = () => {
    return (
        <Router>
            <Routes>
                <Route path="/" element={<Layout />}>
                    <Route index element={<HomePage />} />
                    {/* 可以在這裡添加其他路由，例如註冊頁面、登入頁面等 */}
                </Route>
            </Routes>
        </Router>
    );
};

export default App;
