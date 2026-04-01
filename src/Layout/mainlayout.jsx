import React from 'react';
import { Outlet } from 'react-router-dom';
import Header from '../components/navbar';
import Footer from '../components/footer';

const Layout = () => {
  return (
    <div className="min-h-screen flex flex-col bg-white dark:bg-gray-950 text-black dark:text-white transition-colors duration-300">
      {/* Header har doim tepada turadi */}
      <Header />

      {/* Sahifalar almashadigan joy */}
      <main className="flex-grow">
        <Outlet /> 
      </main>

      {/* Footer har doim pastda turadi */}
      <Footer />
    </div>
  );
};

export default Layout;