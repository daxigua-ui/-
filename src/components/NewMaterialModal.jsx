import { useState } from 'react';
import { X } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

const materialCategories = ['快递包裹', '医药', '餐饮'];

export default function NewMaterialModal({ isOpen, onClose, onSave, initialData, title = '新增物料' }) {
  const [formData, setFormData] = useState({
    id: '',
    name: '',
    category: '快递包裹',
    unit: '个',
    weight: '',
    volume: '',
  });

  const [errors, setErrors] = useState({});
  const [prevIsOpen, setPrevIsOpen] = useState(isOpen);
  const [prevInitialData, setPrevInitialData] = useState(initialData);

  if (isOpen !== prevIsOpen || initialData !== prevInitialData) {
    setPrevIsOpen(isOpen);
    setPrevInitialData(initialData);
    if (isOpen) {
      setFormData(initialData || {
        id: '',
        name: '',
        category: '快递包裹',
        unit: '个',
        weight: '',
        volume: '',
      });
      setErrors({});
    }
  }

  const handleSave = () => {
    const newErrors = {};
    if (!formData.id) newErrors.id = '请输入物料编号';
    if (!formData.name) newErrors.name = '请输入物料名称';
    
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    onSave({
      ...formData,
      createdAt: initialData?.createdAt || new Date().toISOString().replace('T', ' ').split('.')[0],
    });
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
          />
          
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="relative w-full max-w-[600px] bg-surface-container backdrop-blur-xl border border-outline-variant/10 rounded-xl shadow-2xl overflow-hidden group"
          >
            {/* Border Beam Effect */}
            <div className="absolute inset-0 rounded-xl pointer-events-none overflow-hidden">
              <div 
                className="absolute inset-0 rounded-xl border border-primary/40 opacity-100 transition-opacity duration-500 shadow-[inset_0_0_15px_rgba(22,93,255,0.2)]"
                style={{
                  maskImage: 'linear-gradient(black, black) content-box, linear-gradient(black, black)',
                  maskComposite: 'exclude',
                }}
              />
              <div 
                className="absolute top-0 left-0 w-[100px] h-[2px] bg-gradient-to-r from-transparent via-primary to-transparent animate-border-beam"
                style={{
                  offsetPath: 'rect(0% 100% 100% 0% round 6px)',
                }}
              />
            </div>

            {/* Background Glow Effect */}
            <div className="absolute -top-24 -right-24 w-48 h-48 bg-primary-container/20 blur-[80px] rounded-full" />
            
            {/* Shine Sweep Effect */}
            <div className="absolute inset-0 pointer-events-none overflow-hidden">
              <div className="absolute top-0 -left-[100%] w-1/2 h-full bg-gradient-to-r from-transparent via-white/5 to-transparent skew-x-[-25deg] animate-shine" />
            </div>

            <div className="px-6 py-4 flex items-center justify-between border-b border-outline-variant/10 relative z-10">
              <h2 className="text-[18px] font-semibold text-on-surface">{title}</h2>
              <button onClick={onClose} className="text-outline hover:text-on-surface transition-colors">
                <X size={20} />
              </button>
            </div>

            <div className="p-6 grid grid-cols-2 gap-4 relative z-10">
              <div className="space-y-1.5">
                <label className="text-[14px] font-medium text-outline ml-1">物料编号</label>
                <input
                  type="text"
                  value={formData.id}
                  onChange={(e) => setFormData({ ...formData, id: e.target.value })}
                  placeholder="如: MAT-001"
                  className={`w-full h-[40px] bg-surface-container-low border ${errors.id ? 'border-error/50' : 'border-outline-variant/10'} rounded-xl py-2.5 px-4 text-[14px] text-on-surface transition-all font-normal hover:border-primary-container/50 focus:outline-none focus:border-primary-container focus:shadow-[0_0_10px_rgba(22,93,255,0.2)]`}
                />
                {errors.id && <p className="text-[12px] text-error ml-1 font-normal">{errors.id}</p>}
              </div>

              <div className="space-y-1.5">
                <label className="text-[14px] font-medium text-outline ml-1">物料名称</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="请输入物料名称"
                  className={`w-full h-[40px] bg-surface-container-low border ${errors.name ? 'border-error/50' : 'border-outline-variant/10'} rounded-xl py-2.5 px-4 text-[14px] text-on-surface transition-all font-normal hover:border-primary-container/50 focus:outline-none focus:border-primary-container focus:shadow-[0_0_10px_rgba(22,93,255,0.2)]`}
                />
                {errors.name && <p className="text-[12px] text-error ml-1 font-normal">{errors.name}</p>}
              </div>

              <div className="space-y-1.5">
                <label className="text-[14px] font-medium text-outline ml-1">物料类别</label>
                <select
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  className="w-full h-[40px] bg-surface-container-low border border-outline-variant/10 rounded-xl py-2.5 px-4 text-[14px] text-on-surface transition-all appearance-none font-normal hover:border-primary-container/50 focus:outline-none focus:border-primary-container focus:shadow-[0_0_10px_rgba(22,93,255,0.2)]"
                  style={{
                    backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke='%238d90a2' stroke-width='2'%3E%3Cpath stroke-linecap='round' stroke-linejoin='round' d='M19 9l-7 7-7-7'/%3E%3C/svg%3E")`,
                    backgroundRepeat: 'no-repeat',
                    backgroundPosition: 'right 12px center',
                    backgroundSize: '16px',
                  }}
                >
                  {materialCategories.map(c => <option key={c} value={c} className="bg-surface-container-high">{c}</option>)}
                </select>
              </div>

              <div className="space-y-1.5">
                <label className="text-[14px] font-medium text-outline ml-1">单位</label>
                <input
                  type="text"
                  value={formData.unit}
                  onChange={(e) => setFormData({ ...formData, unit: e.target.value })}
                  placeholder="如: 个"
                  className="w-full h-[40px] bg-surface-container-low border border-outline-variant/10 rounded-xl py-2.5 px-4 text-[14px] text-on-surface transition-all font-normal hover:border-primary-container/50 focus:outline-none focus:border-primary-container focus:shadow-[0_0_10px_rgba(22,93,255,0.2)]"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-[14px] font-medium text-outline ml-1">单件重量</label>
                <input
                  type="text"
                  value={formData.weight}
                  onChange={(e) => setFormData({ ...formData, weight: e.target.value })}
                  placeholder="如: 4kg"
                  className="w-full h-[40px] bg-surface-container-low border border-outline-variant/10 rounded-xl py-2.5 px-4 text-[14px] text-on-surface transition-all font-normal hover:border-primary-container/50 focus:outline-none focus:border-primary-container focus:shadow-[0_0_10px_rgba(22,93,255,0.2)]"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-[14px] font-medium text-outline ml-1">单件体积</label>
                <input
                  type="text"
                  value={formData.volume}
                  onChange={(e) => setFormData({ ...formData, volume: e.target.value })}
                  placeholder="如: 10L"
                  className="w-full h-[40px] bg-surface-container-low border border-outline-variant/10 rounded-xl py-2.5 px-4 text-[14px] text-on-surface transition-all font-normal hover:border-primary-container/50 focus:outline-none focus:border-primary-container focus:shadow-[0_0_10px_rgba(22,93,255,0.2)]"
                />
              </div>
            </div>

            <div className="px-6 py-4 bg-surface-container-high flex items-center justify-end gap-3 relative z-10">
              <button
                onClick={onClose}
                className="px-6 py-2 rounded-xl text-[14px] font-medium text-outline hover:text-on-surface transition-colors"
              >
                取消
              </button>
              <button
                onClick={handleSave}
                className="bg-primary-container hover:bg-primary-container/90 text-white px-8 py-2 rounded-xl text-[14px] font-medium shadow-lg shadow-primary-container/20 transition-all"
              >
                保存
              </button>
            </div>

            {/* Bottom Streaming Light */}
            <div className="absolute bottom-0 left-0 w-full h-[2px] overflow-hidden">
              <div className="w-full h-full bg-gradient-to-r from-transparent via-primary via-primary-container to-transparent animate-stream shadow-[0_0_10px_rgba(22,93,255,0.8)]" />
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
