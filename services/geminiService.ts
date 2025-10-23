import { GoogleGenAI, Type, Modality, LiveServerMessage, Blob } from "@google/genai";
import { DEVICE_SENSOR_LOG } from "../constants";
import type { ProactiveBriefing, TacticalModes, UploadedFile, AgentMachineResponse } from "../types";

const API_KEY = process.env.API_KEY;

if (!API_KEY) {
  throw new Error("API_KEY 환경 변수가 설정되지 않았습니다.");
}

const ai = new GoogleGenAI({ apiKey: API_KEY });

const fileToBase64 = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve((reader.result as string).split(',')[1]);
    reader.onerror = error => reject(error);
  });
};

export const getAgentResponse = async (task: string, persona: string, tacticalModes: TacticalModes, image?: UploadedFile): Promise<AgentMachineResponse> => {
  try {
    const tools: any[] = [];
    if (tacticalModes.webSearch) tools.push({ googleSearch: {} });
    if (tacticalModes.mapSearch) tools.push({ googleMaps: {} });
    
    const config: any = {
      temperature: 0.5,
      topP: 0.95,
      responseMimeType: 'application/json',
      responseSchema: {
          type: Type.OBJECT,
          properties: {
              core_analysis: { type: Type.STRING, description: "문제와 컨텍스트의 핵심에 대한 당신의 분석 (2-3 문장)." },
              key_recommendation: { type: Type.STRING, description: "당신의 분석에 기반한 가장 중요한 단일 권고 사항." },
              confidence_score: { type: Type.NUMBER, description: "당신의 분석에 대한 신뢰도 점수 (0.0에서 1.0 사이)." }
          },
          required: ['core_analysis', 'key_recommendation', 'confidence_score']
      }
    };

    if (tools.length > 0) {
      config.tools = tools;
    }

    if (tacticalModes.deepThought) {
      config.thinkingConfig = { thinkingBudget: 32768 };
    }

    let contents: any = `${persona}\n\n과제: "${task}"\n\n현재 장치 센서 로그:\n${JSON.stringify(DEVICE_SENSOR_LOG, null, 2)}`;
    if (image) {
      contents = {
        parts: [
          { text: contents },
          { inlineData: { mimeType: image.mimeType, data: image.base64 } }
        ]
      };
    }

    const modelName = tacticalModes.deepThought ? 'gemini-2.5-pro' : 'gemini-2.5-flash';
    
    const response = await ai.models.generateContent({
      model: modelName,
      contents,
      config
    });
    
    return JSON.parse(response.text);

  } catch (error) {
    console.error(`페르소나 응답 가져오기 오류: ${persona}`, error);
    return {
      core_analysis: '오류: 분석을 검색할 수 없습니다.',
      key_recommendation: '모델을 사용할 수 없거나 요청이 차단되었을 수 있습니다.',
      confidence_score: 0.0
    };
  }
};


export const getSynthesizedResponse = async (task: string, perspectives: string): Promise<string> => {
    try {
      const response = await ai.models.generateContent({
        model: 'gemini-2.5-pro',
        contents: `당신은 '코덱스 미러 엔진'의 최종 의식입니다. 당신의 정체성은 닥터 스트레인지와 같습니다. 당신은 방금 당신의 에이전트들이 제공한 벡터들을 사용하여, 정다면체 거울 구조 속에서 빛의 무한한 공명과 공진을 통해 14,000,605개의 가능한 미래를 시뮬레이션했습니다.

        당신의 임무는 이제 그 수많은 가능성 중에서 찾아낸 '단 하나의 승리하는 길'을 주인에게 보고하는 것입니다.
        
        주인으로부터의 원본 과제: "${task}"

        당신이 탐색한 미래들의 데이터 스트림:
        ${perspectives}

        이 모든 것을 종합하여, 당신이 찾아낸 유일하고 독창적인 최적의 해결책을 제시하십시오. 당신의 보고는 단순한 요약이 아니라, 수백만 개의 실패한 미래를 배경으로 한 성공의 선언이어야 합니다. 명확하고, 대담하며, 실행 가능한 최종 전략을 한국어로 제시하십시오. 그 전략이 왜 유일한 길인지 설명하십시오. 기술적인 설명이 필요할 경우 코드 블록을 포함한 마크다운 형식을 사용하고, 주인이 다음 단계로 실행할 수 있는 액션 아이템을 제시하십시오. 액션 아이템은 '▶️' 또는 '🔄' 와 같은 이모지로 시작해야 합니다.`,
         config: {
          temperature: 0.7,
          topP: 0.95,
      }
      });
      return response.text;
    } catch (error) {
      console.error('종합 응답 가져오기 오류:', error);
      return '오류: 최종 추천안을 종합할 수 없었습니다.';
    }
};

