import Link from 'next/link';
import { TOOLS_CONFIG } from '@/config/tools';
import * as LucideIcons from 'lucide-react';

export default function ToolsShowcase() {
    // Only show the first 4 ready tools
    const featuredTools = TOOLS_CONFIG.filter(t => t.status === 'ready').slice(0, 4);

    return (
        <section className="flex flex-col gap-6 mt-20 relative z-10">
            <div className="flex items-center justify-between border-b border-[#222] pb-4">
                <h3 className="text-xl font-bold flex items-center gap-2">
                    <span className="material-symbols-outlined text-primary">build</span>
                    实用工具 (Tools)
                </h3>
                <Link
                    href="/tools"
                    className="text-xs text-[#444] font-mono hover:text-primary transition-colors flex items-center gap-1"
                >
                    VIEW ALL <span className="material-symbols-outlined text-[12px]">arrow_forward</span>
                </Link>
            </div>

            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                {featuredTools.map((tool) => {
                    const IconComponent = (LucideIcons as any)[tool.icon] || LucideIcons.HelpCircle;

                    return (
                        <Link
                            key={tool.id}
                            href={`/tools?id=${tool.id}`} // We'll handle this query param in /tools page later if needed, or just link to /tools
                            className="group relative p-4 rounded-lg border border-[#333] bg-[#0a0a0a] hover:border-primary/50 transition-all overflow-hidden flex flex-col gap-3 group"
                        >
                            <div className="p-3 w-fit rounded-lg bg-white/5 group-hover:bg-primary/10 transition-colors text-gray-400 group-hover:text-primary">
                                <IconComponent size={24} strokeWidth={1.5} />
                            </div>

                            <div className="flex flex-col gap-1">
                                <h4 className="text-sm font-bold text-white group-hover:text-primary transition-colors font-mono">
                                    {tool.name}
                                </h4>
                                <p className="text-xs text-[#666] line-clamp-2">
                                    {tool.description}
                                </p>
                            </div>
                        </Link>
                    );
                })}
            </div>
        </section>
    );
}
