'use client';

import { PROJECTS, Project } from "@/config/projects";
import Link from "next/link";
import { useState } from "react";
import ProjectModal from "./ProjectModal";

const statusColors: Record<string, string> = {
    Dev: "border-accent-blue text-accent-blue bg-accent-blue/10",
    Beta: "border-primary text-primary bg-primary/10",
    Prod: "border-[#666] text-[#666] bg-[#111]",
    Archived: "border-red-500 text-red-500 bg-red-500/10",
};

export default function ProjectShowcase() {
    const [selectedProject, setSelectedProject] = useState<Project | null>(null);

    return (
        <section className="flex flex-col gap-6 mt-20">
            <div className="flex items-center justify-between border-b border-[#222] pb-4">
                <h3 className="text-xl font-bold flex items-center gap-2">
                    <span className="material-symbols-outlined text-primary">folder_open</span>
                    项目展示 (Projects)
                </h3>
                <Link
                    href="/projects"
                    className="text-xs text-[#444] font-mono hover:text-primary transition-colors flex items-center gap-1"
                >
                    VIEW ALL <span className="material-symbols-outlined text-[12px]">arrow_forward</span>
                </Link>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {PROJECTS.map((project, index) => (
                    <div
                        key={index}
                        onClick={() => setSelectedProject(project)}
                        className="group relative p-6 rounded-lg border border-[#333] bg-[#0a0a0a] hover:border-primary/50 transition-all overflow-hidden cursor-pointer"
                    >
                        {/* Hover Scanline Effect */}
                        <div className="absolute inset-0 bg-primary/5 translate-y-full group-hover:translate-y-0 transition-transform duration-500 ease-in-out pointer-events-none" />

                        <div className="relative z-10 flex flex-col gap-4">
                            <div className="flex justify-between items-start">
                                <h4 className="text-lg font-bold text-white group-hover:text-primary transition-colors">
                                    {project.name}
                                </h4>
                                <div className="flex gap-2">
                                    {project.featured && (
                                        <span className="px-2 py-0.5 text-[10px] font-bold rounded border border-yellow-500 text-yellow-500 bg-yellow-500/10">
                                            STAR
                                        </span>
                                    )}
                                    <span className={`px-2 py-0.5 text-[10px] font-bold rounded border ${statusColors[project.status]}`}>
                                        {project.status.toUpperCase()}
                                    </span>
                                </div>
                            </div>

                            <p className="text-sm text-[#888] line-clamp-2">
                                {project.description}
                            </p>

                            <div className="flex flex-wrap gap-2 mt-auto">
                                {project.techStack.map((tech) => (
                                    <span key={tech} className="text-xs font-mono text-[#555] bg-[#1a1a1a] px-2 py-1 rounded">
                                        #{tech}
                                    </span>
                                ))}
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            <ProjectModal
                isOpen={!!selectedProject}
                onClose={() => setSelectedProject(null)}
                project={selectedProject}
            />
        </section>
    );
}
