import { useRef, useState, type ChangeEvent } from "react";

const AUDIO_SRC = "/audio/Number%20One%20For%20Me-Maher%20Zain.ogg";

function formatTime(seconds: number): string {
  if (!Number.isFinite(seconds) || seconds < 0) return "0:00";
  const minutes = Math.floor(seconds / 60);
  const remainder = Math.floor(seconds % 60).toString().padStart(2, "0");
  return `${minutes}:${remainder}`;
}

export default function ForMomPage() {
  const audioRef = useRef<HTMLAudioElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [playerError, setPlayerError] = useState("");

  const togglePlayback = async () => {
    const audio = audioRef.current;
    if (!audio) return;

    if (audio.paused) {
      try {
        await audio.play();
        setPlayerError("");
      } catch {
        setPlayerError("Audio tidak dapat diputar. Periksa berkas audio di server.");
      }
      return;
    }
    audio.pause();
  };

  const seek = (event: ChangeEvent<HTMLInputElement>) => {
    const audio = audioRef.current;
    const nextTime = Number(event.currentTarget.value);
    if (!audio || !Number.isFinite(nextTime)) return;
    audio.currentTime = nextTime;
    setCurrentTime(nextTime);
  };

  const syncDuration = (audio: HTMLAudioElement) => {
    setDuration(Number.isFinite(audio.duration) ? audio.duration : 0);
  };

  return (
    <main className="mom-page">
      <div className="mom-page-inner">
        <a className="mom-back-link" href="#top">
          <span aria-hidden="true">←</span> Back to the portfolio
        </a>

        <section className="mom-hero" aria-labelledby="mom-title">
          <div className="mom-intro">
            <p className="eyebrow">A song and a letter</p>
            <h1 id="mom-title">For <span>Mom.</span></h1>
            <p className="mom-lead">A place for the love I carry, and the words I still want you to hear.</p>
          </div>

          <section className="mom-player" aria-label="Music player">
            <div className="mom-turntable-stage">
              <div className={`mom-turntable${isPlaying ? " is-playing" : ""}`} aria-hidden="true">
                <div className="mom-platter">
                  <div className="mom-vinyl">
                    <div className="mom-record-label"><span>ONE</span><small>FOR MOM</small></div>
                    <span className="mom-spindle" />
                  </div>
                </div>
                <div className="mom-tonearm-pivot" />
                <div className={`mom-tonearm${isPlaying ? " mom-tonearm--playing" : ""}`}>
                  <span className="mom-tonearm-head"><i /></span>
                </div>
                <div className="mom-turntable-button" />
                <div className="mom-turntable-mark">SIDE A</div>
              </div>
            </div>

            <div className="mom-player-info">
              <div className="mom-track-heading">
                <div>
                  <h2>Number One For Me</h2>
                  <p className="mom-track-artist">Maher Zain</p>
                </div>
                <button
                  className="mom-play-button"
                  type="button"
                  onClick={togglePlayback}
                  aria-label={isPlaying ? "Pause Number One For Me" : "Play Number One For Me"}
                  aria-pressed={isPlaying}
                >
                  {isPlaying ? "Pause" : "Play"}
                </button>
              </div>

              <div className="mom-seek-row">
                <span className="mom-time" aria-hidden="true">{formatTime(currentTime)}</span>
                <input
                  className="mom-seek"
                  type="range"
                  min="0"
                  max={Math.max(duration, 1)}
                  step="0.1"
                  value={Math.min(currentTime, Math.max(duration, 1))}
                  onChange={seek}
                  disabled={duration === 0}
                  aria-label="Track position"
                  aria-valuetext={`${formatTime(currentTime)} of ${formatTime(duration)}`}
                />
                <span className="mom-time" aria-hidden="true">{formatTime(duration)}</span>
              </div>
              {playerError && (
                <p className="mom-audio-status" role="status" aria-live="polite">
                  {playerError}
                </p>
              )}
              <audio
                ref={audioRef}
                className="mom-audio"
                preload="metadata"
                aria-label="Number One For Me by Maher Zain, excerpt from 0:07 to 4:22"
                onTimeUpdate={(event) => setCurrentTime(event.currentTarget.currentTime)}
                onLoadedMetadata={(event) => syncDuration(event.currentTarget)}
                onDurationChange={(event) => syncDuration(event.currentTarget)}
                onPlay={() => setIsPlaying(true)}
                onPause={() => setIsPlaying(false)}
                onEnded={() => setIsPlaying(false)}
                onError={() => setPlayerError("Berkas audio tidak dapat dimuat. Periksa berkas di public/audio.")}
              >
                <source src={AUDIO_SRC} type="audio/ogg; codecs=opus" />
              </audio>
            </div>
          </section>
        </section>

        <section className="mom-letter" aria-labelledby="mom-letter-title">
          <div className="mom-letter-heading">
            <p className="eyebrow">A letter in verse</p>
            <h2 id="mom-letter-title">Words I<br /><span>keep.</span></h2>
          </div>
          <blockquote className="mom-poem">
            <p>
              An echo carved in time, a light that never fades—<br />
              The universe feels empty in the quiet of your shade.<br />
              Forgive my careless youth, the days I could not see<br />
              How every gentle breath you took was poured directly into me.
            </p>
            <p>
              If I could reach across the veil to hold your tender hand,<br />
              I’d spend each fleeting moment making sure you understand:<br />
              I will carry every smile you gave, though tears now fill the space,<br />
              For no one in this hollow world could ever take your place.
            </p>
            <p>
              I try to love with half the grace you gave without a sound,<br />
              To live the warmth you left behind, though you are nowhere bound.<br />
              Only Heaven measures now the depth of what you mean,<br />
              In every single thing I build to honor what has been.
            </p>
          </blockquote>
        </section>

        <footer className="mom-footer">
          <a className="mom-back-link" href="#top">Kembali ke portofolio</a>
          <span>{new Date().getFullYear()} / Halaman untuk Ibu</span>
        </footer>

      </div>
    </main>
  );
}
