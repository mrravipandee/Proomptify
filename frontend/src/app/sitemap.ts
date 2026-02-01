import { MetadataRoute } from 'next'
import promptsData from '@/data/prompts.json'

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = 'https://proomptify.com'
  
  // Static pages
  const staticPages = [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: 'daily' as const,
      priority: 1,
    },
    {
      url: `${baseUrl}/prompts`,
      lastModified: new Date(),
      changeFrequency: 'daily' as const,
      priority: 0.9,
    },
  ]

  // Category pages
  const categories = ['instagram', 'linkedin', 'youtube', 'aiart', 'chatgpt', 'resume', 'bio', 'tiktok', 'twitter']
  const categoryPages = categories.map((category) => ({
    url: `${baseUrl}/prompts/${category}`,
    lastModified: new Date(),
    changeFrequency: 'weekly' as const,
    priority: 0.8,
  }))

  // Individual prompt pages
  const promptPages = promptsData.prompts.map((prompt) => ({
    url: `${baseUrl}/prompts/${prompt.category}/${prompt.id}`,
    lastModified: new Date(),
    changeFrequency: 'monthly' as const,
    priority: 0.7,
  }))

  return [...staticPages, ...categoryPages, ...promptPages]
}
