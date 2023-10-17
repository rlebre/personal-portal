import React from 'react';
import Navbar from '../navbar/MobileTopNavbar';
import Sidebar from '../navbar/Navbar';
import styles from './layout.module.scss';
import Footer from '../Footer';

interface LayoutProps {
  children: React.ReactNode;
}

const Layout = ({ children }: LayoutProps) => {
  return (
    <div id='layout-wrapper' className={`${styles.layout__component}`}>
      <Navbar />
      <Sidebar />
      {children}
      <Footer />
    </div>
  );
};

export default Layout;
