import React, { createContext, useContext, useState, useEffect } from 'react';
import { Mail, X, ExternalLink, Link as LinkIcon, Wand2, ArrowRight, RefreshCw, MessageCircle } from 'lucide-react';

interface ContactContextType { 
  openContactModal: () => void; 
  prepareQuote: (url: string, price: string) => void;
}
const ContactContext = createContext<ContactContextType>({ openContactModal: () => {}, prepareQuote: () => {} });
export const useContact = () => useContext(ContactContext);

export const ContactProvider = ({ children }: { children?: React.ReactNode }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [modelUrl, setModelUrl] = useState('');
  const [estimatedPrice, setEstimatedPrice] = useState('');
  const [isGenerated, setIsGenerated] = useState(false);
  const email = "tomlsampaio@gmail.com";
  const whatsappNumber = "5521996163750";
  
  const openContactModal = () => { setIsOpen(true); setIsGenerated(false); };
  
  const prepareQuote = (url: string, price: string) => {
    setModelUrl(url);
    setEstimatedPrice(price);
    setIsGenerated(true);
    setIsOpen(true);
  };

  const handleGenerate = () => { if(modelUrl.trim()) setIsGenerated(true); };
  const handleReset = () => { setIsGenerated(false); setModelUrl(''); setEstimatedPrice(''); };
  
  const getMessage = () => {
    return `Hi, make it an ${modelUrl || '[Link]'} . Price offering: ${estimatedPrice || 'Quote Request'}`;
  };

  const getSubject = () => encodeURIComponent("3D Printing Request");
  const getBody = () => encodeURIComponent(getMessage());
  const getWhatsappLink = () => `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(getMessage())}`;

  return (
    <ContactContext.Provider value={{ openContactModal, prepareQuote }}>
      {children}
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/90 backdrop-blur-md animate-in fade-in">
           <div className="bg-[#0a0a0a] border border-gray-800 rounded-2xl p-6 max-w-sm w-full relative shadow-2xl shadow-cyan-900/10 animate-in zoom-in-95">
              <button onClick={() => setIsOpen(false)} className="absolute top-4 right-4 text-gray-500 hover:text-white"><X className="w-5 h-5" /></button>
              <h2 className="text-xl font-bold text-center text-white brand-font mb-8">
                {isGenerated ? <span className="text-green-500">● READY TO SEND</span> : <span className="text-cyan-500">● INITIATE REQUEST</span>}
              </h2>
              
              <div className={isGenerated ? 'hidden' : 'block'}>
                 <div className="relative mb-4">
                    <LinkIcon className="absolute left-3 top-4 w-4 h-4 text-gray-600" />
                    <input type="text" value={modelUrl} onChange={(e) => setModelUrl(e.target.value)} placeholder="Paste Model URL..." className="w-full bg-[#111] border border-gray-800 rounded-xl py-4 pl-10 pr-4 text-white text-sm focus:border-cyan-500 outline-none" />
                 </div>
                 <button onClick={handleGenerate} disabled={!modelUrl.trim()} className="w-full py-3 bg-white text-black font-bold text-sm rounded-xl hover:bg-cyan-400 transition-colors flex justify-center gap-2"><Wand2 className="w-4 h-4" /> Generate Draft</button>
              </div>

              {isGenerated && (
                  <div className="animate-in slide-in-from-bottom-5 fade-in relative space-y-4">
                     <button onClick={handleReset} className="absolute -top-10 left-1/2 -translate-x-1/2 bg-[#0a0a0a] px-3 py-1 border border-gray-800 rounded-full text-[10px] text-gray-500 flex gap-1 hover:text-white"><RefreshCw className="w-3 h-3" /> Reset</button>
                     
                     <div className="bg-[#111] p-4 rounded-xl border border-gray-800 mb-4">
                        <p className="text-gray-400 text-xs mb-1">Message Preview:</p>
                        <p className="text-white text-sm italic">"{getMessage()}"</p>
                     </div>

                     <a href={getWhatsappLink()} target="_blank" rel="noopener noreferrer" className="flex items-center justify-between w-full p-4 bg-[#25D366] hover:bg-[#20bd5a] text-black rounded-xl group transition-all">
                        <span className="flex gap-3 font-bold"><MessageCircle className="w-5 h-5" /> WhatsApp</span>
                        <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                     </a>

                     <a href={`mailto:${email}?subject=${getSubject()}&body=${getBody()}`} className="flex items-center justify-between w-full p-4 bg-[#111] hover:bg-[#1a1a1a] border border-gray-800 hover:border-cyan-500/50 rounded-xl group transition-all">
                        <span className="flex gap-3 text-gray-200 font-bold"><Mail className="w-5 h-5 text-gray-400 group-hover:text-cyan-400" /> Email App</span>
                        <ArrowRight className="w-5 h-5 text-gray-500 group-hover:text-cyan-400 group-hover:translate-x-1 transition-transform" />
                     </a>
                  </div>
              )}
           </div>
        </div>
      )}
    </ContactContext.Provider>
  );
};