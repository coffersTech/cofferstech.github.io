'use client';

import { useState, useEffect } from 'react';

interface SystemLogModalProps {
    isOpen: boolean;
    onClose: () => void;
}

// Pre-rendered content from system-logs.mdx (simplified for modal display)
const SYSTEM_LOG_CONTENT = `
> **[INFO] System Initialization...**
> **[INFO] Loading persona: Product Manager | Full-Stack Dev | AI Researcher**
> **[INFO] Status: Hungry**

## 0x01 为什么叫"饭桶"？(The Naming Protocol)

在中文语境里，"饭桶"通常是个 Bug 级别的贬义词——形容一个人除了干饭啥也不会。但在我的**系统架构**里，我赋予了它全新的定义。

### 1. 能量守恒定律 (Input/Output)

程序员的本质是什么？是一个将披萨、咖啡和米饭转化为代码的生物机器。
对于我来说，**"饭"是 Input，"代码"是 Output**。

\`\`\`go
func Life(rice Intake) (Code, error) {
    if rice.Volume == 0 {
        return nil, errors.New("Low Energy Warning")
    }
    return BuildSystem(rice), nil
}
\`\`\`

"饭量决定代码量"——这不仅是一句 Slogan，更是我的运行机制。

### 2. 存储容器 (The Bucket)

我的大脑就像一个被塞满了各种异构数据的缓存区。我需要一个持久化的 Bucket，把这些碎片化的技术栈、踩坑记录 dump 下来。

所以，这里是 **饭桶日志**。既是装饭的桶，也是装日志的桶。

## 0x02 身份的重构 (The Stack Trace)

我不定义角色，我只构建系统。

- **Product Layer**: 以 PM 的视角审视技术
- **Application Layer**: Java / Go / Vue
- **Infrastructure Layer**: Docker、K8s、CI/CD
- **Intelligence Layer**: Python、PyTorch、异构图神经网络

## 0x04 结语 (System Ready)

饭已装好，勺子在手。欢迎来到 **饭桶日志**。

让我们把技术嚼碎了，咽下去，然后—— Build Something Cool.

\`\`\`
[SUCCESS] System mounted at /var/log/rice-bucket
[INFO] Listening on port 80...
\`\`\`
`;

export default function SystemLogModal({ isOpen, onClose }: SystemLogModalProps) {
    const [typedContent, setTypedContent] = useState('');
    const [isTyping, setIsTyping] = useState(false);

    useEffect(() => {
        if (isOpen) {
            setTypedContent('');
            setIsTyping(true);
            let index = 0;
            const content = SYSTEM_LOG_CONTENT.trim();

            const typeInterval = setInterval(() => {
                if (index < content.length) {
                    // Type multiple characters at once for speed
                    const chunkSize = 5;
                    setTypedContent(content.slice(0, index + chunkSize));
                    index += chunkSize;
                } else {
                    clearInterval(typeInterval);
                    setIsTyping(false);
                }
            }, 10);

            return () => clearInterval(typeInterval);
        }
    }, [isOpen]);

    if (!isOpen) return null;

    return (
        <div
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm"
            onClick={onClose}
        >
            <div
                className="relative w-full max-w-3xl max-h-[80vh] bg-[#0A0A0A] border border-primary/50 rounded-lg overflow-hidden shadow-[0_0_30px_rgba(0,255,0,0.2)]"
                onClick={(e) => e.stopPropagation()}
            >
                {/* Terminal Header */}
                <div className="flex items-center justify-between px-4 py-2 bg-[#111] border-b border-[#333]">
                    <div className="flex items-center gap-2">
                        <div className="w-3 h-3 rounded-full bg-red-500"></div>
                        <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                        <div className="w-3 h-3 rounded-full bg-green-500"></div>
                    </div>
                    <span className="font-mono text-xs text-[#666]">cat /var/log/system.log</span>
                    <button
                        onClick={onClose}
                        className="text-[#666] hover:text-white transition-colors font-mono text-sm"
                    >
                        [ESC]
                    </button>
                </div>

                {/* Terminal Content */}
                <div className="p-6 overflow-y-auto max-h-[calc(80vh-48px)] font-mono text-sm text-primary leading-relaxed whitespace-pre-wrap custom-scrollbar">
                    {typedContent}
                    {isTyping && <span className="inline-block w-2 h-4 bg-primary animate-pulse ml-1">|</span>}
                </div>
            </div>
        </div>
    );
}
