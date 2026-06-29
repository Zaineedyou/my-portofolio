import { useRef, useEffect, useState } from 'react';
import { motion, useInView } from 'motion/react';

const SONG = {
  title: 'Number One For Me',
  artist: 'Maher Zain',
  album: 'One (2012)',
  color: '#c8a97e',
};

const QUOTE = {
  text: "Beneath the sky where you now rest, every blessing you gave has become a pillar holding up all that I've achieved today. To the greatest woman who taught me to chase my dreams: thank you for being my compass and my eternal inspiration. You will always be the number one for me, Mom.",
  author: '— Zain',
};

function VinylPlayer() {
  const [playing, setPlaying] = useState(false);
  const rotateRef = useRef(0);
  const rafRef = useRef(null);
  const diskRef = useRef(null);
  const needleRef = useRef(null);
  const audioRef = useRef(null);

  useEffect(() => {
    audioRef.current = new Audio('/Number One For Me - Maher Zain.mp3');
    audioRef.current.loop = false;
    audioRef.current.addEventListener('ended', () => setPlaying(false));
    return () => {
      audioRef.current.pause();
      audioRef.current = null;
    };
  }, []);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;
    let frame;
    if (playing) {
      audio.volume = 0;
      audio.play();
      const fadeIn = () => {
        if (audio.volume < 1) {
          audio.volume = Math.min(1, audio.volume + 0.02);
          frame = requestAnimationFrame(fadeIn);
        }
      };
      frame = requestAnimationFrame(fadeIn);
    } else {
      const fadeOut = () => {
        if (audio.volume > 0) {
          audio.volume = Math.max(0, audio.volume - 0.02);
          frame = requestAnimationFrame(fadeOut);
        } else {
          audio.pause();
        }
      };
      frame = requestAnimationFrame(fadeOut);
    }
    return () => cancelAnimationFrame(frame);
  }, [playing]);

  useEffect(() => {
    const tick = () => {
      if (playing) {
        rotateRef.current += 0.4;
        if (diskRef.current) {
          diskRef.current.style.transform = `rotate(${rotateRef.current}deg)`;
        }
      }
      rafRef.current = requestAnimationFrame(tick);
    };
    rafRef.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(rafRef.current);
  }, [playing]);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '20px' }}>
      <div style={{ position: 'relative', width: '180px', height: '180px' }}>
        <div
          ref={diskRef}
          style={{
            width: '180px',
            height: '180px',
            borderRadius: '50%',
            background: `
              radial-gradient(circle at 50% 50%, #2a1a0e 0%, #1a1008 18%, #3d2b1a 19%, #1a1008 20%,
              #3d2b1a 35%, #1a1008 36%, #3d2b1a 50%, #1a1008 51%, #3d2b1a 65%, #1a1008 66%,
              #3d2b1a 80%, #1a1008 81%, #2a1a0e 100%)
            `,
            boxShadow: '0 8px 32px rgba(0,0,0,0.6)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
            transition: 'box-shadow 0.3s',
          }}
          onClick={() => setPlaying(!playing)}
        >
          <div style={{
            width: '60px',
            height: '60px',
            borderRadius: '50%',
            background: `radial-gradient(circle, ${SONG.color} 0%, #8b6914 60%, #5a4209 100%)`,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 2px 8px rgba(0,0,0,0.5)',
          }}>
            <div style={{
              width: '10px',
              height: '10px',
              borderRadius: '50%',
              background: '#1a1008',
            }} />
          </div>
        </div>

        <div
          ref={needleRef}
          style={{
            position: 'absolute',
            top: '-10px',
            right: '-10px',
            width: '4px',
            height: '70px',
            background: 'linear-gradient(to bottom, #aaa 0%, #888 60%, #e8336b 100%)',
            borderRadius: '2px',
            transformOrigin: 'top center',
            transform: playing ? 'rotate(28deg)' : 'rotate(15deg)',
            transition: 'transform 0.5s ease',
          }}
        />
      </div>

      <div style={{ textAlign: 'center' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', marginBottom: '4px' }}>
          <motion.div
            animate={playing ? { opacity: [1, 0.3, 1] } : { opacity: 1 }}
            transition={{ duration: 1.2, repeat: Infinity }}
            style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#e8336b' }}
          />
          <p style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '10px', color: '#ff80a8', letterSpacing: '0.1em', textTransform: 'uppercase', margin: 0 }}>
            {playing ? 'now playing' : 'paused'}
          </p>
        </div>
        <p style={{ fontFamily: 'Space Grotesk, sans-serif', fontSize: '15px', fontWeight: 600, color: '#f5f0ff', margin: '0 0 2px' }}>
          {SONG.title}
        </p>
        <p style={{ fontFamily: 'Space Grotesk, sans-serif', fontSize: '13px', color: '#9d97b0', margin: 0 }}>
          {SONG.artist}
        </p>
      </div>

      <button
        onClick={() => setPlaying(!playing)}
        style={{
          padding: '8px 24px',
          borderRadius: '99px',
          background: playing ? 'rgba(232,51,107,0.1)' : '#e8336b',
          border: playing ? '1px solid #e8336b' : 'none',
          color: playing ? '#e8336b' : '#fff',
          fontFamily: 'Space Grotesk, sans-serif',
          fontSize: '13px',
          fontWeight: 600,
          cursor: 'pointer',
          transition: 'all 0.2s',
        }}
      >
        {playing ? '⏸ Pause' : '▶ Play'}
      </button>
    </div>
  );
}

export function VibeSection() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: false, margin: '0px 0px -60px 0px' });

  return (
    <section style={{ borderTop: '1px solid rgba(255,255,255,0.04)', padding: '96px 0' }}>
      <div className="max-w-5xl mx-auto px-6 md:px-10">
        <motion.div
          ref={ref}
          initial={{ opacity: 0, y: 24 }}
          animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 24 }}
          transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
            gap: '40px',
            alignItems: 'center',
          }}
        >
          <VinylPlayer />

          <div style={{
            background: '#13131a',
            border: '1px solid rgba(255,255,255,0.06)',
            borderRadius: '20px',
            padding: '32px',
            position: 'relative',
          }}>
            <div style={{
              fontFamily: 'Lora, Georgia, serif',
              fontSize: 'clamp(3rem, 8vw, 5rem)',
              color: '#e8336b',
              lineHeight: 0.8,
              marginBottom: '16px',
              opacity: 0.4,
            }}>
              "
            </div>
            <p style={{
              fontFamily: 'Lora, Georgia, serif',
              fontSize: '15px',
              lineHeight: 1.8,
              color: '#c8c3d8',
              margin: '0 0 24px',
              fontStyle: 'italic',
            }}>
              {QUOTE.text}
            </p>
            <p style={{
              fontFamily: 'JetBrains Mono, monospace',
              fontSize: '13px',
              color: '#ff80a8',
              margin: 0,
              textAlign: 'right',
            }}>
              {QUOTE.author}
            </p>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

