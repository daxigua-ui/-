import { useState, useEffect } from 'react';
import { ArrowLeft, Save, Info, Navigation, Plus, Minus, Check, AlertTriangle } from 'lucide-react';
import { MapContainer, TileLayer, Marker, Polyline, useMap } from 'react-leaflet';
import { motion, AnimatePresence } from 'motion/react';
import L from 'leaflet';

// Fix Leaflet icon issue
const originIcon = L.divIcon({
  className: 'custom-div-icon',
  html: `<div class="w-4 h-4 bg-error rounded-full border-2 border-white shadow-lg animate-bounce"></div>`,
  iconSize: [16, 16],
  iconAnchor: [8, 8],
});

const destinationIcon = L.divIcon({
  className: 'custom-div-icon',
  html: `<div class="w-4 h-4 bg-[#165dff] rounded-full border-2 border-white shadow-lg animate-bounce"></div>`,
  iconSize: [16, 16],
  iconAnchor: [8, 8],
});

const waypointIcon = L.divIcon({
  className: 'custom-div-icon',
  html: `<div class="w-3 h-3 bg-white/40 rounded-full border border-white/60"></div>`,
  iconSize: [12, 12],
  iconAnchor: [6, 6],
});

const aircraftModels = ['丰舟 90(70km)', '丰舟 60', '丰舟 30'];
const stations = ['深圳龙华站', '东莞沙田站', '顺丰龙华枢纽站', '南山站点'];
const completionActions = ['降落&返航', '原地降落', '悬停等待', '返航(起点降落)'];
const waypointTypes = ['协调转弯', '直线飞行', '定点悬停'];
const lostLinkBehaviors = ['继续执行', '原地降落', '立即返航'];

const stationCoords = {
  '深圳龙华站': [22.7307967, 114.0713690],
  '东莞沙田站': [22.8696800, 113.6196300],
  '顺丰龙华枢纽站': [22.75, 113.85],
  '南山站点': [22.54, 113.93],
};

function MapViewHandler({ center }) {
  const map = useMap();
  useEffect(() => {
    map.setView(center, map.getZoom());
  }, [center, map]);
  return null;
}

