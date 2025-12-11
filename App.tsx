import React from 'react';
import { HashRouter, Routes, Route, Link, useLocation } from 'react-router-dom';
import { LandingPage } from './pages/LandingPage';
import { AiTools } from './pages/AiTools';
import { Chatbot } from './components/Chatbot';
import { LiveVoiceSupport } from './components/LiveVoiceSupport';
import { ContactProvider, useContact } from './components/ContactModal';
import { Box, Cpu, Menu, X } from 'lucide-react';

const Navbar = () => {
  const [isOpen, setIsOpen] = React.useState(false);
  const location = useLocation();
  const { openContactModal } = useContact();
  const isHome = location.pathname === '/';

  // Close mobile menu when route changes
  React.useEffect(() => {
    setIsOpen(false);
  }, [location]);

  return (
    <nav className="fixed w-full z-50 bg-[#050505]/90 backdrop-blur-md border-b border-gray-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex-shrink-0 flex items-center">
            <Link to="/" className="flex items-center gap-2 group">
              <Box className="h-8 w-8 text-cyan-400 group-hover:text-orange-500 transition-colors duration-300" />
              <span className="brand-font text-xl md:text-2xl font-bold text-white tracking-wider">
                MAK<span className="text-cyan-400">3</span>D
              </span>
            </Link>
          </div>
          
          {/* Desktop Menu */}
          <div className="hidden md:block">
            <div className="ml-10 flex items-baseline space-x-8">
              <Link to="/" className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${isHome ? 'text-cyan-400' : 'text-gray-300 hover:text-white'}`}>Home</Link>
              <Link to="/ai-tools" className={`flex items-center gap-2 px-3 py-2 rounded-md text-sm font-medium transition-colors ${!isHome ? 'text-orange-500' : 'text-gray-300 hover:text-white'}`}><Cpu className="w-4 h-4" />AI Lab</Link>
              <button onClick={openContactModal} className="bg-cyan-500/10 border border-cyan-500/50 text-cyan-400 hover:bg-cyan-500 hover:text-black px-4 py-2 rounded-md text-sm font-bold transition-all duration-300">Contact Us</button>
            </div>
          </div>

          {/* Mobile Menu Button */}
          <div className="-mr-2 flex md:hidden">
            <button onClick={() => setIsOpen(!isOpen)} className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-white hover:bg-gray-700 focus:outline-none">
              {isOpen ? <X className="block h-6 w-6" /> : <Menu className="block h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      {isOpen && (
        <div className="md:hidden bg-[#0a0a0a] border-b border-gray-800 absolute w-full">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            <Link to="/" className={`block px-3 py-2 rounded-md text-base font-medium ${isHome ? 'text-cyan-400 bg-gray-900' : 'text-gray-300 hover:text-white hover:bg-gray-700'}`}>Home</Link>
            <Link to="/ai-tools" className={`block px-3 py-2 rounded-md text-base font-medium ${!isHome ? 'text-orange-500 bg-gray-900' : 'text-gray-300 hover:text-white hover:bg-gray-700'}`}>AI Lab</Link>
            <button onClick={() => { openContactModal(); setIsOpen(false); }} className="w-full text-left block px-3 py-2 rounded-md text-base font-medium text-cyan-400 hover:text-white hover:bg-gray-700">Contact Us</button>
          </div>
        </div>
      )}
    </nav>
  );
};

export default function App() {
  return (
    <ContactProvider>
      <HashRouter>
        <div className="min-h-screen bg-[#050505] text-white flex flex-col">
          <Navbar />
          <main className="flex-grow pt-16 relative">
            <Routes>
              <Route path="/" element={<LandingPage />} />
              <Route path="/ai-tools" element={<AiTools />} />
            </Routes>
            <Chatbot />
            <LiveVoiceSupport />
          </main>
        </div>
      </HashRouter>
    </ContactProvider>
  );
}