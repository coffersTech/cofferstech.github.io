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
