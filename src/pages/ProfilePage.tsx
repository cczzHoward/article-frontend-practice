import React, { useEffect, useState } from 'react';
import { useAuth } from '@app/contexts/AuthContext';
import { getArticles } from '@app/api/article';
import { changePassword } from '@app/api/auth';
import ArticleCard from '@app/components/ArticleCard';
import type { Article } from '@app/types';
import Alert from '@app/components/ui/Alert';
import Input from '@app/components/ui/Input';
import Skeleton from '@app/components/ui/Skeleton';

type Tab = 'articles' | 'settings';

const ProfilePage: React.FC = () => {
    const { user } = useAuth();
    const [activeTab, setActiveTab] = useState<Tab>('articles');

    // --- Articles Logic ---
    const [articles, setArticles] = useState<Article[]>([]);
    const [loadingArticles, setLoadingArticles] = useState(false);
    const [articleError, setArticleError] = useState<string | null>(null);

    useEffect(() => {
        const fetchMyArticles = async () => {
            if (!user || activeTab !== 'articles') return;
            try {
                setLoadingArticles(true);
                // 注意：這裡依賴後端支援 author 篩選參數
                const response = await getArticles({ author: user.id });
                if (response.success) {
                    setArticles(response.data.data);
                }
            } catch (err) {
                console.error('Failed to fetch articles', err);
                setArticleError('無法載入文章');
            } finally {
                setLoadingArticles(false);
            }
        };

        fetchMyArticles();
    }, [user, activeTab]);

    // --- Settings Logic ---
    const [passwordForm, setPasswordForm] = useState({
        oldPassword: '',
        newPassword: '',
        confirmPassword: '',
    });
    const [settingsMsg, setSettingsMsg] = useState({ type: '', text: '' });
    const [loadingSettings, setLoadingSettings] = useState(false);

    const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setPasswordForm({ ...passwordForm, [e.target.name]: e.target.value });
    };

    const handlePasswordSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setSettingsMsg({ type: '', text: '' });

        if (passwordForm.newPassword !== passwordForm.confirmPassword) {
            setSettingsMsg({ type: 'error', text: '新密碼與確認密碼不符' });
            return;
        }

        try {
            setLoadingSettings(true);
            const response = await changePassword({
                oldPassword: passwordForm.oldPassword,
                newPassword: passwordForm.newPassword,
            });
            if (response.success) {
                setSettingsMsg({ type: 'success', text: '密碼修改成功！' });
                setPasswordForm({ oldPassword: '', newPassword: '', confirmPassword: '' });
            }
        } catch (err: any) {
            setSettingsMsg({
                type: 'error',
                text: err.response?.data?.message || '修改失敗，請檢查舊密碼是否正確',
            });
        } finally {
            setLoadingSettings(false);
        }
    };

    if (!user) {
        return <div className="text-white text-center mt-10">請先登入</div>;
    }

    return (
        <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-[240px_1fr] gap-8">
            {/* Left Sidebar (Profile Navigation) */}
            <aside className="space-y-2">
                <div className="bg-surface border border-slate-700 rounded-lg p-4 mb-4">
                    <div className="flex items-center gap-3 mb-4">
                        <div className="h-10 w-10 rounded-full bg-primary/20 flex items-center justify-center text-primary font-bold border border-primary">
                            {user.username.charAt(0).toUpperCase()}
                        </div>
                        <div className="overflow-hidden">
                            <div className="font-bold text-white truncate">{user.username}</div>
                            <div className="text-xs text-slate-400">
                                {user.role === 'admin' ? 'Administrator' : 'User'}
                            </div>
                        </div>
                    </div>
                </div>

                <nav className="flex flex-col space-y-1">
                    <button
                        onClick={() => setActiveTab('articles')}
                        className={`cursor-pointer text-left px-4 py-2 rounded-md transition-colors ${
                            activeTab === 'articles'
                                ? 'bg-primary text-white font-medium'
                                : 'text-slate-400 hover:bg-slate-800 hover:text-slate-200'
                        }`}
                    >
                        我的文章
                    </button>
                    <button
                        onClick={() => setActiveTab('settings')}
                        className={`cursor-pointer text-left px-4 py-2 rounded-md transition-colors ${
                            activeTab === 'settings'
                                ? 'bg-primary text-white font-medium'
                                : 'text-slate-400 hover:bg-slate-800 hover:text-slate-200'
                        }`}
                    >
                        設定
                    </button>
                </nav>
            </aside>

            {/* Right Content Area */}
            <main>
                {activeTab === 'articles' && (
                    <div className="space-y-6">
                        <h2 className="text-2xl font-bold text-white border-b border-slate-700 pb-4">
                            我的文章 ({articles.length})
                        </h2>

                        {loadingArticles ? (
                            <Skeleton count={3} />
                        ) : articleError ? (
                            <Alert message={articleError} />
                        ) : articles.length === 0 ? (
                            <div className="text-slate-400 text-center py-10 bg-surface/50 rounded-lg border border-slate-800 border-dashed">
                                尚未發布任何文章
                            </div>
                        ) : (
                            <div className="grid gap-4">
                                {articles.map((article) => (
                                    <ArticleCard key={article.id} article={article} />
                                ))}
                            </div>
                        )}
                    </div>
                )}

                {activeTab === 'settings' && (
                    <div className="max-w-xl">
                        <h2 className="text-2xl font-bold text-white border-b border-slate-700 pb-4 mb-6">
                            帳號設定
                        </h2>

                        <div className="bg-surface border border-slate-700 rounded-lg p-6">
                            <h3 className="text-lg font-medium text-white mb-4">變更密碼</h3>

                            {settingsMsg.text && (
                                <Alert
                                    type={settingsMsg.type as 'error' | 'success'}
                                    message={settingsMsg.text}
                                />
                            )}

                            <form onSubmit={handlePasswordSubmit} className="space-y-4">
                                <Input
                                    label="目前密碼"
                                    type="password"
                                    name="oldPassword"
                                    required
                                    value={passwordForm.oldPassword}
                                    onChange={handlePasswordChange}
                                />
                                <Input
                                    label="新密碼"
                                    type="password"
                                    name="newPassword"
                                    required
                                    value={passwordForm.newPassword}
                                    onChange={handlePasswordChange}
                                />
                                <Input
                                    label="確認新密碼"
                                    type="password"
                                    name="confirmPassword"
                                    required
                                    value={passwordForm.confirmPassword}
                                    onChange={handlePasswordChange}
                                />

                                <div className="pt-2">
                                    <button
                                        type="submit"
                                        disabled={loadingSettings}
                                        className="cursor-pointer bg-primary hover:bg-primary/90 text-white font-bold py-2 px-4 rounded transition-colors disabled:opacity-50"
                                    >
                                        {loadingSettings ? '更新中...' : '更新密碼'}
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                )}
            </main>
        </div>
    );
};

export default ProfilePage;
