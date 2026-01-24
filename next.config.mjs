/** @type {import('next').NextConfig} */
const nextConfig = {
    output: 'export',
    images: {
        unoptimized: true,
    },
    swcMinify: true,
    transpilePackages: ['antd', '@ant-design/icons'],
};

export default nextConfig;