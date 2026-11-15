import { memo, useEffect, useLayoutEffect, useRef, useState, type CSSProperties, type RefObject } from "react";
import { NUMBER_ONE_LYRICS } from "../data/numberOneForMe";

type AnimatedLyricsProps = {
  audioRef: RefObject<HTMLAudioElement>;
  analyserRef: RefObject<AnalyserNode | null>;
  duration: number;
  isPlaying: boolean;
};

const PARTICLES = Array.from({ length: 14 }, (_, index) => {
  const style = {
    "--particle-x": `${((index * 43) % 91) + 4}%`,
    "--particle-y": `${((index * 61) % 83) + 8}%`,
    "--particle-size": `${1 + (index % 3) * 0.55}px`,
    "--particle-duration": `${8 + (index % 7) * 1.4}s`,
    "--particle-delay": `${-((index * 7) % 19)}s`,
    "--particle-drift": `${((index * 23) % 40) - 20}px`,
  } as CSSProperties;
  return { index, style };
});

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

function wordAt(lineIndex: number, time: number): number {
  const words = NUMBER_ONE_LYRICS[lineIndex]?.words;
  if (!words?.length) return -1;
  let low = 0;
  let high = words.length - 1;
  while (low <= high) {
    const middle = (low + high) >> 1;
    const word = words[middle];
    if (time < word.start) high = middle - 1;
    else if (time >= word.end) low = middle + 1;
    else return middle;
  }
  return -1;
}

function setWordClass(node: HTMLSpanElement | null, className: string) {
  if (!node) return;
  node.classList.remove("mom-lyric-word--active", "mom-lyric-word--past", "mom-lyric-word--future");
  node.classList.add(`mom-lyric-word--${className}`);
}

