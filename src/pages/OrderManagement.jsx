import { useState, useEffect } from 'react';
import { 
  Search, 
  Plus, 
  Navigation, 
  Layers, 
  Maximize2, 
  Compass, 
  MousePointer2,
  Eye,
  Edit3,
  Trash2,
  Box,
  EyeOff
} from 'lucide-react';
import { motion } from 'motion/react';
import { MapContainer, TileLayer, Marker, Popup, Polygon, useMap } from 'react-leaflet';
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

const areaList = [
  { id: '1', name: '东莞沙田中转 E', type: '终点', area: '2827.43m²', radius: '30m', color: 'bg-primary-container', position: [22.8615, 113.6635] },
  { id: '2', name: '顺丰龙华中转场 S', type: '起点', area: '2827.43m²', radius: '30m', color: 'bg-error', position: [22.6545, 114.0245] },
];

const orderList = [
  { 
    id: 'ORDER-20260323-1421', 
    origin: '顺丰龙华中转场', 
    destination: '东莞沙田中转', 
    status: '已分配', 
    cargo: '标准快递箱 (中)',
    container: '便携应急救援箱',
    cargoCount: '50件',
    loadingType: '按件数',
    unitLoad: '2件/箱',
    weight: '450.0 kg',
    boxCount: '25',
    path: [[22.6545, 114.0245], [22.8615, 113.6635]] 
  },
  { 
    id: 'ORDER-20260323-9422', 
    origin: '顺丰龙华中转场', 
    destination: '东莞沙田中转', 
    status: '已分配', 
    cargo: '标准快递箱 (小)',
    container: '便携应急救援箱',
    cargoCount: '100件',
    loadingType: '按件数',
    unitLoad: '5件/箱',
    weight: '400.0 kg',
    boxCount: '20',
    path: [[22.6545, 114.0245], [22.8615, 113.6635]] 
  },
];

const polygonCoords = [
  [22.8800, 113.6000],
  [22.9000, 113.7500],
  [22.7500, 113.8000],
  [22.6500, 113.7000],
  [22.7000, 113.5500],
];

// Component to handle map view updates
function MapViewHandler({ center }) {
  const map = useMap();
  useEffect(() => {
    map.setView(center, map.getZoom());
  }, [center, map]);
  return null;
}

const tabs = [
  { id: 'area', label: '区域管理' },
  { id: 'order', label: '订单管理' },
];

