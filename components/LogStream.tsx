import Link from "next/link";
import { PostMetadata } from "@/lib/posts";

interface LogStreamProps {
    posts: PostMetadata[];
}

const statusColors: Record<string, string> = {
    GO: "border-accent-blue text-accent-blue bg-accent-blue/10",
    AI: "border-primary text-primary bg-primary/10",
    DEV: "border-[#666] text-[#666] bg-[#111]",
    System: "border-accent-blue text-accent-blue bg-accent-blue/10",
    Life: "border-primary text-primary bg-primary/10",
};

export default function LogStream({ posts }: LogStreamProps) {
    return (
        <section className="flex flex-col gap-2 mt-20">
            <div className="flex items-center justify-between border-b border-[#222] pb-4 mb-4">
                <h3 className="text-xl font-bold flex items-center gap-2">
                    <span className="material-symbols-outlined text-primary">format_list_bulleted</span>
                    系统日志 (System Logs)
                </h3>
                <div className="text-xs text-[#444] font-mono">
                    Items: {posts.length}
                </div>
            </div>
            <div className="flex flex-col">
                {posts.map((post) => {
                    // Default to System tag if no tags present or use the first tag
                    const tag = post.tags && post.tags.length > 0 ? post.tags[0] : "System";
                    const tagClass = statusColors[tag] || statusColors["System"];

                    return (
                        <Link
                            key={post.slug}
                            href={`/blog/${post.slug}`}
                            className="log-entry group flex flex-col md:flex-row md:items-center gap-4 px-4 py-3 rounded-lg transition-all cursor-pointer"
                        >
                            <span className="text-[#555] font-mono text-sm shrink-0">{post.date}</span>
                            <div className="flex items-center gap-3">
                                <span className={`px-2 py-0.5 text-[10px] font-bold rounded border ${tagClass}`}>
                                    {tag}
                                </span>
                                <span className="text-white text-lg group-hover:text-primary transition-colors">
                                    {post.title}
                                </span>
                            </div>
                            <div className="md:ml-auto opacity-0 group-hover:opacity-100 transition-opacity">
                                <span className="material-symbols-outlined text-primary">arrow_right_alt</span>
                            </div>
                        </Link>
                    );
                })}
            </div>
            <div className="mt-8 flex justify-center">
                <button className="text-[#666] hover:text-primary text-sm font-mono flex items-center gap-2 transition-colors">
                    [ LOAD MORE ENTRIES ]
                </button>
            </div>
        </section>
    );
}
