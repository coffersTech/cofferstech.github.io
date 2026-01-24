'use client';

import { useEffect, useState, useRef } from 'react';
import Link from 'next/link';
import TableOfContents from './TableOfContents';

interface Heading {
    level: number;
    text: string;
    id: string;
}

interface PostMetadata {
    title: string;
    date: string;
    slug: string;
    tags?: string[];
    [key: string]: any;
}

interface ArticleLayoutProps {
    children: React.ReactNode;
    headings: Heading[];
    metadata: PostMetadata;
}

export default function ArticleLayout({ children, headings, metadata }: ArticleLayoutProps) {
    const [readingProgress, setReadingProgress] = useState(0);
    const [fontSizeLevel, setFontSizeLevel] = useState(2); // 0: sm, 1: base, 2: lg, 3: xl, 4: 2xl
    const mainContentRef = useRef<HTMLElement>(null);

    const fontSizes = [
        'prose-sm',
        'prose-base',
        'prose-lg',
        'prose-xl',
        'prose-2xl'
    ];

    const currentFontSizeClass = fontSizes[fontSizeLevel];

    useEffect(() => {
        const handleScroll = () => {
            const totalHeight = document.documentElement.scrollHeight - window.innerHeight;
            const progress = (window.scrollY / totalHeight) * 100;
            setReadingProgress(Math.min(100, Math.max(0, progress)));
        };

        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const increaseFontSize = () => {
        setFontSizeLevel((prev) => Math.min(prev + 1, fontSizes.length - 1));
    };

    const decreaseFontSize = () => {
        setFontSizeLevel((prev) => Math.max(prev - 1, 0));
    };

    return (
        <div className="bg-background-dark font-mono text-terminal-grey min-h-screen selection:bg-primary selection:text-background-dark">
            <div className="scanline"></div>
            <div className="crt"></div>

            {/* Progress Bar (Fixed Top) */}
            <div className="fixed top-0 left-0 w-full h-[2px] z-50 bg-background-dark">
                <div
                    className="h-full bg-primary shadow-[0_0_10px_#00FF00] transition-all duration-100 ease-out"
                    style={{ width: `${readingProgress}%` }}
                ></div>
            </div>

            <div className="flex min-h-screen relative z-10">
                {/* Sidebar Navigation */}
                <aside className="hidden lg:flex flex-col w-80 h-screen sticky top-0 p-6 border-r border-[#333] bg-[#050505]/95 backdrop-blur-sm">
                    <div className="flex items-center gap-3 mb-10 group cursor-pointer">
                        <Link href="/" className="text-primary hover:text-white transition-colors">
                            <span className="text-4xl font-bold">&gt;_</span>
                        </Link>
                        <h2 className="font-bold text-xl tracking-tight text-white group-hover:text-primary transition-colors">饭桶日志</h2>
                    </div>

                    <div className="flex flex-col gap-10 overflow-y-auto custom-scrollbar flex-1 pb-20">
                        <div>
                            <h3 className="text-xs text-primary mb-4 font-bold border-b border-[#333] pb-2">&gt; TABLE_OF_CONTENTS</h3>
                            <TableOfContents headings={headings} />
                        </div>
                        <div>
                            <h3 className="text-xs text-primary mb-4 font-bold border-b border-[#333] pb-2">&gt; META_INFO</h3>
                            <div className="flex flex-wrap gap-2">
                                {metadata.tags && metadata.tags.map((tag: string) => (
                                    <div key={tag} className="flex items-center px-2 py-1 border border-primary text-primary bg-primary/10 text-[10px]">
                                        #{tag}
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    <div className="mt-auto pt-4 border-t border-[#333]">
                        <Link href="/" className="w-full flex items-center justify-between px-4 py-3 border border-[#333] bg-background-dark hover:border-primary group transition-all">
                            <div className="flex items-center gap-2 text-sm text-[#888] group-hover:text-primary">
                                <span className="cursor-blink">|</span> user@logs:~$
                            </div>
                            <span className="text-xs text-primary font-bold">cd ..</span>
                        </Link>
                    </div>
                </aside>

                {/* Main Content Area */}
                <main className="flex-1 flex flex-col items-center" ref={mainContentRef}>
                    <article className="max-w-[800px] w-full px-6 py-12 lg:py-20">
                        {/* Article Heading */}
                        <div className="flex flex-col gap-6 mb-16 border-b border-[#333] pb-12">
                            <h1 className="text-4xl lg:text-5xl font-bold leading-tight text-primary text-glow font-display">
                                {metadata.title}
                            </h1>
                            <div className="flex flex-wrap items-center gap-8 text-xs font-mono text-[#666]">
                                <div className="flex items-center gap-2">
                                    <span className="material-symbols-outlined text-sm text-primary">calendar_today</span>
                                    {metadata.date}
                                </div>
                                <div className="flex items-center gap-2">
                                    <span className="material-symbols-outlined text-sm text-primary">schedule</span>
                                    12 MIN_READ
                                </div>
                                <div className="flex items-center gap-2">
                                    <span className="material-symbols-outlined text-sm text-primary">visibility</span>
                                    1.2k VIEWS
                                </div>
                            </div>
                        </div>

                        {/* Markdown Content */}
                        <div className={`space-y-8 leading-loose text-[#E0E0E0] prose prose-invert max-w-none 
                            ${currentFontSizeClass}
                            prose-headings:font-bold prose-headings:text-primary prose-headings:text-glow prose-headings:font-display
                            prose-h2:border-b prose-h2:border-[#333] prose-h2:pb-2 prose-h2:mt-12
                            prose-p:text-[#E0E0E0] prose-p:font-mono
                            prose-a:text-primary prose-a:no-underline prose-a:border-b prose-a:border-primary/50 hover:prose-a:border-primary
                            prose-blockquote:border-l-2 prose-blockquote:border-primary prose-blockquote:bg-[#111] prose-blockquote:px-6 prose-blockquote:py-4 prose-blockquote:text-[#888] prose-blockquote:not-italic
                            prose-code:text-primary prose-code:bg-[#111] prose-code:px-2 prose-code:py-1 prose-code:before:content-none prose-code:after:content-none prose-code:font-bold
                            prose-pre:bg-[#050505] prose-pre:border prose-pre:border-[#333]`}>
                            {children}
                        </div>

                        {/* Footer Section in Article */}
                        <div className="pt-12 mt-20 border-t border-[#333] flex flex-col items-center gap-6">
                            <div className="text-[#444] font-mono text-xs uppercase tracking-[0.2em]">&lt; END_OF_LOG /&gt;</div>
                            <div className="flex gap-4">
                                <button className="flex items-center gap-2 px-6 py-2 border border-[#333] hover:border-primary hover:bg-primary/10 transition-all group">
                                    <span className="material-symbols-outlined text-[#666] group-hover:text-primary text-sm">share</span>
                                    <span className="text-xs font-bold text-[#666] group-hover:text-primary">NO_SHARE</span>
                                </button>
                                <button className="flex items-center gap-2 px-6 py-2 border border-[#333] hover:border-primary hover:bg-primary/10 transition-all group">
                                    <span className="material-symbols-outlined text-[#666] group-hover:text-primary text-sm">bookmark</span>
                                    <span className="text-xs font-bold text-[#666] group-hover:text-primary">SAVE_LOG</span>
                                </button>
                            </div>
                        </div>

                    </article>
                </main>

                {/* Reading Controls (Fixed Right) */}
                <aside className="hidden xl:flex flex-col w-24 h-screen sticky top-0 py-12 items-center border-l border-[#333] bg-[#050505]/95">
                    <div className="flex flex-col gap-6 mb-auto">
                        <button
                            onClick={increaseFontSize}
                            className="size-10 flex items-center justify-center border border-[#333] hover:border-primary hover:text-white text-[#666] transition-all"
                            title="Increase Font Size"
                        >
                            T+
                        </button>
                        <button
                            onClick={decreaseFontSize}
                            className="size-10 flex items-center justify-center border border-[#333] hover:border-primary hover:text-white text-[#666] transition-all"
                            title="Decrease Font Size"
                        >
                            T-
                        </button>
                    </div>

                    <div className="h-[40vh] w-[2px] bg-[#222] relative rounded-full overflow-hidden">
                        <div
                            className="absolute top-0 w-full bg-primary shadow-[0_0_8px_#00FF00] transition-all duration-100 ease-out"
                            style={{ height: `${readingProgress}%` }}
                        ></div>
                    </div>
                    <div className="font-mono text-[10px] text-primary rotate-90 whitespace-nowrap mt-6 font-bold">
                        {Math.round(readingProgress)}%
                    </div>
                </aside>
            </div>
        </div>
    );
}
