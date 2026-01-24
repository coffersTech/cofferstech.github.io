'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';
import { useEffect } from 'react';

interface ToolDrawerProps {
    isOpen: boolean;
    onClose: () => void;
    title: string;
    children: React.ReactNode;
    width?: string; // Optional width prop
}

export default function ToolDrawer({ isOpen, onClose, title, children, width = 'max-w-3xl' }: ToolDrawerProps) {
    // Prevent scrolling behind the drawer
    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'unset';
        }
        return () => {
            document.body.style.overflow = 'unset';
        };
    }, [isOpen]);

    return (
        <AnimatePresence>
            {isOpen && (
                <div className="fixed inset-0 z-[100] flex justify-end">
                    {/* Backdrop */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                        className="absolute inset-0 bg-black/60 backdrop-blur-sm cursor-pointer"
                    />

                    {/* Drawer Side-Shelf */}
                    <motion.div
                        initial={{ x: '100%' }}
                        animate={{ x: 0 }}
                        exit={{ x: '100%' }}
                        transition={{ type: 'spring', damping: 25, stiffness: 200 }}
                        className={`relative w-full ${width} h-full bg-[#0a0a0a] border-l border-primary/30 shadow-[-10px_0_50px_rgba(0,0,0,0.5)] overflow-hidden font-mono flex flex-col`}
                    >
                        {/* CRT Scanline Effect */}
                        <div className="absolute inset-0 pointer-events-none opacity-[0.02] bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.25)_50%),linear-gradient(90deg,rgba(255,0,0,0.06),rgba(0,255,0,0.02),rgba(0,0,255,0.06))] z-50 bg-[length:100%_2px,3px_100%]"></div>

                        {/* Side Header */}
                        <div className="flex items-center justify-between px-6 py-4 border-b border-primary/20 bg-[#0d0d0d]">
                            <div className="flex items-center gap-4">
                                <div className="flex gap-1.5">
                                    <div className="w-2.5 h-2.5 rounded-full bg-[#ff5f56]"></div>
                                    <div className="w-2.5 h-2.5 rounded-full bg-[#ffbd2e]"></div>
                                    <div className="w-2.5 h-2.5 rounded-full bg-[#27c93f]"></div>
                                </div>
                                <span className="text-[12px] text-primary font-bold tracking-widest uppercase">
                                    [ RUNNING: {title} ]
                                </span>
                            </div>
                            <button
                                onClick={onClose}
                                className="group p-2 hover:bg-red-500/20 rounded-full transition-colors flex items-center justify-center"
                            >
                                <X size={20} className="text-gray-500 group-hover:text-red-500 transition-colors" />
                            </button>
                        </div>

                        {/* Body - Main Content Area */}
                        <div className="flex-1 p-6 relative z-10 overflow-y-auto no-scrollbar">
                            <div className={`${width} mx-auto py-8`}>
                                {children}
                            </div>
                        </div>

                        {/* Side Branding / Footer */}
                        <div className="px-6 py-4 border-t border-primary/10 bg-[#070707] flex justify-between items-center opacity-50">
                            <span className="text-[9px] text-gray-600 uppercase tracking-tighter">System_Shelf_v1.0.4</span>
                            <div className="flex gap-0.5">
                                {[...Array(5)].map((_, i) => (
                                    <div key={i} className="w-4 h-1 bg-primary/20"></div>
                                ))}
                            </div>
                        </div>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );
}
