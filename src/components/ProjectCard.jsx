import { Clock, LogIn, Trash2, Box, Edit3, Copy, FileUp } from 'lucide-react';
import { motion } from 'motion/react';

export default function ProjectCard({ type, title, description, createdAt, onEdit }) {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -4, scale: 1.02 }}
      className="relative group overflow-hidden rounded-xl border border-outline-variant/20 bg-surface-container backdrop-blur-xl p-5 flex flex-col h-full transition-all duration-300 shadow-xl dark:shadow-black/50"
    >
      {/* Border Beam Effect */}
      <div className="absolute inset-0 rounded-xl pointer-events-none overflow-hidden">
        <div 
          className="absolute inset-0 rounded-xl border border-primary/40 opacity-0 group-hover:opacity-100 transition-opacity duration-500 shadow-[inset_0_0_15px_rgba(22,93,255,0.2)]"
          style={{
            maskImage: 'linear-gradient(black, black) content-box, linear-gradient(black, black)',
            maskComposite: 'exclude',
          }}
        />
        <div 
          className="absolute top-0 left-0 w-[100px] h-[2px] bg-gradient-to-r from-transparent via-primary to-transparent animate-border-beam opacity-0 group-hover:opacity-100"
          style={{
            offsetPath: 'rect(0% 100% 100% 0% round 10px)',
          }}
        />
      </div>

      {/* Background Glow Effect */}
      <div className="absolute -top-24 -right-24 w-48 h-48 bg-primary-container/10 blur-[80px] rounded-full group-hover:bg-primary-container/20 transition-colors duration-500" />
      
      {/* Shine Sweep Effect */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-0 -left-[100%] w-1/2 h-full bg-gradient-to-r from-transparent via-primary/5 to-transparent skew-x-[-25deg] group-hover:animate-shine" />
      </div>

      {/* Top Row: Icon & Tag */}
      <div className="flex justify-between items-center mb-5 relative z-10">
        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary-container/20 to-primary/5 flex items-center justify-center border border-outline-variant/20 shadow-inner">
          <Box size={20} className="text-primary" />
        </div>
        <span className="bg-primary-container/10 text-primary border border-primary/20 px-3 py-1 rounded-xl text-[10px] font-bold tracking-wider uppercase backdrop-blur-md">
          {type}
        </span>
      </div>

      {/* Content */}
      <div className="relative z-10 flex-grow">
        <h3 className="text-[18px] font-semibold text-on-surface mb-2 leading-tight line-clamp-2 group-hover:text-primary transition-colors">
          {title}
        </h3>
        <p className="text-on-surface-variant text-[14px] leading-relaxed mb-4 line-clamp-3 font-normal">
          {description.length > 20 ? `${description.slice(0, 20)}...` : description}
        </p>
      </div>

      {/* Meta Info */}
      <div className="flex items-center gap-2 text-outline text-[12px] mb-5 relative z-10 font-normal">
        <Clock size={12} />
        <span className="tracking-wide">CREATED: {createdAt}</span>
      </div>

      {/* Action Buttons */}
      <div className="relative z-10 mt-auto pt-4 border-t border-outline-variant/10 flex flex-col gap-3">
        <button className="w-full bg-gradient-to-r from-primary-container via-[#3b82f6] to-[#1d4ed8] hover:shadow-[0_0_20px_rgba(22,93,255,0.4)] text-white py-2.5 rounded-xl text-[14px] font-medium transition-all flex items-center justify-center gap-2 active:scale-95">
          <LogIn size={16} />
          进入项目
        </button>
        
        <div className="flex items-center gap-2 w-full">
          <button 
            onClick={(e) => {
              e.stopPropagation();
              onEdit?.();
            }}
            className="flex-1 bg-surface-container-high hover:bg-surface-container-highest text-on-surface py-2 rounded-xl text-[12px] font-medium transition-colors border border-outline-variant/10 flex items-center justify-center gap-1.5"
          >
            <Edit3 size={14} /> 编辑
          </button>
          <button className="flex-1 bg-surface-container-high hover:bg-surface-container-highest text-on-surface py-2 rounded-xl text-[12px] font-medium transition-colors border border-outline-variant/10 flex items-center justify-center gap-1.5">
            <Copy size={14} /> 复制
          </button>
          <button className="flex-1 bg-surface-container-high hover:bg-surface-container-highest text-on-surface py-2 rounded-xl text-[12px] font-medium transition-colors border border-outline-variant/10 flex items-center justify-center gap-1.5">
            <FileUp size={14} /> 导出
          </button>
          <button className="p-2 bg-error-container/10 hover:bg-error-container/20 text-error rounded-xl transition-colors border border-error/10">
            <Trash2 size={14} />
          </button>
        </div>
      </div>

      {/* Bottom Streaming Light */}
      <div className="absolute bottom-0 left-0 w-full h-[2px] overflow-hidden opacity-0 group-hover:opacity-100 transition-opacity duration-500">
        <div className="w-full h-full bg-gradient-to-r from-transparent via-primary via-primary-container to-transparent animate-stream shadow-[0_0_10px_rgba(22,93,255,0.8)]" />
      </div>
    </motion.div>
  );
}
