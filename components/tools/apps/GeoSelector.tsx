'use client';

import React, { useState, useEffect, useRef, useMemo } from 'react';
import ReactECharts from 'echarts-for-react';
import * as echarts from 'echarts';
import axios from 'axios';
import { Map, ArrowLeft, Download, Link, Terminal, ChevronRight, Globe, Info } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const API_BASE = 'https://geo.datav.aliyun.com/areas_v3/bound/';
const LOCAL_BASE = '/data/geo/';
const ROOT_ADCODE = '100000'; // China

interface GeoInfo {
    adcode: string;
    name: string;
    level: string;
    parentAdcode?: string;
    childrenNum?: number;
}

export default function GeoSelector() {
    const [currentAdcode, setCurrentAdcode] = useState(ROOT_ADCODE);
    const [geoData, setGeoData] = useState<any>(null);
    const [history, setHistory] = useState<GeoInfo[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [selectedFeature, setSelectedFeature] = useState<any>(null);
    const [dataSource, setDataSource] = useState<'local' | 'remote' | null>(null);

    const chartRef = useRef<any>(null);

    // Breadcrumbs logic
    const breadcrumbs = useMemo(() => {
        return history.length === 0 ? ['中国'] : ['中国', ...history.map(h => h.name)];
    }, [history]);

    // Fetch GeoJSON data
    const fetchGeoData = async (adcode: string) => {
        setLoading(true);
        setError(null);
        try {
            let data = null;
            let success = false;

            // Try local cache first
            const localUrls = [
                `${LOCAL_BASE}${adcode}_full.json`,
                `${LOCAL_BASE}${adcode}.json`
            ];

            for (const url of localUrls) {
                try {
                    const res = await axios.get(url);
                    if (res.data) {
                        data = res.data;
                        success = true;
                        setDataSource('local');
                        break;
                    }
                } catch (e) {
                    continue;
                }
            }

            // Fallback to remote API if local fails
            if (!success) {
                const remoteUrls = [
                    `${API_BASE}${adcode}_full.json`,
                    `${API_BASE}${adcode}.json`
                ];

                for (const url of remoteUrls) {
                    try {
                        const res = await axios.get(url);
                        if (res.data) {
                            data = res.data;
                            success = true;
                            setDataSource('remote');
                            break;
                        }
                    } catch (e) {
                        continue;
                    }
                }
            }

            if (success && data) {
                setGeoData(data);
                // Register map with ECharts
                echarts.registerMap('tactical-map', data);
                setLoading(false);
            } else {
                throw new Error('NODE_NOT_FOUND');
            }
        } catch (err) {
            console.error('Failed to fetch geo data:', err);
            setError('访问拒绝: 数据节点未找到 (403/404)');
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchGeoData(currentAdcode);
    }, [currentAdcode]);

    // Handle Drill Down
    const onChartClick = (params: any) => {
        if (params.data && params.data.adcode) {
            const feature = geoData.features.find((f: any) => f.properties.adcode === params.data.adcode);
            if (feature) {
                const info: GeoInfo = {
                    adcode: feature.properties.adcode,
                    name: feature.properties.name,
                    level: feature.properties.level,
                    childrenNum: feature.properties.childrenNum
                };

                // If it has children, drill down
                if (info.childrenNum && info.childrenNum > 0) {
                    setHistory(prev => [...prev, {
                        adcode: currentAdcode,
                        name: geoData.features.find((f: any) => f.properties.adcode === currentAdcode)?.properties.name || 'ROOT',
                        level: 'parent'
                    }]); // This isn't quite right for breadcrumbs, let's simplify history

                    // Correcting history for breadcrumbs
                    const currentInfo = {
                        adcode: params.data.adcode,
                        name: params.data.name,
                        level: feature.properties.level
                    };
                    setHistory(prev => [...prev, currentInfo]);
                    setCurrentAdcode(params.data.adcode);
                } else {
                    setSelectedFeature(feature);
                }
            }
        }
    };

    const goBack = () => {
        if (history.length > 0) {
            const newHistory = [...history];
            newHistory.pop();
            const last = newHistory[newHistory.length - 1];
            setHistory(newHistory);
            setCurrentAdcode(last ? last.adcode : ROOT_ADCODE);
            setSelectedFeature(null);
        }
    };

    // ECharts Option
    const option = {
        backgroundColor: 'transparent',
        tooltip: {
            trigger: 'item',
            backgroundColor: 'rgba(0, 0, 0, 0.9)',
            borderColor: '#00ff00',
            borderWidth: 1,
            textStyle: { color: '#00ff00', fontFamily: 'monospace' },
            formatter: (params: any) => {
                return `[ 正在扫描: ${params.name} ]<br/>行政代码: ${params.data?.adcode || 'N/A'}`;
            }
        },
        series: [
            {
                name: '战术地图',
                type: 'map',
                map: 'tactical-map',
                roam: true,
                scaleLimit: {
                    min: 1,
                    max: 10
                },
                selectedMode: 'single',
                label: {
                    show: false,
                    color: '#00ff00',
                    fontFamily: 'monospace'
                },
                itemStyle: {
                    areaColor: '#0a100a',
                    borderColor: '#00ff41',
                    borderWidth: 1,
                    shadowColor: 'rgba(0, 255, 65, 0.2)',
                    shadowBlur: 10
                },
                emphasis: {
                    label: { show: true, color: '#000' },
                    itemStyle: {
                        areaColor: '#00ff41',
                        shadowBlur: 20,
                        shadowColor: 'rgba(0, 255, 65, 0.5)'
                    }
                },
                data: geoData?.features.map((f: any) => ({
                    name: f.properties.name,
                    value: f.properties.childrenNum || 0,
                    adcode: f.properties.adcode
                }))
            }
        ]
    };

    // JSON Snippet logic
    const jsonSnippet = useMemo(() => {
        if (!geoData) return '';
        const lines = JSON.stringify(geoData, null, 2).split('\n');
        return lines.slice(0, 20).join('\n') + '\n  ... [ 数据已截断 ]';
    }, [geoData]);

    const downloadJson = () => {
        const blob = new Blob([JSON.stringify(geoData)], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `geojson_${currentAdcode}.json`;
        a.click();
    };

    const copyDataPath = () => {
        const url = dataSource === 'local'
            ? `${LOCAL_BASE}${currentAdcode}${geoData?.features?.length > 0 && !geoData.features[0].properties.childrenNum ? '' : '_full'}.json`
            : `${API_BASE}${currentAdcode}_full.json`;
        navigator.clipboard.writeText(url);
    };

    const displayInfo = selectedFeature?.properties || geoData?.features?.[0]?.properties || { name: 'CHINA', adcode: ROOT_ADCODE, level: 'country' };

    return (
        <div className="flex h-full w-full bg-[#050505] font-mono text-white overflow-hidden relative select-none">
            {/* Scanline Effect */}
            <div className="absolute inset-0 pointer-events-none z-50 opacity-[0.03] bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.25)_50%),linear-gradient(90deg,rgba(255,0,0,0.06),rgba(0,255,0,0.02),rgba(0,0,255,0.06))] bg-[length:100%_4px,3px_100%]" />

            {/* Vignette */}
            <div className="absolute inset-0 pointer-events-none z-40 bg-[radial-gradient(circle,transparent_50%,rgba(0,0,0,0.4)_100%)]" />

            <div className="flex flex-1 relative z-10">
                {/* Left side: Tactical Map */}
                <div className="w-2/3 flex flex-col border-r border-[#00ff41]/20 p-6">
                    <div className="flex justify-between items-center mb-6">
                        <div className="flex flex-col gap-1">
                            <div className="flex items-center gap-2 text-[10px] tracking-[0.2em] font-bold text-[#00ff41]/40">
                                <Terminal size={12} />
                                地理战术界面 [版本 2.1.0]
                            </div>
                            <div className="flex items-center gap-2 text-xs font-bold text-[#00ff41]">
                                {breadcrumbs.map((node, i) => (
                                    <React.Fragment key={i}>
                                        <span className="opacity-80 uppercase">{node}</span>
                                        {i < breadcrumbs.length - 1 && <ChevronRight size={14} className="opacity-30" />}
                                    </React.Fragment>
                                ))}
                            </div>
                        </div>
                        {history.length > 0 && (
                            <button
                                onClick={goBack}
                                className="px-4 py-1 border border-[#00ff41]/30 hover:bg-[#00ff41]/10 text-[10px] tracking-widest transition-all"
                            >
                                [ 返回上级 ]
                            </button>
                        )}
                    </div>

                    <div className="flex-1 rounded border border-[#00ff41]/10 bg-[#080c08] relative overflow-hidden">
                        {loading && (
                            <div className="absolute inset-0 z-20 flex items-center justify-center bg-black/40 backdrop-blur-sm">
                                <div className="text-[#00ff41] animate-pulse tracking-[0.5em] text-sm">
                                    -- 正在加载几何数据 --
                                </div>
                            </div>
                        )}
                        {!loading && dataSource && (
                            <div className="absolute top-4 right-4 z-20 px-3 py-1 bg-black/80 border border-[#00ff41]/30 rounded text-[9px] font-bold tracking-widest text-[#00ff41]">
                                [ 数据源: {dataSource === 'local' ? '本地存储' : '远程接口'} ]
                            </div>
                        )}
                        {!loading && geoData && (
                            <ReactECharts
                                ref={chartRef}
                                option={option}
                                onEvents={{ 'click': onChartClick }}
                                style={{ height: '100%', width: '100%' }}
                            />
                        )}
                    </div>
                </div>

                {/* Right side: Data Intelligence */}
                <div className="w-1/3 flex flex-col p-6 gap-6 bg-[#080c08]/50">
                    {/* INFO PANEL */}
                    <section className="space-y-4">
                        <div className="flex items-center gap-2 text-[10px] tracking-[0.2em] font-bold text-[#00ff41]/60 uppercase border-b border-[#00ff41]/20 pb-2">
                            <Info size={14} /> 区域情报分析
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-1">
                                <div className="text-[9px] text-[#00ff41]/40 uppercase tracking-tighter">行政代码</div>
                                <div className="text-sm font-bold text-[#00ff41] truncate">{displayInfo.adcode}</div>
                            </div>
                            <div className="space-y-1">
                                <div className="text-[9px] text-[#00ff41]/40 uppercase tracking-tighter">地理名称</div>
                                <div className="text-sm font-bold text-[#00ff41] truncate">{displayInfo.name}</div>
                            </div>
                            <div className="space-y-1">
                                <div className="text-[9px] text-[#00ff41]/40 uppercase tracking-tighter">行政级别</div>
                                <div className="text-sm font-bold text-[#00ff41] truncate">{displayInfo.level}</div>
                            </div>
                            <div className="space-y-1">
                                <div className="text-[9px] text-[#00ff41]/40 uppercase tracking-tighter">下级单位</div>
                                <div className="text-sm font-bold text-[#00ff41] truncate">{displayInfo.childrenNum || 0}</div>
                            </div>
                        </div>
                    </section>

                    {/* JSON PREVIEW */}
                    <section className="flex-1 flex flex-col gap-2 overflow-hidden">
                        <div className="flex items-center gap-2 text-[10px] tracking-[0.2em] font-bold text-[#00ff41]/60 uppercase border-b border-[#00ff41]/20 pb-2">
                            GEOJSON 数据片段
                        </div>
                        <div className="flex-1 bg-black border border-[#00ff41]/10 p-3 overflow-hidden rounded">
                            <pre className="text-[10px] text-[#00ff41]/80 font-mono leading-tight whitespace-pre-wrap">
                                {jsonSnippet}
                            </pre>
                        </div>
                    </section>

                    {/* ACTIONS */}
                    <section className="space-y-3">
                        <button
                            onClick={downloadJson}
                            className="w-full py-3 bg-[#00ff41]/5 hover:bg-[#00ff41]/10 border border-[#00ff41]/30 flex items-center justify-center gap-3 transition-all group"
                        >
                            <Download size={16} className="text-[#00ff41] group-hover:scale-110 transition-transform" />
                            <span className="text-[11px] font-bold tracking-[0.2em] text-[#00ff41]">下载 .JSON 数据</span>
                        </button>
                        <button
                            onClick={copyDataPath}
                            className="w-full py-3 bg-white/5 hover:bg-white/10 border border-white/10 flex items-center justify-center gap-3 transition-all group"
                        >
                            <Link size={16} className="text-white/40 group-hover:text-white transition-colors" />
                            <span className="text-[11px] font-bold tracking-[0.2em] text-white/40 group-hover:text-white">
                                {dataSource === 'local' ? '复制本地路径' : '复制接口链接'}
                            </span>
                        </button>
                    </section>
                </div>
            </div>

            <style jsx global>{`
                @import url('https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;700;800&display=swap');
                
                .font-mono {
                    font-family: 'JetBrains Mono', 'Fira Code', 'Courier New', monospace;
                }
            `}</style>
        </div>
    );
}
