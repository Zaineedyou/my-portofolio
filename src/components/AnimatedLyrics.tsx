import { memo, useEffect, useLayoutEffect, useRef, useState, type RefObject } from "react";
import { NUMBER_ONE_LYRICS } from "../data/numberOneForMe";

type AnimatedLyricsProps = {
  audioRef: RefObject<HTMLAudioElement>;
  duration: number;
  isPlaying: boolean;
};

function clamp(value: number, min = 0, max = 1): number {
  return Math.min(max, Math.max(min, value));
}

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

function tangentAt(index: number, positions: number[]): number {
  const last = NUMBER_ONE_LYRICS.length - 1;
  if (last < 1) return 0;

  if (index <= 0) {
    const interval = NUMBER_ONE_LYRICS[1].start - NUMBER_ONE_LYRICS[0].start;
    return interval > 0 ? (positions[1] - positions[0]) / interval : 0;
  }

  if (index >= last) {
    const interval = NUMBER_ONE_LYRICS[last].start - NUMBER_ONE_LYRICS[last - 1].start;
    return interval > 0 ? (positions[last] - positions[last - 1]) / interval : 0;
  }

  const beforeInterval = NUMBER_ONE_LYRICS[index].start - NUMBER_ONE_LYRICS[index - 1].start;
  const afterInterval = NUMBER_ONE_LYRICS[index + 1].start - NUMBER_ONE_LYRICS[index].start;
  const beforeSlope = beforeInterval > 0 ? (positions[index] - positions[index - 1]) / beforeInterval : 0;
  const afterSlope = afterInterval > 0 ? (positions[index + 1] - positions[index]) / afterInterval : 0;

  if (beforeSlope <= 0 || afterSlope <= 0) return 0;

  const firstWeight = 2 * afterInterval + beforeInterval;
  const secondWeight = afterInterval + 2 * beforeInterval;
  return (firstWeight + secondWeight)
    / (firstWeight / beforeSlope + secondWeight / afterSlope);
}

function hermitePosition(start: number, end: number, startTangent: number, endTangent: number, interval: number, progress: number): number {
  const t = clamp(progress);
  const t2 = t * t;
  const t3 = t2 * t;
  return (2 * t3 - 3 * t2 + 1) * start
    + (t3 - 2 * t2 + t) * interval * startTangent
    + (-2 * t3 + 3 * t2) * end
    + (t3 - t2) * interval * endTangent;
}

function clearLineWords(lineNode: HTMLParagraphElement | null): void {
  if (!lineNode) return;
  lineNode.querySelectorAll<HTMLElement>(".mom-lyric-char").forEach((character) => {
    character.style.color = "";
    character.style.transform = "";
    character.style.textShadow = "";
  });
}

function syncLineWords(lineIndex: number, time: number, lineNodes: Array<HTMLParagraphElement | null>): void {
  const line = NUMBER_ONE_LYRICS[lineIndex];
  const lineNode = lineNodes[lineIndex];
  if (!line || !lineNode) return;

  const wordNodes = lineNode.querySelectorAll<HTMLElement>("[data-lyric-word]");
  wordNodes.forEach((wordNode, wordIndex) => {
    const word = line.words[wordIndex];
    if (!word) return;

    const characters = wordNode.querySelectorAll<HTMLElement>(".mom-lyric-char");
    const count = characters.length;
    if (count === 0) return;

    if (time >= word.end) {
      characters.forEach((character) => {
        character.style.color = "#fff";
        character.style.transform = "scale(1)";
        character.style.textShadow = "0 0 .45px currentColor";
      });
      return;
    }

    if (time < word.start) {
      characters.forEach((character) => {
        character.style.color = "rgba(255, 255, 255, .40)";
        character.style.transform = "scale(1)";
        character.style.textShadow = "";
      });
      return;
    }

    const wordDuration = Math.max(0.045, word.end - word.start);
    const sweep = clamp((time - word.start) / wordDuration) * count;
    characters.forEach((character, characterIndex) => {
      const center = characterIndex + 0.5;
      const distanceFromWave = Math.abs(center - sweep);
      const pop = Math.max(0, 1 - distanceFromWave / 1.25);
      const scale = 1 + pop * 0.105;
      const passed = center <= sweep;

      character.style.color = passed ? "#fff" : "rgba(255, 255, 255, .40)";
      character.style.transform = `scale(${scale.toFixed(3)})`;
      character.style.textShadow = passed || pop > 0.08 ? "0 0 .45px currentColor" : "";
    });
  });
}

