import { MetadataRoute } from "next";

/**
 * 動的なサイトマップ生成
 * SEO向上のため、主要なページをリスト
 */
export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = "https://ai-skill-map-generator.vercel.app";
  const lastModified = new Date();

  return [
    {
      url: baseUrl,
      lastModified,
      changeFrequency: "weekly",
      priority: 1.0
    },
    {
      url: `${baseUrl}/dashboard`,
      lastModified,
      changeFrequency: "daily",
      priority: 0.8
    },
    {
      url: `${baseUrl}/about`,
      lastModified,
      changeFrequency: "monthly",
      priority: 0.5
    },
    {
      url: `${baseUrl}/portfolio`,
      lastModified,
      changeFrequency: "weekly",
      priority: 0.7
    },
    {
      url: `${baseUrl}/legal`,
      lastModified,
      changeFrequency: "monthly",
      priority: 0.3
    }
  ];
}


