
import React, { useState } from 'react';
import { Heart, ChevronRight, ShieldCheck, Star, Users, Check } from 'lucide-react';
import { UserProfile } from '../types';

interface OnboardingProps {
  onComplete: (profile: UserProfile) => void;
}

const DIET_OPTIONS = [
  'Sans gluten',
  'Sans produits laitiers',
  'Végétarien (Lacto-Ovo)',
  'Végétalien / Vegan',
  'Paléo',
  'Pescétarien'
];

const Onboarding: React.FC<OnboardingProps> = ({ onComplete }) => {
  const [step, setStep] = useState(1);
  const [pseudo, setPseudo] = useState('');
  const [selectedDiets, setSelectedDiets] = useState<string[]>(['Sans gluten']);

  const handleNext = () => {
    if (step < 3) {
      setStep(step + 1);
    } else {
      const profile: UserProfile = {
        id: Math.random().toString(36).substr(2, 9),
        pseudo: pseudo || 'Guerrière_Rose',
        status: 'diagnosed',
        visibility: 'city',
        household_size: 1,
        diet_tags: selectedDiets,
        excluded_ingredients: [],
        approxLocation: { lat: 48.8566, lng: 2.3522, city: 'Paris', department: '75' },
        // Trial fields
        subscriptionStatus: 'trial',
        trialStartDate: new Date().toISOString()
      };
      onComplete(profile);
    }
  };

  return (
    <div className="fixed inset-0 bg-[#fffafb] z-[100] flex flex-col items-center p-8 max-w-lg mx-auto overflow-y-auto">
      <div className="flex-1 flex flex-col items-center justify-center text-center space-y-8 w-full py-8">
        {step === 1 && (
          <div className="space-y-8 animate-in fade-in zoom-in duration-700">
            <div className="w-28 h-28 bg-rose-500 rounded-[35px] flex items-center justify-center text-white mx-auto shadow-2xl shadow-rose-200">
              <Heart size={56} fill="currentColor" />
            </div>
            <div className="space-y-3">
              <h1 className="text-3xl font-black text-slate-800 tracking-tight">Endo-sérénité</h1>
              <p className="text-slate-500 leading-relaxed font-medium">Commencez vos 30 jours d'essai gratuit dès maintenant.</p>
            </div>
            <div className="grid grid-cols-2 gap-4 text-left">
              <OnboardingCard icon={<Star className="text-rose-500" />} title="Premium" desc="IA Gemini incluse" />
              <OnboardingCard icon={<ShieldCheck className="text-rose-500" />} title="Essai" desc="30 jours gratuits" />
            </div>
          </div>
        )}

        {step === 2 && (
          <div className="space-y-8 w-full animate-in slide-in-from-right duration-300">
            <h2 className="text-2xl font-black text-slate-800">Qui êtes-vous ?</h2>
            <div className="space-y-2 text-left">
              <label className="text-[10px] font-black text-rose-400 uppercase tracking-widest ml-1">Pseudonyme</label>
              <input 
                type="text" 
                placeholder="Ex: Clara_Rose" 
                className="w-full p-5 bg-white border border-rose-50 rounded-[24px] focus:ring-4 focus:ring-rose-500/10 shadow-sm outline-none font-bold"
                value={pseudo}
                onChange={e => setPseudo(e.target.value)}
              />
            </div>
          </div>
        )}

        {step === 3 && (
          <div className="space-y-6 w-full animate-in slide-in-from-right duration-300">
            <h2 className="text-2xl font-black text-slate-800">Mon assiette</h2>
            <div className="space-y-2 max-h-[45vh] overflow-y-auto pr-2">
               {DIET_OPTIONS.map(diet => (
                 <button 
                  key={diet}
                  onClick={() => setSelectedDiets(prev => prev.includes(diet) ? prev.filter(d => d !== diet) : [...prev, diet])}
                  className={`w-full p-4 rounded-2xl border transition-all flex items-center justify-between ${selectedDiets.includes(diet) ? 'bg-rose-50 border-rose-200 text-rose-700' : 'bg-white border-rose-50 text-slate-600'}`}
                 >
                   <span className="text-sm font-bold">{diet}</span>
                   {selectedDiets.includes(diet) && <Check size={16} className="text-rose-500" />}
                 </button>
               ))}
            </div>
          </div>
        )}
      </div>

      <div className="w-full space-y-6 pb-8">
        <button 
          onClick={handleNext}
          className="w-full bg-rose-500 text-white py-5 rounded-[24px] font-bold text-lg flex items-center justify-center gap-2 shadow-xl shadow-rose-200"
        >
          {step === 3 ? "Lancer l'essai gratuit" : "Suivant"} <ChevronRight size={20} />
        </button>
        <div className="flex justify-center gap-2">
          {[1, 2, 3].map(s => (
            <div key={s} className={`h-1.5 rounded-full transition-all ${step === s ? 'w-8 bg-rose-500' : 'w-2 bg-rose-200'}`} />
          ))}
        </div>
      </div>
    </div>
  );
};

const OnboardingCard: React.FC<{ icon: React.ReactNode, title: string, desc: string }> = ({ icon, title, desc }) => (
  <div className="bg-white border border-rose-50 p-5 rounded-[24px] shadow-sm space-y-2">
    <div className="w-10 h-10 bg-rose-50 rounded-xl flex items-center justify-center">{icon}</div>
    <h3 className="text-xs font-bold text-slate-800">{title}</h3>
    <p className="text-[10px] text-slate-400 font-medium leading-tight">{desc}</p>
  </div>
);

export default Onboarding;
