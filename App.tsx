import React, { useState, useCallback, useEffect, useRef } from 'react';
import { AgentCard } from './components/AgentCard';
import { AGENTS, DEVICE_SENSOR_LOG } from './constants';
import { getAgentResponse, getSynthesizedResponse, getProactiveBriefing, generateImage, generateVideo, handleFileUpload } from './services/geminiService';
import type { Agent, AgentResponse, ProactiveBriefing, TacticalModes, UploadedFile, GeneratedMedia } from './types';
import { TurtleShipIcon, UploadIcon, SparklesIcon, PhotoIcon, VideoIcon, SimulationIcon } from './components/Icons';
import { MastersCodex } from './components/MastersCodex';
import { ContextualSensorDashboard } from './components/ContextualSensorDashboard';
import { AgentBriefing, BriefingSkeleton } from './components/AgentBriefing';
import { SimulationVisualizer } from './components/SimulationVisualizer';
import { MarkdownRenderer } from './components/MarkdownRenderer';
import { LiveCommander } from './components/LiveCommander';

const TacticalModeToggle: React.FC<{ label: string; description: string; checked: boolean; onChange: (checked: boolean) => void; }> = ({ label, description, checked, onChange }) => (
  <div className="flex items-center justify-between">
    <div>
      <label style={{ fontFamily: 'var(--font-sans)' }} className="font-semibold text-[var(--color-text-primary)] text-sm">{label}</label>
      <p style={{ fontFamily: 'var(--font-serif)' }} className="text-xs text-[var(--color-text-secondary)] font-light">{description}</p>
    </div>
    <button
      role="switch"
      aria-checked={checked}
      onClick={() => onChange(!checked)}
      className={`${checked ? 'bg-[var(--color-accent-primary)]' : 'bg-[var(--color-bg-light)]'} relative inline-flex h-6 w-11 items-center rounded-full transition-colors`}
    >
      <span className={`${checked ? 'translate-x-6' : 'translate-x-1'} inline-block h-4 w-4 transform rounded-full bg-white transition-transform`} />
    </button>
  </div>
);


