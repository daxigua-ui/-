import { useState } from 'react';
import Sidebar from './Sidebar';
import Header from './Header';

export default function Layout({ children, activeItem, onNavigate }) {
  const [isCollapsed, setIsCollapsed] = useState(false);

  return (
    <div className="min-h-screen bg-surface text-on-surface">
      <Sidebar 
        isCollapsed={isCollapsed} 
        onToggle={() => setIsCollapsed(!isCollapsed)} 
        activeItem={activeItem}
        onNavigate={onNavigate}
      />
      <Header isCollapsed={isCollapsed} activeItem={activeItem} />
      
      <main className={`transition-all duration-300 pt-[88px] px-6 pb-12 min-h-screen ${isCollapsed ? 'ml-20' : 'ml-[240px]'}`}>
        <div className="max-w-[1920px] mx-auto">
          {children}
        </div>
      </main>
    </div>
  );
}
