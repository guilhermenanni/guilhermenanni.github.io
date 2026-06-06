import React, { useState, useRef, useEffect } from 'react';
import { useLanguage } from './LanguageContext';
import { translations } from './translations';

interface TerminalLine {
  text: string;
  type: 'input' | 'output' | 'error' | 'success';
  customRender?: () => React.ReactNode;
}

// Record the session start time (when the script/bundle loaded)
const sessionStartTime = Date.now();

const calculateTime = (language: 'pt' | 'en', sessionStartTime: number) => {
  const uptimeMs = Date.now() - sessionStartTime;
  const totalSeconds = Math.floor(uptimeMs / 1000);
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;
  
  let uptimeStr = '';
  if (hours > 0) {
    uptimeStr += `${hours}h `;
  }
  if (minutes > 0 || hours > 0) {
    uptimeStr += `${minutes}m `;
  }
  uptimeStr += `${seconds}s`;

  const now = new Date();
  const timeStr = now.toLocaleTimeString(language === 'pt' ? 'pt-BR' : 'en-US', {
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: false
  });

  return { uptimeStr, timeStr };
};

const NeofetchBlock: React.FC<{
  language: 'pt' | 'en';
  currentTheme: string;
  sessionStartTime: number;
}> = ({ language, currentTheme, sessionStartTime }) => {
  const [timeState, setTimeState] = useState(() => calculateTime(language, sessionStartTime));

  useEffect(() => {
    const interval = setInterval(() => {
      setTimeState(calculateTime(language, sessionStartTime));
    }, 1000);
    return () => clearInterval(interval);
  }, [language, sessionStartTime]);

  const isPt = language === 'pt';
  const shellStr = 'bash (React Terminal)';
  const localeStr = isPt ? 'Brasil (SP)' : 'Brazil (SP)';
  const primaryStr = isPt ? 'Sistemas & Dados' : 'Systems & Data';
  const secondaryStr = isPt ? 'Segurança & Redes' : 'Security & Networks';

  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: '24px', margin: '12px 0' }}>
      {/* GitHub Logo SVG */}
      <svg 
        height="64" 
        viewBox="0 0 16 16" 
        version="1.1" 
        width="64" 
        aria-hidden="true"
        style={{ fill: 'var(--terminal-text)', flexShrink: 0 }}
      >
        <path d="M8 0c4.42 0 8 3.58 8 8a8.013 8.013 0 0 1-5.45 7.59c-.4.08-.55-.17-.55-.38 0-.27.01-1.13.01-2.2 0-.75-.25-1.23-.54-1.48 1.78-.2 3.65-.88 3.65-3.95 0-.88-.31-1.59-.82-2.15.08-.2.36-1.02-.08-2.12 0 0-.67-.22-2.2.82-.64-.18-1.32-.27-2-.27-.68 0-1.36.09-2 .27-1.53-1.03-2.2-.82-2.2-.82-.44 1.1-.16 1.92-.08 2.12-.51.56-.82 1.28-.82 2.15 0 3.06 1.86 3.75 3.64 3.95-.23.2-.44.55-.51 1.07-.46.21-1.61.55-2.33-.66-.15-.24-.6-.83-1.23-.82-.67.01-.27.38.01.53.34.19.73.9.82 1.13.16.45.68 1.35 2.68.91 0 .68.01 1.33.01 1.52 0 .21-.15.46-.55.38A8.012 8.012 0 0 1 0 8c0-4.42 3.58-8 8-8z" />
      </svg>
      {/* Neofetch Text details */}
      <pre style={{ margin: 0, fontFamily: 'var(--font-mono)', color: 'var(--terminal-text)', lineHeight: '1.4', fontSize: '0.85rem' }}>
        <span style={{ color: 'var(--terminal-prompt)', fontWeight: 'bold' }}>guest@gui-server</span><br />
        ----------------<br />
        OS: Debian GNU/Linux<br />
        Uptime: {timeState.uptimeStr}<br />
        {isPt ? 'Hora Local' : 'Local Time'}: {timeState.timeStr}<br />
        Shell: {shellStr}<br />
        Locale: {localeStr}<br />
        Primary: {primaryStr}<br />
        Secondary: {secondaryStr}<br />
        Theme: {currentTheme.toUpperCase()}<br />
        Language: {language.toUpperCase()}
      </pre>
    </div>
  );
};

