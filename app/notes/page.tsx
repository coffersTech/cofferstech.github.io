import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { getSortedPostsData } from '@/lib/posts';
import Link from 'next/link';

// Tab categories
const tabs = ['最新日志', '教程', '评测', '归档'];

// Mock recent activity (based on realistic dev activity)
const recentActivity = [
    { time: '14:02', action: '更新', target: 'system-logs.mdx' },
    { time: '11:45', action: '提交', target: 'Hero 组件优化' },
    { time: '09:12', action: '新增', target: 'Projects 页面' },
];

export default function NotesPage() {
    const posts = getSortedPostsData();

    // Extract all unique tags from posts
    const allTags = [...new Set(
        posts.flatMap(post => (post.tags as string[]) || [])
    )].map(tag => `#${tag}`);

    return (
        <div className="min-h-screen bg-background-dark text-white">
            <Navbar />
            <div className="max-w-[1200px] mx-auto px-6 py-8">
                {/* Tab Navigation */}
                <div className="flex gap-8 mb-8 border-b border-[#222]">
                    {tabs.map((tab, index) => (
                        <button
                            key={tab}
                            className={`pb-3 text-sm font-medium transition-colors ${index === 0
                                ? 'text-primary border-b-2 border-primary'
                                : 'text-[#666] hover:text-white'
                                }`}
                        >
                            {tab}
                        </button>
                    ))}
                </div>

                <div className="flex gap-8">
                    {/* Main Content - Article List */}
                    <div className="flex-1">
                        <div className="space-y-6">
                            {posts.map((post) => {
                                const tags = (post.tags as string[]) || [];
                                const firstTag = tags[0];
                                return (
                                    <article
                                        key={post.slug}
                                        className="flex gap-6 p-4 border border-[#222] rounded-lg bg-[#0d0d0d] hover:border-primary/50 transition-all group"
                                    >
                                        {/* Thumbnail */}
                                        <div className="w-48 h-32 bg-[#1a1a1a] rounded-lg overflow-hidden flex-shrink-0">
                                            <div className="w-full h-full bg-gradient-to-br from-primary/20 to-accent-blue/20 flex items-center justify-center">
                                                <span className="material-symbols-outlined text-4xl text-primary/50">
                                                    article
                                                </span>
                                            </div>
                                        </div>

                                        {/* Content */}
                                        <div className="flex-1 flex flex-col">
                                            {/* Meta */}
                                            <div className="flex items-center gap-3 mb-2">
                                                {firstTag && (
                                                    <span className="px-2 py-1 text-xs font-mono border border-primary rounded text-primary">
                                                        [{firstTag}]
                                                    </span>
                                                )}
                                                <span className="text-xs text-primary">
                                                    • {new Date(post.date).toLocaleDateString('zh-CN', {
                                                        year: 'numeric',
                                                        month: 'short',
                                                        day: 'numeric'
                                                    })}
                                                </span>
                                            </div>

                                            {/* Title */}
                                            <h2 className="text-xl font-bold mb-2 group-hover:text-primary transition-colors">
                                                {post.title}
                                            </h2>

                                            {/* Description */}
                                            {post.description && (
                                                <p className="text-[#888] text-sm mb-4 line-clamp-2">
                                                    {post.description}
                                                </p>
                                            )}

                                            {/* Footer */}
                                            <div className="mt-auto flex items-center justify-between">
                                                <div className="flex items-center gap-2 text-[#666] text-sm">
                                                    <span className="w-6 h-6 rounded-full bg-primary/20 flex items-center justify-center">
                                                        <span className="material-symbols-outlined text-sm text-primary">
                                                            person
                                                        </span>
                                                    </span>
                                                    <span>{post.readTime || '5 分钟阅读'}</span>
                                                </div>
                                                <Link
                                                    href={`/blog/${post.slug}`}
                                                    className="text-primary font-medium text-sm hover:underline flex items-center gap-1"
                                                >
                                                    阅读日志 →
                                                </Link>
                                            </div>
                                        </div>
                                    </article>
                                );
                            })}
                        </div>

                        {/* Load More Button */}
                        {posts.length > 0 && (
                            <button className="w-full mt-8 py-4 border border-[#333] rounded-lg text-primary font-mono text-sm hover:border-primary hover:bg-primary/5 transition-all">
                                -- 获取更多日志 --
                            </button>
                        )}

                        {/* Empty State */}
                        {posts.length === 0 && (
                            <div className="text-center py-16 text-[#666]">
                                <span className="material-symbols-outlined text-4xl mb-4 block">
                                    description
                                </span>
                                <p>暂无日志</p>
                            </div>
                        )}
                    </div>

                    {/* Sidebar */}
                    <aside className="w-72 flex-shrink-0 space-y-6">
                        {/* System Status */}
                        <div className="border border-[#222] rounded-lg p-4 bg-[#0d0d0d]">
                            <div className="flex items-center justify-between mb-4">
                                <h3 className="text-sm font-bold">系统状态</h3>
                                <span className="material-symbols-outlined text-sm text-primary">
                                    terminal
                                </span>
                            </div>
                            <div className="space-y-3 text-sm">
                                <div className="flex justify-between">
                                    <span className="text-[#666]">运行时间:</span>
                                    <span className="text-primary font-mono">154:12:44:02</span>
                                </div>
                                <div className="flex justify-between items-center">
                                    <span className="text-[#666]">CPU 负载:</span>
                                    <div className="w-16 h-2 bg-[#222] rounded overflow-hidden">
                                        <div className="h-full bg-primary w-1/4"></div>
                                    </div>
                                </div>
                                <div className="flex justify-between items-center">
                                    <span className="text-[#666]">内存:</span>
                                    <div className="w-16 h-2 bg-[#222] rounded overflow-hidden">
                                        <div className="h-full bg-accent-blue w-1/2"></div>
                                    </div>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-[#666]">位置:</span>
                                    <span className="text-primary font-mono">Localhost:8080</span>
                                </div>
                            </div>
                        </div>

                        {/* Popular Tags */}
                        <div className="border border-[#222] rounded-lg p-4 bg-[#0d0d0d]">
                            <h3 className="text-sm font-bold mb-4">热门标签</h3>
                            <div className="flex flex-wrap gap-2">
                                {allTags.length > 0 ? allTags.map((tag) => (
                                    <span
                                        key={tag}
                                        className="px-3 py-1 text-xs font-mono border border-[#333] rounded hover:border-primary hover:text-primary transition-colors cursor-pointer"
                                    >
                                        {tag}
                                    </span>
                                )) : (
                                    <span className="text-[#666] text-xs">暂无标签</span>
                                )}
                            </div>
                        </div>

                        {/* Recent Activity */}
                        <div className="border border-[#222] rounded-lg p-4 bg-[#0d0d0d]">
                            <div className="flex items-center gap-2 mb-4">
                                <span className="material-symbols-outlined text-sm text-[#666]">
                                    schedule
                                </span>
                                <h3 className="text-sm font-bold">最近活动</h3>
                            </div>
                            <div className="space-y-3 text-sm">
                                {recentActivity.map((activity, index) => (
                                    <div key={index} className="flex gap-3">
                                        <span className="text-primary font-mono text-xs">
                                            {activity.time}
                                        </span>
                                        <span className="text-[#666]">{activity.action}</span>
                                        <span className="text-white truncate">
                                            {activity.target}
                                        </span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </aside>
                </div>
            </div>
            <Footer />
        </div>
    );
}
