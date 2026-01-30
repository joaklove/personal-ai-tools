# Git安装计划

## 安装目标
在G盘创建一个新的文件夹，并在其中安装Git版本控制系统。

## 安装步骤

### 1. 准备工作
- 创建安装目录：`G:\Git`

### 2. 下载Git安装包
- 访问Git官方网站：https://git-scm.com/downloads
- 下载适合Windows系统的Git安装包（64位版本）

### 3. 安装Git
- 运行下载的安装程序
- 选择自定义安装路径：`G:\Git`
- 保持默认安装选项，确保勾选以下功能：
  - Git Bash
  - Git GUI
  - Git LFS
  - 添加Git到系统PATH环境变量

### 4. 验证安装
- 打开命令提示符或PowerShell
- 运行命令：`git --version`
- 确认输出Git版本信息，验证安装成功

### 5. 配置Git（可选）
- 设置用户名：`git config --global user.name "Your Name"`
- 设置邮箱：`git config --global user.email "your.email@example.com"`

## 预期结果
- Git成功安装在G盘的Git文件夹中
- 可以通过命令行使用Git命令
- 后续可以使用Git克隆和管理代码仓库

## 注意事项
- 安装过程中确保有足够的磁盘空间
- 安装完成后需要重新打开命令行窗口以加载新的环境变量
- 保持安装过程中的网络连接稳定