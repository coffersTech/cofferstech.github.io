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

    // 3. (Optional) 手动添加还在计划中的 10 篇产品思维实战文章
    const productThinkingSeries = Array.from({ length: 10 }).map((_, i) => {
        // 假设 URL 格式为：product-thinking-practice-01-mvp
        // 这里简化为 product-thinking-practice-01, 实际应根据 slug 生成
        const index = (i + 1).toString().padStart(2, "0");
        const slug = `product-thinking-practice-${index}`;
        // 注意：如果这些文件还不存在，建议先注释掉或确保它们稍后会被创建，
        // 否则 Google 爬虫会抓取到 404。
        // 为了演示这里暂时包含它们：
        return {
            url: `${baseUrl}/blog/${slug}`, // 示例 slug
            lastModified: new Date("2026-02-12"),
            changeFrequency: "weekly" as const,
            priority: 0.7,
        };
    });

    // 合并所有 URL
    return [...routes, ...postUrls, ...productThinkingSeries];
}
