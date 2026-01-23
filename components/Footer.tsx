export default function Footer() {
    return (
        <footer className="mt-20 border-t border-[#222] bg-[#050505]">
            <div className="max-w-[1200px] mx-auto px-6 py-10 grid grid-cols-1 md:grid-cols-3 gap-8">
                <div className="flex flex-col gap-4">
                    <div className="text-primary font-bold flex items-center gap-2">
                        <span className="material-symbols-outlined">terminal</span>
                        饭桶日志
                    </div>
                    <p className="text-[#555] text-sm">
                        生活与代码的持续集成。为极简主义者、构建者和好奇者设计。
                    </p>
                </div>
                <div className="flex flex-col gap-4">
                    <h4 className="text-white font-bold text-sm">系统状态</h4>
                    <div className="flex flex-col gap-2 font-mono text-xs text-[#666]">
                        <div className="flex justify-between">
                            <span>CPU使用率</span>
                            <span className="text-primary">1.2%</span>
                        </div>
                        <div className="flex justify-between">
                            <span>内存负载</span>
                            <span className="text-primary">2.4GB / 16GB</span>
                        </div>
                        <div className="flex justify-between">
                            <span>延迟</span>
                            <span className="text-primary">12ms</span>
                        </div>
                        <div className="flex justify-between">
                            <span>坐标</span>
                            <span className="text-white">地球, 太阳系</span>
                        </div>
                    </div>
                </div>
                <div className="flex flex-col gap-4">
                    <h4 className="text-white font-bold text-sm">联系方式</h4>
                    <div className="flex gap-4">
                        {['alternate_email', 'share', 'rss_feed'].map((icon) => (
                            <a key={icon} className="w-10 h-10 rounded border border-[#333] flex items-center justify-center hover:border-primary transition-colors" href="#">
                                <span className="material-symbols-outlined text-[20px]">{icon}</span>
                            </a>
                        ))}
                    </div>
                    <p className="text-[10px] text-[#444] font-mono mt-auto">
                        © 2023 RICE_BUCKET_LOGS v2.4.0. Built with minimal footprint.
                    </p>
                </div>
            </div>
        </footer>
    );
}
