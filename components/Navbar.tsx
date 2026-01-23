export default function Navbar() {
    return (
        <header className="sticky top-0 z-50 w-full border-b border-[#222] bg-background-dark/80 backdrop-blur-md">
            <div className="max-w-[1200px] mx-auto flex items-center justify-between px-6 h-14">
                <div className="flex items-center gap-6 h-full">
                    <div className="flex items-center gap-2 text-primary font-bold">
                        <span className="material-symbols-outlined text-[20px]">terminal</span>
                        <span className="tracking-tight">饭桶日志</span>
                    </div>
                    <nav className="flex h-full items-end gap-1 pt-2 overflow-x-auto no-scrollbar">
                        <a className="flex items-center gap-2 px-4 py-2 bg-[#1a1a1a] border-t border-x border-[#333] rounded-t-lg text-white text-sm" href="#">
                            <span className="material-symbols-outlined text-[16px] text-primary">description</span>
                            index.md
                        </a>
                        <a className="flex items-center gap-2 px-4 py-2 border-t border-x border-transparent hover:bg-[#111] transition-colors rounded-t-lg text-[#666] text-sm" href="#">
                            <span className="material-symbols-outlined text-[16px]">code</span>
                            projects.go
                        </a>
                        <a className="flex items-center gap-2 px-4 py-2 border-t border-x border-transparent hover:bg-[#111] transition-colors rounded-t-lg text-[#666] text-sm" href="#">
                            <span className="material-symbols-outlined text-[16px]">psychology</span>
                            notes.py
                        </a>
                        <a className="flex items-center gap-2 px-4 py-2 border-t border-x border-transparent hover:bg-[#111] transition-colors rounded-t-lg text-[#666] text-sm" href="#">
                            <span className="material-symbols-outlined text-[16px]">person</span>
                            about.sh
                        </a>
                    </nav>
                </div>
                <div className="hidden md:flex items-center gap-4 text-[#444]">
                    <div className="flex items-center gap-2 text-xs border border-[#222] px-3 py-1 rounded">
                        <span className="w-2 h-2 rounded-full bg-primary animate-pulse"></span>
                        系统就绪
                    </div>
                    <span className="material-symbols-outlined text-[20px] cursor-pointer hover:text-white transition-colors">search</span>
                    <span className="material-symbols-outlined text-[20px] cursor-pointer hover:text-white transition-colors">settings</span>
                </div>
            </div>
        </header>
    );
}
