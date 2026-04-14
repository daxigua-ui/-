import React, { useState } from 'react';
import { 
  Play, 
  Pause, 
  RotateCcw, 
  StopCircle
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

const FLIGHT_PLANS = [
  {
    id: 'TASK-20260323-2350',
    name: '深圳龙华-东莞沙田 小件转运',
    delay: '0时 0分 0秒',
    order: 'ORDER-20260323-9422',
    route: '深圳龙华-东莞沙田跨城航线',
    action: '降落&返航',
    model: '丰舟 90 等3架',
    status: '执行中',
    createdAt: '2026-03-23 18:11:15',
    aircrafts: [
      {
        model: '丰舟 90',
        sn: 'UAV007989971',
        range: '106.07 km',
        mode: '自动调度',
        type: '弹性循环',
        fixedSorties: '-',
        currentSortie: '12',
        totalRange: '1277.79 km',
        progress: 100,
        status: '已完成'
      },
      {
        model: '丰舟 90',
        sn: 'UAV007989974',
        range: '106.07 km',
        mode: '自动调度',
        type: '弹性循环',
        fixedSorties: '-',
        currentSortie: '13',
        totalRange: '1384.27 km',
        progress: 100,
        status: '已完成'
      },
      {
        model: '丰舟 90',
        sn: 'UAV007989975',
        range: '106.07 km',
        mode: '手动操作',
        type: '弹性循环',
        fixedSorties: '-',
        currentSortie: '-',
        totalRange: '0.0 m',
        progress: 0,
        status: '待起飞'
      }
    ]
  },
  {
    id: 'TASK-20260323-2667',
    name: '深圳龙华-东莞沙田 中大件转运',
    delay: '0时 0分 0秒',
    order: 'ORDER-20260323-1421',
    route: '深圳龙华-东莞沙田跨城航线',
    action: '降落&返航',
    model: '丰舟 90 等3架',
    status: '执行中',
    createdAt: '2026-03-23 18:13:32',
    aircrafts: [
      {
        model: '丰舟 90',
        sn: 'UAV007989980',
        range: '106.07 km',
        mode: '自动调度',
        type: '弹性循环',
        fixedSorties: '-',
        currentSortie: '5',
        totalRange: '530.35 km',
        progress: 45,
        status: '执行中'
      }
    ]
  }
];

export default function FlightPlan() {
  const [expandedTasks, setExpandedTasks] = useState(['TASK-20260323-2350']);

  const toggleTask = (taskId) => {
    setExpandedTasks(prev => 
      prev.includes(taskId) 
        ? prev.filter(id => id !== taskId) 
        : [...prev, taskId]
    );
  };

  return (
    <div className="flex flex-col gap-6 animate-in fade-in duration-500 text-left">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h2 className="text-[24px] font-bold text-on-surface tracking-tight">飞行计划管理</h2>
        <div className="flex items-center gap-3">
          <button className="flex items-center gap-2 px-4 py-2 bg-surface-container-high hover:bg-surface-container-highest text-on-surface rounded-xl transition-all border border-outline-variant/10 text-[14px] font-medium">
            <Pause size={18} />
            暂停
          </button>
          <button className="flex items-center gap-2 px-4 py-2 bg-surface-container-high hover:bg-surface-container-highest text-on-surface rounded-xl transition-all border border-outline-variant/10 text-[14px] font-medium">
            <RotateCcw size={18} />
            重置
          </button>
          <button className="flex items-center gap-2 px-4 py-2 bg-error hover:bg-error/90 text-white rounded-xl transition-all shadow-lg shadow-error/20 text-[14px] font-bold">
            <StopCircle size={18} />
            结束仿真
          </button>
        </div>
      </div>

      {/* Table Container */}
      <div className="bg-surface-container-low backdrop-blur-3xl border border-outline-variant/10 rounded-xl overflow-hidden shadow-2xl">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-outline-variant/10 bg-surface-container-high">
              <th className="px-6 py-4 text-[12px] font-bold text-outline/40 uppercase tracking-wider">任务编号</th>
              <th className="px-6 py-4 text-[12px] font-bold text-outline/40 uppercase tracking-wider">任务名称</th>
              <th className="px-6 py-4 text-[12px] font-bold text-outline/40 uppercase tracking-wider">延时执行</th>
              <th className="px-6 py-4 text-[12px] font-bold text-outline/40 uppercase tracking-wider">关联订单</th>
              <th className="px-6 py-4 text-[12px] font-bold text-outline/40 uppercase tracking-wider">执行航线</th>
              <th className="px-6 py-4 text-[12px] font-bold text-outline/40 uppercase tracking-wider">完成动作</th>
              <th className="px-6 py-4 text-[12px] font-bold text-outline/40 uppercase tracking-wider">飞机型号</th>
              <th className="px-6 py-4 text-[12px] font-bold text-outline/40 uppercase tracking-wider">状态</th>
              <th className="px-6 py-4 text-[12px] font-bold text-outline/40 uppercase tracking-wider">创建时间</th>
              <th className="px-6 py-4 text-[12px] font-bold text-outline/40 uppercase tracking-wider text-right">操作</th>
            </tr>
          </thead>
          <tbody>
            {FLIGHT_PLANS.map((task) => (
              <React.Fragment key={task.id}>
                <tr 
                  className={`group hover:bg-surface-container-high transition-colors cursor-pointer ${expandedTasks.includes(task.id) ? 'bg-surface-container-high' : ''}`}
                  onClick={() => toggleTask(task.id)}
                >
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className={`w-5 h-5 rounded flex items-center justify-center transition-colors ${expandedTasks.includes(task.id) ? 'bg-primary-container text-white' : 'bg-on-surface/10 text-outline/40'}`}>
                        <Play size={12} fill={expandedTasks.includes(task.id) ? "currentColor" : "none"} />
                      </div>
                      <span className="text-[14px] font-bold text-primary-container group-hover:underline underline-offset-4">{task.id}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-[14px] text-on-surface/80 font-medium">{task.name}</td>
                  <td className="px-6 py-4 text-[14px] text-outline/60">{task.delay}</td>
                  <td className="px-6 py-4 text-[14px] font-bold text-primary-container">{task.order}</td>
                  <td className="px-6 py-4 text-[14px] text-outline/60">{task.route}</td>
                  <td className="px-6 py-4 text-[14px] text-outline/60">{task.action}</td>
                  <td className="px-6 py-4 text-[14px] text-outline/60">{task.model}</td>
                  <td className="px-6 py-3">
                    <span className={`px-2 py-0.5 border rounded text-[11px] font-bold whitespace-nowrap ${
                      task.status === '执行中' ? 'bg-success/10 text-success border-success/20' : 
                      task.status === '已结束' ? 'bg-on-surface/10 text-outline/40 border-outline-variant/10' :
                      'bg-warning/10 text-warning border-warning/20'
                    }`}>
                      {task.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-[13px] text-outline/40">{task.createdAt}</td>
                  <td className="px-6 py-3 text-right whitespace-nowrap">
                    <button 
                      onClick={(e) => {
                        e.stopPropagation();
                        toggleTask(task.id);
                      }}
                      className="inline-flex items-center justify-center px-3 py-1 bg-surface-container-high hover:bg-surface-container-highest text-on-surface border border-outline-variant/10 rounded-lg text-[12px] font-bold transition-all min-w-[60px]"
                    >
                      {expandedTasks.includes(task.id) ? '收起' : '详情'}
                    </button>
                  </td>
                </tr>
                
                {/* Expanded Aircraft List */}
                <AnimatePresence>
                  {expandedTasks.includes(task.id) && task.aircrafts.length > 0 && (
                    <tr>
                      <td colSpan={10} className="p-0">
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: 'auto', opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          className="overflow-hidden bg-surface-container-low/50"
                        >
                          <div className="px-12 py-4">
                            <table className="w-full text-left border-collapse">
                              <thead>
                                <tr className="border-b border-outline-variant/10">
                                  <th className="px-4 py-3 text-[11px] font-bold text-outline/30 uppercase tracking-wider">飞机型号</th>
                                  <th className="px-4 py-3 text-[11px] font-bold text-outline/30 uppercase tracking-wider">SN码</th>
                                  <th className="px-4 py-3 text-[11px] font-bold text-outline/30 uppercase tracking-wider">预计航程</th>
                                  <th className="px-4 py-3 text-[11px] font-bold text-outline/30 uppercase tracking-wider">执行模式</th>
                                  <th className="px-4 py-3 text-[11px] font-bold text-outline/30 uppercase tracking-wider">架次类型</th>
                                  <th className="px-4 py-3 text-[11px] font-bold text-outline/30 uppercase tracking-wider">固定架次数</th>
                                  <th className="px-4 py-3 text-[11px] font-bold text-outline/30 uppercase tracking-wider">当前架次</th>
                                  <th className="px-4 py-3 text-[11px] font-bold text-outline/30 uppercase tracking-wider">总飞行航程</th>
                                  <th className="px-4 py-3 text-[11px] font-bold text-outline/30 uppercase tracking-wider">当前航程进度</th>
                                  <th className="px-4 py-3 text-[11px] font-bold text-outline/30 uppercase tracking-wider">飞机状态</th>
                                  <th className="px-4 py-3 text-[11px] font-bold text-outline/30 uppercase tracking-wider text-right">操作</th>
                                </tr>
                              </thead>
                              <tbody>
                                {task.aircrafts.map((aircraft, idx) => (
                                  <tr key={idx} className="border-b border-outline-variant/5 last:border-0 hover:bg-surface-container-high transition-colors">
                                    <td className="px-4 py-2 text-[13px] text-on-surface/80">{aircraft.model}</td>
                                    <td className="px-4 py-2 text-[13px] text-outline/40">{aircraft.sn}</td>
                                    <td className="px-4 py-2 text-[13px] text-on-surface/80">{aircraft.range}</td>
                                    <td className="px-4 py-2">
                                      <span className={`px-2 py-0.5 rounded text-[11px] font-bold whitespace-nowrap ${
                                        aircraft.mode === '自动调度' ? 'bg-primary-container/10 text-primary-container border border-primary-container/20' : 'bg-warning/10 text-warning border border-warning/20'
                                      }`}>
                                        {aircraft.mode}
                                      </span>
                                    </td>
                                    <td className="px-4 py-2">
                                      <span className={`px-2 py-0.5 border rounded text-[11px] font-bold whitespace-nowrap ${
                                        aircraft.type === '弹性循环' ? 'bg-indigo-500/10 text-indigo-400 border-indigo-500/20' : 
                                        aircraft.type === '固定架次' ? 'bg-cyan-500/10 text-cyan-400 border-cyan-500/20' :
                                        'bg-success/10 text-success border-success/20'
                                      }`}>
                                        {aircraft.type}
                                      </span>
                                    </td>
                                    <td className="px-4 py-2 text-[13px] text-outline/40">{aircraft.fixedSorties}</td>
                                    <td className="px-4 py-2 text-[13px] text-on-surface/80">{aircraft.currentSortie}</td>
                                    <td className="px-4 py-2 text-[13px] text-on-surface/80">{aircraft.totalRange}</td>
                                    <td className="px-4 py-2 min-w-[200px]">
                                      <div className="flex items-center gap-3">
                                        <div className="flex items-center gap-1.5 min-w-[70px] text-[10px] font-bold text-outline/40">
                                          <span className="whitespace-nowrap">{aircraft.progress === 100 ? '已完成' : aircraft.progress > 0 ? '执行中' : '未启动'}</span>
                                          <span>{aircraft.progress}%</span>
                                        </div>
                                        <div className="h-1.5 flex-1 bg-on-surface/5 rounded-full overflow-hidden">
                                          <motion.div 
                                            initial={{ width: 0 }}
                                            animate={{ width: `${aircraft.progress}%` }}
                                            transition={{ duration: 1, ease: "easeOut" }}
                                            className="h-full bg-primary-container shadow-[0_0_10px_rgba(22,93,255,0.5)]"
                                          />
                                        </div>
                                      </div>
                                    </td>
                                    <td className="px-4 py-2">
                                      <span className={`text-[13px] font-bold whitespace-nowrap ${
                                        aircraft.status === '已完成' ? 'text-success' : 
                                        aircraft.status === '执行中' ? 'text-primary-container' :
                                        'text-warning'
                                      }`}>
                                        {aircraft.status}
                                      </span>
                                    </td>
                                    <td className="px-4 py-2 text-right">
                                      {aircraft.status === '待起飞' && (
                                        <button className="px-3 py-0.5 bg-primary-container hover:bg-primary-container/90 text-white rounded-lg text-[11px] font-bold transition-all shadow-lg shadow-primary-container/20 whitespace-nowrap">
                                          确认起飞
                                        </button>
                                      )}
                                    </td>
                                  </tr>
                                ))}
                              </tbody>
                            </table>
                          </div>
                        </motion.div>
                      </td>
                    </tr>
                  )}
                </AnimatePresence>
              </React.Fragment>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
