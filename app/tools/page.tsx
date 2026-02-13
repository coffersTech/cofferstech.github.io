'use client';

import { useState, useMemo, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import ToolCard from '@/components/tools/ToolCard';
import ToolDrawer from '@/components/tools/ToolDrawer';
import { TOOLS_CONFIG, ToolCategory, ToolCategoryLabels } from '@/config/tools';
import { getToolComponent } from '@/components/tools/ToolRegistry';
import { ConfigProvider, theme } from 'antd';

function ToolsContent() {
    const searchParams = useSearchParams();
    const initialToolId = searchParams.get('id');
    const [activeToolId, setActiveToolId] = useState<string | null>(initialToolId);
    const [filter, setFilter] = useState<ToolCategory | 'ALL'>('ALL');

    // Update activeToolId if URL active param changes (optional, but good for back/forward nav)
    useEffect(() => {
        const id = searchParams.get('id');
        if (id) setActiveToolId(id);
    }, [searchParams]);

    const activeTool = TOOLS_CONFIG.find(t => t.id === activeToolId);

    const filteredTools = useMemo(() => {
        if (filter === 'ALL') return TOOLS_CONFIG;
        return TOOLS_CONFIG.filter(t => t.category === filter);
    }, [filter]);

    return (
        <ConfigProvider
            theme={{
                algorithm: theme.darkAlgorithm,
                token: {
                    colorPrimary: '#00ff00',
                }
            }}
        >
            <div className="min-h-screen bg-background-dark text-white font-mono relative overflow-hidden">
                <div className="pixel-grid fixed inset-0 pointer-events-none opacity-30"></div>
                <div className="scanline"></div>

                <Navbar />

                <main className="max-w-[1200px] mx-auto px-6 py-12 relative z-10">
                    {/* Terminal Header */}
                    <div className="mb-8 space-y-4">
                        <div className="inline-flex flex-wrap items-center gap-2 bg-black/50 border border-white/10 px-4 py-2 rounded">
                            <span className="text-primary font-bold">root@rice-bucket</span>
                            <span className="text-gray-500">:</span>
                            <span className="text-accent-blue font-bold">~/tools</span>
                            <span className="text-white">$</span>
                            <span className="text-white">filter --category {filter.toLowerCase()}</span>
                            <span className="w-2 h-4 bg-primary animate-pulse ml-1"></span>
                        </div>
                        <div className="flex items-center gap-3 text-[11px] md:text-[12px] text-gray-500 font-bold ml-1 uppercase">
                            <span className="text-primary">[状态]</span>
                            <span>已加载 {filteredTools.length} 个功能模块。</span>
                        </div>
                    </div>

                    {/* Module Filter Tabs */}
                    <div className="flex flex-wrap gap-2 mb-10 border-b border-white/5 pb-4">
                        <button
                            onClick={() => setFilter('ALL')}
                            className={`px-4 py-1.5 text-[11px] font-bold tracking-widest uppercase transition-all rounded ${filter === 'ALL' ? 'bg-primary text-black' : 'text-gray-500 hover:text-white hover:bg-white/5'
                                }`}
                        >
                            [ {ToolCategoryLabels['ALL']} ]
                        </button>
                        {Object.values(ToolCategory).map((cat) => (
                            <button
                                key={cat}
                                onClick={() => setFilter(cat)}
                                className={`px-4 py-1.5 text-[11px] font-bold tracking-widest uppercase transition-all rounded ${filter === cat ? 'bg-primary text-black' : 'text-gray-500 hover:text-white hover:bg-white/5'
                                    }`}
                            >
                                {ToolCategoryLabels[cat]}
                            </button>
                        ))}
                    </div>

                    {/* Launcher Grid */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                        {filteredTools.map((tool) => (
                            <ToolCard
                                key={tool.id}
                                tool={tool}
                                onClick={(id) => setActiveToolId(id)}
                            />
                        ))}

                        {/* Empty State */}
                        {filteredTools.length === 0 && (
                            <div className="col-span-full py-20 text-center border border-dashed border-white/5 rounded-xl">
                                <p className="text-gray-600 text-[12px] tracking-widest uppercase">
                                    [ 无相关模块: 核心库正在同步中... ]
                                </p>
                            </div>
                        )}
                    </div>
                </main>

                {/* Tool Drawer Wrapper */}
                <ToolDrawer
                    isOpen={!!activeToolId}
                    onClose={() => setActiveToolId(null)}
                    title={activeTool?.name || ''}
                    width={activeTool?.width}
                >
                    {activeToolId && getToolComponent(activeToolId)}
                </ToolDrawer>

                <Footer />
            </div>
        </ConfigProvider>
    );
}

export default function ToolsPage() {
    return (
        <Suspense fallback={<div className="min-h-screen bg-background-dark text-white flex items-center justify-center font-mono">Loading modules...</div>}>
            <ToolsContent />
        </Suspense>
    );
}
