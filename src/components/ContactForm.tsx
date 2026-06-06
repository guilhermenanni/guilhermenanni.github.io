import React, { useState } from 'react';
import { useLanguage } from './LanguageContext';

export const ContactForm: React.FC = () => {
  const { t } = useLanguage();
  const [formData, setFormData] = useState({ name: '', email: '', message: '' });
  const [status, setStatus] = useState<'idle' | 'transmitting' | 'success'>('idle');
  const [logs, setLogs] = useState<string[]>([]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.message) return;

    setStatus('transmitting');
    setLogs([]);

    const logSteps = [
      `$ sudo systemctl status connections.service`,
      `[info] Initiating socket connection to gui-server...`,
      `[info] Source: client@${formData.email.replace(/[^a-zA-Z0-9.@]/g, '')}`,
      `[info] Packing envelope size: ${JSON.stringify(formData.message).length} bytes`,
      `[info] Pinging 127.0.0.1 with payload...`,
      `[ok] Connection handshake accepted.`,
      `[info] Writing log entry to /var/log/messages...`,
      `[ok] System: Message dispatched successfully.`
    ];

    let step = 0;
    const interval = setInterval(() => {
      if (step < logSteps.length) {
        setLogs((prev) => [...prev, logSteps[step]]);
        step++;
      } else {
        clearInterval(interval);
        setStatus('success');
        setFormData({ name: '', email: '', message: '' });
      }
    }, 350);
  };

  return (
    <div className="brutalist-card border-glow">
      <div className="brutalist-card-header">
        <h2 style={{ fontSize: '1.25rem', margin: 0 }}>{t('contactTitle')}</h2>
        <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>ssh_mail_v1.0</span>
      </div>
      <p className="text-muted" style={{ marginBottom: '20px', fontSize: '0.85rem' }}>
        {t('contactSubtitle')}
      </p>

      {status !== 'success' && (
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div>
            <label 
              htmlFor="name" 
              style={{ display: 'block', marginBottom: '6px', fontSize: '0.85rem', fontWeight: 'bold' }}
            >
              {t('contactName')} &gt;
            </label>
            <input
              id="name"
              type="text"
              required
              disabled={status === 'transmitting'}
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              style={{
                width: '100%',
                backgroundColor: 'var(--terminal-bg)',
                color: 'var(--text)',
                border: 'var(--border)',
                padding: '8px 12px',
                fontFamily: 'var(--font-mono)',
                outline: 'none',
              }}
              placeholder="e.g. host.local"
            />
          </div>

          <div>
            <label 
              htmlFor="email" 
              style={{ display: 'block', marginBottom: '6px', fontSize: '0.85rem', fontWeight: 'bold' }}
            >
              {t('contactEmail')} &gt;
            </label>
            <input
              id="email"
              type="email"
              required
              disabled={status === 'transmitting'}
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              style={{
                width: '100%',
                backgroundColor: 'var(--terminal-bg)',
                color: 'var(--text)',
                border: 'var(--border)',
                padding: '8px 12px',
                fontFamily: 'var(--font-mono)',
                outline: 'none',
              }}
              placeholder="e.g. user@domain.com"
            />
          </div>

          <div>
            <label 
              htmlFor="message" 
              style={{ display: 'block', marginBottom: '6px', fontSize: '0.85rem', fontWeight: 'bold' }}
            >
              {t('contactMessage')} &gt;
            </label>
            <textarea
              id="message"
              required
              rows={4}
              disabled={status === 'transmitting'}
              value={formData.message}
              onChange={(e) => setFormData({ ...formData, message: e.target.value })}
              style={{
                width: '100%',
                backgroundColor: 'var(--terminal-bg)',
                color: 'var(--text)',
                border: 'var(--border)',
                padding: '8px 12px',
                fontFamily: 'var(--font-mono)',
                outline: 'none',
                resize: 'vertical',
              }}
              placeholder="Write your text payload here..."
            />
          </div>

          <button
            type="submit"
            disabled={status === 'transmitting'}
            className="btn-brutalist"
            style={{ alignSelf: 'flex-start', marginTop: '8px' }}
          >
            {status === 'transmitting' ? t('contactSending') : t('contactSend')}
          </button>
        </form>
      )}

      {logs.length > 0 && (
        <div 
          style={{
            marginTop: '20px',
            padding: '12px',
            backgroundColor: 'var(--terminal-bg)',
            border: 'var(--border)',
            fontFamily: 'var(--font-mono)',
            fontSize: '0.8rem',
            color: 'var(--terminal-text)',
            maxHeight: '200px',
            overflowY: 'auto',
          }}
        >
          {logs.map((log, index) => (
            <div key={index} style={{ marginBottom: '4px' }}>{log}</div>
          ))}
          {status === 'transmitting' && (
            <div style={{ display: 'inline-block', width: '8px', height: '15px', backgroundColor: 'var(--terminal-text)', animation: 'blink 1s step-end infinite' }}></div>
          )}
        </div>
      )}

      {status === 'success' && (
        <div style={{ textAlign: 'center', padding: '20px 0' }}>
          <p style={{ color: 'var(--terminal-prompt)', fontWeight: 'bold', marginBottom: '16px' }}>
            {t('contactSuccess')}
          </p>
          <button
            onClick={() => setStatus('idle')}
            className="btn-brutalist"
          >
            &lt; Send Another Message /&gt;
          </button>
        </div>
      )}
    </div>
  );
};