// Generate neofetch content with Github SVG logo next to details
const createNeofetchLine = (language: 'pt' | 'en', currentTheme: string): TerminalLine => {
  const isPt = language === 'pt';
  const initialTime = calculateTime(language, sessionStartTime);
  const shellStr = 'bash (React Terminal)';
  const localeStr = isPt ? 'Brasil (SP)' : 'Brazil (SP)';
  const primaryStr = isPt ? 'Sistemas & Dados' : 'Systems & Data';
  const secondaryStr = isPt ? 'Segurança & Redes' : 'Security & Networks';

  const plainText = `guest@gui-server
----------------
OS: Debian GNU/Linux
Uptime: ${initialTime.uptimeStr}
${isPt ? 'Hora Local' : 'Local Time'}: ${initialTime.timeStr}
Shell: ${shellStr}
Locale: ${localeStr}
Primary: ${primaryStr}
Secondary: ${secondaryStr}
Theme: ${currentTheme.toUpperCase()}
Language: ${language.toUpperCase()}`;

  return {
    text: plainText,
    type: 'output',
    customRender: () => (
      <NeofetchBlock 
        language={language} 
        currentTheme={currentTheme} 
        sessionStartTime={sessionStartTime} 
      />
    )
  };
};

interface TerminalProps {
  currentTheme: string;
  onChangeTheme: (theme: string) => void;
}