const App: React.FC = () => {
  const [task, setTask] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isBriefingLoading, setIsBriefingLoading] = useState<boolean>(true);
  const [agentResponses, setAgentResponses] = useState<AgentResponse[]>([]);
  const [synthesizedResponse, setSynthesizedResponse] = useState<string>('');
  const [proactiveBriefing, setProactiveBriefing] = useState<ProactiveBriefing | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [uploadedFile, setUploadedFile] = useState<UploadedFile | null>(null);
  const [generatedMedia, setGeneratedMedia] = useState<GeneratedMedia | null>(null);
  const [pollingMessage, setPollingMessage] = useState<string>('');

  const [tacticalModes, setTacticalModes] = useState<TacticalModes>({
    webSearch: false,
    mapSearch: false,
    deepThought: false,
  });

  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const fetchBriefing = async () => {
      setIsBriefingLoading(true);
      try {
        const briefing = await getProactiveBriefing();
        setProactiveBriefing(briefing);
      } catch (err) {
        console.error('선제적 브리핑을 가져오는 데 실패했습니다:', err);
        setError('에이전트로부터 선제적 브리핑을 가져오는 데 실패했습니다.');
      } finally {
        setIsBriefingLoading(false);
      }
    };
    fetchBriefing();
  }, []);

  const resetState = () => {
    setError(null);
    setAgentResponses([]);
    setSynthesizedResponse('');
    setGeneratedMedia(null);
    setPollingMessage('');
  };

  const onFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      resetState();
      try {
        const processedFile = await handleFileUpload(file);
        setUploadedFile(processedFile);
      } catch (err) {
        setError('파일 처리 중 오류가 발생했습니다.');
        console.error(err);
      }
    }
  };

  const handleSimulation = useCallback(async (taskOverride?: string) => {
    setIsLoading(true);
    resetState();

    let effectiveTask = (taskOverride ?? task).trim();
    if (uploadedFile && effectiveTask === '') {
      effectiveTask = `${uploadedFile.name} 파일을 분석하십시오.`;
    } else if (effectiveTask === '') {
      effectiveTask = `현재 장치 센서 로그를 분석하여 주인의 실제 사용 패턴, 숨겨진 루틴 및 심층적인 컨텍스트를 파악하십시오. 이 데이터를 기반으로 포괄적인 상태 평가 및 실행 가능한 권장 사항을 제공하십시오:\n\n센서 로그:\n${JSON.stringify(DEVICE_SENSOR_LOG, null, 2)}`;
    }

    try {
      const responsesPromises = AGENTS.map(async (agent: Agent) => {
        const responseJson = await getAgentResponse(effectiveTask, agent.persona, tacticalModes, uploadedFile ?? undefined);
        return { agent, response: responseJson, isLoading: false };
      });

      const resolvedResponses = await Promise.all(responsesPromises);
      setAgentResponses(resolvedResponses);
      
      const synthesisPrompt = resolvedResponses.map(r => {
        if (typeof r.response === 'string') {
           return `\n\n### ${r.agent.name}의 보고 (오류):\n${r.response}`;
        }
        return `\n\n### ${r.agent.name}의 벡터:\n- 분석: ${r.response.core_analysis}\n- 권고: ${r.response.key_recommendation}\n- 신뢰도: ${r.response.confidence_score}`;
      }).join('');

      const finalResponse = await getSynthesizedResponse(effectiveTask, synthesisPrompt);
      setSynthesizedResponse(finalResponse);

    } catch (err) {
      console.error('오류가 발생했습니다:', err);
      setError('AI로부터 응답을 받는 데 실패했습니다. API 키를 확인하고 다시 시도하십시오.');
    } finally {
      setIsLoading(false);
    }
  }, [task, uploadedFile, tacticalModes]);

  const handleGenerateImage = async () => {
    if (!task.trim()) {
      setError('비전 생성을 위한 지시가 필요합니다.');
      return;
    }
    setIsLoading(true);
    resetState();
    try {
      const imageUrl = await generateImage(task);
      setGeneratedMedia({ type: 'image', url: imageUrl, prompt: task });
    } catch (err) {
      console.error('이미지 생성 오류:', err);
      setError('비전 생성에 실패했습니다.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleGenerateVideo = async () => {
    if (!task.trim() && !uploadedFile) {
        setError('비전 동화를 위한 지시 또는 이미지가 필요합니다.');
        return;
    }
    setIsLoading(true);
    resetState();
    try {
        const videoUrl = await generateVideo(task, uploadedFile ?? undefined, setPollingMessage);
        setGeneratedMedia({ type: 'video', url: videoUrl, prompt: task });
    } catch (err) {
        console.error('비디오 생성 오류:', err);
        setError('비전 동화에 실패했습니다.');
    } finally {
        setIsLoading(false);
        setPollingMessage('');
    }
  };

  const handleSuggestionSimulation = (suggestion: string) => {
    setTask(suggestion);
    setUploadedFile(null);
    handleSimulation(suggestion);
  };
  
  const renderContent = () => {
    if (isLoading) {
      return <SimulationVisualizer message={pollingMessage} />;
    }
    
    if (generatedMedia) {
      return (
        <div className="col-span-full p-4 bg-[var(--color-bg-medium)] rounded-lg">
           <h3 style={{fontFamily: 'var(--font-sans)'}} className="font-bold text-lg text-[var(--color-text-primary)] mb-3 flex items-center gap-2">
                {generatedMedia.type === 'image' ? <PhotoIcon className="w-6 h-6 text-[var(--color-accent-primary)]" /> : <VideoIcon className="w-6 h-6 text-[var(--color-accent-primary)]" />}
                {generatedMedia.type === 'image' ? '생성된 비전' : '동화된 비전'}
            </h3>
            {generatedMedia.type === 'image' ? (
                <img src={generatedMedia.url} alt={generatedMedia.prompt} className="rounded-md w-full" />
            ) : (
                <video src={generatedMedia.url} controls autoPlay loop className="rounded-md w-full" />
            )}
            <p style={{ fontFamily: 'var(--font-serif)' }} className="text-xs text-[var(--color-text-secondary)] mt-2 italic">지시: "{generatedMedia.prompt}"</p>
        </div>
      );
    }
    
    if (agentResponses.length > 0) {
      return agentResponses.map(({ agent, response }) => (
        <AgentCard key={agent.name} agent={agent} response={response} isLoading={false} />
      ));
    }
    
    if (isBriefingLoading) return <BriefingSkeleton />;
    
    if (proactiveBriefing) {
      return <AgentBriefing briefing={proactiveBriefing} onSuggestionDeliberate={handleSuggestionSimulation} />;
    }
    
    return (
      <div className="col-span-full text-center py-20">
        <p style={{ fontFamily: 'var(--font-serif)' }} className="text-[var(--color-text-secondary)]">함대가 주인의 지시를 기다립니다.</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col md:flex-row min-h-screen bg-transparent text-[var(--color-text-primary)]" style={{ fontFamily: 'var(--font-serif)'}}>
      <aside className="w-full md:w-1/3 lg:w-1/4 p-4 md:p-6 bg-[var(--color-bg-medium)]/80 border-r border-[var(--color-border)] flex flex-col gap-6 backdrop-blur-sm">
        <div className="flex items-center gap-3">
            <TurtleShipIcon className="w-10 h-10 text-[var(--color-accent-primary)]" />
            <h1 style={{ fontFamily: 'var(--font-sans)' }} className="text-3xl font-bold text-[var(--color-text-primary)]">거북선 AI</h1>
        </div>
        <p className="text-sm text-[var(--color-text-secondary)] leading-relaxed font-light" style={{ fontFamily: 'var(--font-serif)' }}>지휘 콘솔을 통해 함대에 지시를 내리십시오. 미디어를 투입하고 전술 모드를 활용하여 작전 능력을 극대화할 수 있습니다.</p>

        <ContextualSensorDashboard />
        <LiveCommander />
        <MastersCodex />

        <div className="flex flex-col gap-4 flex-grow">
          <div>
            <label style={{ fontFamily: 'var(--font-sans)'}} className="text-lg font-bold text-[var(--color-text-primary)] mb-2 block">지휘 콘솔</label>
            <div className="relative">
              <textarea
                value={task}
                onChange={(e) => setTask(e.target.value)}
                className="w-full p-3 pr-10 bg-[var(--color-bg-light)] border border-[var(--color-border)] rounded-lg focus:ring-2 focus:ring-[var(--color-accent-primary)] focus:outline-none transition-shadow duration-200 text-sm placeholder-[var(--color-text-secondary)]"
                placeholder="지시를 입력하거나 파일을 투입하십시오..."
                rows={4}
                style={{ fontFamily: 'var(--font-serif)' }}
              />
              <input type="file" ref={fileInputRef} onChange={onFileChange} accept="image/*" className="hidden" />
              <button onClick={() => fileInputRef.current?.click()} className="absolute top-2 right-2 p-1 text-[var(--color-text-secondary)] hover:text-[var(--color-accent-primary)] transition-colors">
                <UploadIcon className="w-5 h-5" />
              </button>
            </div>
            {uploadedFile && (
                <div className="mt-2 p-2 bg-[var(--color-bg-light)] border border-[var(--color-border)] rounded-lg flex items-center gap-2">
                    <img src={`data:${uploadedFile.mimeType};base64,${uploadedFile.base64}`} alt="preview" className="w-10 h-10 rounded-md object-cover" />
                    <span style={{ fontFamily: 'var(--font-serif)' }} className="text-xs text-[var(--color-text-secondary)] truncate flex-grow">{uploadedFile.name}</span>
                    <button onClick={() => setUploadedFile(null)} className="text-[var(--color-text-secondary)] hover:text-white text-xs pr-1">&times;</button>
                </div>
            )}
          </div>
          
          <div className="p-4 bg-[var(--color-bg-medium)] rounded-lg space-y-3">
             <h3 style={{fontFamily: 'var(--font-sans)'}} className="font-bold text-[var(--color-text-primary)] text-base">전술 모드</h3>
             <TacticalModeToggle label="웹 접속" description="실시간 웹 정보로 분석을 강화합니다." checked={tacticalModes.webSearch} onChange={v => setTacticalModes(p => ({...p, webSearch:v}))} />
             <TacticalModeToggle label="지도 접속" description="지리적, 공간적 맥락을 활용합니다." checked={tacticalModes.mapSearch} onChange={v => setTacticalModes(p => ({...p, mapSearch:v}))} />
             <TacticalModeToggle label="깊은 숙고" description="최고 복잡도 문제 해결을 위한 최대 연산" checked={tacticalModes.deepThought} onChange={v => setTacticalModes(p => ({...p, deepThought:v}))} />
          </div>
        </div>

        <div className="space-y-3">
          <button onClick={() => handleSimulation()} disabled={isLoading} className="w-full px-4 py-3 font-bold text-[var(--color-bg-deep)] bg-[var(--color-accent-primary)] rounded-lg shadow-lg hover:bg-opacity-80 disabled:bg-[var(--color-bg-light)] disabled:text-[var(--color-text-secondary)] disabled:cursor-not-allowed disabled:shadow-none transition-all duration-300 flex items-center justify-center gap-2 transform hover:scale-105 disabled:transform-none">
            <SimulationIcon className="w-5 h-5" />
            <span style={{fontFamily: 'var(--font-sans)'}} className="text-lg">
              {isLoading ? "시뮬레이션 중..." : "시뮬레이션 시작"}
            </span>
          </button>
          
          <div className="grid grid-cols-2 gap-3">
            <button onClick={handleGenerateImage} disabled={isLoading || !!uploadedFile} className="w-full px-4 py-2 font-semibold text-[var(--color-text-primary)] bg-[var(--color-bg-light)]/80 border border-[var(--color-border)] rounded-lg hover:bg-[var(--color-bg-light)] disabled:bg-[var(--color-bg-medium)] disabled:cursor-not-allowed disabled:text-[var(--color-text-secondary)] disabled:border-slate-700 transition-colors duration-200 flex items-center justify-center gap-2">
                <SparklesIcon className="w-5 h-5"/> 비전 생성
            </button>
            <button onClick={handleGenerateVideo} disabled={isLoading} className="w-full px-4 py-2 font-semibold text-[var(--color-text-primary)] bg-[var(--color-bg-light)]/80 border border-[var(--color-border)] rounded-lg hover:bg-[var(--color-bg-light)] disabled:bg-[var(--color-bg-medium)] disabled:cursor-not-allowed disabled:text-[var(--color-text-secondary)] disabled:border-slate-700 transition-colors duration-200 flex items-center justify-center gap-2">
                <VideoIcon className="w-5 h-5"/> 비전 동화
            </button>
          </div>

        </div>
        {error && <p style={{ fontFamily: 'var(--font-serif)' }} className="text-sm text-red-400 mt-2">{error}</p>}
      </aside>

      <main className="w-full md:w-2/3 lg:w-3/4 p-4 md:p-6 overflow-y-auto bg-transparent">
        <div className="max-w-4xl mx-auto">
            {synthesizedResponse && (
                 <div className={`mb-8 p-6 bg-[var(--color-bg-medium)] rounded-xl border border-[var(--color-accent-primary)]/30 shadow-lg ${synthesizedResponse ? 'animate-pulse-glow' : ''}`}>
                    <h2 style={{fontFamily: 'var(--font-sans)'}} className="text-2xl font-bold text-[var(--color-accent-primary)] mb-3">종합 분석 보고: 유일한 길</h2>
                    <MarkdownRenderer content={synthesizedResponse} onAction={handleSuggestionSimulation} />
                 </div>
            )}
            
            <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
              {renderContent()}
            </div>
        </div>
      </main>
    </div>
  );
};

export default App;