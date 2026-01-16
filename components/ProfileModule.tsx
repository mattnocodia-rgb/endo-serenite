
import React, { useState } from 'react';
import { 
  Settings, LogOut, ChevronRight, User, Heart, 
  CreditCard, Crown, Check, Loader2, ExternalLink,
  Users, Minus, Plus, Eye, EyeOff, ChevronDown, ChevronUp
} from 'lucide-react';
import { UserProfile } from '../types';

interface ProfileModuleProps {
  profile: UserProfile | null;
  onUpdate: (profile: UserProfile) => void;
}

const DIET_OPTIONS = [
  { id: 'gluten-free', label: 'Sans gluten', color: 'bg-rose-100 text-rose-500' },
  { id: 'dairy-free', label: 'Sans produits laitiers', color: 'bg-rose-100 text-rose-500' },
  { id: 'lacto-ovo-vegetarian', label: 'Végétarien (Lacto-Ovo)', color: 'bg-emerald-100 text-emerald-500' },
  { id: 'vegan', label: 'Végétalien / Vegan', color: 'bg-emerald-100 text-emerald-500' },
  { id: 'paleo', label: 'Paléo', color: 'bg-amber-100 text-amber-500' },
  { id: 'pescatarian', label: 'Pescétarien', color: 'bg-rose-100 text-rose-500' },
  { id: 'keto', label: 'Cétogène (Keto)', color: 'bg-rose-100 text-rose-500' },
];

