'use client';

import { useState, useEffect, useRef } from 'react';
import { Utensils, Target, ShieldAlert, Cpu, Network, Settings, Plus, Trash2, X, RotateCcw } from 'lucide-react';

const DEFAULT_FOODS = [
    '黄焖鸡米饭 v2.0',
    '麦当劳 (紧急热修复)',
    '沙县小吃 (遗留系统)',
    '隆江猪脚饭',
    '肯德基 (疯狂星期四构建版)',
    '轻食 (低电量模式)',
    '麻辣烫',
    '兰州拉面',
    '过桥米线',
    '铁板烧 (超频版)',
    '便利店饭团 (热插拔)',
    '避风塘炒蟹 (实验性)'
];

const MOCK_LOGS = [
    '> 正在初始化神经食物网络...',
    '> 正在连接外卖配送链路...',
    '> 正在分析卡路里摄入阈值...',
    '> 正在绕过钱包防火墙...',
    '> 正在优化消化系统兼容性...',
    '> 正在扫描本地有机基质供应商...',
    '> 正在最终确定选择算法...'
];

export default function LunchRng() {
    const [status, setStatus] = useState<'IDLE' | 'SCANNING' | 'ACQUIRED'>('IDLE');
    const [displayedText, setDisplayedText] = useState('等待扫描');
    const [logs, setLogs] = useState<string[]>([]);
    const [scrambleNoise, setScrambleNoise] = useState('');
    const [foods, setFoods] = useState<string[]>([]);
    const [newItem, setNewItem] = useState('');
    const timerRef = useRef<NodeJS.Timeout | null>(null);

    // Initialize foods from localStorage
    useEffect(() => {
        const savedFoods = localStorage.getItem('LUNCH_RNG_FOODS');
        if (savedFoods) {
            try {
                setFoods(JSON.parse(savedFoods));
            } catch (e) {
                setFoods(DEFAULT_FOODS);
            }
        } else {
            setFoods(DEFAULT_FOODS);
        }
    }, []);

    // Save foods to localStorage
    useEffect(() => {
        if (foods.length > 0) {
            localStorage.setItem('LUNCH_RNG_FOODS', JSON.stringify(foods));
        }
    }, [foods]);

    const generateScramble = () => {
        const chars = '!@#$%^&*()_+-=[]{}|;:,.<>?';
        return Array(8).fill(0).map(() => chars[Math.floor(Math.random() * chars.length)]).join('');
    };

    const runScan = () => {
        if (status === 'SCANNING') return;

        setStatus('SCANNING');
        setLogs([]);

        let count = 0;
        const totalDuration = 2000;
        const interval = 50;
        const totalSteps = totalDuration / interval;

        // Scrambling text interval
        const scrambleInterval = setInterval(() => {
            const randomFood = foods[Math.floor(Math.random() * foods.length)] || '空指针错误';
            setDisplayedText(randomFood);
            setScrambleNoise(generateScramble());
            count++;

            if (count >= totalSteps) {
                clearInterval(scrambleInterval);
                const finalChoice = foods[Math.floor(Math.random() * foods.length)] || '错误_404';
                setDisplayedText(finalChoice);
                setStatus('ACQUIRED');
                setScrambleNoise('');
            }
        }, interval);

        // Mock Logs interval
        MOCK_LOGS.forEach((log, index) => {
            setTimeout(() => {
                setLogs(prev => [...prev, log].slice(-5));
            }, (totalDuration / MOCK_LOGS.length) * index);
        });
    };

    return (
        <div className="flex flex-col md:flex-row h-screen w-full font-mono text-gray-300 bg-[#0a0a0a] overflow-hidden">
            <style jsx global>{`
                .custom-scrollbar::-webkit-scrollbar {
                    width: 4px;
                }
                .custom-scrollbar::-webkit-scrollbar-track {
                    background: rgba(0, 255, 0, 0.05);
                }
                .custom-scrollbar::-webkit-scrollbar-thumb {
                    background: rgba(0, 255, 0, 0.2);
                    border-radius: 2px;
                }
                .custom-scrollbar::-webkit-scrollbar-thumb:hover {
                    background: rgba(0, 255, 0, 0.4);
                }
            `}</style>

            {/* Left Pane: Configuration */}
            <div className="w-full md:w-1/3 border-r border-primary/20 p-6 flex flex-col space-y-6 bg-black/40">
                <div className="flex items-center justify-between border-b border-primary/20 pb-4">
                    <div className="flex items-center gap-2">
                        <Network size={18} className="text-primary" />
                        <h3 className="text-sm font-bold tracking-widest uppercase">菜单数据库.db</h3>
                    </div>
                    <span className="text-[10px] text-primary/40 uppercase tracking-tighter">状态: 运行中</span>
                </div>

                <div className="flex-1 overflow-y-auto pr-2 space-y-2 custom-scrollbar">
                    {foods.map((food, index) => (
                        <div key={index} className="flex items-center justify-between group bg-primary/5 p-3 border border-primary/10 hover:border-primary/30 transition-all rounded">
                            <span className="text-xs truncate">{food}</span>
                            <button
                                onClick={() => setFoods(foods.filter((_, i) => i !== index))}
                                className="text-red-500 opacity-0 group-hover:opacity-100 transition-all p-1"
                                title="删除条目"
                            >
                                <Trash2 size={14} />
                            </button>
                        </div>
                    ))}
                </div>

                <div className="space-y-4 pt-4 border-t border-primary/10">
                    <div className="flex gap-2">
                        <input
                            type="text"
                            value={newItem}
                            onChange={(e) => setNewItem(e.target.value)}
                            onKeyDown={(e) => {
                                if (e.key === 'Enter' && newItem.trim()) {
                                    setFoods([...foods, newItem.trim()]);
                                    setNewItem('');
                                }
                            }}
                            placeholder="输入新条目序列号..."
                            className="flex-1 bg-black/60 border border-primary/30 px-3 py-3 text-xs text-primary focus:outline-none focus:border-primary rounded"
                        />
                        <button
                            onClick={() => {
                                if (newItem.trim()) {
                                    setFoods([...foods, newItem.trim()]);
                                    setNewItem('');
                                }
                            }}
                            className="bg-primary/10 hover:bg-primary/20 border border-primary/30 px-6 text-primary transition-all rounded flex items-center gap-2"
                        >
                            <Plus size={16} />
                            <span className="text-[10px] font-bold uppercase tracking-widest hidden sm:inline">增加</span>
                        </button>
                    </div>

                    <button
                        onClick={() => {
                            if (confirm('是否确认将菜单库存重置为出厂预设？')) {
                                setFoods(DEFAULT_FOODS);
                            }
                        }}
                        className="w-full flex items-center justify-center gap-2 py-3 text-[10px] text-primary/40 hover:text-red-400 hover:bg-red-400/5 transition-all uppercase tracking-widest border border-primary/5 hover:border-red-400/20 rounded"
                    >
                        <RotateCcw size={12} />
                        重置系统默认库存
                    </button>
                </div>
            </div>

            {/* Right Pane: Main Display & RNG */}
            <div className="flex-1 flex flex-col items-center justify-center p-8 space-y-12 relative overflow-hidden">
                {/* Background Grid for aesthetic */}
                <div className="absolute inset-0 z-0 opacity-[0.05] pointer-events-none"
                    style={{ backgroundImage: 'radial-gradient(var(--primary) 1px, transparent 1px)', backgroundSize: '40px 40px' }}></div>

                {/* Terminal Screen Container */}
                <div className="relative w-full max-w-2xl aspect-[16/9] bg-[#050505] border-2 border-primary/20 rounded-lg overflow-hidden flex flex-col items-center justify-center p-8 group z-10 shadow-[0_0_50px_rgba(0,255,0,0.05)]">

                    {/* CRT Scanline Effect */}
                    <div className="absolute inset-0 pointer-events-none opacity-[0.03] bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.25)_50%),linear-gradient(90deg,rgba(255,0,0,0.06),rgba(0,255,0,0.02),rgba(0,0,255,0.06))] z-10 bg-[length:100%_2px,3px_100%]"></div>

                    {/* Corner Brackets */}
                    <div className="absolute top-4 left-4 w-8 h-8 border-t-2 border-l-2 border-primary opacity-40"></div>
                    <div className="absolute top-4 right-4 w-8 h-8 border-t-2 border-r-2 border-primary opacity-40"></div>
                    <div className="absolute bottom-4 left-4 w-8 h-8 border-b-2 border-l-2 border-primary opacity-40"></div>
                    <div className="absolute bottom-4 right-4 w-8 h-8 border-b-2 border-r-2 border-primary opacity-40"></div>

                    {/* Status Indicator */}
                    <div className="absolute top-6 left-1/2 -translate-x-1/2 flex items-center gap-2 px-3 py-1 bg-primary/5 rounded border border-primary/10">
                        <div className={`w-2 h-2 rounded-full ${status === 'SCANNING' ? 'bg-yellow-500 animate-pulse' : status === 'ACQUIRED' ? 'bg-red-500 shadow-[0_0_8px_#ef4444]' : 'bg-primary'} `}></div>
                        <span className="text-[10px] font-bold tracking-[0.2em]">{status === 'IDLE' ? '运行中' : status === 'SCANNING' ? '扫描中' : '已获得目标'}</span>
                    </div>

                    {/* Main Display Display */}
                    <div className="relative z-20 text-center space-y-4 w-full px-4">
                        <div className="flex items-center justify-center gap-4">
                            {status === 'SCANNING' && (
                                <span className="text-xl text-primary animate-spin">
                                    <Cpu size={24} />
                                </span>
                            )}
                            <h2 className={`text-4xl md:text-5xl font-black transition-all duration-75 truncate ${status === 'ACQUIRED'
                                ? 'text-primary scale-110 drop-shadow-[0_0_15px_#00ff00]'
                                : 'text-primary/60'
                                }`}>
                                {displayedText}
                            </h2>
                        </div>
                        {status === 'SCANNING' && (
                            <div className="text-xl font-bold text-primary/20 tracking-[1em]">
                                {scrambleNoise}
                            </div>
                        )}
                        {status === 'ACQUIRED' && (
                            <div className="flex items-center justify-center gap-2 text-primary animate-bounce pt-4">
                                <Target size={18} />
                                <span className="text-xs font-bold tracking-[0.3em] uppercase">[ 目标已锁定 ]</span>
                            </div>
                        )}
                    </div>

                    {/* Bot Log Screen */}
                    <div className="absolute bottom-6 left-8 right-8 h-20 overflow-hidden text-[10px] text-primary/40 leading-loose flex flex-col justify-end">
                        {logs.map((log, i) => (
                            <div key={i} className="animate-in slide-in-from-bottom-1 duration-300">
                                {log}
                            </div>
                        ))}
                    </div>
                </div>

                {/* Initiate Button */}
                <div className="flex flex-col items-center gap-4 z-10">
                    <button
                        onClick={runScan}
                        disabled={status === 'SCANNING'}
                        className={`relative px-12 py-6 rounded group transition-all transform active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed`}
                    >
                        {/* Shadow Layer */}
                        <div className="absolute inset-0 bg-red-900 translate-y-2 rounded"></div>
                        {/* Main Layer */}
                        <div className={`relative px-12 py-6 rounded border-2 border-red-400 bg-red-600 flex items-center gap-4 group-hover:-translate-y-1 group-active:translate-y-1 transition-transform shadow-[0_0_20px_rgba(239,68,68,0.3)]`}>
                            <div className="p-2 bg-black/20 rounded shadow-inner">
                                <Utensils size={24} className="text-white" />
                            </div>
                            <span className="text-xl font-black text-white tracking-widest uppercase">
                                {status === 'SCANNING' ? '[ 正在分析... ]' : '[ 启动扫描程序 ]'}
                            </span>
                        </div>
                    </button>
                    <p className="text-[10px] text-gray-500 uppercase tracking-widest opacity-50">
                        警告：过量摄入钠盐可能导致生物计算单元性能下降
                    </p>
                </div>
            </div>
        </div>
    );
}
