import React, { useState, useRef, useEffect, useCallback } from 'react';
import type { LiveServerMessage } from '@google/genai';
import { startLiveConversation } from '../services/geminiService';
import { MicrophoneIcon, StopCircleIcon } from './Icons';

// Audio decoding has to happen client-side, so we need the helpers here too.
function decode(base64: string): Uint8Array {
  const binaryString = atob(base64);
  const len = binaryString.length;
  const bytes = new Uint8Array(len);
  for (let i = 0; i < len; i++) {
    bytes[i] = binaryString.charCodeAt(i);
  }
  return bytes;
}

async function decodeAudioData(
  data: Uint8Array,
  ctx: AudioContext,
  sampleRate: number,
  numChannels: number,
): Promise<AudioBuffer> {
  const dataInt16 = new Int16Array(data.buffer);
  const frameCount = dataInt16.length / numChannels;
  const buffer = ctx.createBuffer(numChannels, frameCount, sampleRate);

  for (let channel = 0; channel < numChannels; channel++) {
    const channelData = buffer.getChannelData(channel);
    for (let i = 0; i < frameCount; i++) {
      channelData[i] = dataInt16[i * numChannels + channel] / 32768.0;
    }
  }
  return buffer;
}


interface TranscriptEntry {
    speaker: '주인' | 'AI';
    text: string;
}

