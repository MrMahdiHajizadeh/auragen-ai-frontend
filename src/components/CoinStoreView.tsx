import React, { useState, useEffect } from 'react';
import { Coins, Check, Zap, ArrowRight, ShieldCheck, X, CreditCard, RefreshCw } from 'lucide-react';
import { CoinBundle } from '../types';
import { ApiService } from '../services/api';

interface CoinStoreViewProps {
  onAddCoins: (amount: number) => void;
}

export default function CoinStoreView({ onAddCoins }: CoinStoreViewProps) {
  const [bundles, setBundles] = useState<CoinBundle[]>([]);
  const [selectedBundle, setSelectedBundle] = useState<CoinBundle | null>(null);
  const [cardNumber, setCardNumber] = useState('6104 3377 8492 0154');
  const [cardCVV, setCardCVV] = useState('482');
  const [pin, setPin] = useState('••••');
  const [processing, setProcessing] = useState(false);
  const [success, setSuccess] = useState(false);
  const [errorText, setErrorText] = useState('');

  // Fetch dynamic plans on mount
  useEffect(() => {
    ApiService.getPlans().then(data => setBundles(data));
  }, []);

  const handleOpenCheckout = (bundle: CoinBundle) => {
    setSelectedBundle(bundle);
    setSuccess(false);
    setProcessing(false);
    setErrorText('');
  };

  const handleExecutePayment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedBundle) return;
    
    setProcessing(true);
    setErrorText('');
    
    try {
      const mockPurchaseToken = `bazaar-token-${Date.now()}`;
      const res = await ApiService.verifyPlanPurchase(
        selectedBundle.id,
        selectedBundle.bazaar_product_id || 'tokens_500',
        mockPurchaseToken
      );

      if (res.success) {
        setProcessing(false);
        setSuccess(true);
        onAddCoins(selectedBundle.coins);
        
        setTimeout(() => {
          setSelectedBundle(null);
          setSuccess(false);
        }, 1500);
      } else {
        throw new Error(res.message || 'Purchase validation failed.');
      }
    } catch (err: any) {
      setProcessing(false);
      setErrorText(err.message || 'Payment coordinate validation failed.');
    }
  };

  return (
    <div className="w-full relative py-6 animate-fade-up">
      {/* Informative Header grid */}
      <div className="text-center max-w-xl mx-auto mb-12">
        <div className="w-12 h-12 rounded-full bg-tertiary/10 flex items-center justify-center text-tertiary mx-auto mb-4 border border-tertiary/25">
          <Coins className="w-6 h-6" />
        </div>
        <h3 className="text-2xl sm:text-3xl font-display font-semibold text-on-surface tracking-tight">
          Aura Credits Pipeline
        </h3>
        <p className="text-sm text-on-surface-variant font-sans mt-2 leading-relaxed">
          Sustain generation matrices by acquiring additional high-fidelity coin slots.
        </p>
      </div>

      {/* Grid of Bundle tiers */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-stretch max-w-5xl mx-auto px-4">
        {bundles.map((bundle) => {
          const isGold = bundle.coins === 2500;

          return (
            <div
              key={bundle.id}
              onClick={() => handleOpenCheckout(bundle)}
              className={`glass-card flex flex-col justify-between p-6 sm:p-8 relative cursor-pointer relative transition-all group shrink-0 ${
                isGold ? 'vip-card border-primary/30' : 'border-white/10'
              }`}
            >
              {/* Feature popular gold aura bubble */}
              {isGold && (
                <div className="absolute top-0 right-1/2 translate-x-1/2 -translate-y-1/2 bg-gradient-to-r from-primary to-secondary text-on-[#0d0096] text-[9px] font-label font-bold px-3 py-1 rounded-full uppercase tracking-widest shadow-[0_0_15px_rgba(192,193,255,1)]">
                  Most Popular
                </div>
              )}

              {/* Tier specs */}
              <div className="text-left space-y-6">
                <div>
                  <h4 className="text-lg font-bold text-on-surface-variant/80 uppercase tracking-wider font-code leading-none mb-1">
                    {bundle.name}
                  </h4>
                  <div className="flex items-baseline gap-1 mt-3">
                    <Coins className="w-5 h-5 text-tertiary self-center" />
                    <span className="text-3xl sm:text-4xl font-display font-bold text-on-surface tracking-tighter">
                      {bundle.coins.toLocaleString()}
                    </span>
                    <span className="text-[10px] font-code text-on-surface-variant ml-1 uppercase">
                      Coins
                    </span>
                  </div>
                </div>

                {/* Features list bullet points */}
                <ul className="space-y-3 pt-4 border-t border-white/5">
                  {bundle.features.map((feat, index) => (
                    <li key={index} className="text-xs text-on-surface-variant flex items-start gap-2.5 leading-tight">
                      <Check className="w-4 h-4 text-secondary shrink-0 mt-0.5" />
                      <span>{feat}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Purchase Trigger Area */}
              <div className="mt-8 pt-4">
                <span className="text-xs font-code text-[#ffb95f] block text-center mb-4">
                  {bundle.priceIri}
                </span>

                <button
                  type="button"
                  className={`w-full py-3 rounded-xl font-bold text-xs tracking-wide uppercase transition-all flex items-center justify-center gap-2 cursor-pointer ${
                    isGold
                      ? 'bg-primary text-on-primary shadow-[0_4px_20px_rgba(73,75,214,0.35)] group-hover:shadow-[0_4px_25px_rgba(73,75,214,0.55)]'
                      : 'bg-white/5 border border-white/15 text-white hover:bg-white/10'
                  }`}
                >
                  Acquire Tier
                  <ArrowRight className="w-4 h-4 opacity-80" />
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* ==================== SECURE SHEPARD PAYMENT CHECKOUT BOTTOM DRAWER / OVERLAY ==================== */}
      {selectedBundle && (
        <div className="fixed inset-0 z-[100] flex items-end sm:items-center justify-center p-4">
          
          {/* Backdrop blur veil */}
          <div
            className="absolute inset-0 bg-[#05070C]/85 backdrop-blur-2xl transition-opacity animate-fade-in"
            onClick={() => {
              if (!processing) setSelectedBundle(null);
            }}
          ></div>

          {/* Secure card drawer */}
          <div className="relative glass-floating w-full max-w-md rounded-t-2xl sm:rounded-2xl border border-white/10 overflow-hidden shadow-[0_0_50px_rgba(255,185,95,0.12)] z-10 animate-fade-up">
            
            {/* Header branding */}
            <div className="p-6 border-b border-white/10 flex justify-between items-center bg-[#0b0f19]/40 text-left">
              <div className="flex items-center gap-2.5">
                <CreditCard className="w-5 h-5 text-tertiary" />
                <span className="text-sm font-semibold text-on-surface font-sans">
                  Secure Shetab Portal
                </span>
              </div>
              
              {!processing && (
                <button
                  onClick={() => setSelectedBundle(null)}
                  className="text-on-surface-variant hover:text-white transition-colors bg-white/5 hover:bg-white/10 p-1.5 rounded-full cursor-pointer"
                >
                  <X className="w-4.5 h-4.5" />
                </button>
              )}
            </div>

            {/* A: Success payment banner overlay */}
            {success ? (
              <div className="p-8 text-center flex flex-col items-center justify-center gap-4 h-64">
                <div className="w-14 h-14 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 flex items-center justify-center animate-bounce">
                  <Check className="w-8 h-8" />
                </div>
                <h4 className="text-xl font-bold text-on-surface">Payment Verified</h4>
                <p className="text-xs font-code text-on-surface-variant">
                  +{selectedBundle.coins.toLocaleString()} credits added to your matrix profile.
                </p>
              </div>
            ) : (
              /* B: Active payment form inputs */
              <form onSubmit={handleExecutePayment} className="p-6 space-y-4 text-left">
                {/* Bundle summary tag */}
                <div className="bg-white/3 border border-white/5 rounded-xl p-4 flex justify-between items-center">
                  <div className="text-left">
                    <span className="text-[10px] font-code text-on-surface-variant uppercase">
                      Bundle Purchase
                    </span>
                    <span className="text-base font-bold text-on-surface block mt-0.5">
                      {selectedBundle.name} ({selectedBundle.coins} Coins)
                    </span>
                  </div>
                  <span className="text-sm font-code text-tertiary font-bold">
                    {selectedBundle.priceIri}
                  </span>
                </div>

                {/* Simulated banking inputs */}
                <div className="space-y-3.5 pt-2">
                  <div className="flex flex-col gap-1.5">
                    <label className="text-[9px] font-label font-bold text-on-surface-variant uppercase tracking-wider">
                      Shetab Card Number (Simulated)
                    </label>
                    <input
                      className="input-glass w-full rounded-lg py-2.5 px-3.5 text-xs text-on-surface font-code tracking-wider focus:outline-none"
                      type="text"
                      value={cardNumber}
                      onChange={(e) => setCardNumber(e.target.value)}
                      placeholder="6104 3377 8492 0154"
                      required
                      disabled={processing}
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="flex flex-col gap-1.5">
                      <label className="text-[9px] font-label font-bold text-on-surface-variant uppercase tracking-wider">
                        CVV2 Code
                      </label>
                      <input
                        className="input-glass w-full rounded-lg py-2.5 px-3.5 text-xs text-on-surface font-code tracking-widest focus:outline-none text-center"
                        type="password"
                        value={cardCVV}
                        maxLength={4}
                        onChange={(e) => setCardCVV(e.target.value)}
                        placeholder="482"
                        required
                        disabled={processing}
                      />
                    </div>

                    <div className="flex flex-col gap-1.5">
                      <label className="text-[9px] font-label font-bold text-on-surface-variant uppercase tracking-wider">
                        Internet pin (Pin2)
                      </label>
                      <input
                        className="input-glass w-full rounded-lg py-2.5 px-3.5 text-xs text-on-surface font-code tracking-widest focus:outline-none text-center"
                        type="password"
                        value={pin}
                        maxLength={5}
                        onChange={(e) => setPin(e.target.value)}
                        placeholder="••••"
                        required
                        disabled={processing}
                      />
                    </div>
                  </div>
                </div>

                {errorText && (
                  <p className="text-xs text-[#ffb4ab] font-code py-1 bg-red-500/10 px-3 rounded-lg border border-red-500/10 text-center">
                    {errorText}
                  </p>
                )}

                {/* Security pledge */}
                <p className="text-[10px] text-on-surface-variant/70 font-code text-center py-2 border-b border-t border-white/5 flex items-center justify-center gap-1 leading-none select-none">
                  Secure Shaparak coordination layer active <ShieldCheck className="w-3.5 h-3.5 text-teal-400" />
                </p>

                {/* Proceed button */}
                <button
                  type="submit"
                  disabled={processing}
                  className="btn-glow w-full py-3.5 rounded-xl bg-primary text-on-primary font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 cursor-pointer shadow-[0_4px_15px_rgba(73,75,214,0.3)] disabled:opacity-50"
                >
                  {processing ? (
                    <>
                      <RefreshCw className="w-4 h-4 animate-spin text-white" />
                      Decrypting transaction matrix...
                    </>
                  ) : (
                    <>
                      Verify & Pay Rial
                      <ArrowRight className="w-4 h-4 text-white" />
                    </>
                  )}
                </button>
              </form>
            )}

          </div>

        </div>
      )}

    </div>
  );
}
