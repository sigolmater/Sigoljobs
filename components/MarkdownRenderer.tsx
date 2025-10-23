import React, { useState } from 'react';

interface MarkdownRendererProps {
  content: string;
  onAction: (action: string) => void;
}

const CopyButton: React.FC<{ text: string }> = ({ text }) => {
    const [copied, setCopied] = useState(false);
    const handleCopy = () => {
        navigator.clipboard.writeText(text);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };
    return (
        <button 
            onClick={handleCopy} 
            className="absolute top-2 right-2 p-1.5 bg-[var(--color-bg-light)] hover:bg-[var(--color-border)] rounded-md text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] text-xs transition-colors"
            aria-label="Copy code"
        >
            {copied ? '복사됨!' : '복사'}
        </button>
    );
};

const CodeBlock: React.FC<{ language: string; code: string }> = ({ language, code }) => (
    <div className="relative bg-[var(--color-bg-deep)] rounded-lg my-4 border border-[var(--color-border)]">
        <div style={{ fontFamily: 'var(--font-sans)' }} className="text-xs text-[var(--color-text-secondary)] bg-[var(--color-bg-light)] px-4 py-1 rounded-t-lg border-b border-[var(--color-border)]">{language || 'code'}</div>
        <pre className="p-4 text-sm text-[var(--color-text-primary)] overflow-x-auto font-mono">
            <code>{code}</code>
        </pre>
        <CopyButton text={code} />
    </div>
);

const ActionButton: React.FC<{ text: string; onAction: (action: string) => void }> = ({ text, onAction }) => {
    const emojiMatch = text.match(/^(\s*([▶️🔄🎭⚖️🎯🚀✅🔁])\s*)/);
    const label = text.replace(/^(\s*([▶️🔄🎭⚖️🎯🚀✅🔁])\s*)/, '').trim();
    
    return (
      <button
        onClick={() => onAction(label)}
        className="w-full text-left p-3 my-1 bg-[var(--color-bg-light)] hover:bg-[var(--color-bg-light)]/80 rounded-md transition-colors duration-200 text-sm text-[var(--color-accent-primary)] hover:text-opacity-80 font-medium border border-[var(--color-border)] hover:border-[var(--color-accent-primary)]/50"
        style={{ fontFamily: 'var(--font-serif)' }}
      >
        <span className="mr-2">{emojiMatch ? emojiMatch[2] : '▶️'}</span> {label}
      </button>
    );
};

export const MarkdownRenderer: React.FC<MarkdownRendererProps> = ({ content, onAction }) => {
  const parts = content.split(/(```[\s\S]*?```)/g);

  const renderTextPart = (text: string) => {
    const lines = text.split('\n').filter(line => line.trim() !== '');
    return lines.map((line, index) => {
      if (line.startsWith('### ')) {
        return <h3 key={index} style={{fontFamily: 'var(--font-sans)'}} className="text-lg font-bold text-[var(--color-text-primary)] mt-4 mb-2">{line.substring(4)}</h3>;
      }
      if (line.startsWith('## ')) {
        return <h2 key={index} style={{fontFamily: 'var(--font-sans)'}} className="text-xl font-bold text-[var(--color-accent-primary)] mt-6 mb-3">{line.substring(3)}</h2>;
      }
      if (line.match(/^(\s*([▶️🔄🎭⚖️🎯🚀✅🔁])\s*)/)) {
        return <ActionButton key={index} text={line} onAction={onAction} />;
      }
      return <p key={index} style={{fontFamily: 'var(--font-serif)'}} className="my-2 text-[var(--color-text-primary)] leading-relaxed font-light">{line}</p>;
    });
  };

  return (
    <div>
      {parts.map((part, index) => {
        const codeBlockMatch = part.match(/^```(\w*)\n([\s\S]*?)```$/);
        if (codeBlockMatch) {
          const [, language, code] = codeBlockMatch;
          return <CodeBlock key={index} language={language} code={code.trim()} />;
        }
        return <div key={index}>{renderTextPart(part)}</div>;
      })}
    </div>
  );
};