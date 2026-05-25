import { useState } from 'react';
import { Search, Image as ImageIcon, Video, Layers, Sparkles, X, Clock, HelpCircle, Eye, Trash2, Copy, FileCode } from 'lucide-react';
import { GalleryItem } from '../types';

interface MyGalleryViewProps {
  items: GalleryItem[];
  onDeleteItem: (id: string) => void;
}

export default function MyGalleryView({ items, onDeleteItem }: MyGalleryViewProps) {
  const [filterType, setFilterType] = useState<'all' | 'image' | 'video'>('all');
  const [searchPhrase, setSearchPhrase] = useState('');
  const [selectedItem, setSelectedItem] = useState<GalleryItem | null>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const filteredItems = items.filter((item) => {
    // Media type filter
    if (filterType !== 'all' && item.type !== filterType) return false;
    
    // Search phrase prompt match
    if (searchPhrase) {
      const matchText = (item.prompt + " " + item.title).toLowerCase();
      if (!matchText.includes(searchPhrase.toLowerCase())) return false;
    }
    return true;
  });

  const handleCopyPrompt = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 1500);
  };

  const handleTriggerDelete = (id: string) => {
    if (confirm("Are you certain you wish to purge this synthesized artwork from coordinates? This cannot be undone.")) {
      onDeleteItem(id);
      setSelectedItem(null);
    }
  };

  return (
    <div className="w-full relative py-6 animate-fade-up">
      {/* Search and Media Filter Row */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
        {/* Search */}
        <div className="relative w-full sm:w-80">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-on-surface-variant/50 w-4.5 h-4.5" />
          <input
            className="input-glass w-full rounded-full py-2.5 pl-11 pr-4 text-xs font-sans placeholder-on-surface-variant/40 text-on-surface"
            placeholder="Search prompt contents..."
            type="text"
            value={searchPhrase}
            onChange={(e) => setSearchPhrase(e.target.value)}
          />
        </div>

        {/* Media type toggle filters */}
        <div className="flex items-center gap-1.5 p-1 rounded-full bg-white/5 border border-white/5 backdrop-blur-md">
          <button
            onClick={() => setFilterType('all')}
            className={`cursor-pointer px-4 py-2 rounded-full text-xs font-semibold flex items-center gap-1.5 transition-all duration-300 ${
              filterType === 'all'
                ? 'bg-primary text-on-primary shadow-lg shadow-primary/15'
                : 'text-on-surface-variant hover:text-on-surface'
            }`}
          >
            <Layers className="w-3.5 h-3.5" />
            All Media
          </button>
          <button
            onClick={() => setFilterType('image')}
            className={`cursor-pointer px-4 py-2 rounded-full text-xs font-semibold flex items-center gap-1.5 transition-all duration-300 ${
              filterType === 'image'
                ? 'bg-primary text-on-primary shadow-lg shadow-primary/15'
                : 'text-on-surface-variant hover:text-on-surface'
            }`}
          >
            <ImageIcon className="w-3.5 h-3.5" />
            Images
          </button>
          <button
            onClick={() => setFilterType('video')}
            className={`cursor-pointer px-4 py-2 rounded-full text-xs font-semibold flex items-center gap-1.5 transition-all duration-300 ${
              filterType === 'video'
                ? 'bg-primary text-on-primary shadow-lg shadow-primary/15'
                : 'text-on-surface-variant hover:text-on-surface'
            }`}
          >
            <Video className="w-3.5 h-3.5" />
            Videos
          </button>
        </div>
      </div>

      {/* Bento Grid Gallery view */}
      {filteredItems.length === 0 ? (
        <div className="w-full flex flex-col items-center justify-center p-20 glass-panel rounded-2xl border border-dashed text-left max-w-lg mx-auto mt-8">
          <Layers className="w-12 h-12 text-on-surface-variant/30 mb-4 stroke-1" />
          <h4 className="text-lg font-bold text-on-surface mb-1">No matches synthesized</h4>
          <p className="text-xs text-on-surface-variant leading-relaxed text-center">
            Adjust coordinates or initiate a new generation in Creative Studio to fill your personal registry files.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredItems.map((item, idx) => {
            const isWide = idx === 1 || idx === 5; // Simulates organic bento layouts for structural spacing

            return (
              <div
                key={item.id}
                onClick={() => setSelectedItem(item)}
                className={`glass-card relative flex flex-col cursor-pointer overflow-hidden border border-white/10 group ${
                  isWide ? 'sm:col-span-1 lg:col-span-2' : ''
                }`}
              >
                {/* Image wrapper */}
                <div className="h-64 relative bg-black/45 overflow-hidden flex items-center justify-center">
                  <img
                    alt={item.title}
                    className="w-full h-full object-cover opacity-85 group-hover:opacity-100 group-hover:scale-103 transition-all duration-500 ease-out"
                    src={item.image}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#05070C] via-transparent opacity-80 z-10"></div>
                  
                  {/* Overlay inspect indicator */}
                  <div className="absolute inset-0 z-20 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity bg-black/30">
                    <div className="w-11 h-11 rounded-full bg-white/10 border border-white/20 flex items-center justify-center text-white text-sm backdrop-blur-md">
                      <Eye className="w-5 h-5" />
                    </div>
                  </div>

                  {/* Top-right float tags */}
                  <div className="absolute top-4 right-4 bg-black/70 backdrop-blur-sm px-2.5 py-1 rounded border border-white/10 flex items-center gap-1.5 z-10 select-none">
                    <span className="text-[9px] font-code text-on-surface-variant uppercase">
                      {item.engine}
                    </span>
                  </div>
                </div>

                {/* Info summary header */}
                <div className="p-5 flex flex-col text-left relative z-20">
                  <h4 className="font-semibold text-base text-on-surface truncate mb-1">
                    {item.title}
                  </h4>
                  <p className="text-xs text-on-surface-variant truncate opacity-80">
                    {item.prompt}
                  </p>
                  
                  <div className="flex justify-between items-center mt-4 pt-3 border-t border-white/10 text-[10px] font-code text-on-surface-variant">
                    <span className="flex items-center gap-1">
                      <Clock className="w-3 h-3 text-secondary/70" />
                      {item.duration} sec
                    </span>
                    <span>
                      {item.date}
                    </span>
                  </div>
                </div>

              </div>
            );
          })}
        </div>
      )}

      {/* ==================== LIGHTBOX DIALOG OVERLAY ==================== */}
      {selectedItem && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          {/* Backdrop screen */}
          <div
            className="absolute inset-0 bg-[#05070C]/85 backdrop-blur-2xl transition-opacity duration-400"
            onClick={() => setSelectedItem(null)}
          ></div>

          {/* Core Window box */}
          <div className="relative glass-floating w-full max-w-5xl rounded-2xl border border-white/10 flex flex-col lg:flex-row h-[90vh] lg:h-[75vh] overflow-hidden shadow-[0_0_60px_rgba(192,193,255,0.15)] animate-scale-up z-10 shrink-0">
            
            {/* 1. Graphic display section */}
            <div className="w-full lg:w-[60%] bg-black/5 p-4 flex items-center justify-center border-b lg:border-b-0 lg:border-r border-white/10 relative">
              <img
                alt={selectedItem.title}
                className="w-full h-full object-contain rounded-lg"
                src={selectedItem.image}
              />
            </div>

            {/* 2. Metadata inspector panel */}
            <div className="w-full lg:w-[40%] p-6 sm:p-8 flex flex-col justify-between text-left overflow-y-auto custom-scrollbar bg-[#0b0f19]/30">
              {/* Scrollable details */}
              <div className="space-y-6">
                
                {/* Header title */}
                <div className="flex justify-between items-start gap-4">
                  <div>
                    <h3 className="text-xl sm:text-2xl font-bold font-sans text-on-surface tracking-tight">
                      {selectedItem.title}
                    </h3>
                    <p className="text-[10px] font-code text-secondary tracking-widest uppercase mt-1">
                      Coordinates: Iteration Matrix
                    </p>
                  </div>
                  <button
                    onClick={() => setSelectedItem(null)}
                    className="text-on-surface-variant hover:text-white transition-colors bg-white/5 hover:bg-white/10 p-2 rounded-full cursor-pointer"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                {/* Monospaced prompt string */}
                <div className="space-y-2">
                  <span className="text-[10px] font-label text-on-surface-variant font-bold tracking-wider uppercase">
                    Guidance Prompt
                  </span>
                  <div className="relative bg-[#05070C]/60 border border-white/10 rounded-xl p-4 text-xs font-code leading-relaxed text-on-surface max-h-36 overflow-y-auto custom-scrollbar">
                    {selectedItem.prompt}
                    <button
                      onClick={() => handleCopyPrompt(selectedItem.prompt, selectedItem.id)}
                      className="absolute bottom-3 right-3 text-on-surface-variant hover:text-secondary opacity-70 hover:opacity-100 transition-opacity cursor-pointer p-1 rounded hover:bg-white/5"
                      title="Copy Prompt"
                    >
                      {copiedId === selectedItem.id ? (
                        <span className="text-[10px] font-label text-emerald-400 font-bold uppercase tracking-wider">
                          Copied!
                        </span>
                      ) : (
                        <Copy className="w-4 h-4 text-secondary" />
                      )}
                    </button>
                  </div>
                </div>

                {/* Parameters specs list */}
                <div className="space-y-3">
                  <span className="text-[10px] font-label text-on-surface-variant font-bold tracking-wider uppercase block">
                    Synthesis Parameters
                  </span>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-white/3 border border-white/5 rounded-lg p-3">
                      <span className="text-[10px] text-on-surface-variant block uppercase font-code">
                        Model Engine
                      </span>
                      <span className="text-xs font-semibold text-on-surface block mt-1">
                        {selectedItem.engine}
                      </span>
                    </div>

                    <div className="bg-white/3 border border-white/5 rounded-lg p-3">
                      <span className="text-[10px] text-on-surface-variant block uppercase font-code">
                        Speed (Duration)
                      </span>
                      <span className="text-xs font-semibold text-on-surface block mt-1 flex items-center gap-1.5">
                        <Clock className="w-3.5 h-3.5 text-secondary" />
                        {selectedItem.duration}
                      </span>
                    </div>

                    <div className="bg-white/3 border border-white/5 rounded-lg p-3">
                      <span className="text-[10px] text-on-surface-variant block uppercase font-code">
                        Seed Coordinates
                      </span>
                      <span className="text-xs font-semibold text-on-surface block mt-1 truncate">
                        {selectedItem.seed}
                      </span>
                    </div>

                    <div className="bg-white/3 border border-white/5 rounded-lg p-3">
                      <span className="text-[10px] text-on-surface-variant block uppercase font-code">
                        Resolution Grid
                      </span>
                      <span className="text-xs font-semibold text-on-surface block mt-1">
                        {selectedItem.resolution}
                      </span>
                    </div>
                  </div>
                </div>

              </div>

              {/* Delete trigger panel always at lower edge */}
              <div className="pt-6 border-t border-white/10 mt-8 flex items-center justify-between">
                <span className="text-[10px] font-code text-on-surface-variant">
                  Captured: {selectedItem.date}
                </span>

                <button
                  onClick={() => handleTriggerDelete(selectedItem.id)}
                  className="bg-red-500/10 hover:bg-red-500/20 text-[#ffb4ab] border border-red-500/20 hover:border-red-500/50 px-4 py-2 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all duration-300 cursor-pointer"
                  title="Purge Artwork"
                >
                  <Trash2 className="w-4 h-4" />
                  Purge Asset
                </button>
              </div>

            </div>

          </div>

        </div>
      )}

    </div>
  );
}
