import { NUMBER_ONE_LYRICS } from "../data/numberOneForMe";

type AnimatedLyricsProps = {
  currentTime: number;
  duration: number;
  isPlaying: boolean;
};

export default function AnimatedLyrics({ currentTime, duration, isPlaying }: AnimatedLyricsProps) {
  let activeIndex = NUMBER_ONE_LYRICS.findIndex(
    (line) => currentTime >= line.start && currentTime < line.end,
  );
  if (activeIndex < 0) {
    const nextIndex = NUMBER_ONE_LYRICS.findIndex((line) => line.start > currentTime);
    activeIndex = nextIndex < 0 ? NUMBER_ONE_LYRICS.length - 1 : nextIndex - 1;
  }

  const activeLine = activeIndex >= 0 ? NUMBER_ONE_LYRICS[activeIndex] : undefined;
  const previousLine = activeIndex > 0 ? NUMBER_ONE_LYRICS[activeIndex - 1] : undefined;
  const nextLine = activeIndex >= 0 ? NUMBER_ONE_LYRICS[activeIndex + 1] : NUMBER_ONE_LYRICS[0];
  const progress = duration > 0 ? Math.min(100, Math.max(0, (currentTime / duration) * 100)) : 0;
  const resting = Boolean(activeLine && currentTime > activeLine.end);

  return (
    <div
      className="mom-lyrics-stage"
      role="group"
      data-playing={isPlaying}
      aria-label="Lirik Number One For Me yang tersinkron dengan lagu"
    >
      <div className="mom-lyrics-halo" aria-hidden="true" />
      <div className="mom-lyrics-orbit mom-lyrics-orbit--one" aria-hidden="true" />
      <div className="mom-lyrics-orbit mom-lyrics-orbit--two" aria-hidden="true" />
      <div className="mom-lyrics-orbit mom-lyrics-orbit--three" aria-hidden="true" />

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
          <p
            key={activeIndex}
            className={`mom-lyrics-current${resting ? " mom-lyrics-current--resting" : ""}`}
            aria-hidden="true"
          >
            {activeLine.words.map((word, index) => {
              const isPast = currentTime >= word.end;
              const isActive = currentTime >= word.start && currentTime < word.end;
              const state = isActive ? "active" : isPast ? "past" : "future";
              return (
                <span className={`mom-lyric-word mom-lyric-word--${state}`} key={`${word.start}-${index}`}>
                  {word.text}{index < activeLine.words.length - 1 ? " " : ""}
                </span>
              );
            })}
          </p>
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
        <span style={{ width: `${progress}%` }} />
      </div>
      <p className="mom-sr-only" aria-live="polite" aria-atomic="true">
        {activeLine?.text ?? "The song is about to begin."}
      </p>
    </div>
  );
}
