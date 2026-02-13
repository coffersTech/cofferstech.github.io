'use client';

import { useState, useEffect } from 'react';
import MatrixRain from "./MatrixRain";
import SystemLogModal from "./SystemLogModal";
import { Github } from 'lucide-react';

const FIRST_VISIT_KEY = 'rice-bucket-logs-visited';

export default function Hero() {
    const [isModalOpen, setIsModalOpen] = useState(false);

    // Auto-show modal on first visit
    useEffect(() => {
        // SSR safety check
        if (typeof window === 'undefined') return;

        const hasVisited = localStorage.getItem(FIRST_VISIT_KEY);
        if (!hasVisited) {
            // First visit - show modal after a short delay
            const timer = setTimeout(() => {
                setIsModalOpen(true);
                localStorage.setItem(FIRST_VISIT_KEY, 'true');
            }, 800);
            return () => clearTimeout(timer);
        }
    }, []);

    return (
        <section className="relative grid grid-cols-1 md:grid-cols-2 gap-12 items-center mb-20 min-h-[400px] border border-primary/50 rounded-lg p-8 bg-background-dark/50">
            {/* Matrix Rain Effect - Full Hero Background */}
            <div className="absolute inset-0 z-0 overflow-hidden rounded-lg">
                <MatrixRain />
            </div>

            <div className="flex flex-col gap-6 relative z-10">
                <div className="font-mono text-sm text-[#444] mb-2">
                    rice-bucket-logs:~ user$ ./initialize_landing_page
                </div>
                <div className="flex flex-col gap-2">
                    <h1 className="text-4xl md:text-6xl font-bold tracking-tighter">
                        饭桶日志 <span className="text-primary tracking-widest">&gt;</span>
                    </h1>
                    <div className="flex items-center gap-3">
                        <h2 className="text-primary text-xl md:text-2xl font-mono tracking-wider">饭量决定代码量</h2>
                        <div className="w-3 h-8 bg-primary cursor-blink"></div>
                    </div>
                </div>
                <p className="text-[#888] text-lg max-w-md leading-relaxed">
                    以产品思维，构建全栈系统 (Building Full-Stack Systems with Product Thinking)
                </p>
                <div className="flex gap-4 mt-4">
                    <button
                        onClick={() => setIsModalOpen(true)}
                        className="bg-primary text-black font-bold px-8 py-3 rounded-lg flex items-center gap-2 hover:bg-primary/90 transition-all"
                    >
                        <span className="material-symbols-outlined font-bold">visibility</span>
                        cat system.log
                    </button>
                    <a
                        href="https://github.com/coffersTech"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="border border-[#333] hover:border-primary/50 text-white font-bold px-8 py-3 rounded-lg transition-all flex items-center gap-2"
                    >
                        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
                        </svg>
                        curl github.com
                    </a>
                </div>
            </div>
            {/* 3D Wireframe Placeholder */}
            <div className="relative flex items-center justify-center h-full z-10">
                <div className="relative w-72 h-72 md:w-96 md:h-96 wireframe-animate" style={{ perspective: "1000px", transformStyle: "preserve-3d" }}>
                    {/* Outer sphere/geometric wireframe using SVG */}
                    <svg className="absolute inset-0 w-full h-full opacity-40" viewBox="0 0 100 100">
                        <circle cx="50" cy="50" fill="none" r="48" stroke="#00f0ff" strokeWidth="0.2"></circle>
                        <ellipse cx="50" cy="50" fill="none" rx="48" ry="15" stroke="#00f0ff" strokeWidth="0.2"></ellipse>
                        <ellipse cx="50" cy="50" fill="none" rx="15" ry="48" stroke="#00f0ff" strokeWidth="0.2"></ellipse>
                        <path d="M50 2 L50 98 M2 50 L98 50" stroke="#00f0ff" strokeWidth="0.2"></path>
                        <path d="M15 15 L85 85 M15 85 L85 15" stroke="#00f0ff" strokeWidth="0.2"></path>
                    </svg>
                    {/* Inner rice bowl wireframe placeholder */}
                    <div className="absolute inset-0 flex items-center justify-center">
                        <div className="w-40 h-40 border-b-2 border-primary rounded-full opacity-80 flex flex-col items-center justify-end pb-4">
                            <div className="w-32 h-1 bg-primary/40 rounded-full blur-[2px] mb-4"></div>
                            <span className="material-symbols-outlined text-primary text-6xl opacity-60">database</span>
                        </div>
                    </div>
                </div>
                <div className="absolute inset-0 bg-accent-blue/5 blur-[100px] rounded-full -z-10"></div>
            </div>

            {/* System Log Modal */}
            <SystemLogModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
        </section>
    );
}
