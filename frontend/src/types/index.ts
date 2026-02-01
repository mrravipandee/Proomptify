// types/index.ts

export type CategoryId = 'all' | 'insta' | 'linkedin' | 'youtube' | 'art' | 'chatgpt' | 'resume' | 'bio';

export interface Category {
  id: CategoryId;
  label: string;
  icon?: React.ElementType; // For Lucide components
}

export interface Prompt {
  id: string;
  title: string;
  description: string;
  tags: string[];
  promptText: string;
  category: CategoryId;
}