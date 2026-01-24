'use client';

import { useState, useCallback, useRef, useEffect } from 'react';
import { Button, message, ConfigProvider, theme } from 'antd';
import { CopyOutlined, DeleteOutlined, FormatPainterOutlined, ShrinkOutlined, CheckCircleOutlined, ThunderboltOutlined } from '@ant-design/icons';

// UI Utility: Copy to Clipboard
const copyToClipboard = (text: string, callback: () => void) => {
    navigator.clipboard.writeText(text).then(callback);
};

// Heuristic JSON Repair Logic
const repairJson = (str: string): string => {
    let repaired = str.trim();

    // 1. Remove comments (single line // and multi-line /* */)
    repaired = repaired.replace(/\/\/.*/g, '');
    repaired = repaired.replace(/\/\*[\s\S]*?\*\//g, '');

    // 2. Replace single quotes with double quotes
    repaired = repaired.replace(/'/g, '"');

    // 3. Quote unquoted keys
    repaired = repaired.replace(/([{,]\s*)([a-zA-Z0-9_$]+)(\s*:)/g, '$1"$2"$3');

    // 4. Handle unquoted values that look like variables or member expressions
    repaired = repaired.replace(/(:\s*)([a-zA-Z_$][a-zA-Z0-9_$.]*)(\s*[,}\]])/g, (match, p1, p2, p3) => {
        const lower = p2.toLowerCase();
        if (lower === 'true' || lower === 'false' || lower === 'null' || !isNaN(Number(p2))) {
            return match;
        }
        return `${p1}"${p2}"${p3}`;
    });

    // 5. Remove trailing commas
    repaired = repaired.replace(/,\s*([\]}])/g, '$1');

    return repaired;
};

