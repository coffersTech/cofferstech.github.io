'use client';

import { useState } from 'react';
import { Clock, FileJson, Utensils } from 'lucide-react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import ToolCard from '@/components/tools/ToolCard';
import ToolDrawer from '@/components/tools/ToolDrawer';
import TimestampConverter from '@/components/tools/apps/TimestampConverter';

const TOOLS = [
    {
        id: 'timestamp',
        name: '时间戳转换',
        icon: Clock,
        component: TimestampConverter,
    },
    {
        id: 'json',
        name: 'JSON 格式化',
        icon: FileJson,
        component: () => (
            <div className="py-12 text-center space-y-4 font-mono">
                <FileJson size={48} className="mx-auto text-gray-700 animate-pulse" />
                <p className="text-gray-500 text-sm tracking-widest uppercase">[ 模块离线: 正在开发中 ]</p>
                <div className="text-[10px] text-gray-600">预计更新日期: 待定</div>
            </div>
        ),
    },
    {
        id: 'lunch',
        name: '随机午餐',
        icon: Utensils,
        component: () => (
            <div className="py-12 text-center space-y-4 font-mono">
                <Utensils size={48} className="mx-auto text-gray-700 animate-pulse" />
                <p className="text-gray-500 text-sm tracking-widest uppercase">[ 模块离线: 正在开发中 ]</p>
                <div className="text-[10px] text-gray-600">预计更新日期: 待定</div>
            </div>
        ),
    },
];

export default function ToolsPage() {
    const [activeToolId, setActiveToolId] = useState<string | null>(null);

    const activeTool = TOOLS.find(t => t.id === activeToolId);

    return (
        <div className="min-h-screen bg-background-dark text-white font-mono relative overflow-hidden">
            <div className="pixel-grid fixed inset-0 pointer-events-none opacity-30"></div>
            <div className="scanline"></div>

            <Navbar />

            <main className="max-w-[1200px] mx-auto px-6 py-12 relative z-10">
                {/* Terminal Header */}
                <div className="mb-12 space-y-4">
                    <div className="inline-flex flex-wrap items-center gap-2 bg-black/50 border border-white/10 px-4 py-2 rounded">
                        <span className="text-primary font-bold">root@rice-bucket</span>
                        <span className="text-gray-500">:</span>
                        <span className="text-accent-blue font-bold">~/tools</span>
                        <span className="text-white">$</span>
                        <span className="text-white">ls -la</span>
                        <span className="w-2 h-4 bg-primary animate-pulse ml-1"></span>
                    </div>
                    <div className="flex items-center gap-3 text-[11px] md:text-[12px] text-gray-500 font-bold ml-1 uppercase">
                        <span className="text-primary">[状态]</span>
                        <span>查找到 {TOOLS.length} 个功能模块。系统运行正常。</span>
                    </div>
                </div>

                {/* Launcher Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                    {TOOLS.map((tool) => (
                        <ToolCard
                            key={tool.id}
                            id={tool.id}
                            name={tool.name}
                            icon={tool.icon}
                            onClick={(id) => setActiveToolId(id)}
                        />
                    ))}

                    {/* Add More Tool Placeholder */}
                    <div className="aspect-square border border-dashed border-white/5 rounded-xl flex flex-col items-center justify-center text-gray-800 hover:border-white/10 transition-colors group cursor-not-allowed">
                        <div className="w-10 h-10 border border-current rounded-full flex items-center justify-center mb-3">
                            <span className="material-symbols-outlined text-sm">add</span>
                        </div>
                        <span className="text-[10px] tracking-widest font-bold uppercase group-hover:text-gray-500 transition-colors">待开发...</span>
                    </div>
                </div>
            </main>

            {/* Tool Drawer Wrapper */}
            <ToolDrawer
                isOpen={!!activeToolId}
                onClose={() => setActiveToolId(null)}
                title={activeTool?.name || ''}
            >
                {activeTool && <activeTool.component />}
            </ToolDrawer>

            <Footer />
        </div>
    );
}
