import { useEffect, useState } from "react";

const SPARKLE_GLYPHS = ["✦", "·", "˚", "✧"];

type Sparkle = {
  id: number;
  x: number;
  y: number;
  glyph: string;
};

export function WorldInteractions() {
  const [sparkles, setSparkles] = useState<Sparkle[]>([]);

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
  );
}
