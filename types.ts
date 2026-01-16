
export type TabType = 'home' | 'nutrition' | 'forum' | 'map' | 'messages' | 'profile';

export type SubscriptionStatus = 'trial' | 'active' | 'expired';

export type EndoClass = 'green' | 'orange' | 'red';

export interface UserProfile {
  id: string;
  pseudo: string;
  avatar_url?: string;
  status: 'diagnosed' | 'suspicion' | 'supporter';
  diet_tags: string[];
  excluded_ingredients: string[];
  household_size: number;
  visibility: 'city' | 'off';
  approxLocation: {
    lat: number;
    lng: number;
    city: string;
    department: string;
  };
  // Subscription fields
  subscriptionStatus: SubscriptionStatus;
  trialStartDate: string; // ISO String
}

export interface Recipe {
  id: string;
  title: string;
  image_url: string;
  description: string;
  ingredients_text: string[];
  endo_class: EndoClass;
  endo_score: number;
  tags: string[];
  scientific_explanation: string;
}

export interface ForumPost {
  id: string;
  user_id: string;
  author_pseudo: string;
  category_id: string;
  title: string;
  body: string;
  likes_count: number;
  replies_count: number;
  created_at: string;
}

export enum ForumCategory {
  Nutrition = 'Alimentation & Inflammation',
  Pain = 'Douleur & Quotidien',
  Work = 'Travail & Endométriose',
  Couple = 'Couple & Sexualité',
  Medical = 'Parcours Médical',
  Wellbeing = 'Bien-être'
}
