import { useCallback, useEffect, useRef, useState } from "react";

const MESSAGES = [
  "Currently debugging...",
  "I wonder what I'll build next?",
  "Compiling...",
  "Just one more refactor.",
  "7 projects archived ✦",
  "Everything works on my machine.",
];

const SPARKLE_GLYPHS = ["✦", "·", "˚", "✧"];

type Sparkle = {
  id: number;
  x: number;
  y: number;
  glyph: string;
};

export function WorldInteractions() {
  const [speech, setSpeech] = useState<string | null>(null);
  const [sparkles, setSparkles] = useState<Sparkle[]>([]);
  const speechTimer = useRef<number | null>(null);

  const showRandomMessage = useCallback(() => {
    setSpeech(MESSAGES[Math.floor(Math.random() * MESSAGES.length)]);
    if (speechTimer.current) window.clearTimeout(speechTimer.current);
    speechTimer.current = window.setTimeout(() => setSpeech(null), 4200);
  }, []);

  useEffect(() => {
    const firstMessage = window.setTimeout(showRandomMessage, 8500);
    const nextMessage = window.setInterval(() => {
      if (Math.random() > 0.45) showRandomMessage();
    }, 16000);

    return () => {
      window.clearTimeout(firstMessage);
      window.clearInterval(nextMessage);
    };
  }, [showRandomMessage]);

  useEffect(() => {
    const canTrail = window.matchMedia("(pointer: fine)").matches;
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (!canTrail || reducedMotion) return;

    let lastSparkle = 0;
    let sparkleId = 0;
    const timers = new Set<number>();

    const handlePointerMove = (event: PointerEvent) => {
      const now = performance.now();
      if (now - lastSparkle < 85 || Math.random() > 0.22) return;
      lastSparkle = now;

      const id = sparkleId++;
      setSparkles((current) => [
        ...current.slice(-8),
        {
          id,
          x: event.clientX + (Math.random() * 14 - 7),
          y: event.clientY + (Math.random() * 14 - 7),
          glyph: SPARKLE_GLYPHS[Math.floor(Math.random() * SPARKLE_GLYPHS.length)],
        },
      ]);

      const timer = window.setTimeout(() => {
        setSparkles((current) => current.filter((sparkle) => sparkle.id !== id));
        timers.delete(timer);
      }, 480);
      timers.add(timer);
    };

    window.addEventListener("pointermove", handlePointerMove);
    return () => {
      window.removeEventListener("pointermove", handlePointerMove);
      timers.forEach((timer) => window.clearTimeout(timer));
    };
  }, []);

  return (
    <>
      <div className="cursor-sparkles" aria-hidden="true">
        {sparkles.map((sparkle) => (
          <span
            key={sparkle.id}
            className="cursor-sparkle"
            style={{ left: sparkle.x, top: sparkle.y }}
          >
            {sparkle.glyph}
          </span>
        ))}
      </div>

      <div className="claudia-companion">
        {speech && (
          <div className="companion-bubble" role="status" aria-live="polite">
            {speech}
          </div>
        )}
        <button
          type="button"
          className="companion-mascot"
          aria-label="Say hello to Claudia"
          onClick={showRandomMessage}
        >
          <span className="mascot-face" aria-hidden="true">
            ฅ^•ﻌ•^ฅ
          </span>
          <span className="mascot-sparkle" aria-hidden="true">✦</span>
        </button>
      </div>
    </>
  );
}
