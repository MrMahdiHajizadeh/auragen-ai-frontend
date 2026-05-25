import { useState, useEffect } from 'react';
import { AppScreen, UserSession, GeneratorModel, GalleryItem } from './types';
import { STARTER_COIN_AMOUNT } from './data';
import SideNavBar from './components/SideNavBar';
import TopNavBar from './components/TopNavBar';
import AuthView from './components/AuthView';
import CreativeStudioView from './components/CreativeStudioView';
import WorkspaceView from './components/WorkspaceView';
import MyGalleryView from './components/MyGalleryView';
import CoinStoreView from './components/CoinStoreView';
import { ChevronLeft } from 'lucide-react';
import { ApiService } from './services/api';

export default function App() {
  // Global user state variables
  const [user, setUser] = useState<UserSession>({
    name: 'Alex Vance',
    email: 'nexus@auragen.ai',
    coins: STARTER_COIN_AMOUNT,
    avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuD-X4wMRIIwmfE7F_A_RdNXhNvnMwieXf_4T1v4hhi7uGyqDD62dJp_qysZVixb3nAACsOeWo78tcqyZ_qh7ErhIDO4fXQrSJ0edjE2d_rqXLYTaGqTjm712ltFMyuNEgBLKHwU-a6S622dYT0ftiHC_trE4umOcJCKmsl05mgn97QpPgWJd5G43CKHMf7eDBXbFCi6lPvYf7Q9ULGUUjvTzwxFEzZD9e3Huxdpn3WYCh84wCiYfQTSBMOLJtuC2G4riKzL7WwSWSIn',
    isPremium: true,
    planType: 'VIP Member',
    loggedIn: false // Start with authentication portal active by default
  });

  const [currentScreen, setScreen] = useState<AppScreen>('creative-studio');
  const [selectedModel, setSelectedModel] = useState<GeneratorModel | null>(null);
  const [galleryItems, setGalleryItems] = useState<GalleryItem[]>([]);

  // Load session on startup
  useEffect(() => {
    const savedUser = localStorage.getItem('auragen_user');
    const savedCoins = localStorage.getItem('auragen_coins');
    if (savedUser) {
      const parsed = JSON.parse(savedUser);
      setUser(prev => ({
        ...prev,
        name: parsed.name,
        email: parsed.email,
        coins: savedCoins ? parseInt(savedCoins) : STARTER_COIN_AMOUNT,
        loggedIn: true
      }));
    }
  }, []);

  // Fetch Gallery upon Auth
  useEffect(() => {
    if (user.loggedIn) {
      ApiService.getGallery()
        .then(data => {
          setGalleryItems(data);
          localStorage.setItem('auragen_gallery', JSON.stringify(data));
        })
        .catch(console.error);
    }
  }, [user.loggedIn]);

  // Auth portal state handles
  const handleLoginSuccess = (email: string, name: string, token?: string) => {
    const sessionObj = { name, email, token: token || 'mock-token' };
    localStorage.setItem('auragen_user', JSON.stringify(sessionObj));
    localStorage.setItem('auragen_coins', user.coins.toString());
    setUser(prev => ({
      ...prev,
      name,
      email,
      loggedIn: true
    }));
    setScreen('creative-studio');
  };

  const handleLogout = () => {
    localStorage.removeItem('auragen_user');
    localStorage.removeItem('auragen_coins');
    setUser(prev => ({
      ...prev,
      loggedIn: false
    }));
    setSelectedModel(null);
  };

  // Model select transitions to Workspace
  const handleSelectModel = (model: GeneratorModel) => {
    setSelectedModel(model);
  };

  // Coins balance manipulation algorithms
  const deductCoins = (amount: number): boolean => {
    if (user.coins < amount) return false;
    const newCoins = user.coins - amount;
    setUser(prev => ({
      ...prev,
      coins: newCoins
    }));
    localStorage.setItem('auragen_coins', newCoins.toString());
    return true;
  };

  const awardCoins = (amount: number) => {
    const newCoins = user.coins + amount;
    setUser(prev => ({
      ...prev,
      coins: newCoins
    }));
    localStorage.setItem('auragen_coins', newCoins.toString());
  };

  // Gallery modifications
  const addGeneratedItem = (newItem: GalleryItem) => {
    setGalleryItems(prev => {
      const updated = [newItem, ...prev];
      localStorage.setItem('auragen_gallery', JSON.stringify(updated));
      return updated;
    });
  };

  const deleteGalleryItem = async (id: string) => {
    const ok = await ApiService.deleteGalleryItem(id);
    if (ok) {
      setGalleryItems(prev => {
        const updated = prev.filter(item => item.id !== id);
        localStorage.setItem('auragen_gallery', JSON.stringify(updated));
        return updated;
      });
    }
  };

  // Top header text coordinate
  const getScreenTitle = () => {
    if (selectedModel) return `Synthesis Workspace / ${selectedModel.name}`;
    switch (currentScreen) {
      case 'creative-studio': return 'Explore Synthesis Models';
      case 'my-gallery': return 'Aesthetic Personal Registry';
      case 'coin-store': return 'Aura Credits Pipelines';
      default: return 'AuraGen Portal';
    }
  };

  // Render Authentication screen if unauthenticated
  if (!user.loggedIn) {
    return <AuthView onLoginSuccess={handleLoginSuccess} />;
  }

  return (
    <div className="min-h-screen bg-[#05070C] text-[#e1e2ea] font-body relative overflow-hidden flex theme-cyberpunk">
      {/* Background radial glowing effects */}
      <div className="ambient-glow-tl"></div>
      <div className="ambient-glow-br"></div>

      {/* Vertical Sidebar Navigation */}
      <SideNavBar
        currentScreen={selectedModel ? 'creative-studio' : currentScreen}
        setScreen={(scr) => {
          setSelectedModel(null); // Clear selected workspace model upon sidebar clicks
          setScreen(scr);
        }}
        user={user}
        onLogout={handleLogout}
      />

      {/* Main Container */}
      <div className="flex-1 w-full pl-64 relative min-h-screen flex flex-col">
        {/* Global sticky header */}
        <TopNavBar
          user={user}
          onOpenStore={() => {
            setSelectedModel(null);
            setScreen('coin-store');
          }}
          title={getScreenTitle()}
        />

        {/* Dynamic scrollable fluid content wrapper */}
        <main className="flex-1 pt-20 px-8 pb-12 w-full max-w-7xl mx-auto flex flex-col">
          {selectedModel ? (
            /* Selected Model Workspace mode block */
            <div className="flex flex-col">
              {/* Reset model workspace coordinate back to model lists */}
              <div className="flex items-center mb-6">
                <button
                  onClick={() => setSelectedModel(null)}
                  className="flex items-center gap-1.5 text-xs text-on-surface-variant hover:text-white bg-white/5 border border-white/5 hover:border-white/15 px-3 py-1.5 rounded-lg transition-all duration-300 cursor-pointer"
                >
                  <ChevronLeft className="w-3.5 h-3.5 text-on-surface-variant" />
                  Back to Studio
                </button>
              </div>

              <WorkspaceView
                model={selectedModel}
                user={user}
                deductCoins={deductCoins}
                onGenerationComplete={addGeneratedItem}
                openStore={() => {
                  setSelectedModel(null);
                  setScreen('coin-store');
                }}
              />
            </div>
          ) : (
            /* General Navigation screens switcher view */
            <>
              {currentScreen === 'creative-studio' && (
                <CreativeStudioView onSelectModel={handleSelectModel} />
              )}

              {currentScreen === 'my-gallery' && (
                <MyGalleryView items={galleryItems} onDeleteItem={deleteGalleryItem} />
              )}

              {currentScreen === 'coin-store' && (
                <CoinStoreView onAddCoins={awardCoins} />
              )}
            </>
          )}
        </main>
      </div>
    </div>
  );
}
