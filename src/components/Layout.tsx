import { Outlet } from 'react-router-dom';
import Nav from '@app/components/Navbar';

const Layout = () => {
    return (
        <>
            <Nav />
            <Outlet />
        </>
    );
};

export default Layout;
