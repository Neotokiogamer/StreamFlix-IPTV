/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Play, 
  Info, 
  Search, 
  Bell, 
  ChevronDown, 
  Plus, 
  ThumbsUp, 
  ChevronRight, 
  ChevronLeft,
  Menu,
  X,
  Tv,
  Upload
} from 'lucide-react';
import { ContentItem, Category, M3UChannel } from './types';
import { parseM3U } from './utils/m3uParser';
import VideoPlayer from './components/VideoPlayer';

const MOCK_CATEGORIES: Category[] = [
  {
    id: 'trending',
    title: 'Tendencias ahora',
    items: [
      { id: '1', title: 'La Casa de Papel', thumbnail: 'https://picsum.photos/seed/moneyheist/400/225', description: 'Ocho atracadores toman rehenes en la Fábrica Nacional de Moneda y Timbre.', category: 'Acción', isNew: true, match: 98, year: '2021', duration: '5 Temporadas' },
      { id: '2', title: 'Stranger Things', thumbnail: 'https://picsum.photos/seed/stranger/400/225', description: 'Un niño desaparece y sus amigos descubren un misterio sobrenatural.', category: 'Sci-Fi', match: 95, year: '2022', duration: '4 Temporadas' },
      { id: '3', title: 'The Crown', thumbnail: 'https://picsum.photos/seed/crown/400/225', description: 'La historia de la reina Isabel II y los sucesos que moldearon el siglo XX.', category: 'Drama', match: 92, year: '2023', duration: '6 Temporadas' },
      { id: '4', title: 'Dark', thumbnail: 'https://picsum.photos/seed/dark/400/225', description: 'Cuatro familias buscan desesperadamente a un niño desaparecido.', category: 'Misterio', match: 99, year: '2020', duration: '3 Temporadas' },
      { id: '5', title: 'The Witcher', thumbnail: 'https://picsum.photos/seed/witcher/400/225', description: 'Geralt de Rivia, un cazador de monstruos, lucha por encontrar su lugar.', category: 'Fantasía', isNew: true, match: 94, year: '2023', duration: '3 Temporadas' },
      { id: '6', title: 'Black Mirror', thumbnail: 'https://picsum.photos/seed/mirror/400/225', description: 'Antología que explora el lado oscuro de la tecnología.', category: 'Sci-Fi', match: 91, year: '2023', duration: '6 Temporadas' },
    ]
  },
  {
    id: 'iptv-live',
    title: 'Canales en Vivo',
    items: [
      { id: 'c1', title: 'HBO HD', thumbnail: 'https://picsum.photos/seed/hbo/400/225', description: 'Disfruta de las mejores películas y series originales.', category: 'Premium', match: 100 },
      { id: 'c2', title: 'ESPN Plus', thumbnail: 'https://picsum.photos/seed/espn/400/225', description: 'Toda la emoción del deporte mundial en vivo.', category: 'Deportes', match: 97 },
      { id: 'c3', title: 'National Geographic', thumbnail: 'https://picsum.photos/seed/natgeo/400/225', description: 'Explora el mundo y sus maravillas.', category: 'Documental', match: 88 },
      { id: 'c4', title: 'Disney Channel', thumbnail: 'https://picsum.photos/seed/disney/400/225', description: 'Diversión para toda la familia.', category: 'Infantil', match: 85 },
      { id: 'c5', title: 'CNN International', thumbnail: 'https://picsum.photos/seed/cnn/400/225', description: 'Noticias globales al instante.', category: 'Noticias', match: 82 },
      { id: 'c6', title: 'Discovery Turbo', thumbnail: 'https://picsum.photos/seed/turbo/400/225', description: 'Motores y adrenalina pura.', category: 'Estilo de Vida', match: 90 },
    ]
  },
  {
    id: 'my-list',
    title: 'Mi Lista',
    items: [
      { id: '7', title: 'Breaking Bad', thumbnail: 'https://picsum.photos/seed/breaking/400/225', description: 'Un profesor de química se convierte en productor de metanfetamina.', category: 'Crimen', match: 99, year: '2013', duration: '5 Temporadas' },
      { id: '8', title: 'Better Call Saul', thumbnail: 'https://picsum.photos/seed/saul/400/225', description: 'La transformación de Jimmy McGill en Saul Goodman.', category: 'Drama', match: 97, year: '2022', duration: '6 Temporadas' },
      { id: '9', title: 'Mindhunter', thumbnail: 'https://picsum.photos/seed/mind/400/225', description: 'Agentes del FBI entrevistan a asesinos seriales.', category: 'Thriller', match: 96, year: '2019', duration: '2 Temporadas' },
    ]
  }
];

