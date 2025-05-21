/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',  // 启用静态导出
  basePath: process.env.NODE_ENV === 'production' ? '/next-demo1' : '', // 替换为您的仓库名
  images: {
    unoptimized: true, // 静态导出时需要禁用图片优化
  },
}

module.exports = nextConfig 