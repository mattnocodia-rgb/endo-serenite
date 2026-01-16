
import React, { useState, useEffect } from 'react';
import { 
  Utensils, Loader2, Minus, Plus, Sparkles, Filter, 
  Check, ChevronDown, Lock, Crown, Users, ChevronUp
} from 'lucide-react';
import { UserProfile } from '../types';
import { generateMeals, MealDistribution } from '../geminiService';

interface NutritionModuleProps {
  profile: UserProfile | null;
  onUpdateProfile: (profile: UserProfile) => void;
  onUpgrade: () => void;
}

const DIET_OPTIONS = [
  'Sans gluten',
  'Sans produits laitiers',
  'Végétarien',
  'Vegan',
  'Paléo',
  'Cétogène'
];

const NutritionModule: React.FC<NutritionModuleProps> = ({ profile, onUpgrade }) => {
  const [distribution, setDistribution] = useState<MealDistribution>({ green: 3, orange: 2, red: 1 });
  const [generatedMealsList, setGeneratedMealsList] = useState<any[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  
  // Local overrides for this specific generation
  const [localHouseholdSize, setLocalHouseholdSize] = useState(profile?.household_size || 1);
  const [localDiets, setLocalDiets] = useState<string[]>(profile?.diet_tags || []);

  useEffect(() => {
    if (profile) {
      setLocalHouseholdSize(profile.household_size);
      setLocalDiets(profile.diet_tags);
    }
  }, [profile]);

  const isExpired = profile?.subscriptionStatus === 'expired';

  const handleGenerate = async () => {
    if (isExpired) return;
    setIsGenerating(true);
    const meals = await generateMeals(
      distribution, 
      localDiets, 
      profile?.excluded_ingredients || [], 
      localHouseholdSize
    );
    if (meals && meals.length > 0) {
      setGeneratedMealsList(meals);
    }
    setIsGenerating(false);
  };

  const updateDist = (key: keyof MealDistribution, delta: number) => {
    setDistribution(prev => ({ ...prev, [key]: Math.max(0, prev[key] + delta) }));
  };

  const toggleLocalDiet = (diet: string) => {
    setLocalDiets(prev => 
      prev.includes(diet) ? prev.filter(d => d !== diet) : [...prev, diet]
    );
  };

  return (
    <div className="p-4 space-y-6 animate-in fade-in duration-500 pb-20">
      {/* Header */}
      <div className="bg-rose-500 rounded-[40px] p-8 text-white shadow-lg relative overflow-hidden">
        <h2 className="text-xl font-bold mb-1">Cuisine Bienveillante</h2>
        <p className="text-rose-100 text-xs opacity-80 leading-relaxed">Générateur intelligent de menus anti-inflammatoires.</p>
        <Utensils className="absolute -right-4 -bottom-4 opacity-10" size={120} />
      </div>

      <div className="bg-white p-6 rounded-[40px] border border-rose-50 shadow-sm space-y-6 relative overflow-hidden">
        {isExpired && (
          <div className="absolute inset-0 bg-white/60 backdrop-blur-[2px] z-20 flex flex-col items-center justify-center p-6 text-center animate-in fade-in">
            <div className="w-16 h-16 bg-rose-500 text-white rounded-2xl flex items-center justify-center mb-4 shadow-xl shadow-rose-200">
              <Crown size={32} />
            </div>
            <h3 className="text-lg font-black text-slate-800 mb-2">Période d'essai terminée</h3>
            <p className="text-xs text-slate-500 mb-6 leading-relaxed">Passez au Premium pour continuer à générer des menus personnalisés par IA.</p>
            <button 
              onClick={onUpgrade}
              className="bg-rose-500 text-white px-8 py-4 rounded-2xl font-bold shadow-lg shadow-rose-100 active:scale-95 transition-transform"
            >
              Découvrir les offres
            </button>
          </div>
        )}

        {/* Local Settings Toggle */}
        <button 
          onClick={() => setShowSettings(!showSettings)}
          className="w-full flex items-center justify-between p-4 bg-rose-50/50 rounded-2xl text-rose-600 border border-rose-100/50"
        >
          <div className="flex items-center gap-2">
            <Filter size={18} />
            <span className="text-xs font-bold uppercase tracking-wider">Ajuster pour ce menu</span>
          </div>
          {showSettings ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
        </button>

        {showSettings && (
          <div className="space-y-6 pt-2 animate-in slide-in-from-top duration-300">
            {/* Household Size Selection */}
            <div className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl">
              <div className="flex items-center gap-3">
                <Users size={18} className="text-slate-400" />
                <span className="text-xs font-bold text-slate-700">Nombre de convives</span>
              </div>
              <div className="flex items-center gap-3 bg-white p-1 rounded-xl shadow-sm border border-slate-100">
                <button onClick={() => setLocalHouseholdSize(Math.max(1, localHouseholdSize - 1))} className="w-8 h-8 rounded-lg flex items-center justify-center text-rose-500 active:scale-90"><Minus size={14} /></button>
                <span className="text-sm font-black text-slate-800 w-4 text-center">{localHouseholdSize}</span>
                <button onClick={() => setLocalHouseholdSize(localHouseholdSize + 1)} className="w-8 h-8 rounded-lg flex items-center justify-center text-rose-500 active:scale-90"><Plus size={14} /></button>
              </div>
            </div>

            {/* Local Diets Selection */}
            <div className="space-y-3">
              <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Régimes appliqués</span>
              <div className="flex flex-wrap gap-2">
                {DIET_OPTIONS.map(diet => (
                  <button
                    key={diet}
                    onClick={() => toggleLocalDiet(diet)}
                    className={`px-3 py-2 rounded-xl text-[10px] font-bold transition-all border ${
                      localDiets.includes(diet) 
                        ? 'bg-rose-500 border-rose-500 text-white shadow-md' 
                        : 'bg-white border-slate-100 text-slate-500 hover:border-rose-200'
                    }`}
                  >
                    {diet}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        <div className="h-px bg-rose-50/50 w-full" />

        {/* Distribution Section */}
        <div className="space-y-6">
          <DistributionRow color="green" label="Anti-inflammatoires ++" count={distribution.green} onUpdate={(d) => updateDist('green', d)} />
          <DistributionRow color="orange" label="Neutres & Sains" count={distribution.orange} onUpdate={(d) => updateDist('orange', d)} />
          <DistributionRow color="red" label="Plaisirs épicuriens" count={distribution.red} onUpdate={(d) => updateDist('red', d)} />
        </div>

        <button 
          onClick={handleGenerate}
          disabled={isGenerating || isExpired}
          className="w-full bg-rose-500 text-white py-5 rounded-[24px] font-bold text-base shadow-xl shadow-rose-100 flex items-center justify-center gap-3 hover:bg-rose-600 disabled:opacity-50 active:scale-[0.98] transition-all"
        >
          {isGenerating ? <Loader2 size={20} className="animate-spin" /> : isExpired ? <Lock size={20} /> : <Sparkles size={20} />}
          Générer {localHouseholdSize > 1 ? `pour ${localHouseholdSize}` : 'mon menu'}
        </button>
      </div>

      {/* Results */}
      {generatedMealsList.length > 0 && (
        <div className="space-y-4 animate-in slide-in-from-bottom duration-500">
          <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-2">Mes suggestions personnalisées</h4>
          {generatedMealsList.map((meal, index) => (
            <div key={index} className={`w-full text-left p-6 rounded-[32px] border-2 bg-white shadow-sm hover:shadow-md transition-all ${
              meal.category === 'green' ? 'border-emerald-100' : meal.category === 'orange' ? 'border-amber-100' : 'border-rose-100'
            }`}>
              <div className="flex items-center gap-2 mb-2">
                <div className={`w-2 h-2 rounded-full ${
                  meal.category === 'green' ? 'bg-emerald-400' : meal.category === 'orange' ? 'bg-amber-400' : 'bg-rose-400'
                }`} />
                <h5 className="text-base font-bold text-slate-800">{meal.title}</h5>
              </div>
              <p className="text-xs text-slate-500 leading-relaxed">{meal.description}</p>
              <div className="mt-4 flex flex-wrap gap-2">
                {meal.ingredients?.slice(0, 4).map((ing: string, i: number) => (
                  <span key={i} className="text-[9px] font-bold bg-slate-50 text-slate-400 px-2 py-1 rounded-lg">{ing}</span>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

const DistributionRow: React.FC<{ color: string, label: string, count: number, onUpdate: (d: number) => void }> = ({ color, label, count, onUpdate }) => {
  const colorMap: any = { green: 'bg-emerald-400', orange: 'bg-amber-400', red: 'bg-rose-400' };
  return (
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-3">
        <div className={`w-3 h-3 rounded-full ${colorMap[color]}`} />
        <span className="text-xs font-bold text-slate-700">{label}</span>
      </div>
      <div className="flex items-center gap-2 bg-slate-50 p-1 rounded-2xl border border-slate-100">
        <button onClick={() => onUpdate(-1)} className="w-8 h-8 rounded-xl flex items-center justify-center bg-white shadow-sm text-slate-400 hover:text-rose-500 transition-colors"><Minus size={14}/></button>
        <span className="text-sm font-black text-slate-800 w-6 text-center">{count}</span>
        <button onClick={() => onUpdate(1)} className="w-8 h-8 rounded-xl flex items-center justify-center bg-white shadow-sm text-slate-400 hover:text-rose-500 transition-colors"><Plus size={14}/></button>
      </div>
    </div>
  );
};

export default NutritionModule;