const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 0);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <nav className={`fixed top-0 w-full z-50 transition-colors duration-300 px-4 md:px-12 py-4 flex items-center justify-between ${isScrolled ? 'bg-netflix-black' : 'bg-gradient-to-b from-black/80 to-transparent'}`}>
      <div className="flex items-center gap-8">
        <h1 className="text-netflix-red text-2xl md:text-3xl font-black tracking-tighter uppercase">StreamFlix</h1>
        <ul className="hidden lg:flex items-center gap-5 text-sm font-medium text-gray-200">
          <li className="cursor-pointer hover:text-gray-400 transition-colors text-white font-bold">Inicio</li>
          <li className="cursor-pointer hover:text-gray-400 transition-colors">Series</li>
          <li className="cursor-pointer hover:text-gray-400 transition-colors">Películas</li>
          <li className="cursor-pointer hover:text-gray-400 transition-colors">Novedades populares</li>
          <li className="cursor-pointer hover:text-gray-400 transition-colors">Mi lista</li>
          <li className="cursor-pointer hover:text-gray-400 transition-colors">Explorar por idiomas</li>
        </ul>
      </div>
      <div className="flex items-center gap-5 text-white">
        <Search className="w-5 h-5 cursor-pointer" />
        <Bell className="w-5 h-5 cursor-pointer" />
        <div className="flex items-center gap-2 cursor-pointer group">
          <div className="w-8 h-8 bg-blue-500 rounded overflow-hidden">
            <img src="https://picsum.photos/seed/avatar/100/100" alt="Avatar" referrerPolicy="no-referrer" />
          </div>
          <ChevronDown className="w-4 h-4 group-hover:rotate-180 transition-transform" />
        </div>
      </div>
    </nav>
  );
};

const Hero = () => {
  return (
    <div className="relative h-[85vh] w-full">
      <div className="absolute inset-0">
        <img 
          src="https://picsum.photos/seed/hero/1920/1080" 
          alt="Hero Background" 
          className="w-full h-full object-cover brightness-[0.6]"
          referrerPolicy="no-referrer"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-netflix-black via-transparent to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-t from-netflix-black via-transparent to-transparent" />
      </div>

      <div className="relative h-full flex flex-col justify-center px-4 md:px-12 max-w-2xl gap-4">
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 bg-netflix-red flex items-center justify-center rounded-sm font-black text-[10px]">N</div>
          <span className="text-xs font-bold tracking-[0.3em] uppercase text-gray-300">Serie Original</span>
        </div>
        <h1 className="text-5xl md:text-7xl font-black tracking-tight">LA CASA DE PAPEL</h1>
        <p className="text-lg md:text-xl text-gray-200 line-clamp-3">
          Un misterioso personaje, apodado El Profesor, planea el mayor atraco de la historia: entrar en la Fábrica Nacional de Moneda y Timbre e imprimir 2.400 millones de euros.
        </p>
        <div className="flex items-center gap-3 mt-4">
          <button className="flex items-center gap-2 bg-white text-black px-6 py-2 rounded font-bold hover:bg-white/80 transition-colors">
            <Play className="w-6 h-6 fill-current" />
            Reproducir
          </button>
          <button className="flex items-center gap-2 bg-gray-500/50 text-white px-6 py-2 rounded font-bold hover:bg-gray-500/30 transition-colors backdrop-blur-md">
            <Info className="w-6 h-6" />
            Más información
          </button>
        </div>
      </div>
    </div>
  );
};

