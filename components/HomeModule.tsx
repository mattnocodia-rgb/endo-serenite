
import React from 'react';
import { 
  Sparkles, 
  Utensils, 
  MessageSquare, 
  Map as MapIcon, 
  ChevronRight, 
  Heart,
  Quote,
  Clock
} from 'lucide-react';
import { TabType, UserProfile } from '../types';

interface HomeModuleProps {
  profile: UserProfile | null;
  onNavigate: (tab: TabType) => void;
}

const HomeModule: React.FC<HomeModuleProps> = ({ profile, onNavigate }) => {
  const today = new Date().toLocaleDateString('fr-FR', { weekday: 'long', day: 'numeric', month: 'long' });
  
  const getRemainingDays = () => {
    if (!profile?.trialStartDate) return 0;
    const start = new Date(profile.trialStartDate);
    const now = new Date();
    const diff = Math.floor((now.getTime() - start.getTime()) / (1000 * 3600 * 24));
    return Math.max(0, 30 - diff);
  };

  const remainingDays = getRemainingDays();

  return (
    <div className="p-4 space-y-8 animate-in fade-in duration-700">
      <div className="pt-2 flex justify-between items-start">
        <div>
          <p className="text-xs font-bold text-rose-500 uppercase tracking-[0.2em] mb-1">{today}</p>
          <h2 className="text-3xl font-black text-slate-800">Bonjour, {profile?.pseudo || 'Guerrière'}</h2>
        </div>
        
        {profile?.subscriptionStatus === 'trial' && (
          <div className="bg-rose-50 px-3 py-2 rounded-2xl flex flex-col items-center border border-rose-100 shadow-sm">
            <Clock size={14} className="text-rose-400 mb-1" />
            <span className="text-[10px] font-black text-rose-500 uppercase">Essai</span>
            <span className="text-xs font-bold text-slate-700">J-{remainingDays}</span>
          </div>
        )}
      </div>

      <div className="bg-gradient-to-br from-rose-500 to-rose-600 rounded-[40px] p-7 text-white shadow-xl shadow-rose-100 relative overflow-hidden">
        <Quote className="absolute -right-2 -top-2 opacity-10 w-24 h-24" />
        <div className="relative z-10 space-y-3">
          <div className="flex items-center gap-2">
            <Sparkles size={16} className="text-rose-200" />
            <span className="text-[10px] font-black uppercase tracking-widest text-rose-100">Pensée de soutien</span>
          </div>
          <p className="text-base font-medium leading-relaxed italic">
            "Chaque petit pas vers une alimentation plus saine est une victoire pour votre corps."
          </p>
        </div>
      </div>

      <div className="space-y-4">
        <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] ml-2">Mon compagnon quotidien</h3>
        
        <div className="grid grid-cols-1 gap-4">
          <button 
            onClick={() => onNavigate('nutrition')}
            className="group relative w-full bg-white p-6 rounded-[32px] border border-rose-50 shadow-sm hover:shadow-md transition-all text-left flex items-center justify-between"
          >
            <div className="flex items-center gap-5">
              <div className="w-14 h-14 bg-rose-50 text-rose-500 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform">
                <Utensils size={28} />
              </div>
              <div>
                <h4 className="text-base font-bold text-slate-800">Cuisine Bienveillante</h4>
                <p className="text-xs text-slate-400">Générer mon menu anti-inflammatoire</p>
              </div>
            </div>
            <ChevronRight size={20} className="text-rose-200 group-hover:text-rose-500 group-hover:translate-x-1 transition-all" />
          </button>

          <div className="grid grid-cols-2 gap-4">
            <button onClick={() => onNavigate('forum')} className="group bg-white p-5 rounded-[32px] border border-rose-50 shadow-sm hover:shadow-md transition-all text-left space-y-4">
              <div className="w-10 h-10 bg-rose-50 text-rose-600 rounded-xl flex items-center justify-center"><MessageSquare size={20} /></div>
              <h4 className="text-sm font-bold text-slate-800">Le Salon</h4>
            </button>
            <button onClick={() => onNavigate('map')} className="group bg-white p-5 rounded-[32px] border border-rose-50 shadow-sm hover:shadow-md transition-all text-left space-y-4">
              <div className="w-10 h-10 bg-rose-50 text-rose-600 rounded-xl flex items-center justify-center"><MapIcon size={20} /></div>
              <h4 className="text-sm font-bold text-slate-800">La Carte</h4>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomeModule;
