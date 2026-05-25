export type AppScreen = 'auth' | 'creative-studio' | 'my-gallery' | 'coin-store';

export type AuthTab = 'signin' | 'signup';

export interface UserSession {
  name: string;
  email: string;
  coins: number;
  avatar: string;
  isPremium: boolean;
  planType: string;
  loggedIn: boolean;
}

export type StyleCategory = 'All' | 'Professional' | 'Anime' | '3D Render' | 'Sci-Fi';

export interface GeneratorModel {
  id: string;
  name: string;
  description: string;
  cost: number;
  estTime: string;
  image: string;
  category: StyleCategory;
  photosNeeded?: number;
  isTextPromptOnly?: boolean;
  tag?: string;
  details: string;
}

export interface GalleryItem {
  id: string;
  title: string;
  prompt: string;
  engine: string;
  duration: string;
  resolution: string;
  seed: number;
  cost: number;
  date: string;
  image: string;
  type: 'image' | 'video';
  refImage?: string;
}

export interface CoinBundle {
  id: string;
  name: string;
  coins: number;
  priceIri: string;
  tag?: string;
  features: string[];
}
