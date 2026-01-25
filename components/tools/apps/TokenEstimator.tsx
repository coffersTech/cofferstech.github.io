'use client';

import { useState, useEffect, useMemo } from 'react';
import { encodingForModel, TiktokenModel } from 'js-tiktoken';
import { Bot, Trash2, BrainCircuit, Wallet, AlertTriangle } from 'lucide-react';

interface ModelConfig {
    id: string; // Changed from TiktokenModel to support more models
    tokenizerModel?: TiktokenModel; // Fallback tokenizer for non-OpenAI models
    label: string;
    inputPrice: number; // Price per 1M tokens
    contextWindow: number;
}

const MODELS: ModelConfig[] = [
    { id: 'gpt-4o', label: 'GPT-4o', inputPrice: 5.0, contextWindow: 128000 },
    { id: 'gpt-4o-mini', label: 'GPT-4o mini', inputPrice: 0.15, contextWindow: 128000 },
    { id: 'o1', label: 'o1', inputPrice: 15.0, contextWindow: 128000 },
    { id: 'o1-mini', label: 'o1-mini', inputPrice: 3.0, contextWindow: 128000 },
    { id: 'deepseek-v3', tokenizerModel: 'gpt-4o', label: 'DeepSeek V3', inputPrice: 0.14, contextWindow: 64000 },
    { id: 'gemini-1.5-pro', tokenizerModel: 'gpt-4o', label: 'Gemini 1.5 Pro', inputPrice: 1.25, contextWindow: 2000000 },
    { id: 'gemini-1.5-flash', tokenizerModel: 'gpt-4o', label: 'Gemini 1.5 Flash', inputPrice: 0.075, contextWindow: 1000000 },
    { id: 'qwen-2.5-72b', tokenizerModel: 'gpt-4o', label: 'Qwen 2.5 72B', inputPrice: 0.5, contextWindow: 128000 },
    { id: 'grok-2', tokenizerModel: 'gpt-4o', label: 'Grok 2', inputPrice: 2.0, contextWindow: 128000 },
    { id: 'gpt-4-turbo', label: 'GPT-4 Turbo', inputPrice: 10.0, contextWindow: 128000 },
    { id: 'gpt-3.5-turbo', label: 'GPT-3.5 Turbo', inputPrice: 0.5, contextWindow: 16385 },
];

