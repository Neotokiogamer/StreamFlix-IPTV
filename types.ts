export interface ContentItem {
  id: string;
  title: string;
  thumbnail: string;
  description: string;
  category: string;
  url?: string; // Stream URL
  rating?: string;
  year?: string;
  duration?: string;
  isNew?: boolean;
  match?: number;
}

export interface Category {
  id: string;
  title: string;
  items: ContentItem[];
}

export interface M3UChannel {
  name: string;
  url: string;
  logo?: string;
  group?: string;
}
