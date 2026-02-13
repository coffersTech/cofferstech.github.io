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
        description: "NanoLog 是一个专为云原生设计的轻量级日志存储引擎。它不像 Elasticsearch 那样沉重，也不像 Plain Text 那样难以检索。它定位为日志界的 SQLite：单二进制文件、极致性能、内置管理面板。",
        techStack: ["Go", "Performance", "Zero-alloc"],
        status: "Prod",
        githubUrl: "https://github.com/coffersTech/nanolog.git",
        featured: true,
    }
];
