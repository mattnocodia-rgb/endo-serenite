
import React, { useState } from 'react';
import { Search, Heart, MessageCircle, MoreVertical, Plus, Filter, MessageSquareHeart } from 'lucide-react';
import { ForumPost, ForumCategory } from '../types';

// Updated MOCK_POSTS to match the ForumPost interface in types.ts
const MOCK_POSTS: ForumPost[] = [
  {
    id: '1',
    user_id: 'u1',
    author_pseudo: 'Sophie_Endo',
    category_id: ForumCategory.Pain,
    title: 'Mes astuces pour gérer les crises au bureau',
    body: 'Salut les filles, je partage mes 3 objets indispensables : bouillotte rechargeable, huile de CBD et un coussin ergonomique...',
    likes_count: 24,
    replies_count: 8,
    created_at: 'Il y a 2h'
  },
  {
    id: '2',
    user_id: 'u2',
    author_pseudo: 'NutritionLover',
    category_id: ForumCategory.Nutrition,
    title: 'Le curcuma, ça marche vraiment ?',
    body: 'J\'entends beaucoup parler des vertus du curcuma. Avez-vous vu une réelle différence sur vos douleurs menstruelles ?',
    likes_count: 15,
    replies_count: 12,
    created_at: 'Il y a 5h'
  },
  {
    id: '3',
    user_id: 'u3',
    author_pseudo: 'Clara_92',
    category_id: ForumCategory.Work,
    title: 'Annoncer son endométriose à son boss',
    body: 'Je viens d\'être diagnostiquée et je stresse de le dire au travail. Comment avez-vous abordé le sujet ?',
    likes_count: 42,
    replies_count: 31,
    created_at: 'Hier'
  }
];

const ForumModule: React.FC = () => {
  const [activeCategory, setActiveCategory] = useState<string | null>(null);
  const [search, setSearch] = useState('');

  const categories = Object.values(ForumCategory);

  return (
    <div className="flex flex-col h-full bg-slate-50">
      <div className="p-4 bg-white border-b sticky top-0 z-10">
        <div className="relative mb-4">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
          <input 
            type="text"
            placeholder="Rechercher un sujet..."
            className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        
        <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
          <button 
            onClick={() => setActiveCategory(null)}
            className={`px-3 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-colors ${!activeCategory ? 'bg-indigo-600 text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'}`}
          >
            Tous
          </button>
          {categories.map(cat => (
            <button 
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-3 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-colors ${activeCategory === cat ? 'bg-indigo-600 text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'}`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      <div className="p-4 space-y-4">
        {/* Updated property access to match ForumPost interface */}
        {MOCK_POSTS.filter(p => !activeCategory || p.category_id === activeCategory).map(post => (
          <div key={post.id} className="bg-white p-4 rounded-2xl border border-slate-100 shadow-sm">
            <div className="flex justify-between items-start mb-2">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600 font-bold text-xs uppercase">
                  {post.author_pseudo[0]}
                </div>
                <div>
                  <p className="text-xs font-bold text-slate-800">@{post.author_pseudo}</p>
                  <p className="text-[10px] text-slate-400">{post.created_at} • {post.category_id}</p>
                </div>
              </div>
              <button className="text-slate-300"><MoreVertical size={16} /></button>
            </div>
            
            <h4 className="text-sm font-bold text-slate-800 mb-1">{post.title}</h4>
            <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed mb-4">{post.body}</p>
            
            <div className="flex items-center gap-4 pt-4 border-t border-slate-50">
              <button className="flex items-center gap-1.5 text-slate-500 hover:text-rose-500 transition-colors">
                <Heart size={16} />
                <span className="text-xs font-medium">{post.likes_count}</span>
              </button>
              <button className="flex items-center gap-1.5 text-slate-500 hover:text-indigo-500 transition-colors">
                <MessageCircle size={16} />
                <span className="text-xs font-medium">{post.replies_count}</span>
              </button>
              <button className="ml-auto text-indigo-600 flex items-center gap-1">
                <MessageSquareHeart size={16} />
                <span className="text-xs font-bold uppercase tracking-tighter">Soutenir</span>
              </button>
            </div>
          </div>
        ))}
      </div>

      <button className="fixed bottom-24 right-4 w-12 h-12 bg-indigo-600 text-white rounded-full shadow-lg shadow-indigo-200 flex items-center justify-center hover:bg-indigo-700 transition-colors z-20">
        <Plus size={24} />
      </button>
    </div>
  );
};

export default ForumModule;