export const LiveCommander: React.FC = () => {
    const [isActive, setIsActive] = useState(false);
    const [isConnecting, setIsConnecting] = useState(false);
    const [transcript, setTranscript] = useState<TranscriptEntry[]>([]);
    const [error, setError] = useState<string | null>(null);

    const sessionCloser = useRef<(() => void) | null>(null);
    const outputAudioContext = useRef<AudioContext | null>(null);
    const nextStartTime = useRef(0);
    const audioSources = useRef<Set<AudioBufferSourceNode>>(new Set());

    const transcriptEndRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        transcriptEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [transcript]);

    // Cleanup session on component unmount
    useEffect(() => {
        return () => {
            sessionCloser.current?.();
            if (outputAudioContext.current && outputAudioContext.current.state !== 'closed') {
                outputAudioContext.current.close();
            }
        };
    }, []);
    
    const handleMessage = useCallback(async (message: LiveServerMessage) => {
        if (message.serverContent?.inputTranscription) {
            const { text } = message.serverContent.inputTranscription;
            setTranscript(prev => {
                const last = prev[prev.length - 1];
                if (last?.speaker === '주인') {
                     return [...prev.slice(0, -1), { speaker: '주인', text: last.text + text }];
                }
                return [...prev, { speaker: '주인', text }];
            });
        }

        if (message.serverContent?.outputTranscription) {
             const { text } = message.serverContent.outputTranscription;
             setTranscript(prev => {
                const last = prev[prev.length - 1];
                if (last?.speaker === 'AI') {
                    return [...prev.slice(0, -1), { speaker: 'AI', text: last.text + text }];
                }
                return [...prev, { speaker: 'AI', text }];
            });
        }

        const base64Audio = message.serverContent?.modelTurn?.parts[0]?.inlineData?.data;
        if (base64Audio && outputAudioContext.current) {
            const ctx = outputAudioContext.current;
            nextStartTime.current = Math.max(nextStartTime.current, ctx.currentTime);
            const audioBuffer = await decodeAudioData(decode(base64Audio), ctx, 24000, 1);
            const source = ctx.createBufferSource();
            source.buffer = audioBuffer;
            source.connect(ctx.destination);
            source.addEventListener('ended', () => {
                audioSources.current.delete(source);
            });
            source.start(nextStartTime.current);
            nextStartTime.current += audioBuffer.duration;
            audioSources.current.add(source);
        }

        if (message.serverContent?.interrupted) {
            for (const source of audioSources.current.values()) {
                source.stop();
                audioSources.current.delete(source);
            }
            nextStartTime.current = 0;
        }

    }, []);

    const toggleSession = async () => {
        if (isActive) {
            sessionCloser.current?.();
            sessionCloser.current = null;
            setIsActive(false);
            if (outputAudioContext.current && outputAudioContext.current.state !== 'closed') {
                outputAudioContext.current.close().then(() => outputAudioContext.current = null);
            }
        } else {
            setIsConnecting(true);
            setError(null);
            setTranscript([]);

            try {
                outputAudioContext.current = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 24000 });
                nextStartTime.current = 0;

                const { close } = await startLiveConversation(
                    handleMessage,
                    (e) => {
                        console.error("음성 지휘 오류:", e);
                        setError("연결 오류가 발생했습니다.");
                        setIsActive(false);
                        setIsConnecting(false);
                    },
                    (e) => {
                        console.log("음성 지휘 채널 폐쇄됨:", e);
                        setIsActive(false);
                        setIsConnecting(false);
                        sessionCloser.current = null;
                    }
                );
                sessionCloser.current = close;
                setIsActive(true);
            } catch (err) {
                console.error("음성 지휘 시작 실패:", err);
                setError("마이크 접근에 실패했거나 세션을 시작할 수 없습니다.");
            } finally {
                setIsConnecting(false);
            }
        }
    };

    return (
        <div className="p-4 bg-[var(--color-bg-medium)] rounded-lg">
            <div className="flex items-center gap-3 mb-4">
                <MicrophoneIcon className="w-6 h-6 text-[var(--color-accent-primary)]"/>
                <h2 style={{ fontFamily: 'var(--font-sans)' }} className="text-lg font-bold text-[var(--color-text-primary)]">실시간 음성 지휘</h2>
            </div>
            <div style={{ fontFamily: 'var(--font-serif)' }} className="h-40 overflow-y-auto bg-[var(--color-bg-deep)] rounded p-2 mb-3 border border-[var(--color-border)] text-sm space-y-2">
                {transcript.map((entry, i) => (
                    <div key={i} className={`flex ${entry.speaker === '주인' ? 'justify-end' : 'justify-start'}`}>
                        <p className={`px-2 py-1 rounded-lg max-w-[80%] break-words ${entry.speaker === '주인' ? 'bg-cyan-900/80 text-[var(--color-accent-primary)]' : 'bg-[var(--color-bg-light)] text-[var(--color-text-secondary)]'}`}>
                            <strong style={{ fontFamily: 'var(--font-sans)' }} className="text-white/70">{entry.speaker}:</strong> {entry.text}
                        </p>
                    </div>
                ))}
                 {transcript.length === 0 && !isConnecting && (
                    <p className="text-[var(--color-text-secondary)] text-center text-xs py-12">연결 후 지시를 시작하십시오.</p>
                )}
                 {isConnecting && (
                    <p className="text-[var(--color-accent-primary)] text-center text-xs py-12 animate-pulse">음성 채널 연결 중...</p>
                )}
                <div ref={transcriptEndRef} />
            </div>
            
            <button
                onClick={toggleSession}
                disabled={isConnecting}
                className={`w-full px-4 py-2 font-semibold text-gray-100 rounded-lg transition-all duration-200 flex items-center justify-center gap-2 disabled:cursor-not-allowed disabled:bg-slate-600 border ${
                    isActive
                    ? 'bg-red-800/50 border-red-700 hover:bg-red-700/80'
                    : 'bg-green-800/50 border-green-700 hover:bg-green-700/80'
                }`}
            >
                {isActive ? <StopCircleIcon className="w-5 h-5"/> : <MicrophoneIcon className="w-5 h-5"/>}
                <span style={{ fontFamily: 'var(--font-sans)' }}>{isConnecting ? "연결 중..." : (isActive ? "연결 종료" : "연결 시작")}</span>
            </button>
            {error && <p style={{ fontFamily: 'var(--font-serif)' }} className="text-xs text-red-400 mt-2 text-center">{error}</p>}
        </div>
    );
};