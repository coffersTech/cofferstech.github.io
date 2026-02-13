import Link from 'next/link';
import type { PostMetadata } from '@/lib/posts';

interface RelatedPostsProps {
    posts: PostMetadata[];
}

export default function RelatedPosts({ posts }: RelatedPostsProps) {
    if (!posts || posts.length === 0) return null;

    return (
        <div className="w-full mt-20 pt-10 border-t border-[#333]">
            <h3 className="text-xl font-bold text-primary mb-6 flex items-center gap-2">
                <span className="text-white">&gt;</span> RELATED_LOGS
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {posts.map((post) => (
                    <Link href={`/blog/${post.slug}`} key={post.slug} className="group block h-full">
                        <div className="h-full border border-[#333] bg-[#0A0A0A] p-5 rounded-lg transition-all duration-300 hover:border-primary hover:shadow-[0_0_15px_rgba(13,242,13,0.1)] flex flex-col">
                            <div className="text-xs text-[#666] mb-2 font-mono flex justify-between">
                                <span>{post.date}</span>
                                <span className="text-primary opacity-0 group-hover:opacity-100 transition-opacity">&gt;&gt;</span>
                            </div>
                            <h4 className="text-lg font-bold text-[#E0E0E0] group-hover:text-primary transition-colors mb-2 line-clamp-2">
                                {post.title}
                            </h4>
                            <p className="text-sm text-[#888] line-clamp-3 mb-4 flex-1">
                                {post.description || "No description available."}
                            </p>
                            <div className="flex flex-wrap gap-2 mt-auto">
                                {post.tags && post.tags.slice(0, 2).map((tag: string) => (
                                    <span key={tag} className="text-[10px] px-2 py-1 bg-[#111] text-[#666] rounded border border-[#222]">
                                        #{tag}
                                    </span>
                                ))}
                            </div>
                        </div>
                    </Link>
                ))}
            </div>
        </div>
    );
}
