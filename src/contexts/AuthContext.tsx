import React, { createContext, useContext, useState, useEffect } from 'react';
import { jwtDecode } from 'jwt-decode';
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
                    // 從 JWT 解碼使用者資訊
                    const decoded = jwtDecode<User>(token);
                    setUser(decoded);
                } catch (err) {
                    // Token 無效或過期，清除儲存
                    localStorage.removeItem('auth_token');
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
                const token = response.data.token;

                // 儲存 token
                localStorage.setItem('auth_token', token);

                // 從 JWT 解碼使用者資訊
                const decoded = jwtDecode<User>(token);
                setUser(decoded);
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
                const token = response.data.token;

                // 儲存 token
                localStorage.setItem('auth_token', token);

                // 從 JWT 解碼使用者資訊
                const decoded = jwtDecode<User>(token);
                setUser(decoded);
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
