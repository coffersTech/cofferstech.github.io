'use client';

import { useState, useEffect } from 'react';
import { DatePicker, ConfigProvider, theme, Radio } from 'antd';
import dayjs, { Dayjs } from 'dayjs';
import locale from 'antd/locale/zh_CN';
import 'dayjs/locale/zh-cn';

dayjs.locale('zh-cn');

// UI Utility: Copy to Clipboard
const copyToClipboard = (text: string, callback: () => void) => {
    navigator.clipboard.writeText(text).then(callback);
};

export default function TimestampConverter() {
    const [unit, setUnit] = useState<'seconds' | 'milliseconds'>('seconds');
    const [currentTime, setCurrentTime] = useState<number>(0);
    const [copiedField, setCopiedField] = useState<string | null>(null);

    // TS -> Date state
    const [tsInput, setTsInput] = useState('');
    const [tsToDateResult, setTsToDateResult] = useState('');

    // Date -> TS state
    const [dateInput, setDateInput] = useState<Dayjs | null>(null);
    const [dateToTsResult, setDateToTsResult] = useState('');

    useEffect(() => {
        const updateTime = () => setCurrentTime(Date.now());
        updateTime();
        const interval = setInterval(updateTime, 1000);
        return () => clearInterval(interval);
    }, []);

    const handleCopy = (text: string, field: string) => {
        if (!text || text === '转换后的时间' || text === '转换后的时间戳') return;
        copyToClipboard(text, () => {
            setCopiedField(field);
            setTimeout(() => setCopiedField(null), 2000);
        });
    };

    const currentTs = unit === 'seconds' ? Math.floor(currentTime / 1000) : currentTime;

    // Convert: TS -> Date
    const doTsToDate = () => {
        const val = tsInput.trim();
        if (!val) return;
        const num = parseInt(val, 10);
        if (isNaN(num)) {
            setTsToDateResult('无效的时间戳');
            return;
        }
        const ms = unit === 'seconds' ? num * 1000 : num;
        const date = dayjs(ms);
        setTsToDateResult(date.isValid() ? date.format('YYYY-MM-DD HH:mm:ss') : '超出有效范围');
    };

    // Convert: Date -> TS
    const doDateToTs = () => {
        if (!dateInput) return;
        const ms = dateInput.valueOf();
        const ts = unit === 'seconds' ? Math.floor(ms / 1000) : ms;
        setDateToTsResult(ts.toString());
    };

    return (
        <ConfigProvider
            locale={locale}
            theme={{
                algorithm: theme.darkAlgorithm,
                token: {
                    colorPrimary: '#00ff00',
                    colorBgBase: '#000000',
                    colorBorder: '#333333',
                    borderRadius: 4,
                },
                components: {
                    Input: {
                        colorBgContainer: '#000',
                        colorText: '#00ff00',
                    },
                    Button: {
                        colorPrimary: '#00ff00',
                        colorTextLightSolid: '#000',
                    }
                }
            }}
        >
            <div className="space-y-6 font-mono text-gray-300 max-w-full">
                {/* Unit Selector */}
                <div className="flex items-center gap-4">
                    <Radio.Group onChange={(e) => setUnit(e.target.value)} value={unit}>
                        <Radio value="seconds" className="text-gray-300 text-xs">10位时间戳(秒级)</Radio>
                        <Radio value="milliseconds" className="text-gray-300 text-xs">13位时间戳(毫秒级)</Radio>
                    </Radio.Group>
                </div>

                {/* Row 1: Current Timestamp */}
                <div className="flex flex-wrap border border-white/10 rounded overflow-hidden min-h-[40px]">
                    <div className="bg-white/5 border-r border-white/10 px-4 flex items-center text-[12px] min-w-[120px] py-1">
                        当前时间戳:
                    </div>
                    <div className="flex-1 bg-black px-4 flex items-center text-primary text-sm font-bold min-w-[200px] py-1">
                        {currentTs}
                    </div>
                    <button
                        onClick={() => handleCopy(currentTs.toString(), 'current')}
                        className="bg-primary hover:bg-primary/90 text-black px-6 text-xs font-bold transition-colors min-w-[80px] h-10 ml-auto"
                    >
                        {copiedField === 'current' ? '已复制' : '复制'}
                    </button>
                </div>

                {/* Section Title */}
                <div className="text-[11px] text-gray-500 uppercase tracking-wider pl-1">
                    Unix时间戳(Unix timestamp) → 北京时间
                </div>

                {/* Row 2: TS -> Date */}
                <div className="flex flex-wrap border border-white/10 rounded overflow-hidden min-h-[40px]">
                    <div className="bg-white/5 border-r border-white/10 px-4 flex items-center text-[12px] w-[90px] py-1">
                        时间戳
                    </div>
                    <input
                        type="text"
                        value={tsInput}
                        onChange={(e) => setTsInput(e.target.value)}
                        placeholder="输入时间戳"
                        className="flex-1 bg-black px-4 text-primary text-sm outline-none placeholder:text-gray-700 min-w-[150px] py-1 border-r border-white/10"
                    />
                    <button
                        onClick={doTsToDate}
                        className="bg-primary/10 hover:bg-primary/20 text-primary px-4 text-xs font-bold transition-colors min-w-[120px] py-1 border-r border-white/10"
                    >
                        转换日期→
                    </button>
                    <div className="bg-white/5 border-r border-white/10 px-4 flex items-center text-[12px] w-[90px] py-1">
                        北京时间
                    </div>
                    <div className="flex-1 bg-black px-4 flex items-center text-white text-sm min-w-[180px] py-1">
                        {tsToDateResult || <span className="text-gray-700">转换后的时间</span>}
                    </div>
                    <button
                        onClick={() => handleCopy(tsToDateResult, 'ts_to_date')}
                        className="bg-primary hover:bg-primary/90 text-black px-6 text-xs font-bold transition-colors min-w-[80px] h-10 ml-auto"
                    >
                        {copiedField === 'ts_to_date' ? '已复制' : '复制'}
                    </button>
                </div>

                {/* Section Title */}
                <div className="text-[11px] text-gray-500 uppercase tracking-wider pl-1">
                    北京时间 → Unix时间戳(Unix timestamp)
                </div>

                {/* Row 3: Date -> TS */}
                <div className="flex flex-wrap border border-white/10 rounded overflow-hidden min-h-[40px]">
                    <div className="flex-1 bg-black flex items-center outline-none border-r border-white/10 min-w-[240px]">
                        <DatePicker
                            showTime
                            value={dateInput}
                            onChange={(date) => setDateInput(date)}
                            className="w-full bg-transparent border-none text-primary hover:bg-transparent focus:bg-transparent"
                            placeholder="选择时间 (年-月-日 时:分:秒)"
                            variant="borderless"
                        />
                    </div>
                    <button
                        onClick={doDateToTs}
                        className="bg-primary/10 hover:bg-primary/20 border-r border-white/10 text-primary px-4 text-xs font-bold transition-colors min-w-[120px] py-1"
                    >
                        转换时间戳→
                    </button>
                    <div className="bg-white/5 border-r border-white/10 px-4 flex items-center text-[12px] w-[90px] py-1">
                        时间戳
                    </div>
                    <div className="flex-1 bg-black px-4 flex items-center text-white text-sm min-w-[180px] py-1">
                        {dateToTsResult || <span className="text-gray-700">转换后的时间戳</span>}
                    </div>
                    <button
                        onClick={() => handleCopy(dateToTsResult, 'date_to_ts')}
                        className="bg-primary hover:bg-primary/90 text-black px-6 text-xs font-bold transition-colors min-w-[80px] h-10 ml-auto"
                    >
                        {copiedField === 'date_to_ts' ? '已复制' : '复制'}
                    </button>
                </div>
            </div>
        </ConfigProvider>
    );
}
