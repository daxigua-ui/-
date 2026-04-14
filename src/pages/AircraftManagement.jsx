import { useState, useMemo } from 'react';
import { Search, Plus, Upload, Edit3, Trash2, ChevronRight, Plane, ChevronLeft } from 'lucide-react';
import { motion } from 'motion/react';
import NewAircraftModal from '../components/NewAircraftModal';
import NewMaterialModal from '../components/NewMaterialModal';

const tabs = [
  { id: 'aircraft', label: '飞机管理' },
  { id: 'material', label: '物料管理' },
  { id: 'container', label: '装载箱管理' },
  { id: 'station', label: '站点管理' },
];

const BASE_AIRCRAFT = [
  { id: 'UAV-007', name: '丰舟90', type: '复合翼', manufacturer: '丰翼无人机', payload: '20kg', rangeEmpty: '150km', rangeFull: '70km', speed: '30m/s', createdAt: '2026-03-23 17:18:59' },
  { id: 'UAV-006', name: '美团MT-5', type: '多旋翼', manufacturer: '大疆创新', payload: '5kg', rangeEmpty: '15km', rangeFull: '12km', speed: '10m/s', createdAt: '2026-03-23 17:10:38' },
  { id: 'UAV-001', name: 'DJI Matrice 300 RTK', type: '多旋翼', manufacturer: '大疆创新', payload: '30kg', rangeEmpty: '45km', rangeFull: '20km', speed: '15m/s', createdAt: '2026-03-23 16:29:12' },
  { id: 'UAV-002', name: '顺丰方舟FH-98', type: '固定翼', manufacturer: '顺丰科技', payload: '60kg', rangeEmpty: '120km', rangeFull: '65km', speed: '28m/s', createdAt: '2026-03-23 16:29:12' },
  { id: 'UAV-003', name: '美团翼龙MX-01', type: '多旋翼', manufacturer: '美团无人机', payload: '25kg', rangeEmpty: '36km', rangeFull: '18km', speed: '14m/s', createdAt: '2026-03-23 16:29:12' },
  { id: 'UAV-004', name: '中通云雀ZY-100', type: '复合翼', manufacturer: '中通快递', payload: '45kg', rangeEmpty: '75km', rangeFull: '40km', speed: '20m/s', createdAt: '2026-03-23 16:29:12' },
  { id: 'UAV-005', name: '亿航216-S', type: '多旋翼', manufacturer: '亿航智能', payload: '80kg', rangeEmpty: '55km', rangeFull: '32km', speed: '16m/s', createdAt: '2026-03-23 16:29:12' },
];

// Generate more data for pagination
const INITIAL_AIRCRAFT = Array.from({ length: 25 }).map((_, i) => {
  const base = BASE_AIRCRAFT[i % BASE_AIRCRAFT.length];
  return {
    ...base,
    id: `${base.id.split('-')[0]}-${(i + 1).toString().padStart(3, '0')}`,
    name: i < BASE_AIRCRAFT.length ? base.name : `${base.name} (副本 ${Math.floor(i / BASE_AIRCRAFT.length)})`,
  };
});

const typeColors = {
  '复合翼': 'text-cyan-400 bg-cyan-400/10 border-cyan-400/20',
  '多旋翼': 'text-purple-400 bg-purple-400/10 border-purple-400/20',
  '固定翼': 'text-amber-400 bg-amber-400/10 border-amber-400/20',
};

const Tooltip = ({ children, text }) => (
  <div className="relative group/tooltip flex items-center justify-center">
    {children}
    <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-2 py-1 bg-surface-container-highest text-on-surface text-[10px] rounded opacity-0 group-hover/tooltip:opacity-100 transition-all duration-200 pointer-events-none whitespace-nowrap z-[60] border border-outline-variant/20 shadow-2xl scale-95 group-hover/tooltip:scale-100">
      {text}
      <div className="absolute top-full left-1/2 -translate-x-1/2 border-4 border-transparent border-t-surface-container-highest"></div>
    </div>
  </div>
);

