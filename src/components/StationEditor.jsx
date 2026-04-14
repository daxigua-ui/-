import { useState, useEffect } from 'react';
import { ArrowLeft, MapPin, Save, Info, Settings, Zap } from 'lucide-react';
import { MapContainer, TileLayer, Marker, useMap } from 'react-leaflet';
import L from 'leaflet';

// Fix Leaflet icon issue
const stationIcon = L.divIcon({
  className: 'custom-div-icon',
  html: `<div class="w-6 h-6 bg-primary-container rounded-full border-2 border-white shadow-lg flex items-center justify-center"><div class="w-2.5 h-2.5 bg-white rounded-full"></div></div>`,
  iconSize: [24, 24],
  iconAnchor: [12, 12],
});

const stationTypes = ['标准综合站', '综合站', '配送站', '起降点'];
const airspaces = ['深圳龙华空域', '东莞沙田空域', '南山低空航道', '福田管制区'];
const statusOptions = ['启用中', '禁用中', '维护中'];

function MapViewHandler({ center }) {
  const map = useMap();
  useEffect(() => {
    map.setView(center, map.getZoom());
  }, [center, map]);
  return null;
}

export default function StationEditor({ onBack, onSave, initialData }) {
  const [name, setName] = useState(initialData?.name || '');
  const [type, setType] = useState(initialData?.type || '标准综合站');
  const [airspace, setAirspace] = useState(initialData?.airspace || '深圳龙华空域');
  const [status, setStatus] = useState(initialData?.status || '启用中');
  const [landingPads, setLandingPads] = useState(initialData?.landingPads || '4');
  const [energyConfig, setEnergyConfig] = useState(initialData?.energyConfig || '充电 + 换电');
  const [chargingSlots, setChargingSlots] = useState(initialData?.chargingSlots || '6');
  const [batterySlots, setBatterySlots] = useState(initialData?.batterySlots || '4');
  const [coords, setCoords] = useState(initialData?.coords || '113.61963, 22.86968');
  
  const [mapCenter, setMapCenter] = useState(
    initialData?.position || [22.86968, 113.61963]
  );

  const handleSave = () => {
    onSave({
      name,
      type,
      airspace,
      status,
      landingPads,
      energyConfig,
      chargingSlots,
      batterySlots,
      coords,
      position: mapCenter
    });
  };

  const [prevCoords, setPrevCoords] = useState(coords);
  if (coords !== prevCoords) {
    setPrevCoords(coords);
    const parts = coords.split(',').map((p) => parseFloat(p.trim()));
    if (parts.length === 2 && !isNaN(parts[0]) && !isNaN(parts[1])) {
      // Leaflet uses [lat, lng], input is usually [lng, lat]
      setMapCenter([parts[1], parts[0]]);
    }
  }

  return (
    <div 
      className="absolute inset-0 bg-surface z-[100] flex flex-col font-sans"
    >
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
            {initialData ? '编辑站点规划' : '新建站点规划'}
          </h2>
        </div>
        <button 
          onClick={handleSave}
          className="flex items-center gap-2 px-6 py-2 bg-primary-container hover:bg-primary-container/90 text-white rounded-xl transition-all shadow-lg shadow-primary-container/20 text-[14px] font-bold"
        >
          <Save size={18} />
          保存站点
        </button>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex overflow-hidden">
        {/* Left Panel - Basic Info */}
        <div className="w-[320px] border-r border-outline-variant/10 flex flex-col bg-surface-container-low overflow-y-auto custom-scrollbar relative">
          <div className="absolute inset-0 opacity-[0.03] pointer-events-none" style={{ backgroundImage: 'radial-gradient(circle, #fff 1px, transparent 1px)', backgroundSize: '20px 20px' }}></div>
          <div className="p-6 space-y-6 relative z-10">
            <div className="flex items-center gap-2 text-primary-container mb-2">
              <Info size={18} />
              <span className="text-[14px] font-bold uppercase tracking-wider">基础信息</span>
            </div>

            <div className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-[12px] text-outline/60 font-medium ml-1">站点名称</label>
                <input 
                  type="text" 
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="请输入站点名称"
                  className="w-full h-[40px] bg-surface-container-high border border-outline-variant/10 rounded-xl px-4 text-[14px] text-on-surface focus:outline-none focus:border-primary-container transition-all"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-[12px] text-outline/60 font-medium ml-1">站点类型</label>
                <select 
                  value={type}
                  onChange={(e) => setType(e.target.value)}
                  className="w-full h-[40px] bg-surface-container-high border border-outline-variant/10 rounded-xl px-4 text-[14px] text-on-surface focus:outline-none focus:border-primary-container transition-all appearance-none cursor-pointer"
                >
                  {stationTypes.map(t => (
                    <option key={t} value={t} className="bg-surface-container-highest">{t}</option>
                  ))}
                </select>
              </div>

              <div className="space-y-1.5">
                <label className="text-[12px] text-outline/60 font-medium ml-1">站点状态</label>
                <select 
                  value={status}
                  onChange={(e) => setStatus(e.target.value)}
                  className="w-full h-[40px] bg-surface-container-high border border-outline-variant/10 rounded-xl px-4 text-[14px] text-on-surface focus:outline-none focus:border-primary-container transition-all appearance-none cursor-pointer"
                >
                  {statusOptions.map(s => (
                    <option key={s} value={s} className="bg-surface-container-highest">{s}</option>
                  ))}
                </select>
              </div>

              <div className="space-y-1.5">
                <label className="text-[12px] text-outline/60 font-medium ml-1">所属空域</label>
                <select 
                  value={airspace}
                  onChange={(e) => setAirspace(e.target.value)}
                  className="w-full h-[40px] bg-surface-container-high border border-outline-variant/10 rounded-xl px-4 text-[14px] text-on-surface focus:outline-none focus:border-primary-container transition-all appearance-none cursor-pointer"
                >
                  {airspaces.map(a => (
                    <option key={a} value={a} className="bg-surface-container-highest">{a}</option>
                  ))}
                </select>
              </div>
            </div>
          </div>
        </div>

        {/* Center - Map */}
        <div className="flex-1 relative bg-surface-container-lowest">
          <MapContainer 
            center={mapCenter} 
            zoom={13} 
            zoomControl={false}
            style={{ height: '100%', width: '100%' }}
          >
            <TileLayer
              url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png"
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'
            />
            <MapViewHandler center={mapCenter} />
            <Marker position={mapCenter} icon={stationIcon} />
          </MapContainer>

          {/* Map Overlay Info */}
          <div className="absolute bottom-6 left-6 bg-surface-container/80 backdrop-blur-md border border-outline-variant/10 rounded-xl p-3 z-[1000]">
            <div className="flex items-center gap-2 text-on-surface text-[12px]">
              <MapPin size={14} className="text-primary-container" />
              <span>当前位置: {coords}</span>
            </div>
          </div>
        </div>

        {/* Right Panel - Technical Config */}
        <div className="w-[320px] border-l border-outline-variant/10 flex flex-col bg-surface-container-low overflow-y-auto custom-scrollbar relative">
          <div className="absolute inset-0 opacity-[0.03] pointer-events-none" style={{ backgroundImage: 'radial-gradient(circle, #fff 1px, transparent 1px)', backgroundSize: '20px 20px' }}></div>
          <div className="p-6 space-y-6 relative z-10">
            <div className="flex items-center gap-2 text-primary-container mb-2">
              <Settings size={18} />
              <span className="text-[14px] font-bold uppercase tracking-wider">技术配置</span>
            </div>

            <div className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-[12px] text-outline/60 font-medium ml-1">起降坪数量</label>
                <input 
                  type="text" 
                  value={landingPads}
                  onChange={(e) => setLandingPads(e.target.value)}
                  placeholder="如: 4"
                  className="w-full h-[40px] bg-surface-container-high border border-outline-variant/10 rounded-xl px-4 text-[14px] text-on-surface focus:outline-none focus:border-primary-container transition-all"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-[12px] text-outline/60 font-medium ml-1">补能配置</label>
                <input 
                  type="text" 
                  value={energyConfig}
                  onChange={(e) => setEnergyConfig(e.target.value)}
                  placeholder="如: 充电 + 换电"
                  className="w-full h-[40px] bg-surface-container-high border border-outline-variant/10 rounded-xl px-4 text-[14px] text-on-surface focus:outline-none focus:border-primary-container transition-all"
                />
              </div>

              <div className="flex items-center gap-2 text-primary-container mt-6 mb-2">
                <Zap size={18} />
                <span className="text-[14px] font-bold uppercase tracking-wider">工位详情</span>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-[12px] text-outline/60 font-medium ml-1">充电工位</label>
                  <input 
                    type="text" 
                    value={chargingSlots}
                    onChange={(e) => setChargingSlots(e.target.value)}
                    className="w-full h-[40px] bg-surface-container-high border border-outline-variant/10 rounded-xl px-4 text-[14px] text-on-surface focus:outline-none focus:border-primary-container transition-all"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-[12px] text-outline/60 font-medium ml-1">换电工位</label>
                  <input 
                    type="text" 
                    value={batterySlots}
                    onChange={(e) => setBatterySlots(e.target.value)}
                    className="w-full h-[40px] bg-surface-container-high border border-outline-variant/10 rounded-xl px-4 text-[14px] text-on-surface focus:outline-none focus:border-primary-container transition-all"
                  />
                </div>
              </div>

              <div className="space-y-1.5 mt-4">
                <label className="text-[12px] text-outline/60 font-medium ml-1">中心点坐标</label>
                <div className="relative">
                  <input 
                    type="text" 
                    value={coords}
                    onChange={(e) => setCoords(e.target.value)}
                    className="w-full h-[40px] bg-surface-container-high border border-outline-variant/10 rounded-xl px-4 pr-10 text-[14px] text-on-surface focus:outline-none focus:border-primary-container transition-all"
                  />
                  <MapPin size={16} className="absolute right-3 top-1/2 -translate-y-1/2 text-outline/40" />
                </div>
                <p className="text-[11px] text-outline/40 mt-1 px-1">格式: 经度, 纬度</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
