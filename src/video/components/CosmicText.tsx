import React from 'react';
import { AbsoluteFill, useCurrentFrame, useVideoConfig, interpolate, spring } from 'remotion';

/**
 * Dramatic text reveal with cosmic light burst effect.
 * Text emerges from a golden light explosion with particle spray.
 * Much more dramatic than the basic TextReveal component.
 *
 * Used for hook lines, key reveals, and "mind blown" moments.
 */

interface CosmicTextProps {
  text: string;
  style?: 'burst' | 'ascend' | 'shatter' | 'glow';
}

// Deterministic particles for the burst effect
const BURST_PARTICLES = Array.from({ length: 30 }, (_, i) => ({
  angle: (i * 137.508) % 360,
  speed: 2 + (i % 5) * 1.5,
  size: 2 + (i % 3) * 1.5,
  delay: (i % 8) * 2,
  life: 20 + (i % 6) * 5,
}));

/** Light burst — expanding golden ring with particles */
const LightBurst: React.FC<{ frame: number; fps: number }> = ({ frame, fps }) => {
  const burstProgress = interpolate(frame, [5, 25], [0, 1], {
    extrapolateLeft: 'clamp', extrapolateRight: 'clamp',
  });
  const burstOpacity = interpolate(frame, [5, 15, 35], [0, 0.8, 0], {
    extrapolateLeft: 'clamp', extrapolateRight: 'clamp',
  });

  return (
    <>
      {/* Expanding ring */}
      <div style={{
        position: 'absolute',
        left: '50%', top: '45%',
        width: burstProgress * 800,
        height: burstProgress * 800,
        marginLeft: -burstProgress * 400,
        marginTop: -burstProgress * 400,
        borderRadius: '50%',
        border: `2px solid rgba(240,212,138,${burstOpacity * 0.5})`,
        boxShadow: `0 0 ${30 * burstOpacity}px rgba(240,212,138,${burstOpacity * 0.3}), inset 0 0 ${20 * burstOpacity}px rgba(240,212,138,${burstOpacity * 0.1})`,
      }} />

      {/* Central flash */}
      <div style={{
        position: 'absolute',
        left: '50%', top: '45%',
        width: 300,
        height: 300,
        marginLeft: -150,
        marginTop: -150,
        borderRadius: '50%',
        background: 'radial-gradient(circle, rgba(255,240,200,0.6) 0%, rgba(240,212,138,0.2) 30%, transparent 60%)',
        opacity: burstOpacity,
        filter: 'blur(8px)',
      }} />

      {/* Burst particles flying outward */}
      {BURST_PARTICLES.map((p, i) => {
        const pFrame = frame - 8 - p.delay;
        if (pFrame < 0) return null;
        const distance = pFrame * p.speed * 3;
        const pOpacity = interpolate(pFrame, [0, 5, p.life], [0, 1, 0], {
          extrapolateLeft: 'clamp', extrapolateRight: 'clamp',
        });
        if (pOpacity <= 0) return null;
        const rad = (p.angle * Math.PI) / 180;
        const px = Math.cos(rad) * distance;
        const py = Math.sin(rad) * distance;
        return (
          <div
            key={`bp-${i}`}
            style={{
              position: 'absolute',
              left: `calc(50% + ${px}px)`,
              top: `calc(45% + ${py}px)`,
              width: p.size,
              height: p.size,
              marginLeft: -p.size / 2,
              marginTop: -p.size / 2,
              borderRadius: '50%',
              background: '#f0d48a',
              opacity: pOpacity,
              boxShadow: `0 0 ${p.size * 3}px rgba(240,212,138,0.5)`,
            }}
          />
        );
      })}
    </>
  );
};

/** Burst style — text explodes into view */
function BurstReveal({ text, frame, fps }: { text: string; frame: number; fps: number }) {
  const words = text.split(/\s+/);

  const textOpacity = interpolate(frame, [12, 22], [0, 1], {
    extrapolateLeft: 'clamp', extrapolateRight: 'clamp',
  });

  const textScale = spring({
    frame: Math.max(0, frame - 10),
    fps,
    config: { damping: 12, stiffness: 100 },
  });

  return (
    <>
      <LightBurst frame={frame} fps={fps} />
      <div style={{
        position: 'absolute',
        left: 0, right: 0, top: '30%', bottom: '30%',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        padding: '0 80px',
        opacity: textOpacity,
        transform: `scale(${textScale})`,
      }}>
        <div style={{
          display: 'flex',
          flexWrap: 'wrap',
          justifyContent: 'center',
          gap: 12,
        }}>
          {words.map((word, i) => {
            const isEmphasis = word.startsWith('*') && word.endsWith('*');
            const cleanWord = isEmphasis ? word.slice(1, -1) : word;
            return (
              <span
                key={i}
                style={{
                  fontSize: isEmphasis ? 64 : 56,
                  fontWeight: isEmphasis ? 900 : 700,
                  fontFamily: 'Inter, system-ui, sans-serif',
                  color: isEmphasis ? '#f0d48a' : '#e6e2d8',
                  textShadow: isEmphasis
                    ? '0 0 30px rgba(240,212,138,0.5), 0 0 60px rgba(212,168,83,0.2)'
                    : '0 0 20px rgba(0,0,0,0.5)',
                  textTransform: 'uppercase',
                  letterSpacing: '0.05em',
                }}
              >
                {cleanWord}
              </span>
            );
          })}
        </div>
      </div>
    </>
  );
}

