import { memo, useEffect, useLayoutEffect, useRef, useState, type RefObject } from "react";
import { NUMBER_ONE_LYRICS } from "../data/numberOneForMe";

type AnimatedLyricsProps = {
  audioRef: RefObject<HTMLAudioElement>;
  duration: number;
  isPlaying: boolean;
};

function cueAt(time: number): number {
  let low = 0;
  let high = NUMBER_ONE_LYRICS.length - 1;
  let result = -1;
  while (low <= high) {
    const middle = (low + high) >> 1;
    if (NUMBER_ONE_LYRICS[middle].start <= time) {
      result = middle;
      low = middle + 1;
    } else {
      high = middle - 1;
    }
  }
  return result;
}

function smoothstep(value: number): number {
  const progress = Math.max(0, Math.min(1, value));
  return progress * progress * (3 - 2 * progress);
}

function AnimatedLyrics({ audioRef, duration, isPlaying }: AnimatedLyricsProps) {
  const stageRef = useRef<HTMLDivElement>(null);
  const listRef = useRef<HTMLDivElement>(null);
  const lineNodesRef = useRef<Array<HTMLParagraphElement | null>>([]);
  const linePositionsRef = useRef<number[]>([]);
  const activeIndexRef = useRef(-1);
  const [activeIndex, setActiveIndex] = useState(() => cueAt(audioRef.current?.currentTime ?? 0));

  useLayoutEffect(() => {
    const measureLines = () => {
      linePositionsRef.current = lineNodesRef.current.map((node) => node?.offsetTop ?? 0);
    };

    measureLines();
    const observer = typeof ResizeObserver === "undefined" ? null : new ResizeObserver(measureLines);
    if (stageRef.current) observer?.observe(stageRef.current);
    if (listRef.current) observer?.observe(listRef.current);
    window.addEventListener("resize", measureLines);

    return () => {
      observer?.disconnect();
      window.removeEventListener("resize", measureLines);
    };
  }, []);

  useEffect(() => {
    const audio = audioRef.current;
    const list = listRef.current;
    if (!audio || !list) return undefined;

    let animationFrame = 0;
    const reducedMotionQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    let reduceMotion = reducedMotionQuery.matches;

    const updateConveyor = (time: number, lineIndex: number) => {
      const positions = linePositionsRef.current;
      const currentPosition = lineIndex >= 0 ? positions[lineIndex] ?? 0 : 0;
      const upcoming = lineIndex >= 0 ? NUMBER_ONE_LYRICS[lineIndex + 1] : undefined;
      let progress = 0;

      if (upcoming && !reduceMotion) {
        const currentStart = NUMBER_ONE_LYRICS[lineIndex].start;
        const interval = Math.max(0.12, upcoming.start - currentStart);
        const transitionDuration = Math.min(0.95, Math.max(0.48, interval * 0.24));
        const transitionStart = upcoming.start - transitionDuration;
        progress = smoothstep((time - transitionStart) / transitionDuration);
      }

      const nextPosition = upcoming ? positions[lineIndex + 1] ?? currentPosition : currentPosition;
      const scrollPosition = currentPosition + (nextPosition - currentPosition) * progress;
      list.style.transform = `translate3d(0, -${scrollPosition.toFixed(2)}px, 0)`;

      const focusPosition = lineIndex >= 0 ? lineIndex + progress : -0.62;
      const visibleStart = Math.max(0, Math.floor(focusPosition) - 9);
      const visibleEnd = Math.min(NUMBER_ONE_LYRICS.length, Math.ceil(focusPosition) + 11);

      for (let index = visibleStart; index < visibleEnd; index += 1) {
        const node = lineNodesRef.current[index];
        if (!node) continue;
        const distance = Math.abs(index - focusPosition);
        const focus = Math.max(0, 1 - distance / 3.1);
        const opacity = 0.22 + focus * 0.78;
        const blur = (1 - focus) * 6.5;
        const scale = 0.985 + focus * 0.015;

        node.style.setProperty("--line-opacity", opacity.toFixed(3));
        node.style.setProperty("--line-blur", `${blur.toFixed(2)}px`);
        node.style.setProperty("--line-scale", scale.toFixed(3));
      }
    };

    const updateFromAudio = () => {
      const time = audio.currentTime;
      const nextCue = cueAt(time);
      if (nextCue !== activeIndexRef.current) {
        activeIndexRef.current = nextCue;
        setActiveIndex(nextCue);
      }

      const safeDuration = duration > 0 ? duration : audio.duration;
      const trackProgress = Number.isFinite(safeDuration) && safeDuration > 0
        ? Math.min(1, Math.max(0, time / safeDuration))
        : 0;
      stageRef.current?.style.setProperty("--track-progress", trackProgress.toFixed(4));
      updateConveyor(time, nextCue);
    };

    const tick = () => {
      if (audio.paused) return;
      updateFromAudio();
      animationFrame = window.requestAnimationFrame(tick);
    };
    const handlePlay = () => {
      updateFromAudio();
      if (!audio.paused) animationFrame = window.requestAnimationFrame(tick);
    };
    const handlePause = () => {
      window.cancelAnimationFrame(animationFrame);
      updateFromAudio();
    };
    const handleReducedMotionChange = (event: MediaQueryListEvent) => {
      reduceMotion = event.matches;
      updateFromAudio();
    };

    audio.addEventListener("timeupdate", updateFromAudio);
    audio.addEventListener("seeking", updateFromAudio);
    audio.addEventListener("seeked", updateFromAudio);
    audio.addEventListener("play", handlePlay);
    audio.addEventListener("pause", handlePause);
    audio.addEventListener("loadedmetadata", updateFromAudio);
    reducedMotionQuery.addEventListener("change", handleReducedMotionChange);
    updateFromAudio();
    if (isPlaying && !audio.paused) animationFrame = window.requestAnimationFrame(tick);

    return () => {
      window.cancelAnimationFrame(animationFrame);
      audio.removeEventListener("timeupdate", updateFromAudio);
      audio.removeEventListener("seeking", updateFromAudio);
      audio.removeEventListener("seeked", updateFromAudio);
      audio.removeEventListener("play", handlePlay);
      audio.removeEventListener("pause", handlePause);
      audio.removeEventListener("loadedmetadata", updateFromAudio);
      reducedMotionQuery.removeEventListener("change", handleReducedMotionChange);
    };
  }, [audioRef, duration, isPlaying]);

  const activeLine = activeIndex >= 0 ? NUMBER_ONE_LYRICS[activeIndex] : undefined;

  return (
    <div
      ref={stageRef}
      className="mom-lyrics-stage"
      role="group"
      data-playing={isPlaying}
      aria-label="Lirik Number One For Me yang tersinkron dengan lagu"
    >
      <span className="mom-lyrics-handle" aria-hidden="true" />
      <div className="mom-lyrics-track-meta">
        <span className="mom-album-mark" aria-hidden="true">MZ</span>
        <div>
          <p className="mom-lyrics-track-title">Number One For Me</p>
          <p className="mom-lyrics-track-artist">Maher Zain</p>
        </div>
      </div>
      <div className="mom-lyrics-viewport" aria-hidden="true">
        <div ref={listRef} className="mom-lyrics-list">
          {NUMBER_ONE_LYRICS.map((line, index) => (
            <p
              key={`${line.start}-${index}`}
              ref={(node) => { lineNodesRef.current[index] = node; }}
              className="mom-lyrics-line"
            >
              {line.text}
            </p>
          ))}
        </div>
      </div>
      <p className="mom-sr-only" aria-live="polite" aria-atomic="true">
        {activeLine?.text ?? "The song is about to begin."}
      </p>
    </div>
  );
}

export default memo(AnimatedLyrics);
