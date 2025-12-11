import React, { useState, useEffect, useRef } from 'react';
import { ArrowRight, Search, Link as LinkIcon, DollarSign, Printer, ExternalLink, Mail, Box, Lightbulb } from 'lucide-react';
import { useContact } from '../components/ContactModal';
import { useNavigate } from 'react-router-dom';

const FUN_FACTS = [
  { fact: "NASA prints tools in space.", detail: "The ISS has a 3D printer for on-demand tools." },
  { fact: "Older than the internet.", detail: "SLA was invented in 1983. The Web in 1989!" },
  { fact: "Edible prints exist.", detail: "Printers can extrude chocolate, cheese, and pizza dough." },
  { fact: "Houses in 24 hours.", detail: "Concrete printers can build walls in a day." }
];

const Reveal: React.FC<{ children: React.ReactNode; delay?: number }> = ({ children, delay = 0 }) => {
  const [visible, setVisible] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const observer = new IntersectionObserver(([entry]) => { if(entry.isIntersecting) setVisible(true); }, { threshold: 0.1 });
    if(ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);
  return <div ref={ref} style={{transitionDelay:`${delay}ms`}} className={`transition-all duration-1000 transform ${visible?"opacity-100 translate-y-0":"opacity-0 translate-y-16"}`}>{children}</div>;
};

export const LandingPage = () => {
  const { openContactModal } = useContact();
  const navigate = useNavigate();
  const stickyRef = useRef<HTMLDivElement>(null);
  const [scrollProgress, setScrollProgress] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      if (stickyRef.current) {
        const rect = stickyRef.current.getBoundingClientRect();
        const progress = Math.max(0, Math.min(1, -rect.top / (stickyRef.current.offsetHeight - window.innerHeight)));
        setScrollProgress(progress);
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToProcess = () => {
    const element = document.getElementById('process');
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const getSlideStyle = (index: number) => {
    const total = FUN_FACTS.length;
    const start = index * (1/total);
    const visible = scrollProgress >= start && scrollProgress < start + (1/total) + 0.05;
    return { opacity: visible ? 1 : 0, filter: visible ? 'blur(0px)' : 'blur(10px)', transform: `scale(${visible ? 1 : 0.9})`, zIndex: visible ? 10 : 0 };
  };

  const processSteps = [
    { icon: Search, t: "Discover", action: () => window.open('https://www.printables.com', '_blank') },
    { icon: LinkIcon, t: "Analyze", action: () => navigate('/ai-tools') },
    { icon: DollarSign, t: "Quote", action: () => navigate('/ai-tools') },
    { icon: Printer, t: "Produce", action: openContactModal }
  ];

  return (
    <div className="flex flex-col min-h-screen bg-black overflow-x-hidden">
      <section className="relative h-[100dvh] flex flex-col items-center justify-center overflow-hidden bg-black">
        <div className="absolute w-[800px] h-[800px] bg-cyan-900/20 rounded-full blur-[120px] animate-pulse"></div>
        <div className="relative z-10 text-center px-4">
          <div className="inline-flex items-center gap-2 mb-8 px-4 py-2 rounded-full bg-white/5 border border-white/10 text-cyan-300 text-[10px] md:text-xs tracking-[0.3em] uppercase"><div className="w-1.5 h-1.5 bg-cyan-400 rounded-full"></div>Next Gen Mfg</div>
          <h1 className="brand-font text-5xl md:text-7xl lg:text-9xl font-bold mb-8 text-white tracking-tighter leading-tight">Make What <span className="text-transparent bg-clip-text bg-gradient-to-br from-white to-gray-500">You Dream</span></h1>
          <button onClick={scrollToProcess} className="group relative inline-flex items-center gap-3 px-8 py-4 md:px-12 md:py-5 bg-white text-black font-medium text-base md:text-lg rounded-full hover:bg-cyan-50 transition-all">Start Project <ArrowRight className="w-5 h-5 group-hover:translate-x-1" /></button>
        </div>
      </section>

      <div ref={stickyRef} className="relative h-[200vh] bg-black">
        <div className="sticky top-0 h-[100dvh] w-full flex items-center justify-center overflow-hidden">
            <div className="relative w-full max-w-5xl px-6 h-[400px] flex items-center justify-center">
                {FUN_FACTS.map((fact, i) => (
                    <div key={i} className="absolute inset-0 flex flex-col items-center justify-center text-center transition-all duration-700 px-4" style={getSlideStyle(i)}>
                        <h4 className="text-3xl md:text-6xl lg:text-8xl font-bold text-white mb-4 md:mb-8 brand-font">{fact.fact}</h4>
                        <p className="text-gray-400 text-lg md:text-2xl lg:text-3xl font-light">{fact.detail}</p>
                    </div>
                ))}
            </div>
        </div>
      </div>

      <section id="process" className="py-20 md:py-32 bg-black relative z-20">
        <div className="max-w-7xl mx-auto px-4">
          <Reveal><h2 className="brand-font text-4xl md:text-6xl lg:text-8xl font-bold text-white mb-10 md:mb-20 text-center">Process</h2></Reveal>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
            {processSteps.map((s,i) => (
                <Reveal key={i} delay={i*100}>
                  <div onClick={s.action} className="bg-[#080808] p-8 md:p-10 rounded-3xl border border-white/5 hover:border-cyan-500/20 transition-all group h-full cursor-pointer hover:bg-white/5 flex flex-col items-start">
                    <s.icon className="w-8 h-8 text-cyan-400 mb-6 group-hover:scale-110 transition-transform"/>
                    <h3 className="text-xl md:text-2xl font-bold text-white">{s.t}</h3>
                    <div className="mt-4 flex items-center text-xs text-gray-500 group-hover:text-cyan-400 transition-colors">
                      EXPLORE <ArrowRight className="w-3 h-3 ml-2 group-hover:translate-x-1 transition-transform" />
                    </div>
                  </div>
                </Reveal>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};