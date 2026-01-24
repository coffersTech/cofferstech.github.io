import MatrixRain from "./MatrixRain";

export default function Hero() {
    return (
        <section className="relative grid grid-cols-1 md:grid-cols-2 gap-12 items-center mb-20 min-h-[400px] border border-primary/50 rounded-lg p-8 bg-background-dark/50">
            {/* Matrix Rain Effect - Full Hero Background */}
            <div className="absolute inset-0 z-0 overflow-hidden">
                <MatrixRain />
            </div>

            <div className="flex flex-col gap-6 relative z-10">
                <div className="font-mono text-sm text-[#444] mb-2">
                    rice-bucket-logs:~ user$ ./initialize_landing_page
                </div>
                <div className="flex flex-col gap-2">
                    <h1 className="text-4xl md:text-6xl font-bold tracking-tighter">
                        饭桶日志 <span className="text-primary tracking-widest">&gt;</span>
                    </h1>
                    <div className="flex items-center gap-3">
                        <h2 className="text-primary text-xl md:text-2xl font-mono tracking-wider">饭量决定代码量</h2>
                        <div className="w-3 h-8 bg-primary cursor-blink"></div>
                    </div>
                </div>
                <p className="text-[#888] text-lg max-w-md leading-relaxed">
                    以产品思维，构建全栈系统 (Building Full-Stack Systems with Product Thinking)
                </p>
                <div className="flex gap-4 mt-4">
                    <button className="bg-primary text-black font-bold px-8 py-3 rounded-lg flex items-center gap-2 hover:bg-primary/90 transition-all">
                        <span className="material-symbols-outlined font-bold">visibility</span>
                        cat system.log
                    </button>
                    <button className="border border-[#333] hover:border-primary/50 text-white font-bold px-8 py-3 rounded-lg transition-all">
                        查看源码
                    </button>
                </div>
            </div>
            {/* 3D Wireframe Placeholder */}
            <div className="relative flex items-center justify-center h-full z-10">
                <div className="relative w-72 h-72 md:w-96 md:h-96 wireframe-animate" style={{ perspective: "1000px", transformStyle: "preserve-3d" }}>
                    {/* Outer sphere/geometric wireframe using SVG */}
                    <svg className="absolute inset-0 w-full h-full opacity-40" viewBox="0 0 100 100">
                        <circle cx="50" cy="50" fill="none" r="48" stroke="#00f0ff" strokeWidth="0.2"></circle>
                        <ellipse cx="50" cy="50" fill="none" rx="48" ry="15" stroke="#00f0ff" strokeWidth="0.2"></ellipse>
                        <ellipse cx="50" cy="50" fill="none" rx="15" ry="48" stroke="#00f0ff" strokeWidth="0.2"></ellipse>
                        <path d="M50 2 L50 98 M2 50 L98 50" stroke="#00f0ff" strokeWidth="0.2"></path>
                        <path d="M15 15 L85 85 M15 85 L85 15" stroke="#00f0ff" strokeWidth="0.2"></path>
                    </svg>
                    {/* Inner rice bowl wireframe placeholder */}
                    <div className="absolute inset-0 flex items-center justify-center">
                        <div className="w-40 h-40 border-b-2 border-primary rounded-full opacity-80 flex flex-col items-center justify-end pb-4">
                            <div className="w-32 h-1 bg-primary/40 rounded-full blur-[2px] mb-4"></div>
                            <span className="material-symbols-outlined text-primary text-6xl opacity-60">database</span>
                        </div>
                    </div>
                </div>
                <div className="absolute inset-0 bg-accent-blue/5 blur-[100px] rounded-full -z-10"></div>
            </div>
        </section>
    );
}
