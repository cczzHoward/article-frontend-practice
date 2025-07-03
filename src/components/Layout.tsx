import { Outlet } from 'react-router-dom';
import Nav from '@app/components/NavBar';

const Layout = () => {
    return (
        <>
            <Nav />
            <Outlet />
        </>
    );
};

export default Layout;
