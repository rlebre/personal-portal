import React from 'react';
import Navbar from '../navbar';
import Sidebar from '../sidebar';
import styles from './layout.module.scss';

interface LayoutProps {
  children: React.ReactNode;
}

const Layout = ({ children }: LayoutProps) => {
  return (
    <div id='layout-wrapper' className={`${styles.layout__component}`}>
      <Navbar />
      <Sidebar />
      {children}
    </div>
  );
};

export default Layout;
