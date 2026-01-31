# 个人主页 + AI工具导航站

一个集个人品牌展示与AI工具导航于一体的现代化网页应用。

## 项目简介

随着AI技术的快速发展，各种AI工具层出不穷，用户面临以下核心问题：
1. 收藏的AI工具太多，收藏夹乱七八糟，急需一个整理和展示的地方
2. 想对外展示自己，但纯文字的自我介绍太无聊，没有亮点
3. 想给朋友推荐好用的工具，但没有一个集中的链接发给他们

本项目旨在开发一个"个人主页 + AI工具导航站"的网页产品，解决上述问题，为用户提供一个集个人品牌展示与AI工具导航于一体的平台。

## 核心功能

### 1. 个人主页展示
- 个人信息展示（姓名、职业、简介）
- 技能标签展示
- 个人成就展示
- 社交媒体链接

### 2. AI工具导航
- 工具分类浏览（综合、写作、设计、编程、研究）
- 工具搜索功能
- 工具收藏功能
- 工具排序功能
- 响应式网格布局

### 3. 联系表单
- 留言表单
- 直接发送邮件功能
- 用户反馈功能

### 4. 网站分享
- 社交媒体分享
- 链接复制功能

### 5. 其他功能
- 深色模式切换
- 响应式设计（适配各种屏幕尺寸）
- 平滑滚动效果
- 交互动画

## 技术栈

- **前端框架**：React 18
- **构建工具**：Vite 5
- **CSS框架**：Tailwind CSS 3
- **部署平台**：GitHub Pages
- **自动化工具**：GitHub Actions

## 安装和运行

### 前置要求
- Node.js 16.0 或更高版本
- npm 7.0 或更高版本

### 安装步骤

1. **克隆仓库**
```bash
git clone https://github.com/joaklove/personal-ai-tools.git
cd personal-ai-tools
```

2. **安装依赖**
```bash
npm install
```

3. **开发模式运行**
```bash
npm run dev
```
访问 http://localhost:5173/personal-ai-tools/ 查看开发效果

4. **构建生产版本**
```bash
npm run build
```
构建产物会生成在 `dist` 目录中

5. **部署到 GitHub Pages**
```bash
npm run deploy
```
部署成功后，访问 https://joaklove.github.io/personal-ai-tools/ 查看网站

## 项目结构

```
personal-ai-tools/
├── .github/
│   └── workflows/
│       └── deploy.yml        # GitHub Actions 部署配置
├── src/
│   ├── components/
│   │   ├── AITools.jsx        # AI工具导航组件
│   │   ├── ContactForm.jsx    # 联系表单组件
│   │   ├── Navbar.jsx         # 导航栏组件
│   │   └── PersonalProfile.jsx # 个人简介组件
│   ├── data/
│   │   └── tools.js           # AI工具数据
│   ├── App.jsx                # 主应用组件
│   ├── index.css              # 全局样式
│   └── main.jsx               # 应用入口
├── .gitignore                 # Git忽略文件
├── index.html                 # HTML模板
├── package.json               # 项目配置和依赖
├── postcss.config.js          # PostCSS配置
├── tailwind.config.js         # Tailwind CSS配置
├── vite.config.js             # Vite配置
└── 个人主页-AI工具导航站-PRD.md # 产品需求文档
```

## 自定义配置

### 个人信息修改
编辑 `src/components/PersonalProfile.jsx` 文件，修改个人信息、技能标签和成就等内容。

### AI工具管理
编辑 `src/data/tools.js` 文件，添加、修改或删除AI工具数据。

### 网站样式定制
- 修改 `src/index.css` 文件，添加自定义样式
- 修改 `tailwind.config.js` 文件，配置Tailwind CSS主题

## 部署说明

本项目使用 GitHub Actions 自动部署到 GitHub Pages：

1. **部署触发**：推送到 `main` 分支时自动触发
2. **部署分支**：构建产物部署到 `gh-pages` 分支
3. **部署流程**：
   - 检查代码仓库
   - 设置 Node.js 环境
   - 安装依赖
   - 构建项目
   - 部署到 GitHub Pages

## 问题排查

### 常见问题

1. **构建失败**
   - 检查 Node.js 和 npm 版本
   - 检查依赖安装是否成功
   - 查看构建日志中的错误信息

2. **部署失败**
   - 检查 GitHub Actions 权限配置
   - 查看 GitHub Actions 运行日志
   - 确保 `gh-pages` 分支存在且可访问

3. **网站访问问题**
   - 检查 GitHub Pages 部署状态
   - 清除浏览器缓存后重新访问
   - 检查网络连接是否正常

## 贡献指南

欢迎提交 Issue 和 Pull Request 来改进这个项目！

## 许可证

MIT License

## 联系方式

- GitHub: [https://github.com/joaklove](https://github.com/joaklove)
- Email: example@email.com

---

© 2026 个人主页 + AI工具导航站 | 版权所有