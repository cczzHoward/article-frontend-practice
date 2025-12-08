import React, { createContext, useContext, useState, useEffect } from 'react';
import { login as loginApi, register as registerApi } from '@app/api/auth';
import type { User } from '@app/types';

interface AuthContextType {
    user: User | null;
    isLoading: boolean;
    isAuthenticated: boolean;
    login: (username: string, password: string) => Promise<void>;
    register: (username: string, password: string) => Promise<void>;
    logout: () => void;
    error: string | null;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [user, setUser] = useState<User | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    // 初始化：檢查 localStorage 中是否有 token
    useEffect(() => {
        const initAuth = async () => {
            const token = localStorage.getItem('auth_token');
            if (token) {
                try {
                    // 簡化版本：從 localStorage 恢復使用者資訊
                    // 實際應該呼叫 getCurrentUser() API
                    const savedUser = localStorage.getItem('auth_user');
                    if (savedUser) {
                        setUser(JSON.parse(savedUser));
                    }
                } catch (err) {
                    localStorage.removeItem('auth_token');
                    localStorage.removeItem('auth_user');
                    setUser(null);
                }
            }
            setIsLoading(false);
        };
        initAuth();
    }, []);

    const login = async (username: string, password: string) => {
        setError(null);
        setIsLoading(true);
        try {
            const response = await loginApi({ username, password });

            if (response.success && response.data?.token) {
                // 儲存 token
                localStorage.setItem('auth_token', response.data.token);

                // 儲存使用者資訊 (簡化版本，實際應解碼 JWT)
                const userData: User = {
                    id: username,
                    username,
                    role: 'user',
                };
                setUser(userData);
                localStorage.setItem('auth_user', JSON.stringify(userData));
            }
        } catch (err: any) {
            let errorMessage = 'Login failed';

            if (err.response?.data?.message) {
                errorMessage = err.response.data.message;
            } else if (err.message) {
                errorMessage = err.message;
            } else if (!navigator.onLine) {
                errorMessage = 'No internet connection';
            }

            setError(errorMessage);
            throw err;
        } finally {
            setIsLoading(false);
        }
    };

    const register = async (username: string, password: string) => {
        setError(null);
        setIsLoading(true);
        try {
            const response = await registerApi({ username, password });

            if (response.success && response.data?.token) {
                // 儲存 token
                localStorage.setItem('auth_token', response.data.token);

                // 儲存使用者資訊
                const userData: User = {
                    id: username,
                    username,
                    role: 'user',
                };
                setUser(userData);
                localStorage.setItem('auth_user', JSON.stringify(userData));
            }
        } catch (err: any) {
            const errorMessage = err.response?.data?.message || 'Registration failed';
            setError(errorMessage);
            throw err;
        } finally {
            setIsLoading(false);
        }
    };

    const logout = () => {
        localStorage.removeItem('auth_token');
        localStorage.removeItem('auth_user');
        setUser(null);
        setError(null);
    };

    return (
        <AuthContext.Provider
            value={{
                user,
                isLoading,
                isAuthenticated: !!user,
                login,
                register,
                logout,
                error,
            }}
        >
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within AuthProvider');
    }
    return context;
};
