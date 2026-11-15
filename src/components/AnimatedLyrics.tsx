import { memo, useEffect, useLayoutEffect, useRef, useState, type CSSProperties, type RefObject } from "react";
import { NUMBER_ONE_LYRICS } from "../data/numberOneForMe";

type AnimatedLyricsProps = {
  audioRef: RefObject<HTMLAudioElement>;
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

function AnimatedLyrics({ audioRef, duration, isPlaying }: AnimatedLyricsProps) {
  const haloRef = useRef<HTMLDivElement>(null);
  const progressRef = useRef<HTMLSpanElement>(null);
  const phraseProgressRef = useRef<HTMLSpanElement>(null);
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
    if (!line) {
      if (phraseProgressRef.current) phraseProgressRef.current.style.transform = "scaleX(0)";
      return;
    }

    const currentWordIndex = wordAt(activeIndex, time);
    line.words.forEach((word, index) => {
      const state = time >= word.end ? "past" : time >= word.start ? "active" : "future";
      setWordClass(wordNodesRef.current[index] ?? null, state);
    });
    activeWordIndexRef.current = currentWordIndex;

    let phraseProgress = 0;
    let energy = 0.22;
    if (currentWordIndex >= 0) {
      const word = line.words[currentWordIndex];
      phraseProgress = (time - word.start) / Math.max(0.01, word.end - word.start);
      energy = 0.24 + Math.sin(Math.PI * phraseProgress) * 0.48;
    } else if (time >= line.end) {
      phraseProgress = 1;
    }
    if (phraseProgressRef.current) phraseProgressRef.current.style.transform = `scaleX(${phraseProgress})`;
    if (haloRef.current) {
      haloRef.current.style.opacity = energy.toFixed(3);
      haloRef.current.style.transform = `translate3d(-50%, -50%, 0) scale(${(0.93 + energy * 0.18).toFixed(3)})`;
    }
  }, [activeIndex, audioRef]);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return undefined;
    let animationFrame = 0;

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
          if (currentWordIndex >= 0) {
            setWordClass(wordNodesRef.current[currentWordIndex] ?? null, "active");
          }
          activeWordIndexRef.current = currentWordIndex;
        }
      }

      const safeDuration = duration > 0 ? duration : audio.duration;
      const trackProgress = Number.isFinite(safeDuration) && safeDuration > 0
        ? Math.min(1, Math.max(0, time / safeDuration))
        : 0;
      if (progressRef.current) progressRef.current.style.transform = `scaleX(${trackProgress})`;

      let phraseProgress = 0;
      let energy = 0.22;
      if (line && currentWordIndex >= 0) {
        const word = line.words[currentWordIndex];
        phraseProgress = (time - word.start) / Math.max(0.01, word.end - word.start);
        energy = 0.24 + Math.sin(Math.PI * phraseProgress) * 0.48;
      } else if (line && time >= line.end) {
        phraseProgress = 1;
      }
      if (phraseProgressRef.current) phraseProgressRef.current.style.transform = `scaleX(${phraseProgress})`;
      if (haloRef.current) {
        haloRef.current.style.opacity = energy.toFixed(3);
        haloRef.current.style.transform = `translate3d(-50%, -50%, 0) scale(${(0.93 + energy * 0.18).toFixed(3)})`;
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
  }, [audioRef, duration, isPlaying]);

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
          <p className="mom-lyrics-neighbor mom-lyrics-neighbor--previous" aria-hidden="true">
            {previousLine.text}
          </p>
        )}

        {activeLine ? (
          <>
            <p
              key={activeIndex}
              className="mom-lyrics-current"
              data-line={activeLine.text}
              aria-hidden="true"
            >
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
            <div className="mom-lyric-line-progress" aria-hidden="true">
              <span ref={phraseProgressRef} />
            </div>
          </>
        ) : (
          <p className="mom-lyrics-intro" aria-hidden="true">A song, a memory, a love that stays.</p>
        )}

        {nextLine && (
          <p className="mom-lyrics-neighbor mom-lyrics-neighbor--next" aria-hidden="true">
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
