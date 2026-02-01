// types/index.ts

export type CategoryId = 'all' | 'instagram' | 'linkedin' | 'youtube' | 'aiart' | 'chatgpt' | 'resume' | 'bio' | 'tiktok' | 'twitter';

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
  category: string;
  imgUrl?: string;
  steps?: string[];
  completeSteps?: string[];
  estimatedTime?: string;
  usageCount?: number;
  referenceUrl?: string | null;
}