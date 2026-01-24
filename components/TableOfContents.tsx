'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';

interface Heading {
    level: number;
    text: string;
    id: string;
}

interface TableOfContentsProps {
    headings: Heading[];
}

export default function TableOfContents({ headings }: TableOfContentsProps) {
    const [activeId, setActiveId] = useState<string>('');

    // Optional: Scroll spy implementation
    useEffect(() => {
        if (headings.length === 0) return;

        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                        setActiveId(entry.target.id);
                    }
                });
            },
            { rootMargin: '-100px 0px -66% 0px' }
        );

        headings.forEach((heading) => {
            const element = document.getElementById(heading.id);
            if (element) {
                observer.observe(element);
            }
        });

        return () => {
            headings.forEach((heading) => {
                const element = document.getElementById(heading.id);
                if (element) {
                    observer.unobserve(element);
                }
            });
        };
    }, [headings]);

    if (headings.length === 0) {
        return (
            <div className="text-xs text-[#666] italic pl-2">
                No sections
            </div>
        );
    }

    return (
        <nav className="flex flex-col gap-2 pl-2 border-l border-[#333]">
            {headings.map((heading) => (
                <Link
                    key={heading.id}
                    href={`#${heading.id}`}
                    onClick={(e) => {
                        e.preventDefault();
                        document.querySelector(`#${heading.id}`)?.scrollIntoView({
                            behavior: 'smooth'
                        });
                        setActiveId(heading.id);
                    }}
                    className={`flex items-center gap-2 text-sm transition-colors group ${activeId === heading.id ? 'text-primary font-bold' : 'text-[#888] hover:text-primary'
                        }`}
                    style={{
                        paddingLeft: heading.level === 3 ? '16px' : '0px'
                    }}
                >
                    <span
                        className={`transition-opacity ${activeId === heading.id ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'
                            }`}
                    >
                        &gt;
                    </span>
                    {heading.text}
                </Link>
            ))}
        </nav>
    );
}
