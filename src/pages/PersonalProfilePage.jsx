import React from 'react';
import PersonalProfile from '../components/PersonalProfile';

export default function PersonalProfilePage() {
  return (
    <div className="min-h-screen flex flex-col">
      {/* 头部区域 */}
      <header className="pt-24 sm:pt-28 md:pt-32 pb-12 sm:pb-16 md:pb-20 bg-gradient-to-br from-blue-600 via-indigo-600 to-purple-600 text-white relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
          <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold mb-4 sm:mb-6 leading-tight">个人简介</h1>
          <p className="text-sm sm:text-base md:text-lg lg:text-xl opacity-90 max-w-2xl sm:max-w-3xl mx-auto">了解我的背景、技能和经历</p>
        </div>
      </header>

      {/* 主要内容 */}
      <main className="flex-1 py-12 sm:py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <PersonalProfile />
        </div>
      </main>

      {/* 页脚 */}
      <footer className="bg-gray-900 text-white py-8 sm:py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="mb-4 sm:mb-6 md:mb-0">
              <h3 className="text-xl sm:text-2xl font-bold mb-2">个人主页 + AI工具导航站</h3>
              <p className="text-gray-400">© 2026 版权所有</p>
            </div>
            <div className="flex space-x-4 sm:space-x-6">
              <a href="https://github.com" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-white transition-colors duration-300">GitHub</a>
              <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-white transition-colors duration-300">LinkedIn</a>
              <a href="https://x.com" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-white transition-colors duration-300">X</a>
              <a href="mailto:example@email.com" className="text-gray-400 hover:text-white transition-colors duration-300">Email</a>
              <button className="text-gray-400 hover:text-white transition-colors duration-300">分享</button>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}