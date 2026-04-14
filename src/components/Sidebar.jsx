import { 
  FolderKanban, 
  Database, 
  ReceiptText, 
  Globe, 
  Map as MapIcon, 
  PlaneTakeoff, 
  Activity, 
  History, 
  Settings, 
  HelpCircle,
  ChevronRight,
  PanelLeftClose
} from 'lucide-react';
import { motion } from 'motion/react';
import { useAuth } from '../contexts/AuthContext';

const navItems = [
  { icon: FolderKanban, label: '项目管理', active: true },
  { icon: Database, label: '基础信息管理' },
  { icon: ReceiptText, label: '订单管理' },
  { icon: Globe, label: '空域规划' },
  { icon: MapIcon, label: '航线管理' },
  { icon: PlaneTakeoff, label: '飞行计划' },
  { icon: Activity, label: '飞行监控' },
  { icon: History, label: '仿真历史' },
];

export default function Sidebar({ isCollapsed, onToggle, activeItem, onNavigate }) {
  const { user } = useAuth();

  return (
    <aside className={`fixed left-0 top-0 h-full bg-surface/80 backdrop-blur-2xl flex flex-col z-50 shadow-2xl border-r border-outline-variant/30 transition-all duration-300 ${isCollapsed ? 'w-20' : 'w-[240px]'}`}>
      <div className={`p-6 border-b border-outline-variant/20 flex items-center transition-all duration-300 relative ${isCollapsed ? 'justify-center' : 'justify-between'}`}>
        <div className="flex items-center gap-3 overflow-hidden">
          <div className="w-8 h-8 bg-primary-container rounded-xl flex items-center justify-center text-white font-bold shrink-0">
            O
          </div>
          {!isCollapsed && (
            <motion.div
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -10 }}
            >
              <h1 className="text-[18px] font-semibold text-on-surface tracking-tight whitespace-nowrap">仿真物流平台</h1>
            </motion.div>
          )}
        </div>
        
        <button 
          onClick={onToggle}
          className={`p-1.5 rounded-xl hover:bg-surface-container-high text-outline hover:text-on-surface transition-all ${isCollapsed ? 'absolute -right-3 top-7 bg-primary-container text-white shadow-lg rounded-xl w-6 h-6 flex items-center justify-center' : ''}`}
        >
          {isCollapsed ? <ChevronRight size={14} /> : <PanelLeftClose size={20} />}
        </button>
      </div>

      <nav className="flex-1 px-3 space-y-1 overflow-hidden">
        {navItems.map((item) => (
          <button
            key={item.label}
            onClick={() => onNavigate(item.label)}
            title={isCollapsed ? item.label : ''}
            className={`w-full flex items-center rounded-xl transition-all duration-200 ${isCollapsed ? 'justify-center p-3' : 'px-4 py-3 gap-3'} ${
              activeItem === item.label 
                ? 'text-white bg-primary-container font-semibold' 
                : 'text-outline hover:text-on-surface hover:bg-surface-container-high'
            }`}
          >
            <item.icon size={20} className="shrink-0" />
            {!isCollapsed && (
              <motion.span 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="font-medium tracking-tight text-[14px] whitespace-nowrap"
              >
                {item.label}
              </motion.span>
            )}
          </button>
        ))}
      </nav>

      <div className="mt-auto p-4 space-y-1 border-t border-outline-variant/10 relative">
        <a href="#" className={`flex items-center text-outline hover:text-on-surface transition-colors ${isCollapsed ? 'justify-center p-2' : 'px-4 py-2 gap-3'}`}>
          <Settings size={18} />
          {!isCollapsed && <span className="text-[14px] font-medium">设置</span>}
        </a>
        <a href="#" className={`flex items-center text-outline hover:text-on-surface transition-colors ${isCollapsed ? 'justify-center p-2' : 'px-4 py-2 gap-3'}`}>
          <HelpCircle size={18} />
          {!isCollapsed && <span className="text-[14px] font-medium">支持</span>}
        </a>
        
        <div className={`pt-4 flex items-center transition-all duration-300 ${isCollapsed ? 'justify-center' : 'gap-3 px-4'}`}>
          <div className="w-8 h-8 rounded-xl bg-surface-container-highest flex items-center justify-center overflow-hidden shrink-0">
            <img 
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuD8pUCHwCN1ElvM856nqqU0BHjXU97zVIBoEd5gPn9PU6-oTzeF7Dmqf6xFD4aEm8s7jigAvSGPj80MxU9sswWnl7SZcPh_I0uhpV93XupiNszd2Sh0lmu698oBYW2503oZvAmIhvcT5eQAGBvqcC4tZTtb9uslZ7mM_ljLnyYVjamB4yGPzOJu8k5nttuuePwTZN50Ynv8Z8YOnUNreR9BiVJkz7c1bunbnWHXRlGM8JFm09wVTtuVeL6iFL07SkTzcoRy89-M_3k" 
              alt="用户头像"
              referrerPolicy="no-referrer"
            />
          </div>
          {!isCollapsed && (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex flex-col"
            >
              <span className="text-xs font-bold text-on-surface leading-none">{user?.username || '用户'}</span>
              <span className="text-[10px] text-outline">全球区域</span>
            </motion.div>
          )}
        </div>
      </div>
    </aside>
  );
}
