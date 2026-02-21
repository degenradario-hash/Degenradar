export default function HeroBackground({ children }: { children: React.ReactNode }) {
  return (
    <div className="relative">
      {/* Gradient glows — hero section only */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: 'radial-gradient(ellipse at 50% 30%, rgba(255,255,0,0.06) 0%, transparent 60%)',
        }}
      />
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: 'radial-gradient(ellipse at 80% 60%, rgba(200,0,200,0.06) 0%, transparent 50%)',
        }}
      />

      {/* Content */}
      <div className="relative z-10">
        {children}
      </div>
    </div>
  )
}
