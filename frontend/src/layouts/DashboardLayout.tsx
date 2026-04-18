import React from 'react';
import Sidebar from '../components/layout/Sidebar';
import Header from '../components/layout/Header';
import { motion } from 'framer-motion';

interface DashboardLayoutProps {
  children: React.ReactNode;
}

const DashboardLayout: React.FC<DashboardLayoutProps> = ({ children }) => {
  return (
    <div className="flex min-h-screen bg-[#bebebe]">
      {/* Sidebar with width 56 (224px) */}
      <Sidebar />

      {/* Main Content Area with margin-left 56 to match Sidebar */}
      <div className="flex-1 ml-56 flex flex-col min-h-screen">
        <Header />
        
        <main className="flex-1 p-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: 'easeOut' }}
            className="w-full h-full"
          >
            {children}
          </motion.div>
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;
