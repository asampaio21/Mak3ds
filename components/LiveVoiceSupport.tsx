import React, { useState, useRef } from 'react';
import { Mic, X, Activity } from 'lucide-react';
import { GoogleGenAI, Modality } from "@google/genai";

export const LiveVoiceSupport = () => {
  const [isActive, setIsActive] = useState(false);
  const audioCtxRef = useRef<AudioContext|null>(null);
  const sessionRef = useRef<any>(null);

  const stop = () => { setIsActive(false); audioCtxRef.current?.close(); sessionRef.current = null; };
  
  const start = async () => {
    setIsActive(true);
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY as string });
    const ctx = new (window.AudioContext||(window as any).webkitAudioContext)({sampleRate: 24000});
    audioCtxRef.current = ctx;
    
    // Simplification: Actual implementation requires complex PCM encoding/decoding. 
    // This is a placeholder for the Live API structure provided in the initial context.
    const session = await ai.live.connect({ 
        model: 'gemini-2.5-flash-native-audio-preview-09-2025', 
        config: { responseModalities: [Modality.AUDIO] },
        callbacks: {
            onopen: () => console.log("Live Connected"),
            onmessage: (msg) => {
                const data = msg.serverContent?.modelTurn?.parts?.[0]?.inlineData?.data;
                if(data) { /* Decode and play audio logic here */ }
            }
        }
    });
    sessionRef.current = session;
  };

  return (
    <>
      {!isActive && <button onClick={start} className="fixed bottom-24 right-6 p-4 bg-orange-600 text-white rounded-full shadow-lg hover:scale-110 transition"><Mic /></button>}
      {isActive && (
        <div className="fixed bottom-6 right-6 w-80 bg-[#0a0a0a] border border-orange-500/50 rounded-3xl p-6 z-50">
            <div className="flex justify-between items-center mb-4"><span className="text-orange-500 font-bold flex gap-2"><Activity className="animate-pulse"/> LIVE VOICE</span><button onClick={stop}><X className="text-gray-400"/></button></div>
            <div className="h-20 bg-black/50 rounded-xl flex items-center justify-center text-gray-500 text-xs">AI LISTENING...</div>
        </div>
      )}
    </>
  );
};