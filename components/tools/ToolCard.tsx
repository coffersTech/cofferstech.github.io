'use client';

import { motion } from 'framer-motion';
import { LucideIcon } from 'lucide-react';

interface ToolCardProps {
    id: string;
    name: string;
    description?: string;
    icon: LucideIcon;
    onClick: (id: string) => void;
}

export default function ToolCard({ id, name, icon: Icon, onClick }: ToolCardProps) {
    return (
        <motion.button
            whileHover={{ scale: 1.05, translateY: -5 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => onClick(id)}
            className="group relative aspect-square w-full rounded-xl bg-gray-900/40 border border-white/5 backdrop-blur-md flex flex-col items-center justify-center p-6 transition-all hover:border-primary/50 hover:shadow-[0_0_30px_rgba(0,255,0,0.1)] overflow-hidden"
        >
            {/* Background Grid Accent */}
            <div className="absolute inset-0 opacity-0 group-hover:opacity-10 transition-opacity pointer-events-none"
                style={{ backgroundImage: 'radial-gradient(circle, #00ff00 1px, transparent 1px)', backgroundSize: '15px 15px' }}>
            </div>

            <div className="relative z-10 flex flex-col items-center gap-4">
                <div className="p-4 rounded-2xl bg-black/50 border border-white/10 group-hover:border-primary/30 group-hover:text-primary transition-colors">
                    <Icon size={40} strokeWidth={1.5} className="text-gray-400 group-hover:text-primary transition-colors" />
                </div>
                <div className="text-center">
                    <h3 className="text-sm font-bold tracking-widest text-gray-300 group-hover:text-white transition-colors uppercase">
                        {name}
                    </h3>
                    <div className="mt-1 h-0.5 w-0 bg-primary group-hover:w-full transition-all mx-auto"></div>
                </div>
            </div>

            {/* Corner Decorative Elements */}
            <div className="absolute top-2 left-2 w-1.5 h-1.5 border-t border-l border-white/20 group-hover:border-primary transition-colors"></div>
            <div className="absolute top-2 right-2 w-1.5 h-1.5 border-t border-r border-white/20 group-hover:border-primary transition-colors"></div>
            <div className="absolute bottom-2 left-2 w-1.5 h-1.5 border-b border-l border-white/20 group-hover:border-primary transition-colors"></div>
            <div className="absolute bottom-2 right-2 w-1.5 h-1.5 border-b border-r border-white/20 group-hover:border-primary transition-colors"></div>
        </motion.button>
    );
}
