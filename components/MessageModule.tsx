
import React from 'react';
import { Mail, Search, ChevronRight, User } from 'lucide-react';

const MOCK_CONVERSATIONS = [
  { id: '1', pseudo: 'Marie_Yoga', last: 'On se voit pour le café ?', time: '14:20', unread: true },
  { id: '2', pseudo: 'Lucie.Endo', last: 'Merci pour la recette du curry !', time: 'Hier', unread: false },
  { id: '3', pseudo: 'Dr_Zen', last: 'Comment s\'est passée ta semaine ?', time: 'Lun', unread: false },
];

const MessageModule: React.FC = () => {
  return (
    <div className="p-4 space-y-6 animate-in fade-in duration-500">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-slate-800">Messages</h2>
        <div className="w-10 h-10 bg-indigo-50 rounded-full flex items-center justify-center text-indigo-600">
          <Mail size={20} />
        </div>
      </div>

      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
        <input 
          type="text" 
          placeholder="Rechercher une conversation..."
          className="w-full pl-10 pr-4 py-3 bg-white border border-slate-100 rounded-2xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 shadow-sm"
        />
      </div>

      <div className="space-y-2">
        {MOCK_CONVERSATIONS.map((conv) => (
          <div key={conv.id} className="bg-white p-4 rounded-3xl border border-slate-100 shadow-sm flex items-center gap-4 cursor-pointer hover:bg-slate-50 transition-colors">
            <div className="w-12 h-12 bg-indigo-100 rounded-full flex items-center justify-center text-indigo-600 font-bold relative">
              {conv.pseudo[0]}
              {conv.unread && <div className="absolute top-0 right-0 w-3 h-3 bg-rose-500 border-2 border-white rounded-full" />}
            </div>
            <div className="flex-1">
              <div className="flex justify-between mb-0.5">
                <h4 className="text-sm font-bold text-slate-800">{conv.pseudo}</h4>
                <span className="text-[10px] font-medium text-slate-400">{conv.time}</span>
              </div>
              <p className={`text-xs truncate ${conv.unread ? 'text-slate-800 font-bold' : 'text-slate-500'}`}>{conv.last}</p>
            </div>
            <ChevronRight size={16} className="text-slate-300" />
          </div>
        ))}
      </div>

      <div className="bg-indigo-50 p-6 rounded-[32px] text-center border border-indigo-100 mt-8">
        <p className="text-xs text-indigo-700 font-medium leading-relaxed">
          "L'isolement est le plus grand fardeau de la maladie invisible. N'hésitez pas à faire le premier pas."
        </p>
      </div>
    </div>
  );
};

export default MessageModule;
