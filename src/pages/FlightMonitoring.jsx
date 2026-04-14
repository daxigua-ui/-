import { useState, useEffect } from 'react';
import { 
  Activity, 
  Pause, 
  Square, 
  AlertTriangle, 
  Info, 
  Navigation,
  Maximize2,
  Compass,
  Layers,
  MousePointer2,
  Box,
  BatteryMedium,
  Zap,
  ChevronLeft,
  Home,
  Play,
  PlaneLanding,
  AlertCircle
} from 'lucide-react';
import { motion } from 'motion/react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';

// Fix Leaflet icon issue
const droneIcon = L.divIcon({
  className: 'custom-div-icon',
  html: `<div class="w-6 h-6 bg-primary-container rounded-full border-2 border-on-surface shadow-lg flex items-center justify-center animate-pulse"><div class="w-2 h-2 bg-white rounded-full"></div></div>`,
  iconSize: [24, 24],
  iconAnchor: [12, 12],
});

const DetailRow = ({ label, value, valueClass = "text-on-surface" }) => (
  <div className="flex justify-between items-center py-1.5 border-b border-outline-variant/10 last:border-0">
    <span className="text-[11px] text-outline/80">{label}</span>
    <span className={`text-[11px] font-semibold text-right ${valueClass}`}>{value}</span>
  </div>
);

const droneData = [
  {
    id: 'UAV007989977',
    name: '丰舟 90',
    sn: 'UAV007989977',
    status: '待起飞',
    battery: '100.0%',
    agl: '0m',
    speed: '30m/s',
    sortie: '0/20',
    position: [39.9042, 116.4074]
  },
  {
    id: 'UAV007989975',
    name: '丰舟 90',
    sn: 'UAV007989975',
    status: '待起飞',
    battery: '100.0%',
    agl: '0m',
    speed: '30m/s',
    sortie: '0/25',
    position: [39.9142, 116.4174]
  }
];

const logs = [
  { id: 1, type: 'warning', text: '安全间隔不足: UAV007989971 与 UAV007989974', time: '0m' },
  { id: 2, type: 'warning', text: '安全间隔不足: UAV007989971 与 UAV007989975', time: '0m' },
  { id: 3, type: 'warning', text: '安全间隔不足: UAV007989974 与 UAV007989975', time: '0m' },
  { id: 4, type: 'info', text: 'UAV007989974: 第13架次起飞', time: '' },
  { id: 5, type: 'info', text: 'UAV007989974: 开始返航', time: '' },
];

function MapViewHandler({ center }) {
  const map = useMap();
  useEffect(() => {
    map.setView(center, map.getZoom());
  }, [center, map]);
  return null;
}

