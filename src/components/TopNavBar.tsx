import { Coins, Bell, Settings } from 'lucide-react';
import { UserSession } from '../types';

interface TopNavBarProps {
  user: UserSession;
  onOpenStore: () => void;
  title: string;
}

export default function TopNavBar({ user, onOpenStore, title }: TopNavBarProps) {
  return (
    <header className="h-20 w-[calc(100%-16rem)] fixed right-0 top-0 z-40 bg-[#0b0f19]/60 backdrop-blur-xl border-b border-white/10 flex justify-between items-center px-8 transition-all duration-400">
      {/* Current view title */}
      <div>
        <h2 className="text-xl font-semibold text-on-surface font-sans capitalize tracking-tight">
          {title}
        </h2>
      </div>

      {/* Action panel */}
      <div className="flex items-center gap-6">
        {/* Coin Balance Hub */}
        <div
          onClick={onOpenStore}
          className="flex items-center gap-2 bg-white/5 border border-white/10 rounded-full px-4.5 py-1.5 backdrop-blur-md cursor-pointer hover:border-tertiary/40 hover:bg-white/10 transition-all duration-300 shadow-[0_0_15px_rgba(76,215,246,0.05)] active:scale-95 group"
          title="Buy More Coins"
        >
          <Coins className="w-4 h-4 text-tertiary group-hover:scale-110 transition-transform duration-300" />
          <span className="text-xs font-semibold font-label text-tertiary">
            {user.coins.toLocaleString()} Coins
          </span>
        </div>

        {/* Action icons */}
        <div className="flex items-center gap-1.5">
          <button className="text-on-surface-variant hover:text-primary hover:bg-white/5 rounded-full p-2 transition-all duration-300 cursor-pointer">
            <Bell className="w-5 h-5" />
          </button>
          <button className="text-on-surface-variant hover:text-primary hover:bg-white/5 rounded-full p-2 transition-all duration-300 cursor-pointer">
            <Settings className="w-5 h-5" />
          </button>
        </div>

        {/* Mini profile snapshot */}
        <img
          alt={user.name}
          className="w-9 h-9 rounded-full border border-white/10 object-cover"
          src={user.avatar}
        />
      </div>
    </header>
  );
}
