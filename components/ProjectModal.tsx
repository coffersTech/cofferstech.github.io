'use client';

import { Project } from '@/config/projects';

interface ProjectModalProps {
    isOpen: boolean;
    onClose: () => void;
    project: Project | null;
}

export default function ProjectModal({ isOpen, onClose, project }: ProjectModalProps) {
    if (!isOpen || !project) return null;

    return (
        <div
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm"
            onClick={onClose}
        >
            <div
                className="relative w-full max-w-2xl bg-[#0A0A0A] border border-primary/50 rounded-lg overflow-hidden shadow-[0_0_30px_rgba(0,255,0,0.15)] flex flex-col"
                onClick={(e) => e.stopPropagation()}
            >
                {/* Terminal Header */}
                <div className="flex items-center justify-between px-4 py-3 bg-[#111] border-b border-[#333]">
                    <div className="flex items-center gap-2">
                        <div className="w-3 h-3 rounded-full bg-red-500 hover:bg-red-600 cursor-pointer transition-colors" onClick={onClose}></div>
                        <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                        <div className="w-3 h-3 rounded-full bg-green-500"></div>
                    </div>
                    <span className="font-mono text-xs text-[#666]">
                        ./view_project.sh --target="{project.name.toLowerCase()}"
                    </span>
                    <button
                        onClick={onClose}
                        className="text-[#666] hover:text-white transition-colors font-mono text-sm"
                    >
                        [ESC]
                    </button>
                </div>

                {/* Content */}
                <div className="p-8 flex flex-col gap-6 text-white font-mono">

                    {/* Title & Status */}
                    <div className="flex items-start justify-between border-b border-white/10 pb-6">
                        <div>
                            <h2 className="text-2xl font-bold flex items-center gap-3 text-primary">
                                <span className="material-symbols-outlined">folder_open</span>
                                {project.name}
                            </h2>
                            <div className="mt-2 flex gap-2">
                                {project.techStack.map(tech => (
                                    <span key={tech} className="text-xs px-2 py-1 bg-white/5 rounded text-gray-400 border border-white/5">
                                        {tech}
                                    </span>
                                ))}
                            </div>
                        </div>
                        <div className="text-right">
                            {project.featured && (
                                <div className="text-[10px] text-yellow-500 font-bold tracking-widest mb-1">RECOMMENDED</div>
                            )}
                            <div className={`text-xs px-3 py-1 rounded border inline-block font-bold 
                                ${project.status === 'Prod' ? 'border-[#666] text-[#666] bg-[#111]' :
                                    project.status === 'Beta' ? 'border-primary text-primary bg-primary/10' :
                                        'border-accent-blue text-accent-blue bg-accent-blue/10'}`}>
                                {project.status.toUpperCase()}
                            </div>
                        </div>
                    </div>

                    {/* Description */}
                    <div className="space-y-4">
                        <div className="text-sm text-gray-500 uppercase tracking-widest font-bold">
                            [ README.md ]
                        </div>
                        <p className="text-gray-300 leading-relaxed text-sm">
                            {project.description}
                        </p>
                        {/* Placeholder for future extended description */}
                        <p className="text-gray-500 italic text-xs">
                            root@rice-bucket:~/projects/{project.name.toLowerCase()} $ cat detailed_description.txt
                            <br />
                            <span className="opacity-50">Loading additional resources... Done.</span>
                        </p>
                    </div>

                    {/* Actions */}
                    <div className="mt-4 flex gap-4 pt-6 border-t border-white/10">
                        <a
                            href={project.githubUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex-1 bg-primary text-black font-bold py-3 rounded-lg flex items-center justify-center gap-2 hover:opacity-90 transition-opacity"
                        >
                            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" /></svg>
                            View on GitHub
                        </a>
                        <button
                            onClick={onClose}
                            className="flex-1 border border-[#333] text-white font-bold py-3 rounded-lg hover:border-white/20 transition-colors"
                        >
                            Close
                        </button>
                    </div>

                </div>
            </div>
        </div>
    );
}
