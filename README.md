This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.

## Content & MDX Specification

所有内容发布需遵循以下 **Hacker Terminal (赛博终端)** 格式规范。

### 1. Frontmatter (元数据)
文件名建议使用 `kebab-case.mdx`，放置于 `/posts` 目录。

```yaml
---
title: "任务标题 (e.g. 0x0A: 核心协议)"
date: "YYYY-MM-DD"
description: "简短的核心描述"
tags: ["System", "DevLog", "Philosophy"]
---
```

### 2. Specialized Blockquotes (特殊引用)
使用以下语义化前缀来模拟系统日志输出：

- `> **[INFO] ...**`: 常规信息流。
- `> **[STATUS] ...**`: 当前系统/任务状态。
- `> **[CAUTION] ...**`: 警告或内部敏感信息。
- `> **[IDENTITY] ...**`: 执行程序的身份标识。

### 3. Visual Guidelines (视觉准则)
- **代码块**: 优先使用脚本语言 (bash, python, go) 展示技术细节。
- **术语**: 鼓励使用技术术语 (e.g. `Deployment`, `Handshake`, `Protocol`) 以增强沉浸感。
- **ASCII**: 适当使用 ASCII 装饰或十六进制编号 (0x01, 0x02...)。
