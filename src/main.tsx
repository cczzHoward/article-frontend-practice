import React from 'react';
import ReactDOM from 'react-dom/client';
import { HashRouter } from 'react-router-dom';
import App from './App.tsx';
import './styles/index.css';

// 根據環境設定 basename
const basename = import.meta.env.PROD
    ? '/article-frontend-practice/' // 生產環境（GitHub Pages）
    : '/'; // 開發環境

ReactDOM.createRoot(document.getElementById('root')!).render(
    <React.StrictMode>
        <HashRouter basename={basename}>
            <App />
        </HashRouter>
    </React.StrictMode>
);
