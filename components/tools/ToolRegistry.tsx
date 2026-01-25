import dynamic from 'next/dynamic';
import { ReactNode } from 'react';

// Dynamic imports for heavy tool components to optimize bundle size
const TimestampConverter = dynamic(() => import('./apps/TimestampConverter'), {
    loading: () => <div className="p-8 text-center text-primary font-mono animate-pulse">[ LOADING_MODULE... ]</div>
});

const JsonParser = dynamic(() => import('./apps/JsonParser'), {
    loading: () => <div className="p-8 text-center text-primary font-mono animate-pulse">[ LOADING_MODULE... ]</div>
});

const Base64Converter = dynamic(() => import('./apps/Base64Converter'), {
    loading: () => <div className="p-8 text-center text-primary font-mono animate-pulse">[ LOADING_MODULE... ]</div>
});

const CronScheduler = dynamic(() => import('./apps/CronScheduler'), {
    loading: () => <div className="p-8 text-center text-primary font-mono animate-pulse">[ LOADING_MODULE... ]</div>
});

export const TOOL_COMPONENTS: Record<string, ReactNode> = {
    'timestamp': <TimestampConverter />,
    'json-parser': <JsonParser />,
    'base64': <Base64Converter />,
    'cron-scheduler': <CronScheduler />,
};

export function getToolComponent(toolId: string): ReactNode {
    return TOOL_COMPONENTS[toolId] || (
        <div className="py-12 text-center space-y-4 font-mono">
            <div className="text-red-500 text-xl font-bold">[ ERROR: MODULE_NOT_FOUND ]</div>
            <p className="text-gray-500 text-sm tracking-widest uppercase">
                模块 ID: {toolId} 未在注册表中找到。
            </p>
        </div>
    );
}
