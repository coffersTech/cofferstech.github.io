import { motion } from 'framer-motion';
import * as LucideIcons from 'lucide-react';
import { ToolItem } from '@/config/tools';
import { message } from 'antd';

interface ToolCardProps {
    tool: ToolItem;
    onClick: (id: string) => void;
}

export default function ToolCard({ tool, onClick }: ToolCardProps) {
    const { id, name, description, icon, status } = tool;
    const isDev = status === 'dev';

    // Get the icon component dynamically
    const IconComponent = (LucideIcons as any)[icon] || LucideIcons.HelpCircle;

    const handleClick = () => {
        if (isDev) {
            message.info({
                content: '[ 模块构建中: 请稍后再试 ]',
                className: 'hacker-message',
                style: { marginTop: '10vh' }
            });
            return;
        }
        onClick(id);
    };

    return (
        <motion.div
            whileHover={!isDev ? { scale: 1.02, translateY: -5 } : {}}
            whileTap={!isDev ? { scale: 0.98 } : {}}
            onClick={handleClick}
            className={`group relative aspect-square bg-black border ${isDev ? 'border-white/5 opacity-40 cursor-not-allowed' : 'border-white/10 cursor-pointer hover:border-primary/50'
                } rounded-xl p-6 flex flex-col items-center justify-center transition-all duration-300 shadow-[0_0_0px_rgba(0,0,0,0)] hover:shadow-[0_0_20px_rgba(0,255,0,0.1)]`}
        >
            {/* Status Indicator */}
            {isDev && (
                <div className="absolute top-3 right-3 text-gray-700">
                    <LucideIcons.Lock size={14} />
                </div>
            )}

            <div className={`p-4 rounded-full bg-white/5 mb-4 group-hover:bg-primary/10 transition-colors ${!isDev && 'group-hover:text-primary'}`}>
                <IconComponent size={32} strokeWidth={1.5} />
            </div>

            <h3 className={`text-sm font-bold tracking-widest uppercase mb-2 ${!isDev ? 'group-hover:text-primary' : 'text-gray-600'}`}>
                {name}
            </h3>

            <p className="text-[10px] text-gray-500 text-center leading-relaxed px-2">
                {description}
            </p>

            {/* Terminal Prompt Indicator */}
            {!isDev && (
                <div className="absolute bottom-4 opacity-0 group-hover:opacity-100 transition-opacity">
                    <span className="text-primary text-[10px] animate-pulse">_ EXEC_MODULE</span>
                </div>
            )}
        </motion.div>
    );
}