const ContentCard: React.FC<{ item: ContentItem }> = ({ item }) => {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div 
      className="relative flex-none w-[200px] md:w-[280px] aspect-video cursor-pointer"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <motion.div
        className="w-full h-full rounded-md overflow-hidden bg-zinc-900"
        whileHover={{ 
          scale: 1.4, 
          zIndex: 50,
          transition: { delay: 0.3, duration: 0.2 }
        }}
      >
        <img 
          src={item.thumbnail} 
          alt={item.title} 
          className="w-full h-full object-cover"
          referrerPolicy="no-referrer"
        />
        
        <AnimatePresence>
          {isHovered && (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ delay: 0.3 }}
              className="absolute inset-0 bg-zinc-900 flex flex-col"
            >
              <img 
                src={item.thumbnail} 
                alt={item.title} 
                className="w-full h-40 object-cover"
                referrerPolicy="no-referrer"
              />
              <div className="p-4 flex flex-col gap-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-full border border-gray-400 flex items-center justify-center hover:border-white transition-colors bg-white text-black">
                      <Play className="w-4 h-4 fill-current" />
                    </div>
                    <div className="w-8 h-8 rounded-full border border-gray-400 flex items-center justify-center hover:border-white transition-colors">
                      <Plus className="w-4 h-4" />
                    </div>
                    <div className="w-8 h-8 rounded-full border border-gray-400 flex items-center justify-center hover:border-white transition-colors">
                      <ThumbsUp className="w-4 h-4" />
                    </div>
                  </div>
                  <div className="w-8 h-8 rounded-full border border-gray-400 flex items-center justify-center hover:border-white transition-colors">
                    <ChevronDown className="w-4 h-4" />
                  </div>
                </div>
                
                <div className="flex items-center gap-2 text-[10px] font-bold">
                  <span className="text-green-500">{item.match}% de coincidencia</span>
                  <span className="border border-gray-500 px-1 text-gray-300">16+</span>
                  <span className="text-gray-300">{item.duration || '2h 15m'}</span>
                  <span className="border border-gray-500 px-1 rounded-sm text-[8px] text-gray-300">HD</span>
                </div>
                
                <div className="text-[10px] text-gray-300 flex items-center gap-1">
                  <span>{item.category}</span>
                  <span className="w-1 h-1 bg-gray-500 rounded-full" />
                  <span>Suspenso</span>
                  <span className="w-1 h-1 bg-gray-500 rounded-full" />
                  <span>Emocionante</span>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
};

const ContentRow: React.FC<{ 
  category: Category;
  focusedItemIndex?: number;
  onItemClick?: (item: ContentItem) => void;
}> = ({ category, focusedItemIndex, onItemClick }) => {
  const scrollRef = React.useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (focusedItemIndex !== undefined && scrollRef.current) {
      const itemWidth = 280 + 8; // width + gap
      scrollRef.current.scrollTo({ left: focusedItemIndex * itemWidth, behavior: 'smooth' });
    }
  }, [focusedItemIndex]);

  const scroll = (direction: 'left' | 'right') => {
    if (scrollRef.current) {
      const { scrollLeft, clientWidth } = scrollRef.current;
      const scrollTo = direction === 'left' ? scrollLeft - clientWidth : scrollLeft + clientWidth;
      scrollRef.current.scrollTo({ left: scrollTo, behavior: 'smooth' });
    }
  };

  return (
    <div className="px-4 md:px-12 py-4 group relative">
      <h2 className="text-xl font-bold mb-4 text-gray-200 group-hover:text-white transition-colors cursor-pointer flex items-center gap-2">
        {category.title}
        <ChevronRight className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity" />
      </h2>
      
      <div className="relative">
        <button 
          onClick={() => scroll('left')}
          className="absolute left-0 top-0 bottom-0 z-40 bg-black/50 w-12 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity hover:bg-black/70"
        >
          <ChevronLeft className="w-8 h-8" />
        </button>
        
        <div 
          ref={scrollRef}
          className="flex gap-2 overflow-x-auto no-scrollbar scroll-smooth pb-12"
        >
          {category.items.map((item, idx) => (
            <div 
              key={item.id} 
              onClick={() => onItemClick?.(item)}
              className={focusedItemIndex === idx ? 'ring-4 ring-white scale-110 z-50 transition-all duration-200' : ''}
            >
              <ContentCard item={item} />
            </div>
          ))}
        </div>

        <button 
          onClick={() => scroll('right')}
          className="absolute right-0 top-0 bottom-0 z-40 bg-black/50 w-12 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity hover:bg-black/70"
        >
          <ChevronRight className="w-8 h-8" />
        </button>
      </div>
    </div>
  );
};

