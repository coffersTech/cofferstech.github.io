'use client';

import { usePathname } from 'next/navigation';
import Link from 'next/link';

const navItems = [
    { href: '/', label: 'index.md', icon: 'description' },
    { href: '/projects', label: 'projects.go', icon: 'code' },
    { href: '/notes', label: 'notes.py', icon: 'psychology' },
    { href: '/tools', label: 'tools.sh', icon: 'build' },
];

export default function Navbar() {
    const pathname = usePathname();

    // Helper to normalize paths for comparison (remove trailing slashes)
    const normalizePath = (p: string) => p.replace(/\/$/, '') || '/';

    return (
        <header className="sticky top-0 z-50 w-full border-b border-[#222] bg-background-dark/80 backdrop-blur-md">
            <div className="max-w-[1200px] mx-auto flex items-center px-6 h-14">
                {/* Left: Logo */}
                <div className="flex-1 flex items-center gap-2 text-primary font-bold">
                    <span className="material-symbols-outlined text-[20px]">terminal</span>
                    <span className="tracking-tight">饭桶日志</span>
                </div>
                {/* Center: Nav */}
                <nav className="flex h-full items-end gap-1 pt-2 overflow-x-auto no-scrollbar">
                    {navItems.map((item) => {
                        const normalizedCurrent = normalizePath(pathname);
                        const normalizedItem = normalizePath(item.href);

                        // Active if exact match OR if it's the root and we're on a sub-route (like /blog)
                        const isActive = normalizedCurrent === normalizedItem ||
                            (normalizedItem === '/' && normalizedCurrent.startsWith('/blog'));

                        return (
                            <Link
                                key={item.href}
                                href={item.href}
                                className={`flex items-center gap-2 px-4 py-2 border-t border-x rounded-t-lg text-sm transition-colors ${isActive
                                    ? 'bg-[#1a1a1a] border-[#333] text-white'
                                    : 'border-transparent hover:bg-[#111] text-[#666]'
                                    }`}
                            >
                                <span className={`material-symbols-outlined text-[16px] ${isActive ? 'text-primary' : ''}`}>
                                    {item.icon}
                                </span>
                                {item.label}
                            </Link>
                        );
                    })}
                </nav>
                {/* Right: Status & Icons */}
                <div className="flex-1 hidden md:flex items-center justify-end gap-4 text-[#444]">
                    <a
                        href="https://github.com/coffersTech"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="hover:text-white transition-colors"
                        title="GitHub"
                    >
                        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
                        </svg>
                    </a>
                    <div className="flex items-center gap-2 text-xs border border-[#222] px-3 py-1 rounded">
                        <span className="w-2 h-2 rounded-full bg-primary animate-pulse"></span>
                        系统就绪
                    </div>
                </div>
            </div>
        </header>
    );
}