const INITIAL_MATERIALS = [
  { id: 'MAT-001', name: '标准快递箱 (小)', category: '快递包裹', unit: '个', weight: '4kg', volume: '10L', createdAt: '2026-03-23 17:22:07' },
  { id: 'MAT-002', name: '标准快递箱 (中)', category: '快递包裹', unit: '个', weight: '9kg', volume: '20L', createdAt: '2026-03-23 17:22:47' },
  { id: 'MAT-003', name: '标准快递箱 (大)', category: '快递包裹', unit: '个', weight: '50kg', volume: '120L', createdAt: '2026-03-23 17:23:18' },
  { id: 'MAT-004', name: '医疗药品', category: '医药', unit: '个', weight: '8kg', volume: '15L', createdAt: '2026-03-23 17:23:54' },
  { id: 'MAT-005', name: '餐饮外卖', category: '餐饮', unit: '个', weight: '-', volume: '-', createdAt: '-' },
];

const categoryColors = {
  '快递包裹': 'text-blue-500 bg-blue-500/10 border-blue-500/20',
  '医药': 'text-green-500 bg-green-500/10 border-green-500/20',
  '餐饮': 'text-orange-500 bg-orange-500/10 border-orange-500/20',
};

export default function AircraftManagement() {
  const [activeTab, setActiveTab] = useState('aircraft');
  const [searchQuery, setSearchQuery] = useState('');
  const [aircraftList, setAircraftList] = useState(INITIAL_AIRCRAFT);
  const [materialList, setMaterialList] = useState(INITIAL_MATERIALS);
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 8;

  const filteredAircraft = useMemo(() => {
    return aircraftList.filter(item => 
      item.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.manufacturer.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [aircraftList, searchQuery]);

  const filteredMaterials = useMemo(() => {
    return materialList.filter(item => 
      item.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.category.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [materialList, searchQuery]);

  const filteredList = activeTab === 'aircraft' ? filteredAircraft : filteredMaterials;

  const paginatedList = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return filteredList.slice(start, start + pageSize);
  }, [filteredList, currentPage]);

  const totalPages = Math.ceil(filteredList.length / pageSize);

  const [prevSearchQuery, setPrevSearchQuery] = useState(searchQuery);
  const [prevActiveTab, setPrevActiveTab] = useState(activeTab);

  if (searchQuery !== prevSearchQuery || activeTab !== prevActiveTab) {
    setPrevSearchQuery(searchQuery);
    setPrevActiveTab(activeTab);
    setCurrentPage(1);
  }

  const handleSaveAircraft = (aircraft) => {
    if (editingAircraft) {
      setAircraftList(prev => prev.map(item => item.id === editingAircraft.id ? aircraft : item));
    } else {
      setAircraftList(prev => [aircraft, ...prev]);
    }
    setIsModalOpen(false);
    setEditingAircraft(null);
  };

  const handleSaveMaterial = (material) => {
    if (editingMaterial) {
      setMaterialList(prev => prev.map(item => item.id === editingMaterial.id ? material : item));
    } else {
      setMaterialList(prev => [material, ...prev]);
    }
    setIsMaterialModalOpen(false);
    setEditingMaterial(null);
  };

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingAircraft, setEditingAircraft] = useState(null);

  const [isMaterialModalOpen, setIsMaterialModalOpen] = useState(false);
  const [editingMaterial, setEditingMaterial] = useState(null);

  const handleEdit = (aircraft) => {
    setEditingAircraft(aircraft);
    setIsModalOpen(true);
  };

  const handleEditMaterial = (material) => {
    setEditingMaterial(material);
    setIsMaterialModalOpen(true);
  };

  const handleDelete = (id) => {
    const confirmed = window.confirm(`确定要删除机型 ${id} 吗？`);
    if (confirmed) {
      setAircraftList(prev => prev.filter(item => item.id !== id));
    }
  };

  const handleDeleteMaterial = (id) => {
    const confirmed = window.confirm(`确定要删除物料 ${id} 吗？`);
    if (confirmed) {
      setMaterialList(prev => prev.filter(item => item.id !== id));
    }
  };

  const renderAircraftTable = () => (
    <div className="grid-24 animate-in fade-in slide-in-from-bottom-4 duration-500">
      {/* Header */}
      <div className="col-span-24 flex flex-col md:flex-row md:items-center justify-between gap-4 mt-2 mb-2">
        <div className="space-y-1">
          <h2 className="text-[20px] font-semibold text-on-surface tracking-tight">飞机管理</h2>
        </div>
        <div className="flex items-center gap-3">
          <button className="bg-surface-container-high hover:bg-surface-container-highest text-on-surface px-4 py-2 rounded-xl text-[14px] font-medium transition-all border border-outline-variant/10 flex items-center gap-2">
            <Upload size={16} />
            批量导入机型
          </button>
          <button 
            onClick={() => {
              setEditingAircraft(null);
              setIsModalOpen(true);
            }}
            className="bg-gradient-to-br from-primary-container to-[#004fe5] hover:opacity-90 text-white px-4 py-2 rounded-xl text-[14px] font-medium shadow-lg shadow-primary-container/20 transition-all flex items-center gap-2"
          >
            <Plus size={16} />
            新增机型
          </button>
        </div>
      </div>

      {/* Search Area */}
      <div className="col-span-24 bg-surface-container backdrop-blur-xl border border-outline-variant/10 rounded-2xl p-4 flex items-center gap-4 mb-2">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-outline/40" size={18} />
          <input 
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="搜索机型编号/名称/制造商"
            className="w-full h-[40px] bg-surface-container-low border border-outline-variant/10 rounded-xl py-2 pl-10 pr-4 text-[14px] text-on-surface placeholder:text-outline/30 transition-all font-normal hover:border-primary-container/50 hover:shadow-[0_0_15px_rgba(22,93,255,0.15)] focus:outline-none focus:border-primary-container focus:shadow-[0_0_20px_rgba(22,93,255,0.3)]"
          />
        </div>
        <button 
          className="bg-primary-container hover:bg-primary-container/90 text-white px-6 h-[40px] rounded-xl text-[14px] font-medium transition-all"
        >
          查询
        </button>
      </div>

      {/* Data Table */}
      <div className="col-span-24 bg-surface-container backdrop-blur-xl border border-outline-variant/10 rounded-2xl overflow-hidden shadow-2xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-surface-container-high border-b border-outline-variant/10">
                <th className="px-6 py-3 text-[14px] font-medium text-outline uppercase tracking-wider whitespace-nowrap">机型编号</th>
                <th className="px-6 py-3 text-[14px] font-medium text-outline uppercase tracking-wider whitespace-nowrap">机型名称</th>
                <th className="px-6 py-3 text-[14px] font-medium text-outline uppercase tracking-wider whitespace-nowrap">类型</th>
                <th className="px-6 py-3 text-[14px] font-medium text-outline uppercase tracking-wider whitespace-nowrap">制造商</th>
                <th className="px-6 py-3 text-[14px] font-medium text-outline uppercase tracking-wider whitespace-nowrap">最大载重</th>
                <th className="px-6 py-3 text-[14px] font-medium text-outline uppercase tracking-wider whitespace-nowrap">空载航程</th>
                <th className="px-6 py-3 text-[14px] font-medium text-outline uppercase tracking-wider whitespace-nowrap">满载航程</th>
                <th className="px-6 py-3 text-[14px] font-medium text-outline uppercase tracking-wider whitespace-nowrap">巡航速度</th>
                <th className="px-6 py-3 text-[14px] font-medium text-outline uppercase tracking-wider whitespace-nowrap">创建时间</th>
                <th className="px-6 py-3 text-[14px] font-medium text-outline uppercase tracking-wider text-center whitespace-nowrap">操作</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-outline-variant/10">
              {paginatedList.length > 0 ? (
                paginatedList.map((item) => (
                  <tr 
                    key={item.id} 
                    className="transition-all group cursor-pointer relative border-y border-transparent hover:bg-primary-container/10 hover:border-primary-container hover:shadow-[inset_0_0_0_1px_var(--primary-container)]"
                  >
                    <td className="px-6 py-2.5 text-[14px] font-mono text-primary-container whitespace-nowrap">{item.id}</td>
                    <td className="px-6 py-2.5 text-[14px] font-medium text-on-surface whitespace-nowrap">{item.name}</td>
                    <td className="px-6 py-2.5 whitespace-nowrap">
                      <span className={`border px-2 py-0.5 rounded text-[12px] font-normal ${typeColors[item.type] || 'text-outline bg-surface-container-high border-outline-variant/20'}`}>
                        {item.type}
                      </span>
                    </td>
                    <td className="px-6 py-2.5 text-[14px] text-outline whitespace-nowrap font-normal">{item.manufacturer}</td>
                    <td className="px-6 py-2.5 text-[14px] text-on-surface font-normal whitespace-nowrap">{item.payload}</td>
                    <td className="px-6 py-2.5 text-[14px] text-on-surface font-normal whitespace-nowrap">{item.rangeEmpty}</td>
                    <td className="px-6 py-2.5 text-[14px] text-on-surface font-normal whitespace-nowrap">{item.rangeFull}</td>
                    <td className="px-6 py-2.5 text-[14px] text-on-surface font-normal whitespace-nowrap">{item.speed}</td>
                    <td className="px-6 py-2.5 text-[12px] text-outline/60 whitespace-nowrap font-normal">{item.createdAt}</td>
                    <td className="px-6 py-2.5 whitespace-nowrap">
                      <div className="flex items-center justify-center gap-3">
                        <Tooltip text="进入飞机列表">
                          <button 
                            onClick={(e) => {
                              e.stopPropagation();
                              alert(`正在进入 ${item.name} 的飞机列表...`);
                            }}
                            className="p-1.5 bg-surface-container-high hover:bg-primary-container/20 text-outline hover:text-primary-container rounded-lg transition-all border border-outline-variant/10 hover:border-primary-container/30"
                          >
                            <ChevronRight size={16} />
                          </button>
                        </Tooltip>
                        <Tooltip text="编辑">
                          <button 
                            onClick={(e) => {
                              e.stopPropagation();
                              handleEdit(item);
                            }}
                            className="p-1.5 bg-surface-container-high hover:bg-primary-container/20 text-outline hover:text-primary-container rounded-lg transition-all border border-outline-variant/10 hover:border-primary-container/30"
                          >
                            <Edit3 size={16} />
                          </button>
                        </Tooltip>
                        <Tooltip text="删除">
                          <button 
                            onClick={(e) => {
                              e.stopPropagation();
                              handleDelete(item.id);
                            }}
                            className="p-1.5 bg-surface-container-high hover:bg-error-container/20 text-outline hover:text-error rounded-lg transition-all border border-outline-variant/10 hover:border-error/30"
                          >
                            <Trash2 size={16} />
                          </button>
                        </Tooltip>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={10} className="px-6 py-12 text-center text-outline/40">
                    <div className="flex flex-col items-center gap-2">
                      <Search size={48} className="opacity-20" />
                      <p className="text-[14px] font-normal">未找到匹配的机型数据</p>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="px-6 py-4 border-t border-outline-variant/10 flex items-center justify-between bg-surface-container-high">
            <p className="text-[12px] text-outline/60 font-normal">
              显示 {((currentPage - 1) * pageSize) + 1} 到 {Math.min(currentPage * pageSize, filteredList.length)} 条，共 {filteredList.length} 条
            </p>
            <div className="flex items-center gap-2">
              <button 
                disabled={currentPage === 1}
                onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                className="p-1.5 rounded-lg border border-outline-variant/10 text-outline hover:text-on-surface hover:bg-surface-container-highest disabled:opacity-30 disabled:pointer-events-none transition-all"
              >
                <ChevronLeft size={16} />
              </button>
              {Array.from({ length: totalPages }).map((_, i) => (
                <button
                  key={i + 1}
                  onClick={() => setCurrentPage(i + 1)}
                  className={`w-8 h-8 rounded-lg text-[12px] font-medium transition-all ${
                    currentPage === i + 1 
                      ? 'bg-primary-container text-white shadow-lg shadow-primary-container/20' 
                      : 'text-outline hover:text-on-surface hover:bg-surface-container-highest border border-outline-variant/10'
                  }`}
                >
                  {i + 1}
                </button>
              ))}
              <button 
                disabled={currentPage === totalPages}
                onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                className="p-1.5 rounded-lg border border-outline-variant/10 text-outline hover:text-on-surface hover:bg-surface-container-highest disabled:opacity-30 disabled:pointer-events-none transition-all"
              >
                <ChevronRight size={16} />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );

  const renderMaterialTable = () => (
    <div className="grid-24 animate-in fade-in slide-in-from-bottom-4 duration-500">
      {/* Header */}
      <div className="col-span-24 flex flex-col md:flex-row md:items-center justify-between gap-4 mt-2 mb-2">
        <div className="space-y-1">
          <h2 className="text-[20px] font-semibold text-on-surface tracking-tight">物料管理</h2>
        </div>
        <div className="flex items-center gap-3">
          <button className="bg-surface-container-high hover:bg-surface-container-highest text-on-surface px-4 py-2 rounded-xl text-[14px] font-medium transition-all border border-outline-variant/10 flex items-center gap-2">
            <Upload size={16} />
            批量导入物料
          </button>
          <button 
            onClick={() => {
              setEditingMaterial(null);
              setIsMaterialModalOpen(true);
            }}
            className="bg-gradient-to-br from-primary-container to-[#004fe5] hover:opacity-90 text-white px-4 py-2 rounded-xl text-[14px] font-medium shadow-lg shadow-primary-container/20 transition-all flex items-center gap-2"
          >
            <Plus size={16} />
            新增物料
          </button>
        </div>
      </div>

      {/* Search Area */}
      <div className="col-span-24 bg-surface-container backdrop-blur-xl border border-outline-variant/10 rounded-2xl p-4 flex items-center gap-4 mb-2">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-outline/40" size={18} />
          <input 
            type="text" 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="搜索物料编号/名称/分类"
            className="w-full h-[40px] bg-surface-container-low border border-outline-variant/10 rounded-xl py-2 pl-10 pr-4 text-[14px] text-on-surface placeholder:text-outline/30 transition-all font-normal hover:border-primary-container/50 hover:shadow-[0_0_15px_rgba(22,93,255,0.15)] focus:outline-none focus:border-primary-container focus:shadow-[0_0_20px_rgba(22,93,255,0.3)]"
          />
        </div>
        <button 
          className="bg-primary-container hover:bg-primary-container/90 text-white px-6 h-[40px] rounded-xl text-[14px] font-medium transition-all"
        >
          查询
        </button>
      </div>

      {/* Data Table */}
      <div className="col-span-24 bg-surface-container backdrop-blur-xl border border-outline-variant/10 rounded-2xl overflow-hidden shadow-2xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-surface-container-high border-b border-outline-variant/10">
                <th className="px-6 py-3 text-[14px] font-medium text-outline uppercase tracking-wider whitespace-nowrap">物料名称</th>
                <th className="px-6 py-3 text-[14px] font-medium text-outline uppercase tracking-wider whitespace-nowrap">编号</th>
                <th className="px-6 py-3 text-[14px] font-medium text-outline uppercase tracking-wider whitespace-nowrap">类别</th>
                <th className="px-6 py-3 text-[14px] font-medium text-outline uppercase tracking-wider whitespace-nowrap">单位</th>
                <th className="px-6 py-3 text-[14px] font-medium text-outline uppercase tracking-wider whitespace-nowrap">单件重量</th>
                <th className="px-6 py-3 text-[14px] font-medium text-outline uppercase tracking-wider whitespace-nowrap">单件体积</th>
                <th className="px-6 py-3 text-[14px] font-medium text-outline uppercase tracking-wider whitespace-nowrap">创建时间</th>
                <th className="px-6 py-3 text-[14px] font-medium text-outline uppercase tracking-wider text-center whitespace-nowrap">操作</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-outline-variant/10">
              {paginatedList.length > 0 ? (
                paginatedList.map((item) => (
                  <tr 
                    key={item.id} 
                    className="transition-all group cursor-pointer relative border-y border-transparent hover:bg-primary-container/10 hover:border-primary-container hover:shadow-[inset_0_0_0_1px_var(--primary-container)]"
                  >
                    <td className="px-6 py-2.5 text-[14px] font-medium text-on-surface whitespace-nowrap">{item.name}</td>
                    <td className="px-6 py-2.5 text-[14px] font-mono text-primary-container whitespace-nowrap">{item.id}</td>
                    <td className="px-6 py-2.5 whitespace-nowrap">
                      <span className={`border px-2 py-0.5 rounded text-[12px] font-normal ${categoryColors[item.category] || 'text-outline bg-surface-container-high border-outline-variant/20'}`}>
                        {item.category}
                      </span>
                    </td>
                    <td className="px-6 py-2.5 text-[14px] text-on-surface font-normal whitespace-nowrap">{item.unit}</td>
                    <td className="px-6 py-2.5 text-[14px] text-on-surface font-normal whitespace-nowrap">{item.weight}</td>
                    <td className="px-6 py-2.5 text-[14px] text-on-surface font-normal whitespace-nowrap">{item.volume}</td>
                    <td className="px-6 py-2.5 text-[12px] text-outline/60 whitespace-nowrap font-normal">{item.createdAt}</td>
                    <td className="px-6 py-2.5 whitespace-nowrap">
                      <div className="flex items-center justify-center gap-3">
                        <Tooltip text="编辑">
                          <button 
                            onClick={(e) => {
                              e.stopPropagation();
                              handleEditMaterial(item);
                            }}
                            className="p-1.5 bg-surface-container-high hover:bg-primary-container/20 text-outline hover:text-primary-container rounded-lg transition-all border border-outline-variant/10 hover:border-primary-container/30"
                          >
                            <Edit3 size={16} />
                          </button>
                        </Tooltip>
                        <Tooltip text="删除">
                          <button 
                            onClick={(e) => {
                              e.stopPropagation();
                              handleDeleteMaterial(item.id);
                            }}
                            className="p-1.5 bg-surface-container-high hover:bg-error-container/20 text-outline hover:text-error rounded-lg transition-all border border-outline-variant/10 hover:border-error/30"
                          >
                            <Trash2 size={16} />
                          </button>
                        </Tooltip>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={8} className="px-6 py-12 text-center text-outline/40">
                    <div className="flex flex-col items-center gap-2">
                      <Search size={48} className="opacity-20" />
                      <p className="text-[14px] font-normal">未找到匹配的物料数据</p>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="px-6 py-4 border-t border-outline-variant/10 flex items-center justify-between bg-surface-container-high">
            <p className="text-[12px] text-outline/60 font-normal">
              显示 {((currentPage - 1) * pageSize) + 1} 到 {Math.min(currentPage * pageSize, filteredList.length)} 条，共 {filteredList.length} 条
            </p>
            <div className="flex items-center gap-2">
              <button 
                disabled={currentPage === 1}
                onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                className="p-1.5 rounded-lg border border-outline-variant/10 text-outline hover:text-on-surface hover:bg-surface-container-highest disabled:opacity-30 disabled:pointer-events-none transition-all"
              >
                <ChevronLeft size={16} />
              </button>
              {Array.from({ length: totalPages }).map((_, i) => (
                <button
                  key={i + 1}
                  onClick={() => setCurrentPage(i + 1)}
                  className={`w-8 h-8 rounded-lg text-[12px] font-medium transition-all ${
                    currentPage === i + 1 
                      ? 'bg-primary-container text-white shadow-lg shadow-primary-container/20' 
                      : 'text-outline hover:text-on-surface hover:bg-surface-container-highest border border-outline-variant/10'
                  }`}
                >
                  {i + 1}
                </button>
              ))}
              <button 
                disabled={currentPage === totalPages}
                onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                className="p-1.5 rounded-lg border border-outline-variant/10 text-outline hover:text-on-surface hover:bg-surface-container-highest disabled:opacity-30 disabled:pointer-events-none transition-all"
              >
                <ChevronRight size={16} />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );

  const renderPlaceholder = (label) => (
    <div className="flex flex-col items-center justify-center py-32 space-y-4 animate-in fade-in zoom-in-95 duration-500">
      <div className="w-20 h-20 bg-surface-container rounded-full flex items-center justify-center text-outline/20">
        <Plane size={40} />
      </div>
      <div className="text-center">
        <h3 className="text-xl font-bold text-on-surface">{label}</h3>
        <p className="text-outline/60 mt-1">该模块正在开发中，敬请期待...</p>
      </div>
    </div>
  );

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      {/* Top Tabs */}
      <div className="flex items-center gap-8 border-b border-outline-variant/10 mb-6">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
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

      {activeTab === 'aircraft' ? renderAircraftTable() : activeTab === 'material' ? renderMaterialTable() : renderPlaceholder(tabs.find(t => t.id === activeTab)?.label || '')}

      <NewAircraftModal 
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setEditingAircraft(null);
        }}
        onSave={handleSaveAircraft}
        initialData={editingAircraft}
        title={editingAircraft ? '编辑机型' : '新增机型'}
      />

      <NewMaterialModal 
        isOpen={isMaterialModalOpen}
        onClose={() => {
          setIsMaterialModalOpen(false);
          setEditingMaterial(null);
        }}
        onSave={handleSaveMaterial}
        initialData={editingMaterial}
        title={editingMaterial ? '编辑物料' : '新增物料'}
      />
    </div>
  );
}
