const isProd = process.env.NODE_ENV === 'production';
const repoName = 'copycode-ryan.github.io'; // 你的仓库名

/** @type {import('next').NextConfig} */
const nextConfig = {
    output: 'export',
    basePath: isProd ? `/${repoName}` : '',
    assetPrefix: isProd ? `/${repoName}` : '',
    images: {
        unoptimized: true,
    },
    swcMinify: true,
};

export default nextConfig;