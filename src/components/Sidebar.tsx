import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { getCategories } from '@app/api/article'; // 修改引用
import type { Category } from '@app/types';

const Sidebar: React.FC = () => {
    const [categories, setCategories] = useState<Category[]>([]);

    useEffect(() => {
        const fetchCategoriesData = async () => {
            try {
                const response = await getCategories();
                if (response.success) {
                    setCategories(response.data);
                }
            } catch (error) {
                console.error('Failed to load categories', error);
            }
        };
        fetchCategoriesData();
    }, []);

    // Helper to check active state
    const isActive = (path: string) => location.pathname === path;

    // SVG Icons
    const Icons = {
        Home: (
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1.5}
                    d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
                />
            </svg>
        ),
        Listings: (
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1.5}
                    d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z"
                />
            </svg>
        ),
        Podcasts: (
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1.5}
                    d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z"
                />
            </svg>
        ),
        Videos: (
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1.5}
                    d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z"
                />
            </svg>
        ),
        Tags: (
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1.5}
                    d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z"
                />
            </svg>
        ),
        FAQ: (
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1.5}
                    d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"
                />
            </svg>
        ),
    };

    const menuItems = [
        { icon: Icons.Home, label: 'Home', path: '/' },
        { icon: Icons.Listings, label: 'Listings', path: '/articles' },
        { icon: Icons.Podcasts, label: 'Podcasts', path: '#' },
        { icon: Icons.Videos, label: 'Videos', path: '#' },
        { icon: Icons.Tags, label: 'Tags', path: '#' },
        { icon: Icons.FAQ, label: 'FAQ', path: '#' },
    ];

    return (
        <aside className="hidden md:block space-y-6">
            <div className="flex flex-col space-y-1">
                {menuItems.map((item) => {
                    const active = isActive(item.path);
                    return (
                        <Link
                            key={item.label}
                            to={item.path}
                            className={`flex items-center gap-3 px-3 py-2 rounded transition-colors ${
                                active
                                    ? 'bg-white/10 text-white font-medium'
                                    : 'text-slate-400 hover:bg-primary/10 hover:text-primary hover:underline'
                            }`}
                        >
                            <span
                                className={`${
                                    active
                                        ? 'text-white'
                                        : 'text-slate-400 group-hover:text-primary'
                                }`}
                            >
                                {item.icon}
                            </span>
                            <span>{item.label}</span>
                        </Link>
                    );
                })}
            </div>

            <div className="pt-4 border-t border-slate-700">
                <h3 className="font-bold text-slate-200 px-3 mb-2">Categories</h3>
                <div className="flex flex-col space-y-1">
                    {categories.map((cat) => (
                        <Link
                            key={cat.id}
                            to={`/articles?category=${cat.id}`}
                            className="px-3 py-2 text-slate-400 hover:bg-slate-800 hover:text-slate-200 rounded transition-colors"
                        >
                            # {cat.name}
                        </Link>
                    ))}
                </div>
            </div>

            <div className="pt-4 border-t border-slate-700">
                <div className="bg-surface p-4 rounded-lg border border-slate-700">
                    <h4 className="font-bold text-slate-100 mb-2">InkFlow Community</h4>
                    <p className="text-sm text-slate-400 mb-4">
                        Join a constructive and inclusive social network for software developers.
                    </p>
                    <button className="w-full text-center border border-slate-600 text-slate-300 hover:border-slate-400 hover:text-white py-2 rounded transition-colors font-medium">
                        About Us
                    </button>
                </div>
            </div>
        </aside>
    );
};

export default Sidebar;
