import { useState } from 'react';
import { 
  History, 
  Trash2, 
  Search, 
  RotateCcw, 
  ChevronLeft, 
  ChevronRight,
  Calendar,
  Clock,
  FileJson,
  Eye,
  Activity,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';
import { motion } from 'motion/react';

const SIMULATION_DATA = [
  {
    id: 'SIM-20260407-3545',
    status: '未完成',
    startTime: '2026-04-07 11:30:12',
    endTime: '2026-04-07 11:30:18',
    archiveTime: '2026-04-07 11:30:18',
    stats: {
      totalOrders: 2,
      completed: 0,
      partiallyCompleted: 0,
      unfinished: 2,
      totalSorties: 6,
      totalRange: '1.46 km',
      duration: '00:00:48',
      totalCost: '¥98.85'
    }
  },
  {
    id: 'SIM-20260323-0513',
    status: '未完成',
    startTime: '2026-03-23 18:13:53',
    endTime: '2026-03-23 18:19:56',
    archiveTime: '2026-03-23 18:19:56',
    stats: {
      totalOrders: 2,
      completed: 0,
      partiallyCompleted: 2,
      unfinished: 0,
      totalSorties: 6,
      totalRange: '400.68 km',
      duration: '00:48:09',
      totalCost: '¥3428.57'
    }
  }
];

export default function SimulationHistory() {
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [status, setStatus] = useState('全部状态');

  return (
    <div className="flex flex-col gap-8 animate-in fade-in duration-700 relative text-left">
      {/* Decorative Background Orbs */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
        <motion.div 
          animate={{ 
            x: [0, 100, 0], 
            y: [0, 50, 0],
            scale: [1, 1.2, 1]
          }}
          transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
          className="absolute -top-[10%] -left-[10%] w-[40%] h-[40%] bg-primary-container/10 rounded-full blur-[120px]"
        />
        <motion.div 
          animate={{ 
            x: [0, -80, 0], 
            y: [0, 100, 0],
            scale: [1, 1.1, 1]
          }}
          transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
          className="absolute top-[40%] -right-[5%] w-[30%] h-[30%] bg-[#ef4444]/5 rounded-full blur-[100px]"
        />
      </div>

      {/* Header */}
      <div className="flex items-center justify-between relative z-10">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-primary-container/10 rounded-xl flex items-center justify-center text-primary-container">
            <History size={24} />
          </div>
          <h2 className="text-[24px] font-bold text-on-surface tracking-tight">仿真历史记录</h2>
        </div>
        <div className="flex items-center gap-3">
          <button className="flex items-center gap-2 px-4 py-2 bg-surface-container-high hover:bg-surface-container-highest text-on-surface rounded-xl transition-all border border-outline-variant/10 text-[14px] font-medium">
            <FileJson size={18} />
            批量导出JSON
          </button>
          <button className="flex items-center gap-2 px-4 py-2 bg-error/10 hover:bg-error/20 text-error rounded-xl transition-all border border-error/20 text-[14px] font-medium">
            <Trash2 size={18} />
            清空所有记录
          </button>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 relative z-10">
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          whileHover={{ y: -4, scale: 1.01 }}
          className="relative group cursor-pointer"
        >
          <div className="absolute inset-0 bg-gradient-to-br from-[#3b82f6] to-[#1d4ed8] rounded-xl blur-xl opacity-20 group-hover:opacity-40 transition-opacity" />
          <div className="relative h-full bg-gradient-to-br from-[#3b82f6] to-[#1d4ed8] rounded-xl p-6 border border-white/20 shadow-2xl overflow-hidden">
            <div className="absolute -right-6 -top-6 text-white/10 group-hover:scale-125 group-hover:rotate-12 transition-transform duration-700">
              <Activity size={140} />
            </div>
            <div className="relative z-10 space-y-3">
              <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center backdrop-blur-md">
                <Activity size={20} className="text-white" />
              </div>
              <div>
                <p className="text-white/80 text-[14px] font-medium tracking-wide">总仿真次数</p>
                <h3 className="text-[36px] font-black text-white tracking-tighter leading-none mt-1">2</h3>
              </div>
            </div>
          </div>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          whileHover={{ y: -4, scale: 1.01 }}
          className="relative group cursor-pointer"
        >
          <div className="absolute inset-0 bg-gradient-to-br from-[#10b981] to-[#047857] rounded-xl blur-xl opacity-20 group-hover:opacity-40 transition-opacity" />
          <div className="relative h-full bg-gradient-to-br from-[#10b981] to-[#047857] rounded-xl p-6 border border-white/20 shadow-2xl overflow-hidden">
            <div className="absolute -right-6 -top-6 text-white/10 group-hover:scale-125 group-hover:rotate-12 transition-transform duration-700">
              <CheckCircle2 size={140} />
            </div>
            <div className="relative z-10 space-y-3">
              <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center backdrop-blur-md">
                <CheckCircle2 size={20} className="text-white" />
              </div>
              <div>
                <p className="text-white/80 text-[14px] font-medium tracking-wide">已完成</p>
                <h3 className="text-[36px] font-black text-white tracking-tighter leading-none mt-1">0</h3>
              </div>
            </div>
          </div>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          whileHover={{ y: -4, scale: 1.01 }}
          className="relative group cursor-pointer"
        >
          <div className="absolute inset-0 bg-gradient-to-br from-[#ef4444] to-[#b91c1c] rounded-xl blur-xl opacity-20 group-hover:opacity-40 transition-opacity" />
          <div className="relative h-full bg-gradient-to-br from-[#ef4444] to-[#b91c1c] rounded-xl p-6 border border-white/20 shadow-2xl overflow-hidden">
            <div className="absolute -right-6 -top-6 text-white/10 group-hover:scale-125 group-hover:rotate-12 transition-transform duration-700">
              <AlertCircle size={140} />
            </div>
            <div className="relative z-10 space-y-3">
              <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center backdrop-blur-md">
                <AlertCircle size={20} className="text-white" />
              </div>
              <div>
                <p className="text-white/80 text-[14px] font-medium tracking-wide">未完成</p>
                <h3 className="text-[36px] font-black text-white tracking-tighter leading-none mt-1">2</h3>
              </div>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Filters */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="bg-surface-container/50 backdrop-blur-2xl border border-outline-variant/10 rounded-xl p-6 flex flex-wrap items-end gap-6 shadow-2xl relative z-10"
      >
        <div className="flex-1 min-w-[200px] space-y-2">
          <label className="text-[12px] text-outline font-semibold ml-1 tracking-wide uppercase">起始日期</label>
          <div className="relative group">
            <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 text-outline/30 group-focus-within:text-primary-container transition-colors" size={18} />
            <input 
              type="date" 
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              className="w-full h-[42px] bg-surface-container-low border border-outline-variant/10 rounded-xl pl-11 pr-4 text-[14px] text-on-surface focus:outline-none focus:border-primary-container focus:bg-surface-container-high transition-all"
            />
          </div>
        </div>
        <div className="flex-1 min-w-[200px] space-y-2">
          <label className="text-[12px] text-outline font-semibold ml-1 tracking-wide uppercase">结束日期</label>
          <div className="relative group">
            <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 text-outline/30 group-focus-within:text-primary-container transition-colors" size={18} />
            <input 
              type="date" 
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              className="w-full h-[42px] bg-surface-container-low border border-outline-variant/10 rounded-xl pl-11 pr-4 text-[14px] text-on-surface focus:outline-none focus:border-primary-container focus:bg-surface-container-high transition-all"
            />
          </div>
        </div>
        <div className="flex-1 min-w-[200px] space-y-2">
          <label className="text-[12px] text-outline font-semibold ml-1 tracking-wide uppercase">仿真状态</label>
          <div className="relative group">
            <select 
              value={status}
              onChange={(e) => setStatus(e.target.value)}
              className="w-full h-[42px] bg-surface-container-low border border-outline-variant/10 rounded-xl px-4 text-[14px] text-on-surface focus:outline-none focus:border-primary-container focus:bg-surface-container-high transition-all appearance-none cursor-pointer"
            >
              <option value="全部状态">全部状态</option>
              <option value="已完成">已完成</option>
              <option value="未完成">未完成</option>
            </select>
            <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-outline/30">
              <ChevronRight size={16} className="rotate-90" />
            </div>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <button className="h-[42px] px-8 bg-primary-container hover:bg-primary-container/90 text-white rounded-xl font-bold transition-all shadow-xl shadow-primary-container/30 flex items-center gap-2 active:scale-95">
            <Search size={18} />
            查询
          </button>
          <button className="h-[42px] px-8 bg-surface-container-high hover:bg-surface-container-highest text-on-surface rounded-xl font-bold transition-all border border-outline-variant/10 flex items-center gap-2 active:scale-95">
            <RotateCcw size={18} />
            重置
          </button>
        </div>
      </motion.div>

      {/* List */}
      <div className="space-y-4 relative z-10">
        {SIMULATION_DATA.map((item, index) => (
          <motion.div 
            key={item.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 + index * 0.1 }}
            whileHover={{ scale: 1.005, y: -2 }}
            className="bg-surface-container-low backdrop-blur-3xl border border-outline-variant/10 rounded-xl p-5 hover:border-primary-container/40 transition-all group shadow-2xl relative overflow-hidden"
          >
            <div className="absolute top-0 left-0 w-1 h-full bg-primary-container opacity-0 group-hover:opacity-100 transition-opacity" />
            
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 mb-6">
              <div className="space-y-1.5">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 bg-surface-container-high rounded-xl flex items-center justify-center text-primary-container group-hover:bg-primary-container group-hover:text-white transition-all duration-500">
                    <History size={18} />
                  </div>
                  <h4 className="text-[18px] font-bold text-on-surface tracking-tight group-hover:text-primary-container transition-colors">{item.id}</h4>
                </div>
                <div className="flex flex-wrap items-center gap-x-5 gap-y-1.5 text-[12px] text-outline/60 ml-12">
                  <span className="flex items-center gap-2 group-hover:text-on-surface/80 transition-colors">
                    <Clock size={14} className="text-primary-container/60" /> 
                    仿真时间：<span className="text-outline/40">{item.startTime}</span> <span className="text-outline/20">→</span> <span className="text-outline/40">{item.endTime}</span>
                  </span>
                  <span className="flex items-center gap-2 group-hover:text-on-surface/80 transition-colors">
                    <Calendar size={14} className="text-primary-container/60" /> 
                    归档时间：<span className="text-outline/40">{item.archiveTime}</span>
                  </span>
                </div>
              </div>
              
              <div className="flex items-center gap-2.5">
                <button className="flex items-center gap-1.5 px-4 py-2 bg-surface-container-high hover:bg-primary-container text-on-surface hover:text-white rounded-xl transition-all border border-outline-variant/10 text-[12px] font-bold group/btn shadow-lg">
                  <Eye size={14} className="group-hover/btn:scale-110 transition-transform" />
                  查看详情
                </button>
                <button className="flex items-center gap-1.5 px-4 py-2 bg-surface-container-high hover:bg-surface-container-highest text-on-surface rounded-xl transition-all border border-outline-variant/10 text-[12px] font-bold group/btn shadow-lg">
                  <FileJson size={14} className="group-hover/btn:scale-110 transition-transform" />
                  导出JSON
                </button>
                <button className="flex items-center gap-1.5 px-4 py-2 bg-error/10 hover:bg-error text-error hover:text-white rounded-xl transition-all border border-error/20 text-[12px] font-bold group/btn shadow-lg">
                  <Trash2 size={14} className="group-hover/btn:scale-110 transition-transform" />
                  删除
                </button>
              </div>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-4 p-4 bg-surface-container-high rounded-xl border border-outline-variant/10 group-hover:bg-surface-container-highest transition-colors">
              {[
                { label: '订单总数', value: item.stats.totalOrders },
                { label: '完成', value: item.stats.completed },
                { label: '部分完成', value: item.stats.partiallyCompleted },
                { label: '未完成', value: item.stats.unfinished },
                { label: '总架次', value: item.stats.totalSorties },
                { label: '总航程', value: item.stats.totalRange },
                { label: '仿真时长', value: item.stats.duration },
                { label: '总成本', value: item.stats.totalCost },
              ].map((stat, i) => (
                <div key={i} className="space-y-1">
                  <p className="text-[10px] text-outline/40 font-bold uppercase tracking-wider">{stat.label}</p>
                  <p className="text-[14px] text-on-surface font-black tracking-tight">{stat.value}</p>
                </div>
              ))}
            </div>
          </motion.div>
        ))}
      </div>

      {/* Pagination */}
      <div className="flex items-center justify-center gap-4 mt-4">
        <button className="p-2 bg-surface-container-high hover:bg-surface-container-highest text-on-surface rounded-xl border border-outline-variant/10 transition-all disabled:opacity-20 disabled:cursor-not-allowed" disabled>
          <ChevronLeft size={20} />
          <span className="sr-only">上一页</span>
        </button>
        <div className="px-4 py-2 bg-surface-container-high rounded-xl border border-outline-variant/10 text-[14px] text-on-surface font-medium">
          第 1 / 1 页 (共 2 条)
        </div>
        <button className="p-2 bg-surface-container-high hover:bg-surface-container-highest text-on-surface rounded-xl border border-outline-variant/10 transition-all disabled:opacity-20 disabled:cursor-not-allowed" disabled>
          <ChevronRight size={20} />
          <span className="sr-only">下一页</span>
        </button>
      </div>
    </div>
  );
}