function AnimatedLyrics({ audioRef, duration, isPlaying }: AnimatedLyricsProps) {
  const stageRef = useRef<HTMLDivElement>(null);
  const viewportRef = useRef<HTMLDivElement>(null);
  const listRef = useRef<HTMLDivElement>(null);
  const progressRef = useRef<HTMLSpanElement>(null);
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
    const stage = stageRef.current;
    const viewport = viewportRef.current;
    const list = listRef.current;
    if (!audio || !stage || !viewport || !list) return undefined;

    let animationFrame = 0;
    const reducedMotionQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    let reduceMotion = reducedMotionQuery.matches;

    const updateLineFocus = (focusPosition: number) => {
      const lineNodes = lineNodesRef.current;
      const visibleStart = Math.max(0, Math.floor(focusPosition) - 8);
      const visibleEnd = Math.min(NUMBER_ONE_LYRICS.length, Math.ceil(focusPosition) + 9);

      for (let index = visibleStart; index < visibleEnd; index += 1) {
        const node = lineNodes[index];
        if (!node) continue;

        const delta = index - focusPosition;
        const distance = Math.abs(delta);
        let opacity: number;
        let blur: number;
        let scale: number;
        let ink: string;

        if (distance <= 0.34) {
          opacity = 1;
          blur = 0;
          scale = 1.035;
          ink = "rgba(255, 255, 255, 1)";
        } else if (delta > 0) {
          if (distance <= 1.2) {
            const previewProgress = clamp((distance - 0.34) / 0.86);
            opacity = 0.94 - previewProgress * 0.18;
            blur = 0;
            scale = 1.02 - previewProgress * 0.045;
            ink = `rgba(255, 255, 255, ${(0.94 - previewProgress * 0.18).toFixed(3)})`;
          } else if (distance <= 2.2) {
            const blurProgress = clamp(distance - 1.2);
            opacity = 0.7 - blurProgress * 0.24;
            blur = 4.2 * blurProgress;
            scale = 0.975 - blurProgress * 0.035;
            ink = `rgba(255, 255, 255, ${(0.74 - blurProgress * 0.22).toFixed(3)})`;
          } else {
            const farProgress = Math.min(1, (distance - 2.2) / 2.4);
            opacity = 0.36 - farProgress * 0.29;
            blur = 4.2 + farProgress * 4.8;
            scale = 0.94 - farProgress * 0.07;
            ink = `rgba(255, 255, 255, ${(0.5 - farProgress * 0.38).toFixed(3)})`;
          }
        } else if (distance <= 1.2) {
          const pastProgress = clamp((distance - 0.34) / 0.86);
          opacity = 0.96 - pastProgress * 0.42;
          blur = 4.4 * pastProgress;
          scale = 1.015 - pastProgress * 0.08;
          ink = `rgba(255, 255, 255, ${(0.88 - pastProgress * 0.28).toFixed(3)})`;
        } else {
          const farProgress = Math.min(1, (distance - 1.2) / 1.8);
          opacity = 0.52 - farProgress * 0.44;
          blur = 4.4 + farProgress * 4.6;
          scale = 0.935 - farProgress * 0.065;
          ink = `rgba(255, 255, 255, ${(0.6 - farProgress * 0.48).toFixed(3)})`;
        }

        node.style.setProperty("--flow-opacity", opacity.toFixed(3));
        node.style.setProperty("--flow-blur", `${blur.toFixed(2)}px`);
        node.style.setProperty("--flow-scale", scale.toFixed(3));
        node.style.setProperty("--flow-ink", ink);
      }
    };

    const updateConveyor = (time: number, lineIndex: number) => {
      const positions = linePositionsRef.current;
      const currentPosition = lineIndex >= 0 ? positions[lineIndex] ?? 0 : positions[0] ?? 0;
      const upcoming = lineIndex >= 0 ? NUMBER_ONE_LYRICS[lineIndex + 1] : undefined;
      let scrollPosition = currentPosition;
      let focusPosition = lineIndex >= 0 ? lineIndex : -1;

      if (upcoming && lineIndex >= 0) {
        const current = NUMBER_ONE_LYRICS[lineIndex];
        const interval = Math.max(0.08, upcoming.start - current.start);
        const timeProgress = clamp((time - current.start) / interval);
        const nextPosition = positions[lineIndex + 1] ?? currentPosition;

        if (!reduceMotion) {
          scrollPosition = hermitePosition(
            currentPosition,
            nextPosition,
            tangentAt(lineIndex, positions),
            tangentAt(lineIndex + 1, positions),
            interval,
            timeProgress,
          );
        }

        const distance = nextPosition - currentPosition;
        const spatialProgress = distance > 0 ? clamp((scrollPosition - currentPosition) / distance) : timeProgress;
        focusPosition = lineIndex + spatialProgress;
      }

      const anchorOffset = stage.clientHeight * 0.13;
      list.style.transform = `translate3d(0, ${(anchorOffset - scrollPosition).toFixed(2)}px, 0)`;
      updateLineFocus(focusPosition);
    };

    const resetWordStyles = () => {
      lineNodesRef.current.forEach(clearLineWords);
    };

    const updateFromAudio = (forceWordSync = false) => {
      const time = audio.currentTime;
      const nextCue = cueAt(time);
      const previousCue = activeIndexRef.current;

      if (nextCue !== previousCue) {
        activeIndexRef.current = nextCue;
        setActiveIndex(nextCue);
      }

      if (forceWordSync) {
        resetWordStyles();
        if (nextCue >= 0) syncLineWords(nextCue, time, lineNodesRef.current);
      } else {
        if (nextCue !== previousCue && previousCue >= 0) {
          const firstPrevious = Math.min(previousCue, nextCue);
          const lastPrevious = Math.max(previousCue, nextCue);
          for (let index = firstPrevious; index < lastPrevious; index += 1) {
            clearLineWords(lineNodesRef.current[index] ?? null);
          }
        }
        if (nextCue >= 0) syncLineWords(nextCue, time, lineNodesRef.current);
      }

      const safeDuration = duration > 0 ? duration : audio.duration;
      const trackProgress = Number.isFinite(safeDuration) && safeDuration > 0
        ? clamp(time / safeDuration)
        : 0;
      if (progressRef.current) progressRef.current.style.transform = `scaleX(${trackProgress})`;
      updateConveyor(time, nextCue);
    };

    const tick = () => {
      if (audio.paused) return;
      updateFromAudio();
      animationFrame = window.requestAnimationFrame(tick);
    };
    const handlePlay = () => {
      updateFromAudio(true);
      if (!audio.paused) animationFrame = window.requestAnimationFrame(tick);
    };
    const handlePause = () => {
      window.cancelAnimationFrame(animationFrame);
      updateFromAudio();
    };
    const handleTimeUpdate = () => updateFromAudio();
    const handleSeek = () => updateFromAudio(true);
    const handleReducedMotionChange = (event: MediaQueryListEvent) => {
      reduceMotion = event.matches;
      updateFromAudio();
    };

    audio.addEventListener("timeupdate", handleTimeUpdate);
    audio.addEventListener("seeking", handleSeek);
    audio.addEventListener("seeked", handleSeek);
    audio.addEventListener("play", handlePlay);
    audio.addEventListener("pause", handlePause);
    audio.addEventListener("loadedmetadata", handleSeek);
    reducedMotionQuery.addEventListener("change", handleReducedMotionChange);
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
      aria-label="Synchronized lyrics for Number One For Me"
    >
      <div className="mom-lyrics-topline" aria-hidden="true">
        <span>FOR MOM / NUMBER ONE FOR ME</span>
      </div>
      <div ref={viewportRef} className="mom-lyrics-center mom-lyrics-flow-viewport" aria-hidden="true">
        <div ref={listRef} className="mom-lyrics-flow">
          {NUMBER_ONE_LYRICS.map((line, lineIndex) => (
            <p
              key={`${line.start}-${lineIndex}`}
              ref={(node) => { lineNodesRef.current[lineIndex] = node; }}
              className="mom-lyrics-flow-row"
            >
              {line.words.map((word, wordIndex) => (
                <span className="mom-lyric-word" data-lyric-word key={`${word.start}-${wordIndex}`}>
                  {Array.from(word.text).map((character, characterIndex) => (
                    <span className="mom-lyric-char" key={`${character}-${characterIndex}`}>
                      {character}
                    </span>
                  ))}
                </span>
              )).flatMap((wordNode, wordIndex) => wordIndex < line.words.length - 1 ? [wordNode, " "] : [wordNode])}
            </p>
          ))}
        </div>
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