export const Terminal: React.FC<TerminalProps> = ({ currentTheme, onChangeTheme }) => {
  const { language, setLanguage, t } = useLanguage();
  const [history, setHistory] = useState<TerminalLine[]>(() => {
    const savedLang = localStorage.getItem('portfolio_lang');
    const initialLang: 'pt' | 'en' = (savedLang === 'en' || savedLang === 'pt') ? savedLang : 'pt';
    return [
      { text: 'System initialized. Type "help" to list available commands.', type: 'success' as const },
      { text: 'guest@gui-server:~$ neofetch', type: 'input' as const },
      createNeofetchLine(initialLang, currentTheme)
    ];
  });
  const [inputValue, setInputValue] = useState('');
  const [cmdHistory, setCmdHistory] = useState<string[]>(['neofetch']);
  const [historyPointer, setHistoryPointer] = useState<number>(1);

  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    // Scroll to bottom of terminal container on updates
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollTop = scrollContainerRef.current.scrollHeight;
    }
  }, [history]);

  const handleContainerClick = () => {
    inputRef.current?.focus();
  };

  const executeCommand = (cmdStr: string) => {
    const trimmed = cmdStr.trim();
    if (!trimmed) return;

    const newHistory = [...history, { text: `guest@gui-server:~$ ${trimmed}`, type: 'input' as const }];

    // Add to command history list
    const updatedCmdHistory = [...cmdHistory, trimmed];
    setCmdHistory(updatedCmdHistory);
    setHistoryPointer(updatedCmdHistory.length);

    const parts = trimmed.split(' ');
    const command = parts[0].toLowerCase();
    const args = parts.slice(1);

    let output: TerminalLine[];

    switch (command) {
      case 'help':
        output = t('termHelp').split('\n').map(line => ({ text: line, type: 'output' as const }));
        break;
      case 'clear':
        setHistory([]);
        setInputValue('');
        return;
      case 'about':
        output = [
          { text: `[${t('aboutHeading')}]`, type: 'success' as const },
          { text: t('bioLine1'), type: 'output' as const },
          { text: t('bioLine2'), type: 'output' as const },
          { text: '', type: 'output' as const },
          { text: `"${t('quoteText')}"`, type: 'success' as const },
          { text: '  — Terry A. Davis', type: 'success' as const }
        ];
        break;
      case 'skills':
        output = [
          { text: `[${t('skillsHeading')}]`, type: 'success' as const },
          ...t('skillsList').split('\n').map(line => ({ text: line, type: 'output' as const }))
        ];
        break;
      case 'neofetch':
        output = [createNeofetchLine(language, currentTheme)];
        break;
      case 'projects':
        output = [
          { text: `[${t('projectsHeading')}]`, type: 'success' as const },
          { text: '1. DraftMe - TCC (PHP • SQL • React Native) -> View in Projects section', type: 'output' as const },
          { text: '2. network-homelab-security - Controlled homelab network security tests -> View in Projects section', type: 'output' as const }
        ];
        break;
      case 'theme':
        if (args.length === 0) {
          output = [{ text: t('themeNotFound'), type: 'error' }];
        } else {
          const desired = args[0].toLowerCase();
          if (['mono', 'matrix', 'dracula', 'nord'].includes(desired)) {
            onChangeTheme(desired);
            output = [{ text: `${t('themeChanged')}${desired}`, type: 'success' }];
          } else {
            output = [{ text: t('themeNotFound'), type: 'error' }];
          }
        }
        break;
      case 'lang':
        if (args.length === 0) {
          output = [{ text: t('langNotFound'), type: 'error' }];
        } else {
          const desired = args[0].toLowerCase();
          if (desired === 'pt' || desired === 'en') {
            setLanguage(desired as 'pt' | 'en');
            // We use standard messages here as translations will update in next tick
            const msg = desired === 'pt'
              ? translations.pt.langChanged
              : translations.en.langChanged;
            output = [{ text: msg, type: 'success' }];
          } else {
            output = [{ text: t('langNotFound'), type: 'error' }];
          }
        }
        break;
      default:
        output = [{ text: `${t('termUnknown')}"${command}"${t('termUnknownHelp')}`, type: 'error' }];
        break;
    }

    setHistory([...newHistory, ...output]);
    setInputValue('');
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      executeCommand(inputValue);
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      if (historyPointer > 0) {
        const newPointer = historyPointer - 1;
        setHistoryPointer(newPointer);
        setInputValue(cmdHistory[newPointer] || '');
      }
    } else if (e.key === 'ArrowDown') {
      e.preventDefault();
      if (historyPointer < cmdHistory.length - 1) {
        const newPointer = historyPointer + 1;
        setHistoryPointer(newPointer);
        setInputValue(cmdHistory[newPointer]);
      } else {
        setHistoryPointer(cmdHistory.length);
        setInputValue('');
      }
    }
  };

  return (
    <div
      className="brutalist-card border-glow"
      onClick={handleContainerClick}
      style={{
        backgroundColor: 'var(--terminal-bg)',
        fontFamily: 'var(--font-mono)',
        fontSize: '0.85rem',
        height: '400px',
        display: 'flex',
        flexDirection: 'column',
        cursor: 'text',
      }}
    >
      <div
        className="brutalist-card-header"
        style={{
          borderBottom: 'var(--border)',
          margin: '-24px -24px 16px -24px',
          padding: '8px 24px',
          backgroundColor: 'var(--sidebar-bg)',
          userSelect: 'none'
        }}
      >
        <div style={{ display: 'flex', gap: '6px' }}>
          <span style={{ width: '10px', height: '10px', borderRadius: '50%', backgroundColor: '#ff5f56' }}></span>
          <span style={{ width: '10px', height: '10px', borderRadius: '50%', backgroundColor: '#ffbd2e' }}></span>
          <span style={{ width: '10px', height: '10px', borderRadius: '50%', backgroundColor: '#27c93f' }}></span>
        </div>
        <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{t('terminalTitle')}</span>
      </div>

      <div
        ref={scrollContainerRef}
        style={{ flexGrow: 1, overflowY: 'auto', marginBottom: '8px' }}
      >
        {history.map((line, idx) => {
          if (line.customRender) {
            return <React.Fragment key={idx}>{line.customRender()}</React.Fragment>;
          }

          let color = 'var(--terminal-text)';
          if (line.type === 'input') color = 'var(--text)';
          if (line.type === 'error') color = '#ff5f56';
          if (line.type === 'success') color = 'var(--terminal-prompt)';

          return (
            <pre
              key={idx}
              style={{
                whiteSpace: 'pre-wrap',
                color,
                margin: 0,
                padding: '1px 0',
                fontFamily: 'var(--font-mono)'
              }}
            >
              {line.text}
            </pre>
          );
        })}
      </div>

      <div style={{ display: 'flex', alignItems: 'center' }}>
        <span style={{ color: 'var(--terminal-prompt)', fontWeight: 'bold', marginRight: '8px', userSelect: 'none' }}>
          guest@gui-server:~$
        </span>
        <div style={{ display: 'flex', flexGrow: 1, position: 'relative' }}>
          <input
            ref={inputRef}
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyDown={handleKeyDown}
            style={{
              width: '100%',
              backgroundColor: 'transparent',
              border: 'none',
              outline: 'none',
              color: 'var(--terminal-text)',
              fontFamily: 'var(--font-mono)',
              fontSize: '0.85rem',
              caretColor: 'transparent', // Custom blinking cursor
            }}
            placeholder={history.length === 0 ? t('terminalPlaceholder') : ''}
            autoComplete="off"
            autoCapitalize="off"
            spellCheck="false"
          />
          {/* Custom blinking block cursor */}
          <span
            style={{
              position: 'absolute',
              left: `${inputValue.length * 8.2}px`, // approximate monospace width per char
              backgroundColor: 'var(--terminal-text)',
              width: '8px',
              height: '15px',
              display: 'inline-block',
              animation: 'blink 1s step-end infinite',
              pointerEvents: 'none',
            }}
          />
        </div>
      </div>

      <style>{`
        @keyframes blink {
          50% { opacity: 0; }
        }
      `}</style>
    </div>
  );
};
