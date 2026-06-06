import React from 'react';
import { useLanguage } from './LanguageContext';

export interface Project {
  title: string;
  descriptionPt: string;
  descriptionEn: string;
  stack: string[];
  githubUrl: string;
  demoUrl?: string;
}

interface ProjectCardProps {
  project: Project;
}

export const ProjectCard: React.FC<ProjectCardProps> = ({ project }) => {
  const { language } = useLanguage();
  const description = language === 'pt' ? project.descriptionPt : project.descriptionEn;

  return (
    <div className="brutalist-card border-glow" style={{ marginBottom: '24px' }}>
      <div className="brutalist-card-header">
        <h3 className="accent-glow" style={{ fontSize: '1.2rem', margin: 0 }}>{project.title}</h3>
        <span 
          style={{ 
            fontSize: '0.75rem', 
            border: '1px solid var(--border-color)', 
            padding: '2px 6px',
            textTransform: 'uppercase'
          }}
        >
          active_
        </span>
      </div>
      
      <p style={{ marginBottom: '16px', fontSize: '0.95rem' }}>
        {description}
      </p>
      
      <div 
        style={{ 
          display: 'flex', 
          flexWrap: 'wrap', 
          gap: '8px', 
          marginBottom: '20px' 
        }}
      >
        {project.stack.map((tech) => (
          <span 
            key={tech} 
            style={{ 
              fontSize: '0.8rem', 
              backgroundColor: 'var(--sidebar-bg)', 
              color: 'var(--text)', 
              border: '1px solid var(--border-color)', 
              padding: '2px 8px',
              fontFamily: 'var(--font-mono)'
            }}
          >
            {tech}
          </span>
        ))}
      </div>
      
      <div style={{ display: 'flex', gap: '12px' }}>
        <a 
          href={project.githubUrl} 
          target="_blank" 
          rel="noopener noreferrer" 
          className="btn-brutalist"
        >
          &lt; Code /&gt;
        </a>
        {project.demoUrl && (
          <a 
            href={project.demoUrl} 
            target="_blank" 
            rel="noopener noreferrer" 
            className="btn-brutalist"
          >
            Live Demo_
          </a>
        )}
      </div>
    </div>
  );
};
