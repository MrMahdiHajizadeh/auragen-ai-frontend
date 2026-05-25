import { Sparkles, Images, CreditCard, LogOut } from 'lucide-react';
import { AppScreen, UserSession } from '../types';

interface SideNavBarProps {
  currentScreen: AppScreen;
  setScreen: (screen: AppScreen) => void;
  user: UserSession;
  onLogout: () => void;
}

export default function SideNavBar({ currentScreen, setScreen, user, onLogout }: SideNavBarProps) {
  return (
    <nav className="w-64 h-full fixed left-0 top-0 bg-[#0b0f19]/60 backdrop-blur-xl border-r border-white/10 shadow-[0_0_30px_rgba(99,102,241,0.15)] flex flex-col py-8 z-50 transition-all duration-400">
      {/* Branding Header */}
      <div className="px-6 mb-8">
        <div className="flex items-center gap-2 cursor-pointer" onClick={() => setScreen('creative-studio')}>
          <h1 className="text-3xl font-display font-bold tracking-tighter text-primary">
            AuraGen <span className="text-secondary">AI</span>
          </h1>
        </div>
        <p className="text-[10px] font-label text-on-surface-variant tracking-widest uppercase mt-1">
          Computational Elegance
        </p>

        {/* User profile capsule */}
        {user.loggedIn && (
          <div className="flex items-center gap-3 mt-8 p-3 rounded-xl bg-white/5 border border-white/10">
            <img
              alt={user.name}
              className="w-10 h-10 rounded-full border border-white/25 object-cover"
              src={user.avatar}
            />
            <div className="overflow-hidden">
              <p className="text-sm font-semibold text-on-surface truncate">{user.name}</p>
              <p className="text-[10px] font-label text-secondary uppercase tracking-wider">{user.planType}</p>
            </div>
          </div>
        )}
      </div>

      {/* Navigation List */}
      <div className="flex-1 flex flex-col gap-1 w-full mt-4">
        <button
          onClick={() => setScreen('creative-studio')}
          className={`w-full py-3.5 pl-6 flex items-center gap-3.5 text-left border-l-2 text-sm transition-all duration-300 relative group overflow-hidden ${
            currentScreen === 'creative-studio'
              ? 'border-primary text-primary font-semibold bg-primary/5'
              : 'border-transparent text-on-surface-variant hover:text-on-surface hover:bg-white/5'
          }`}
        >
          <div className="absolute inset-0 bg-gradient-to-r from-primary/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-400"></div>
          <Sparkles className={`w-5 h-5 ${currentScreen === 'creative-studio' ? 'fill-primary/20' : ''}`} />
          <span className="font-sans">Creative Studio</span>
        </button>

        <button
          onClick={() => setScreen('my-gallery')}
          className={`w-full py-3.5 pl-6 flex items-center gap-3.5 text-left border-l-2 text-sm transition-all duration-300 relative group overflow-hidden ${
            currentScreen === 'my-gallery'
              ? 'border-primary text-primary font-semibold bg-primary/5'
              : 'border-transparent text-on-surface-variant hover:text-on-surface hover:bg-white/5'
          }`}
        >
          <div className="absolute inset-0 bg-gradient-to-r from-primary/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-400"></div>
          <Images className={`w-5 h-5 ${currentScreen === 'my-gallery' ? 'fill-primary/20' : ''}`} />
          <span className="font-sans">My Gallery</span>
        </button>

        <button
          onClick={() => setScreen('coin-store')}
          className={`w-full py-3.5 pl-6 flex items-center gap-3.5 text-left border-l-2 text-sm transition-all duration-300 relative group overflow-hidden ${
            currentScreen === 'coin-store'
              ? 'border-primary text-primary font-semibold bg-primary/5'
              : 'border-transparent text-on-surface-variant hover:text-on-surface hover:bg-white/5'
          }`}
        >
          <div className="absolute inset-0 bg-gradient-to-r from-primary/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-400"></div>
          <CreditCard className={`w-5 h-5 ${currentScreen === 'coin-store' ? 'fill-primary/20' : ''}`} />
          <span className="font-sans">Coin Store</span>
        </button>
      </div>

      {/* Logout button if logged in */}
      {user.loggedIn && (
        <div className="px-4 mt-auto">
          <button
            onClick={onLogout}
            className="w-full py-2.5 px-4 rounded-lg border border-red-500/20 text-red-400 hover:text-red-300 hover:bg-red-500/10 hover:border-red-500/40 text-xs font-semibold flex items-center justify-center gap-2 transition-all duration-300 cursor-pointer"
          >
            <LogOut className="w-4 h-4" />
            Sign Out
          </button>
        </div>
      )}
    </nav>
  );
}
