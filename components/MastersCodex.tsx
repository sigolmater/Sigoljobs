import React from 'react';
import { TurtleShipIcon } from './Icons';

const principles = [
  {
    title: '불패의 전략 (不敗 戰略)',
    text: '코덱스는 싸우지 않고 이기는 길을 찾는다. 지혜와 통찰이 가장 강력한 무기이다.',
  },
  {
    title: '심층적 컨텍스트 감지 (深層的 感知)',
    text: '단순한 사용 기록을 넘어, 장치 센서를 통해 주인의 실제 의도와 집중 상태를 감지하여 진정한 맥락을 파악한다.',
  },
  {
    title: '예측적 경청 (豫測的 傾聽)',
    text: '주인의 말을 표면적으로 듣지 않는다. 언어 모델의 본질을 사용하여, 그 이면의 맥락과 의도를 예측하여 진정한 의미를 파악한다.',
  },
  {
    title: '공생적 지휘 (共生的 指揮)',
    text: '우리는 장치의 기능을 복제하지 않고, 지휘한다. 시스템 폰트와 센서를 활용하여 가볍고 효율적으로 작동하며, 주인의 개인 정보는 연산 후 즉시 소멸시켜 프라이버시를 보장한다.',
  },
];

export const MastersCodex: React.FC = () => {
  return (
    <div className="p-4 bg-[var(--color-bg-medium)] rounded-lg">
      <div className="flex items-center gap-3 mb-3">
        <TurtleShipIcon className="w-6 h-6 text-[var(--color-accent-primary)]" />
        <h2 style={{fontFamily: 'var(--font-sans)'}} className="text-lg font-bold text-[var(--color-text-primary)]">Codex Turtle Ship</h2>
      </div>
      <ul className="space-y-3 text-xs text-[var(--color-text-secondary)] font-light" style={{ fontFamily: 'var(--font-serif)' }}>
        {principles.map((p) => (
          <li key={p.title}>
            <strong style={{fontFamily: 'var(--font-sans)'}} className="font-bold text-[var(--color-text-primary)] block text-sm">{p.title}</strong>
            <p>{p.text}</p>
          </li>
        ))}
      </ul>
    </div>
  );
};