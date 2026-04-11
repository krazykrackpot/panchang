const STARS = Array.from({ length: 80 }, (_, i) => {
  // Deterministic pseudo-random via LCG seeded by index — no Math.random(), no hydration mismatch
  const s1 = ((i * 1664525 + 1013904223) >>> 0) / 4294967296;
  const s2 = (((i + 80) * 1664525 + 1013904223) >>> 0) / 4294967296;
  const s3 = (((i + 160) * 1664525 + 1013904223) >>> 0) / 4294967296;
  const s4 = (((i + 240) * 1664525 + 1013904223) >>> 0) / 4294967296;
  return {
    left: `${(s1 * 100).toFixed(3)}%`,
    top: `${(s2 * 100).toFixed(3)}%`,
    size: s3 > 0.75 ? 2 : 1,
    duration: `${(s4 * 3 + 3).toFixed(2)}s`,
    delay: `${((s1 + s3) * 0.5 * 5).toFixed(2)}s`,
    color: s3 > 0.6 ? 'rgba(240,212,138,VAR)' : 'rgba(255,255,255,VAR)',
    baseOpacity: (s2 * 0.3 + 0.15).toFixed(2),
  };
});

export default function StarField() {
  return (
    <div
      aria-hidden="true"
      style={{ position: 'fixed', inset: 0, zIndex: 0, pointerEvents: 'none', overflow: 'hidden' }}
    >
      <style>{`
        @keyframes twinkle {
          0%, 100% { opacity: var(--star-lo); }
          50%       { opacity: var(--star-hi); }
        }
      `}</style>
      {STARS.map((star, i) => (
        <div
          key={i}
          style={{
            position: 'absolute',
            left: star.left,
            top: star.top,
            width: star.size,
            height: star.size,
            borderRadius: '50%',
            backgroundColor: star.color
              .replace('VAR', star.baseOpacity),
            willChange: 'opacity',
            // CSS custom props drive the keyframe opacity range
            ['--star-lo' as string]: star.baseOpacity,
            ['--star-hi' as string]: Math.min(parseFloat(star.baseOpacity) * 3.5, 0.85).toFixed(2),
            animation: `twinkle ${star.duration} ${star.delay} infinite ease-in-out`,
          }}
        />
      ))}
    </div>
  );
}
