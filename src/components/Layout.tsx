import { Outlet, useLocation } from 'react-router-dom';
import Nav from '@app/components/Navbar';
import Sidebar from '@app/components/Sidebar';
import Footer from '@app/components/Footer';

const Layout = () => {
    const location = useLocation();

    const shouldHideSidebar =
        location.pathname.startsWith('/articles/') && location.pathname !== '/articles';

    return (
        <div className="min-h-screen flex flex-col bg-background">
            <Nav />

            {/* 主要內容區塊 */}
            <div className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-6">
                {/* 
                    定義 Grid：
                    - 預設：單欄 (grid-cols-1)
                    - 如果顯示 Sidebar：在中型螢幕以上分為 [240px_1fr]
                */}
                <div
                    className={`grid grid-cols-1 gap-4 ${
                        !shouldHideSidebar ? 'md:grid-cols-[240px_1fr]' : ''
                    }`}
                >
                    {/* 左側 Sidebar：只有在不需隱藏時才渲染 */}
                    {!shouldHideSidebar && (
                        <aside className="hidden md:block">
                            <Sidebar />
                        </aside>
                    )}

                    {/* 右側內容：這裡是 HomePage 或 ArticleListPage 顯示的地方 */}
                    <main className="min-w-0">
                        <Outlet />
                    </main>
                </div>
            </div>

            <Footer />
        </div>
    );
};

export default Layout;
