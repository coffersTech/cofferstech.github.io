export interface Project {
    name: string;
    description: string;
    techStack: string[];
    status: "Dev" | "Beta" | "Prod" | "Archived";
    githubUrl: string;
    featured: boolean;
}

export const PROJECTS: Project[] = [
    {
        name: "NanoLog",
        description: "A lightweight, zero-dependency structured logger for Go services.",
        techStack: ["Go", "Performance", "Zero-alloc"],
        status: "Prod",
        githubUrl: "https://github.com/copycode-ryan/nanolog",
        featured: true,
    },
    {
        name: "VeloxSync",
        description: "Real-time state synchronization engine for collaborative apps.",
        techStack: ["Rust", "WebSockets", "CRDT"],
        status: "Beta",
        githubUrl: "https://github.com/copycode-ryan/veloxsync",
        featured: true,
    },
    {
        name: "LUMA",
        description: "AI-driven layout generator for modern web interfaces.",
        techStack: ["TypeScript", "Next.js", "OpenAI"],
        status: "Dev",
        githubUrl: "https://github.com/copycode-ryan/luma",
        featured: true,
    },
];
