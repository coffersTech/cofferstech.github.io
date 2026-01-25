'use client';

import { useState, useEffect, useRef } from 'react';
import katex from 'katex';
import 'katex/dist/katex.min.css';
import { Sigma, FileText, Layout, Eraser, Layers } from 'lucide-react';

export default function MathRender() {
    const [input, setInput] = useState('\\text{Attention}(Q, K, V) = \\text{softmax}\\left(\\frac{QK^T}{\\sqrt{d_k}}\\right)V');
    const [isPaperMode, setIsPaperMode] = useState(false);
    const containerRef = useRef<HTMLDivElement>(null);
    const textareaRef = useRef<HTMLTextAreaElement>(null);

    useEffect(() => {
        if (containerRef.current) {
            katex.render(input, containerRef.current, {
                throwOnError: false,
                displayMode: true,
                trust: true,
                strict: false
            });
        }
    }, [input]);

    const clearInput = () => setInput('');

    const insertSymbol = (symbol: string) => {
        const textarea = textareaRef.current;
        if (!textarea) return;

        const start = textarea.selectionStart;
        const end = textarea.selectionEnd;
        const text = textarea.value;
        const before = text.substring(0, start);
        const after = text.substring(end, text.length);

        const newText = before + symbol + after;
        setInput(newText);

        // Focus and move cursor back after state update
        setTimeout(() => {
            textarea.focus();
            const newPos = start + symbol.length;
            textarea.setSelectionRange(newPos, newPos);
        }, 0);
    };

    const shortcuts = [
        { label: '分式', cmd: '\\frac{}{}', display: '\\frac{a}{b}' },
        { label: '根号', cmd: '\\sqrt{}', display: '\\sqrt{x}' },
        { label: '累加', cmd: '\\sum_{i=1}^{n} ', display: '\\sum' },
        { label: '积分', cmd: '\\int ', display: '\\int' },
        { label: 'α', cmd: '\\alpha ', display: 'α' },
        { label: 'β', cmd: '\\beta ', display: 'β' },
        { label: 'λ', cmd: '\\lambda ', display: 'λ' },
        { label: 'π', cmd: '\\pi ', display: 'π' },
        { label: '∞', cmd: '\\infty ', display: '∞' },
    ];

    return (
        <div className="flex flex-col h-full space-y-4">
            {/* Toolbar */}
            <div className="flex items-center justify-between px-2 py-1 bg-[#0d0d0d] rounded-lg border border-white/5">
                <div className="flex items-center gap-4">
                    <div className="flex items-center gap-2 text-primary/70 text-[14px] font-bold uppercase tracking-widest">
                        <Sigma size={14} />
                        <span>LaTeX 公式编辑器</span>
                    </div>
                </div>
                <div className="flex items-center gap-2">
                    <button
                        onClick={() => setIsPaperMode(!isPaperMode)}
                        className={`flex items-center gap-2 px-3 py-1.5 rounded-md text-[14px] font-bold uppercase transition-all ${isPaperMode
                            ? 'bg-white text-black'
                            : 'bg-white/5 text-gray-400 hover:bg-white/10'
                            }`}
                    >
                        <Layers size={14} />
                        {isPaperMode ? '纸张模式' : '终端模式'}
                    </button>
                    <button
                        onClick={clearInput}
                        className="p-1.5 text-gray-500 hover:text-red-500 transition-colors"
                        title="清空"
                    >
                        <Eraser size={16} />
                    </button>
                </div>
            </div>

            {/* Split View */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 flex-1 min-h-[400px]">
                {/* Left: Input */}
                <div className="flex flex-col space-y-2">
                    <div className="flex items-center gap-2 text-[14px] text-gray-500 uppercase font-bold tracking-widest pl-1">
                        <FileText size={14} />
                        <span>代码输入 (Input)</span>
                    </div>
                    <div className="flex-1 flex flex-col relative group">
                        <textarea
                            ref={textareaRef}
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            className="flex-1 w-full bg-black border border-white/10 rounded-t-lg p-4 font-mono text-sm text-primary focus:border-primary/40 focus:ring-1 focus:ring-primary/20 outline-none transition-all resize-none shadow-[inset_0_2px_10px_rgba(0,0,0,0.5)]"
                            placeholder="输入 LaTeX 代码..."
                        />
                        {/* Shortcuts Bar */}
                        <div className="flex flex-wrap gap-1 p-2 bg-[#0a0a0a] border-x border-b border-white/10 rounded-b-lg">
                            {shortcuts.map((s) => (
                                <button
                                    key={s.label}
                                    onClick={() => insertSymbol(s.cmd)}
                                    className="px-2 py-1 bg-white/5 hover:bg-white/10 border border-white/5 rounded text-[14px] text-gray-400 font-mono transition-colors"
                                    title={s.label}
                                >
                                    {s.display}
                                </button>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Right: Preview */}
                <div className="flex flex-col space-y-2">
                    <div className="flex items-center gap-2 text-[14px] text-gray-500 uppercase font-bold tracking-widest pl-1">
                        <Layout size={14} />
                        <span>渲染预览 (Render)</span>
                    </div>
                    <div
                        className={`flex-1 flex items-center justify-center rounded-lg border border-white/10 overflow-auto p-8 transition-colors duration-500 ${isPaperMode ? 'bg-white text-black' : 'bg-gray-900 text-white'
                            }`}
                    >
                        <div
                            ref={containerRef}
                            className="max-w-full scale-125 md:scale-150 transform transition-transform"
                        />
                    </div>
                </div>
            </div>

            {/* Hint */}
            <div className="bg-primary/5 border border-primary/20 rounded-lg p-3 text-[12px] text-primary/60 leading-relaxed text-center">
                支持标准 LaTeX 算法公式。错误语法将以红色高亮显示。使用快捷键加速输入。
            </div>
        </div>
    );
}
