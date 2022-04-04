import React from 'react';
import Navbar from '../navbar';
import Sidebar from '../sidebar';
import styles from './layout.module.scss';

interface LayoutProps {
  children: React.ReactNode;
}

const Layout = ({ children }: LayoutProps) => {
  return (
    <div className={styles.layout}>
      <Sidebar />
      <div id='layout-wrapper' className={`${styles.layout__component}`}>
        <Navbar />
        {children}
      </div>
    </div>
  );
};

export default Layout;
