export type PromptCategory =
  | "indian"
  | "western"
  | "profile"
  | "family"
  | "art"
  | "professional"
  | "saree";

export interface Prompt {
  id: string;
  title: string;
  description: string;
  category: PromptCategory;
  tags: string[];
  imgUrl: string;
  usageCount: number;
  status: "published" | "draft";
}
