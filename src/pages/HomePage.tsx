import React, { useState, useEffect } from 'react';
// 修改引用來源
import { getArticles } from '@app/api/article';
import ArticleCard from '@app/components/ArticleCard';
// 移除 Sidebar 的引入，因為已經移到 Layout 了
// import Sidebar from '@app/components/Sidebar.tsx';
import type { Article } from '@app/types';
import { Link } from 'react-router-dom';

const HomePage: React.FC = () => {
    const [articles, setArticles] = useState<Article[]>([]);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState('relevant');

    useEffect(() => {
        const fetchArticles = async () => {
            try {
                const response = await getArticles({ page: 1, limit: 10 });

                if (response.success) {
                    setArticles(response.data.data);
                }
            } catch (error) {
                console.error('Error fetching articles:', error);
            } finally {
                setLoading(false);
            }
        };
        fetchArticles();
    }, []);

    return (
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_300px] gap-4">
            {/* Main Feed */}
            <main>
                {/* Feed Tabs */}
                <div className="flex items-center gap-2 mb-4">
                    {['Relevant', 'Latest', 'Top'].map((tab) => (
                        <button
                            key={tab}
                            onClick={() => setActiveTab(tab.toLowerCase())}
                            className={`px-3 py-2 rounded text-lg font-medium transition-colors ${
                                activeTab === tab.toLowerCase()
                                    ? 'text-white font-bold'
                                    : 'text-slate-400 hover:bg-white/10 hover:text-slate-200'
                            }`}
                        >
                            {tab}
                        </button>
                    ))}
                </div>

                {/* Loading State */}
                {loading ? (
                    <div className="space-y-4">
                        {[1, 2, 3].map((i) => (
                            <div
                                key={i}
                                className="bg-surface h-48 rounded-lg animate-pulse border border-slate-700"
                            ></div>
                        ))}
                    </div>
                ) : (
                    <div>
                        {articles.map((article, index) => (
                            <ArticleCard key={article.id} article={article} isFirst={index === 0} />
                        ))}
                        <div className="mt-4 text-center">
                            <Link
                                to="/articles"
                                className="inline-block bg-primary hover:bg-primary/80 text-white font-bold py-3 px-6 rounded transition-colors"
                            >
                                Load more articles...
                            </Link>
                        </div>
                    </div>
                )}
            </main>

            {/* Right Sidebar (Optional listings) */}
            <aside className="hidden lg:block space-y-4">
                <div className="bg-surface border border-slate-700 rounded-lg p-4">
                    <h3 className="font-bold text-slate-200 text-lg mb-4 border-b border-slate-700 pb-2">
                        Active Discussions
                    </h3>
                    {/* 這邊可以想想要放甚麼，現在是假的東西 */}
                    <ul className="space-y-4">
                        {[1, 2, 3, 4, 5].map((i) => (
                            <li key={i} className="group cursor-pointer">
                                <h4 className="text-slate-300 group-hover:text-primary text-sm mb-1">
                                    Why I stopped using React.memo
                                </h4>
                                <p className="text-xs text-slate-500">{i * 5} comments</p>
                            </li>
                        ))}
                    </ul>
                </div>
                <div className="bg-surface border border-slate-700 rounded-lg p-4">
                    <h3 className="font-bold text-slate-200 text-lg mb-4 border-b border-slate-700 pb-2">
                        #watercooler
                    </h3>
                    <ul className="space-y-4">
                        <li className="text-sm text-slate-400">Share your setup!</li>
                        <li className="text-sm text-slate-400">Music for coding?</li>
                    </ul>
                </div>
            </aside>
        </div>
    );
};

export default HomePage;
