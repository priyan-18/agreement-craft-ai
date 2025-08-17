export const EnhancedFloatingElements = () => {
  return (
    <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
      {/* Primary Cosmic Elements */}
      <div 
        className="absolute top-1/4 left-1/4 w-96 h-96 bg-gradient-to-r from-primary/20 to-secondary/20 rounded-full blur-3xl cosmic-float"
        style={{ animation: 'cosmic-drift 15s ease-in-out infinite' }}
      />
      <div 
        className="absolute top-3/4 right-1/4 w-64 h-64 bg-gradient-to-r from-secondary/15 to-primary/15 rounded-full blur-3xl cosmic-float"
        style={{ animation: 'cosmic-drift 12s ease-in-out infinite', animationDelay: '3s' }}
      />
      <div 
        className="absolute top-1/2 left-3/4 w-48 h-48 bg-gradient-to-r from-primary/10 to-secondary/10 rounded-full blur-2xl cosmic-float"
        style={{ animation: 'cosmic-drift 18s ease-in-out infinite', animationDelay: '6s' }}
      />
      
      {/* Additional Cosmic Particles */}
      <div 
        className="absolute top-1/6 right-1/3 w-32 h-32 bg-primary/8 rounded-full blur-xl cosmic-float"
        style={{ animation: 'cosmic-drift 10s ease-in-out infinite', animationDelay: '1s' }}
      />
      <div 
        className="absolute bottom-1/4 left-1/6 w-40 h-40 bg-secondary/8 rounded-full blur-xl cosmic-float"
        style={{ animation: 'cosmic-drift 14s ease-in-out infinite', animationDelay: '4s' }}
      />
      
      {/* Subtle Grid Lines */}
      <div className="absolute inset-0 opacity-5">
        <div className="h-full w-full bg-gradient-to-r from-primary/20 via-transparent to-secondary/20" 
             style={{
               backgroundImage: 'linear-gradient(90deg, hsl(280 100% 75% / 0.1) 1px, transparent 1px), linear-gradient(hsl(280 100% 75% / 0.1) 1px, transparent 1px)',
               backgroundSize: '100px 100px'
             }}
        />
      </div>
      
      {/* Floating Sparkles */}
      <div className="absolute inset-0">
        {[...Array(20)].map((_, i) => (
          <div
            key={i}
            className="absolute w-1 h-1 bg-primary/40 rounded-full animate-pulse"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 3}s`,
              animationDuration: `${2 + Math.random() * 2}s`
            }}
          />
        ))}
      </div>
    </div>
  );
};