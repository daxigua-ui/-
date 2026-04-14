import { useState } from 'react';
import { X } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

const projectTypes = ['电商配送', '跨城干线', '同城配送', '冷链物流', '国际货运'];

export default function NewProjectModal({ isOpen, onClose, onSave, initialData, title = '新建项目' }) {
  const [name, setName] = useState('');
  const [type, setType] = useState('电商配送');
  const [description, setDescription] = useState('');
  const [errors, setErrors] = useState({});
  const [prevIsOpen, setPrevIsOpen] = useState(isOpen);
  const [prevInitialData, setPrevInitialData] = useState(initialData);

  if (isOpen !== prevIsOpen || initialData !== prevInitialData) {
    setPrevIsOpen(isOpen);
    setPrevInitialData(initialData);
    if (isOpen) {
      setName(initialData?.name || '');
      setType(initialData?.type || '电商配送');
      setDescription(initialData?.description || '');
      setErrors({});
    }
  }

  const handleSave = () => {
    const newErrors = {};
    if (!name.trim()) newErrors.name = '项目名称不能为空';
    if (description.length > 50) newErrors.description = '项目简述不能超过 50 个字符';

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    onSave({ name, type, description });
    onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Overlay */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/60 z-[60] backdrop-blur-sm"
          />

          {/* Modal Container */}
          <div className="fixed inset-0 flex items-center justify-center z-[70] pointer-events-none p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="bg-surface-container backdrop-blur-xl w-full max-w-[600px] rounded-xl border border-outline-variant/20 shadow-2xl pointer-events-auto flex flex-col overflow-hidden font-sans group relative"
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
              <div className="absolute -top-24 -right-24 w-48 h-48 bg-primary-container/10 blur-[80px] rounded-full" />
              
              {/* Shine Sweep Effect */}
              <div className="absolute inset-0 pointer-events-none overflow-hidden">
                <div className="absolute top-0 -left-[100%] w-1/2 h-full bg-gradient-to-r from-transparent via-primary/5 to-transparent skew-x-[-25deg] animate-shine" />
              </div>

              {/* Header */}
              <div className="px-6 py-4 flex items-center justify-between border-b border-outline-variant/10 relative z-10">
                <h2 className="text-[18px] font-semibold text-on-surface">{title}</h2>
                <button
                  onClick={onClose}
                  className="text-outline hover:text-on-surface transition-colors p-1"
                >
                  <X size={20} />
                </button>
              </div>

              {/* Body */}
              <div className="p-6 space-y-5 relative z-10">
                {/* Project Name */}
                <div className="space-y-1.5">
                  <label className="block text-[14px] font-medium text-outline text-left ml-1">
                    项目名称
                  </label>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => {
                      setName(e.target.value);
                      if (errors.name) setErrors({ ...errors, name: undefined });
                    }}
                    placeholder="请输入项目名称"
                    className={`w-full h-[40px] px-4 rounded-xl border ${
                      errors.name ? 'border-error/50' : 'border-outline-variant/20'
                    } bg-surface-container-low text-[14px] text-on-surface placeholder:text-outline/30 transition-all font-normal hover:border-primary-container/50 focus:outline-none focus:border-primary-container focus:shadow-[0_0_10px_rgba(22,93,255,0.2)]`}
                  />
                  {errors.name && <p className="text-[12px] text-error mt-1 ml-1 font-normal">{errors.name}</p>}
                </div>

                {/* Project Type */}
                <div className="space-y-1.5">
                  <label className="block text-[14px] font-medium text-outline text-left ml-1">
                    项目类型
                  </label>
                  <select
                    value={type}
                    onChange={(e) => setType(e.target.value)}
                    className="w-full h-[40px] px-4 rounded-xl border border-outline-variant/20 text-[14px] text-on-surface bg-surface-container-low transition-all appearance-none cursor-pointer font-normal hover:border-primary-container/50 focus:outline-none focus:border-primary-container focus:shadow-[0_0_10px_rgba(22,93,255,0.2)]"
                    style={{
                      backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke='%238d90a2' stroke-width='2'%3E%3Cpath stroke-linecap='round' stroke-linejoin='round' d='M19 9l-7 7-7-7'/%3E%3C/svg%3E")`,
                      backgroundRepeat: 'no-repeat',
                      backgroundPosition: 'right 12px center',
                      backgroundSize: '16px',
                    }}
                  >
                    {projectTypes.map((t) => (
                      <option key={t} value={t} className="bg-surface-container-high text-on-surface">
                        {t}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Project Description */}
                <div className="space-y-1.5 relative">
                  <div className="flex justify-between items-center px-1">
                    <label className="block text-[14px] font-medium text-outline text-left">
                      项目简述
                    </label>
                    <span className={`text-[12px] ${description.length > 50 ? 'text-error' : 'text-outline/40'}`}>
                      {description.length}/50
                    </span>
                  </div>
                  <textarea
                    value={description}
                    onChange={(e) => {
                      setDescription(e.target.value);
                      if (errors.description && e.target.value.length <= 50) setErrors({ ...errors, description: undefined });
                    }}
                    placeholder="请输入项目简述，最多 50 个字符"
                    rows={3}
                    className={`w-full p-4 rounded-xl border ${
                      errors.description ? 'border-error/50' : 'border-outline-variant/20'
                    } bg-surface-container-low text-[14px] text-on-surface placeholder:text-outline/30 transition-all resize-none font-normal hover:border-primary-container/50 focus:outline-none focus:border-primary-container focus:shadow-[0_0_10px_rgba(22,93,255,0.2)]`}
                  />
                  {errors.description && <p className="text-[12px] text-error mt-1 ml-1 font-normal">{errors.description}</p>}
                </div>

                {/* Helper Text */}
                <p className="text-[12px] text-outline/40 font-normal leading-tight ml-1">
                  仅支持纯文本，保存后会在项目卡片中显示前 20 个字符。
                </p>
              </div>

              {/* Footer */}
              <div className="px-6 py-4 bg-surface-container-low flex justify-end gap-3 border-t border-outline-variant/10 relative z-10">
                <button
                  onClick={onClose}
                  className="px-6 py-2 h-[40px] flex items-center justify-center rounded-xl border border-outline-variant/20 bg-transparent text-outline text-[14px] font-medium hover:text-on-surface hover:bg-surface-container-high transition-all active:scale-95"
                >
                  取消
                </button>
                <button
                  onClick={handleSave}
                  className="px-8 py-2 h-[40px] flex items-center justify-center rounded-xl bg-primary-container text-white text-[14px] font-medium hover:bg-primary-container/90 shadow-lg shadow-primary-container/20 transition-all active:scale-95"
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
        </>
      )}
    </AnimatePresence>
  );
}