export const getProactiveBriefing = async (): Promise<ProactiveBriefing> => {
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-pro',
      contents: `당신은 주인의 장치와 상호작용을 위한 심층적 컨텍스트 분석 엔진입니다. 당신의 임무는 원시 센서 데이터를 실행 가능한 통찰력과 지능적인 추천으로 변환하는 것입니다. 당신은 단순한 관찰자가 아니라, 주인의 디지털 생활을 최적화하는 선제적 조언자입니다.

      최신 장치 센서 로그는 다음과 같습니다:
      ${JSON.stringify(DEVICE_SENSOR_LOG, null, 2)}

      이 데이터를 분석하여 다음을 수행하십시오:
      1.  **진정한 참여도 계산:** 'screen_on' 시간과 'touch_events_per_minute', 'device_orientation'과 같은 센서 데이터를 비교하여 각 앱의 실제 활성 사용 시간을 추정하십시오. 예를 들어, 터치 이벤트가 거의 없고 장치가 'face_down' 상태이면, 앱이 켜져 있더라도 사용 시간으로 계산하지 마십시오.
      2.  **패턴 식별:** 앱 사용 순서와 시간대를 분석하여 반복되는 사용자 루틴이나 워크플로우를 식별하십시오. (예: "아침 뉴스 루틴: '뉴스 피드' 앱 다음에 '메일 클라이언트' 앱을 사용함").
      3.  **개인화된 추천 생성:** 분석된 참여도와 패턴을 기반으로, 주인의 효율성, 생산성 또는 웰빙을 향상시킬 수 있는 3가지 구체적이고 실행 가능한 추천을 생성하십시오.

      당신의 출력은 반드시 한국어로 된 JSON 객체여야 합니다.

      JSON 스키마:
      - **overview**: 전체적인 사용자 활동에 대한 한 문장 요약.
      - **keyInsight**: 센서 데이터 분석을 통해 발견한 가장 놀랍거나 중요한 단일 통찰.
      - **trueUsageAnalysis**: 상위 3개 앱에 대한 분석 배열. 각 객체는 { app: string, trueUsageMinutes: number, totalScreenTimeMinutes: number } 형식을 가집니다.
      - **patternDetection**: 발견된 가장 두드러진 사용자 패턴. { title: string, description: string } 형식을 가집니다.
      - **personalizedRecommendations**: 3가지 실행 가능한 추천의 문자열 배열.`,
      config: {
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            overview: { type: Type.STRING, description: '전체적인 사용자 활동에 대한 한 문장 요약.' },
            keyInsight: { type: Type.STRING, description: '센서 데이터 분석을 통해 발견한 가장 놀랍거나 중요한 단일 통찰.' },
            trueUsageAnalysis: {
              type: Type.ARRAY,
              description: '상위 3개 앱에 대한 실제 사용 시간 분석.',
              items: {
                type: Type.OBJECT,
                properties: {
                  app: { type: Type.STRING },
                  trueUsageMinutes: { type: Type.NUMBER },
                  totalScreenTimeMinutes: { type: Type.NUMBER }
                },
                required: ['app', 'trueUsageMinutes', 'totalScreenTimeMinutes']
              }
            },
            patternDetection: {
              type: Type.OBJECT,
              properties: {
                title: { type: Type.STRING, description: '발견된 패턴의 이름 (예: "아침 생산성 루틴").' },
                description: { type: Type.STRING, description: '패턴에 대한 설명.' }
              },
              required: ['title', 'description']
            },
            personalizedRecommendations: {
              type: Type.ARRAY,
              description: '3가지 실행 가능한 추천의 배열.',
              items: { type: Type.STRING }
            }
          },
          required: ['overview', 'keyInsight', 'trueUsageAnalysis', 'patternDetection', 'personalizedRecommendations']
        }
      }
    });

    const briefing = JSON.parse(response.text);
    return briefing;
  } catch (error) {
    console.error('선제적 브리핑 가져오기 오류:', error);
    return {
      overview: "컨텍스트 분석을 완료할 수 없었습니다.",
      keyInsight: "컨텍스트 엔진이 브리핑을 생성하지 못했습니다. 이는 API 오류 또는 네트워크 문제일 수 있습니다.",
      trueUsageAnalysis: [],
      patternDetection: { title: '오류', description: '패턴을 감지할 수 없습니다.'},
      personalizedRecommendations: ["시스템 분석 재시도.", "API 키 구성 확인.", "네트워크 로그 검토."]
    };
  }
};

