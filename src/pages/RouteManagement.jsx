import { useState, useEffect } from 'react';
import { 
  Search, 
  Plus, 
  Navigation, 
  Layers, 
  Maximize2, 
  Compass, 
  MousePointer2,
  Edit3,
  Trash2,
  Box,
  ChevronLeft
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { MapContainer, TileLayer, Marker, Popup, Polyline, useMap } from 'react-leaflet';
import L from 'leaflet';
import RouteEditor from '../components/RouteEditor';

// Fix Leaflet icon issue
const originIcon = L.divIcon({
  className: 'custom-div-icon',
  html: `<div class="w-4 h-4 bg-error rounded-full border-2 border-on-surface shadow-lg animate-bounce"></div>`,
  iconSize: [16, 16],
  iconAnchor: [8, 8],
});

const destinationIcon = L.divIcon({
  className: 'custom-div-icon',
  html: `<div class="w-4 h-4 bg-primary-container rounded-full border-2 border-on-surface shadow-lg animate-bounce"></div>`,
  iconSize: [16, 16],
  iconAnchor: [8, 8],
});

const stationIcon = L.divIcon({
  className: 'custom-div-icon',
  html: `<div class="w-5 h-5 bg-primary-container rounded-full border-2 border-on-surface shadow-lg flex items-center justify-center"><div class="w-2 h-2 bg-on-surface rounded-full"></div></div>`,
  iconSize: [20, 20],
  iconAnchor: [10, 10],
});

const INITIAL_STATIONS = [
  {
    id: 'S1',
    name: '东莞沙田站',
    type: '标准综合站',
    airspace: '东莞沙田空域',
    status: '启用中',
    landingPads: '4',
    energyConfig: '充电 + 换电',
    chargingSlots: '6',
    batterySlots: '4',
    coords: '113.61963, 22.86968',
    position: [22.86968, 113.61963]
  },
  {
    id: 'S2',
    name: '顺丰龙华枢纽站',
    type: '综合站',
    airspace: '深圳龙华空域',
    status: '启用中',
    landingPads: '5',
    energyConfig: '充电 + 换电',
    chargingSlots: '10',
    batterySlots: '8',
    coords: '113.85, 22.75',
    position: [22.75, 113.85]
  }
];

const INITIAL_ROUTES = [
  { 
    id: '1', 
    name: '深圳龙华 - 东莞沙田跨城航线', 
    origin: '深圳龙华站',
    destination: '东莞沙田站',
    status: '启用中', 
    altitude: '120m',
    speed: '30m/s',
    distance: '53.03 km',
    exceptionStrategy: '失联 继续执行',
    completionAction: '降落 & 返航',
    coordsCount: 6, 
    position: [22.75, 113.85],
    coords: [
      { id: '1', value: '113.85, 22.75' },
      { id: '2', value: '113.80, 22.78' },
      { id: '3', value: '113.75, 22.82' },
      { id: '4', value: '113.70, 22.85' },
      { id: '5', value: '113.65, 22.86' },
      { id: '6', value: '113.61963, 22.86968' },
    ]
  },
];

const polylineCoords = [
  [22.854448, 113.602621],
  [22.900208, 113.602621],
  [22.914732, 113.696437],
  [22.859533, 113.680669],
  [22.757792, 113.994439],
];

// Component to handle map view updates
function MapViewHandler({ center }) {
  const map = useMap();
  useEffect(() => {
    map.setView(center, map.getZoom());
  }, [center, map]);
  return null;
}

const mainTabs = [
  { id: 'station', label: '站点规划' },
  { id: 'route', label: '航线管理' },
];

export default function RouteManagement() {
  const [activeMainTab, setActiveMainTab] = useState('station');
  const [searchQuery, setSearchQuery] = useState('');
  const [mapCenter, setMapCenter] = useState([22.86968, 113.61963]);
  const [selectedId, setSelectedId] = useState(null);
  
  // Modals state
  const [isRouteEditorOpen, setIsRouteEditorOpen] = useState(false);
  const [isStationEditing, setIsStationEditing] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  
  // Station Form states
  const [stationName, setStationName] = useState('');
  const [stationType, setStationType] = useState('标准综合站');
  const [stationAirspace, setStationAirspace] = useState('深圳龙华空域');
  const [stationStatus, setStationStatus] = useState('启用中');
  const [stationLandingPads, setStationLandingPads] = useState('4');
  const [stationEnergyConfig, setStationEnergyConfig] = useState('充电 + 换电');
  const [stationChargingSlots, setStationChargingSlots] = useState('6');
  const [stationBatterySlots, setStationBatterySlots] = useState('4');
  const [stationCoords, setStationCoords] = useState('113.61963, 22.86968');
  const [stationErrors, setStationErrors] = useState({});

  // Data state
  const [stationList, setStationList] = useState(INITIAL_STATIONS);
  const [routeList, setRouteList] = useState(INITIAL_ROUTES);

  const filteredStations = stationList.filter(s => s.name.toLowerCase().includes(searchQuery.toLowerCase()));
  const filteredRoutes = routeList.filter(r => r.name.toLowerCase().includes(searchQuery.toLowerCase()));

  const handleEdit = (e, item) => {
    e.stopPropagation();
    setEditingItem(item);
    if (activeMainTab === 'station') {
      setStationName(item.name);
      setStationType(item.type);
      setStationAirspace(item.airspace);
      setStationStatus(item.status);
      setStationLandingPads(item.landingPads);
      setStationEnergyConfig(item.energyConfig);
      setStationChargingSlots(item.chargingSlots);
      setStationBatterySlots(item.batterySlots);
      setStationCoords(item.coords);
      setStationErrors({});
      setIsStationEditing(true);
    } else {
      setIsRouteEditorOpen(true);
    }
  };

  const handleAdd = () => {
    setEditingItem(null);
    if (activeMainTab === 'station') {
      setStationName('');
      setStationType('标准综合站');
      setStationAirspace('深圳龙华空域');
      setStationStatus('启用中');
      setStationLandingPads('4');
      setStationEnergyConfig('充电 + 换电');
      setStationChargingSlots('6');
      setStationBatterySlots('4');
      setStationCoords('113.61963, 22.86968');
      setStationErrors({});
      setIsStationEditing(true);
    } else {
      setIsRouteEditorOpen(true);
    }
  };

  const handleSaveStation = () => {
    if (!stationName.trim()) {
      setStationErrors({ name: '站点名称不能为空' });
      return;
    }

    const data = {
      name: stationName,
      type: stationType,
      airspace: stationAirspace,
      status: stationStatus,
      landingPads: stationLandingPads,
      energyConfig: stationEnergyConfig,
      chargingSlots: stationChargingSlots,
      batterySlots: stationBatterySlots,
      coords: stationCoords,
    };

    if (editingItem) {
      setStationList(stationList.map(s => s.id === editingItem.id ? { ...s, ...data } : s));
    } else {
      const newStation = {
        ...data,
        id: 'S' + Date.now(),
        position: [22.86968, 113.61963] // Default for demo
      };
      setStationList([newStation, ...stationList]);
    }
    setIsStationEditing(false);
  };

  const handleSaveRoute = (data) => {
    const coordsCount = data.waypoints?.length || data.coords?.length || 0;
    if (editingItem) {
      setRouteList(routeList.map(r => r.id === editingItem.id ? { ...r, ...data, coordsCount } : r));
    } else {
      const newRoute = {
        ...data,
        id: 'R' + Date.now(),
        coordsCount,
        position: data.position || [22.75, 113.85]
      };
      setRouteList([newRoute, ...routeList]);
    }
    setIsRouteEditorOpen(false);
  };

  const handleDelete = (e, id) => {
    e.stopPropagation();
    if (activeMainTab === 'station') {
      setStationList(stationList.filter(s => s.id !== id));
    } else {
      setRouteList(routeList.filter(r => r.id !== id));
    }
    if (selectedId === id) setSelectedId(null);
  };

  return (
    <div className="h-[calc(100vh-100px)] flex flex-col gap-4 animate-in fade-in duration-500 relative overflow-hidden">
      <AnimatePresence mode="wait">
        {isRouteEditorOpen ? (
          <motion.div
            key="route-editor"
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.98 }}
            className="absolute inset-0 z-[100]"
          >
            <RouteEditor 
              onBack={() => setIsRouteEditorOpen(false)}
              onSave={handleSaveRoute}
              initialData={editingItem}
            />
          </motion.div>
        ) : (
          <motion.div 
            key="list-view"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
            className="flex flex-col gap-4 h-full"
          >
            {/* Top Navigation Tabs */}
            <div className="flex items-center gap-8 border-b border-outline-variant/10 mb-2">
              {mainTabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => {
                    setActiveMainTab(tab.id);
                    setSelectedId(null);
                    setSearchQuery('');
                  }}
                  className={`pb-4 text-[18px] font-semibold transition-all relative ${
                    activeMainTab === tab.id 
                      ? 'text-primary-container' 
                      : 'text-outline hover:text-on-surface'
                  }`}
                >
                  {tab.label}
                  {activeMainTab === tab.id && (
                    <motion.div 
                      layoutId="activeMainTab"
                      className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary-container shadow-[0_0_8px_rgba(22,93,255,0.6)]"
                    />
                  )}
                </button>
              ))}
            </div>

            <div className="flex-1 flex gap-4 overflow-hidden">
              {/* Left Sidebar */}
              <div className="w-[280px] bg-surface-container backdrop-blur-xl border border-outline-variant/20 rounded-2xl flex flex-col overflow-hidden shadow-2xl">
                <AnimatePresence mode="wait">
                  {!isStationEditing ? (
                    <motion.div
                      key="list"
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -20 }}
                      className="flex flex-col h-full"
                    >
                      <div className="p-4 border-b border-outline-variant/10 flex items-center justify-between">
                        <h3 className="text-[16px] font-semibold text-on-surface">
                          {activeMainTab === 'station' ? '站点规划' : '航线管理'}
                        </h3>
                        <button 
                          onClick={handleAdd}
                          className="flex items-center gap-1.5 px-3 py-1.5 bg-primary-container hover:bg-primary-container/90 text-white rounded-lg transition-all shadow-lg shadow-primary-container/20 text-[13px] font-medium"
                        >
                          <Plus size={16} />
                          {activeMainTab === 'station' ? '新建站点规划' : '新建航线'}
                        </button>
                      </div>

                      <div className="p-4 border-b border-outline-variant/10">
                        <div className="relative">
                          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-outline/40" size={18} />
                          <input 
                            type="text"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            placeholder={activeMainTab === 'station' ? "按站点名称搜索" : "按航线名称搜索"}
                            className="w-full h-[40px] bg-surface-container-low border border-outline-variant/30 rounded-xl py-2 pl-10 pr-4 text-[14px] text-on-surface placeholder:text-outline/30 transition-all font-normal hover:border-primary-container/50 hover:shadow-[0_0_15px_rgba(22,93,255,0.15)] focus:outline-none focus:border-primary-container focus:shadow-[0_0_20px_rgba(22,93,255,0.3)]"
                          />
                        </div>
                      </div>

                      <div className="flex-1 overflow-y-auto p-4 space-y-3 custom-scrollbar">
                        {activeMainTab === 'station' ? (
                          filteredStations.map(station => (
                            <div 
                              key={station.id} 
                              onClick={() => {
                                setMapCenter(station.position);
                                setSelectedId(station.id);
                              }}
                              className={`transition-all group cursor-pointer relative border rounded-xl p-4 space-y-2.5 ${
                                selectedId === station.id 
                                  ? 'bg-primary-container/10 border-primary-container shadow-[inset_0_0_0_1px_var(--primary-container)]' 
                                  : 'bg-surface-container-low border-outline-variant/30 hover:bg-primary-container/10 hover:border-primary-container hover:shadow-[inset_0_0_0_1px_var(--primary-container)]'
                              }`}
                            >
                              <div className="flex items-center justify-between gap-2">
                                <span className="text-[14px] font-bold text-on-surface tracking-tight truncate">{station.name}</span>
                                <span className={`shrink-0 px-1.5 py-0.5 rounded text-[10px] font-medium border ${
                                  station.status === '启用中' 
                                    ? 'bg-green-500/10 text-green-500 border-green-500/20' 
                                    : 'bg-error/10 text-error border-error/20'
                                }`}>
                                  {station.status}
                                </span>
                              </div>
                              
                              <div className="space-y-1.5">
                                <div className="grid grid-cols-1 gap-1 text-[11px] text-outline/70 font-normal">
                                  <div className="flex items-center gap-2">
                                    <Compass size={11} className="opacity-50" />
                                    <span className="truncate">{station.airspace}</span>
                                  </div>
                                  <div className="flex items-center gap-2">
                                    <Layers size={11} className="opacity-50" />
                                    <span className="truncate">起降坪 {station.landingPads} | {station.type}</span>
                                  </div>
                                </div>
                              </div>

                              <div className="flex items-center gap-2 pt-1">
                                <button 
                                  onClick={(e) => handleEdit(e, station)}
                                  className="p-1.5 bg-surface-container-high hover:bg-surface-container-highest rounded-lg text-outline hover:text-on-surface transition-all border border-outline-variant/10"
                                >
                                  <Edit3 size={14} />
                                </button>
                                <button 
                                  onClick={(e) => handleDelete(e, station.id)}
                                  className="p-1.5 bg-error/10 hover:bg-error/20 rounded-lg text-error transition-all border border-error/20"
                                >
                                  <Trash2 size={14} />
                                </button>
                              </div>
                            </div>
                          ))
                        ) : (
                          filteredRoutes.map(item => (
                            <div 
                              key={item.id} 
                              onClick={() => {
                                setMapCenter(item.position);
                                setSelectedId(item.id);
                              }}
                              className={`transition-all group cursor-pointer relative border rounded-xl p-4 space-y-2.5 ${
                                selectedId === item.id 
                                  ? 'bg-primary-container/10 border-primary-container shadow-[inset_0_0_0_1px_var(--primary-container)]' 
                                  : 'bg-surface-container-low border-outline-variant/30 hover:bg-primary-container/10 hover:border-primary-container hover:shadow-[inset_0_0_0_1px_var(--primary-container)]'
                              }`}
                            >
                              <div className="flex items-center justify-between gap-2">
                                <span className="text-[14px] font-bold text-on-surface tracking-tight truncate">{item.name}</span>
                                <span className="shrink-0 px-1.5 py-0.5 rounded bg-green-500/10 text-green-500 border border-green-500/20 text-[10px] font-medium">
                                  {item.status}
                                </span>
                              </div>
                              
                              <div className="space-y-1.5">
                                <div className="grid grid-cols-1 gap-1 text-[11px] text-outline/70 font-normal">
                                  <div className="flex items-center gap-2">
                                    <Navigation size={11} className="opacity-50 text-primary-container" />
                                    <span className="truncate">{item.origin} → {item.destination}</span>
                                  </div>
                                  <div className="flex items-center gap-2">
                                    <Layers size={11} className="opacity-50" />
                                    <span>航点 {item.coordsCount} | {item.distance}</span>
                                  </div>
                                </div>
                              </div>

                              <div className="flex items-center gap-2 pt-1">
                                <button 
                                  onClick={(e) => handleEdit(e, item)}
                                  className="p-1.5 bg-surface-container-high hover:bg-surface-container-highest rounded-lg text-outline hover:text-on-surface transition-all border border-outline-variant/10"
                                >
                                  <Edit3 size={14} />
                                </button>
                                <button 
                                  onClick={(e) => handleDelete(e, item.id)}
                                  className="p-1.5 bg-error/10 hover:bg-error/20 rounded-lg text-error transition-all border border-error/20"
                                >
                                  <Trash2 size={14} />
                                </button>
                              </div>
                            </div>
                          ))
                        )}
                      </div>
                    </motion.div>
                  ) : (
                    <motion.div
                      key="form"
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: 20 }}
                      className="flex flex-col h-full overflow-hidden"
                    >
                      <div className="p-4 border-b border-outline-variant/10 flex items-center gap-3">
                        <button 
                          onClick={() => setIsStationEditing(false)}
                          className="p-1.5 hover:bg-surface-container-highest rounded-lg text-outline hover:text-on-surface transition-all"
                        >
                          <ChevronLeft size={20} />
                        </button>
                        <h3 className="text-[16px] font-semibold text-on-surface">
                          {editingItem ? '编辑站点' : '新建站点'}
                        </h3>
                      </div>

                      <div className="flex-1 overflow-y-auto p-4 space-y-5 custom-scrollbar">
                        {/* Name */}
                        <div className="space-y-1.5">
                          <label className="block text-[13px] font-medium text-outline ml-1">站点名称</label>
                          <input
                            type="text"
                            value={stationName}
                            onChange={(e) => {
                              setStationName(e.target.value);
                              if (stationErrors.name) setStationErrors({});
                            }}
                            placeholder="请输入站点名称"
                            className={`w-full h-[36px] px-3 rounded-lg border ${
                              stationErrors.name ? 'border-error/50' : 'border-outline-variant/30'
                            } bg-surface-container-low text-[13px] text-on-surface placeholder:text-outline/30 transition-all font-normal hover:border-primary-container/50 focus:outline-none focus:border-primary-container`}
                          />
                          {stationErrors.name && <p className="text-[11px] text-error mt-1 ml-1">{stationErrors.name}</p>}
                        </div>

                        {/* Type & Status */}
                        <div className="grid grid-cols-2 gap-3">
                          <div className="space-y-1.5">
                            <label className="block text-[13px] font-medium text-outline ml-1">站点类型</label>
                            <select
                              value={stationType}
                              onChange={(e) => setStationType(e.target.value)}
                              className="w-full h-[36px] px-3 rounded-lg border border-outline-variant/30 text-[13px] text-on-surface bg-surface-container-low transition-all appearance-none cursor-pointer font-normal hover:border-primary-container/50 focus:outline-none focus:border-primary-container"
                              style={{
                                backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke='%238d90a2' stroke-width='2'%3E%3Cpath stroke-linecap='round' stroke-linejoin='round' d='M19 9l-7 7-7-7'/%3E%3C/svg%3E")`,
                                backgroundRepeat: 'no-repeat',
                                backgroundPosition: 'right 10px center',
                                backgroundSize: '14px',
                              }}
                            >
                              {['标准综合站', '综合站', '配送站', '起降点'].map(t => (
                                <option key={t} value={t}>{t}</option>
                              ))}
                            </select>
                          </div>
                          <div className="space-y-1.5">
                            <label className="block text-[13px] font-medium text-outline ml-1">状态</label>
                            <select
                              value={stationStatus}
                              onChange={(e) => setStationStatus(e.target.value)}
                              className="w-full h-[36px] px-3 rounded-lg border border-outline-variant/30 text-[13px] text-on-surface bg-surface-container-low transition-all appearance-none cursor-pointer font-normal hover:border-primary-container/50 focus:outline-none focus:border-primary-container"
                              style={{
                                backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke='%238d90a2' stroke-width='2'%3E%3Cpath stroke-linecap='round' stroke-linejoin='round' d='M19 9l-7 7-7-7'/%3E%3C/svg%3E")`,
                                backgroundRepeat: 'no-repeat',
                                backgroundPosition: 'right 10px center',
                                backgroundSize: '14px',
                              }}
                            >
                              {['启用中', '禁用中', '维护中'].map(s => (
                                <option key={s} value={s}>{s}</option>
                              ))}
                            </select>
                          </div>
                        </div>

                        {/* Airspace */}
                        <div className="space-y-1.5">
                          <label className="block text-[13px] font-medium text-outline ml-1">所属空域</label>
                          <select
                            value={stationAirspace}
                            onChange={(e) => setStationAirspace(e.target.value)}
                            className="w-full h-[36px] px-3 rounded-lg border border-outline-variant/30 text-[13px] text-on-surface bg-surface-container-low transition-all appearance-none cursor-pointer font-normal hover:border-primary-container/50 focus:outline-none focus:border-primary-container"
                            style={{
                              backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke='%238d90a2' stroke-width='2'%3E%3Cpath stroke-linecap='round' stroke-linejoin='round' d='M19 9l-7 7-7-7'/%3E%3C/svg%3E")`,
                              backgroundRepeat: 'no-repeat',
                              backgroundPosition: 'right 10px center',
                              backgroundSize: '14px',
                            }}
                          >
                            {['深圳龙华空域', '东莞沙田空域', '南山低空航道', '福田管制区'].map(a => (
                              <option key={a} value={a}>{a}</option>
                            ))}
                          </select>
                        </div>

                        {/* Landing Pads & Energy */}
                        <div className="grid grid-cols-2 gap-3">
                          <div className="space-y-1.5">
                            <label className="block text-[13px] font-medium text-outline ml-1">起降坪数量</label>
                            <input
                              type="text"
                              value={stationLandingPads}
                              onChange={(e) => setStationLandingPads(e.target.value)}
                              className="w-full h-[36px] px-3 rounded-lg border border-outline-variant/30 bg-surface-container-low text-[13px] text-on-surface transition-all font-normal hover:border-primary-container/50 focus:outline-none focus:border-primary-container"
                            />
                          </div>
                          <div className="space-y-1.5">
                            <label className="block text-[13px] font-medium text-outline ml-1">补能配置</label>
                            <input
                              type="text"
                              value={stationEnergyConfig}
                              onChange={(e) => setStationEnergyConfig(e.target.value)}
                              className="w-full h-[36px] px-3 rounded-lg border border-outline-variant/30 bg-surface-container-low text-[13px] text-on-surface transition-all font-normal hover:border-primary-container/50 focus:outline-none focus:border-primary-container"
                            />
                          </div>
                        </div>

                        {/* Slots */}
                        <div className="grid grid-cols-2 gap-3">
                          <div className="space-y-1.5">
                            <label className="block text-[13px] font-medium text-outline ml-1">充电工位</label>
                            <input
                              type="text"
                              value={stationChargingSlots}
                              onChange={(e) => setStationChargingSlots(e.target.value)}
                              className="w-full h-[36px] px-3 rounded-lg border border-outline-variant/30 bg-surface-container-low text-[13px] text-on-surface transition-all font-normal hover:border-primary-container/50 focus:outline-none focus:border-primary-container"
                            />
                          </div>
                          <div className="space-y-1.5">
                            <label className="block text-[13px] font-medium text-outline ml-1">换电工位</label>
                            <input
                              type="text"
                              value={stationBatterySlots}
                              onChange={(e) => setStationBatterySlots(e.target.value)}
                              className="w-full h-[36px] px-3 rounded-lg border border-outline-variant/30 bg-surface-container-low text-[13px] text-on-surface transition-all font-normal hover:border-primary-container/50 focus:outline-none focus:border-primary-container"
                            />
                          </div>
                        </div>

                        {/* Coords */}
                        <div className="space-y-1.5">
                          <label className="block text-[13px] font-medium text-outline ml-1">中心点坐标</label>
                          <input
                            type="text"
                            value={stationCoords}
                            onChange={(e) => setStationCoords(e.target.value)}
                            className="w-full h-[36px] px-3 rounded-lg border border-outline-variant/30 bg-surface-container-low text-[13px] text-on-surface transition-all font-normal hover:border-primary-container/50 focus:outline-none focus:border-primary-container"
                          />
                        </div>
                      </div>

                      <div className="p-4 border-t border-outline-variant/10 flex gap-2 bg-surface-container-high">
                        <button
                          onClick={() => setIsStationEditing(false)}
                          className="flex-1 h-[36px] rounded-lg border border-outline-variant/30 text-outline text-[13px] font-medium hover:text-on-surface hover:bg-surface-container-highest transition-all"
                        >
                          取消
                        </button>
                        <button
                          onClick={handleSaveStation}
                          className="flex-1 h-[36px] rounded-lg bg-primary-container text-white text-[13px] font-medium hover:bg-primary-container/90 shadow-lg shadow-primary-container/20 transition-all"
                        >
                          保存
                        </button>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* Map Area */}
              <div className="flex-1 bg-surface-container-low border border-outline-variant/20 rounded-2xl relative overflow-hidden shadow-2xl group/map">
                <MapContainer 
                  center={mapCenter} 
                  zoom={11} 
                  zoomControl={false}
                  style={{ height: '100%', width: '100%', background: 'var(--surface-container-low)' }}
                >
                  <TileLayer
                    url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png"
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'
                  />
                  <MapViewHandler center={mapCenter} />
                  
                  {activeMainTab === 'station' ? (
                    stationList.map(station => (
                      <Marker key={station.id} position={station.position} icon={stationIcon}>
                        <Popup>{station.name}</Popup>
                      </Marker>
                    ))
                  ) : (
                    <>
                      <Polyline 
                        positions={polylineCoords} 
                        pathOptions={{ 
                          color: 'var(--primary-container)', 
                          weight: 4,
                          opacity: 0.8
                        }} 
                      />
                      <Marker position={polylineCoords[0]} icon={originIcon}>
                        <Popup>起点</Popup>
                      </Marker>
                      <Marker position={polylineCoords[polylineCoords.length - 1]} icon={destinationIcon}>
                        <Popup>终点</Popup>
                      </Marker>
                    </>
                  )}
                </MapContainer>

                {/* Map Controls - Right Side */}
                <div className="absolute right-4 top-1/2 -translate-y-1/2 flex flex-col gap-2 z-[1000]">
                  <div className="flex flex-col bg-surface-container/80 backdrop-blur-md border border-outline-variant/20 rounded-xl overflow-hidden shadow-xl">
                    <button className="p-2.5 text-outline hover:text-on-surface hover:bg-surface-container-highest transition-all border-b border-outline-variant/10"><Compass size={20} /></button>
                  </div>
                  <div className="flex flex-col bg-surface-container/80 backdrop-blur-md border border-outline-variant/20 rounded-xl overflow-hidden shadow-xl">
                    <button className="p-2.5 text-outline hover:text-on-surface hover:bg-surface-container-highest transition-all border-b border-outline-variant/10"><Maximize2 size={20} /></button>
                    <button className="p-2.5 text-outline hover:text-on-surface hover:bg-surface-container-highest transition-all"><Maximize2 size={20} className="rotate-45" /></button>
                  </div>
                  <div className="flex flex-col bg-surface-container/80 backdrop-blur-md border border-outline-variant/20 rounded-xl overflow-hidden shadow-xl">
                    <button className="p-2.5 text-outline hover:text-on-surface hover:bg-surface-container-highest transition-all border-b border-outline-variant/10"><MousePointer2 size={20} /></button>
                    <button className="p-2.5 text-outline hover:text-on-surface hover:bg-surface-container-highest transition-all border-b border-outline-variant/10"><Layers size={20} /></button>
                    <button className="p-2.5 text-outline hover:text-on-surface hover:bg-surface-container-highest transition-all border-b border-outline-variant/10"><Navigation size={20} /></button>
                    <button className="p-2.5 text-outline hover:text-on-surface hover:bg-surface-container-highest transition-all"><Box size={20} /></button>
                  </div>
                </div>

                {/* Map Info Overlay - Bottom Left */}
                <div className="absolute bottom-4 left-4 bg-surface-container/80 backdrop-blur-md border border-outline-variant/20 rounded-xl p-3 shadow-xl z-[1000] flex items-center gap-4">
                  <div className="flex items-center gap-2">
                    <div className={`w-3 h-3 rounded-full bg-primary-container`} />
                    <span className="text-[12px] text-on-surface font-medium">{activeMainTab === 'station' ? '站点分布' : '航线轨迹'}</span>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
