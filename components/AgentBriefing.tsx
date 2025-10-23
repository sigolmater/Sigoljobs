import React from 'react';
import type { ProactiveBriefing } from '../types';
import { BriefingIcon, WorkflowIcon } from './Icons';

interface AgentBriefingProps {
  briefing: ProactiveBriefing;
  onSuggestionDeliberate: (suggestion: string) => void;
}

export const BriefingSkeleton: React.FC = () => (
  <div className="col-span-full p-6 bg-[var(--color-bg-medium)] rounded-lg animate-pulse">
    <div className="flex items-center gap-4 mb-4">
        <div className="w-8 h-8 bg-[var(--color-bg-light)] rounded-md"></div>
        <div className="h-6 bg-[var(--color-bg-light)] rounded w-1/3"></div>
    </div>
    <div className="space-y-4">
        <div className="h-4 bg-[var(--color-bg-light)] rounded w-full"></div>
        <div className="h-4 bg-[var(--color-bg-light)] rounded w-3/4"></div>
        <div className="h-8 bg-[var(--color-bg-light)] rounded-lg w-1/2 mt-6"></div>
        <div className="flex flex-col gap-2 pt-4">
          <div className="h-10 bg-[var(--color-bg-light)] rounded"></div>
          <div className="h-10 bg-[var(--color-bg-light)] rounded"></div>
          <div className="h-10 bg-[var(--color-bg-light)] rounded"></div>
        </div>
    </div>
  </div>
);

export const AgentBriefing: React.FC<AgentBriefingProps> = ({ briefing, onSuggestionDeliberate }) => {
  return (
    <div className="col-span-full p-6 bg-[var(--color-bg-medium)] rounded-lg" style={{ fontFamily: 'var(--font-serif)' }}>
      <div className="flex items-center gap-3 mb-3">
        <BriefingIcon className="w-7 h-7 text-[var(--color-accent-primary)]" />
        <h2 style={{fontFamily: 'var(--font-sans)'}} className="text-2xl font-bold text-[var(--color-text-primary)]">에이전트 선제 브리핑</h2>
      </div>
      <p className="text-sm text-[var(--color-text-secondary)] mb-4 font-light">{briefing.overview}</p>
      
      <div className="my-5 p-4 rounded-lg bg-[var(--color-bg-deep)] border border-[var(--color-accent-primary)]/20">
        <h3 style={{fontFamily: 'var(--font-sans)'}} className="font-bold text-[var(--color-accent-primary)] mb-2 text-lg">핵심 통찰 (核心 洞察)</h3>
        <p className="text-[var(--color-text-primary)] font-light">{briefing.keyInsight}</p>
      </div>

      {briefing.patternDetection?.title && (
          <div className="my-5 p-4 rounded-lg bg-[var(--color-bg-light)]">
              <h3 style={{fontFamily: 'var(--font-sans)'}} className="font-bold text-[var(--color-accent-secondary)] mb-2 text-lg flex items-center gap-2">
                <WorkflowIcon className="w-5 h-5" />
                감지된 패턴
              </h3>
              <p className="text-sm font-semibold text-[var(--color-text-primary)]" style={{fontFamily: 'var(--font-sans)'}}>{briefing.patternDetection.title}</p>
              <p className="text-xs text-[var(--color-text-secondary)] font-light">{briefing.patternDetection.description}</p>
          </div>
      )}

      <div>
        <h3 style={{fontFamily: 'var(--font-sans)'}} className="font-bold text-[var(--color-text-primary)] mb-3 text-lg">개인화된 권고 (個人化 勸告)</h3>
        <div className="flex flex-col gap-2">
            {/* Fix: Property 'suggestedActions' does not exist on type 'ProactiveBriefing'. */}
            {briefing.personalizedRecommendations.map((action, index) => (
                <button
                    key={index}
                    onClick={() => onSuggestionDeliberate(action)}
                    className="w-full text-left p-3 bg-[var(--color-bg-light)] hover:bg-[var(--color-bg-light)]/80 rounded-md transition-colors duration-200 text-sm text-[var(--color-accent-primary)] hover:text-opacity-80 font-medium border border-[var(--color-border)] hover:border-[var(--color-accent-primary)]/50"
                    style={{ fontFamily: 'var(--font-serif)' }}
                >
                    &rarr; {action}
                </button>
            ))}
        </div>
      </div>
    </div>
  );
};