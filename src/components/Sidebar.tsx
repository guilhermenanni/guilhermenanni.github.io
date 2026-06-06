import React from 'react';
import { useLanguage } from './LanguageContext';
import avatarImg from '../assets/avatar.jpeg';

interface SidebarProps {
  currentTheme: string;
  onChangeTheme: (theme: string) => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ currentTheme, onChangeTheme }) => {
  const { language, setLanguage, t } = useLanguage();

  const themes = [
    { id: 'mono', label: 'Mono' },
    { id: 'matrix', label: 'Matrix' },
    { id: 'dracula', label: 'Dracula' },
    { id: 'nord', label: 'Nord' }
  ];

  return (
    <aside className="sidebar">
      <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>

        {/* Avatar Container */}
        <div
          style={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            border: 'var(--border)',
            padding: '16px',
            backgroundColor: 'var(--terminal-bg)',
            boxShadow: 'var(--shadow)'
          }}
        >
          <img
            src={avatarImg}
            alt="Guilherme Nanni"
            style={{
              width: '100%',
              maxWidth: '240px',
              height: 'auto',
              border: '1px solid var(--border-color)',
              filter: currentTheme === 'matrix' ? 'grayscale(100%) brightness(1.2) contrast(1.2)' : 'none'
            }}
          />
        </div>

        {/* Bio Details */}
        <div
          className="brutalist-card"
          style={{
            padding: '16px',
            backgroundColor: 'transparent',
            boxShadow: 'var(--shadow)'
          }}
        >
          <h1
            style={{
              fontSize: '1.75rem',
              marginBottom: '4px',
              letterSpacing: '-0.5px',
              textTransform: 'none',
              fontWeight: '900'
            }}
            className="accent-glow"
          >
            Guilherme Nanni
          </h1>

          <div
            style={{
              fontSize: '0.85rem',
              color: 'var(--text-muted)',
              marginBottom: '16px',
              fontStyle: 'italic'
            }}
          >
            {t('role')}
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', fontSize: '0.85rem' }}>
            <p>{t('bioLine1')}</p>
            <p>{t('bioLine2')}</p>
          </div>
        </div>

        {/* Configurations Box */}
        <div className="brutalist-card" style={{ padding: '16px', backgroundColor: 'transparent' }}>
          {/* Language Toggle */}
          <div style={{ marginBottom: '16px' }}>
            <div style={{ fontSize: '0.75rem', fontWeight: 'bold', marginBottom: '8px', textTransform: 'uppercase' }}>
              &gt;_ language
            </div>
            <div style={{ display: 'flex', gap: '8px' }}>
              <button
                onClick={() => setLanguage('pt')}
                className="btn-brutalist"
                style={{
                  flex: 1,
                  backgroundColor: language === 'pt' ? 'var(--accent)' : 'transparent',
                  color: language === 'pt' ? 'var(--accent-text)' : 'var(--text)',
                  boxShadow: language === 'pt' ? 'none' : 'var(--shadow)',
                  transform: language === 'pt' ? 'translate(var(--shadow-offset), var(--shadow-offset))' : 'none'
                }}
              >
                PT-BR
              </button>
              <button
                onClick={() => setLanguage('en')}
                className="btn-brutalist"
                style={{
                  flex: 1,
                  backgroundColor: language === 'en' ? 'var(--accent)' : 'transparent',
                  color: language === 'en' ? 'var(--accent-text)' : 'var(--text)',
                  boxShadow: language === 'en' ? 'none' : 'var(--shadow)',
                  transform: language === 'en' ? 'translate(var(--shadow-offset), var(--shadow-offset))' : 'none'
                }}
              >
                EN-US
              </button>
            </div>
          </div>

          {/* Theme Selector */}
          <div>
            <div style={{ fontSize: '0.75rem', fontWeight: 'bold', marginBottom: '8px', textTransform: 'uppercase' }}>
              &gt;_ styling
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
              {themes.map((theme) => (
                <button
                  key={theme.id}
                  onClick={() => onChangeTheme(theme.id)}
                  className="btn-brutalist"
                  style={{
                    backgroundColor: currentTheme === theme.id ? 'var(--accent)' : 'transparent',
                    color: currentTheme === theme.id ? 'var(--accent-text)' : 'var(--text)',
                    boxShadow: currentTheme === theme.id ? 'none' : 'var(--shadow)',
                    transform: currentTheme === theme.id ? 'translate(var(--shadow-offset), var(--shadow-offset))' : 'none',
                    fontSize: '0.75rem',
                    padding: '6px'
                  }}
                >
                  {theme.label}
                </button>
              ))}
            </div>
          </div>
        </div>

      </div>

      {/* Social / Contact links */}
      <div
        style={{
          marginTop: '32px',
          display: 'flex',
          flexDirection: 'column',
          gap: '8px'
        }}
      >
        <a
          href="https://github.com/guilhermenanni"
          target="_blank"
          rel="noopener noreferrer"
          className="btn-brutalist"
          style={{ width: '100%', justifyContent: 'flex-start' }}
        >
          &gt; GitHub
        </a>
        <a
          href="https://www.linkedin.com/in/guilherme-nanni-46b3b5316/"
          target="_blank"
          rel="noopener noreferrer"
          className="btn-brutalist"
          style={{ width: '100%', justifyContent: 'flex-start' }}
        >
          &gt; LinkedIn
        </a>
        <a
          href="mailto:guilhermenanni.dev@gmail.com"
          className="btn-brutalist"
          style={{ width: '100%', justifyContent: 'flex-start' }}
        >
          &gt; Email
        </a>
      </div>
    </aside>
  );
};
