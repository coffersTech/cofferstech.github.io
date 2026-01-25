'use client';

import { useState, useEffect, useCallback } from 'react';
import cronstrue from 'cronstrue';
import { Sparkles, CalendarClock, MousePointerClick } from 'lucide-react';

export default function CronScheduler() {
    const [cronExpression, setCronExpression] = useState('* * * * *');
    const [explanation, setExplanation] = useState('每分钟执行一次');
    const [error, setError] = useState<string | null>(null);

    // Split cron into parts for the builder
    const getParts = useCallback((expr: string) => {
        const parts = expr.trim().split(/\s+/);
        return {
            minute: parts[0] || '*',
            hour: parts[1] || '*',
            day: parts[2] || '*',
            month: parts[3] || '*',
            week: parts[4] || '*'
        };
    }, []);

    const parts = getParts(cronExpression);

    useEffect(() => {
        try {
            const result = cronstrue.toString(cronExpression, { locale: 'zh_CN' });
            setExplanation(result);
            setError(null);
        } catch (err) {
            setExplanation('Invalid Cron Expression');
            setError(err instanceof Error ? err.message : '解析失败');
        }
    }, [cronExpression]);

    const handlePartChange = (index: number, value: string) => {
        const currentParts = cronExpression.trim().split(/\s+/);
        // Ensure we have 5 parts
        while (currentParts.length < 5) currentParts.push('*');
        currentParts[index] = value || '*';
        setCronExpression(currentParts.join(' '));
    };

    const PRESETS = [
        { label: '每分钟', value: '* * * * *' },
        { label: '每小时', value: '0 * * * *' },
        { label: '每天零点', value: '0 0 * * *' },
        { label: '每周日', value: '0 0 * * 0' },
        { label: '凌晨2点', value: '0 2 * * *' },
    ];

    return (
        <div className="space-y-12 font-mono">
            {/* Header: Large Display */}
            <div className="relative group pt-4">
                <div className="absolute -top-4 left-0 text-[10px] text-primary/50 uppercase tracking-widest font-bold">
                    [ MAIN_SCHEDULER_DISPLAY ]
                </div>
                <input
                    type="text"
                    value={cronExpression}
                    onChange={(e) => setCronExpression(e.target.value)}
                    className="w-full bg-black text-white text-4xl md:text-6xl font-bold text-center outline-none border-none py-4 placeholder:text-white/10"
                    placeholder="* * * * *"
                />
                {/* Explanation Area */}
                <div className={`mt-4 text-center text-sm transition-colors duration-300 flex items-center justify-center gap-2 ${error ? 'text-red-500 animate-pulse' : 'text-primary'}`}>
                    <Sparkles size={16} />
                    <span>{explanation}</span>
                </div>
            </div>

            {/* Builder Grid */}
            <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                {[
                    { label: '分 (Minute)', key: 'minute', idx: 0 },
                    { label: '时 (Hour)', key: 'hour', idx: 1 },
                    { label: '日 (Day)', key: 'day', idx: 2 },
                    { label: '月 (Month)', key: 'month', idx: 3 },
                    { label: '周 (Week)', key: 'week', idx: 4 },
                ].map((item) => (
                    <div key={item.key} className="space-y-2">
                        <label className="text-[10px] uppercase text-gray-500 font-bold block px-1">
                            {item.label}
                        </label>
                        <input
                            type="text"
                            value={parts[item.key as keyof typeof parts]}
                            onChange={(e) => handlePartChange(item.idx, e.target.value)}
                            className="w-full bg-[#0a0a0a] border border-white/10 rounded-md p-2 text-primary focus:border-primary/50 focus:ring-1 focus:ring-primary/30 outline-none transition-all text-center text-lg"
                        />
                    </div>
                ))}
            </div>

            {/* Presets */}
            <div className="space-y-4">
                <div className="flex items-center gap-2 text-[11px] text-gray-500 uppercase tracking-widest font-bold border-b border-white/10 pb-2">
                    <MousePointerClick size={14} />
                    <span>快速预设 (Presets)</span>
                </div>
                <div className="flex flex-wrap gap-3">
                    {PRESETS.map((p) => (
                        <button
                            key={p.value}
                            onClick={() => setCronExpression(p.value)}
                            className="bg-white/5 hover:bg-white/10 active:scale-95 text-xs text-gray-400 hover:text-white px-4 py-2 rounded-full border border-white/10 transition-all flex items-center gap-2"
                        >
                            <CalendarClock size={12} />
                            {p.label}
                            <span className="opacity-30 text-[9px] ml-1">{p.value}</span>
                        </button>
                    ))}
                </div>
            </div>

            {/* Help Info */}
            <div className="bg-primary/5 border border-primary/20 rounded-lg p-4 space-y-2 text-[11px] text-primary/70">
                <div className="font-bold flex items-center gap-2 uppercase">
                    [ SYSTEM_HINT ]
                </div>
                <p>Cron 格式支持：分 时 日 月 周。解析基于标准的 Linux Cron 命令格式。</p>
                <div className="flex gap-4 opacity-50">
                    <span>* - 任意值</span>
                    <span>, - 枚举</span>
                    <span>- - 范围</span>
                    <span>/ - 步长</span>
                </div>
            </div>
        </div>
    );
}
