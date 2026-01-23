import { getPostContent, getPostMetadata } from "@/lib/posts";
import { MDXRemote } from "next-mdx-remote/rsc";
import Link from "next/link";
import remarkMath from 'remark-math';
import rehypeKatex from 'rehype-katex';
import rehypeSlug from 'rehype-slug';
import rehypeAutolinkHeadings from 'rehype-autolink-headings';
import 'katex/dist/katex.min.css';

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
        <div className="bg-background-dark font-mono text-terminal-grey min-h-screen selection:bg-primary selection:text-background-dark">
            <div className="scanline"></div>
            <div className="crt"></div>

            {/* Progress Bar (Fixed Top) */}
            <div className="fixed top-0 left-0 w-full h-[2px] z-50 bg-background-dark">
                <div className="h-full bg-primary shadow-[0_0_10px_#00FF00]" style={{ width: "35%" }}></div>
            </div>

            <div className="flex min-h-screen relative z-10">
                {/* Sidebar Navigation */}
                <aside className="hidden lg:flex flex-col w-80 h-screen sticky top-0 p-6 border-r border-[#333] bg-[#050505]/95 backdrop-blur-sm">
                    <div className="flex items-center gap-3 mb-10 group cursor-pointer">
                        <Link href="/" className="text-primary hover:text-white transition-colors">
                            <span className="text-4xl font-bold">&gt;_</span>
                        </Link>
                        <h2 className="font-bold text-xl tracking-tight text-white group-hover:text-primary transition-colors">饭桶日志</h2>
                    </div>

                    <div className="flex flex-col gap-10">
                        <div>
                            <h3 className="text-xs text-primary mb-4 font-bold border-b border-[#333] pb-2">&gt; TABLE_OF_CONTENTS</h3>
                            <nav className="flex flex-col gap-2 pl-2 border-l border-[#333]">
                                <a className="flex items-center gap-2 text-sm text-[#888] hover:text-primary transition-colors group" href="#">
                                    <span className="opacity-0 group-hover:opacity-100 transition-opacity">&gt;</span> 简介
                                </a>
                                {/* Placeholder ToC items */}
                            </nav>
                        </div>
                        <div>
                            <h3 className="text-xs text-primary mb-4 font-bold border-b border-[#333] pb-2">&gt; META_INFO</h3>
                            <div className="flex flex-wrap gap-2">
                                {post.metadata.tags && post.metadata.tags.map((tag: string) => (
                                    <div key={tag} className="flex items-center px-2 py-1 border border-primary text-primary bg-primary/10 text-[10px]">
                                        #{tag}
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    <div className="mt-auto">
                        <Link href="/" className="w-full flex items-center justify-between px-4 py-3 border border-[#333] bg-background-dark hover:border-primary group transition-all">
                            <div className="flex items-center gap-2 text-sm text-[#888] group-hover:text-primary">
                                <span className="cursor-blink">|</span> user@logs:~$
                            </div>
                            <span className="text-xs text-primary font-bold">cd ..</span>
                        </Link>
                    </div>
                </aside>

                {/* Main Content Area */}
                <main className="flex-1 flex flex-col items-center">
                    <article className="max-w-[800px] w-full px-6 py-12 lg:py-20">
                        {/* Article Heading */}
                        <div className="flex flex-col gap-6 mb-16 border-b border-[#333] pb-12">
                            <h1 className="text-4xl lg:text-5xl font-bold leading-tight text-primary text-glow font-display">
                                {post.metadata.title}
                            </h1>
                            <div className="flex flex-wrap items-center gap-8 text-xs font-mono text-[#666]">
                                <div className="flex items-center gap-2">
                                    <span className="material-symbols-outlined text-sm text-primary">calendar_today</span>
                                    {post.metadata.date}
                                </div>
                                <div className="flex items-center gap-2">
                                    <span className="material-symbols-outlined text-sm text-primary">schedule</span>
                                    12 MIN_READ
                                </div>
                                <div className="flex items-center gap-2">
                                    <span className="material-symbols-outlined text-sm text-primary">visibility</span>
                                    1.2k VIEWS
                                </div>
                            </div>
                        </div>

                        {/* Markdown Content */}
                        <div className="space-y-8 leading-loose text-lg text-[#E0E0E0] prose prose-invert prose-lg max-w-none 
                            prose-headings:font-bold prose-headings:text-primary prose-headings:text-glow prose-headings:font-display
                            prose-h2:text-2xl prose-h2:border-b prose-h2:border-[#333] prose-h2:pb-2 prose-h2:mt-12
                            prose-p:text-[#E0E0E0] prose-p:font-mono
                            prose-a:text-primary prose-a:no-underline prose-a:border-b prose-a:border-primary/50 hover:prose-a:border-primary
                            prose-blockquote:border-l-2 prose-blockquote:border-primary prose-blockquote:bg-[#111] prose-blockquote:px-6 prose-blockquote:py-4 prose-blockquote:text-[#888] prose-blockquote:not-italic
                            prose-code:text-primary prose-code:bg-[#111] prose-code:px-2 prose-code:py-1 prose-code:before:content-none prose-code:after:content-none prose-code:font-bold
                            prose-pre:bg-[#050505] prose-pre:border prose-pre:border-[#333]">
                            <MDXRemote
                                source={post.content}
                                options={{
                                    mdxOptions: {
                                        // @ts-expect-error - version mismatch in types
                                        remarkPlugins: [remarkMath],
                                        // @ts-expect-error - version mismatch in types
                                        rehypePlugins: [rehypeKatex, rehypeSlug, [rehypeAutolinkHeadings, { behavior: 'wrap' }]],
                                    }
                                }}
                            />
                        </div>

                        {/* Footer Section in Article */}
                        <div className="pt-12 mt-20 border-t border-[#333] flex flex-col items-center gap-6">
                            <div className="text-[#444] font-mono text-xs uppercase tracking-[0.2em]">&lt; END_OF_LOG /&gt;</div>
                            <div className="flex gap-4">
                                <button className="flex items-center gap-2 px-6 py-2 border border-[#333] hover:border-primary hover:bg-primary/10 transition-all group">
                                    <span className="material-symbols-outlined text-[#666] group-hover:text-primary text-sm">share</span>
                                    <span className="text-xs font-bold text-[#666] group-hover:text-primary">NO_SHARE</span>
                                </button>
                                <button className="flex items-center gap-2 px-6 py-2 border border-[#333] hover:border-primary hover:bg-primary/10 transition-all group">
                                    <span className="material-symbols-outlined text-[#666] group-hover:text-primary text-sm">bookmark</span>
                                    <span className="text-xs font-bold text-[#666] group-hover:text-primary">SAVE_LOG</span>
                                </button>
                            </div>
                        </div>

                    </article>
                </main>

                {/* Reading Controls (Fixed Right) */}
                <aside className="hidden xl:flex flex-col w-24 h-screen sticky top-0 py-12 items-center border-l border-[#333] bg-[#050505]/95">
                    <div className="flex flex-col gap-6 mb-auto">
                        <button className="size-10 flex items-center justify-center border border-[#333] hover:border-primary hover:text-white text-[#666] transition-all">
                            T+
                        </button>
                        <button className="size-10 flex items-center justify-center border border-[#333] hover:border-primary hover:text-white text-[#666] transition-all">
                            T-
                        </button>
                    </div>

                    <div className="h-[40vh] w-[2px] bg-[#222] relative rounded-full overflow-hidden">
                        <div className="absolute top-0 w-full bg-primary shadow-[0_0_8px_#00FF00]" style={{ height: "35%" }}></div>
                    </div>
                    <div className="font-mono text-[10px] text-primary rotate-90 whitespace-nowrap mt-6 font-bold">
                        35%
                    </div>
                </aside>
            </div>
        </div>
    );
}
