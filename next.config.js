/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',  // 启用静态导出
  basePath: process.env.NODE_ENV === 'production' ? '/lushi-tool' : '', // 修改为 lushi-tool
  images: {
    unoptimized: true, // 静态导出时需要禁用图片优化
  },
}

module.exports = nextConfig 