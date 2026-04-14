export default function AuthBackground() {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none z-0 bg-[#0B0F19]">
      {/* Background Image */}
      <img 
        src="/bg-drone.png"
        alt="Background"
        referrerPolicy="no-referrer"
        className="absolute inset-0 w-full h-full object-cover object-center transition-opacity duration-1000"
        onError={(e) => {
          // Fallback to a working drone/logistics image if the local file fails to load
          e.target.src = "https://images.unsplash.com/photo-1508614589041-895b88991e3e?q=80&w=2000&auto=format&fit=crop";
        }}
      />

      {/* Radial Gradient Overlay: Bright spot near the drone (right side), dark edges */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_75%_45%,transparent_0%,rgba(11,15,25,0.4)_40%,rgba(11,15,25,0.85)_100%)]" />
      
      {/* Futuristic Moving Scanning Line */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="w-full h-[3px] bg-blue-500/30 shadow-[0_0_20px_rgba(59,130,246,0.6)] animate-scanline" />
      </div>
      
      {/* Flight Paths (Moving streaks of light) */}
      <div className="absolute inset-0 overflow-hidden">
        {[...Array(3)].map((_, i) => (
          <div 
            key={i}
            className="absolute h-[1px] w-[300px] bg-gradient-to-r from-transparent via-blue-400/40 to-transparent animate-flight"
            style={{
              top: `${20 + i * 25}%`,
              left: `-10%`,
              animationDelay: `${i * 3}s`,
              animationDuration: `${8 + i * 2}s`
            }}
          />
        ))}
      </div>

      {/* Telemetry Data (Fading text) */}
      <div className="absolute bottom-10 right-10 font-mono text-[10px] text-blue-400/40 space-y-1">
        <div className="animate-pulse">ALT: 124m</div>
        <div className="animate-pulse" style={{ animationDelay: '0.5s' }}>SPD: 42km/h</div>
        <div className="animate-pulse" style={{ animationDelay: '1s' }}>BAT: 88%</div>
        <div className="animate-pulse" style={{ animationDelay: '1.5s' }}>SIG: STABLE</div>
      </div>

      {/* Static Grid Overlay (Subtle) */}
      <div className="absolute inset-0 opacity-[0.08] bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.25)_50%),linear-gradient(90deg,rgba(255,0,0,0.06),rgba(0,255,0,0.02),rgba(0,0,255,0.06))] bg-[length:100%_4px,4px_100%]" />
      
      {/* Floating Data Particles (Enhanced) */}
      <div className="absolute inset-0">
        {[...Array(30)].map((_, i) => (
          <div 
            key={i}
            className="absolute w-1.5 h-1.5 bg-blue-400/50 rounded-full animate-float blur-[1px]"
            style={{
              top: `${Math.random() * 100}%`,
              left: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 5}s`,
              animationDuration: `${4 + Math.random() * 6}s`
            }}
          />
        ))}
      </div>

      {/* Extra dark layer for the left side to ensure text readability */}
      <div className="absolute inset-y-0 left-0 w-1/2 bg-gradient-to-r from-[#0B0F19]/50 to-transparent" />
    </div>
  );
}