/** Ascend style — text rises from below with ethereal glow */
function AscendReveal({ text, frame, fps }: { text: string; frame: number; fps: number }) {
  const lines = text.split('\n');

  return (
    <div style={{
      position: 'absolute', inset: 0,
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      alignItems: 'center',
      padding: '0 100px',
    }}>
      {/* Rising light column */}
      <div style={{
        position: 'absolute',
        left: '40%', bottom: 0, width: '20%', height: '100%',
        background: 'linear-gradient(180deg, transparent, rgba(240,212,138,0.04) 40%, rgba(240,212,138,0.08) 70%, rgba(240,212,138,0.02) 100%)',
        filter: 'blur(30px)',
        opacity: interpolate(frame, [0, 15], [0, 1], {
          extrapolateLeft: 'clamp', extrapolateRight: 'clamp',
        }),
      }} />

      {lines.map((line, lineIdx) => {
        const words = line.split(/\s+/);
        const lineDelay = lineIdx * 15;
        const lineY = interpolate(frame - lineDelay, [0, 20], [80, 0], {
          extrapolateLeft: 'clamp', extrapolateRight: 'clamp',
        });
        const lineOpacity = interpolate(frame - lineDelay, [0, 20], [0, 1], {
          extrapolateLeft: 'clamp', extrapolateRight: 'clamp',
        });

        return (
          <div
            key={lineIdx}
            style={{
              display: 'flex',
              flexWrap: 'wrap',
              justifyContent: 'center',
              gap: 12,
              marginBottom: 20,
              opacity: lineOpacity,
              transform: `translateY(${lineY}px)`,
            }}
          >
            {words.map((word, i) => {
              const isEmphasis = word.startsWith('*') && word.endsWith('*');
              const cleanWord = isEmphasis ? word.slice(1, -1) : word;
              return (
                <span
                  key={i}
                  style={{
                    fontSize: isEmphasis ? 58 : 48,
                    fontWeight: isEmphasis ? 800 : 600,
                    fontFamily: 'Inter, system-ui, sans-serif',
                    color: isEmphasis ? '#f0d48a' : '#e6e2d8',
                    textShadow: '0 0 15px rgba(0,0,0,0.4)',
                  }}
                >
                  {cleanWord}
                </span>
              );
            })}
          </div>
        );
      })}
    </div>
  );
}

/** Glow style — text pulses with sacred golden aura */
function GlowReveal({ text, frame, fps }: { text: string; frame: number; fps: number }) {
  const words = text.split(/\s+/);

  const textOpacity = interpolate(frame, [5, 20], [0, 1], {
    extrapolateLeft: 'clamp', extrapolateRight: 'clamp',
  });

  const glowPulse = interpolate(
    Math.sin(frame * 0.06),
    [-1, 1],
    [0.4, 1.0]
  );

  return (
    <div style={{
      position: 'absolute', inset: 0,
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      padding: '0 80px',
    }}>
      {/* Sacred aura behind text */}
      <div style={{
        position: 'absolute',
        left: '50%', top: '50%',
        width: 600, height: 400,
        marginLeft: -300, marginTop: -200,
        borderRadius: '50%',
        background: `radial-gradient(ellipse, rgba(240,212,138,${glowPulse * 0.08}) 0%, rgba(212,168,83,${glowPulse * 0.03}) 40%, transparent 70%)`,
        filter: 'blur(20px)',
      }} />

      <div style={{
        display: 'flex',
        flexWrap: 'wrap',
        justifyContent: 'center',
        gap: 14,
        opacity: textOpacity,
      }}>
        {words.map((word, i) => {
          const isEmphasis = word.startsWith('*') && word.endsWith('*');
          const cleanWord = isEmphasis ? word.slice(1, -1) : word;
          const wordDelay = i * 3;
          const wordScale = spring({
            frame: Math.max(0, frame - wordDelay - 5),
            fps,
            config: { damping: 18, stiffness: 80 },
          });

          return (
            <span
              key={i}
              style={{
                fontSize: isEmphasis ? 60 : 50,
                fontWeight: isEmphasis ? 900 : 700,
                fontFamily: 'Inter, system-ui, sans-serif',
                color: isEmphasis ? '#f0d48a' : '#e6e2d8',
                textShadow: `0 0 ${20 * glowPulse}px rgba(240,212,138,${glowPulse * 0.4})`,
                transform: `scale(${wordScale})`,
                textTransform: 'uppercase',
                letterSpacing: '0.06em',
              }}
            >
              {cleanWord}
            </span>
          );
        })}
      </div>
    </div>
  );
}

export const CosmicText: React.FC<CosmicTextProps> = ({ text, style = 'burst' }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  return (
    <AbsoluteFill>
      {style === 'burst' && <BurstReveal text={text} frame={frame} fps={fps} />}
      {style === 'ascend' && <AscendReveal text={text} frame={frame} fps={fps} />}
      {style === 'glow' && <GlowReveal text={text} frame={frame} fps={fps} />}
      {style === 'shatter' && <BurstReveal text={text} frame={frame} fps={fps} />}
    </AbsoluteFill>
  );
};
