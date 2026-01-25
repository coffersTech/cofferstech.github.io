'use client';

import { useState } from 'react';
import { ArrowDown, ArrowUp, Trash2, Copy, ClipboardPaste } from 'lucide-react';

export default function Base64Converter() {
    const [plainText, setPlainText] = useState('');
    const [base64Text, setBase64Text] = useState('');
    const [error, setError] = useState<string | null>(null);
    const [copiedField, setCopiedField] = useState<'plain' | 'base64' | null>(null);

    // UTF-8 safe encoding
    const handleEncode = () => {
        try {
            setError(null);
            if (!plainText) {
                setBase64Text('');
                return;
            }
            const encoded = window.btoa(unescape(encodeURIComponent(plainText)));
            setBase64Text(encoded);
        } catch (err) {
            setError('编码失败');
        }
    };

    // UTF-8 safe decoding
    const handleDecode = () => {
        try {
            setError(null);
            if (!base64Text) {
                setPlainText('');
                return;
            }
            const decoded = decodeURIComponent(escape(window.atob(base64Text.trim())));
            setPlainText(decoded);
        } catch (err) {
            setError('非法 Base64 字符串');
        }
    };

    const handleClear = () => {
        setPlainText('');
        setBase64Text('');
        setError(null);
    };

    const handleCopy = (text: string, field: 'plain' | 'base64') => {
        if (!text) return;
        navigator.clipboard.writeText(text).then(() => {
            setCopiedField(field);
            setTimeout(() => setCopiedField(null), 2000);
        });
    };

    const handlePaste = async (field: 'plain' | 'base64') => {
        try {
            const text = await navigator.clipboard.readText();
            if (field === 'plain') {
                setPlainText(text);
            } else {
                setBase64Text(text);
            }
        } catch (err) {
            console.error('Failed to read clipboard');
        }
    };

    return (
        <div className="space-y-6 font-mono text-gray-300">
            {/* Plain Text Area */}
            <div className="space-y-2 relative">
                <div className="flex justify-between items-center px-1">
                    <label className="text-xs uppercase tracking-widest text-primary/70 font-bold">
                        普通文本 (UTF-8)
                    </label>
                    <div className="flex gap-2">
                        <button
                            onClick={() => handlePaste('plain')}
                            className="p-1 px-2 text-[10px] bg-white/5 hover:bg-white/10 border border-white/10 rounded flex items-center gap-1 transition-colors"
                            title="粘贴"
                        >
                            <ClipboardPaste size={12} />
                            粘贴
                        </button>
                        <button
                            onClick={() => handleCopy(plainText, 'plain')}
                            className={`p-1 px-2 text-[10px] border rounded flex items-center gap-1 transition-colors ${copiedField === 'plain'
                                ? 'bg-primary text-black border-primary font-bold'
                                : 'bg-white/5 hover:bg-white/10 border-white/10'
                                }`}
                            title="复制"
                        >
                            <Copy size={12} />
                            {copiedField === 'plain' ? '已复制' : '复制'}
                        </button>
                    </div>
                </div>
                <textarea
                    value={plainText}
                    onChange={(e) => setPlainText(e.target.value)}
                    placeholder="在这里输入普通文本..."
                    className="w-full h-32 bg-black border border-white/10 rounded p-3 text-primary text-sm focus:border-primary/50 focus:ring-1 focus:ring-primary/30 outline-none transition-all resize-none shadow-[inset_0_2px_10px_rgba(0,0,0,0.8)]"
                />
            </div>

            {/* Controls */}
            <div className="flex flex-wrap items-center justify-center gap-4 py-2">
                <button
                    onClick={handleEncode}
                    className="flex items-center gap-2 bg-primary/10 hover:bg-primary/20 text-primary border border-primary/30 px-6 py-2 rounded font-bold text-sm transition-all hover:scale-105 active:scale-95"
                >
                    编码 <ArrowDown size={16} />
                </button>
                <button
                    onClick={handleClear}
                    className="flex items-center gap-2 bg-red-500/10 hover:bg-red-500/20 text-red-500 border border-red-500/30 px-6 py-2 rounded font-bold text-sm transition-all hover:scale-105 active:scale-95"
                >
                    清空 <Trash2 size={16} />
                </button>
                <button
                    onClick={handleDecode}
                    className="flex items-center gap-2 bg-primary/10 hover:bg-primary/20 text-primary border border-primary/30 px-6 py-2 rounded font-bold text-sm transition-all hover:scale-105 active:scale-95"
                >
                    解码 <ArrowUp size={16} />
                </button>
            </div>

            {/* Base64 Text Area */}
            <div className="space-y-2 relative">
                <div className="flex justify-between items-center px-1">
                    <label className="text-xs uppercase tracking-widest text-primary/70 font-bold">
                        Base64 字符串
                    </label>
                    <div className="flex gap-2">
                        <button
                            onClick={() => handlePaste('base64')}
                            className="p-1 px-2 text-[10px] bg-white/5 hover:bg-white/10 border border-white/10 rounded flex items-center gap-1 transition-colors"
                            title="粘贴"
                        >
                            <ClipboardPaste size={12} />
                            粘贴
                        </button>
                        <button
                            onClick={() => handleCopy(base64Text, 'base64')}
                            className={`p-1 px-2 text-[10px] border rounded flex items-center gap-1 transition-colors ${copiedField === 'base64'
                                ? 'bg-primary text-black border-primary font-bold'
                                : 'bg-white/5 hover:bg-white/10 border-white/10'
                                }`}
                            title="复制"
                        >
                            <Copy size={12} />
                            {copiedField === 'base64' ? '已复制' : '复制'}
                        </button>
                    </div>
                </div>
                <textarea
                    value={base64Text}
                    onChange={(e) => setBase64Text(e.target.value)}
                    placeholder="在这里输入 Base64 字符串..."
                    className={`w-full h-32 bg-black border rounded p-3 text-primary text-sm focus:ring-1 focus:ring-primary/30 outline-none transition-all resize-none shadow-[inset_0_2px_10px_rgba(0,0,0,0.8)] ${error ? 'border-red-500' : 'border-white/10 focus:border-primary/50'
                        }`}
                />
                {error && (
                    <div className="text-red-500 text-[10px] absolute -bottom-5 left-1 font-bold animate-pulse">
                        [ ERROR: {error} ]
                    </div>
                )}
            </div>
        </div>
    );
}
