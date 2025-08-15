export const FloatingElements = () => {
  return (
    <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
      <div 
        className="absolute top-1/4 left-1/4 w-64 h-64 bg-primary/10 rounded-full blur-3xl floating-element"
        style={{ animation: 'float 8s ease-in-out infinite' }}
      />
      <div 
        className="absolute top-3/4 right-1/4 w-48 h-48 bg-secondary/10 rounded-full blur-3xl floating-element"
        style={{ animation: 'float 6s ease-in-out infinite', animationDelay: '2s' }}
      />
      <div 
        className="absolute top-1/2 left-3/4 w-32 h-32 bg-primary/5 rounded-full blur-2xl floating-element"
        style={{ animation: 'float 10s ease-in-out infinite', animationDelay: '4s' }}
      />
      <div 
        className="absolute top-1/6 right-1/3 w-40 h-40 bg-purple-500/5 rounded-full blur-3xl floating-element"
        style={{ animation: 'float 7s ease-in-out infinite', animationDelay: '1s' }}
      />
    </div>
  );
};