export default function JsonParser() {
    const [input, setInput] = useState('');
    const [output, setOutput] = useState<string | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [isValidated, setIsValidated] = useState(false);
    const [copied, setCopied] = useState(false);

    const textareaRef = useRef<HTMLTextAreaElement>(null);
    const gutterRef = useRef<HTMLDivElement>(null);

    // Synchronize scrolling between gutter and textarea
    const handleScroll = (e: React.UIEvent<HTMLTextAreaElement>) => {
        if (gutterRef.current) {
            gutterRef.current.scrollTop = e.currentTarget.scrollTop;
        }
    };

    const handleFormat = useCallback(() => {
        if (!input.trim()) return;
        try {
            const obj = JSON.parse(input);
            setOutput(JSON.stringify(obj, null, 2));
            setError(null);
            setIsValidated(false);
        } catch (err: any) {
            setOutput(null);
            setError(err.message);
            setIsValidated(false);
        }
    }, [input]);

    const handleMinify = useCallback(() => {
        if (!input.trim()) return;
        try {
            const obj = JSON.parse(input);
            setOutput(JSON.stringify(obj));
            setError(null);
            setIsValidated(false);
        } catch (err: any) {
            setOutput(null);
            setError(err.message);
            setIsValidated(false);
        }
    }, [input]);

    const handleValidate = useCallback(() => {
        if (!input.trim()) return;
        try {
            JSON.parse(input);
            setIsValidated(true);
            setError(null);
            setOutput(null);
        } catch (err: any) {
            setError(err.message);
            setIsValidated(false);
            setOutput(null);
        }
    }, [input]);

    const handleSmartFix = useCallback(() => {
        if (!input.trim()) return;
        try {
            const repairedInput = repairJson(input);
            const obj = JSON.parse(repairedInput);
            setInput(JSON.stringify(obj, null, 2));
            setOutput(JSON.stringify(obj, null, 2));
            setError(null);
            setIsValidated(false);
            message.success({ content: '[ SUCCESS: 自动修复并格式化完成 ]', className: 'hacker-message' });
        } catch (err: any) {
            message.error({ content: '[ FAILED: 无法自动修复此结构 ]', className: 'hacker-message' });
        }
    }, [input]);

    const handleClear = () => {
        setInput('');
        setOutput(null);
        setError(null);
        setIsValidated(false);
    };

    const handleCopy = () => {
        if (!output) return;
        copyToClipboard(output, () => {
            setCopied(true);
            message.success({ content: '[ 数据已复制到剪贴板 ]', className: 'hacker-message' });
            setTimeout(() => setCopied(false), 2000);
        });
    };

    // Faux syntax highlighting for display
    const renderHighlightedJson = (json: string) => {
        return json.split('\n').map((line, i) => {
            const parts = line.split(/(": "|": |":)/);
            return (
                <div key={i} className="whitespace-pre min-h-[1.2rem]">
                    {parts.map((part, j) => {
                        if (part.startsWith('"') && (part.endsWith('": ') || part.endsWith('":'))) {
                            return <span key={j} className="text-primary">{part}</span>;
                        }
                        return <span key={j} className="text-white">{part}</span>;
                    })}
                </div>
            );
        });
    };

    // Calculate line numbers
    const lineNumbers = input.split('\n').map((_, i) => i + 1);

    return (
        <ConfigProvider
            theme={{
                algorithm: theme.darkAlgorithm,
                token: {
                    colorPrimary: '#00ff00',
                    colorBgBase: '#000000',
                    borderRadius: 4,
                }
            }}
        >
            <div className="flex flex-col h-full space-y-4 font-mono text-gray-300">
                {/* Action Bar */}
                <div className="flex flex-wrap gap-2 pb-4 border-b border-white/10">
                    <Button
                        type="primary"
                        ghost
                        icon={<CheckCircleOutlined />}
                        onClick={handleValidate}
                        className="hacker-btn-ghost"
                    >
                        校验 (VALIDATE)
                    </Button>
                    <Button
                        type="primary"
                        ghost
                        icon={<FormatPainterOutlined />}
                        onClick={handleFormat}
                        className="hacker-btn-ghost"
                    >
                        美化 (FORMAT)
                    </Button>
                    <Button
                        type="primary"
                        ghost
                        icon={<ShrinkOutlined />}
                        onClick={handleMinify}
                        className="hacker-btn-ghost"
                    >
                        压缩 (MINIFY)
                    </Button>
                    <Button
                        danger
                        ghost
                        icon={<DeleteOutlined />}
                        onClick={handleClear}
                        className="ml-auto"
                    >
                        清空 (CLEAR)
                    </Button>
                </div>

                {/* Editor Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 flex-1 min-h-[450px]">
                    {/* Input Area with Gutter */}
                    <div className="flex flex-col space-y-2">
                        <div className="flex items-center justify-between pl-1 h-8">
                            <div className="text-[10px] text-gray-500 uppercase tracking-widest flex items-center gap-2">
                                <span className="w-1.5 h-1.5 rounded-full bg-accent-blue animate-pulse"></span>
                                原始输入 (RAW_INPUT)
                            </div>
                        </div>
                        <div className="flex-1 flex bg-black/50 border border-white/10 rounded-lg overflow-hidden focus-within:border-primary/50 transition-colors">
                            {/* Gutter */}
                            <div
                                ref={gutterRef}
                                className="w-10 bg-white/5 border-r border-white/5 py-4 text-right pr-2 text-[10px] text-gray-600 select-none overflow-hidden"
                            >
                                {lineNumbers.map(n => (
                                    <div key={n} className="leading-5 h-5">{n}</div>
                                ))}
                            </div>
                            {/* Textarea */}
                            <textarea
                                ref={textareaRef}
                                value={input}
                                onChange={(e) => {
                                    setInput(e.target.value);
                                    setIsValidated(false);
                                }}
                                onScroll={handleScroll}
                                placeholder="在此粘贴原始 JSON 数据..."
                                className="flex-1 bg-transparent p-4 text-sm text-primary outline-none resize-none no-scrollbar font-mono placeholder:text-gray-800 leading-5"
                            />
                        </div>
                    </div>

                    {/* Result Area */}
                    <div className="flex flex-col space-y-2 relative">
                        <div className="flex items-center justify-between pl-1 h-8">
                            <div className="text-[10px] text-gray-500 uppercase tracking-widest flex items-center gap-2">
                                <span className={`w-1.5 h-1.5 rounded-full ${error ? 'bg-red-500' : (isValidated || output) ? 'bg-primary' : 'bg-gray-700'} animate-pulse`}></span>
                                {error ? '解析错误 (PARSER_ERROR)' : isValidated ? '校验通过 (VALID_JSON)' : '处理结果 (PARSED_RESULT)'}
                            </div>
                            {output && (
                                <Button
                                    size="small"
                                    type="primary"
                                    ghost
                                    icon={<CopyOutlined />}
                                    onClick={handleCopy}
                                    className="h-6 text-[10px] uppercase font-bold border-white/10 hover:border-primary/50 animate-in fade-in slide-in-from-right-2 duration-300"
                                >
                                    复制 (COPY)
                                </Button>
                            )}
                        </div>

                        <div className="flex-1 bg-black/80 border border-white/10 rounded-lg p-4 text-sm overflow-auto no-scrollbar font-mono relative">
                            {output && (
                                <div className="animate-in fade-in slide-in-from-right-2 duration-300">
                                    {renderHighlightedJson(output)}
                                </div>
                            )}

                            {isValidated && !output && (
                                <div className="h-full flex flex-col items-center justify-center animate-in fade-in zoom-in-95 duration-200">
                                    <div className="bg-primary/10 border border-primary/30 rounded-lg p-8 flex flex-col items-center space-y-4">
                                        <CheckCircleOutlined className="text-5xl text-primary" />
                                        <div className="text-primary font-bold tracking-widest text-lg">[ JSON_VALIDATED_SUCCESS ]</div>
                                        <div className="text-[10px] text-primary/60 uppercase">数据结构符合标准 JSON 规范</div>
                                    </div>
                                </div>
                            )}

                            {error && (
                                <div className="space-y-4 animate-in fade-in zoom-in-95 duration-200">
                                    <div className="bg-red-900/20 border border-red-500/30 rounded p-4 text-red-500 relative group/error">
                                        <div className="font-bold mb-2 uppercase text-xs tracking-tighter">[ 语法校验未通过 / SYNTAX_ERROR ]</div>
                                        <div className="text-xs leading-relaxed opacity-90 mb-4">
                                            {error}
                                        </div>
                                        <Button
                                            size="small"
                                            type="primary"
                                            danger
                                            icon={<ThunderboltOutlined />}
                                            onClick={handleSmartFix}
                                            className="font-bold text-[10px]"
                                        >
                                            智能纠错 (SMART_FIX)
                                        </Button>
                                    </div>
                                    <div className="text-[10px] text-red-900/40 leading-tight">
                                        at JSON.parse (&lt;anonymous&gt;)<br />
                                        at handleFormat (JsonParser.tsx:21:24)<br />
                                        at Object.onClick (JsonParser.tsx:85:41)
                                    </div>
                                </div>
                            )}

                            {!output && !error && !isValidated && (
                                <div className="h-full flex flex-col items-center justify-center text-gray-800 space-y-2">
                                    <div className="text-4xl opacity-20">[ ? ]</div>
                                    <div className="text-[10px] tracking-widest uppercase">等待数据输入...</div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </ConfigProvider>
    );
}
