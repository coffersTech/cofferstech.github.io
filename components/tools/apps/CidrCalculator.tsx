'use client';

import { useState, useEffect, useMemo } from 'react';
import * as SubnetCalculator from 'ip-subnet-calculator';
import { Network, Zap, Info, ChevronRight } from 'lucide-react';

export default function CidrCalculator() {
    const [input, setInput] = useState('192.168.1.1/24');
    const [result, setResult] = useState<any>(null);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        try {
            const parts = input.split('/');
            const ip = parts[0];
            const mask = parts[1] ? parseInt(parts[1]) : 32;

            if (isNaN(mask) || mask < 0 || mask > 32) {
                throw new Error('无效的掩码位');
            }

            const calculated = SubnetCalculator.calculateSubnetMask(ip, mask);
            if (calculated) {
                setResult(calculated);
                setError(null);
            } else {
                throw new Error('无效的 IP 地址');
            }
        } catch (err) {
            setResult(null);
            setError(err instanceof Error ? err.message : '计算失败');
        }
    }, [input]);

    const binaryVisualizer = useMemo(() => {
        if (!result) return null;

        const ipBinary = result.ipLowStr.split('.').map((octet: string) => {
            return parseInt(octet).toString(2).padStart(8, '0');
        }).join('');

        const networkBits = result.prefixSize;

        return (
            <div className="font-mono text-xs md:text-sm tracking-widest break-all leading-relaxed bg-black/40 p-4 rounded border border-white/5 space-y-2">
                <div className="flex flex-wrap items-center gap-x-1">
                    {ipBinary.split('').map((bit: string, i: number) => {
                        const isNetwork = i < networkBits;
                        const isLastInOctet = (i + 1) % 8 === 0 && i !== 31;
                        const isBoundary = i === networkBits - 1;

                        return (
                            <span key={i} className="flex items-center">
                                <span className={isNetwork ? 'text-primary font-bold shadow-[0_0_8px_rgba(0,255,0,0.3)]' : 'text-gray-600'}>
                                    {bit}
                                </span>
                                {isBoundary && (
                                    <span className="mx-1 text-white/40 font-light text-lg h-4 flex items-center">|</span>
                                )}
                                {isLastInOctet && !isBoundary && (
                                    <span className="mx-0.5 text-white/10">.</span>
                                )}
                            </span>
                        );
                    })}
                </div>
                <div className="flex justify-between text-[10px] uppercase font-bold pt-2 opacity-50">
                    <span className="text-primary">网络位 ({networkBits})</span>
                    <span className="text-gray-500">主机位 ({32 - networkBits})</span>
                </div>
            </div>
        );
    }, [result]);

    const presets = [
        { label: 'Docker 网桥', value: '172.17.0.1/16' },
        { label: '局域网默认', value: '192.168.0.1/24' },
        { label: '小型子网', value: '10.0.0.1/28' },
    ];

    return (
        <div className="space-y-8 font-mono">
            {/* Input Section */}
            <div className="space-y-4">
                <div className="flex items-center gap-2 text-primary/70 text-xs font-bold uppercase tracking-widest">
                    <Zap size={14} />
                    <span>IP 地址 / CIDR</span>
                </div>
                <input
                    type="text"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    className="w-full bg-black border border-white/10 rounded-lg p-4 text-2xl md:text-4xl text-primary font-bold focus:border-primary/50 focus:ring-1 focus:ring-primary/20 outline-none transition-all shadow-[inset_0_2px_10px_rgba(0,0,0,0.5)]"
                    placeholder="192.168.1.1/24"
                />
                {error && (
                    <div className="text-red-500 text-xs font-bold animate-pulse px-1">
                        [ 错误: {error} ]
                    </div>
                )}
            </div>

            {/* Visualizer */}
            {result && (
                <div className="space-y-3">
                    <div className="flex items-center gap-2 text-gray-500 text-xs font-bold uppercase tracking-widest pl-1">
                        <Network size={14} />
                        <span>二进制结构可视化 (Binary Visualizer)</span>
                    </div>
                    {binaryVisualizer}
                </div>
            )}

            {/* Details Table */}
            {result && (
                <div className="bg-[#070707] border border-white/5 rounded-lg overflow-hidden">
                    <div className="grid grid-cols-1 md:grid-cols-2 divide-y md:divide-y-0 md:divide-x divide-white/5">
                        {[
                            { label: '网络地址 (Network)', value: result.ipLowStr },
                            { label: '广播地址 (Broadcast)', value: result.ipHighStr },
                            { label: '子网掩码 (Netmask)', value: result.prefixMaskStr },
                            { label: '子网通配符 (Wildcard)', value: result.invertedMaskStr },
                            { label: '可用 IP 范围', value: `${result.ipLowStr} - ${result.ipHighStr}` },
                            { label: '总主机数 (Total Hosts)', value: Math.pow(2, 32 - result.prefixSize).toLocaleString() },
                        ].map((item, i) => (
                            <div key={i} className="p-4 flex flex-col gap-1 hover:bg-white/[0.02] transition-colors">
                                <span className="text-[10px] text-gray-500 uppercase font-bold tracking-tight">{item.label}</span>
                                <span className="text-sm text-primary font-medium">{item.value}</span>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* Presets */}
            <div className="flex flex-wrap gap-2 pt-4">
                {presets.map((preset) => (
                    <button
                        key={preset.value}
                        onClick={() => setInput(preset.value)}
                        className="flex items-center gap-2 bg-white/5 hover:bg-white/10 border border-white/10 rounded-full px-4 py-1.5 text-xs text-gray-400 hover:text-white transition-all active:scale-95"
                    >
                        <ChevronRight size={12} className="text-primary/50" />
                        {preset.label}
                        <span className="opacity-30 ml-1">{preset.value}</span>
                    </button>
                ))}
            </div>

            {/* System Info */}
            <div className="p-4 bg-white/5 rounded border border-white/5 flex gap-3 text-[11px] text-gray-500 leading-relaxed">
                <Info size={16} className="shrink-0 text-primary/40" />
                <p>
                    CIDR (无类别域间路由) 允许更灵活地划分 IP 地址空间。
                    绿色位表示网络前缀，灰色位表示该子网内的可分配主机位。
                </p>
            </div>
        </div>
    );
}
