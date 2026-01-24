import { getPostContent, getPostMetadata } from "@/lib/posts";
import { MDXRemote } from "next-mdx-remote/rsc";
import Link from "next/link";
import remarkMath from 'remark-math';
import rehypeKatex from 'rehype-katex';
import rehypeSlug from 'rehype-slug';
import rehypeAutolinkHeadings from 'rehype-autolink-headings';
import 'katex/dist/katex.min.css';
import TableOfContents from "@/components/TableOfContents";
import ArticleLayout from "@/components/ArticleLayout";

export async function generateStaticParams() {
    const posts = getPostMetadata();
    return posts.map((post) => ({
        slug: post.slug,
    }));
}

export default function PostPage({ params }: { params: { slug: string } }) {
    const { slug } = params;

    let post;
    try {
        post = getPostContent(slug);
    } catch (error) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center bg-background-dark text-primary font-mono">
                <h1 className="text-4xl font-bold glitch-text">404 - SYSTEM_ERROR: FILE_NOT_FOUND</h1>
            </div>
        )
    }

    return (
        <ArticleLayout headings={post.headings} metadata={post.metadata}>
            <MDXRemote
                source={post.content}
                options={{
                    mdxOptions: {
                        remarkPlugins: [remarkMath],
                        // @ts-expect-error - Remark/Rehype types mismatch with next-mdx-remote
                        rehypePlugins: [rehypeKatex, rehypeSlug, [rehypeAutolinkHeadings, { behavior: 'wrap' }]],
                    }
                }}
            />
        </ArticleLayout>
    );
}
