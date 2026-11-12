import type { GitHubLanguage } from "../lib/github";

type LanguageMeterProps = {
  languages?: GitHubLanguage[];
  status: "loading" | "ready" | "error";
};

export default function LanguageMeter({ languages, status }: LanguageMeterProps) {
  if (status === "loading") {
    return <p className="language-meter-state" role="status">Reading GitHub languages…</p>;
  }

  if (status === "error") {
    return <p className="language-meter-state">GitHub language data unavailable.</p>;
  }

  if (!languages?.length) {
    return <p className="language-meter-state">No language data yet.</p>;
  }

  return (
    <div className="language-meter" aria-label="Languages detected from GitHub">
      <div className="language-meter-heading">
        <span>GitHub languages</span>
        <span>by code volume</span>
      </div>
      <div className="language-meter-track" aria-hidden="true">
        {languages.map((language, index) => (
          <span
            className="language-meter-segment"
            key={language.name}
            style={{ width: `${language.percentage}%` }}
            data-language-index={index % 4}
          />
        ))}
      </div>
      <ul className="language-meter-list">
        {languages.map((language, index) => (
          <li key={language.name}>
            <span className="language-meter-dot" data-language-index={index % 4} aria-hidden="true" />
            <span>{language.name}</span>
            <span className="language-meter-percent">{language.percentage}%</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
