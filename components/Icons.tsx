import React from 'react';

type IconProps = {
  className?: string;
  style?: React.CSSProperties;
};

export const AdmiralIcon: React.FC<IconProps> = ({ className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M12 21l-3-3m3 3l3-3m-3-12v12m0 0l-3 3m3-3l3 3M3 12a9 9 0 1118 0 9 9 0 01-18 0z" />
  </svg>
);

export const QuoteIcon: React.FC<IconProps> = ({ className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M7 8h10M7 12h4m-4 4h10M3 21h18a2 2 0 002-2V5a2 2 0 00-2-2H3a2 2 0 00-2 2v14a2 2 0 002 2z" />
  </svg>
);

export const DataIcon: React.FC<IconProps> = ({ className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M4 7v10c0 2.21 3.582 4 8 4s8-1.79 8-4V7M4 7c0 2.21 3.582 4 8 4s8-1.79 8-4M4 7a8 4 0 018-4 8 4 0 018 4m-8 4v10" />
  </svg>
);

export const ReflectIcon: React.FC<IconProps> = ({ className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M4 4v5h5M20 20v-5h-5M4 11a8 8 0 0114.93-2.93l.07-.07m-2.12 6.06a8 8 0 01-14.93 2.93l-.07.07" />
  </svg>
);

export const ScrollIcon: React.FC<IconProps> = ({ className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
  </svg>
);

export const OmegaIcon: React.FC<IconProps> = ({ className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M4.874 15.126C7.456 18.041 10.957 20 15 20c3.899 0 7.29-1.855 9.126-4.874M19.126 8.874C16.544 5.959 13.043 4 9 4c-3.899 0-7.29 1.855-9.126 4.874" />
  </svg>
);

export const CodeIcon: React.FC<IconProps> = ({ className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
  </svg>
);

export const TurtleShipIcon: React.FC<IconProps> = ({ className }) => (
    <svg viewBox="0 0 200 200" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M72 106L56 122M128 106L144 122" stroke="var(--color-accent-secondary)" strokeWidth="6" strokeLinecap="round"/>
      <path d="M100 24V40M100 176V160" stroke="var(--color-accent-primary)" strokeWidth="6" strokeLinecap="round"/>
      <path d="M162.426 100H178.426M37.574 100H21.574" stroke="var(--color-accent-primary)" strokeWidth="6" strokeLinecap="round"/>
      <path d="M144.15 55.85L154.858 45.142M55.85 144.15L45.142 154.858" stroke="var(--color-accent-primary)" strokeWidth="6" strokeLinecap="round"/>
      <path d="M144.15 144.15L154.858 154.858M55.85 55.85L45.142 45.142" stroke="var(--color-accent-primary)" strokeWidth="6" strokeLinecap="round"/>
      <circle cx="100" cy="100" r="60" stroke="var(--color-accent-secondary)" strokeWidth="8"/>
      <circle cx="100" cy="100" r="32" stroke="var(--color-accent-primary)" strokeWidth="6"/>
      <path d="M84 100L100 84L116 100L100 116L84 100Z" fill="var(--color-accent-primary)" stroke="var(--color-bg-deep)" strokeWidth="2" strokeLinejoin="round"/>
    </svg>
);

export const BrainCircuitIcon: React.FC<IconProps> = ({ className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 2.5a.5.5 0 00-1 0v2.766a3.5 3.5 0 00-1.01 6.42l-1.35 1.348A.5.5 0 007.5 14h1.597a3.5 3.5 0 006.138-2.67l.63-.631a.5.5 0 00-.353-.853h-1.07a2.5 2.5 0 01-1.99-3.954V2.5z" />
    <path strokeLinecap="round" strokeLinejoin="round" d="M12 15.5a4.5 4.5 0 004.22 3.32.5.5 0 00.323-.933A3.5 3.5 0 0113.403 15H14.5a.5.5 0 000-1h-3.097a3.5 3.5 0 00-2.072 6.223A.5.5 0 0010 21.07a4.5 4.5 0 002-5.57z" />
  </svg>
);

export const SigolIcon: React.FC<IconProps> = ({ className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M21 7.5l-9-5.25L3 7.5m18 0l-9 5.25m9-5.25v9l-9 5.25M3 7.5l9 5.25M3 7.5v9l9 5.25m0-9.75l9-5.25M12 12.75L3 7.5m9 5.25L21 7.5" />
  </svg>
);

export const SensorIcon: React.FC<IconProps> = ({ className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 6.75a8.25 8.25 0 11-5.186 1.134" />
    <path strokeLinecap="round" strokeLinejoin="round" d="M12 12.75a.75.75 0 100-1.5.75.75 0 000 1.5z" />
    <path strokeLinecap="round" strokeLinejoin="round" d="M12 18.75a6 6 0 100-12 6 6 0 000 12z" />
    <path strokeLinecap="round" strokeLinejoin="round" d="M17.18 19.346a8.217 8.217 0 01-5.18 1.154" />
  </svg>
);

export const WorkflowIcon: React.FC<IconProps> = ({ className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904L9 15m.813.904l-.323-.865M9.813 15.904L9.34 15m.473.904l.323-.865M15 9.75l-.323.865m.323-.865L15 9m-.323.865l.473-.904m-.473.904l.323.865M15 9.75l.323.865M15 9.75l.473-.904M15 9.75l-.473-.904M9.34 15l.473.904m-.473-.904L9 15m1.5-4.5l-.323.865m.323-.865L12 10.5m-.323.865l.473-.904m-.473.904l.323.865m0 0l.473.904m-.473-.904L12 10.5m2.66 4.5l-.323.865M15 15l.323.865m0 0l.473.904m-.473-.904L15 15m-.323.865l.473-.904m0 0l-.473.904m-9.34-4.5l.323.865M6 10.5l-.323.865m0 0l-.473.904m.473-.904L6 10.5m.323.865l.473-.904m0 0l-.473.904" />
    <path strokeLinecap="round" strokeLinejoin="round" d="M6 10.5h.008v.008H6v-.008zm.008 0h.008v.008H6.008v-.008zm.008 0h.008v.008H6.016v-.008zm.008 0h.008v.008H6.024v-.008zm2.968 4.5h.008v.008H8.992v-.008zm.008 0h.008v.008H9v-.008zm.008 0h.008v.008H9.008v-.008zm.008 0h.008v.008H9.016v-.008zM12 10.5h.008v.008H12v-.008zm.008 0h.008v.008H12.008v-.008zm.008 0h.008v.008H12.016v-.008zm.008 0h.008v.008H12.024v-.008zM15 9h.008v.008H15V9zm.008 0h.008v.008H15.008V9zm.008 0h.008v.008H15.016V9zm.008 0h.008v.008H15.024V9zM9 15h.008v.008H9v-.008zm.008 0h.008v.008H9.008v-.008zm.008 0h.008v.008H9.016v-.008zm.008 0h.008v.008H9.024v-.008z" />
  </svg>
);


export const BriefingIcon: React.FC<IconProps> = ({ className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V7a2 2 0 012-2h10a2 2 0 012 2v8a2 2 0 01-2 2z" />
    <path strokeLinecap="round" strokeLinejoin="round" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
 </svg>
);

export const UploadIcon: React.FC<IconProps> = ({ className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
  </svg>
);

export const SparklesIcon: React.FC<IconProps> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M5 3v4M3 5h4M6 17v4m-2-2h4m11-10V7a4 4 0 00-4-4H7a4 4 0 00-4 4v10a4 4 0 004 4h2" />
    </svg>
);

export const PhotoIcon: React.FC<IconProps> = ({ className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
  </svg>
);

export const VideoIcon: React.FC<IconProps> = ({ className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
  </svg>
);

export const SimulationIcon: React.FC<IconProps> = ({ className, style }) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} style={style} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5">
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 2.25l8.25 4.5-8.25 4.5L3.75 6.75 12 2.25z" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75l8.25 4.5v9l-8.25-4.5v-9z" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M20.25 6.75l-8.25 4.5v9l8.25-4.5v-9z" />
    </svg>
);

export const MicrophoneIcon: React.FC<IconProps> = ({ className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
  </svg>
);

export const StopCircleIcon: React.FC<IconProps> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 9.563C9 9.253 9.253 9 9.563 9h4.874c.31 0 .563.253.563.563v4.874c0 .31-.253.563-.563.563H9.563C9.253 15 9 14.747 9 14.437V9.563z" />
    </svg>
);