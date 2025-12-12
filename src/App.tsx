import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from '@app/contexts/AuthContext';
import Layout from '@app/components/Layout';
import HomePage from '@app/pages/HomePage';
import ArticleListPage from '@app/pages/ArticleListPage';
import ArticleDetailPage from '@app/pages/ArticleDetailPage';
import LoginPage from '@app/pages/LoginPage';
import RegisterPage from '@app/pages/RegisterPage';
import CreateArticlePage from '@app/pages/CreateArticlePage';
import EditArticlePage from '@app/pages/EditArticlePage';
import ProfilePage from '@app/pages/ProfilePage';

// Protected Route Component
const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const { isAuthenticated, isLoading } = useAuth();

    if (isLoading) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="text-slate-400">Loading...</div>
            </div>
        );
    }

    return isAuthenticated ? <>{children}</> : <Navigate to="/login" />;
};

const AppRoutes: React.FC = () => {
    return (
        <Routes>
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
            <Route path="/" element={<Layout />}>
                <Route index element={<HomePage />} />
                <Route path="articles" element={<ArticleListPage />} />
                <Route path="articles/:id" element={<ArticleDetailPage />} />
                <Route
                    path="articles/create"
                    element={
                        <ProtectedRoute>
                            <CreateArticlePage />
                        </ProtectedRoute>
                    }
                />
                <Route
                    path="articles/:id/edit"
                    element={
                        <ProtectedRoute>
                            <EditArticlePage />
                        </ProtectedRoute>
                    }
                />
                <Route
                    path="profile"
                    element={
                        <ProtectedRoute>
                            <ProfilePage />
                        </ProtectedRoute>
                    }
                />
            </Route>
        </Routes>
    );
};

const App: React.FC = () => {
    return (
        <AuthProvider>
            <AppRoutes />
        </AuthProvider>
    );
};

export default App;