export default function RouteEditor({ onBack, onSave, initialData }) {
  const [name, setName] = useState(initialData?.name || '深圳龙华-东莞沙田跨城航线');
  const [aircraftModel, setAircraftModel] = useState(initialData?.aircraftModel || '丰舟 90(70km)');
  const [originStation, setOriginStation] = useState(initialData?.origin || '深圳龙华站');
  const [alternateStations, setAlternateStations] = useState(initialData?.alternateStations || []);
  const [completionAction, setCompletionAction] = useState(initialData?.completionAction || '降落&返航');
  const [returnAltitudeDiff, setReturnAltitudeDiff] = useState(initialData?.returnAltitudeDiff || 20);
  const [destinationStation, setDestinationStation] = useState(initialData?.destination || '东莞沙田站');
  const [waypointType, setWaypointType] = useState(initialData?.waypointType || '协调转弯');
  const [lostLinkBehavior, setLostLinkBehavior] = useState(initialData?.lostLinkBehavior || '继续执行');
  const [relativeTakeoffAltitude, setRelativeTakeoffAltitude] = useState(initialData?.relativeTakeoffAltitude || 0);
  
  const [altitude] = useState(initialData?.altitude || '120m');
  const [speed] = useState(initialData?.speed || '30m/s');
  const [distance] = useState(initialData?.distance || '0 km');
  
  const [waypoints, setWaypoints] = useState(() => {
    if (initialData?.waypoints) return initialData.waypoints;
    if (initialData?.coords) {
      return initialData.coords.map((c) => {
        const [lng, lat] = c.value.split(',').map((v) => v.trim());
        return {
          id: c.id,
          longitude: lng,
          latitude: lat,
          followAltitude: true,
          relativeAltitude: '90.0',
          followSpeed: true,
          speed: '30.0',
          hoverTime: '0',
          followType: true,
          type: '协调转弯'
        };
      });
    }
    return [];
  });

  const [activeWaypointIndex, setActiveWaypointIndex] = useState(0);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  const [mapCenter, setMapCenter] = useState(() => {
    if (initialData?.position) return initialData.position;
    if (waypoints.length > 0) {
      const lat = parseFloat(waypoints[0].latitude);
      const lng = parseFloat(waypoints[0].longitude);
      if (!isNaN(lat) && !isNaN(lng)) return [lat, lng];
    }
    return [22.7307967, 114.0713690]; // Default fallback
  });

  const handleSave = () => {
    onSave({
      name,
      aircraftModel,
      origin: originStation,
      alternateStations,
      completionAction,
      returnAltitudeDiff,
      destination: destinationStation,
      waypointType,
      lostLinkBehavior,
      relativeTakeoffAltitude,
      altitude,
      speed,
      distance,
      waypoints,
      coords: waypoints.map(wp => ({ id: wp.id, value: `${wp.longitude}, ${wp.latitude}` })),
      position: mapCenter
    });
  };

  const adjustAltitudeDiff = (amount) => {
    setReturnAltitudeDiff(prev => prev + amount);
  };

  const addWaypoint = () => {
    const newWp = {
      id: Date.now().toString(),
      longitude: '114.0713690',
      latitude: '22.7307967',
      followAltitude: true,
      relativeAltitude: '90.0',
      followSpeed: true,
      speed: '30.0',
      hoverTime: '0',
      followType: true,
      type: '协调转弯'
    };
    const newWaypoints = [...waypoints, newWp];
    setWaypoints(newWaypoints);
    setActiveWaypointIndex(newWaypoints.length - 1);
    
    // Update map center to the new waypoint
    const lat = parseFloat(newWp.latitude);
    const lng = parseFloat(newWp.longitude);
    if (!isNaN(lat) && !isNaN(lng)) {
      setMapCenter([lat, lng]);
    }
  };

  const deleteWaypoint = () => {
    if (waypoints.length <= 1) return;
    const newWaypoints = waypoints.filter((_, idx) => idx !== activeWaypointIndex);
    setWaypoints(newWaypoints);
    setActiveWaypointIndex(Math.max(0, activeWaypointIndex - 1));
    setShowDeleteConfirm(false);
  };

  const updateActiveWaypoint = (updates) => {
    const newWaypoints = [...waypoints];
    newWaypoints[activeWaypointIndex] = { ...newWaypoints[activeWaypointIndex], ...updates };
    setWaypoints(newWaypoints);
  };

  const originPos = stationCoords[originStation] || [22.7307967, 114.0713690];
  const destPos = stationCoords[destinationStation] || [22.8696800, 113.6196300];

  const polylinePositions = [
    originPos,
    ...waypoints.map(wp => {
      const lat = parseFloat(wp.latitude);
      const lng = parseFloat(wp.longitude);
      return [lat, lng];
    }),
    destPos
  ].filter(p => !isNaN(p[0]) && !isNaN(p[1]));

  const activeWaypoint = waypoints[activeWaypointIndex];
  const isWaypointActive = !!activeWaypoint;
  
  const displayWaypoint = activeWaypoint || {
    longitude: '',
    latitude: '',
    followAltitude: true,
    relativeAltitude: '90.0',
    followSpeed: true,
    speed: '30.0',
    hoverTime: '0',
    followType: true,
    type: '协调转弯'
  };

  return (
    <div className="absolute inset-0 bg-surface z-[100] flex flex-col font-sans">
      {/* Header */}
      <div className="h-[64px] border-b border-outline-variant/10 flex items-center justify-between px-6 bg-surface/80 backdrop-blur-md">
        <div className="flex items-center gap-4">
          <button 
            onClick={onBack}
            className="p-2 hover:bg-surface-container-highest rounded-full text-outline hover:text-on-surface transition-all"
          >
            <ArrowLeft size={20} />
          </button>
          <h2 className="text-[18px] font-bold text-on-surface tracking-tight">
            {initialData ? '编辑航线' : '新建航线'}
          </h2>
        </div>
        <button 
          onClick={handleSave}
          className="flex items-center gap-2 px-6 py-2 bg-primary-container hover:bg-primary-container/90 text-white rounded-xl transition-all shadow-lg shadow-primary-container/20 text-[14px] font-bold"
        >
          <Save size={18} />
          保存航线
        </button>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex gap-4 p-4 overflow-hidden bg-surface">
        {/* Left Panel - Basic Info */}
        <div className="w-[240px] bg-surface-container backdrop-blur-xl border border-outline-variant/20 rounded-2xl flex flex-col overflow-hidden shadow-2xl relative">
          <div className="absolute inset-0 opacity-[0.03] pointer-events-none" style={{ backgroundImage: 'radial-gradient(circle, #fff 1px, transparent 1px)', backgroundSize: '20px 20px' }}></div>
          <div className="p-5 space-y-6 relative z-10 custom-scrollbar overflow-y-auto">
            <div className="flex items-center gap-2 text-primary-container mb-2">
              <Info size={18} />
              <span className="text-[14px] font-bold uppercase tracking-wider">航线参数</span>
            </div>

            <div className="space-y-4">
              {/* 1) 航线名称 */}
              <div className="space-y-1.5">
                <label className="text-[12px] text-outline/60 font-medium ml-1">航线名称</label>
                <input 
                  type="text" 
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="请输入航线名称"
                  className="w-full h-[38px] bg-surface-container-high border border-outline-variant/30 rounded-xl px-4 text-[13px] text-on-surface focus:outline-none focus:border-primary-container transition-all"
                />
              </div>

              {/* 2) 适用机型 */}
              <div className="space-y-1.5">
                <label className="text-[12px] text-outline/60 font-medium ml-1">适用机型</label>
                <select 
                  value={aircraftModel}
                  onChange={(e) => setAircraftModel(e.target.value)}
                  className="w-full h-[38px] bg-surface-container-high border border-outline-variant/30 rounded-xl px-4 text-[13px] text-on-surface focus:outline-none focus:border-primary-container transition-all appearance-none cursor-pointer"
                >
                  {aircraftModels.map(m => (
                    <option key={m} value={m} className="bg-surface-container-highest">{m}</option>
                  ))}
                </select>
              </div>

              {/* 3) 起点站 */}
              <div className="space-y-1.5">
                <label className="text-[12px] text-outline/60 font-medium ml-1">起点站</label>
                <div className="flex gap-2">
                  <select 
                    value={originStation}
                    onChange={(e) => setOriginStation(e.target.value)}
                    className="flex-1 h-[38px] bg-surface-container-high border border-outline-variant/30 rounded-xl px-4 text-[13px] text-on-surface focus:outline-none focus:border-primary-container transition-all appearance-none cursor-pointer"
                  >
                    <option value="" className="bg-surface-container-highest">请选择起点站</option>
                    {stations.map(s => (
                      <option key={s} value={s} className="bg-surface-container-highest">{s}</option>
                    ))}
                  </select>
                  <button 
                    onClick={() => setOriginStation('')}
                    className="px-3 h-[38px] bg-surface-container-high border border-outline-variant/30 rounded-xl text-[12px] text-outline hover:text-on-surface hover:bg-surface-container-highest transition-all"
                  >
                    清空
                  </button>
                </div>
              </div>

              {/* 4) 备降站 */}
              <div className="space-y-1.5">
                <label className="text-[12px] text-outline/60 font-medium ml-1">备降站（可多选）</label>
                <div className="relative">
                  <input 
                    type="text" 
                    readOnly
                    placeholder={alternateStations.length > 0 ? alternateStations.join(', ') : "暂无备降站"}
                    className="w-full h-[38px] bg-surface-container-high border border-outline-variant/30 rounded-xl px-4 text-[13px] text-on-surface focus:outline-none focus:border-primary-container transition-all cursor-pointer"
                    onClick={() => {
                      // Simple toggle for demo
                      if (alternateStations.includes('南山站点')) {
                        setAlternateStations([]);
                      } else {
                        setAlternateStations(['南山站点']);
                      }
                    }}
                  />
                </div>
              </div>

              {/* 5) 完成动作 */}
              <div className="space-y-1.5">
                <label className="text-[12px] text-outline/60 font-medium ml-1">完成动作</label>
                <select 
                  value={completionAction}
                  onChange={(e) => setCompletionAction(e.target.value)}
                  className="w-full h-[38px] bg-surface-container-high border border-outline-variant/30 rounded-xl px-4 text-[13px] text-on-surface focus:outline-none focus:border-primary-container transition-all appearance-none cursor-pointer"
                >
                  {completionActions.map(a => (
                    <option key={a} value={a} className="bg-surface-container-highest">{a}</option>
                  ))}
                </select>
              </div>

              {/* 6) 返航高度差 */}
              <div className="space-y-1.5">
                <label className="text-[12px] text-outline/60 font-medium ml-1">返航高度差(m)</label>
                <div className="flex items-center gap-2">
                  <button 
                    onClick={() => adjustAltitudeDiff(-1)}
                    className="w-[38px] h-[38px] bg-surface-container-high border border-outline-variant/30 rounded-xl flex items-center justify-center text-outline hover:text-on-surface hover:bg-surface-container-highest transition-all"
                  >
                    <Minus size={16} />
                  </button>
                  <input 
                    type="number" 
                    value={returnAltitudeDiff}
                    onChange={(e) => setReturnAltitudeDiff(parseInt(e.target.value) || 0)}
                    className="flex-1 h-[38px] bg-surface-container-high border border-outline-variant/30 rounded-xl px-4 text-[13px] text-on-surface text-center focus:outline-none focus:border-primary-container transition-all"
                  />
                  <button 
                    onClick={() => adjustAltitudeDiff(1)}
                    className="w-[38px] h-[38px] bg-surface-container-high border border-outline-variant/30 rounded-xl flex items-center justify-center text-outline hover:text-on-surface hover:bg-surface-container-highest transition-all"
                  >
                    <Plus size={16} />
                  </button>
                </div>
                <div className="grid grid-cols-6 gap-1 mt-2">
                  {[-10, -5, -1, 1, 5, 10].map(val => (
                    <button
                      key={val}
                      onClick={() => adjustAltitudeDiff(val)}
                      className="h-[24px] bg-surface-container-high border border-outline-variant/30 rounded text-[10px] text-outline hover:text-on-surface hover:bg-primary-container/20 hover:border-primary-container/30 transition-all"
                    >
                      {val > 0 ? `+${val}` : val}
                    </button>
                  ))}
                </div>
                <p className="text-[10px] text-outline/40 mt-1 leading-tight">
                  正数表示高于原航线；仅&quot;降落&amp;返航/返航(起点降落)&quot;需要填写
                </p>
              </div>

              {/* 7) 终点站 */}
              <div className="space-y-1.5">
                <label className="text-[12px] text-outline/60 font-medium ml-1">终点站</label>
                <div className="flex gap-2">
                  <select 
                    value={destinationStation}
                    onChange={(e) => setDestinationStation(e.target.value)}
                    className="flex-1 h-[38px] bg-surface-container-high border border-outline-variant/30 rounded-xl px-4 text-[13px] text-on-surface focus:outline-none focus:border-primary-container transition-all appearance-none cursor-pointer"
                  >
                    <option value="" className="bg-surface-container-highest">请选择终点站</option>
                    {stations.map(s => (
                      <option key={s} value={s} className="bg-surface-container-highest">{s}</option>
                    ))}
                  </select>
                  <button 
                    onClick={() => setDestinationStation('')}
                    className="px-3 h-[38px] bg-surface-container-high border border-outline-variant/30 rounded-xl text-[12px] text-outline hover:text-on-surface hover:bg-surface-container-highest transition-all"
                  >
                    清空
                  </button>
                </div>
              </div>

              {/* 8) 航点类型 */}
              <div className="space-y-1.5">
                <label className="text-[12px] text-outline/60 font-medium ml-1">航点类型</label>
                <select 
                  value={waypointType}
                  onChange={(e) => setWaypointType(e.target.value)}
                  className="w-full h-[38px] bg-surface-container-high border border-outline-variant/30 rounded-xl px-4 text-[13px] text-on-surface focus:outline-none focus:border-primary-container transition-all appearance-none cursor-pointer"
                >
                  {waypointTypes.map(t => (
                    <option key={t} value={t} className="bg-surface-container-highest">{t}</option>
                  ))}
                </select>
              </div>

              {/* 9) 失联行为 */}
              <div className="space-y-1.5">
                <label className="text-[12px] text-outline/60 font-medium ml-1">失联行为</label>
                <select 
                  value={lostLinkBehavior}
                  onChange={(e) => setLostLinkBehavior(e.target.value)}
                  className="w-full h-[38px] bg-surface-container-high border border-outline-variant/30 rounded-xl px-4 text-[13px] text-on-surface focus:outline-none focus:border-primary-container transition-all appearance-none cursor-pointer"
                >
                  {lostLinkBehaviors.map(b => (
                    <option key={b} value={b} className="bg-surface-container-highest">{b}</option>
                  ))}
                </select>
              </div>

              {/* 10) 相对起飞点高度 */}
              <div className="space-y-1.5">
                <label className="text-[12px] text-outline/60 font-medium ml-1">相对起飞点高度(m)</label>
                <input 
                  type="number" 
                  value={relativeTakeoffAltitude}
                  onChange={(e) => setRelativeTakeoffAltitude(parseInt(e.target.value) || 0)}
                  className="w-full h-[38px] bg-surface-container-high border border-outline-variant/30 rounded-xl px-4 text-[13px] text-on-surface focus:outline-none focus:border-primary-container transition-all"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Center - Map */}
        <div className="flex-1 relative bg-surface-container-low border border-outline-variant/20 rounded-2xl overflow-hidden shadow-2xl">
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
            
            {polylinePositions.length > 1 && (
              <Polyline 
                positions={polylinePositions} 
                pathOptions={{ color: 'var(--primary-container)', weight: 4, opacity: 0.8 }} 
              />
            )}

            <Marker position={originPos} icon={originIcon} />
            <Marker position={destPos} icon={destinationIcon} />

            {waypoints.map((wp) => (
              <Marker 
                key={wp.id} 
                position={[parseFloat(wp.latitude), parseFloat(wp.longitude)]} 
                icon={waypointIcon} 
              />
            ))}
          </MapContainer>

          {/* Map Overlay Info */}
          <div className="absolute bottom-6 left-6 bg-surface-container/80 backdrop-blur-md border border-outline-variant/10 rounded-xl p-3 z-[1000]">
            <div className="flex items-center gap-4 text-on-surface text-[12px]">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-error rounded-full" />
                <span>起点</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-primary-container rounded-full" />
                <span>终点</span>
              </div>
              <div className="flex items-center gap-2">
                <Navigation size={14} className="text-outline/60" />
                <span>航点数: {waypoints.length}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Right Panel - Waypoint Editing Panel */}
        <div className="w-[240px] bg-surface-container backdrop-blur-xl border border-outline-variant/20 rounded-2xl flex flex-col overflow-hidden shadow-2xl relative">
          <div className="absolute inset-0 opacity-[0.03] pointer-events-none" style={{ backgroundImage: 'radial-gradient(circle, #fff 1px, transparent 1px)', backgroundSize: '20px 20px' }}></div>
          
          {/* Right Panel Header */}
          <div className="p-5 border-b border-outline-variant/10 relative z-10">
            <h3 className="text-[16px] font-bold text-on-surface tracking-tight">航点编辑面板</h3>
            <p className="text-[11px] text-outline/40 font-medium">不含起点/终点</p>
          </div>

          <div className="flex-1 overflow-y-auto custom-scrollbar relative z-10">
            {/* Add Button and Waypoint List */}
            <div className="p-5 space-y-4">
              <button 
                onClick={addWaypoint}
                className="w-full flex items-center justify-center gap-2 py-2.5 bg-primary-container hover:bg-primary-container/90 text-white rounded-xl transition-all shadow-lg shadow-primary-container/20 text-[14px] font-bold"
              >
                <Plus size={18} />
                新增航点
              </button>

              {waypoints.length > 0 && (
                <div className="grid grid-cols-2 gap-2">
                  {waypoints.map((wp, idx) => (
                    <button
                      key={wp.id}
                      onClick={() => setActiveWaypointIndex(idx)}
                      className={`py-2 rounded-lg text-[13px] font-medium transition-all border ${
                        activeWaypointIndex === idx 
                          ? 'bg-primary-container border-primary-container text-white shadow-lg shadow-primary-container/20' 
                          : 'bg-surface-container-high border-outline-variant/10 text-outline hover:text-on-surface hover:bg-surface-container-highest'
                      }`}
                    >
                      航点{idx + 1}
                    </button>
                  ))}
                </div>
              )}
            </div>

            <div className="h-px bg-outline-variant/10 mx-5" />

            {/* Waypoint Form - Always Visible */}
            <div className="p-5 space-y-5">
              {/* 1) 经度 */}
              <div className="space-y-1.5">
                <div className="flex items-center justify-between ml-1">
                  <label className="text-[12px] text-outline/60 font-medium">经度</label>
                  <button 
                    disabled={!isWaypointActive}
                    onClick={() => updateActiveWaypoint({ longitude: '' })}
                    className={`text-[11px] text-primary-container hover:underline ${!isWaypointActive ? 'opacity-40 cursor-not-allowed' : ''}`}
                  >
                    清空
                  </button>
                </div>
                <input 
                  type="text" 
                  disabled={!isWaypointActive}
                  value={displayWaypoint.longitude}
                  onChange={(e) => updateActiveWaypoint({ longitude: e.target.value })}
                  className={`w-full h-[38px] bg-surface-container-high border border-outline-variant/30 rounded-xl px-4 text-[13px] text-on-surface focus:outline-none focus:border-primary-container transition-all ${!isWaypointActive ? 'opacity-40 cursor-not-allowed' : ''}`}
                />
              </div>

              {/* 2) 纬度 */}
              <div className="space-y-1.5">
                <div className="flex items-center justify-between ml-1">
                  <label className="text-[12px] text-outline/60 font-medium">纬度</label>
                  <button 
                    disabled={!isWaypointActive}
                    onClick={() => updateActiveWaypoint({ latitude: '' })}
                    className={`text-[11px] text-primary-container hover:underline ${!isWaypointActive ? 'opacity-40 cursor-not-allowed' : ''}`}
                  >
                    清空
                  </button>
                </div>
                <input 
                  type="text" 
                  disabled={!isWaypointActive}
                  value={displayWaypoint.latitude}
                  onChange={(e) => updateActiveWaypoint({ latitude: e.target.value })}
                  className={`w-full h-[38px] bg-surface-container-high border border-outline-variant/30 rounded-xl px-4 text-[13px] text-on-surface focus:outline-none focus:border-primary-container transition-all ${!isWaypointActive ? 'opacity-40 cursor-not-allowed' : ''}`}
                />
              </div>

              {/* 3) 跟随航线高度 */}
              <div className="flex items-center gap-2 ml-1">
                <button 
                  disabled={!isWaypointActive}
                  onClick={() => updateActiveWaypoint({ followAltitude: !displayWaypoint.followAltitude })}
                  className={`w-4 h-4 rounded border flex items-center justify-center transition-all ${
                    displayWaypoint.followAltitude 
                      ? 'bg-primary-container border-primary-container' 
                      : 'border-outline-variant/20 hover:border-outline-variant/40'
                  } ${!isWaypointActive ? 'opacity-40 cursor-not-allowed' : ''}`}
                >
                  {displayWaypoint.followAltitude && <Check size={12} className="text-white" />}
                </button>
                <span className={`text-[13px] text-on-surface font-medium ${!isWaypointActive ? 'opacity-40' : ''}`}>跟随航线高度</span>
              </div>

              {/* 4) 航点相对起飞点高度 */}
              <div className="space-y-1.5">
                <div className="flex items-center justify-between ml-1">
                  <label className="text-[12px] text-outline/60 font-medium">航点相对起飞点高度(m)</label>
                  {isWaypointActive && !displayWaypoint.followAltitude && (
                    <button 
                      onClick={() => updateActiveWaypoint({ relativeAltitude: '' })}
                      className="text-[11px] text-primary-container hover:underline"
                    >
                      清空
                    </button>
                  )}
                </div>
                <input 
                  type="text" 
                  disabled={!isWaypointActive || displayWaypoint.followAltitude}
                  value={displayWaypoint.relativeAltitude}
                  onChange={(e) => updateActiveWaypoint({ relativeAltitude: e.target.value })}
                  className={`w-full h-[38px] bg-surface-container-high border border-outline-variant/30 rounded-xl px-4 text-[13px] text-on-surface focus:outline-none focus:border-primary-container transition-all ${
                    (!isWaypointActive || displayWaypoint.followAltitude) ? 'opacity-40 cursor-not-allowed' : ''
                  }`}
                />
              </div>

              {/* 5) 跟随航线速度 */}
              <div className="flex items-center gap-2 ml-1">
                <button 
                  disabled={!isWaypointActive}
                  onClick={() => updateActiveWaypoint({ followSpeed: !displayWaypoint.followSpeed })}
                  className={`w-4 h-4 rounded border flex items-center justify-center transition-all ${
                    displayWaypoint.followSpeed 
                      ? 'bg-primary-container border-primary-container' 
                      : 'border-outline-variant/20 hover:border-outline-variant/40'
                  } ${!isWaypointActive ? 'opacity-40 cursor-not-allowed' : ''}`}
                >
                  {displayWaypoint.followSpeed && <Check size={12} className="text-white" />}
                </button>
                <span className={`text-[13px] text-on-surface font-medium ${!isWaypointActive ? 'opacity-40' : ''}`}>跟随航线速度</span>
              </div>

              {/* 6) 航点速度 */}
              <div className="space-y-1.5">
                <div className="flex items-center justify-between ml-1">
                  <label className="text-[12px] text-outline/60 font-medium">航点速度(m/s)</label>
                  {isWaypointActive && !displayWaypoint.followSpeed && (
                    <button 
                      onClick={() => updateActiveWaypoint({ speed: '' })}
                      className="text-[11px] text-primary-container hover:underline"
                    >
                      清空
                    </button>
                  )}
                </div>
                <input 
                  type="text" 
                  disabled={!isWaypointActive || displayWaypoint.followSpeed}
                  value={displayWaypoint.speed}
                  onChange={(e) => updateActiveWaypoint({ speed: e.target.value })}
                  className={`w-full h-[38px] bg-surface-container-high border border-outline-variant/30 rounded-xl px-4 text-[13px] text-on-surface focus:outline-none focus:border-primary-container transition-all ${
                    (!isWaypointActive || displayWaypoint.followSpeed) ? 'opacity-40 cursor-not-allowed' : ''
                  }`}
                />
              </div>

              {/* 7) 悬停时间 */}
              <div className="space-y-1.5">
                <div className="flex items-center justify-between ml-1">
                  <label className="text-[12px] text-outline/60 font-medium">悬停时间(s)</label>
                  <button 
                    disabled={!isWaypointActive}
                    onClick={() => updateActiveWaypoint({ hoverTime: '' })}
                    className={`text-[11px] text-primary-container hover:underline ${!isWaypointActive ? 'opacity-40 cursor-not-allowed' : ''}`}
                  >
                    清空
                  </button>
                </div>
                <input 
                  type="text" 
                  disabled={!isWaypointActive}
                  value={displayWaypoint.hoverTime}
                  onChange={(e) => updateActiveWaypoint({ hoverTime: e.target.value })}
                  className={`w-full h-[38px] bg-surface-container-high border border-outline-variant/30 rounded-xl px-4 text-[13px] text-on-surface focus:outline-none focus:border-primary-container transition-all ${!isWaypointActive ? 'opacity-40 cursor-not-allowed' : ''}`}
                />
              </div>

              {/* 8) 跟随航点类型 */}
              <div className="flex items-center gap-2 ml-1">
                <button 
                  disabled={!isWaypointActive}
                  onClick={() => updateActiveWaypoint({ followType: !displayWaypoint.followType })}
                  className={`w-4 h-4 rounded border flex items-center justify-center transition-all ${
                    displayWaypoint.followType 
                      ? 'bg-primary-container border-primary-container' 
                      : 'border-outline-variant/20 hover:border-outline-variant/40'
                  } ${!isWaypointActive ? 'opacity-40 cursor-not-allowed' : ''}`}
                >
                  {displayWaypoint.followType && <Check size={12} className="text-white" />}
                </button>
                <span className={`text-[13px] text-on-surface font-medium ${!isWaypointActive ? 'opacity-40' : ''}`}>跟随航点类型</span>
              </div>

              {/* 9) 航点类型 */}
              <div className="space-y-1.5">
                <label className="text-[12px] text-outline/60 font-medium ml-1">航点类型</label>
                <select 
                  disabled={!isWaypointActive || displayWaypoint.followType}
                  value={displayWaypoint.type}
                  onChange={(e) => updateActiveWaypoint({ type: e.target.value })}
                  className={`w-full h-[38px] bg-surface-container-high border border-outline-variant/30 rounded-xl px-4 text-[13px] text-on-surface focus:outline-none focus:border-primary-container transition-all appearance-none cursor-pointer ${
                    (!isWaypointActive || displayWaypoint.followType) ? 'opacity-40 cursor-not-allowed' : ''
                  }`}
                >
                  {waypointTypes.map(t => (
                    <option key={t} value={t} className="bg-surface-container-highest">{t}</option>
                  ))}
                </select>
              </div>

              {/* Delete Button */}
              {isWaypointActive && (
                <div className="pt-4">
                  <button 
                    onClick={() => setShowDeleteConfirm(true)}
                    className="w-full py-2.5 bg-error/10 hover:bg-error/20 text-error border border-error/20 rounded-xl transition-all text-[13px] font-bold"
                  >
                    删除当前航点
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      <AnimatePresence>
        {showDeleteConfirm && (
          <div className="fixed inset-0 z-[2000] flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowDeleteConfirm(false)}
              className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="bg-surface-container/90 backdrop-blur-xl border border-outline-variant/10 rounded-2xl p-6 w-full max-w-[360px] shadow-2xl relative z-10"
            >
              <div className="flex flex-col items-center text-center gap-4">
                <div className="w-12 h-12 bg-error/10 rounded-full flex items-center justify-center text-error">
                  <AlertTriangle size={24} />
                </div>
                <div className="space-y-1">
                  <h4 className="text-[18px] font-bold text-on-surface">确认删除航点？</h4>
                  <p className="text-[14px] text-outline/60">删除后将无法恢复，确定要继续吗？</p>
                </div>
                <div className="grid grid-cols-2 gap-3 w-full mt-2">
                  <button 
                    onClick={() => setShowDeleteConfirm(false)}
                    className="py-2.5 bg-surface-container-high hover:bg-surface-container-highest text-outline hover:text-on-surface rounded-xl border border-outline-variant/30 transition-all text-[14px] font-bold"
                  >
                    取消
                  </button>
                  <button 
                    onClick={deleteWaypoint}
                    className="py-2.5 bg-error hover:bg-error/90 text-white rounded-xl shadow-lg shadow-error/20 transition-all text-[14px] font-bold"
                  >
                    确定删除
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