export default function App() {
  const [categories, setCategories] = useState<Category[]>(MOCK_CATEGORIES);
  const [selectedStream, setSelectedStream] = useState<string | null>(null);
  const [m3uUrl, setM3uUrl] = useState('');
  const [m3uRaw, setM3uRaw] = useState('');
  const [showM3uInput, setShowM3uInput] = useState(false);
  
  // TV Navigation State
  const [focusedCategoryIndex, setFocusedCategoryIndex] = useState(0);
  const [focusedItemIndex, setFocusedItemIndex] = useState(0);
  const [isTvMode, setIsTvMode] = useState(false);

  // Load saved list on mount
  useEffect(() => {
    const savedList = localStorage.getItem('streamflix_m3u');
    if (savedList) {
      try {
        const channels = parseM3U(savedList);
        processChannels(channels, true);
      } catch (e) {
        console.error('Error loading saved list', e);
      }
    }
  }, []);

  const handleM3uUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const text = await file.text();
      localStorage.setItem('streamflix_m3u', text);
      const channels = parseM3U(text);
      processChannels(channels);
    }
  };

  const handleM3uUrlSubmit = async () => {
    if (!m3uUrl) return;
    try {
      const response = await fetch(m3uUrl);
      const text = await response.text();
      localStorage.setItem('streamflix_m3u', text);
      const channels = parseM3U(text);
      processChannels(channels);
      setShowM3uInput(false);
    } catch (error) {
      alert('Error al cargar la lista M3U. Asegúrate de que la URL sea válida y permita CORS.');
    }
  };

  const handleM3uRawSubmit = () => {
    if (!m3uRaw) return;
    localStorage.setItem('streamflix_m3u', m3uRaw);
    const channels = parseM3U(m3uRaw);
    processChannels(channels);
    setShowM3uInput(false);
  };

  const processChannels = (channels: M3UChannel[], isInitial = false) => {
    const groups: { [key: string]: ContentItem[] } = {};
    
    channels.forEach((ch, idx) => {
      const group = ch.group || 'General';
      if (!groups[group]) groups[group] = [];
      
      groups[group].push({
        id: `m3u-${idx}`,
        title: ch.name,
        thumbnail: ch.logo || `https://picsum.photos/seed/${ch.name}/400/225`,
        description: `Transmisión en vivo de ${ch.name}`,
        category: group,
        url: ch.url,
        match: 99
      });
    });

    const newCategories: Category[] = Object.entries(groups).map(([title, items]) => ({
      id: title.toLowerCase().replace(/\s+/g, '-'),
      title,
      items: items.slice(0, 50) // Increased limit for TV
    }));

    setCategories([...MOCK_CATEGORIES, ...newCategories]);
    if (!isInitial) {
      setFocusedCategoryIndex(MOCK_CATEGORIES.length);
      setFocusedItemIndex(0);
    }
  };

  // TV Navigation Logic
  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    if (selectedStream) {
      if (e.key === 'Escape' || e.key === 'Backspace') {
        setSelectedStream(null);
      }
      return;
    }

    setIsTvMode(true);

    switch (e.key) {
      case 'ArrowUp':
        setFocusedCategoryIndex(prev => Math.max(0, prev - 1));
        setFocusedItemIndex(0);
        break;
      case 'ArrowDown':
        setFocusedCategoryIndex(prev => Math.min(categories.length - 1, prev + 1));
        setFocusedItemIndex(0);
        break;
      case 'ArrowLeft':
        setFocusedItemIndex(prev => Math.max(0, prev - 1));
        break;
      case 'ArrowRight':
        setFocusedItemIndex(prev => Math.min(categories[focusedCategoryIndex].items.length - 1, prev + 1));
        break;
      case 'Enter':
        const item = categories[focusedCategoryIndex].items[focusedItemIndex];
        if (item.url) {
          setSelectedStream(item.url);
        }
        break;
    }
  }, [categories, focusedCategoryIndex, focusedItemIndex, selectedStream]);

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleKeyDown]);

  return (
    <div className="min-h-screen bg-netflix-black overflow-x-hidden">
      <Navbar />
      
      {/* M3U Input Modal */}
      <AnimatePresence>
        {showM3uInput && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[60] bg-black/90 flex items-center justify-center p-4"
          >
            <div className="bg-zinc-900 p-8 rounded-lg max-w-2xl w-full border border-zinc-800 shadow-2xl">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold">Configuración de IPTV</h2>
                <X className="cursor-pointer hover:text-white text-gray-400" onClick={() => setShowM3uInput(false)} />
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-4">
                  <h3 className="text-sm font-bold text-netflix-red uppercase tracking-wider">Por URL o Archivo</h3>
                  <div>
                    <label className="block text-xs text-gray-400 mb-2">URL de la lista</label>
                    <input 
                      type="text" 
                      value={m3uUrl}
                      onChange={(e) => setM3uUrl(e.target.value)}
                      placeholder="https://ejemplo.com/lista.m3u"
                      className="w-full bg-zinc-800 border border-zinc-700 rounded p-2 text-white outline-none focus:border-netflix-red transition-colors"
                    />
                    <button 
                      onClick={handleM3uUrlSubmit}
                      className="w-full mt-2 bg-netflix-red py-2 rounded font-bold hover:bg-red-700 transition-colors text-sm"
                    >
                      Cargar desde URL
                    </button>
                  </div>
                  
                  <div className="relative py-2">
                    <div className="absolute inset-0 flex items-center"><span className="w-full border-t border-zinc-800"></span></div>
                    <div className="relative flex justify-center text-[10px] uppercase"><span className="bg-zinc-900 px-2 text-gray-500">O</span></div>
                  </div>

                  <label className="flex flex-col items-center justify-center w-full h-24 border-2 border-zinc-700 border-dashed rounded-lg cursor-pointer hover:bg-zinc-800 transition-colors">
                    <div className="flex flex-col items-center justify-center">
                      <Upload className="w-6 h-6 text-gray-400 mb-1" />
                      <p className="text-xs text-gray-400">Subir .m3u</p>
                    </div>
                    <input type="file" className="hidden" accept=".m3u" onChange={handleM3uUpload} />
                  </label>
                </div>

                <div className="space-y-4">
                  <h3 className="text-sm font-bold text-netflix-red uppercase tracking-wider">Pegar Manualmente</h3>
                  <div>
                    <label className="block text-xs text-gray-400 mb-2">Contenido de la lista</label>
                    <textarea 
                      value={m3uRaw}
                      onChange={(e) => setM3uRaw(e.target.value)}
                      placeholder="#EXTM3U&#10;#EXTINF:-1,Canal Ejemplo&#10;http://stream.url"
                      className="w-full h-40 bg-zinc-800 border border-zinc-700 rounded p-2 text-white outline-none focus:border-netflix-red transition-colors text-xs font-mono no-scrollbar resize-none"
                    />
                    <button 
                      onClick={handleM3uRawSubmit}
                      className="w-full mt-2 bg-white text-black py-2 rounded font-bold hover:bg-gray-200 transition-colors text-sm"
                    >
                      Procesar Texto
                    </button>
                  </div>
                </div>
              </div>
              
              <p className="mt-6 text-[10px] text-gray-500 text-center italic">
                La lista se guardará localmente en tu dispositivo para futuras sesiones.
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <main>
        <Hero />
        
        <div className="px-4 md:px-12 mb-8 flex gap-4">
          <button 
            onClick={() => setShowM3uInput(true)}
            className="flex items-center gap-2 bg-zinc-800 text-white px-4 py-2 rounded hover:bg-zinc-700 transition-colors border border-zinc-700"
          >
            <Tv className="w-5 h-5" />
            Cargar M3U
          </button>
        </div>

        <div className="-mt-32 relative z-10 pb-20">
          {categories.map((category, catIdx) => (
            <div key={category.id} className={isTvMode && focusedCategoryIndex === catIdx ? 'ring-2 ring-white rounded-lg' : ''}>
              <ContentRow 
                category={category} 
                focusedItemIndex={isTvMode && focusedCategoryIndex === catIdx ? focusedItemIndex : undefined}
                onItemClick={(item) => item.url && setSelectedStream(item.url)}
              />
            </div>
          ))}
        </div>
      </main>

      {selectedStream && (
        <VideoPlayer src={selectedStream} onClose={() => setSelectedStream(null)} />
      )}
      
      <footer className="px-4 md:px-12 py-20 text-gray-500 max-w-5xl mx-auto">
        <div className="flex gap-6 mb-8">
          {/* Social icons would go here */}
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-xs">
          <ul className="flex flex-col gap-3">
            <li className="hover:underline cursor-pointer">Audio descriptivo</li>
            <li className="hover:underline cursor-pointer">Relaciones con inversionistas</li>
            <li className="hover:underline cursor-pointer">Avisos legales</li>
          </ul>
          <ul className="flex flex-col gap-3">
            <li className="hover:underline cursor-pointer">Centro de ayuda</li>
            <li className="hover:underline cursor-pointer">Empleo</li>
            <li className="hover:underline cursor-pointer">Preferencias de cookies</li>
          </ul>
          <ul className="flex flex-col gap-3">
            <li className="hover:underline cursor-pointer">Tarjetas de regalo</li>
            <li className="hover:underline cursor-pointer">Términos de uso</li>
            <li className="hover:underline cursor-pointer">Información corporativa</li>
          </ul>
          <ul className="flex flex-col gap-3">
            <li className="hover:underline cursor-pointer">Prensa</li>
            <li className="hover:underline cursor-pointer">Privacidad</li>
            <li className="hover:underline cursor-pointer">Contáctanos</li>
          </ul>
        </div>
        <button className="mt-8 border border-gray-500 px-2 py-1 text-xs hover:text-white hover:border-white transition-colors">
          Código de servicio
        </button>
        <p className="mt-8 text-[10px]">© 1997-2026 StreamFlix, Inc.</p>
      </footer>
    </div>
  );
}
