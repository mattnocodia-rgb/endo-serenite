
import React, { useState } from 'react';
import { MapPin, Shield, MessageSquare, Coffee, Search, User, Sparkles } from 'lucide-react';

interface CommunityMapProps {
  onStartChat: () => void;
}

const MOCK_NEIGHBORS = [
  { id: '1', name: 'Marie L.', status: 'Diagnostiquée', distance: '1.2 km', tags: ['Yoga', 'Café'] },
  { id: '2', name: 'Sarah_92', status: 'Suspicion', distance: '2.5 km', tags: ['Marche', 'Discussion'] },
  { id: '3', name: 'Ju_Endo', status: 'Diagnostiquée', distance: '4.8 km', tags: ['Recettes', 'Sport'] },
];

const CommunityMap: React.FC<CommunityMapProps> = ({ onStartChat }) => {
  const [privacyOptIn, setPrivacyOptIn] = useState(false);

  if (!privacyOptIn) {
    return (
      <div className="p-8 flex flex-col items-center justify-center text-center space-y-6 h-full animate-in fade-in">
        <div className="w-20 h-20 bg-indigo-50 rounded-full flex items-center justify-center text-indigo-500">
          <Shield size={40} />
        </div>
        <div className="space-y-2">
          <h2 className="text-xl font-bold text-slate-800">Trouvez vos Guerrières</h2>
          <p className="text-sm text-slate-500 leading-relaxed">
            Votre position précise n'est jamais divulguée. Nous utilisons une zone approximative pour favoriser l'entraide locale.
          </p>
        </div>
        <button 
          onClick={() => setPrivacyOptIn(true)}
          className="w-full bg-indigo-600 text-white py-4 rounded-2xl font-bold shadow-lg shadow-indigo-100 flex items-center justify-center gap-2"
        >
          <Sparkles size={18} /> Activer la carte locale
        </button>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full bg-slate-50 animate-in slide-in-from-right duration-500">
      <div className="h-72 bg-indigo-100 relative overflow-hidden flex items-center justify-center">
        <div className="absolute inset-0 opacity-20 pointer-events-none" style={{ backgroundImage: 'radial-gradient(circle, #4f46e5 1px, transparent 1px)', backgroundSize: '24px 24px' }} />
        <div className="relative">
          <div className="w-56 h-56 bg-indigo-200/50 rounded-full animate-pulse" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
            <div className="w-12 h-12 bg-indigo-600 rounded-full border-4 border-white shadow-2xl flex items-center justify-center text-white">
              <MapPin size={24} />
            </div>
          </div>
          {/* Mock dots for neighbors */}
          <div className="absolute top-10 right-0 w-4 h-4 bg-white rounded-full border-2 border-indigo-400 shadow-md" />
          <div className="absolute bottom-4 left-4 w-4 h-4 bg-white rounded-full border-2 border-indigo-400 shadow-md" />
        </div>
      </div>

      <div className="p-4 -mt-8 relative z-10 space-y-4">
        <div className="bg-white p-4 rounded-3xl shadow-lg border border-slate-100 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-emerald-50 text-emerald-600 rounded-full flex items-center justify-center font-bold">3</div>
            <div>
              <h3 className="text-sm font-bold text-slate-800">Personnes à proximité</h3>
              <p className="text-[10px] text-slate-400">Rayon de 5km • Zone floutée</p>
            </div>
          </div>
          <button className="p-2.5 bg-slate-50 text-slate-400 rounded-xl hover:text-indigo-600 transition-colors"><Search size={18} /></button>
        </div>

        <div className="space-y-3">
          {MOCK_NEIGHBORS.map(neighbor => (
            <div key={neighbor.id} className="bg-white p-4 rounded-[32px] border border-slate-100 shadow-sm flex items-center gap-4">
              <div className="w-12 h-12 bg-indigo-50 rounded-2xl flex items-center justify-center text-indigo-400 font-bold uppercase">
                {neighbor.name[0]}
              </div>
              <div className="flex-1">
                <div className="flex items-center justify-between mb-0.5">
                  <h4 className="text-sm font-bold text-slate-800">{neighbor.name}</h4>
                  <span className="text-[10px] font-medium text-slate-400">{neighbor.distance}</span>
                </div>
                <div className="flex gap-1.5 mb-2">
                  {neighbor.tags.map(tag => (
                    <span key={tag} className="text-[9px] bg-slate-50 px-1.5 py-0.5 rounded text-slate-500 font-medium">#{tag}</span>
                  ))}
                </div>
              </div>
              <div className="flex gap-2">
                <button 
                  onClick={onStartChat}
                  className="p-3 bg-indigo-600 text-white rounded-2xl shadow-sm shadow-indigo-100 hover:bg-indigo-700 transition-colors"
                >
                  <MessageSquare size={18} />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default CommunityMap;
