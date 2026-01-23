export interface Project {
    name: string;
    description: string;
    tags: string[];
    status: "Dev" | "Beta" | "Prod";
    link: string;
}

export const projects: Project[] = [
    {
        name: "Rice Bucket Logs",
        description: "A digital journal focused on Go microservices and AI.",
        tags: ["Next.js", "Tailwind", "TypeScript"],
        status: "Dev",
        link: "https://github.com/copycode-ryan",
    },
    {
        name: "Go Microservice Starter",
        description: "High-performance gRPC microservice template with ProtoBuf.",
        tags: ["Go", "gRPC", "Docker"],
        status: "Prod",
        link: "https://github.com/copycode-ryan",
    },
    {
        name: "AI Sandbox",
        description: "Experimental environment for reinforcement learning.",
        tags: ["Python", "PyTorch", "AI"],
        status: "Beta",
        link: "https://github.com/copycode-ryan",
    },
];
