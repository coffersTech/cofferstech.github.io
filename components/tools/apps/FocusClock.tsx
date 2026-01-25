'use client';

import { useState, useEffect, useRef } from 'react';
import { Play, Pause, RotateCcw, Coffee, Settings, Plus, Minus, X, Check, Timer as TimerIcon, Terminal, Maximize, Minimize } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

type Mode = 'FOCUS' | 'REST';

export default function FocusClock() {
    // Settings state
    const [focusMinutes, setFocusMinutes] = useState(25);
    const [breakMinutes, setBreakMinutes] = useState(5);
    const [isSettingsOpen, setIsSettingsOpen] = useState(false);
    const [isLoaded, setIsLoaded] = useState(false);
    const [isFullscreen, setIsFullscreen] = useState(false);
    const [savedFocusTime, setSavedFocusTime] = useState<number | null>(null);

    const containerRef = useRef<HTMLDivElement>(null);

    // Persistence
    useEffect(() => {
        const savedFocus = localStorage.getItem('focus_minutes');
        const savedBreak = localStorage.getItem('break_minutes');
        if (savedFocus) setFocusMinutes(parseInt(savedFocus));
        if (savedBreak) setBreakMinutes(parseInt(savedBreak));
        setIsLoaded(true);
    }, []);

    useEffect(() => {
        if (isLoaded) {
            localStorage.setItem('focus_minutes', focusMinutes.toString());
            localStorage.setItem('break_minutes', breakMinutes.toString());
        }
    }, [focusMinutes, breakMinutes, isLoaded]);

    // Timer state
    const [timeLeft, setTimeLeft] = useState(focusMinutes * 60);
    const [isActive, setIsActive] = useState(false);
    const [mode, setMode] = useState<Mode>('FOCUS');

    const timerRef = useRef<NodeJS.Timeout | null>(null);

    // Initial sync of timeLeft when loaded
    useEffect(() => {
        if (isLoaded && !isActive) {
            setTimeLeft(mode === 'FOCUS' ? focusMinutes * 60 : breakMinutes * 60);
        }
    }, [isLoaded, focusMinutes, breakMinutes, mode]);

    // Fullscreen Logic
    const toggleFullscreen = () => {
        if (!document.fullscreenElement) {
            containerRef.current?.requestFullscreen().catch((err) => {
                console.error(`Error attempting to enable full-screen mode: ${err.message}`);
            });
        } else {
            document.exitFullscreen();
        }
    };

    useEffect(() => {
        const handleFullscreenChange = () => {
            setIsFullscreen(!!document.fullscreenElement);
        };
        document.addEventListener('fullscreenchange', handleFullscreenChange);
        return () => document.removeEventListener('fullscreenchange', handleFullscreenChange);
    }, []);

    // Reset timer when settings change, but only if not currently active
    // This prevents the timer from resetting when paused (isActive changes to false)
    useEffect(() => {
        if (!isActive) {
            // If we have a saved focus time and we are in focus mode, don't overwrite it with settings
            if (mode === 'FOCUS' && savedFocusTime !== null) {
                return;
            }
            const newTime = mode === 'FOCUS' ? focusMinutes * 60 : breakMinutes * 60;
            if (timeLeft !== newTime || timeLeft === 0) {
                setTimeLeft(newTime);
            }
        }
    }, [focusMinutes, breakMinutes, mode, isActive, savedFocusTime]);

    // Format seconds into MM:SS
    const formatTime = (seconds: number) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    };

    // Update document title
    useEffect(() => {
        const originalTitle = document.title;
        if (isActive) {
            const statusText = mode === 'FOCUS' ? '专注中' : '休息中';
            document.title = `(${formatTime(timeLeft)}) ${statusText} - Rice Bucket`;
        } else if (timeLeft > 0 && timeLeft !== (mode === 'FOCUS' ? focusMinutes * 60 : breakMinutes * 60)) {
            // Timer is paused and not at its initial state
            document.title = `(已暂停) ${formatTime(timeLeft)} - Rice Bucket`;
        } else {
            // Timer is at initial state or has finished
            document.title = 'Rice Bucket';
        }
        return () => {
            document.title = originalTitle;
        };
    }, [timeLeft, isActive, mode, focusMinutes, breakMinutes]);

    // Timer logic
    useEffect(() => {
        if (isActive && timeLeft > 0) {
            timerRef.current = setInterval(() => {
                setTimeLeft((prev) => Math.max(0, prev - 1));
            }, 1000);
        } else if (timeLeft === 0 && isActive) { // Only trigger when timer reaches 0 while active
            setIsActive(false);
            if (timerRef.current) clearInterval(timerRef.current);

            // Clear saved focus time when a focus session finishes naturally
            if (mode === 'FOCUS') {
                setSavedFocusTime(null);
            }

            // Alert user
            if (typeof window !== 'undefined') {
                const statusText = mode === 'FOCUS' ? '[ 时间到！请休息 ]' : '[ 休息结束！开始专注 ]';
                document.title = statusText;

                try {
                    const audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
                    const oscillator = audioCtx.createOscillator();
                    const gainNode = audioCtx.createGain();
                    oscillator.connect(gainNode);
                    gainNode.connect(audioCtx.destination);
                    oscillator.type = 'sine';
                    oscillator.frequency.setValueAtTime(440, audioCtx.currentTime);
                    gainNode.gain.setValueAtTime(0.1, audioCtx.currentTime);
                    oscillator.start();
                    oscillator.stop(audioCtx.currentTime + 0.5);
                } catch (e) {
                    console.warn('Audio alert failed', e);
                }
            }
        }

        return () => {
            if (timerRef.current) clearInterval(timerRef.current);
        };
    }, [isActive, timeLeft, mode]);

    const toggleTimer = () => setIsActive(!isActive);

    const resetTimer = () => {
        setIsActive(false);
        setMode('FOCUS');
        setSavedFocusTime(null);
        setTimeLeft(focusMinutes * 60);
    };

    const startFocus = () => {
        setIsActive(false);
        setMode('FOCUS');
        if (savedFocusTime !== null) {
            setTimeLeft(savedFocusTime);
        } else {
            setTimeLeft(focusMinutes * 60);
        }
    };

    const startBreak = () => {
        if (mode === 'FOCUS') {
            setSavedFocusTime(timeLeft);
        }
        setIsActive(false);
        setMode('REST');
        setTimeLeft(breakMinutes * 60);
    };

    const addTime = (seconds: number) => {
        setTimeLeft((prev) => {
            const newTime = Math.max(0, prev + seconds);
            // If user manually adjusts time in focus mode, we should reflect that in saved time
            if (mode === 'FOCUS') {
                setSavedFocusTime(newTime);
            }
            return newTime;
        });
    };

    // Determine colors based on state
    const getStatusTheme = () => {
        if (!isActive && timeLeft !== (mode === 'FOCUS' ? focusMinutes * 60 : breakMinutes * 60) && timeLeft !== 0) {
            return {
                color: '#ff003c', // Red for paused/stopped
                glow: '0 0 20px rgba(255, 0, 60, 0.5), 0 0 40px rgba(255, 0, 60, 0.2)',
                border: 'border-[#ff003c]/30',
                bg: 'bg-[#ff003c]/5',
                text: 'text-[#ff003c]',
                label: '已暂停'
            };
        }
        if (mode === 'FOCUS') {
            return {
                color: '#00ff41', // Matrix Green
                glow: '0 0 20px rgba(0, 255, 65, 0.5), 0 0 40px rgba(0, 255, 65, 0.2)',
                border: 'border-[#00ff41]/30',
                bg: 'bg-[#00ff41]/5',
                text: 'text-[#00ff41]',
                label: '专注模式'
            };
        }
        return {
            color: '#ffaa00', // Amber
            glow: '0 0 20px rgba(255, 170, 0, 0.5), 0 0 40px rgba(255, 170, 0, 0.2)',
            border: 'border-[#ffaa00]/30',
            bg: 'bg-[#ffaa00]/5',
            text: 'text-[#ffaa00]',
            label: '休整模式'
        };
    };

    const theme = getStatusTheme();

    return (
        <div ref={containerRef} className="flex flex-col h-full w-full bg-[#050505] font-mono overflow-hidden select-none relative p-6 md:p-12 text-white">
            {/* Scanline Effect */}
            <div className="absolute inset-0 pointer-events-none z-50 opacity-[0.03] bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.25)_50%),linear-gradient(90deg,rgba(255,0,0,0.06),rgba(0,255,0,0.02),rgba(0,0,255,0.06))] bg-[length:100%_4px,3px_100%]" />

            {/* Vignette */}
            <div className="absolute inset-0 pointer-events-none z-40 bg-[radial-gradient(circle,transparent_50%,rgba(0,0,0,0.4)_100%)]" />

            {/* Header / Meta Info */}
            <div className="flex justify-between items-start mb-8 relative z-30">
                <div className="flex flex-col gap-1">
                    <div className="flex items-center gap-2 text-[10px] tracking-[0.2em] font-bold text-white/40">
                        <Terminal size={12} />
                        计时系统.SH [版本 1.0.4]
                    </div>
                    <div className="text-[10px] tracking-[0.2em] text-white/20 uppercase">
                        主机: {typeof window !== 'undefined' ? window.location.hostname : '本地虚拟'}
                    </div>
                </div>

                <div className="flex items-start gap-6 relative z-30">
                    <button
                        onClick={toggleFullscreen}
                        className="flex flex-col items-end gap-1 group/fs"
                    >
                        <div className="text-[10px] tracking-widest text-white/40 group-hover/fs:text-white transition-colors flex items-center gap-2">
                            {isFullscreen ? <Minimize size={10} /> : <Maximize size={10} />}
                            [ {isFullscreen ? '退出全屏' : '全屏模式'} ]
                        </div>
                        <div className="h-[1px] w-8 bg-white/20 group-hover/fs:w-16 transition-all" />
                    </button>

                    <button
                        onClick={() => setIsSettingsOpen(true)}
                        className="flex flex-col items-end gap-1 group/btn"
                    >
                        <div className="text-[10px] tracking-widest text-white/40 group-hover/btn:text-white transition-colors">
                            [ 设置 ]
                        </div>
                        <div className="h-[1px] w-8 bg-white/20 group-hover/btn:w-12 transition-all" />
                    </button>
                </div>
            </div>

            {/* Timer Area */}
            <div className="flex-1 flex flex-col items-center justify-center relative z-10 w-full group/main">
                <motion.div
                    animate={isActive ? {
                        opacity: [1, 0.8, 1],
                        scale: [1, 0.99, 1]
                    } : {}}
                    transition={{
                        duration: 4,
                        repeat: Infinity,
                        ease: "easeInOut"
                    }}
                    className="flex flex-col items-center w-full"
                >
                    {/* Mode Indicator */}
                    <div className={`text-[11px] tracking-[0.5em] mb-4 transition-colors duration-500 font-bold ${theme.text}`}>
                        // {theme.label}
                    </div>

                    {/* Digital Display with CRT Glow */}
                    <div
                        className="text-[10rem] md:text-[15rem] lg:text-[20rem] font-bold tracking-tighter leading-none mb-8 text-center crt-flicker"
                        style={{
                            color: theme.color,
                            textShadow: theme.glow,
                            fontVariantNumeric: 'tabular-nums'
                        }}
                    >
                        {formatTime(timeLeft)}
                    </div>

                    {/* Stealth Controls (Hover revealed) */}
                    <AnimatePresence>
                        <div className="h-12 flex items-center justify-center">
                            <motion.div
                                initial={{ opacity: 0, y: 10 }}
                                whileHover={{ opacity: 1, y: 0 }}
                                className="opacity-0 group-hover/main:opacity-100 transition-all duration-500 flex items-center gap-6"
                            >
                                <div className="flex items-center gap-2">
                                    <button
                                        onClick={() => addTime(60)}
                                        className="text-[11px] hover:text-white text-white/40 border border-white/10 px-2 py-1 rounded transition-colors active:bg-white/5"
                                    >
                                        +1分
                                    </button>
                                    <button
                                        onClick={() => addTime(-60)}
                                        className="text-[11px] hover:text-white text-white/40 border border-white/10 px-2 py-1 rounded transition-colors active:bg-white/5"
                                    >
                                        -1分
                                    </button>
                                </div>
                                <div className="w-[1px] h-4 bg-white/10" />
                                <div className="flex items-center gap-2">
                                    <button
                                        onClick={() => addTime(15)}
                                        className="text-[11px] hover:text-white text-white/40 border border-white/10 px-2 py-1 rounded transition-colors active:bg-white/5"
                                    >
                                        +15秒
                                    </button>
                                    <button
                                        onClick={() => addTime(-15)}
                                        className="text-[11px] hover:text-white text-white/40 border border-white/10 px-2 py-1 rounded transition-colors active:bg-white/5"
                                    >
                                        -15秒
                                    </button>
                                </div>
                            </motion.div>
                        </div>
                    </AnimatePresence>
                </motion.div>
            </div>

            {/* CLI Command Area */}
            <div className="flex flex-col items-center gap-12 pb-8 relative z-20">
                <div className="flex items-center gap-8 md:gap-16">
                    <button
                        onClick={toggleTimer}
                        className={`flex flex-col items-center gap-3 group/cmd transition-all`}
                    >
                        <div className={`px-8 py-2 border ${isActive ? 'border-red-500/40 bg-red-500/5 text-red-500 shadow-[0_0_15px_rgba(239,68,68,0.2)]' : 'border-white/20 bg-white/5 text-white/60 group-hover/cmd:border-white/60 group-hover/cmd:text-white'} transition-all text-sm font-bold tracking-[0.2em]`}>
                            {isActive ? '> 停止' : '> 启动'}
                        </div>
                        <div className="text-[9px] tracking-[0.3em] font-black text-white/20 group-hover/cmd:text-white/40 uppercase">
                            执行指令
                        </div>
                    </button>

                    <button
                        onClick={resetTimer}
                        className="flex flex-col items-center gap-3 group/cmd"
                    >
                        <div className="px-8 py-2 border border-white/20 bg-white/5 text-white/60 group-hover/cmd:border-white/60 group-hover/cmd:text-white transition-all text-sm font-bold tracking-[0.2em]">
                            &gt; 重置
                        </div>
                        <div className="text-[9px] tracking-[0.3em] font-black text-white/20 group-hover/cmd:text-white/40 uppercase">
                            系统重启
                        </div>
                    </button>

                    <button
                        onClick={mode === 'FOCUS' ? startBreak : startFocus}
                        className="flex flex-col items-center gap-3 group/cmd"
                    >
                        <div className="px-8 py-2 border border-white/20 bg-white/5 text-white/60 group-hover/cmd:border-[#ffaa00]/60 group-hover/cmd:text-[#ffaa00] transition-all text-sm font-bold tracking-[0.2em]">
                            {mode === 'FOCUS' ? '> 休息' : '> 专注'}
                        </div>
                        <div className="text-[9px] tracking-[0.3em] font-black text-white/20 group-hover/cmd:text-white/40 uppercase">
                            {mode === 'FOCUS' ? '休整计划' : '回归专注'}
                        </div>
                    </button>
                </div>

                <div className="text-[10px] tracking-[0.5em] text-white/10 uppercase animate-pulse">
                    -- 等待指令输入 --
                </div>
            </div>

            {/* Settings Overlay */}
            {isSettingsOpen && (
                <div className="absolute inset-0 z-50 bg-black/95 backdrop-blur-xl flex items-center justify-center animate-in fade-in duration-300 p-4">
                    <div className="w-full max-w-md p-8 border border-white/10 rounded-2xl bg-[#0d0d0d] space-y-8 shadow-2xl relative">
                        <button
                            onClick={() => setIsSettingsOpen(false)}
                            className="absolute top-4 right-4 text-gray-500 hover:text-white transition-colors p-2"
                        >
                            <X size={20} />
                        </button>

                        <div className="space-y-2">
                            <h3 className="text-xl font-bold tracking-widest text-[#00ff00] uppercase border-b border-white/10 pb-4 flex items-center gap-2">
                                <Settings size={18} />
                                系统周期配置.cfg
                            </h3>
                        </div>

                        <div className="space-y-8">
                            <div className="space-y-4">
                                <div className="flex justify-between text-[11px] text-gray-500 tracking-widest uppercase">
                                    <span>专注阶段时长 (分钟)</span>
                                    <span className="text-[#00ff00] font-bold">{focusMinutes}分</span>
                                </div>
                                <div className="flex items-center gap-4">
                                    <button
                                        onClick={() => setFocusMinutes(Math.max(1, focusMinutes - 5))}
                                        className="p-2 bg-white/5 hover:bg-white/10 border border-white/10 rounded-lg text-gray-400 hover:text-white transition-all"
                                    >
                                        -5
                                    </button>
                                    <input
                                        type="range"
                                        min="1"
                                        max="60"
                                        value={focusMinutes}
                                        onChange={(e) => setFocusMinutes(parseInt(e.target.value))}
                                        className="flex-1 accent-[#00ff00] bg-white/10 rounded-lg h-1.5"
                                    />
                                    <button
                                        onClick={() => setFocusMinutes(Math.min(60, focusMinutes + 5))}
                                        className="p-2 bg-white/5 hover:bg-white/10 border border-white/10 rounded-lg text-gray-400 hover:text-white transition-all"
                                    >
                                        +5
                                    </button>
                                </div>
                            </div>

                            <div className="space-y-4">
                                <div className="flex justify-between text-[11px] text-gray-500 tracking-widest uppercase">
                                    <span>休整阶段时长 (分钟)</span>
                                    <span className="text-cyan-400 font-bold">{breakMinutes}分</span>
                                </div>
                                <div className="flex items-center gap-4">
                                    <button
                                        onClick={() => setBreakMinutes(Math.max(1, breakMinutes - 1))}
                                        className="p-2 bg-white/5 hover:bg-white/10 border border-white/10 rounded-lg text-gray-400 hover:text-white transition-all"
                                    >
                                        -1
                                    </button>
                                    <input
                                        type="range"
                                        min="1"
                                        max="30"
                                        value={breakMinutes}
                                        onChange={(e) => setBreakMinutes(parseInt(e.target.value))}
                                        className="flex-1 accent-cyan-400 bg-white/10 rounded-lg h-1.5"
                                    />
                                    <button
                                        onClick={() => setBreakMinutes(Math.min(30, breakMinutes + 1))}
                                        className="p-2 bg-white/5 hover:bg-white/10 border border-white/10 rounded-lg text-gray-400 hover:text-white transition-all"
                                    >
                                        +1
                                    </button>
                                </div>
                            </div>
                        </div>

                        <button
                            onClick={() => setIsSettingsOpen(false)}
                            className="w-full py-4 bg-white/5 hover:bg-white/10 border border-white/20 text-white text-[11px] font-black uppercase tracking-[0.4em] transition-all flex items-center justify-center gap-2 rounded"
                        >
                            <Check size={16} />
                            应用并保存
                        </button>
                    </div>
                </div>
            )}

            <style jsx global>{`
                @import url('https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;700;800&display=swap');
                
                .font-mono {
                    font-family: 'JetBrains Mono', 'Fira Code', 'Courier New', monospace;
                }

                @keyframes flicker {
                    0% { opacity: 0.97611; }
                    5% { opacity: 0.9416; }
                    10% { opacity: 0.98558; }
                    15% { opacity: 0.93173; }
                    20% { opacity: 0.99835; }
                    25% { opacity: 0.90252; }
                    30% { opacity: 0.98063; }
                    35% { opacity: 0.99859; }
                    40% { opacity: 0.92358; }
                    45% { opacity: 0.91108; }
                    50% { opacity: 0.99698; }
                    55% { opacity: 0.90598; }
                    60% { opacity: 0.91656; }
                    65% { opacity: 0.90135; }
                    70% { opacity: 0.96338; }
                    75% { opacity: 0.95134; }
                    80% { opacity: 0.93335; }
                    85% { opacity: 0.98393; }
                    90% { opacity: 0.94523; }
                    95% { opacity: 0.93947; }
                    100% { opacity: 0.97356; }
                }

                .crt-flicker {
                    animation: flicker 0.15s infinite;
                }
            `}</style>
        </div>
    );
}
