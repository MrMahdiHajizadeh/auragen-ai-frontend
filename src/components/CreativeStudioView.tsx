import { useState, useEffect } from 'react';
import { Zap, ChevronLeft, ChevronRight, Briefcase, Brush, Frame, Upload, Coins, ArrowRight, MessageSquare } from 'lucide-react';
import { GeneratorModel } from '../types';
import { ApiService } from '../services/api';

interface CreativeStudioViewProps {
  onSelectModel: (model: GeneratorModel) => void;
}

type TabType = 'all' | 'scifi' | 'corporate' | 'anime';

export default function CreativeStudioView({ onSelectModel }: CreativeStudioViewProps) {
  const [activeTab, setActiveTab] = useState<TabType>('all');
  const [models, setModels] = useState<GeneratorModel[]>([]);
  const [banners, setBanners] = useState<any[]>([]);

  useEffect(() => {
    ApiService.getGenerators().then(data => setModels(data));
    ApiService.getBanners().then(data => setBanners(data));
  }, []);

  const filteredModels = models.filter((model) => {
    if (activeTab === 'all') return true;
    if (activeTab === 'scifi') return model.category === 'Sci-Fi' || model.isTextPromptOnly;
    if (activeTab === 'corporate') return model.category === 'Professional';
    if (activeTab === 'anime') return model.category === 'Anime';
    return true;
  });

  // Handle clicking hero "Initialize Model" to load cyber model
  const handleHeroInit = () => {
    const cyberModel = models.find((m) => m.category === 'Anime' || m.id.includes('cyber') || m.id.includes('anime'));
    if (cyberModel) {
      onSelectModel(cyberModel);
    } else if (models.length > 0) {
      onSelectModel(models[0]);
    }
  };

  return (
    <div className="w-full relative py-6 animate-fade-up">
      {/* Hero Banner Section */}
      <section className="w-full min-h-[400px] md:h-[400px] rounded-2xl overflow-hidden relative mb-12 border border-white/10 shadow-[0_10px_40px_rgba(0,0,0,0.5)] group">
        <div
          className="absolute inset-0 bg-cover bg-center transition-transform duration-[10s] group-hover:scale-105"
          style={{
            backgroundImage: `url('https://lh3.googleusercontent.com/aida-public/AB6AXuDauTZZWxUaXs2GWqUn-hXUhb7EddZOLBlMQVPIe1hx_muMJbXm7i9lHExNOkeG6XtW3pb8NAWmH8IcQ6cIII2gzAFz77FnV37DLSonKIgGVbitHB7DHYOAp6Id0gwdZX6rsGTY9jh1qJxSrI1l4ot6SmK2s4c5vMw6Hc1QU6Bmmg3FgjWNCskYnoKcwAdEq_-I5GNjDLRoATRmdY9vFyBfGUfT_ScwQ4vagikHNKYvtjw9gU0nRemnM-Pn9Cp4LnrmJVbwHiIpUiLA')`,
          }}
        ></div>
        <div className="absolute inset-0 bg-gradient-to-t from-[#05070C] via-[#05070C]/65 to-transparent"></div>
        <div className="absolute inset-0 bg-gradient-to-r from-[#05070C]/90 via-[#05070C]/20 to-transparent"></div>

        <div className="absolute bottom-0 left-0 p-6 md:p-12 w-full max-w-2xl flex flex-col justify-end h-full z-10 transition-all">
          <span className="inline-flex self-start items-center gap-1.5 px-3 py-1 mb-4 rounded-full border border-secondary/35 bg-secondary/15 text-secondary text-[10px] font-label font-bold uppercase tracking-wider backdrop-blur-md">
            Featured Drop
          </span>
          <h2 className="text-3xl md:text-5xl font-display font-medium text-on-surface mb-3 leading-tight tracking-tighter">
            Neon Synthesis:
            <br />
            Cyberpunk Vol. 4
          </h2>
          <p className="text-sm md:text-base text-on-surface-variant mb-6 leading-relaxed max-w-lg opacity-90">
            Train bespoke models with cutting-edge neon diffusion techniques. Perfect for cinematic concept art and high-fashion editorial portraits.
          </p>
          <button
            onClick={handleHeroInit}
            className="btn-glow self-start bg-primary text-on-primary font-bold px-7 py-3.5 rounded-lg flex items-center gap-2 shadow-[0_4px_25px_rgba(192,193,255,0.3)] hover:shadow-[0_4px_30px_rgba(192,193,255,0.5)] transition-all duration-400 transform hover:-translate-y-0.5 cursor-pointer text-sm"
          >
            <Zap className="w-4.5 h-4.5 fill-on-primary" />
            Initialize Cyber Model
          </button>
        </div>
      </section>

      {/* Model explore section title */}
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h3 className="text-2xl font-display font-semibold text-on-surface tracking-tight">
            Explore Generators
          </h3>
          <p className="text-xs text-on-surface-variant font-sans mt-0.5">
            Select an custom-engineered studio model to synthesize premium assets
          </p>
        </div>
        
        {/* Carousel buttons (simulate) */}
        <div className="flex gap-2">
          <button className="w-9 h-9 rounded-full bg-white/5 border border-white/5 flex items-center justify-center text-on-surface hover:text-primary hover:bg-white/10 transition-all duration-300 cursor-pointer">
            <ChevronLeft className="w-4 h-4" />
          </button>
          <button className="w-9 h-9 rounded-full bg-white/5 border border-white/5 flex items-center justify-center text-on-surface hover:text-primary hover:bg-white/10 transition-all duration-300 cursor-pointer">
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Categories slider pills */}
      <div className="flex gap-3 mb-8 overflow-x-auto hide-scroll pb-2">
        <button
          onClick={() => setActiveTab('all')}
          className={`whitespace-nowrap px-6 py-2.5 rounded-full border text-xs font-sans flex items-center gap-2 cursor-pointer transition-all duration-300 ${
            activeTab === 'all'
              ? 'border-primary text-primary bg-primary/10 shadow-[0_0_15px_rgba(99,102,241,0.2)]'
              : 'border-white/10 text-on-surface-variant hover:text-on-surface hover:bg-white/5 bg-white/3'
          }`}
        >
          <span className={`w-2 h-2 rounded-full shadow-[0_0_8px_#c0c1ff] ${activeTab === 'all' ? 'bg-primary' : 'bg-primary/50'}`}></span>
          All Models
        </button>

        <button
          onClick={() => setActiveTab('scifi')}
          className={`whitespace-nowrap px-6 py-2.5 rounded-full border text-xs font-sans flex items-center gap-2 cursor-pointer transition-all duration-300 ${
            activeTab === 'scifi'
              ? 'border-secondary text-secondary bg-secondary/10 shadow-[0_0_15px_rgba(76,215,246,0.2)]'
              : 'border-white/10 text-on-surface-variant hover:text-on-surface hover:bg-white/5 bg-white/3'
          }`}
        >
          <span className={`w-2 h-2 rounded-full shadow-[0_0_8px_#4cd7f6] ${activeTab === 'scifi' ? 'bg-secondary' : 'bg-secondary/50'}`}></span>
          Sci-Fi & Cyberpunk
        </button>

        <button
          onClick={() => setActiveTab('corporate')}
          className={`whitespace-nowrap px-6 py-2.5 rounded-full border text-xs font-sans flex items-center gap-2 cursor-pointer transition-all duration-300 ${
            activeTab === 'corporate'
              ? 'border-tertiary text-tertiary bg-tertiary/10 shadow-[0_0_15px_rgba(255,185,95,0.2)]'
              : 'border-white/10 text-on-surface-variant hover:text-on-surface hover:bg-white/5 bg-white/3'
          }`}
        >
          <span className={`w-2 h-2 rounded-full shadow-[0_0_8px_#ffb95f] ${activeTab === 'corporate' ? 'bg-tertiary' : 'bg-tertiary/50'}`}></span>
          Corporate & Professional
        </button>

        <button
          onClick={() => setActiveTab('anime')}
          className={`whitespace-nowrap px-6 py-2.5 rounded-full border text-xs font-sans flex items-center gap-2 cursor-pointer transition-all duration-300 ${
            activeTab === 'anime'
              ? 'border-red-400 text-red-400 bg-red-400/10 shadow-[0_0_15px_rgba(244,63,94,0.2)]'
              : 'border-white/10 text-on-surface-variant hover:text-on-surface hover:bg-white/5 bg-white/3'
          }`}
        >
          <span className={`w-2 h-2 rounded-full shadow-[0_0_8px_#ffb4ab] ${activeTab === 'anime' ? 'bg-red-400' : 'bg-red-400/50'}`}></span>
          Anime & Illustration
        </button>
      </div>

      {/* Cards Deck Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredModels.map((model) => {
          const isAnime = model.id === 'neo-tokyo-anime';
          const is3D = model.id === 'surreal-octane';
          const isProfessional = model.id === 'executive-suite';

          return (
            <div
              key={model.id}
              onClick={() => onSelectModel(model)}
              className="glass-card flex flex-col cursor-pointer hover:shadow-[0_0_40px_rgba(99,102,190,0.12)] group relative h-full shrink-0"
            >
              {/* Card visual background elements */}
              {isAnime && (
                <div className="absolute top-0 right-0 w-32 h-32 bg-secondary/5 blur-3xl rounded-full pointer-events-none"></div>
              )}

              {/* Cover image wrap */}
              <div className="h-56 relative overflow-hidden bg-black/40">
                <img
                  alt={model.name}
                  className="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-transform duration-700 group-hover:scale-105"
                  src={model.image}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#0b0f19]/90 to-transparent opacity-80"></div>
                
                {/* Float tag model category */}
                <div className="absolute top-4 left-4 bg-[#0b0f19]/80 backdrop-blur-md px-3 py-1 rounded-md border border-white/10 flex items-center gap-1.5">
                  {isProfessional && <Briefcase className="w-3.5 h-3.5 text-tertiary" />}
                  {isAnime && <Brush className="w-3.5 h-3.5 text-[#ffb4ab]" />}
                  {is3D && <Frame className="w-3.5 h-3.5 text-primary" />}
                  <span className="text-[10px] font-label font-bold text-on-surface tracking-wider uppercase">
                    {model.category}
                  </span>
                </div>

                {/* Optional Trending Banner */}
                {model.tag && (
                  <div className="absolute top-4 right-4 bg-secondary text-on-secondary px-2.5 py-0.5 rounded text-[9px] font-label font-bold uppercase tracking-widest shadow-[0_0_10px_#4cd7f6] animate-pulse">
                    {model.tag}
                  </div>
                )}
              </div>

              {/* Body elements */}
              <div className="p-6 flex-1 flex flex-col justify-between">
                <div>
                  <h4 className="text-xl font-semibold text-on-surface mb-2 tracking-tight group-hover:text-primary transition-colors duration-300">
                    {model.name}
                  </h4>
                  <p className="text-sm text-on-surface-variant mb-6 leading-relaxed opacity-85">
                    {model.description}
                  </p>
                </div>

                {/* Lower stat parameters row */}
                <div className="flex items-end justify-between pt-4 border-t border-white/10 mt-auto">
                  <div className="flex flex-col gap-1 text-left">
                    <span className="text-[10px] font-label text-on-surface-variant flex items-center gap-1">
                      {model.isTextPromptOnly ? (
                        <>
                          <MessageSquare className="w-3.5 h-3.5 text-teal-400/85" />
                          Text Prompt Only
                        </>
                      ) : (
                        <>
                          <Upload className="w-3.5 h-3.5 text-[#acedff]/85" />
                          {model.photosNeeded} Photos Needed
                        </>
                      )}
                    </span>
                    <span className="text-sm font-bold text-secondary flex items-center gap-1 leading-none mt-1">
                      <Coins className="w-4 h-4 text-tertiary" />
                      {model.cost} Coins
                    </span>
                  </div>

                  {/* Circle trigger button */}
                  <div className="w-10 h-10 rounded-full border border-primary/30 flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-on-primary group-hover:border-primary transition-all duration-300 transform group-hover:scale-105">
                    <ArrowRight className="w-5 h-5" />
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
