import { useState, useEffect, useRef } from 'react';
import { useScrollSpy } from '../hooks/useScrollSpy';

const SECTION_IDS = ['hero', 'projects', 'contact'];

const NAV_LINKS = [
  { id: 'hero', label: 'Home' },
  { id: 'projects', label: 'Projects' },
  { id: 'contact', label: 'Contact' },
];

export function Navbar() {
  const activeSection = useScrollSpy(SECTION_IDS);
  const [scrolled, setScrolled] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const menuRef = useRef(null);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleNavClick = (id) => {
    const element = document.getElementById(id);
    if (element) {
      const top = element.getBoundingClientRect().top + window.scrollY - 80;
      window.scrollTo({ top, behavior: 'smooth' });
    }
    setIsMenuOpen(false);
  };

  return (
    <>
      <nav className={`fixed top-4 left-1/2 -translate-x-1/2 z-50 transition-all duration-300`}>
        <div className="flex items-center gap-1 px-2 py-2 rounded-full backdrop-blur-xl bg-white/[0.04] border border-white/[0.07] shadow-[0_8px_32px_rgba(0,0,0,0.5),inset_0_1px_0_rgba(255,255,255,0.05)]">
          <button
            onClick={() => handleNavClick('hero')}
            className="cursor-target cursor-pointer bg-transparent border-none px-3 font-mono text-sm text-accent-300 font-medium"
          >
            claudia.web.id
          </button>

          <div className="hidden md:block w-px h-5 bg-white/10" />

          <ul className="hidden md:flex items-center gap-1 list-none m-0 p-0">
            {NAV_LINKS.map((link) => (
              <li key={link.id}>
                <button
                  onClick={() => handleNavClick(link.id)}
                  aria-current={activeSection === link.id ? 'page' : undefined}
                  className={`cursor-target text-sm px-3 py-1.5 rounded-full bg-transparent border-none cursor-pointer transition-all ${
                    activeSection === link.id
                      ? 'text-text-primary bg-white/[0.07]'
                      : 'text-text-caption hover:text-text-secondary hover:bg-white/[0.04]'
                  }`}
                >
                  {link.label}
                </button>
              </li>
            ))}
          </ul>

          <div className="hidden md:block w-px h-5 bg-white/10" />

          <a
            href="https://github.com/Zaineedyou"
            target="_blank"
            rel="noopener noreferrer"
            className="cursor-target hidden md:inline-flex px-4 py-1.5 rounded-full bg-accent-500/10 text-accent-300 text-sm font-medium hover:bg-accent-500/20 hover:text-accent-200 transition-all border border-accent-500/20"
          >
            GitHub
          </a>

          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            aria-expanded={isMenuOpen}
            aria-label="Toggle navigation"
            className="md:hidden flex flex-col gap-1.5 p-2.5 bg-transparent border-none cursor-pointer"
          >
            <span className={`block w-5 h-0.5 bg-text-primary transition-transform duration-200 ${isMenuOpen ? 'rotate-45 translate-y-[7px]' : ''}`} />
            <span className={`block w-5 h-0.5 bg-text-primary transition-opacity duration-200 ${isMenuOpen ? 'opacity-0' : ''}`} />
            <span className={`block w-5 h-0.5 bg-text-primary transition-transform duration-200 ${isMenuOpen ? '-rotate-45 -translate-y-[7px]' : ''}`} />
          </button>
        </div>
      </nav>

      {isMenuOpen && (
        <div className="fixed inset-0 bg-black/50 md:hidden z-40" onClick={() => setIsMenuOpen(false)} />
      )}

      <div
        ref={menuRef}
        className={`fixed top-0 right-0 bottom-0 w-64 bg-bg-surface/95 backdrop-blur-xl border-l border-white/[0.06] z-50 md:hidden transition-transform duration-300 ${
          isMenuOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        <div className="flex flex-col p-8 pt-20 gap-2">
          {NAV_LINKS.map((link) => (
            <button
              key={link.id}
              onClick={() => handleNavClick(link.id)}
              className={`text-left py-3 px-4 rounded-xl text-base font-medium bg-transparent border-none cursor-pointer transition-colors ${
                activeSection === link.id
                  ? 'text-text-primary bg-white/[0.06]'
                  : 'text-text-caption hover:text-text-secondary'
              }`}
            >
              {link.label}
            </button>
          ))}
          <a
            href="https://github.com/Zaineedyou"
            target="_blank"
            rel="noopener noreferrer"
            className="mt-6 py-3 px-4 rounded-xl bg-accent-500 text-white text-base font-semibold text-center hover:bg-accent-400 transition-colors"
          >
            GitHub
          </a>
        </div>
      </div>
    </>
  );
}
