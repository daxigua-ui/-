import { Search, Bell, Clock, Sun, Moon, LogOut } from 'lucide-react';
import { useTheme } from '../contexts/ThemeContext';
import { useAuth } from '../contexts/AuthContext';

export default function Header({ isCollapsed, activeItem }) {
  const { theme, toggleTheme } = useTheme();
  const { logout } = useAuth();
  const isBasicInfo = activeItem === '基础信息管理';
  const isOrderMgmt = activeItem === '订单管理';
  const isAirspace = activeItem === '空域规划';

  return (
    <header className={`fixed top-0 right-0 z-40 flex items-center justify-between px-6 h-16 transition-all duration-300 bg-surface/60 backdrop-blur-xl border-b border-outline-variant/30 ${isCollapsed ? 'w-[calc(100%-5rem)]' : 'w-[calc(100%-240px)]'}`}>
      <div className="flex items-center gap-6">
        <span className="text-[20px] font-semibold text-on-surface tracking-tight">{activeItem}</span>
        {!isBasicInfo && !isOrderMgmt && !isAirspace && (
          <div className="relative group">
            <span className="absolute inset-y-0 left-3 flex items-center text-outline">
              <Search size={16} />
            </span>
            <input 
              type="text" 
              className="bg-surface-container-low border border-outline-variant/20 rounded-xl py-1.5 pl-10 pr-4 text-[14px] w-64 transition-all text-on-surface placeholder:text-outline font-normal hover:border-primary-container/50 focus:outline-none focus:border-primary-container focus:shadow-[0_0_10px_rgba(22,93,255,0.2)]"
              placeholder="快速搜索 (⌘+K)"
            />
          </div>
        )}
      </div>

      <div className="flex items-center gap-4">
        <div className="flex items-center gap-1">
          <button className="p-2 text-outline hover:bg-surface-container-high rounded-xl transition-all">
            <Bell size={20} />
          </button>
          <button className="p-2 text-outline hover:bg-surface-container-high rounded-xl transition-all">
            <Clock size={20} />
          </button>
          <button 
            onClick={toggleTheme}
            className="p-2 text-outline hover:bg-surface-container-high rounded-xl transition-all"
            title={theme === 'dark' ? '切换到浅色模式' : '切换到深色模式'}
          >
            {theme === 'dark' ? <Sun size={20} /> : <Moon size={20} />}
          </button>
        </div>
        <div className="h-8 w-[1px] bg-outline-variant/30"></div>
        <div className="flex items-center gap-3">
          <span className="font-mono text-primary font-bold text-sm tracking-widest">0:00:00</span>
          <button 
            onClick={logout}
            className="p-2 text-outline hover:text-white hover:bg-[#165DFF] active:bg-[#165DFF]/80 active:scale-95 rounded-xl transition-all"
            title="退出登录"
          >
            <LogOut size={20} />
          </button>
        </div>
      </div>
    </header>
  );
}
