'use client';

import { useEffect, useRef } from 'react';

const MatrixRain = () => {
    const canvasRef = useRef<HTMLCanvasElement>(null);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        // --- Configuration ---
        const bgColor = 'rgba(10, 10, 10, 0.08)'; // Slower fade for smoother trails

        // Semantic Content - Single characters only for cleaner look
        const techChars = 'func go def class chan 0x 10 01'.split(' ');
        const chineseKeywords = '饭桶日志代码数据系统网络安全黑客矩阵流量节点服务器云端算法函数变量常量指针数组结构体类对象继承接口模块组件框架核心Bug优化';
        const alphanumeric = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';

        // Particle System - Simplified
        interface StreamData {
            x: number;
            y: number;
            speed: number;
            fontSize: number;
            chars: string[];
            opacity: number;
            isForeground: boolean;
        }

        const getRandomChar = (): string => {
            const rand = Math.random();
            if (rand < 0.15) {
                return techChars[Math.floor(Math.random() * techChars.length)];
            } else if (rand < 0.4) {
                return chineseKeywords.charAt(Math.floor(Math.random() * chineseKeywords.length));
            } else {
                return alphanumeric.charAt(Math.floor(Math.random() * alphanumeric.length));
            }
        };

        const createStream = (x: number, h: number, isForeground: boolean): StreamData => {
            const fontSize = isForeground
                ? Math.floor(Math.random() * 4 + 14) // 14-18px
                : Math.floor(Math.random() * 4 + 10); // 10-14px

            const streamLength = Math.floor(Math.random() * 12 + 8); // 8-20 chars
            const chars: string[] = [];
            for (let i = 0; i < streamLength; i++) {
                chars.push(getRandomChar());
            }

            return {
                x,
                y: Math.random() * h * -0.5,
                speed: isForeground ? (Math.random() * 2 + 1.5) : (Math.random() * 1 + 0.5),
                fontSize,
                chars,
                opacity: isForeground ? 0.9 : 0.35,
                isForeground,
            };
        };

        const drawStream = (stream: StreamData, canvasHeight: number) => {
            // Occasional character mutation
            if (Math.random() < 0.03) {
                const idx = Math.floor(Math.random() * stream.chars.length);
                stream.chars[idx] = getRandomChar();
            }

            stream.y += stream.speed;

            // Reset if off screen
            if (stream.y - stream.chars.length * stream.fontSize > canvasHeight) {
                stream.y = Math.random() * -150;
            }

            for (let i = 0; i < stream.chars.length; i++) {
                const char = stream.chars[i];
                const charY = stream.y - i * stream.fontSize;

                if (charY > canvasHeight + 30 || charY < -30) continue;

                ctx.font = `${stream.fontSize}px monospace`;

                if (i === 0) {
                    // Leading character - bright white with glow
                    ctx.fillStyle = stream.isForeground ? '#FFFFFF' : 'rgba(200, 255, 200, 0.8)';
                    if (stream.isForeground) {
                        ctx.shadowBlur = 8;
                        ctx.shadowColor = '#00FF00';
                    }
                } else {
                    ctx.shadowBlur = 0;
                    // Gradient fade for tail
                    const alpha = Math.max(0, (1 - i / stream.chars.length) * stream.opacity * 0.8);
                    ctx.fillStyle = `rgba(0, 255, 0, ${alpha})`;
                }

                ctx.fillText(char, stream.x, charY);
            }
            ctx.shadowBlur = 0;
        };

        // Initialize
        let streams: StreamData[] = [];

        const init = () => {
            canvas.width = canvas.parentElement?.clientWidth || 300;
            canvas.height = canvas.parentElement?.clientHeight || 300;

            streams = [];
            const columnWidth = 28; // Wider spacing = less dense
            const columns = Math.ceil(canvas.width / columnWidth);

            for (let i = 0; i < columns; i++) {
                // 30% foreground, 70% background for depth
                const isForeground = Math.random() < 0.3;
                streams.push(createStream(i * columnWidth + Math.random() * 8, canvas.height, isForeground));
            }
        };

        init();

        // Animation Loop
        let animationId: number;
        const animate = () => {
            ctx.fillStyle = bgColor;
            ctx.fillRect(0, 0, canvas.width, canvas.height);

            // Draw background streams first, then foreground
            streams.filter(s => !s.isForeground).forEach(s => drawStream(s, canvas.height));
            streams.filter(s => s.isForeground).forEach(s => drawStream(s, canvas.height));

            animationId = requestAnimationFrame(animate);
        };

        animationId = requestAnimationFrame(animate);

        const handleResize = () => init();
        window.addEventListener('resize', handleResize);

        return () => {
            cancelAnimationFrame(animationId);
            window.removeEventListener('resize', handleResize);
        };
    }, []);

    return (
        <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
            <canvas ref={canvasRef} className="block w-full h-full opacity-50" />
        </div>
    );
};

export default MatrixRain;
