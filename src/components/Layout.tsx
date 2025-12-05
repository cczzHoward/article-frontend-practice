import { Outlet } from 'react-router-dom';
import Nav from '@app/components/Navbar';
import Sidebar from '@app/components/Sidebar'; // 修正這裡：componets -> components
import Footer from '@app/components/Footer';

const Layout = () => {
    return (
        <div className="min-h-screen flex flex-col bg-background">
            <Nav />

            {/* 主要內容區塊：包含 Sidebar 和變動的頁面內容 (Outlet) */}
            <div className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-6">
                {/* 定義 Grid：左側固定 Sidebar (240px)，右側自適應內容 (1fr) */}
                <div className="grid grid-cols-1 md:grid-cols-[240px_1fr] gap-4">
                    {/* 左側 Sidebar */}
                    <aside className="hidden md:block">
                        <Sidebar />
                    </aside>

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
