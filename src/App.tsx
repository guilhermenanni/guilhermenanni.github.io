import { useState, useEffect } from 'react';
import { LanguageProvider, useLanguage } from './components/LanguageContext';
import { Sidebar } from './components/Sidebar';
import { Terminal } from './components/Terminal';
import { ProjectCard } from './components/ProjectCard';
import type { Project } from './components/ProjectCard';
import './App.css';

// Project list data
const featuredProjects: Project[] = [
  {
    title: "DraftMe",
    descriptionPt: "Vitrine digital (web e mobile) desenvolvida como TCC no curso técnico de Análise e Desenvolvimento de Sistemas para conectar atletas em ascensão a recrutadores e olheiros esportivos.",
    descriptionEn: "A digital showcase system (web & mobile) developed as a capstone project (TCC) to connect aspiring athletes with sports recruiters and talent scouts.",
    stack: ["HTML", "CSS", "PHP", "SQL", "JavaScript", "React Native"],
    githubUrl: "https://github.com/guilhermenanni/DraftMe"
  },
  {
    title: "network-homelab-security",
    descriptionPt: "Uma série de testes feitos em um ambiente de redes controlado, com o objetivo de aprender e aplicar conceitos de segurança de redes.",
    descriptionEn: "A series of tests conducted in a controlled network environment to learn and apply network security concepts.",
    stack: ["Nmap", "Wireshark", "Nmap", "Ettercap"],
    githubUrl: "https://github.com/guilhermenanni/network-homelab-security"
  }
];

function AppContent() {
  const { t } = useLanguage();
  const [theme, setTheme] = useState<string>(() => {
    const saved = localStorage.getItem('portfolio_theme');
    return saved || 'mono';
  });

  // Apply theme class to document body
  useEffect(() => {
    document.body.className = '';
    if (theme !== 'mono') {
      document.body.classList.add(`theme-${theme}`);
    }
    localStorage.setItem('portfolio_theme', theme);
  }, [theme]);

  return (
    <>
      {/* Subtle scanline CRT overlay */}
      <div className="scanlines"></div>

      <div className="layout">
        {/* Left column - Sidebar info and controls */}
        <Sidebar currentTheme={theme} onChangeTheme={setTheme} />

        {/* Right column - Interactive elements and listings */}
        <main className="content">

          {/* Section 1: Interactive Shell */}
          <Terminal currentTheme={theme} onChangeTheme={setTheme} />

          {/* Section 2: Projects Showcase */}
          <section id="projects">
            <h2
              className="accent-glow"
              style={{
                fontSize: '1.5rem',
                marginBottom: '20px',
                borderBottom: 'var(--border)',
                paddingBottom: '8px'
              }}
            >
              // {t('projectsTitle')}
            </h2>
            <div>
              {featuredProjects.map((project, idx) => (
                <ProjectCard key={idx} project={project} />
              ))}
            </div>
          </section>

        </main>
      </div>
    </>
  );
}

function App() {
  return (
    <LanguageProvider>
      <AppContent />
    </LanguageProvider>
  );
}

export default App;
