'use client';

import { useState } from 'react';
import { PROJECTS, type Project } from '@/config/projects';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import ProjectModal from '@/components/ProjectModal';

// Get unique tech stacks for filter tabs
const allTechStacks = [...new Set(PROJECTS.flatMap(p => p.techStack))];
const filterTabs = ['全部', ...allTechStacks];

// Status color mapping
const statusColors: Record<Project['status'], string> = {
    Dev: 'text-yellow-400 border-yellow-400/50',
    Beta: 'text-blue-400 border-blue-400/50',
    Prod: 'text-primary border-primary/50',
    Archived: 'text-gray-500 border-gray-500/50',
};

const stats = [
    { value: `${PROJECTS.length}`, label: '项目总数' },
    { value: `${PROJECTS.filter(p => p.featured).length}`, label: '精选项目' },
    { value: `${PROJECTS.filter(p => p.status === 'Prod').length}`, label: '已上线' },
    { value: `${allTechStacks.length}`, label: '技术栈' },
];

export default function ProjectsPage() {
    const [activeFilter, setActiveFilter] = useState('全部');
    const [selectedProject, setSelectedProject] = useState<Project | null>(null);

    const filteredProjects = activeFilter === '全部'
        ? PROJECTS
        : PROJECTS.filter(p => p.techStack.some(tech => tech.toLowerCase().includes(activeFilter.toLowerCase())));

    return (
        <div className="min-h-screen bg-background-dark text-white">
            <Navbar />
            <div className="max-w-[1200px] mx-auto px-6 py-16">
                {/* Header */}
                <h1 className="text-4xl md:text-5xl font-bold mb-4">开源项目</h1>
                <p className="text-[#666] text-lg mb-8 max-w-2xl">
                    一系列高性能工具、实验性库和极简实用程序，
                    专为现代 Web 生态系统构建。
                </p>

                {/* Filter Tabs */}
                <div className="flex flex-wrap gap-2 mb-12">
                    {filterTabs.map((tab) => (
                        <button
                            key={tab}
                            onClick={() => setActiveFilter(tab)}
                            className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${activeFilter === tab
                                ? 'bg-primary text-black'
                                : 'border border-[#333] text-[#666] hover:border-primary hover:text-primary'
                                }`}
                        >
                            {tab}
                        </button>
                    ))}
                </div>

                {/* Section Label */}
                <div className="flex items-center gap-4 mb-6">
                    <span className="text-primary font-mono text-sm tracking-wider">精选作品</span>
                    <div className="flex-1 h-px bg-[#222]"></div>
                </div>

                {/* Project Cards Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-16">
                    {filteredProjects.map((project) => (
                        <div
                            key={project.name}
                            onClick={() => setSelectedProject(project)}
                            className="border border-[#222] rounded-lg p-6 bg-[#0d0d0d] hover:border-primary/50 transition-all group cursor-pointer"
                        >
                            {/* Card Header */}
                            <div className="flex items-start justify-between mb-4">
                                <h3 className="text-xl font-bold text-[#d4a020] group-hover:text-primary transition-colors">
                                    {project.name}
                                </h3>
                                <span className={`text-xs font-mono px-2 py-1 border rounded ${statusColors[project.status]}`}>
                                    {project.status}
                                </span>
                            </div>

                            {/* Description */}
                            <p className="text-[#888] text-sm mb-4 line-clamp-2">
                                {project.description}
                            </p>

                            {/* Tags */}
                            <div className="flex flex-wrap gap-2 mb-6">
                                {project.techStack.map((tech) => (
                                    <span
                                        key={tech}
                                        className="px-2 py-1 text-xs font-mono border border-[#333] rounded text-primary bg-primary/5"
                                    >
                                        {tech}
                                    </span>
                                ))}
                            </div>

                            {/* View Code Button */}
                            <button
                                className="flex items-center justify-center gap-2 w-full py-3 border border-primary rounded-lg text-primary font-medium hover:bg-primary hover:text-black transition-all"
                            >
                                <span>&lt;&gt;</span>
                                <span>查看详情</span>
                            </button>
                        </div>
                    ))}
                </div>

                {/* Stats Section */}
                <div className="flex items-center gap-4 mb-6">
                    <span className="text-primary font-mono text-sm tracking-wider">统计数据</span>
                    <div className="flex-1 h-px bg-[#222]"></div>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {stats.map((stat) => (
                        <div
                            key={stat.label}
                            className="border border-[#222] rounded-lg p-6 text-center bg-[#0d0d0d]"
                        >
                            <div className="text-4xl font-bold text-primary mb-2 italic">
                                {stat.value}
                            </div>
                            <div className="text-[#666] text-xs font-mono tracking-wider">
                                {stat.label}
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            <Footer />

            <ProjectModal
                isOpen={!!selectedProject}
                onClose={() => setSelectedProject(null)}
                project={selectedProject}
            />
        </div>
    );
}