const ProfileModule: React.FC<ProfileModuleProps> = ({ profile, onUpdate }) => {
  const [isProcessingStripe, setIsProcessingStripe] = useState(false);
  const [isDietListOpen, setIsDietListOpen] = useState(false);

  if (!profile) return null;

  const simulateStripePayment = () => {
    setIsProcessingStripe(true);
    // Simulation d'une redirection vers Stripe Checkout
    setTimeout(() => {
      onUpdate({
        ...profile,
        subscriptionStatus: 'active'
      });
      setIsProcessingStripe(false);
    }, 2000);
  };

  const toggleVisibility = () => {
    const newVisibility = profile.visibility === 'city' ? 'off' : 'city';
    onUpdate({ ...profile, visibility: newVisibility });
  };

  const updateHouseholdSize = (delta: number) => {
    const newVal = Math.min(6, Math.max(1, profile.household_size + delta));
    onUpdate({ ...profile, household_size: newVal });
  };

  const toggleDiet = (dietLabel: string) => {
    const currentDiets = profile.diet_tags || [];
    const newDiets = currentDiets.includes(dietLabel) 
      ? currentDiets.filter(d => d !== dietLabel) 
      : [...currentDiets, dietLabel];
    onUpdate({ ...profile, diet_tags: newDiets });
  };

  return (
    <div className="p-4 space-y-6 animate-in fade-in duration-500 pb-20">
      {/* Identity Card */}
      <div className="bg-white rounded-[40px] p-10 text-center shadow-sm border border-rose-50">
        <div className="w-24 h-24 bg-rose-50 rounded-full border-4 border-white shadow-xl flex items-center justify-center text-rose-500 mx-auto relative mb-4">
          <User size={48} />
          {profile.subscriptionStatus === 'active' && (
            <div className="absolute -top-1 -right-1 w-8 h-8 bg-amber-400 rounded-full flex items-center justify-center shadow-md border-2 border-white text-white">
              <Crown size={14} />
            </div>
          )}
        </div>
        <h2 className="text-2xl font-black text-slate-800 tracking-tight">{profile.pseudo}</h2>
        <div className="mt-3 flex justify-center">
          <span className="text-[10px] font-black uppercase tracking-widest text-rose-600 bg-rose-50 px-4 py-1.5 rounded-full border border-rose-100/50">
            {profile.status === 'diagnosed' ? 'Guerrière Diagnostiquée' : 'En parcours / suspicion'}
          </span>
        </div>
      </div>

      {/* Subscription Section */}
      <div className="space-y-3">
        <SectionTitle title="Mon Abonnement" />
        <div className="bg-white rounded-[32px] border border-rose-50 overflow-hidden shadow-sm p-6">
          {profile.subscriptionStatus === 'active' ? (
            <div className="space-y-4">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-amber-50 text-amber-500 rounded-2xl flex items-center justify-center">
                  <Crown size={24} />
                </div>
                <div>
                  <p className="text-sm font-bold text-slate-800">Premium Illimité</p>
                  <p className="text-[10px] text-emerald-500 font-bold uppercase tracking-wider">Actif • 9,99€ / mois</p>
                </div>
              </div>
              <button className="w-full flex items-center justify-between p-4 bg-slate-50 rounded-2xl text-slate-500 hover:bg-slate-100 transition-colors">
                <span className="text-xs font-bold flex items-center gap-2"><ExternalLink size={14} /> Gérer sur Stripe</span>
                <ChevronRight size={14} />
              </button>
            </div>
          ) : (
            <div className="space-y-5">
              <div className="space-y-1">
                <p className="text-sm font-bold text-slate-800">Passez au Premium</p>
                <p className="text-xs text-slate-400 leading-relaxed">Génération de menus par IA illimitée et accès aux conseils experts.</p>
              </div>
              
              <button 
                onClick={simulateStripePayment}
                disabled={isProcessingStripe}
                className="w-full bg-rose-500 text-white py-4 rounded-2xl font-bold flex items-center justify-center gap-2 shadow-lg shadow-rose-100 disabled:opacity-50 transition-all active:scale-[0.98]"
              >
                {isProcessingStripe ? (
                  <Loader2 size={18} className="animate-spin" />
                ) : (
                  <>
                    <CreditCard size={18} /> S'abonner via Stripe
                  </>
                )}
              </button>
              <p className="text-[9px] text-center text-slate-300">Sécurisé par Stripe • Sans engagement</p>
            </div>
          )}
        </div>
      </div>

      {/* Nutrition & Family Settings */}
      <div className="space-y-3">
        <SectionTitle title="Nutrition & Famille" />
        <div className="bg-white rounded-[32px] border border-rose-50 overflow-hidden shadow-sm p-6 space-y-6">
          
          {/* Household Size */}
          <div className="flex items-center justify-between pb-6 border-b border-rose-50/50">
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 bg-rose-50 rounded-2xl flex items-center justify-center text-rose-500">
                <Users size={18} />
              </div>
              <span className="text-sm font-bold text-slate-700">Taille du foyer</span>
            </div>
            <div className="flex items-center gap-3 bg-rose-50/30 p-1 rounded-xl">
              <button onClick={() => updateHouseholdSize(-1)} className="w-8 h-8 rounded-lg bg-white shadow-sm flex items-center justify-center text-rose-500 active:scale-90 transition-all"><Minus size={14} /></button>
              <span className="text-sm font-black text-slate-800 w-4 text-center">{profile.household_size}</span>
              <button onClick={() => updateHouseholdSize(1)} className="w-8 h-8 rounded-lg bg-white shadow-sm flex items-center justify-center text-rose-500 active:scale-90 transition-all"><Plus size={14} /></button>
            </div>
          </div>

          {/* Diets Selection */}
          <div className="space-y-4">
            <button 
              onClick={() => setIsDietListOpen(!isDietListOpen)}
              className="w-full flex items-center justify-between group"
            >
              <div className="flex items-center gap-4">
                <div className={`w-10 h-10 rounded-2xl flex items-center justify-center transition-colors ${profile.diet_tags.length > 0 ? 'bg-rose-500 text-white' : 'bg-rose-50 text-rose-300'}`}>
                  <Heart size={18} />
                </div>
                <div className="flex flex-col text-left">
                  <span className="text-sm font-bold text-slate-700">Mes régimes</span>
                  <span className="text-[10px] text-slate-400 font-medium">
                    {profile.diet_tags.length > 0 ? `${profile.diet_tags.length} actif(s)` : 'Aucun réglage'}
                  </span>
                </div>
              </div>
              <div className="w-8 h-8 rounded-full bg-slate-50 flex items-center justify-center text-slate-300">
                {isDietListOpen ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
              </div>
            </button>

            {isDietListOpen && (
              <div className="space-y-1.5 pt-2 animate-in slide-in-from-top duration-200">
                {DIET_OPTIONS.map(diet => {
                  const isActive = profile.diet_tags?.includes(diet.label);
                  return (
                    <button
                      key={diet.id}
                      onClick={() => toggleDiet(diet.label)}
                      className={`w-full flex items-center gap-4 p-3 rounded-2xl transition-all ${isActive ? 'bg-rose-50 border border-rose-100/50' : 'bg-white border border-transparent hover:bg-slate-50'}`}
                    >
                      <div className={`w-5 h-5 rounded-full flex items-center justify-center border-2 ${isActive ? 'bg-rose-500 border-rose-500 text-white shadow-sm shadow-rose-200' : 'border-slate-200'}`}>
                        {isActive && <Check size={10} />}
                      </div>
                      <span className={`text-xs font-bold ${isActive ? 'text-rose-700' : 'text-slate-500'}`}>{diet.label}</span>
                    </button>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Privacy Section */}
      <div className="space-y-3">
        <SectionTitle title="Confidentialité" />
        <div className="bg-white rounded-[32px] border border-rose-50 overflow-hidden shadow-sm">
          <button onClick={toggleVisibility} className="w-full text-left">
            <ProfileItem 
              icon={profile.visibility === 'city' ? <Eye size={18} className="text-rose-500" /> : <EyeOff size={18} className="text-slate-400" />} 
              label="Visibilité carte locale" 
              value={profile.visibility === 'city' ? 'Rayon Ville' : 'Invisible'} 
            />
          </button>
        </div>
      </div>

      {/* Actions */}
      <div className="pt-8 space-y-4">
        <button className="w-full bg-white border border-rose-100 text-rose-500 py-4 rounded-[24px] font-bold flex items-center justify-center gap-2 hover:bg-rose-50 transition-colors">
          <LogOut size={18} /> Déconnexion
        </button>
      </div>
    </div>
  );
};

const SectionTitle: React.FC<{ title: string }> = ({ title }) => (
  <h3 className="text-[10px] font-black text-rose-300 uppercase tracking-[0.25em] ml-6 mb-2">{title}</h3>
);

const ProfileItem: React.FC<{ icon: React.ReactNode, label: string, value: string }> = ({ icon, label, value }) => (
  <div className="flex items-center justify-between p-5 hover:bg-rose-50/20 transition-colors border-b last:border-b-0 border-rose-50/30">
    <div className="flex items-center gap-4">
      <div className="w-10 h-10 bg-rose-50/50 rounded-2xl flex items-center justify-center shrink-0">{icon}</div>
      <span className="text-sm font-bold text-slate-700">{label}</span>
    </div>
    <div className="flex items-center gap-2">
      <span className="text-[10px] font-black text-rose-400 bg-rose-50 px-3 py-1.5 rounded-full">{value}</span>
      <ChevronRight size={14} className="text-rose-200" />
    </div>
  </div>
);

export default ProfileModule;
