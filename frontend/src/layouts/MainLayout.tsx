import React from 'react';
import { Outlet } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';

interface MainLayoutProps {
    children?: React.ReactNode;
}

const MainLayout: React.FC<MainLayoutProps> = ({ children }) => {
    return (
        <div className="flex flex-col min-h-screen bg-brand-bg select-none">
            <Navbar />
            <main className="flex-grow">
                {children || <Outlet />}
            </main>
            <Footer />
        </div>
    );
};

export default MainLayout;
