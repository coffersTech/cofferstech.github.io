// app/sitemap.ts
import { MetadataRoute } from "next";
import { getPostMetadata } from "@/lib/posts";

export default function sitemap(): MetadataRoute.Sitemap {
    const baseUrl = "https://coffers.tech";
    const posts = getPostMetadata();

    // 1. 动态获取博客文章 (Dynamic Posts)
    const postUrls = posts.map((post) => ({
        url: `${baseUrl}/blog/${post.slug}`,
        lastModified: new Date(post.date),
        changeFrequency: "weekly" as const,
        priority: 0.7,
    }));

    // 2. 静态页面 (Static Pages)
    const routes = [
        {
            url: `${baseUrl}`,
            lastModified: new Date(),
            changeFrequency: "daily" as const,
            priority: 1.0,
        },
        {
            url: `${baseUrl}/blog/category/full-stack-system`,
            lastModified: new Date(),
            changeFrequency: "daily" as const,
            priority: 0.8,
        },
        // 添加其他静态页面如 /projects, /tools 等
        {
            url: `${baseUrl}/projects`,
            lastModified: new Date(),
            changeFrequency: "daily" as const,
            priority: 0.8,
        },
        {
            url: `${baseUrl}/tools`,
            lastModified: new Date(),
            changeFrequency: "daily" as const,
            priority: 0.8,
        },
    ];

    // 合并所有 URL
    return [...routes, ...postUrls];
}