function AnimatedLyrics({ audioRef, analyserRef, duration, isPlaying }: AnimatedLyricsProps) {
  const visualizerRef = useRef<HTMLCanvasElement>(null);
  const canvasContextRef = useRef<CanvasRenderingContext2D | null>(null);
  const canvasSizeRef = useRef({ width: 0, height: 0 });
  const spectrumRef = useRef<Uint8Array<ArrayBuffer> | null>(null);
  const haloRef = useRef<HTMLDivElement>(null);
  const progressRef = useRef<HTMLSpanElement>(null);
  const wordNodesRef = useRef<Array<HTMLSpanElement | null>>([]);
  const activeIndexRef = useRef(-1);
  const renderedIndexRef = useRef(-1);
  const activeWordIndexRef = useRef(-1);
  const [activeIndex, setActiveIndex] = useState(() => cueAt(audioRef.current?.currentTime ?? 0));

  useLayoutEffect(() => {
    renderedIndexRef.current = activeIndex;
    activeWordIndexRef.current = -1;
    const time = audioRef.current?.currentTime ?? 0;
    const line = NUMBER_ONE_LYRICS[activeIndex];
    if (!line) return;
    const currentWordIndex = wordAt(activeIndex, time);
    line.words.forEach((word, index) => {
      const state = time >= word.end ? "past" : time >= word.start ? "active" : "future";
      setWordClass(wordNodesRef.current[index] ?? null, state);
    });
    activeWordIndexRef.current = currentWordIndex;
  }, [activeIndex, audioRef]);

  useEffect(() => {
    const canvas = visualizerRef.current;
    const context = canvas?.getContext("2d", { alpha: true });
    if (!canvas || !context) return undefined;
    context.lineCap = "round";
    canvasContextRef.current = context;

    const resize = () => {
      const bounds = canvas.getBoundingClientRect();
      const pixelRatio = Math.min(window.devicePixelRatio || 1, 1.5);
      canvasSizeRef.current = { width: bounds.width, height: bounds.height };
      canvas.width = Math.max(1, Math.round(bounds.width * pixelRatio));
      canvas.height = Math.max(1, Math.round(bounds.height * pixelRatio));
      context.setTransform(pixelRatio, 0, 0, pixelRatio, 0, 0);
    };

    resize();
    if (typeof ResizeObserver !== "undefined") {
      const observer = new ResizeObserver(resize);
      observer.observe(canvas);
      return () => {
        observer.disconnect();
        canvasContextRef.current = null;
      };
    }
    window.addEventListener("resize", resize);
    return () => {
      window.removeEventListener("resize", resize);
      canvasContextRef.current = null;
    };
  }, []);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return undefined;
    let animationFrame = 0;

    const drawAudioRing = (time: number): number => {
      const context = canvasContextRef.current;
      const { width, height } = canvasSizeRef.current;
      const analyser = analyserRef.current;
      if (!context || width <= 0 || height <= 0) return 0;

      let spectrum = spectrumRef.current;
      if (analyser && (!spectrum || spectrum.length !== analyser.frequencyBinCount)) {
        spectrum = new Uint8Array(analyser.frequencyBinCount);
        spectrumRef.current = spectrum;
      }
      if (analyser && spectrum) analyser.getByteFrequencyData(spectrum);

      let signal = 0;
      if (spectrum?.length) {
        const limit = Math.min(18, spectrum.length);
        for (let index = 1; index < limit; index += 1) signal += spectrum[index] / 255;
        signal /= Math.max(1, limit - 1);
      } else {
        signal = 0.08 + (Math.sin(time * 7.6) + 1) * 0.035;
      }

      context.clearRect(0, 0, width, height);
      context.save();
      context.globalCompositeOperation = "lighter";
      const centerX = width / 2;
      const centerY = height * 0.55;
      const radius = Math.min(width * 0.45, height * 0.47);
      const innerRadius = radius * 0.70;
      const barCount = 72;

      for (let index = 0; index < barCount; index += 1) {
        const binIndex = spectrum?.length
          ? Math.min(spectrum.length - 1, 1 + Math.floor((index / barCount) * spectrum.length * 0.48))
          : -1;
        const raw = binIndex >= 0 && spectrum ? spectrum[binIndex] / 255 : signal * (0.45 + 0.55 * Math.sin(time * 3 + index * 0.42));
        const strength = Math.pow(Math.max(0, raw), 0.78);
        const angle = (index / barCount) * Math.PI * 2 - Math.PI / 2 + time * 0.018;
        const length = 3 + strength * (17 + signal * 32);
        const x1 = centerX + Math.cos(angle) * innerRadius;
        const y1 = centerY + Math.sin(angle) * innerRadius;
        const x2 = centerX + Math.cos(angle) * (innerRadius + length);
        const y2 = centerY + Math.sin(angle) * (innerRadius + length);
        context.beginPath();
        context.moveTo(x1, y1);
        context.lineTo(x2, y2);
        context.lineWidth = 0.8 + strength * 1.5;
        context.strokeStyle = `rgba(248, 204, 168, ${0.12 + strength * 0.72})`;
        context.stroke();
      }

      for (let index = 0; index < 18; index += 1) {
        const angle = index * (Math.PI * 2 / 18) - time * (0.08 + signal * 0.12);
        const orbit = radius * (0.91 + 0.035 * Math.sin(time * 1.8 + index));
        const bin = spectrum?.length ? spectrum[(index * 3) % spectrum.length] / 255 : signal;
        context.beginPath();
        context.arc(centerX + Math.cos(angle) * orbit, centerY + Math.sin(angle) * orbit, 0.7 + bin * 2, 0, Math.PI * 2);
        context.fillStyle = `rgba(255, 224, 195, ${0.18 + bin * 0.72})`;
        context.fill();
      }
      context.restore();
      return signal;
    };

    const updateFromAudio = (forceWordSync = false) => {
      const time = audio.currentTime;
      const nextCue = cueAt(time);
      if (nextCue !== activeIndexRef.current) {
        activeIndexRef.current = nextCue;
        activeWordIndexRef.current = -1;
        setActiveIndex(nextCue);
      }

      const line = NUMBER_ONE_LYRICS[nextCue];
      const currentWordIndex = renderedIndexRef.current === nextCue ? wordAt(nextCue, time) : -1;
      if (line && renderedIndexRef.current === nextCue) {
        if (forceWordSync) {
          line.words.forEach((word, index) => {
            const state = time >= word.end ? "past" : time >= word.start ? "active" : "future";
            setWordClass(wordNodesRef.current[index] ?? null, state);
          });
        } else if (currentWordIndex !== activeWordIndexRef.current) {
          const previousIndex = activeWordIndexRef.current;
          if (previousIndex >= 0) {
            const previousWord = line.words[previousIndex];
            setWordClass(
              wordNodesRef.current[previousIndex] ?? null,
              time >= previousWord.end ? "past" : "future",
            );
          }
          if (currentWordIndex >= 0) setWordClass(wordNodesRef.current[currentWordIndex] ?? null, "active");
          activeWordIndexRef.current = currentWordIndex;
        }
      }

      const safeDuration = duration > 0 ? duration : audio.duration;
      const trackProgress = Number.isFinite(safeDuration) && safeDuration > 0
        ? Math.min(1, Math.max(0, time / safeDuration))
        : 0;
      if (progressRef.current) progressRef.current.style.transform = `scaleX(${trackProgress})`;

      let wordPulse = 0;
      if (line && currentWordIndex >= 0) {
        const word = line.words[currentWordIndex];
        const progress = (time - word.start) / Math.max(0.01, word.end - word.start);
        wordPulse = 0.18 + Math.sin(Math.PI * progress) * 0.25;
      }
      const audioPulse = drawAudioRing(time);
      const glow = Math.min(0.92, 0.16 + audioPulse * 1.25 + wordPulse);
      if (haloRef.current) {
        haloRef.current.style.opacity = glow.toFixed(3);
        haloRef.current.style.transform = `translate3d(-50%, -50%, 0) scale(${(0.93 + glow * 0.24).toFixed(3)})`;
      }
    };

    const tick = () => {
      if (audio.paused) return;
      updateFromAudio();
      animationFrame = window.requestAnimationFrame(tick);
    };
    const handleSeek = () => updateFromAudio(true);
    const handleTimeUpdate = () => updateFromAudio();
    const handlePlay = () => {
      updateFromAudio(true);
      if (!audio.paused) animationFrame = window.requestAnimationFrame(tick);
    };
    const handlePause = () => {
      window.cancelAnimationFrame(animationFrame);
      updateFromAudio(true);
    };

    audio.addEventListener("timeupdate", handleTimeUpdate);
    audio.addEventListener("seeking", handleSeek);
    audio.addEventListener("seeked", handleSeek);
    audio.addEventListener("play", handlePlay);
    audio.addEventListener("pause", handlePause);
    audio.addEventListener("loadedmetadata", handleSeek);
    updateFromAudio(true);
    if (isPlaying && !audio.paused) animationFrame = window.requestAnimationFrame(tick);

    return () => {
      window.cancelAnimationFrame(animationFrame);
      audio.removeEventListener("timeupdate", handleTimeUpdate);
      audio.removeEventListener("seeking", handleSeek);
      audio.removeEventListener("seeked", handleSeek);
      audio.removeEventListener("play", handlePlay);
      audio.removeEventListener("pause", handlePause);
      audio.removeEventListener("loadedmetadata", handleSeek);
    };
  }, [audioRef, analyserRef, duration, isPlaying]);

  const activeLine = activeIndex >= 0 ? NUMBER_ONE_LYRICS[activeIndex] : undefined;
  const previousLine = activeIndex > 0 ? NUMBER_ONE_LYRICS[activeIndex - 1] : undefined;
  const nextLine = activeIndex >= 0 ? NUMBER_ONE_LYRICS[activeIndex + 1] : NUMBER_ONE_LYRICS[0];

  return (
    <div
      className="mom-lyrics-stage"
      role="group"
      data-playing={isPlaying}
      aria-label="Lirik Number One For Me yang tersinkron dengan lagu"
    >
      <div ref={haloRef} className="mom-lyrics-halo" aria-hidden="true" />
      <div className="mom-lyrics-orbit mom-lyrics-orbit--one" aria-hidden="true" />
      <div className="mom-lyrics-orbit mom-lyrics-orbit--two" aria-hidden="true" />
      <div className="mom-lyrics-orbit mom-lyrics-orbit--three" aria-hidden="true" />
      <canvas ref={visualizerRef} className="mom-lyrics-visualizer" aria-hidden="true" />
      <div className="mom-lyrics-light-sweep" aria-hidden="true" />
      <div className="mom-lyrics-particles" aria-hidden="true">
        {PARTICLES.map(({ index, style }) => <i className="mom-lyric-particle" key={index} style={style} />)}
      </div>

      <div className="mom-lyrics-topline" aria-hidden="true">
        <span>FOR MOM / NUMBER ONE FOR ME</span>
        <span className="mom-lyrics-meter">
          {Array.from({ length: 5 }, (_, index) => <i key={index} />)}
        </span>
      </div>

      <div className="mom-lyrics-center">
        {previousLine && (
          <p key={`previous-${previousLine.start}`} className="mom-lyrics-neighbor mom-lyrics-neighbor--previous" aria-hidden="true">
            {previousLine.text}
          </p>
        )}

        {activeLine ? (
          <p key={activeIndex} className="mom-lyrics-current" aria-hidden="true">
            {activeLine.words.map((word, index) => (
              <span
                className="mom-lyric-word mom-lyric-word--future"
                key={`${word.start}-${index}`}
                ref={(node) => { wordNodesRef.current[index] = node; }}
              >
                {word.text}
              </span>
            ))}
          </p>
        ) : (
          <p className="mom-lyrics-intro" aria-hidden="true">A song, a memory, a love that stays.</p>
        )}

        {nextLine && (
          <p key={`next-${nextLine.start}`} className="mom-lyrics-neighbor mom-lyrics-neighbor--next" aria-hidden="true">
            {nextLine.text}
          </p>
        )}
      </div>

      <div className="mom-lyrics-bottomline" aria-hidden="true">
        <span>LISTEN CLOSE</span>
        <span>LIVE LYRICS</span>
      </div>
      <div className="mom-lyrics-progress" aria-hidden="true">
        <span ref={progressRef} />
      </div>
      <p className="mom-sr-only" aria-live="polite" aria-atomic="true">
        {activeLine?.text ?? "The song is about to begin."}
      </p>
    </div>
  );
}

export default memo(AnimatedLyrics);
