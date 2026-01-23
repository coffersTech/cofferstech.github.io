import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import Footer from "@/components/Footer";
import ProjectShowcase from "@/components/ProjectShowcase";

export default function Home() {
  return (
    <div className="relative min-h-screen w-full flex flex-col overflow-x-hidden pixel-grid">
      <Navbar />

      {/* Main Content */}
      <main className="flex-1 max-w-[1200px] mx-auto w-full px-6 py-10">
        <Hero />

        <ProjectShowcase />

        {/* System Log Section */}
        <section className="flex flex-col gap-2 mt-20">
          <div className="flex items-center justify-between border-b border-[#222] pb-4 mb-4">
            <h3 className="text-xl font-bold flex items-center gap-2">
              <span className="material-symbols-outlined text-primary">format_list_bulleted</span>
              系统日志
            </h3>
            <div className="text-xs text-[#444] font-mono">
              运行时间: 1248:12:05:59
            </div>
          </div>
          <div className="flex flex-col">
            {/* Log Items */}
            {[
              { date: "2023-11-05 09:15", tag: "GO", class: "border-accent-blue text-accent-blue bg-accent-blue/10", title: "使用 gRPC 和 ProtoBuf 构建高性能微服务" },
              { date: "2023-10-27 14:30", tag: "AI", class: "border-primary text-primary bg-primary/10", title: "生成式 LLM：从分词到注意力机制" },
              { date: "2023-10-15 18:22", tag: "DEV", class: "border-[#666] text-[#666] bg-[#111]", title: "优化 Docker 层级以实现 10倍速 CI/CD 流水线" },
              { date: "2023-10-02 22:45", tag: "AI", class: "border-primary text-primary bg-primary/10", title: "虚拟沙盒环境中的强化学习" },
              { date: "2023-09-28 11:10", tag: "GO", class: "border-accent-blue text-accent-blue bg-accent-blue/10", title: "内存管理：Golang 内部的堆与栈" },
            ].map((item, index) => (
              <div key={index} className="log-entry group flex flex-col md:flex-row md:items-center gap-4 px-4 py-3 rounded-lg transition-all cursor-pointer">
                <span className="text-[#555] font-mono text-sm shrink-0">{item.date}</span>
                <div className="flex items-center gap-3">
                  <span className={`px-2 py-0.5 text-[10px] font-bold rounded border ${item.class}`}>
                    {item.tag}
                  </span>
                  <span className="text-white text-lg group-hover:text-primary transition-colors">{item.title}</span>
                </div>
                <div className="md:ml-auto opacity-0 group-hover:opacity-100 transition-opacity">
                  <span className="material-symbols-outlined text-primary">arrow_right_alt</span>
                </div>
              </div>
            ))}
          </div>
          <div className="mt-8 flex justify-center">
            <button className="text-[#666] hover:text-primary text-sm font-mono flex items-center gap-2 transition-colors">
              [ 加载更多 ]
            </button>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
