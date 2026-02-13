import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';

const postsDirectory = path.join(process.cwd(), 'posts');

export interface PostMetadata {
    title: string;
    date: string;
    slug: string;
    [key: string]: any;
}

export function getPostMetadata(): PostMetadata[] {
    // Ensure directory exists to avoid errors on fresh clones
    if (!fs.existsSync(postsDirectory)) {
        return [];
    }

    const files = fs.readdirSync(postsDirectory);

    const posts = files
        .filter((file) => file.endsWith('.mdx'))
        .map((file) => {
            const filePath = path.join(postsDirectory, file);
            const fileContent = fs.readFileSync(filePath, 'utf8');
            const { data } = matter(fileContent);

            return {
                title: data.title,
                date: data.date,
                slug: file.replace('.mdx', ''),
                ...data,
            };
        });

    // Sort posts by date descending
    return posts.sort((a, b) => (new Date(a.date) < new Date(b.date) ? 1 : -1));
}

export const getSortedPostsData = getPostMetadata;

export function getPostContent(slug: string) {
    const filePath = path.join(postsDirectory, `${slug}.mdx`);

    if (!fs.existsSync(filePath)) {
        throw new Error(`Post not found: ${slug}`);
    }

    const fileContent = fs.readFileSync(filePath, 'utf8');
    const { data, content } = matter(fileContent);

    const headings = extractHeadings(content);

    return {
        metadata: {
            title: data.title,
            date: data.date,
            slug: slug,
            ...data,
        } as PostMetadata,
        content,
        headings,
    };
}

export function getRelatedPosts(currentSlug: string, tags: string[] = [], limit: number = 3): PostMetadata[] {
    const allPosts = getPostMetadata();

    // Filter out current post
    const otherPosts = allPosts.filter(post => post.slug !== currentSlug);

    if (!tags || tags.length === 0) {
        // If no tags, just return recent posts
        return otherPosts.slice(0, limit);
    }

    // Score posts by matching tags
    const scoredPosts = otherPosts.map(post => {
        let score = 0;
        if (post.tags) {
            post.tags.forEach((tag: string) => {
                if (tags.includes(tag)) {
                    score++;
                }
            });
        }
        return { post, score };
    });

    // Sort by score (descending) then date (descending)
    scoredPosts.sort((a, b) => {
        if (a.score !== b.score) {
            return b.score - a.score;
        }
        return new Date(b.post.date).getTime() - new Date(a.post.date).getTime();
    });

    // Return top N posts
    return scoredPosts
        .filter(item => item.score > 0 || otherPosts.length < 5) // Keep some fallback if few posts match
        .slice(0, limit)
        .map(item => item.post);
}

function extractHeadings(content: string) {
    const headings: { level: number; text: string; id: string }[] = [];
    const lines = content.split('\n');
    let inCodeBlock = false;

    lines.forEach((line) => {
        if (line.trim().startsWith('```')) {
            inCodeBlock = !inCodeBlock;
            return;
        }

        if (inCodeBlock) return;

        const match = line.match(/^(#{2,3})\s+(.*)$/);
        if (match) {
            const level = match[1].length;
            const text = match[2].trim();
            // Simple slug generation: lowercase, remove non-alphanumeric, replace spaces with hyphens
            const id = text
                .toLowerCase()
                .replace(/[^a-z0-9\s-]/g, '')
                .trim()
                .replace(/\s+/g, '-');

            headings.push({ level, text, id });
        }
    });

    return headings;
}