export default function OrderManagement() {
  const [activeTab, setActiveTab] = useState('area');
  const [searchQuery, setSearchQuery] = useState('');
  const [mapCenter, setMapCenter] = useState([22.75, 113.85]);
  const [selectedId, setSelectedId] = useState(null);

  return (
    <div className="h-[calc(100vh-100px)] flex flex-col gap-4 animate-in fade-in duration-500">
      {/* Top Navigation Tabs */}
      <div className="flex items-center gap-8 border-b border-outline-variant/10 mb-2">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => {
              setActiveTab(tab.id);
              setSelectedId(null);
            }}
            className={`pb-4 text-[18px] font-semibold transition-all relative ${
              activeTab === tab.id 
                ? 'text-primary-container' 
                : 'text-outline hover:text-on-surface'
            }`}
          >
            {tab.label}
            {activeTab === tab.id && (
              <motion.div 
                layoutId="activeTab"
                className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary-container shadow-[0_0_8px_rgba(22,93,255,0.6)]"
              />
            )}
          </button>
        ))}
      </div>

      <div className="flex-1 flex gap-4 overflow-hidden">
        {/* Left Sidebar */}
        <div className="w-[280px] bg-surface-container backdrop-blur-xl border border-outline-variant/10 rounded-2xl flex flex-col overflow-hidden shadow-2xl">
          <div className="p-4 border-b border-outline-variant/10 flex items-center justify-between">
            <h3 className="text-[16px] font-semibold text-on-surface">
              {activeTab === 'area' ? '区域列表' : '订单列表'}
            </h3>
            <button className="p-1.5 bg-primary-container hover:bg-primary-container/90 text-white rounded-lg transition-all shadow-lg shadow-primary-container/20">
              <Plus size={18} />
            </button>
          </div>

          <div className="p-4 border-b border-outline-variant/10">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-outline/40" size={18} />
              <input 
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder={activeTab === 'area' ? "搜索区域名称..." : "搜索订单编号..."}
                className="w-full h-[40px] bg-surface-container-low border border-outline-variant/30 rounded-xl py-2 pl-10 pr-4 text-[14px] text-on-surface placeholder:text-outline/30 transition-all font-normal hover:border-primary-container/50 hover:shadow-[0_0_15px_rgba(22,93,255,0.15)] focus:outline-none focus:border-primary-container focus:shadow-[0_0_20px_rgba(22,93,255,0.3)]"
              />
            </div>
          </div>

          <div className="flex-1 overflow-y-auto p-4 space-y-3 custom-scrollbar">
            {activeTab === 'area' ? (
              areaList.map(area => (
                <div 
                  key={area.id} 
                  onClick={() => {
                    setMapCenter(area.position);
                    setSelectedId(area.id);
                  }}
                  className={`transition-all group cursor-pointer relative border rounded-xl p-4 space-y-3 ${
                    selectedId === area.id 
                      ? 'bg-primary-container/10 border-primary-container shadow-[inset_0_0_0_1px_var(--primary-container)]' 
                      : 'bg-surface-container-low border-outline-variant/30 hover:bg-primary-container/10 hover:border-primary-container hover:shadow-[inset_0_0_0_1px_var(--primary-container)]'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-[14px] font-semibold text-on-surface truncate pr-2">{area.name}</span>
                    <span className={`shrink-0 px-1.5 py-0.5 rounded text-[10px] font-medium border ${area.type === '起点' ? 'bg-error/10 text-error border-error/20' : 'bg-primary-container/10 text-primary-container border-primary-container/20'}`}>
                      {area.type}
                    </span>
                  </div>
                  <div className="grid grid-cols-1 gap-1">
                    <div className="flex items-center gap-2 text-[12px] text-outline font-normal">
                      <Layers size={12} className="opacity-50" />
                      <span>面积：{area.area}</span>
                    </div>
                    <div className="flex items-center gap-2 text-[12px] text-outline font-normal">
                      <Compass size={12} className="opacity-50" />
                      <span>半径：{area.radius}</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 pt-1">
                    <button className="p-1.5 bg-surface-container-high hover:bg-surface-container-highest rounded-lg text-outline hover:text-on-surface transition-all border border-outline-variant/10">
                      <EyeOff size={14} />
                    </button>
                    <button className="p-1.5 bg-surface-container-high hover:bg-surface-container-highest rounded-lg text-outline hover:text-on-surface transition-all border border-outline-variant/10">
                      <Edit3 size={14} />
                    </button>
                    <button className="p-1.5 bg-error/10 hover:bg-error/20 rounded-lg text-error transition-all border border-error/20">
                      <Trash2 size={14} />
                    </button>
                  </div>
                </div>
              ))
            ) : (
              orderList.map(order => (
                <div 
                  key={order.id} 
                  onClick={() => {
                    setMapCenter(order.path[0]);
                    setSelectedId(order.id);
                  }}
                  className={`transition-all group cursor-pointer relative border rounded-xl p-4 space-y-2.5 ${
                    selectedId === order.id 
                      ? 'bg-primary-container/10 border-primary-container shadow-[inset_0_0_0_1px_var(--primary-container)]' 
                      : 'bg-surface-container-low border-outline-variant/30 hover:bg-primary-container/10 hover:border-primary-container hover:shadow-[inset_0_0_0_1px_var(--primary-container)]'
                  }`}
                >
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-[14px] font-bold text-on-surface tracking-tight truncate">{order.id}</span>
                    <span className="shrink-0 px-1.5 py-0.5 rounded bg-green-400/10 text-green-500 border border-green-400/20 text-[10px] font-medium">
                      {order.status}
                    </span>
                  </div>
                  
                  <div className="space-y-2">
                    <div className="flex items-center gap-2 text-[13px] text-on-surface font-medium">
                      <Navigation size={12} className="text-primary-container" />
                      <span className="truncate">{order.origin} → {order.destination}</span>
                    </div>
                    <div className="grid grid-cols-1 gap-1 text-[11px] text-outline font-normal">
                      <div className="flex items-center gap-2">
                        <Box size={11} className="opacity-50" />
                        <span className="truncate">{order.cargo} ({order.cargoCount})</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Layers size={11} className="opacity-50" />
                        <span className="truncate">重量：{order.weight} | 箱数：{order.boxCount}</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 pt-1">
                    <button className="p-1.5 bg-surface-container-high hover:bg-surface-container-highest rounded-lg text-outline hover:text-on-surface transition-all border border-outline-variant/10">
                      <Eye size={14} />
                    </button>
                    <button className="p-1.5 bg-surface-container-high hover:bg-surface-container-highest rounded-lg text-outline hover:text-on-surface transition-all border border-outline-variant/10">
                      <Edit3 size={14} />
                    </button>
                    <button className="p-1.5 bg-error/10 hover:bg-error/20 rounded-lg text-error transition-all border border-error/20">
                      <Trash2 size={14} />
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Map Area */}
        <div className="flex-1 bg-surface-container border border-outline-variant/10 rounded-2xl relative overflow-hidden shadow-2xl group/map">
          <MapContainer 
            center={mapCenter} 
            zoom={11} 
            zoomControl={false}
            style={{ height: '100%', width: '100%', background: 'var(--surface)' }}
          >
            <TileLayer
              url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png"
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'
            />
            <MapViewHandler center={mapCenter} />
            
            {/* Polygon Area */}
            <Polygon 
              positions={polygonCoords} 
              pathOptions={{ 
                fillColor: '#22c55e', 
                fillOpacity: 0.2, 
                color: '#22c55e', 
                weight: 2,
                dashArray: '5, 5'
              }} 
            />

            {/* Markers */}
            {areaList.map(area => (
              <Marker 
                key={area.id} 
                position={area.position} 
                icon={area.type === '起点' ? originIcon : destinationIcon}
              >
                <Popup className="custom-popup">
                  <div className="p-1">
                    <p className="font-bold text-primary-container">{area.name}</p>
                    <p className="text-xs text-gray-500">{area.type}</p>
                  </div>
                </Popup>
              </Marker>
            ))}
          </MapContainer>

          {/* Map Controls - Right Side */}
          <div className="absolute right-4 top-1/2 -translate-y-1/2 flex flex-col gap-2 z-[1000]">
            <div className="flex flex-col bg-surface/80 backdrop-blur-md border border-outline-variant/10 rounded-xl overflow-hidden shadow-xl">
              <button className="p-2.5 text-outline hover:text-on-surface hover:bg-surface-container-high transition-all border-b border-outline-variant/10"><Compass size={20} /></button>
            </div>
            <div className="flex flex-col bg-surface/80 backdrop-blur-md border border-outline-variant/10 rounded-xl overflow-hidden shadow-xl">
              <button className="p-2.5 text-outline hover:text-on-surface hover:bg-surface-container-high transition-all border-b border-outline-variant/10"><Maximize2 size={20} /></button>
              <button className="p-2.5 text-outline hover:text-on-surface hover:bg-surface-container-high transition-all"><Maximize2 size={20} className="rotate-45" /></button>
            </div>
            <div className="flex flex-col bg-surface/80 backdrop-blur-md border border-outline-variant/10 rounded-xl overflow-hidden shadow-xl">
              <button className="p-2.5 text-outline hover:text-on-surface hover:bg-surface-container-high transition-all border-b border-outline-variant/10"><MousePointer2 size={20} /></button>
              <button className="p-2.5 text-outline hover:text-on-surface hover:bg-surface-container-high transition-all border-b border-outline-variant/10"><Layers size={20} /></button>
              <button className="p-2.5 text-outline hover:text-on-surface hover:bg-surface-container-high transition-all border-b border-outline-variant/10"><Navigation size={20} /></button>
              <button className="p-2.5 text-outline hover:text-on-surface hover:bg-surface-container-high transition-all"><Box size={20} /></button>
            </div>
          </div>

          {/* Map Info Overlay - Bottom Left */}
          <div className="absolute bottom-4 left-4 bg-surface/80 backdrop-blur-md border border-outline-variant/10 rounded-xl p-3 shadow-xl z-[1000] flex items-center gap-4">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-green-500/50 border border-green-500" />
              <span className="text-[12px] text-on-surface font-medium">规划区域</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-error" />
              <span className="text-[12px] text-on-surface font-medium">起点</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-primary-container" />
              <span className="text-[12px] text-on-surface font-medium">终点</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
