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

function setWordClass(node: HTMLSpanElement | null, state: "active" | "past" | "future") {
  if (!node) return;
  node.classList.remove("mom-lyric-word--active", "mom-lyric-word--past", "mom-lyric-word--future");
  node.classList.add(`mom-lyric-word--${state}`);
}

function AnimatedLyrics({ audioRef, duration, isPlaying }: AnimatedLyricsProps) {
  const centerRef = useRef<HTMLDivElement>(null);
  const previousFarRef = useRef<HTMLParagraphElement>(null);
  const previousNearRef = useRef<HTMLParagraphElement>(null);
  const currentRef = useRef<HTMLParagraphElement>(null);
  const nextNearRef = useRef<HTMLParagraphElement>(null);
  const nextFarRef = useRef<HTMLParagraphElement>(null);
  const progressRef = useRef<HTMLSpanElement>(null);
  const wordNodesRef = useRef<Array<HTMLSpanElement | null>>([]);
  const nextDistanceRef = useRef(72);
  const activeIndexRef = useRef(-1);
  const renderedIndexRef = useRef(-1);
  const activeWordIndexRef = useRef(-1);
  const [activeIndex, setActiveIndex] = useState(() => cueAt(audioRef.current?.currentTime ?? 0));

  const activeLine = activeIndex >= 0 ? NUMBER_ONE_LYRICS[activeIndex] : undefined;
  const previousNear = activeIndex > 0 ? NUMBER_ONE_LYRICS[activeIndex - 1] : undefined;
  const previousFar = activeIndex > 1 ? NUMBER_ONE_LYRICS[activeIndex - 2] : undefined;
  const nextNear = NUMBER_ONE_LYRICS[activeIndex + 1];
  const nextFar = NUMBER_ONE_LYRICS[activeIndex + 2];

  useLayoutEffect(() => {
    renderedIndexRef.current = activeIndex;
    activeWordIndexRef.current = -1;
    const center = centerRef.current;
    const current = currentRef.current;
    if (center && current) {
      const currentHeight = current.offsetHeight;
      const gap = Math.max(9, Math.min(18, center.clientHeight * 0.055));
      const previousNearHeight = previousNearRef.current?.offsetHeight ?? 0;
      const previousFarHeight = previousFarRef.current?.offsetHeight ?? 0;
      const nextNearHeight = nextNearRef.current?.offsetHeight ?? 0;
      const nextFarHeight = nextFarRef.current?.offsetHeight ?? 0;
      const previousNearDistance = currentHeight / 2 + gap + previousNearHeight / 2;
      const nextNearDistance = currentHeight / 2 + gap + nextNearHeight / 2;
      const previousFarDistance = previousNearDistance + previousNearHeight / 2 + gap + previousFarHeight / 2;
      const nextFarDistance = nextNearDistance + nextNearHeight / 2 + gap + nextFarHeight / 2;
      center.style.setProperty("--previous-near-distance", `${previousNearDistance}px`);
      center.style.setProperty("--previous-far-distance", `${previousFarDistance}px`);
      center.style.setProperty("--next-near-distance", `${nextNearDistance}px`);
      center.style.setProperty("--next-far-distance", `${nextFarDistance}px`);
      center.style.setProperty("--lyrics-shift", "0px");
      nextDistanceRef.current = nextNearDistance;
    }

    const time = audioRef.current?.currentTime ?? 0;
    const line = NUMBER_ONE_LYRICS[activeIndex];
    if (!line) return;
    const currentWordIndex = wordAt(activeIndex, time);
    line.words.forEach((word, index) => {
      const state = time >= word.end ? "past" : time >= word.start ? "active" : "future";
      setWordClass(wordNodesRef.current[index] ?? null, state);
    });
    activeWordIndexRef.current = currentWordIndex;
  }, [activeIndex, audioRef, previousNear, previousFar, nextNear, nextFar]);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return undefined;
    let animationFrame = 0;

    const updateConveyor = (time: number, lineIndex: number) => {
      const center = centerRef.current;
      if (!center) return;
      const upcoming = NUMBER_ONE_LYRICS[lineIndex + 1];
      if (!upcoming) {
        center.style.setProperty("--lyrics-shift", "0px");
        center.style.setProperty("--lyrics-current-scale", "1.12");
        center.style.setProperty("--lyrics-current-opacity", "1");
        center.style.setProperty("--lyrics-current-blur", "0px");
        center.style.setProperty("--lyrics-previous-scale", "0.91");
        center.style.setProperty("--lyrics-previous-opacity", "0.42");
        center.style.setProperty("--lyrics-previous-blur", "3.6px");
        center.style.setProperty("--lyrics-next-scale", "0.89");
        center.style.setProperty("--lyrics-next-opacity", "0.26");
        center.style.setProperty("--lyrics-next-blur", "4.5px");
        center.style.setProperty("--lyrics-far-opacity", "0.16");
        return;
      }
      const currentStart = lineIndex >= 0 ? NUMBER_ONE_LYRICS[lineIndex].start : 0;
      const distance = Math.max(0.12, upcoming.start - currentStart);
      const transitionDuration = Math.min(0.62, distance);
      const transitionStart = upcoming.start - transitionDuration;
      const progress = Math.min(1, Math.max(0, (time - transitionStart) / transitionDuration));
      center.style.setProperty("--lyrics-shift", `${(nextDistanceRef.current * progress).toFixed(2)}px`);
      center.style.setProperty("--lyrics-current-scale", (1.12 - progress * 0.12).toFixed(3));
      center.style.setProperty("--lyrics-current-opacity", (1 - progress * 0.45).toFixed(3));
      center.style.setProperty("--lyrics-current-blur", `${(progress * 2.2).toFixed(2)}px`);
      center.style.setProperty("--lyrics-previous-scale", (0.91 - progress * 0.04).toFixed(3));
      center.style.setProperty("--lyrics-previous-opacity", (0.42 - progress * 0.14).toFixed(3));
      center.style.setProperty("--lyrics-previous-blur", `${(3.6 + progress * 1.2).toFixed(2)}px`);
      center.style.setProperty("--lyrics-next-scale", (0.89 + progress * 0.23).toFixed(3));
      center.style.setProperty("--lyrics-next-opacity", (0.26 + progress * 0.74).toFixed(3));
      center.style.setProperty("--lyrics-next-blur", `${(4.5 * (1 - progress)).toFixed(2)}px`);
      center.style.setProperty("--lyrics-far-opacity", (0.16 + progress * 0.04).toFixed(3));
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
          activeWordIndexRef.current = currentWordIndex;
        } else if (currentWordIndex !== activeWordIndexRef.current) {
          const previousIndex = activeWordIndexRef.current;
          if (previousIndex >= 0) {
            const previousWord = line.words[previousIndex];
            setWordClass(wordNodesRef.current[previousIndex] ?? null, time >= previousWord.end ? "past" : "future");
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
      updateConveyor(time, nextCue);
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

  return (
    <div
      className="mom-lyrics-stage"
      role="group"
      data-playing={isPlaying}
      aria-label="Lirik Number One For Me yang tersinkron dengan lagu"
    >
      <div className="mom-lyrics-topline" aria-hidden="true">
        <span>FOR MOM / NUMBER ONE FOR ME</span>
      </div>
      <div ref={centerRef} className="mom-lyrics-center">
        {previousFar && (
          <p key={`previous-far-${previousFar.start}`} ref={previousFarRef} className="mom-lyrics-line mom-lyrics-line--previous-far" aria-hidden="true">
            {previousFar.text}
          </p>
        )}
        {previousNear && (
          <p key={`previous-near-${previousNear.start}`} ref={previousNearRef} className="mom-lyrics-line mom-lyrics-line--previous-near" aria-hidden="true">
            {previousNear.text}
          </p>
        )}
        {activeLine ? (
          <p key={`active-${activeIndex}`} ref={currentRef} className="mom-lyrics-line mom-lyrics-line--current" aria-hidden="true">
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
          <p ref={currentRef} className="mom-lyrics-line mom-lyrics-line--current mom-lyrics-line--intro" aria-hidden="true">
            A song, a memory, a love that stays.
          </p>
        )}
        {nextNear && (
          <p key={`next-near-${nextNear.start}`} ref={nextNearRef} className="mom-lyrics-line mom-lyrics-line--next-near" aria-hidden="true">
            {nextNear.text}
          </p>
        )}
        {nextFar && (
          <p key={`next-far-${nextFar.start}`} ref={nextFarRef} className="mom-lyrics-line mom-lyrics-line--next-far" aria-hidden="true">
            {nextFar.text}
          </p>
        )}
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
