import { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { PlaneTakeoff, User, Lock, Eye, EyeOff } from 'lucide-react';
import { motion } from 'motion/react';
import AuthBackground from '../components/AuthBackground';

export default function Login({ onNavigateToRegister }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [error, setError] = useState('');
  const { login } = useAuth();

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');
    
    if (!username || !password) {
      setError('请输入用户名和密码');
      return;
    }

    const result = login(username, password);
    if (!result.success) {
      setError(result.message);
    }
  };

  return (
    <div className="min-h-screen flex flex-col justify-center items-center lg:items-start lg:pl-[15%] p-4 relative overflow-hidden">
      <AuthBackground />

      <motion.div 
        initial={{ opacity: 0, x: -50, filter: 'blur(10px)' }}
        animate={{ opacity: 1, x: 0, filter: 'blur(0px)' }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        whileHover={{ scale: 1.02, transition: { duration: 0.2 } }}
        className="w-full max-w-[438px] bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl shadow-2xl p-8 relative z-10 group overflow-hidden"
      >
        {/* Animated Shimmer Border */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 bg-gradient-to-r from-transparent via-blue-500/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000 ease-in-out" />
        </div>

        <div className="flex flex-col items-center mb-8">
          <div className="w-16 h-16 bg-blue-600 rounded-2xl flex items-center justify-center text-white mb-4 shadow-lg shadow-blue-500/30">
            <PlaneTakeoff size={32} />
          </div>
          <h1 className="text-2xl font-bold text-white tracking-tight">仿真物流平台1111</h1>
          <p className="text-sm text-white/70 mt-2">欢迎回来，请登录您的账号</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          {error && (
            <div className="bg-red-500/20 text-red-200 text-sm px-4 py-3 rounded-xl border border-red-500/30 font-medium text-center">
              {error}
            </div>
          )}

          <div className="space-y-4">
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-white/50">
                <User size={18} />
              </div>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full bg-white/5 border border-white/10 rounded-xl py-3 pl-11 pr-4 text-[14px] text-white placeholder:text-white/30 focus:outline-none focus:border-blue-500/50 focus:bg-white/10 transition-all"
                placeholder="用户名 / 邮箱"
              />
            </div>

            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-white/50">
                <Lock size={18} />
              </div>
              <input
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-white/5 border border-white/10 rounded-xl py-3 pl-11 pr-12 text-[14px] text-white placeholder:text-white/30 focus:outline-none focus:border-blue-500/50 focus:bg-white/10 transition-all"
                placeholder="密码"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute inset-y-0 right-0 pr-4 flex items-center text-white/50 hover:text-white transition-colors"
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>

          <div className="flex items-center justify-between px-1">
            <label className="flex items-center space-x-2 cursor-pointer group">
              <div className="relative">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="sr-only"
                />
                <div className={`w-5 h-5 border-2 rounded-md transition-all ${rememberMe ? 'bg-blue-600 border-blue-600' : 'border-white/20 group-hover:border-white/40'}`}>
                  {rememberMe && (
                    <svg className="w-full h-full text-white p-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="4">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                    </svg>
                  )}
                </div>
              </div>
              <span className="text-sm text-white/70 group-hover:text-white transition-colors">记住我</span>
            </label>
            <button type="button" className="text-sm text-blue-400 hover:text-blue-300 font-medium transition-colors">
              忘记密码？
            </button>
          </div>

          <button
            type="submit"
            className="w-full bg-blue-600 hover:bg-blue-500 text-white py-3 rounded-xl text-[15px] font-bold shadow-lg shadow-blue-600/20 transition-all active:scale-[0.98]"
          >
            登 录
          </button>
        </form>

        <div className="mt-8 text-center">
          <span className="text-sm text-white/50">还没有账号？</span>
          <button 
            onClick={onNavigateToRegister}
            className="text-sm text-blue-400 font-bold ml-2 hover:text-blue-300 transition-all"
          >
            立即注册
          </button>
        </div>
      </motion.div>
    </div>
  );
}
