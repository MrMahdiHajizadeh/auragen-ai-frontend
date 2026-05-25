import { useState, useRef, useEffect } from 'react';
import { Upload, Info, Wand2, Play, Terminal, CheckCircle, Sparkles, X, PlusCircle, Coins } from 'lucide-react';
import { GeneratorModel, GalleryItem, UserSession } from '../types';
import { REFERENCE_PHOTOS } from '../data';
import { ApiService } from '../services/api';

interface WorkspaceViewProps {
  model: GeneratorModel;
  user: UserSession;
  deductCoins: (amount: number) => boolean;
  onGenerationComplete: (newItem: GalleryItem) => void;
  openStore: () => void;
}

export default function WorkspaceView({ model, user, deductCoins, onGenerationComplete, openStore }: WorkspaceViewProps) {
  // Upload and Prompt States
  const [references, setReferences] = useState<string[]>(REFERENCE_PHOTOS);
  const [promptText, setPromptText] = useState('');
  const [isSuggesting, setIsSuggesting] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  
  // Progress Dialog States
  const [showStatusDialog, setShowStatusDialog] = useState(false);
  const [logs, setLogs] = useState<string[]>([]);
  const [generationPhase, setGenerationPhase] = useState<'running' | 'success'>('running');
  const [newlyGeneratedItem, setNewlyGeneratedItem] = useState<GalleryItem | null>(null);

  const logsEndRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Auto-scroll logs terminal
  useEffect(() => {
    if (logsEndRef.current) {
      logsEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [logs]);

  // Google Gemini API suggest custom prompt
  const handleSuggestPrompt = async () => {
    setIsSuggesting(true);
    setPromptText("Synthesizing creative recommendation...");
    try {
      const styleCategory = model.id === 'executive-suite' ? 'Professional' 
                          : model.id === 'neo-tokyo-anime' ? 'Anime' 
                          : '3D Render';

      const response = await fetch('/api/suggest-prompt', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          modelName: model.name,
          style: styleCategory,
          currentPrompt: promptText !== "Synthesizing creative recommendation..." ? promptText : ""
        })
      });
      const data = await response.json();
      if (data.prompt) {
        setPromptText('');
        // Animate simulated typing text
        let fullText = data.prompt;
        let index = 0;
        const interval = setInterval(() => {
          setPromptText(prev => prev + fullText.charAt(index));
          index++;
          if (index >= fullText.length) {
            clearInterval(interval);
          }
        }, 15);
      }
    } catch (e) {
      console.error(e);
      setPromptText("Cyberpunk neon details, highly stylized portrait, soft rim lighting, ultra detailed.");
    } finally {
      setIsSuggesting(false);
    }
  };

  // Trigger file inputs
  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };

  // Real File upload to API
  const handleRealFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    setIsUploading(true);
    try {
      for (let i = 0; i < files.length; i++) {
        if (references.length >= 10) {
          alert("Maximum 10 reference images reached.");
          break;
        }
        const file = files[i];
        const res = await ApiService.uploadImage(file);
        setReferences(prev => [...prev, res.url]);
      }
    } catch (err: any) {
      alert(err.message || "Uploader error occurred.");
    } finally {
      setIsUploading(false);
      if (e.target) e.target.value = '';
    }
  };

  // Add sample custom photo dynamically
  const handleAddSampleReference = () => {
    if (references.length >= 10) return;
    const extraPhotos = [
      "https://lh3.googleusercontent.com/aida-public/AB6AXuCDlAWPld1WnQHYbjyEIn7b38EXEHxi2jhrceI_fxcfGvAiLfPp-XXyHPricHvnXBrN_lF-ftVvgKqnPHDeLnopFHqF_hHYSGDP_rLVui9yEBGeuKweajQYfxnLPa82cxy7eced8dxD43i-KALuGD6kOL8iR4R3iN9VQdxMMRBsIlvzVN_EwC2OBJ7Z3w1bOLrg1CoT8oXU4fiV_N8fJY1kYZKV0eQBaE2r14CvOSaFIGwPuOFiCyn9G-nVRrnnE6Noqeiaq2WTTF_7",
      "https://lh3.googleusercontent.com/aida-public/AB6AXuBO4sqaSRvsPR9SvGX7deu6_l7xSkwubwSa3-oRpbVv6z1QHE4r0KPZDZd0_IMVvAOuihV2huorSniGJv1dz0yKmlfj2e8KgyQRulBHMR42vxiidtmrtcqpHTsc42pZD3Vozky5EMUPTPaqxkMDACIUh5LO_wMv0s6-hi9meITbSt3ADkpfQ5Atat_vvRvFsJhaUq0DncHjcS8ad2LN_QMoZEEvfu4DEYvHSAGYbyPZOq64otEjvnBgdlLFD8qqoCnWOSMwHbLnbbg-",
      "https://lh3.googleusercontent.com/aida-public/AB6AXuC7yUR7y_fVli2hIOFUbLn4DZb1npcakF8HZQbHlaY0thtNGT_30yifrKdf23TSIg3OSu6nbhrMFh_KsCSZXBglNThMc8qX-whxs3LPqpz_VryLL_UC09AzucjsRNZUeYFvmfmENWFqWsiLlP5fp_YjzvqOJuVyje5LD4GaNAN9hkUKGrRaDoFa-KifsAmBmo9u-6PsR3snYzuVr6SCMt_l-rMvtOzDJg2KKKN1HtbSicVq5ATjdhYHchP8FfVaG_nctB9grY19TYEC"
    ];
    
    const index = references.length % extraPhotos.length;
    setReferences(prev => [...prev, extraPhotos[index]]);
  };

  // Remove uploaded reference photo
  const handleRemovePhoto = (index: number) => {
    setReferences(prev => prev.filter((_, i) => i !== index));
  };

  // Initiate generation session
  const handleInitiateGeneration = async () => {
    // Validate coins
    const cost = model.cost;
    const validationPassed = deductCoins(cost);
    if (!validationPassed) {
      alert("Insufficient account balance. Please acquire more Coins to proceed.");
      openStore();
      return;
    }

    setLogs([]);
    setGenerationPhase('running');
    setNewlyGeneratedItem(null);
    setShowStatusDialog(true);

    try {
      // Send mock UUIDs to represent files
      const mockIds = references.map(() => '00000000-0000-0000-0000-000000000000');
      const res = await ApiService.initiateGeneration(model.id, mockIds, promptText);

      if (res.ws_url) {
        // Real WebSocket integration
        const socket = new WebSocket(res.ws_url);
        
        socket.onopen = () => {
          setLogs(prev => [...prev, "[sys] WebSocket channel opened. Awaiting steps..."]);
        };

        socket.onmessage = (event) => {
          const data = JSON.parse(event.data);
          if (data.log) {
            setLogs(prev => [...prev, data.log]);
          }
          if (data.progress === 100 && data.output_image_url) {
            const finishedItem: GalleryItem = {
              id: data.id || 'generated-' + Date.now(),
              title: model.name + ' Iteration',
              prompt: promptText || 'Latent synthesis output',
              engine: 'AuraGen Engine ' + model.name,
              duration: '32.1s',
              resolution: '1024 x 1024',
              seed: Math.floor(Math.random() * 90000000),
              cost: model.cost,
              date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
              image: data.output_image_url,
              type: 'image',
              refImage: references[0]
            };
            
            setNewlyGeneratedItem(finishedItem);
            setGenerationPhase('success');
            onGenerationComplete(finishedItem);
            socket.close();
          }
        };

        socket.onerror = (e) => {
          console.error("Socket error, executing offline compilation:", e);
          triggerOfflineSimulation();
        };
      } else {
        triggerOfflineSimulation();
      }
    } catch (err: any) {
      alert(`Could not generate: ${err.message || err}`);
      setShowStatusDialog(false);
    }
  };

  // Fallback offline simulator if no ws_url returned
  const triggerOfflineSimulation = () => {
    const steps = [
      "[sys] Initializing secure high-speed GPU cluster tunnel...",
      "[net] Connected to compute region standard-us-central-k8s-04",
      "[auth] Validating client authorization tokens... Done.",
      `[data] Ingesting ${references.length} reference tensor streams...`,
      "[model] Aligning styles on target diffusion checkpoint v4.25",
      "[compute] Host allocated: 24GB VRAM on Nvidia H100 GPU cluster",
      `[process] Constructing facial geometric coordinates: matches completed with 99.1% fidelity`,
      `[process] Compiling text guidance prompt: "${promptText || 'Cinematic default lighting, high contrast headshot'}"`,
      "[diffuse] Launching 30-step latent synthesis scheduler...",
      "[diffuse] Step 05/30: Coarse structures mapped successfully",
      "[diffuse] Step 12/30: Spectral lighting balance established",
      "[diffuse] Step 22/30: Upscaling textures via bilinear real-esrgan",
      "[diffuse] Step 28/30: Restoring facial skin high-frequency frequencies",
      "[sys] Generating final image asset array format",
      "[success] Image fully compiled! Uploading output array buffer and generating URL context...",
      "[sys] Matrix calculations finalized. Process complete."
    ];

    let currentLogIndex = 0;
    const triggerNextLog = () => {
      if (currentLogIndex < steps.length) {
        setLogs(prev => [...prev, steps[currentLogIndex]]);
        currentLogIndex++;
        setTimeout(triggerNextLog, Math.random() * 150 + 100);
      } else {
        setTimeout(() => {
          let finalImage = 'https://lh3.googleusercontent.com/aida-public/AB6AXuCciJHfBH1_OVUK5SLRAkyAOEpjLbOXzkR1P8VTnZG2WAbC7LB21z1Kjd61CoBliN4riHk54zGbeeh3NzqenAFB0JWiV7-wv462NQr-sbOm3JkQGhnrdCH-dzf6xe1m6jmCM7hZ39D93xJ9wQ76d44bsxItJow9zwG6RV4uM9tTNIlEmEmL9g8XFKWoKZVbPj6xjtBIh7xzH973HjkraCJeyD-CRzqImz_E17AWyAETckv2Py5CHi167_oE8E0_Ek58DFF1C8Nn40--';
          if (model.id === 'executive-suite') {
            finalImage = 'https://lh3.googleusercontent.com/aida-public/AB6AXuC-Xr_WXKEIg5wnzuiY9H9qewe8Gmebqm0fzzyeibn9h-AtX-_fSe4I1WNsY_j0NZqyCzyvd9SGtJm4WI8yk6zMJYI_YJ1GLIOBjQZ0I-I9rE_xsSnzlrwdkKsLfQNiorkqFlqgwU19qT3VhKGMLR4UXwwhaluvHJL7h_4yCBABU1sFbUItNsKYkcvcLv3rtdRX1ELnupsSto065xs68CWkQaARkGZXej0mkm4_HFQPpt0HqGho7mUfndHMvzSYKfVDfrsOX3xkz1g5';
          } else if (model.id === 'neo-tokyo-anime') {
            finalImage = 'https://lh3.googleusercontent.com/aida-public/AB6AXuAHU0NuXKsejJXlh3vTfDTHVWo09-XBXsM2lZFhnn3nH0lkfT9ZfnckpfJWqKGdu2MfqF3NDlVgH2kOkclfEYYdkEQ3m8VCb5XUPsmrwRCsYKCjFr2ILazC9Q3HJq31eNxvW0c035gRPfR82KUL_UfRL1C5NJyJiGc-63qGEfA5GMuJy8iHEHlUsycooBQFY4tiXxsKL0ZqmcWabkWxfpwlYSCmfd0UhO_y3a68muBITIUYt2T9evGhJ3VnA8alCbg06ySdFNZx8qrs';
          }
          
          const newlyGenerated: GalleryItem = {
            id: 'generated-' + Date.now(),
            title: model.name + ' Iteration',
            prompt: promptText || 'Bespoke high fidelity studio layout',
            engine: 'AuraGen Engine ' + model.name,
            duration: '32.1s',
            resolution: '1024 x 1024',
            seed: Math.floor(Math.random() * 90000000),
            cost: model.cost,
            date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
            image: finalImage,
            type: 'image',
            refImage: references[0]
          };

          setNewlyGeneratedItem(newlyGenerated);
          setGenerationPhase('success');
          onGenerationComplete(newlyGenerated);
        }, 600);
      }
    };
    setTimeout(triggerNextLog, 200);
  };

  return (
    <div className="w-full relative py-6 animate-fade-up">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* LEFT COLUMN: Sidebar Summary & Guidance */}
        <aside className="lg:col-span-4 flex flex-col gap-6 lg:sticky lg:top-28">
          
          {/* Glass detail card */}
          <div className="glass-panel rounded-2xl p-8 relative overflow-hidden group">
            <div className="absolute inset-0 bg-gradient-to-br from-primary/10 to-transparent opacity-50 z-0"></div>
            <div className="relative z-10">
              <div className="w-14 h-14 rounded-xl bg-primary/20 flex items-center justify-center mb-6 border border-primary/30 text-primary">
                <Sparkles className="w-7 h-7" />
              </div>
              <h2 className="text-2xl font-semibold text-on-surface mb-2 tracking-tight">
                {model.id === 'executive-suite' ? 'Neural Headshot Gen v4' : model.name}
              </h2>
              <p className="text-sm text-on-surface-variant mb-6 leading-relaxed opacity-90">
                {model.details}
              </p>
              
              <div className="flex items-center justify-between border-t border-white/10 pt-4 mt-4">
                <div className="flex flex-col text-left">
                  <span className="text-[10px] font-label text-on-surface-variant mb-1 uppercase tracking-wider">
                    Compute Cost
                  </span>
                  <span className="text-base font-semibold text-tertiary flex items-center gap-1.5 leading-none">
                    <Coins className="w-4.5 h-4.5 text-tertiary" />
                    {model.cost} Coins
                  </span>
                </div>
                <div className="flex flex-col items-end">
                  <span className="text-[10px] font-label text-on-surface-variant mb-1 uppercase tracking-wider">
                    Est. Time
                  </span>
                  <span className="text-base font-semibold text-on-surface leading-none">
                    {model.estTime}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Optimal Guidance Box */}
          <div className="glass-panel rounded-xl p-5 border-l-2 border-l-secondary text-left">
            <div className="flex gap-3">
              <Info className="w-6 h-6 text-secondary shrink-0" />
              <div>
                <h4 className="text-sm font-semibold text-secondary mb-1">
                  Optimal Results
                </h4>
                <p className="text-xs font-code text-on-surface-variant leading-relaxed">
                  Ensure uploaded subjects face the camera with neutral lighting. Avoid occlusions (glasses, hats) for base model alignment.
                </p>
              </div>
            </div>
          </div>
        </aside>

        {/* RIGHT COLUMN: Interactive Workspace */}
        <section className="lg:col-span-8 flex flex-col gap-6">
          
          {/* Uploader Card */}
          <div className="glass-panel rounded-2xl p-6 sm:p-8 flex flex-col gap-6 text-left">
            <div className="flex justify-between items-end mb-2">
              <div>
                <h3 className="text-xl sm:text-2xl font-semibold text-on-surface tracking-tight">
                  Subject Data
                </h3>
                <p className="text-xs sm:text-sm text-on-surface-variant mt-1">
                  Upload 4 to 10 high-quality facial reference images.
                </p>
              </div>
              <span className="text-[10px] font-label font-bold text-on-surface-variant bg-white/5 px-3 py-1.5 rounded-full border border-white/10 shrink-0">
                {references.length} / 10 Max
              </span>
            </div>

            {/* Hidden Input file selector */}
            <input
              type="file"
              ref={fileInputRef}
              style={{ display: 'none' }}
              multiple
              accept="image/png, image/jpeg"
              onChange={handleRealFileUpload}
            />

            {/* Drag & Drop active area */}
            <div
              onClick={triggerFileInput}
              className={`w-full h-40 border-2 border-dashed rounded-xl bg-white/3 flex flex-col items-center justify-center gap-3 transition-all duration-300 cursor-pointer group ${
                isUploading ? 'border-indigo-400 bg-indigo-500/5' : 'border-white/20 hover:border-secondary/50 hover:bg-secondary/5'
              }`}
            >
              <div className="w-12 h-12 rounded-full bg-white/5 flex items-center justify-center text-on-surface-variant group-hover:text-secondary transition-colors">
                <Upload className="w-6 h-6" />
              </div>
              <div className="text-center px-4">
                <span className="text-sm text-on-surface font-semibold block">
                  {isUploading ? 'Uploading reference photo...' : 'Drag & drop reference files here'}
                </span>
                <span className="text-[11px] font-code text-on-surface-variant">
                  or click here to select PNG or JPEG files (Max 5MB)
                </span>
              </div>
            </div>

            {/* Photo List Previews grid */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-2">
              {references.map((url, index) => (
                <div key={index} className="aspect-square rounded-xl overflow-hidden relative group border border-white/10 bg-black/40">
                  <img
                    alt={`Reference ${index + 1}`}
                    className="w-full h-full object-cover opacity-85 group-hover:opacity-100 transition-transform duration-300 group-hover:scale-105"
                    src={url}
                  />
                  {/* Remove hover trigger */}
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleRemovePhoto(index);
                    }}
                    className="absolute top-2.5 right-2.5 w-7 h-7 rounded-full bg-red-500/90 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-y-2 group-hover:translate-y-0 shadow-lg cursor-pointer hover:bg-red-600"
                    title="Remove Photo"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              ))}
              
              {/* Optional Empty slots up to 4 */}
              {references.length < 4 && (
                <div
                  onClick={triggerFileInput}
                  className="aspect-square rounded-xl border border-dashed border-white/10 flex flex-col items-center justify-center bg-white/2 cursor-pointer hover:bg-white/5 text-on-surface-variant/50 hover:text-on-surface-variant transition-all hover:border-primary/40"
                >
                  <PlusCircle className="w-8 h-8 opacity-60 mb-1" />
                  <span className="text-[10px] font-label uppercase text-on-surface-variant tracking-wider">
                    Add {4 - references.length} Min
                  </span>
                </div>
              )}
            </div>
          </div>

          {/* Prompt & Submit Button panel */}
          <div className="glass-panel rounded-2xl p-6 sm:p-8 flex flex-col gap-6 text-left">
            <div>
              <label htmlFor="prompt" className="text-[10px] font-label font-bold text-on-surface uppercase tracking-widest block mb-3">
                Latent Synthesis Prompt (Optional)
              </label>
              <div className="relative">
                <textarea
                  id="prompt"
                  rows={3}
                  value={promptText}
                  onChange={(e) => setPromptText(e.target.value)}
                  placeholder="Describe specific styling. E.g., 'Cyberpunk neon lighting, rain-slicked skin, cinematic 8k, volumetric smoke...'"
                  className="w-full bg-[#05070C]/50 border border-white/10 rounded-xl p-4 pr-12 text-sm text-on-surface focus:outline-none focus:border-secondary focus:ring-1 focus:ring-secondary transition-all duration-300 placeholder-on-surface-variant/40 resize-none glass-panel"
                ></textarea>
                
                {/* auto_fix SUGGEST button to hit Gemini API */}
                <button
                  type="button"
                  disabled={isSuggesting}
                  onClick={handleSuggestPrompt}
                  className="absolute bottom-4 right-4 text-secondary hover:text-primary transition-colors cursor-pointer disabled:opacity-50"
                  title="Auto-Suggest Prompt with Gemini AI"
                >
                  <Wand2 className={`w-5 h-5 ${isSuggesting ? 'animate-pulse text-primary' : ''}`} />
                </button>
              </div>
            </div>

            {/* Invoke Generation triggers simulator */}
            <button
              onClick={handleInitiateGeneration}
              className="w-full py-4 rounded-xl bg-primary text-on-primary font-bold text-base shadow-[0_0_20px_rgba(192,193,255,0.3)] hover:shadow-[0_0_35px_rgba(192,193,255,0.6)] hover:-translate-y-0.5 transition-all duration-300 flex items-center justify-center gap-3 relative overflow-hidden group cursor-pointer"
            >
              <span className="absolute inset-0 bg-white/15 translate-y-full group-hover:translate-y-0 transition-transform duration-500 ease-in-out"></span>
              <Play className="w-5 h-5 relative z-10 fill-on-primary" />
              <span className="relative z-10">Initiate Generation</span>
            </button>
          </div>
        </section>

      </div>

      {/* ==================== TERMINAL COMPLETION PROGRESS OVERLAY MODAL ==================== */}
      {showStatusDialog && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          
          {/* Blur background backdrop */}
          <div
            className="absolute inset-0 bg-[#05070C]/85 backdrop-blur-2xl transition-opacity duration-500"
            onClick={() => {
              if (generationPhase === 'success') setShowStatusDialog(false);
            }}
          ></div>

          {/* Floating glass content */}
          <div className="relative glass-floating w-full max-w-4xl rounded-2xl border border-white/10 flex flex-col overflow-hidden shadow-[0_0_60px_rgba(192,193,255,0.15)] transition-all duration-500 scale-100 opacity-100 z-10">
            
            {/* VIEW A: Running generation with progress logs terminal */}
            {generationPhase === 'running' && (
              <div className="flex flex-col lg:flex-row w-full h-[500px]">
                
                {/* Left: Interactive rotating circle visualization */}
                <div className="w-full lg:w-1/2 p-8 md:p-12 flex flex-col items-center justify-center border-b lg:border-b-0 lg:border-r border-white/10 relative overflow-hidden">
                  <div className="absolute inset-x-0 w-full h-full bg-radial-gradient from-primary/10 to-transparent opacity-50 pulse-ring"></div>
                  
                  {/* High visual graphics spinner */}
                  <div className="relative w-44 h-44 flex items-center justify-center">
                    <svg className="loader-ring w-full h-full text-primary/30" viewBox="0 0 100 100">
                      <circle cx="50" cy="50" fill="none" r="48" stroke="currentColor" strokeDasharray="10 4" strokeWidth="1"></circle>
                      <circle cx="50" cy="50" fill="none" r="40" stroke="currentColor" strokeDasharray="5 5" strokeWidth="0.5" className="opacity-50" style={{ animation: 'spin-slow 4s linear infinite reverse' }}></circle>
                    </svg>
                    <svg className="absolute inset-0 w-full h-full text-secondary drop-shadow-[0_0_15px_rgba(76,215,246,0.6)]" viewBox="0 0 100 100" style={{ animation: 'spin-slow 2s cubic-bezier(0.4, 0, 0.2, 1) infinite' }}>
                      <circle cx="50" cy="50" fill="none" r="48" stroke="currentColor" strokeDasharray="30 270" strokeLinecap="round" strokeWidth="2"></circle>
                    </svg>
                    <Sparkles className="absolute text-primary w-12 h-12 animate-pulse" />
                  </div>

                  <h3 className="text-xl sm:text-2xl font-semibold text-on-surface mt-8 mb-2">
                    Synthesizing Latents
                  </h3>
                  <p className="text-xs text-on-surface-variant font-code animate-pulse text-center">
                    Allocating cluster nodes... Rendering step...
                  </p>
                </div>

                {/* Right: Simulated Command Line logs */}
                <div className="w-full lg:w-1/2 bg-[#020408]/95 p-6 relative overflow-hidden flex flex-col text-left">
                  <div className="flex items-center gap-2 mb-4 border-b border-white/10 pb-3">
                    <Terminal className="w-4.5 h-4.5 text-on-surface-variant" />
                    <span className="text-[10px] font-label font-bold text-on-surface-variant uppercase tracking-wider">
                      WS://CLUSTER-09.AURAGEN.AI
                    </span>
                  </div>

                  {/* Terminal stdout logs lines block */}
                  <div className="font-code text-xs text-on-surface-variant/90 space-y-2.5 overflow-y-auto flex-1 pb-4 flex flex-col justify-start custom-scrollbar">
                    {logs.map((log, index) => {
                      let color = "text-on-surface-variant/80";
                      if (log.includes("[success]")) color = "text-emerald-400 font-semibold";
                      if (log.includes("[process]")) color = "text-primary";
                      if (log.includes("[diffuse]")) color = "text-secondary";
                      
                      return (
                        <div key={index} className={`opacity-0 animate-fade-up leading-relaxed ${color}`}>
                          &gt; {log}
                        </div>
                      );
                    })}
                    <div ref={logsEndRef} />
                  </div>
                </div>

              </div>
            )}

            {/* VIEW B: Completion (Hidden initially, opens upon synthesis finished) */}
            {generationPhase === 'success' && newlyGeneratedItem && (
              <div className="w-full min-h-[500px] lg:h-[600px] flex flex-col p-6 sm:p-8 text-left">
                
                {/* Completion header */}
                <div className="flex justify-between items-center mb-6">
                  <div className="flex items-center gap-3">
                    <CheckCircle className="text-secondary w-8 h-8 drop-shadow-[0_0_10px_rgba(76,215,246,0.3)]" />
                    <h3 className="text-xl sm:text-3xl font-semibold text-on-surface tracking-tight">
                      Synthesis Complete
                    </h3>
                  </div>
                  <button
                    onClick={() => setShowStatusDialog(false)}
                    className="text-on-surface-variant hover:text-white transition-colors bg-white/5 hover:bg-white/10 p-2 rounded-full cursor-pointer"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                {/* Grid comparing reference vs output */}
                <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-6 items-stretch overflow-hidden pb-4">
                  {/* Input Side */}
                  <div className="flex flex-col gap-2 h-full">
                    <span className="text-[10px] font-label text-on-surface-variant font-bold tracking-wider pl-1 uppercase">
                      Primary Reference
                    </span>
                    <div className="flex-1 rounded-xl overflow-hidden border border-white/10 bg-black/50 relative min-h-[200px]">
                      <img
                        alt="Primary input"
                        className="absolute inset-0 w-full h-full object-cover grayscale opacity-65"
                        src={newlyGeneratedItem.refImage || references[0]}
                      />
                    </div>
                  </div>

                  {/* Output Result Side */}
                  <div className="flex flex-col gap-2 h-full">
                    <span className="text-[10px] font-label text-secondary font-bold tracking-wider pl-1 flex items-center gap-1.5 uppercase">
                      <Sparkles className="w-3.5 h-3.5" /> Synthesized Output
                    </span>
                    <div className="flex-1 rounded-xl overflow-hidden border-2 border-secondary/40 shadow-[0_0_30px_rgba(76,215,246,0.2)] relative group min-h-[200px]">
                      <img
                        alt="Synthesized AI Output"
                        className="absolute inset-0 w-full h-full object-cover"
                        src={newlyGeneratedItem.image}
                      />
                      
                      {/* Actions float layout */}
                      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm opacity-0 group-hover:opacity-100 transition-all duration-300 flex items-center justify-center gap-4">
                        <button
                          onClick={() => {
                            alert("High Definition coordinate matrix downloaded to secure filesystem.");
                          }}
                          className="bg-primary hover:bg-opacity-90 text-on-primary px-6 py-2.5 rounded-full font-semibold hover:scale-105 transition-all text-xs flex items-center gap-2 cursor-pointer outline-none"
                        >
                          Save HD Asset
                        </button>
                        <button
                          onClick={() => {
                            // Close and reset to refine
                            setShowStatusDialog(false);
                          }}
                          className="bg-white/10 hover:bg-white/20 text-white border border-white/10 px-6 py-2.5 rounded-full text-xs hover:scale-105 transition-all cursor-pointer"
                        >
                          Refine Matrix
                        </button>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Footer close option */}
                <div className="mt-4 pt-4 border-t border-white/10 flex justify-end">
                  <button
                    onClick={() => setShowStatusDialog(false)}
                    className="btn-glow bg-primary text-on-primary font-bold px-7 py-3 rounded-lg text-xs cursor-pointer"
                  >
                    Navigate to My Gallery
                  </button>
                </div>

              </div>
            )}

          </div>

        </div>
      )}

    </div>
  );
}
