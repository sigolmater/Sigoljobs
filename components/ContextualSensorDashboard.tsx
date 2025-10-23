import React from 'react';
import { DEVICE_SENSOR_LOG } from '../constants';
import { SensorIcon } from './Icons';

// A simple function to get the latest sensor reading for display
const getCurrentContext = () => {
    if (DEVICE_SENSOR_LOG.length === 0) {
        return "센서 데이터 없음";
    }
    const latest = DEVICE_SENSOR_LOG[DEVICE_SENSOR_LOG.length - 1];
    let status = "";
    if (latest.touch_events_per_minute > 40) status = "적극적 상호작용 중";
    else if (latest.touch_events_per_minute > 5) status = "가벼운 사용 중";
    else status = "수동적 보기 상태";
    
    if (latest.device_orientation === 'face_down' || latest.device_orientation === 'in_pocket') {
        status = "비사용 상태 (화면 켜짐)";
    }
    if (!latest.screen_on) {
        status = "휴면 상태";
    }

    return `${latest.app_in_foreground} | ${status}`;
}

export const ContextualSensorDashboard: React.FC = () => {
    const currentStatus = getCurrentContext();

    // This is a placeholder. In a real app, this data would come from the proactive briefing.
    const trueUsageData = [
        { app: "코드 에디터", trueUsage: 70, screenTime: 75 },
        { app: "메신저", trueUsage: 22, screenTime: 25 },
        { app: "비디오 스트리밍", trueUsage: 30, screenTime: 60 }
    ];

    return (
        <div className="p-4 bg-[var(--color-bg-medium)] rounded-lg">
            <div className="flex items-center gap-3 mb-4">
                <SensorIcon className="w-6 h-6 text-[var(--color-accent-primary)]" />
                <h2 style={{ fontFamily: 'var(--font-sans)' }} className="text-lg font-bold text-[var(--color-text-primary)]">컨텍스트 센서</h2>
            </div>
            
            <div className="p-3 bg-[var(--color-bg-deep)] rounded-lg mb-4">
                 <p className="text-[var(--color-text-secondary)] text-xs" style={{fontFamily: 'var(--font-sans)'}}>현재 감지된 컨텍스트</p>
                 <p className="text-sm font-semibold text-[var(--color-accent-secondary)]" style={{fontFamily: 'var(--font-sans)'}}>{currentStatus}</p>
            </div>

            <div className="space-y-3">
                <h3 className="text-base font-bold text-[var(--color-text-primary)]" style={{fontFamily: 'var(--font-sans)'}}>진정한 참여도 (분)</h3>
                {trueUsageData.map(item => {
                    const percentage = (item.trueUsage / item.screenTime) * 100;
                    return (
                        <div key={item.app}>
                             <div className="flex justify-between items-center text-sm mb-1">
                                <span className="text-[var(--color-text-primary)] font-medium" style={{fontFamily: 'var(--font-sans)'}}>{item.app}</span>
                                <span className="text-[var(--color-text-secondary)] font-light" style={{fontFamily: 'var(--font-serif)'}}>
                                    <span className="font-bold text-white">{item.trueUsage}</span> / {item.screenTime}
                                </span>
                             </div>
                             <div className="w-full bg-[var(--color-bg-light)] rounded-full h-2">
                               <div className="bg-[var(--color-accent-primary)] h-2 rounded-full" style={{width: `${percentage}%`}}></div>
                           </div>
                        </div>
                    )
                })}
            </div>
        </div>
    );
};