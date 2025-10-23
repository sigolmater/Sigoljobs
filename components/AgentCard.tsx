import React from 'react';
import type { Agent, AgentMachineResponse } from '../types';

interface AgentCardProps {
  agent: Agent;
  response: AgentMachineResponse | string;
  isLoading: boolean;
}

const LoadingSkeleton: React.FC = () => (
    <div className="space-y-3 animate-pulse">
        <div className="h-4 bg-[var(--color-bg-light)] rounded w-3/4"></div>
        <div className="h-4 bg-[var(--color-bg-light)] rounded w-full"></div>
        <div className="h-4 bg-[var(--color-bg-light)] rounded w-1/2"></div>
        <div className="h-2.5 bg-[var(--color-bg-light)] rounded-full w-full mt-2"></div>
    </div>
);


export const AgentCard: React.FC<AgentCardProps> = ({ agent, response, isLoading }) => {
  const { name, specialty, Icon } = agent;

  const renderContent = () => {
    if (isLoading) {
      return <LoadingSkeleton />;
    }
    if (typeof response === 'string') {
      return <p className="text-red-400" style={{ fontFamily: 'var(--font-serif)' }}>{response}</p>;
    }

    const { core_analysis, key_recommendation, confidence_score } = response;
    const confidencePercentage = confidence_score * 100;
    
    return (
      <div className="space-y-3" style={{ fontFamily: 'var(--font-serif)' }}>
        <p style={{fontFamily: 'var(--font-sans)'}} className="font-semibold text-[var(--color-text-secondary)]">핵심 분석:</p>
        <p className="text-[var(--color-text-primary)] font-light">{core_analysis}</p>
        <p style={{fontFamily: 'var(--font-sans)'}} className="font-semibold text-[var(--color-text-secondary)] pt-2">주요 권고:</p>
        <p className="text-[var(--color-text-primary)] font-light">{key_recommendation}</p>
        <div className="pt-2">
           <p className="text-xs text-[var(--color-text-secondary)] mb-1">신뢰도: {confidencePercentage.toFixed(0)}%</p>
           <div className="w-full bg-[var(--color-bg-light)] rounded-full h-1.5">
               <div className="bg-[var(--color-accent-secondary)] h-1.5 rounded-full" style={{width: `${confidencePercentage}%`}}></div>
           </div>
        </div>
      </div>
    );
  };
  
  return (
    <div className="flex flex-col p-4 bg-[var(--color-bg-medium)] rounded-lg border border-[var(--color-border)] h-full shadow-md transition-all duration-300 hover:border-[var(--color-accent-primary)]/50 hover:shadow-lg">
      <div className="flex items-center mb-3">
        <Icon className="w-8 h-8 mr-3 text-[var(--color-accent-primary)]" />
        <h3 style={{fontFamily: 'var(--font-sans)'}} className="font-bold text-xl text-[var(--color-text-primary)]">{name}</h3>
      </div>
      <p style={{fontFamily: 'var(--font-sans)'}} className="text-xs text-[var(--color-text-secondary)] mb-4 italic font-light">{specialty}</p>
      <div className="flex-grow text-sm text-[var(--color-text-primary)] leading-relaxed">
        {renderContent()}
      </div>
    </div>
  );
};