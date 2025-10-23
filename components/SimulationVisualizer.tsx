import React, { useState, useEffect } from 'react';
import { SimulationIcon } from './Icons';

const simulationMessages = [
    "초현실적 시뮬레이션 가동...",
    "코덱스 미러 엔진 공명 중...",
    "정다면체 거울 구조 활성화...",
    "14,000,605개의 미래를 탐색 중...",
    "가능성의 인과관계 분석...",
    "승리의 길을 찾는 중...",
    "최적의 경로를 분리합니다...",
];

interface SimulationVisualizerProps {
    message?: string;
}

export const SimulationVisualizer: React.FC<SimulationVisualizerProps> = ({ message }) => {
    const [currentMessage, setCurrentMessage] = useState(simulationMessages[0]);
    
    useEffect(() => {
        if (message) {
            setCurrentMessage(message);
            return;
        }

        let i = 0;
        const intervalId = setInterval(() => {
            i = (i + 1) % simulationMessages.length;
            setCurrentMessage(simulationMessages[i]);
        }, 2000);

        return () => clearInterval(intervalId);
    }, [message]);
    
    return (
        <div className="col-span-full flex flex-col items-center justify-center text-center py-20 bg-[var(--color-bg-medium)] rounded-lg">
            <style>
                {`
                    @keyframes spin-3d {
                        0% { transform: rotateY(0deg) rotateX(0deg); }
                        100% { transform: rotateY(360deg) rotateX(360deg); }
                    }
                    .animate-spin-3d {
                        animation: spin-3d 10s linear infinite;
                    }
                    .animate-spin-3d-reverse {
                        animation-duration: 8s;
                        animation-direction: reverse;
                    }
                `}
            </style>
            <div className="relative w-24 h-24 mb-6">
                <SimulationIcon className="w-24 h-24 text-[var(--color-accent-primary)]/50 absolute top-0 left-0 animate-spin-3d" />
                <SimulationIcon className="w-16 h-16 text-[var(--color-accent-primary)] absolute top-4 left-4 animate-spin-3d animate-spin-3d-reverse" />
            </div>
            <h2 style={{fontFamily: 'var(--font-sans)'}} className="text-2xl font-bold text-[var(--color-text-primary)] mb-2">시뮬레이션 진행 중</h2>
            <p style={{fontFamily: 'var(--font-serif)'}} className="text-[var(--color-text-secondary)] transition-opacity duration-500">{currentMessage}</p>
        </div>
    );
};