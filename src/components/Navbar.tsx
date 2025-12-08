import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '@app/contexts/AuthContext';

const Navbar: React.FC = () => {
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [isLoggingOut, setIsLoggingOut] = useState(false);
    const navigate = useNavigate();
    const location = useLocation();
    const { isAuthenticated, user, logout } = useAuth(); // ← 新增 isAuthenticated 和 logout

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        if (searchQuery.trim()) {
            navigate(`/articles?keyword=${encodeURIComponent(searchQuery)}`);
            setIsMobileMenuOpen(false);
        }
    };

    const handleLogout = async () => {
        setIsLoggingOut(true);
        await new Promise((resolve) => setTimeout(resolve, 300));
        logout();
        navigate('/');
        setIsMobileMenuOpen(false);
        setIsLoggingOut(false);
    };

    const isActive = (path: string) => location.pathname === path;

    return (
        <nav className="sticky top-0 z-50 w-full border-b border-slate-700 bg-surface/80 backdrop-blur-md">
            <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
                {/* Logo */}
                <div className="flex items-center gap-8">
                    <Link
                        to="/"
                        className="text-2xl font-bold text-slate-100 hover:text-primary transition-colors"
                    >
                        DevFlow
                    </Link>

                    {/* Desktop Links */}
                    <div className="hidden md:flex items-center gap-6">
                        {[
                            { label: 'Home', path: '/' },
                            { label: 'Articles', path: '/articles' },
                            { label: 'Podcasts', path: '#' },
                        ].map((link) => (
                            <Link
                                key={link.label}
                                to={link.path}
                                className={`text-sm font-medium transition-colors hover:text-primary ${
                                    isActive(link.path) ? 'text-primary' : 'text-slate-300'
                                }`}
                            >
                                {link.label}
                            </Link>
                        ))}
                    </div>
                </div>

                {/* Search & Actions */}
                <div className="flex items-center gap-4">
                    {/* Desktop Search */}
                    <form onSubmit={handleSearch} className="hidden md:block relative">
                        <input
                            type="text"
                            placeholder="Search..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-64 rounded-full border border-slate-600 bg-slate-800/50 px-4 py-1.5 text-sm text-slate-200 focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
                        />
                    </form>

                    {/* Auth Buttons */}
                    <div className="hidden md:flex items-center gap-3">
                        {isAuthenticated ? (
                            <>
                                <span className="text-sm font-medium text-slate-300">
                                    {user?.username}
                                </span>
                                <button
                                    onClick={handleLogout}
                                    disabled={isLoggingOut}
                                    className={`text-sm font-medium transition-colors ${
                                        isLoggingOut
                                            ? 'text-red-400 opacity-50 cursor-not-allowed'
                                            : 'text-slate-300 hover:text-primary cursor-pointer'
                                    }`}
                                >
                                    {isLoggingOut ? 'Logging out...' : 'Log out'}
                                </button>
                            </>
                        ) : (
                            <>
                                <Link
                                    to="/login"
                                    className="text-sm font-medium text-slate-300 hover:text-primary transition-colors"
                                >
                                    Log in
                                </Link>
                                <Link
                                    to="/register"
                                    className="rounded-md bg-primary px-4 py-2 text-sm font-bold text-white transition-colors hover:bg-primary/90"
                                >
                                    Create account
                                </Link>
                            </>
                        )}
                    </div>

                    {/* Mobile Menu Button */}
                    <button
                        onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                        className="md:hidden p-2 text-slate-300 hover:text-white"
                    >
                        <svg
                            className="h-6 w-6"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                        >
                            {isMobileMenuOpen ? (
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M6 18L18 6M6 6l12 12"
                                />
                            ) : (
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M4 6h16M4 12h16M4 18h16"
                                />
                            )}
                        </svg>
                    </button>
                </div>
            </div>

            {/* Mobile Menu Dropdown */}
            {isMobileMenuOpen && (
                <div className="md:hidden border-t border-slate-700 bg-surface px-4 py-4 space-y-4">
                    <form onSubmit={handleSearch}>
                        <input
                            type="text"
                            placeholder="Search..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full rounded-md border border-slate-600 bg-slate-800 px-4 py-2 text-slate-200 focus:border-primary focus:outline-none"
                        />
                    </form>
                    <div className="flex flex-col gap-2">
                        <Link
                            to="/"
                            className="block py-2 text-sm text-slate-300 hover:text-primary"
                        >
                            Home
                        </Link>
                        <Link
                            to="/articles"
                            className="block py-2 text-sm text-slate-300 hover:text-primary"
                        >
                            Articles
                        </Link>
                        <hr className="border-slate-700 my-2" />
                        {isAuthenticated ? (
                            <>
                                <span className="block py-2 text-sm text-slate-300">
                                    {user?.username}
                                </span>
                                <button
                                    onClick={handleLogout}
                                    disabled={isLoggingOut}
                                    className={`block py-2 text-sm font-medium transition-colors cursor-pointer ${
                                        isLoggingOut
                                            ? 'text-red-400 opacity-50 cursor-not-allowed'
                                            : 'text-slate-300 hover:text-primary'
                                    }`}
                                >
                                    {isLoggingOut ? 'Logging out...' : 'Log out'}
                                </button>
                            </>
                        ) : (
                            <>
                                <Link
                                    to="/login"
                                    className="block py-2 text-sm text-slate-300 hover:text-primary"
                                >
                                    Log in
                                </Link>
                                <Link
                                    to="/register"
                                    className="block py-2 text-sm text-primary font-bold"
                                >
                                    Create account
                                </Link>
                            </>
                        )}
                    </div>
                </div>
            )}
        </nav>
    );
};

export default Navbar;
