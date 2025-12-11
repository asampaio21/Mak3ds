import React, { useState } from 'react';
import { GoogleGenAI, Type } from "@google/genai";
import { Search, Cpu, Zap, ArrowRight, Loader2, Scan, Link as LinkIcon, DollarSign, AlertTriangle, Layers } from 'lucide-react';
import { useContact } from '../components/ContactModal';
import { ModelViewer } from '../components/ModelViewer';

interface AnalysisResult {
    analysis: string;
    risks: string;
    settings: string;
    fairPrice: string;
}

export const AiTools = () => {
  const [url, setUrl] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const [generatedImageUrl, setGeneratedImageUrl] = useState<string | null>(null);
  const { prepareQuote } = useContact();

  const handleAnalyze = async () => {
    if (!url.trim()) return;
    setIsAnalyzing(true); setResult(null); setGeneratedImageUrl(null);
    try {
        const ai = new GoogleGenAI({ apiKey: process.env.API_KEY as string });
        const name = url.split('/').pop()?.replace(/-/g, ' ') || "Object";
        
        // Parallel requests
        const textReq = ai.models.generateContent({ 
            model: 'gemini-2.5-flash', 
            contents: `Analyze the 3D model object from this URL context: ${url}. 
            Assume the material is standard PLA filament.
            Provide:
            1. A short analysis summary.
            2. Potential print risks.
            3. Recommended settings.
            4. A SINGLE price string (e.g., "$5.50") for this print job.
            
            PROFITABLE PRICING RULES (60% MARGIN):
            - Calculate the Base Cost = (Material Weight in grams * $0.025/g) + (Print Time in hours * $1.00/hr for electricity/wear).
            - Add a 60% Profit Margin: Final Price = Base Cost * 1.60.
            - Minimum Setup Fee: For very small/mini items, ensure the price is at least $3.00 to cover printer setup/cleaning time.
            - Do not undervalue the work. Ensure I get at least 60% profit.
            - Example: If material is $0.50 and time is $0.50 (Total Cost $1.00), Price should be $1.60.
            - Example: If it's a tiny 5 minute print, charge minimum $3.00.
            `,
            config: {
                responseMimeType: 'application/json',
                responseSchema: {
                    type: Type.OBJECT,
                    properties: {
                        analysis: { type: Type.STRING },
                        risks: { type: Type.STRING },
                        settings: { type: Type.STRING },
                        fairPrice: { type: Type.STRING }
                    }
                }
            }
        });

        const imgReq = ai.models.generateContent({ 
            model: 'gemini-2.5-flash-image', 
            contents: `Futuristic 3D hologram wireframe render of ${name}, glowing cyan and safety orange neon lines, hovering in void, black background, high-tech schematics style, volumetric lighting, 8k resolution.` 
        });

        const [textRes, imgRes] = await Promise.all([textReq, imgReq]);

        if (textRes.text) {
            setResult(JSON.parse(textRes.text));
        }

        let imgData = null;
        if (imgRes.candidates?.[0]?.content?.parts) {
            for (const part of imgRes.candidates[0].content.parts) {
                if (part.inlineData) {
                    imgData = part.inlineData;
                    break;
                }
            }
        }
        
        if(imgData) setGeneratedImageUrl(`data:${imgData.mimeType};base64,${imgData.data}`);

    } catch (e) { console.error(e); } 
    finally { setIsAnalyzing(false); }
  };

  return (
    <div className="min-h-screen bg-[#050505] p-4 flex flex-col items-center pt-20">
        <div className="max-w-7xl w-full grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className="space-y-6 order-2 lg:order-1">
                <h1 className="brand-font text-4xl md:text-5xl font-bold text-white text-center lg:text-left">AI <span className="text-cyan-400">ANALYZER</span></h1>
                
                {/* Input Section */}
                <div className="bg-[#0a0a0a] border border-cyan-500/30 rounded-2xl p-6 shadow-lg shadow-cyan-900/10">
                    <input type="text" value={url} onChange={(e)=>setUrl(e.target.value)} placeholder="Paste 3D Model URL..." className="w-full bg-[#111] border border-gray-800 rounded-xl px-4 py-4 text-white mb-4 focus:border-cyan-500 outline-none transition-all" />
                    <button onClick={handleAnalyze} disabled={isAnalyzing||!url} className="w-full py-4 bg-white text-black font-bold rounded-xl flex justify-center gap-2 hover:bg-cyan-50 transition-all">{isAnalyzing ? <Loader2 className="animate-spin"/> : <Scan />} RUN DIAGNOSTICS</button>
                </div>

                {/* Analysis Results */}
                {result && (
                    <div className="space-y-4 animate-in fade-in slide-in-from-bottom-4">
                        {/* Price Square */}
                        <div className="bg-gradient-to-br from-[#111] to-[#0a0a0a] border border-cyan-500 rounded-2xl p-8 text-center relative overflow-hidden group">
                            <div className="absolute inset-0 bg-cyan-500/5 group-hover:bg-cyan-500/10 transition-colors"></div>
                            <div className="relative z-10">
                                <div className="text-cyan-500 text-xs font-bold uppercase tracking-[0.2em] mb-2">Estimated Price</div>
                                <div className="text-5xl md:text-6xl font-mono font-bold text-white mb-2">{result.fairPrice}</div>
                                <div className="text-gray-500 text-xs">Includes 60% Margin + Setup</div>
                            </div>
                        </div>

                        {/* Details Grid */}
                        <div className="grid grid-cols-1 gap-4">
                            <div className="bg-[#111] p-5 rounded-2xl border border-gray-800">
                                <h4 className="text-white font-bold mb-2 flex items-center gap-2"><Cpu className="w-4 h-4 text-orange-500"/> Analysis</h4>
                                <p className="text-gray-400 text-sm leading-relaxed">{result.analysis}</p>
                            </div>
                            
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <div className="bg-[#111] p-5 rounded-2xl border border-gray-800">
                                    <h4 className="text-white font-bold mb-2 flex items-center gap-2"><AlertTriangle className="w-4 h-4 text-yellow-500"/> Risks</h4>
                                    <p className="text-gray-400 text-xs">{result.risks}</p>
                                </div>
                                <div className="bg-[#111] p-5 rounded-2xl border border-gray-800">
                                    <h4 className="text-white font-bold mb-2 flex items-center gap-2"><Layers className="w-4 h-4 text-blue-500"/> Settings</h4>
                                    <p className="text-gray-400 text-xs">{result.settings}</p>
                                </div>
                            </div>
                        </div>

                        {/* CTA */}
                        <button onClick={() => prepareQuote(url, result.fairPrice)} className="w-full py-4 bg-cyan-600 hover:bg-cyan-500 text-white font-bold rounded-2xl shadow-lg shadow-cyan-900/20 transition-all flex items-center justify-center gap-2 group">
                             Proceed with Quote <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                        </button>
                    </div>
                )}
            </div>
            
            {/* Viewer Section */}
            <div className="order-1 lg:order-2 h-[400px] lg:h-auto lg:sticky lg:top-24">
                <ModelViewer isAnalyzing={isAnalyzing} imageUrl={generatedImageUrl} />
            </div>
        </div>
    </div>
  );
};