export default function FlightMonitoring() {
  const [activeTab, setActiveTab] = useState('待起飞');
  const [mapCenter] = useState([39.9088, 116.3975]); // Beijing center
  const [isSimulating, setIsSimulating] = useState(true);
  const [selectedDroneId, setSelectedDroneId] = useState(null);
  const [viewMode, setViewMode] = useState('list'); // 'list' or 'details'
  const simTime = '106:42:33';

  const tabs = [
    { label: '待起飞', count: 2 },
    { label: '飞行中', count: 0 },
    { label: '异常/预警', count: 0 },
    { label: '未就绪', count: 0 },
    { label: '已完成', count: 4 },
  ];

  const selectedDrone = droneData.find(d => d.id === selectedDroneId) || droneData[0];

  return (
    <div className="h-[calc(100vh-100px)] flex gap-4 animate-in fade-in duration-500 overflow-hidden text-left">
      {/* Left Sidebar - Flight Status */}
      <div className="w-[280px] shrink-0 bg-surface-container backdrop-blur-xl border border-outline-variant/20 rounded-2xl flex flex-col overflow-hidden shadow-2xl relative">
        {viewMode === 'list' ? (
          <>
            <div className="p-4 border-b border-outline-variant/10 flex items-center justify-between">
              <h3 className="text-[15px] font-bold text-on-surface tracking-tight">飞行状态</h3>
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse shadow-[0_0_8px_rgba(34,197,94,0.5)]" />
            </div>

          {/* Tabs */}
          <div className="px-3 py-2.5 flex flex-wrap gap-1.5 border-b border-outline-variant/10">
            {tabs.map((tab) => (
              <button
                key={tab.label}
                onClick={() => setActiveTab(tab.label)}
                className={`flex-1 min-w-[30%] justify-center px-2 py-1.5 rounded-lg text-[10px] font-bold transition-all flex items-center gap-1.5 ${
                  activeTab === tab.label
                    ? 'bg-primary-container text-white shadow-md shadow-primary-container/20'
                    : 'bg-surface-container-low text-outline hover:text-on-surface border border-outline-variant/10 hover:border-outline-variant/30'
                }`}
              >
                <span className="whitespace-nowrap">{tab.label}</span>
                <span className={`px-1 rounded-md text-[9px] font-mono ${
                  activeTab === tab.label ? 'bg-white/20' : 'bg-surface-container-high'
                }`}>
                  {tab.count}
                </span>
              </button>
            ))}
          </div>

          {/* Drone List */}
          <div className="flex-1 overflow-y-auto p-3 space-y-2.5 custom-scrollbar">
            {droneData.map((drone, index) => (
              <motion.div 
                key={drone.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ scale: 1.02, y: -2 }}
                onClick={() => setSelectedDroneId(drone.id)}
                className={`border rounded-xl p-3 space-y-3 transition-all group cursor-pointer relative overflow-hidden shadow-sm ${
                  selectedDroneId === drone.id
                    ? 'bg-primary-container/10 border-primary-container shadow-[inset_0_0_0_1px_var(--primary-container)]'
                    : 'bg-surface-container-low border-outline-variant/30 hover:bg-primary-container/10 hover:border-primary-container hover:shadow-[inset_0_0_0_1px_var(--primary-container)]'
                }`}
              >
                {/* Top Row: Status Tag & Details Button */}
                <div className="flex justify-between items-center relative z-10">
                  <span className={`px-1.5 py-0.5 rounded text-[10px] font-medium border ${
                    drone.status === '待起飞' 
                      ? 'bg-green-500/10 text-green-500 border-green-500/20' 
                      : 'bg-primary-container/10 text-primary-container border-primary-container/20'
                  }`}>
                    {drone.status}
                  </span>
                  <button 
                    onClick={(e) => {
                      e.stopPropagation();
                      setSelectedDroneId(drone.id);
                      setViewMode('details');
                    }}
                    className="bg-surface-container-high hover:bg-primary-container hover:text-white text-on-surface border border-outline-variant/20 hover:border-primary-container px-2.5 py-0.5 rounded-md text-[10px] font-medium transition-all shadow-sm flex items-center gap-1"
                  >
                    详情
                  </button>
                </div>

                {/* Content */}
                <div className="relative z-10 space-y-1.5">
                  <h4 className="text-[14px] font-black text-on-surface group-hover:text-primary transition-colors leading-tight truncate">
                    {drone.name}
                  </h4>
                  <div className="flex items-center justify-between">
                    <p className="text-[10px] text-outline/80 font-mono">SN: {drone.sn}</p>
                    <div className="flex items-center gap-1 text-[10px] text-green-500 font-bold bg-green-500/10 px-1.5 py-0.5 rounded border border-green-500/20">
                      <BatteryMedium size={10} />
                      {drone.battery}
                    </div>
                  </div>
                </div>

                {/* Stats Grid */}
                <div className="grid grid-cols-3 gap-1 pt-2.5 border-t border-outline-variant/10 relative z-10">
                  <div className="flex flex-col items-center">
                    <span className="text-[8px] text-outline/60 uppercase font-black tracking-wider">AGL</span>
                    <span className="text-[11px] font-black text-on-surface">{drone.agl}</span>
                  </div>
                  <div className="flex flex-col items-center border-x border-outline-variant/10">
                    <span className="text-[8px] text-outline/60 uppercase font-black tracking-wider">Speed</span>
                    <span className="text-[11px] font-black text-on-surface">{drone.speed}</span>
                  </div>
                  <div className="flex flex-col items-center">
                    <span className="text-[8px] text-outline/60 uppercase font-black tracking-wider">Sortie</span>
                    <span className="text-[11px] font-black text-on-surface">{drone.sortie}</span>
                  </div>
                </div>

                {/* Bottom Shine Effect */}
                <div className="absolute bottom-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-primary/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
              </motion.div>
            ))}
          </div>
          </>
        ) : (
          <>
            <div className="p-4 border-b border-outline-variant/10 flex items-center justify-between">
              <h3 className="text-[15px] font-bold text-on-surface tracking-tight">飞行状态</h3>
              <button 
                onClick={() => setViewMode('list')}
                className="text-[11px] text-outline hover:text-on-surface bg-surface-container-high hover:bg-surface-container-highest border border-outline-variant/20 px-2.5 py-1 rounded-md flex items-center gap-1 transition-all shadow-sm"
              >
                <ChevronLeft size={12} />
                返回列表
              </button>
            </div>
            
            <div className="flex-1 overflow-y-auto custom-scrollbar">
              {/* Drone Header */}
              <div className="p-4 space-y-3">
                <div className="flex items-start justify-between">
                  <div>
                    <h4 className="text-[16px] font-black text-on-surface leading-none">{selectedDrone.name}</h4>
                    <p className="text-[10px] text-outline/60 mt-1 font-mono">SN: {selectedDrone.sn}</p>
                  </div>
                  <div className="flex flex-col items-end gap-1.5">
                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold border ${
                      selectedDrone.status === '待起飞' 
                        ? 'bg-green-500/10 text-green-500 border-green-500/20' 
                        : 'bg-primary-container/10 text-primary-container border-primary-container/20'
                    }`}>
                      {selectedDrone.status}
                    </span>
                    <div className="flex items-center gap-1 text-[11px] text-green-500 font-bold">
                      <BatteryMedium size={12} />
                      {selectedDrone.battery}
                    </div>
                  </div>
                </div>
                <div className="flex items-center justify-between text-[11px] text-outline pt-2 border-t border-outline-variant/10">
                  <div className="flex flex-col"><span className="text-[9px] opacity-60">AGL</span><span className="font-bold text-on-surface">{selectedDrone.agl}</span></div>
                  <div className="flex flex-col items-center"><span className="text-[9px] opacity-60">速度</span><span className="font-bold text-on-surface">{selectedDrone.speed}</span></div>
                  <div className="flex flex-col items-end"><span className="text-[9px] opacity-60">架次</span><span className="font-bold text-on-surface">{selectedDrone.sortie}</span></div>
                </div>
              </div>

              <div className="px-4 pb-4 space-y-5">
                {/* Task Info */}
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <div className="w-1 h-3 bg-primary rounded-full" />
                    <h5 className="text-[12px] font-bold text-on-surface">任务信息</h5>
                  </div>
                  <div className="bg-surface-container-low rounded-xl p-3 border border-outline-variant/10 space-y-0">
                    <DetailRow label="编号" value="TASK-20260323-2350" />
                    <DetailRow label="类型" value="订单配送" />
                    <DetailRow label="名称" value="深圳龙华-东莞沙田 小件转运" />
                    <DetailRow label="开始时间" value="-" />
                    <DetailRow label="已飞行" value="00:00:00" />
                    <DetailRow label="剩余" value="00:29:27" />
                    <DetailRow label="航程" value="0.0 m / 53.03 km" />
                    <DetailRow label="当前架次" value="1 / 20" />
                  </div>
                </div>

                {/* Aircraft Info */}
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <div className="w-1 h-3 bg-primary rounded-full" />
                    <h5 className="text-[12px] font-bold text-on-surface">飞机信息</h5>
                  </div>
                  <div className="bg-surface-container-low rounded-xl p-3 border border-outline-variant/10 space-y-0">
                    <DetailRow label="飞机" value={selectedDrone.name} />
                    <DetailRow label="SN码" value={selectedDrone.sn} />
                    <DetailRow label="航线" value="深圳龙华-东莞沙田跨城航线" />
                    <DetailRow label="订单" value="ORDER-20260323-9422" />
                    <DetailRow label="货物" value="MAT-001" />
                    <DetailRow label="重量" value="400kg" />
                    <DetailRow label="装载箱" value="BOX-008" />
                    <DetailRow label="装载量" value="100" />
                    <DetailRow label="剩余电量" value={selectedDrone.battery} valueClass="text-green-500" />
                    <DetailRow label="状态" value={selectedDrone.status} valueClass="text-green-500" />
                  </div>
                </div>

                {/* Flight Params */}
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <div className="w-1 h-3 bg-primary rounded-full" />
                    <h5 className="text-[12px] font-bold text-on-surface">飞行参数</h5>
                  </div>
                  <div className="bg-surface-container-low rounded-xl p-3 border border-outline-variant/10 space-y-0">
                    <DetailRow label="模式" value="航线飞行" />
                    <DetailRow label="AGL" value={selectedDrone.agl} valueClass="text-error" />
                    <DetailRow label="海拔高" value="50.0m" />
                    <DetailRow label="安全间隔" value="0m" valueClass="text-error" />
                    <DetailRow label="已飞距离" value="0.0 m" />
                    <DetailRow label="剩余距离" value="53.03 km" />
                    <DetailRow label="速度" value={selectedDrone.speed} />
                    <DetailRow label="航向" value="0°" />
                    <DetailRow label="经度" value="114.093465" />
                  </div>
                </div>
              </div>
            </div>
          </>
        )}
        </div>

        {/* Right Column: Map + Bottom Panel */}
        <div className="flex-1 flex flex-col gap-4 min-w-0">
          {/* Center - Map */}
          <div className="flex-1 relative bg-surface-container-low border border-outline-variant/20 rounded-2xl overflow-hidden shadow-2xl group/map">
          <MapContainer 
            center={mapCenter} 
            zoom={12} 
            zoomControl={false}
            style={{ height: '100%', width: '100%', background: 'var(--surface-container-low)' }}
          >
            <TileLayer
              url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png"
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'
            />
            <MapViewHandler center={mapCenter} />
            
            {droneData.map(drone => (
              <Marker key={drone.id} position={drone.position} icon={droneIcon}>
                <Popup>
                  <div className="p-1">
                    <p className="font-bold">{drone.name}</p>
                    <p className="text-xs text-outline">{drone.id}</p>
                  </div>
                </Popup>
              </Marker>
            ))}
          </MapContainer>

          {/* Map Controls - Top Left */}
          <div className="absolute left-4 top-4 flex gap-2 z-[1000]">
            <div className="flex bg-surface-container/80 backdrop-blur-md border border-outline-variant/20 rounded-lg overflow-hidden shadow-xl">
              <button className="px-3 py-1.5 text-[11px] font-black bg-primary-container text-white">2D</button>
              <button className="px-3 py-1.5 text-[11px] font-black text-outline hover:text-on-surface hover:bg-surface-container-highest transition-all">3D</button>
            </div>
          </div>

          {/* Map Controls - Right Side */}
          <div className="absolute right-4 top-1/2 -translate-y-1/2 flex flex-col gap-2 z-[1000]">
            <div className="flex flex-col bg-surface-container/80 backdrop-blur-md border border-outline-variant/20 rounded-xl overflow-hidden shadow-xl">
              <button className="p-2 text-outline hover:text-on-surface hover:bg-surface-container-highest transition-all border-b border-outline-variant/10"><Maximize2 size={18} /></button>
            </div>
            <div className="flex flex-col bg-surface-container/80 backdrop-blur-md border border-outline-variant/20 rounded-xl overflow-hidden shadow-xl">
              <button className="p-2 text-outline hover:text-on-surface hover:bg-surface-container-highest transition-all border-b border-outline-variant/10"><Navigation size={18} /></button>
              <button className="p-2 text-outline hover:text-on-surface hover:bg-surface-container-highest transition-all border-b border-outline-variant/10"><Compass size={18} /></button>
              <button className="p-2 text-outline hover:text-on-surface hover:bg-surface-container-highest transition-all border-b border-outline-variant/10"><Layers size={18} /></button>
              <button className="p-2 text-outline hover:text-on-surface hover:bg-surface-container-highest transition-all border-b border-outline-variant/10"><MousePointer2 size={18} /></button>
              <button className="p-2 text-outline hover:text-on-surface hover:bg-surface-container-highest transition-all"><Box size={18} /></button>
            </div>
          </div>

          {/* Map Legend - Bottom Left */}
          <div className="absolute bottom-4 left-4 bg-surface-container/80 backdrop-blur-md border border-outline-variant/20 rounded-xl p-2.5 shadow-xl z-[1000] space-y-1.5">
            <div className="flex items-center gap-2">
              <div className="w-2.5 h-2.5 bg-primary-container rounded-sm" />
              <span className="text-[10px] text-on-surface font-bold">无人机</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2.5 h-0.5 bg-primary-container" />
              <span className="text-[10px] text-on-surface font-bold">航线</span>
            </div>
            <div className="pt-1 border-t border-outline-variant/10">
              <span className="text-[9px] text-outline font-mono">5 km | 1:100,000</span>
            </div>
          </div>
        </div>

        {/* Bottom Panel: Simulation Status & Logs */}
        <div className="h-[140px] shrink-0 bg-surface-container/80 backdrop-blur-xl border border-outline-variant/20 rounded-2xl flex flex-col overflow-hidden shadow-2xl relative">
        {/* Panel Header */}
        <div className="px-5 py-2.5 border-b border-outline-variant/10 flex items-center justify-between relative z-10">
          <div className="flex items-center gap-8">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-primary-container/10 flex items-center justify-center">
                <Zap size={16} className="text-primary-container animate-pulse" />
              </div>
              <span className="text-[14px] font-black text-on-surface tracking-tight">仿真进行中...</span>
            </div>
            <div className="flex items-center gap-2.5 bg-surface-container-high px-3 py-1 rounded-lg border border-outline-variant/10">
              <span className="text-[11px] text-outline font-bold uppercase tracking-wider">仿真时长</span>
              <span className="text-[14px] font-mono font-black text-primary-container">{simTime}</span>
            </div>
          </div>
          <div className="flex items-center gap-2.5">
            <button 
              onClick={() => setIsSimulating(!isSimulating)}
              className="px-4 py-1.5 bg-surface-container-high hover:bg-surface-container-highest text-on-surface rounded-lg border border-outline-variant/10 text-[12px] font-bold transition-all flex items-center gap-2 active:scale-95"
            >
              {isSimulating ? <Pause size={14} /> : <Activity size={14} />}
              {isSimulating ? '暂停' : '继续'}
            </button>
            <button className="px-4 py-1.5 bg-error/10 hover:bg-error text-error hover:text-white rounded-lg border border-error/20 text-[12px] font-bold transition-all flex items-center gap-2 active:scale-95">
              <Square size={12} fill="currentColor" />
              结束仿真
            </button>
          </div>
        </div>

        {/* Logs Content */}
        <div className="flex-1 overflow-y-auto p-3 space-y-1.5 custom-scrollbar relative z-10">
          {logs.map((log) => (
            <motion.div 
              key={log.id} 
              initial={{ opacity: 0, x: 10 }}
              animate={{ opacity: 1, x: 0 }}
              className={`flex items-center justify-between px-4 py-1.5 rounded-lg border transition-all ${
                log.type === 'warning' 
                  ? 'bg-orange-500/5 border-orange-500/20 text-orange-600' 
                  : 'bg-primary-container/5 border-primary-container/10 text-primary-container'
              }`}
            >
              <div className="flex items-center gap-3">
                {log.type === 'warning' ? <AlertTriangle size={14} /> : <Info size={14} />}
                <span className="text-[12px] font-bold">{log.text}</span>
              </div>
              {log.time && <span className="text-[11px] font-mono font-black opacity-60">{log.time}</span>}
            </motion.div>
          ))}
        </div>
      </div>
    </div>

    {/* Right Sidebar - Flight Control (Only in details view) */}
    {viewMode === 'details' && (
      <div className="w-[280px] shrink-0 bg-surface-container backdrop-blur-xl border border-outline-variant/20 rounded-2xl flex flex-col overflow-hidden shadow-2xl relative animate-in slide-in-from-right-4 duration-300">
        <div className="p-4 border-b border-outline-variant/10">
          <h3 className="text-[15px] font-bold text-on-surface tracking-tight">飞行控制</h3>
        </div>
        
        <div className="flex-1 overflow-y-auto p-4 space-y-5 custom-scrollbar">
          {/* Control Buttons */}
          <div className="space-y-2.5">
            <button className="w-full bg-surface-container-low text-on-surface border border-outline-variant/20 py-2.5 rounded-xl text-[13px] font-bold transition-all flex items-center justify-center gap-2 shadow-sm hover:bg-error hover:text-white hover:border-error active:scale-[0.98] group">
              <Home size={16} className="text-outline group-hover:text-white transition-colors" />
              紧急返航
            </button>
            <div className="grid grid-cols-2 gap-2.5">
              <button className="bg-surface-container-low text-on-surface border border-outline-variant/20 py-2.5 rounded-xl text-[12px] font-bold transition-all flex items-center justify-center gap-1.5 shadow-sm hover:bg-primary hover:text-white hover:border-primary active:scale-[0.98] group">
                <Pause size={14} className="text-outline group-hover:text-white transition-colors" />
                悬停
              </button>
              <button className="bg-surface-container-low text-on-surface border border-outline-variant/20 py-2.5 rounded-xl text-[12px] font-bold transition-all flex items-center justify-center gap-1.5 shadow-sm hover:bg-primary hover:text-white hover:border-primary active:scale-[0.98] group">
                <Play size={14} className="text-outline group-hover:text-white transition-colors" />
                继续执行
              </button>
            </div>
            <button className="w-full bg-surface-container-low text-on-surface border border-outline-variant/20 py-2.5 rounded-xl text-[13px] font-bold transition-all flex items-center justify-center gap-2 shadow-sm hover:bg-primary hover:text-white hover:border-primary active:scale-[0.98] group">
              <PlaneLanding size={16} className="text-outline group-hover:text-white transition-colors" />
              自动备降
            </button>
          </div>

          {/* Flight Mode */}
          <div>
            <div className="flex items-center gap-2 mb-2">
              <div className="w-1 h-3 bg-primary-container rounded-full" />
              <h5 className="text-[12px] font-bold text-on-surface">飞行模式</h5>
            </div>
            <div className="bg-surface-container-low rounded-xl p-3 border border-outline-variant/10 space-y-0">
              <DetailRow label="当前模式" value="航线飞行" />
              <DetailRow label="定位模式" value="GPS + RTK" valueClass="text-green-500" />
              <DetailRow label="返航模式" value="智能返航" />
            </div>
          </div>

          {/* Alerts */}
          <div>
            <div className="flex items-center gap-2 mb-2">
              <div className="w-1 h-3 bg-error rounded-full" />
              <h5 className="text-[12px] font-bold text-on-surface">告警信息</h5>
            </div>
            <div className="space-y-2">
              <div className="flex items-start gap-2 text-[12px] text-orange-600 bg-orange-500/10 p-2.5 rounded-lg border border-orange-500/20 font-medium">
                <AlertTriangle size={14} className="shrink-0 mt-0.5" />
                <span>GPS信号弱 (9颗)</span>
              </div>
              <div className="flex items-start gap-2 text-[12px] text-error bg-error/10 p-2.5 rounded-lg border border-error/20 font-medium">
                <AlertCircle size={14} className="shrink-0 mt-0.5" />
                <span>UAV007989977: 高度过低 (0m)</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    )}
    </div>
  );
}
