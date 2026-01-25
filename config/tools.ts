export enum ToolCategory {
    DEV = "DEV_CORE",
    OPS = "OPS_CTRL",
    AI = "AI_RESEARCH",
    LIFE = "LIFE_LOGS"
}

export const ToolCategoryLabels: Record<ToolCategory | 'ALL', string> = {
    [ToolCategory.DEV]: "核心开发",
    [ToolCategory.OPS]: "运维管控",
    [ToolCategory.AI]: "学术与AI",
    [ToolCategory.LIFE]: "生活与摸鱼",
    "ALL": "全部模块"
};

export type ToolStatus = 'ready' | 'dev';

export interface ToolItem {
    id: string;
    name: string;
    description: string;
    icon: string; // Lucide icon name string
    category: ToolCategory;
    status: ToolStatus;
    width?: string; // Custom drawer width
}

export const TOOLS_CONFIG: ToolItem[] = [
    {
        id: 'timestamp',
        name: '时间戳转换',
        description: 'Unix 时间戳与北京时间双向转换工具',
        icon: 'Clock',
        category: ToolCategory.DEV,
        status: 'ready',
        width: 'max-w-4xl'
    },
    {
        id: 'json-parser',
        name: 'JSON 格式化',
        description: '校验、美化及压缩 JSON 数据',
        icon: 'FileJson',
        category: ToolCategory.DEV,
        status: 'ready',
        width: 'max-w-4xl'
    },
    {
        id: 'base64',
        name: 'Base64 转换',
        description: '文本与 Base64 编码之间的互转',
        icon: 'Binary',
        category: ToolCategory.DEV,
        status: 'ready'
    },
    {
        id: 'cron-scheduler',
        name: 'Cron 表达式',
        description: '解析及校验 Cron 表达式运行时间',
        icon: 'CalendarClock',
        category: ToolCategory.OPS,
        status: 'ready'
    },
    {
        id: 'lunch-rng',
        name: '随机午餐',
        description: '解决中午吃什么的世纪难题',
        icon: 'Utensils',
        category: ToolCategory.LIFE,
        status: 'dev'
    }
];