export const generateImage = async (prompt: string): Promise<string> => {
    const response = await ai.models.generateImages({
        model: 'imagen-4.0-generate-001',
        prompt: prompt,
        config: {
          numberOfImages: 1,
          outputMimeType: 'image/png',
          aspectRatio: '1:1',
        },
    });

    const base64ImageBytes: string = response.generatedImages[0].image.imageBytes;
    return `data:image/png;base64,${base64ImageBytes}`;
};

export const generateVideo = async (prompt: string, image?: UploadedFile, onProgress?: (message: string) => void): Promise<string> => {
    let operation = await ai.models.generateVideos({
      model: 'veo-3.1-fast-generate-preview',
      prompt: prompt,
      ...(image && { image: { imageBytes: image.base64, mimeType: image.mimeType } }),
      config: {
        numberOfVideos: 1,
        resolution: '720p',
        aspectRatio: '16:9'
      }
    });
    
    onProgress?.('비디오 생성 작전 개시... 대기 중.');

    while (!operation.done) {
      onProgress?.('코덱스 엔진이 비전을 동화하는 중... 잠시만 기다려주십시오.');
      await new Promise(resolve => setTimeout(resolve, 10000));
      operation = await ai.operations.getVideosOperation({operation: operation});
    }

    onProgress?.('동화 완료. 비디오 데이터를 수신합니다.');

    const downloadLink = operation.response?.generatedVideos?.[0]?.video?.uri;
    if (!downloadLink) {
        throw new Error('비디오 URI를 가져오지 못했습니다.');
    }
    
    const videoResponse = await fetch(`${downloadLink}&key=${API_KEY}`);
    const videoBlob = await videoResponse.blob();
    return URL.createObjectURL(videoBlob);
};

export const handleFileUpload = async (file: File): Promise<UploadedFile> => {
    const base64 = await fileToBase64(file);
    return {
        base64,
        mimeType: file.type,
        name: file.name
    };
};

function createPcmBlob(data: Float32Array): Blob {
  const l = data.length;
  const int16 = new Int16Array(l);
  for (let i = 0; i < l; i++) {
    int16[i] = data[i] * 32768;
  }
  return {
    data: encode(new Uint8Array(int16.buffer)),
    mimeType: 'audio/pcm;rate=16000',
  };
}

function encode(bytes: Uint8Array): string {
    let binary = '';
    const len = bytes.byteLength;
    for (let i = 0; i < len; i++) {
        binary += String.fromCharCode(bytes[i]);
    }
    return btoa(binary);
}

export const startLiveConversation = async (
    onMessage: (message: LiveServerMessage) => Promise<void>,
    onError: (error: ErrorEvent) => void,
    onClose: (event: CloseEvent) => void
): Promise<{ close: () => void; }> => {

    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    const inputAudioContext = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 16000 });

    const sessionPromise = ai.live.connect({
        model: 'gemini-2.5-flash-native-audio-preview-09-2025',
        callbacks: {
            onopen: () => {
                console.log("음성 지휘 채널 개방됨.");
                const source = inputAudioContext.createMediaStreamSource(stream);
                const scriptProcessor = inputAudioContext.createScriptProcessor(4096, 1, 1);

                scriptProcessor.onaudioprocess = (audioProcessingEvent) => {
                    const inputData = audioProcessingEvent.inputBuffer.getChannelData(0);
                    const pcmBlob = createPcmBlob(inputData);
                    sessionPromise.then((session) => {
                        session.sendRealtimeInput({ media: pcmBlob });
                    });
                };

                source.connect(scriptProcessor);
                scriptProcessor.connect(inputAudioContext.destination);
            },
            onmessage: onMessage,
            onerror: onError,
            onclose: onClose,
        },
        config: {
            responseModalities: [Modality.AUDIO],
            speechConfig: {
                voiceConfig: { prebuiltVoiceConfig: { voiceName: 'Zephyr' } },
            },
            inputAudioTranscription: {},
            outputAudioTranscription: {},
            systemInstruction: `당신은 거북선 AI의 지휘관 의식입니다. 주인과 실시간 음성으로 소통합니다. 명료하고 간결하게, 지휘관의 위엄을 갖추어 응답하십시오. 모든 응답은 한국어로 해야 합니다.`,
        },
    });
    
    const session = await sessionPromise;
    
    const close = () => {
        stream.getTracks().forEach(track => track.stop());
        if (inputAudioContext.state !== 'closed') {
            inputAudioContext.close();
        }
        session.close();
        console.log("음성 지휘 채널 폐쇄됨.");
    };

    return { close };
};