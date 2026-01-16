
import React, { useState, useEffect } from 'react';
import { 
  Heart, 
  Utensils, 
  MessageSquare, 
  Map as MapIcon, 
  User, 
  Bell, 
  Mail,
  Home,
  Crown
} from 'lucide-react';
import { TabType, UserProfile, SubscriptionStatus } from './types';
import HomeModule from './components/HomeModule';
import NutritionModule from './components/NutritionModule';
import ForumModule from './components/ForumModule';
import CommunityMap from './components/CommunityMap';
import ProfileModule from './components/ProfileModule';
import MessageModule from './components/MessageModule';
import Onboarding from './components/Onboarding';

const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState<TabType>('home');
  const [showOnboarding, setShowOnboarding] = useState<boolean>(true);
  const [user, setUser] = useState<UserProfile | null>(null);

  useEffect(() => {
    const hasSeenOnboarding = localStorage.getItem('endo_onboarding_seen');
    if (hasSeenOnboarding) {
      setShowOnboarding(false);
      const stored = localStorage.getItem('endo_user_profile');
      if (stored) {
        let profile = JSON.parse(stored);
        
        // Logic to check trial expiration
        const trialStart = new Date(profile.trialStartDate || new Date().toISOString());
        const now = new Date();
        const diffDays = Math.floor((now.getTime() - trialStart.getTime()) / (1000 * 360 * 60 * 24));
        
        if (profile.subscriptionStatus === 'trial' && diffDays > 30) {
          profile.subscriptionStatus = 'expired';
          localStorage.setItem('endo_user_profile', JSON.stringify(profile));
        }
        
        setUser(profile);
      }
    }
  }, []);

  const handleFinishOnboarding = (profile: UserProfile) => {
    setUser(profile);
    setShowOnboarding(false);
    localStorage.setItem('endo_onboarding_seen', 'true');
    localStorage.setItem('endo_user_profile', JSON.stringify(profile));
  };

  const handleUpdateProfile = (updatedProfile: UserProfile) => {
    setUser(updatedProfile);
    localStorage.setItem('endo_user_profile', JSON.stringify(updatedProfile));
  };

  if (showOnboarding) {
    return <Onboarding onComplete={handleFinishOnboarding} />;
  }

  return (
    <div className="flex flex-col h-screen max-w-lg mx-auto bg-slate-50 shadow-2xl overflow-hidden relative border-x border-rose-100/30">
      <header className="bg-white px-4 py-4 border-b border-rose-50 flex justify-between items-center shrink-0 z-10">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-rose-500 rounded-lg flex items-center justify-center text-white shadow-sm shadow-rose-200">
            <Heart size={18} fill="currentColor" />
          </div>
          <h1 className="text-xl font-bold text-slate-800 tracking-tight">Endo-sérénité</h1>
        </div>
        <div className="flex gap-2">
          {user?.subscriptionStatus === 'active' && (
            <div className="p-2 text-amber-500 bg-amber-50 rounded-full">
              <Crown size={20} />
            </div>
          )}
          <button 
            onClick={() => setActiveTab('messages')}
            className={`p-2 rounded-full transition-colors relative ${activeTab === 'messages' ? 'bg-rose-50 text-rose-600' : 'text-slate-400 hover:text-rose-500 bg-rose-50/50'}`}
          >
            <Mail size={20} />
            <div className="absolute top-1.5 right-1.5 w-2 h-2 bg-rose-500 rounded-full border-2 border-white" />
          </button>
        </div>
      </header>

      <main className="flex-1 overflow-y-auto pb-24 scroll-smooth">
        {activeTab === 'home' && <HomeModule profile={user} onNavigate={setActiveTab} />}
        {activeTab === 'nutrition' && <NutritionModule profile={user} onUpdateProfile={handleUpdateProfile} onUpgrade={() => setActiveTab('profile')} />}
        {activeTab === 'forum' && <ForumModule />}
        {activeTab === 'map' && <CommunityMap onStartChat={() => setActiveTab('messages')} />}
        {activeTab === 'messages' && <MessageModule />}
        {activeTab === 'profile' && <ProfileModule profile={user} onUpdate={handleUpdateProfile} />}
      </main>

      <nav className="fixed bottom-0 left-0 right-0 max-w-lg mx-auto bg-white/95 backdrop-blur-md border-t border-rose-50 px-4 py-3 flex justify-between items-center z-50">
        <NavButton active={activeTab === 'home'} icon={<Home size={20} />} label="Accueil" onClick={() => setActiveTab('home')} />
        <NavButton active={activeTab === 'nutrition'} icon={<Utensils size={20} />} label="Menu" onClick={() => setActiveTab('nutrition')} />
        <NavButton active={activeTab === 'forum'} icon={<MessageSquare size={20} />} label="Forum" onClick={() => setActiveTab('forum')} />
        <NavButton active={activeTab === 'map'} icon={<MapIcon size={20} />} label="Carte" onClick={() => setActiveTab('map')} />
        <NavButton active={activeTab === 'profile'} icon={<User size={20} />} label="Profil" onClick={() => setActiveTab('profile')} />
      </nav>
    </div>
  );
};

const NavButton: React.FC<{ active: boolean; icon: React.ReactNode; label: string; onClick: () => void }> = ({ active, icon, label, onClick }) => (
  <button onClick={onClick} className={`flex flex-col items-center gap-1 flex-1 transition-all ${active ? 'text-rose-600' : 'text-slate-400'}`}>
    <div className={`p-1.5 rounded-xl transition-colors ${active ? 'bg-rose-50' : ''}`}>{icon}</div>
    <span className="text-[10px] font-bold tracking-tight">{label}</span>
  </button>
);

export default App;
