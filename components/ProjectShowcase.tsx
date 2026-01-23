import { projects } from "@/config/projects";

const statusColors = {
    Dev: "border-accent-blue text-accent-blue bg-accent-blue/10",
    Beta: "border-primary text-primary bg-primary/10",
    Prod: "border-[#666] text-[#666] bg-[#111]",
};

export default function ProjectShowcase() {
    return (
        <section className="flex flex-col gap-6 mt-20">
            <div className="flex items-center justify-between border-b border-[#222] pb-4">
                <h3 className="text-xl font-bold flex items-center gap-2">
                    <span className="material-symbols-outlined text-primary">folder_open</span>
                    项目展示 (Projects)
                </h3>
                <div className="text-xs text-[#444] font-mono">
                    TOTAL: {projects.length}
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {projects.map((project, index) => (
                    <a
                        key={index}
                        href={project.link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="group relative p-6 rounded-lg border border-[#333] bg-[#0a0a0a] hover:border-primary/50 transition-all overflow-hidden"
                    >
                        {/* Hover Scanline Effect */}
                        <div className="absolute inset-0 bg-primary/5 translate-y-full group-hover:translate-y-0 transition-transform duration-500 ease-in-out pointer-events-none" />

                        <div className="relative z-10 flex flex-col gap-4">
                            <div className="flex justify-between items-start">
                                <h4 className="text-lg font-bold text-white group-hover:text-primary transition-colors">
                                    {project.name}
                                </h4>
                                <span className={`px-2 py-0.5 text-[10px] font-bold rounded border ${statusColors[project.status]}`}>
                                    {project.status.toUpperCase()}
                                </span>
                            </div>

                            <p className="text-sm text-[#888] line-clamp-2">
                                {project.description}
                            </p>

                            <div className="flex flex-wrap gap-2 mt-auto">
                                {project.tags.map((tag) => (
                                    <span key={tag} className="text-xs font-mono text-[#555] bg-[#1a1a1a] px-2 py-1 rounded">
                                        #{tag}
                                    </span>
                                ))}
                            </div>
                        </div>
                    </a>
                ))}
            </div>
        </section>
    );
}
