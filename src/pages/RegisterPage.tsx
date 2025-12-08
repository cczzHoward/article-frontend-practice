import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '@app/contexts/AuthContext';

const RegisterPage: React.FC = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const navigate = useNavigate();
    const { register, isAuthenticated } = useAuth();

    useEffect(() => {
        if (isAuthenticated) {
            navigate('/');
        }
    }, [isAuthenticated, navigate]);

    const validate = (): boolean => {
        if (username.length < 1) {
            setError('Username is required');
            return false;
        }
        if (password.length < 8) {
            setError('Password must be at least 8 characters');
            return false;
        }
        if (password !== confirmPassword) {
            setError('Passwords do not match');
            return false;
        }
        return true;
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');

        if (!validate()) return;

        setIsLoading(true);
        try {
            await register(username, password);
            navigate('/');
        } catch (err: any) {
            setError(err.response?.data?.message || 'Registration failed');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-background flex items-center justify-center px-4">
            <div className="w-full max-w-md">
                <div className="bg-surface border border-slate-700 rounded-lg p-8 shadow-lg">
                    <h1 className="text-3xl font-bold text-slate-100 mb-2">Create Account</h1>
                    <p className="text-slate-400 mb-8">Join our community</p>

                    {error && (
                        <div className="bg-red-900/20 border border-red-700 text-red-400 px-4 py-3 rounded-lg mb-6">
                            {error}
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-slate-300 mb-2">
                                Username
                            </label>
                            <input
                                type="text"
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                                className="w-full px-4 py-2 border border-slate-600 rounded-lg bg-slate-800 text-slate-100 focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
                                placeholder="Choose a username"
                                disabled={isLoading}
                                required
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-slate-300 mb-2">
                                Password
                            </label>
                            <input
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="w-full px-4 py-2 border border-slate-600 rounded-lg bg-slate-800 text-slate-100 focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
                                placeholder="At least 8 characters"
                                disabled={isLoading}
                                required
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-slate-300 mb-2">
                                Confirm Password
                            </label>
                            <input
                                type="password"
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                                className="w-full px-4 py-2 border border-slate-600 rounded-lg bg-slate-800 text-slate-100 focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
                                placeholder="Confirm your password"
                                disabled={isLoading}
                                required
                            />
                        </div>

                        <button
                            type="submit"
                            disabled={isLoading || !username || !password || !confirmPassword}
                            className="w-full bg-primary hover:bg-primary/90 disabled:bg-slate-700 text-white font-bold py-2 px-4 rounded-lg transition-colors"
                        >
                            {isLoading ? 'Creating account...' : 'Sign up'}
                        </button>
                    </form>

                    <p className="mt-6 text-center text-slate-400">
                        Already have an account?{' '}
                        <Link to="/login" className="text-primary hover:text-primary/90">
                            Log in
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default RegisterPage;