export default function TokenEstimator() {
    const [text, setText] = useState('');
    const [selectedModel, setSelectedModel] = useState<ModelConfig>(MODELS[0]);
    const [tokenCount, setTokenCount] = useState(0);

    useEffect(() => {
        if (!text) {
            setTokenCount(0);
            return;
        }

        try {
            // Using a try-catch because tiktoken can throw on rare edge cases
            const modelId = (selectedModel.tokenizerModel || selectedModel.id) as TiktokenModel;
            const encoding = encodingForModel(modelId);
            const tokens = encoding.encode(text);
            setTokenCount(tokens.length);
        } catch (err) {
            console.error('Tokenization error:', err);
        }
    }, [text, selectedModel]);

    const costEstimate = useMemo(() => {
        return (tokenCount / 1000000) * selectedModel.inputPrice;
    }, [tokenCount, selectedModel]);

    const usagePercent = useMemo(() => {
        return Math.min((tokenCount / selectedModel.contextWindow) * 100, 100);
    }, [tokenCount, selectedModel]);

    const isOverLimit = tokenCount > selectedModel.contextWindow;

    const getProgressColor = () => {
        const percent = (tokenCount / selectedModel.contextWindow) * 100;
        if (percent > 100) return 'bg-red-500 shadow-[0_0_10px_#ef4444]';
        if (percent > 80) return 'bg-yellow-500 shadow-[0_0_10px_#f59e0b]';
        return 'bg-primary shadow-[0_0_10px_#00ff00]';
    };

    return (
        <div className="space-y-6 font-mono text-gray-300">
            {/* Header Controls */}
            <div className="flex flex-wrap items-center justify-between gap-4 bg-[#0d0d0d] p-3 rounded-lg border border-white/5">
                <div className="flex items-center gap-3">
                    <div className="bg-primary/10 p-2 rounded-md">
                        <BrainCircuit size={18} className="text-primary" />
                    </div>
                    <select
                        value={selectedModel.id}
                        onChange={(e) => {
                            const model = MODELS.find(m => m.id === e.target.value);
                            if (model) setSelectedModel(model);
                        }}
                        className="bg-black border border-white/10 rounded px-3 py-1.5 text-sm text-primary outline-none focus:border-primary/50 transition-all"
                    >
                        {MODELS.map(m => (
                            <option key={m.id} value={m.id}>{m.label}</option>
                        ))}
                    </select>
                </div>
                <button
                    onClick={() => setText('')}
                    className="flex items-center gap-2 text-[10px] uppercase font-bold tracking-widest text-gray-500 hover:text-red-500 transition-colors"
                >
                    <Trash2 size={14} />
                    清空文本
                </button>
            </div>

            {/* Main Input Area */}
            <div className="relative group">
                <div className="absolute top-3 left-3 flex items-center gap-2 pointer-events-none opacity-20 group-focus-within:opacity-50 transition-opacity">
                    <Bot size={14} />
                    <span className="text-[10px] uppercase tracking-tighter">输入待采样文本...</span>
                </div>
                <textarea
                    value={text}
                    onChange={(e) => setText(e.target.value)}
                    className="w-full h-80 bg-black border border-white/10 rounded-lg p-6 pt-10 text-primary text-sm focus:border-primary/30 focus:ring-1 focus:ring-primary/20 outline-none transition-all resize-none shadow-[inset_0_2px_15px_rgba(0,0,0,0.8)] leading-relaxed"
                    placeholder="在这里粘贴您的 Prompt 或文档内容..."
                />
            </div>

            {/* Dashboard */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Token Count Card */}
                <div className="bg-[#070707] border border-white/5 rounded-xl p-5 relative overflow-hidden group">
                    <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
                        <BrainCircuit size={64} />
                    </div>
                    <div className="text-[10px] text-gray-500 uppercase font-bold tracking-widest mb-2">Token 总数</div>
                    <div className="text-4xl font-black text-white flex items-baseline gap-2">
                        {tokenCount.toLocaleString()}
                        <span className="text-xs font-normal text-primary opacity-50 uppercase">tokens</span>
                    </div>
                </div>

                {/* Cost Card */}
                <div className="bg-[#070707] border border-white/5 rounded-xl p-5 relative overflow-hidden group">
                    <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
                        <Wallet size={64} />
                    </div>
                    <div className="text-[10px] text-gray-500 uppercase font-bold tracking-widest mb-2">预计费用 (Input)</div>
                    <div className="text-4xl font-black text-green-400 flex items-baseline gap-2">
                        <span className="text-xl font-normal opacity-50">$</span>
                        {costEstimate < 0.000001 && tokenCount > 0 ? costEstimate.toExponential(4) : costEstimate.toFixed(6)}
                    </div>
                </div>
            </div>

            {/* Context Window Bar */}
            <div className="space-y-3 bg-[#0d0d0d] p-5 rounded-xl border border-white/5">
                <div className="flex justify-between items-end">
                    <div className="space-y-1">
                        <div className="text-[10px] text-gray-500 uppercase font-bold tracking-widest">上下文窗口占用</div>
                        <div className="text-xs text-primary/80">
                            {tokenCount.toLocaleString()} / {selectedModel.contextWindow.toLocaleString()}
                        </div>
                    </div>
                    <div className={`text-xl font-black ${isOverLimit ? 'text-red-500' : 'text-primary'}`}>
                        {usagePercent.toFixed(1)}%
                    </div>
                </div>
                <div className="h-3 w-full bg-white/5 rounded-full overflow-hidden p-[2px] border border-white/10">
                    <div
                        className={`h-full rounded-full transition-all duration-500 ease-out ${getProgressColor()}`}
                        style={{ width: `${usagePercent}%` }}
                    />
                </div>

                {isOverLimit && (
                    <div className="flex items-center gap-2 text-red-500 text-[10px] font-bold uppercase animate-pulse justify-center pt-2">
                        <AlertTriangle size={14} />
                        [ 警告: 已超过上下文上限 CONTEXT LIMIT EXCEEDED ]
                    </div>
                )}
            </div>

            {/* Footnote */}
            <div className="text-[9px] text-gray-600 text-center uppercase tracking-widest px-4">
                计算逻辑基于 {(selectedModel.tokenizerModel || selectedModel.id)} 分词器 | 非 OpenAI 模型使用 Tiktoken 作为估算参考
            </div>
        </div>
    );
}
