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
  EyeOff,
  ChevronLeft,
  Minus
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { MapContainer, TileLayer, Polygon, useMap } from 'react-leaflet';

const INITIAL_AIRSPACE = [
  { 
    id: '1', 
    name: '深莞跨城空域', 
    status: '启用中', 
    coordsCount: 16, 
    position: [22.75, 113.85],
    drawMethod: '多边形（单击逐点）',
    coords: [
      { id: '1', value: '113.602621, 22.854448' },
      { id: '2', value: '113.602621, 22.900208' },
      { id: '3', value: '113.696437, 22.914732' },
      { id: '4', value: '113.680669, 22.859533' },
      { id: '5', value: '113.994439, 22.757792' },
    ]
  },
];

const INITIAL_NO_FLY = [
  { 
    id: 'NFZ-001', 
    name: '机场核心禁飞区', 
    status: '生效中', 
    coordsCount: 8, 
    position: [22.62, 113.81],
    drawMethod: '多边形（单击逐点）',
    coords: [
      { id: '1', value: '113.81, 22.62' },
    ]
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
  { id: 'regular', label: '常飞空域' },
  { id: 'nofly', label: '禁飞区' },
];

export default function AirspacePlanning() {
  const [activeTab, setActiveTab] = useState('regular');
  const [searchQuery, setSearchQuery] = useState('');
  const [mapCenter, setMapCenter] = useState([22.75, 113.85]);
  const [selectedId, setSelectedId] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [airspaceList, setAirspaceList] = useState(INITIAL_AIRSPACE);
  const [noFlyZones, setNoFlyZones] = useState(INITIAL_NO_FLY);

  // Form states
  const [formName, setFormName] = useState('');
  const [formDrawMethod, setFormDrawMethod] = useState('多边形（单击逐点）');
  const [formStatus, setFormStatus] = useState('启用中');
  const [formCoords, setFormCoords] = useState([]);
  const [errors, setErrors] = useState({});

  const currentList = activeTab === 'regular' ? airspaceList : noFlyZones;

  const handleEdit = (e, item) => {
    e.stopPropagation();
    setEditingItem(item);
    setFormName(item.name);
    setFormDrawMethod(item.drawMethod || '多边形（单击逐点）');
    setFormStatus(item.status);
    setFormCoords(item.coords || []);
    setErrors({});
    setIsEditing(true);
  };

  const handleAdd = () => {
    setEditingItem(null);
    setFormName('');
    setFormDrawMethod('多边形（单击逐点）');
    setFormStatus('启用中');
    setFormCoords([
      { id: '1', value: '113.602621, 22.854448' },
      { id: '2', value: '113.602621, 22.900208' },
      { id: '3', value: '113.696437, 22.914732' },
      { id: '4', value: '113.680669, 22.859533' },
      { id: '5', value: '113.994439, 22.757792' },
    ]);
    setErrors({});
    setIsEditing(true);
  };

  const handleSave = () => {
    if (!formName.trim()) {
      setErrors({ name: '名称不能为空' });
      return;
    }

    const data = {
      name: formName,
      drawMethod: formDrawMethod,
      status: formStatus,
      coords: formCoords,
    };

    if (editingItem) {
      // Update existing
      if (activeTab === 'regular') {
        setAirspaceList(airspaceList.map(item => item.id === editingItem.id ? { ...item, ...data, coordsCount: data.coords.length } : item));
      } else {
        setNoFlyZones(noFlyZones.map(item => item.id === editingItem.id ? { ...item, ...data, coordsCount: data.coords.length } : item));
      }
    } else {
      // Add new
      const newItem = {
        ...data,
        id: Date.now().toString(),
        coordsCount: data.coords.length,
        position: [22.75, 113.85], // Default position
      };
      if (activeTab === 'regular') {
        setAirspaceList([newItem, ...airspaceList]);
      } else {
        setNoFlyZones([newItem, ...noFlyZones]);
      }
    }
    setIsEditing(false);
  };

  const handleAddCoord = () => {
    setFormCoords([...formCoords, { id: Date.now().toString(), value: '' }]);
  };

  const handleRemoveCoord = (id) => {
    setFormCoords(formCoords.filter(c => c.id !== id));
  };

  const handleCoordChange = (id, value) => {
    setFormCoords(formCoords.map(c => c.id === id ? { ...c, value } : c));
  };

  const handleClearCoords = () => {
    setFormCoords([]);
  };

  const handleDelete = (e, id) => {
    e.stopPropagation();
    if (activeTab === 'regular') {
      setAirspaceList(airspaceList.filter(item => item.id !== id));
    } else {
      setNoFlyZones(noFlyZones.filter(item => item.id !== id));
    }
    if (selectedId === id) setSelectedId(null);
  };

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
        <div className="w-[280px] bg-surface-container backdrop-blur-xl border border-outline-variant/20 rounded-2xl flex flex-col overflow-hidden shadow-2xl">
          <AnimatePresence mode="wait">
            {!isEditing ? (
              <motion.div
                key="list"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="flex flex-col h-full"
              >
                <div className="p-4 border-b border-outline-variant/10 flex items-center justify-between">
                  <h3 className="text-[16px] font-semibold text-on-surface">
                    {activeTab === 'regular' ? '常飞空域' : '禁飞区'}
                  </h3>
                  <button 
                    onClick={handleAdd}
                    className="p-1.5 bg-primary-container hover:bg-primary-container/90 text-white rounded-lg transition-all shadow-lg shadow-primary-container/20"
                  >
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
                      placeholder="按名称搜索 (模糊/精确)"
                      className="w-full h-[40px] bg-surface-container-low border border-outline-variant/30 rounded-xl py-2 pl-10 pr-4 text-[14px] text-on-surface placeholder:text-outline/30 transition-all font-normal hover:border-primary-container/50 hover:shadow-[0_0_15px_rgba(22,93,255,0.15)] focus:outline-none focus:border-primary-container focus:shadow-[0_0_20px_rgba(22,93,255,0.3)]"
                    />
                  </div>
                </div>

                <div className="flex-1 overflow-y-auto p-4 space-y-3 custom-scrollbar">
                  {currentList.map(item => (
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
                            <Layers size={11} className="opacity-50" />
                            <span>坐标点：{item.coordsCount}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <Navigation size={11} className="opacity-50" />
                            <span className="truncate">{item.position[0].toFixed(4)}, {item.position[1].toFixed(4)}</span>
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center gap-2 pt-1">
                        <button className="p-1.5 bg-surface-container-high hover:bg-surface-container-highest rounded-lg text-outline hover:text-on-surface transition-all border border-outline-variant/10">
                          <EyeOff size={14} />
                        </button>
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
                  ))}
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
                    onClick={() => setIsEditing(false)}
                    className="p-1.5 hover:bg-surface-container-highest rounded-lg text-outline hover:text-on-surface transition-all"
                  >
                    <ChevronLeft size={20} />
                  </button>
                  <h3 className="text-[16px] font-semibold text-on-surface">
                    {editingItem ? '编辑空域' : '新增空域'}
                  </h3>
                </div>

                <div className="flex-1 overflow-y-auto p-4 space-y-5 custom-scrollbar">
                  {/* Name */}
                  <div className="space-y-1.5">
                    <label className="block text-[13px] font-medium text-outline ml-1">名称</label>
                    <input
                      type="text"
                      value={formName}
                      onChange={(e) => {
                        setFormName(e.target.value);
                        if (errors.name) setErrors({});
                      }}
                      placeholder="请输入空域名称"
                      className={`w-full h-[36px] px-3 rounded-lg border ${
                        errors.name ? 'border-error/50' : 'border-outline-variant/30'
                      } bg-surface-container-low text-[13px] text-on-surface placeholder:text-outline/30 transition-all font-normal hover:border-primary-container/50 focus:outline-none focus:border-primary-container`}
                    />
                    {errors.name && <p className="text-[11px] text-error mt-1 ml-1">{errors.name}</p>}
                  </div>

                  {/* Draw Method */}
                  <div className="space-y-1.5">
                    <label className="block text-[13px] font-medium text-outline ml-1">绘制方式</label>
                    <select
                      value={formDrawMethod}
                      onChange={(e) => setFormDrawMethod(e.target.value)}
                      className="w-full h-[36px] px-3 rounded-lg border border-outline-variant/30 text-[13px] text-on-surface bg-surface-container-low transition-all appearance-none cursor-pointer font-normal hover:border-primary-container/50 focus:outline-none focus:border-primary-container"
                      style={{
                        backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke='%238d90a2' stroke-width='2'%3E%3Cpath stroke-linecap='round' stroke-linejoin='round' d='M19 9l-7 7-7-7'/%3E%3C/svg%3E")`,
                        backgroundRepeat: 'no-repeat',
                        backgroundPosition: 'right 10px center',
                        backgroundSize: '14px',
                      }}
                    >
                      <option value="多边形（单击逐点）">多边形（单击逐点）</option>
                      <option value="圆形（中心点+半径）">圆形（中心点+半径）</option>
                    </select>
                  </div>

                  {/* Status */}
                  <div className="space-y-1.5">
                    <label className="block text-[13px] font-medium text-outline ml-1">状态</label>
                    <select
                      value={formStatus}
                      onChange={(e) => setFormStatus(e.target.value)}
                      className="w-full h-[36px] px-3 rounded-lg border border-outline-variant/30 text-[13px] text-on-surface bg-surface-container-low transition-all appearance-none cursor-pointer font-normal hover:border-primary-container/50 focus:outline-none focus:border-primary-container"
                      style={{
                        backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke='%238d90a2' stroke-width='2'%3E%3Cpath stroke-linecap='round' stroke-linejoin='round' d='M19 9l-7 7-7-7'/%3E%3C/svg%3E")`,
                        backgroundRepeat: 'no-repeat',
                        backgroundPosition: 'right 10px center',
                        backgroundSize: '14px',
                      }}
                    >
                      <option value="启用中">启用中</option>
                      <option value="禁用中">禁用中</option>
                    </select>
                  </div>

                  {/* Coordinates Section */}
                  <div className="space-y-3 p-3 bg-surface-container-high rounded-xl border border-outline-variant/10">
                    <div className="flex items-center justify-between">
                      <span className="text-[13px] font-medium text-on-surface">经纬度坐标</span>
                      <div className="flex items-center gap-1.5">
                        <button 
                          onClick={handleAddCoord}
                          className="p-1 bg-surface-container-highest hover:bg-primary-container/20 text-outline hover:text-primary-container rounded-md transition-all border border-outline-variant/10"
                        >
                          <Plus size={14} />
                        </button>
                        <button 
                          onClick={handleClearCoords}
                          className="px-1.5 py-0.5 bg-error/10 hover:bg-error/20 rounded-md text-[11px] text-error transition-all border border-error/20"
                        >
                          清空
                        </button>
                      </div>
                    </div>

                    <div className="space-y-2 max-h-[180px] overflow-y-auto pr-1 custom-scrollbar">
                      {formCoords.map((coord) => (
                        <div key={coord.id} className="flex items-center gap-1.5">
                          <input
                            type="text"
                            value={coord.value}
                            onChange={(e) => handleCoordChange(coord.id, e.target.value)}
                            className="flex-1 h-[32px] bg-surface-container-low border border-outline-variant/30 rounded-lg px-2 text-[12px] text-on-surface transition-all hover:border-primary-container/50 focus:outline-none focus:border-primary-container"
                          />
                          <button 
                            onClick={() => handleRemoveCoord(coord.id)}
                            className="p-1 bg-error/10 hover:bg-error/20 rounded-md text-error transition-all border border-error/20"
                          >
                            <Minus size={14} />
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="p-4 border-t border-outline-variant/10 flex gap-2 bg-surface-container-high">
                  <button
                    onClick={() => setIsEditing(false)}
                    className="flex-1 h-[36px] rounded-lg border border-outline-variant/30 text-outline text-[13px] font-medium hover:text-on-surface hover:bg-surface-container-highest transition-all"
                  >
                    取消
                  </button>
                  <button
                    onClick={handleSave}
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
            
            {/* Polygon Area */}
            <Polygon 
              positions={polygonCoords} 
              pathOptions={{ 
                fillColor: activeTab === 'nofly' ? '#ef4444' : '#22c55e', 
                fillOpacity: 0.2, 
                color: activeTab === 'nofly' ? '#ef4444' : '#22c55e', 
                weight: 2,
                dashArray: '5, 5'
              }} 
            />
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
              <div className={`w-3 h-3 rounded-full ${activeTab === 'nofly' ? 'bg-error/50 border border-error' : 'bg-green-500/50 border border-green-500'}`} />
              <span className="text-[12px] text-on-surface font-medium">{activeTab === 'nofly' ? '禁飞区域' : '常飞空域'}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
