import React, { useState, useRef, useEffect } from 'react';
import { MessageSquare, X, Send, Bot } from 'lucide-react';
import { GoogleGenAI } from "@google/genai";

export const Chatbot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([{ role: 'model', text: "Mak3d AI Online. How can I help?" }]);
  const [input, setInput] = useState('');
  const chatRef = useRef<any>(null);

  const send = async () => {
    if(!input.trim()) return;
    const userText = input; setInput('');
    setMessages(p => [...p, {role:'user', text:userText}, {role:'model', text:''}]);
    
    try {
        if(!chatRef.current) {
            const ai = new GoogleGenAI({ apiKey: process.env.API_KEY as string });
            chatRef.current = ai.chats.create({ model: 'gemini-2.5-flash', config: { systemInstruction: "You are a 3D printing support agent. Be concise and industrial." } });
        }
        const res = await chatRef.current.sendMessageStream({ message: userText });
        let full = "";
        for await (const chunk of res) { if(chunk.text) { full += chunk.text; setMessages(p => { const n=[...p]; n[n.length-1].text = full; return n; }); } }
    } catch(e) { setMessages(p => [...p, {role:'model', text:"System Error."}]); }
  };

  return (
    <>
      <button onClick={() => setIsOpen(true)} className={`fixed bottom-6 right-6 p-4 bg-cyan-600 text-white rounded-full shadow-lg hover:scale-110 transition ${isOpen?'hidden':'block'}`}><MessageSquare /></button>
      {isOpen && (
        <div className="fixed bottom-6 right-6 w-80 h-96 bg-[#0a0a0a] border border-gray-800 rounded-2xl flex flex-col z-50 overflow-hidden">
          <div className="p-4 border-b border-gray-800 flex justify-between bg-[#111]"><span className="text-white font-bold flex gap-2"><Bot className="text-cyan-500"/> Mak3d AI</span><button onClick={()=>setIsOpen(false)}><X className="text-gray-400"/></button></div>
          <div className="flex-1 overflow-y-auto p-4 space-y-2">{messages.map((m,i)=><div key={i} className={`p-2 rounded-lg text-sm ${m.role==='user'?'bg-cyan-900/50 text-white ml-auto':'bg-gray-900 text-gray-300'}`}>{m.text}</div>)}</div>
          <div className="p-2 border-t border-gray-800 flex"><input className="flex-1 bg-black text-white p-2 text-sm outline-none" value={input} onChange={e=>setInput(e.target.value)} onKeyDown={e=>e.key==='Enter'&&send()} /><button onClick={send} className="text-cyan-500 p-2"><Send size={16}/></button></div>
        </div>
      )}
    </>
  );
};