import React, { useState, useEffect, useRef } from 'react'
import Navbar from './components/Navbar'
import PersonalProfile from './components/PersonalProfile'
import AITools from './components/AITools'
import ContactForm from './components/ContactForm'

function App() {
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  // 深色模式处理
  useEffect(() => {
    if (isDarkMode) {
      document.body.classList.add('dark');
      document.body.classList.remove('bg-gray-50');
    } else {
      document.body.classList.remove('dark');
      document.body.classList.add('bg-gray-50');
    }
  }, [isDarkMode]);

  // 节流函数
  const throttle = (func, delay) => {
    let timeoutId;
    return (...args) => {
      if (!timeoutId) {
        timeoutId = setTimeout(() => {
          func.apply(null, args);
          timeoutId = null;
        }, delay);
      }
    };
  };

  // 滚动监听
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 50) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };

    const throttledScroll = throttle(handleScroll, 100);
    window.addEventListener('scroll', throttledScroll);
    return () => window.removeEventListener('scroll', throttledScroll);
  }, []);

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      {/* 导航栏 */}
      <Navbar 
        isDarkMode={isDarkMode} 
        setIsDarkMode={setIsDarkMode} 
        isMobileMenuOpen={isMobileMenuOpen} 
        setIsMobileMenuOpen={setIsMobileMenuOpen} 
        isScrolled={isScrolled} 
      />

      {/* 头部区域 */}
      <header className="pt-28 pb-16 sm:pt-32 sm:pb-20 bg-gradient-to-br from-blue-600 via-indigo-600 to-purple-600 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-6 leading-tight">个人主页 + AI工具导航站</h1>
          <p className="text-base sm:text-lg lg:text-xl opacity-90 max-w-3xl mx-auto">发现最优质的AI工具，提升你的工作效率和创造力</p>
          <div className="mt-10">
            <a href="#tools" className="inline-block bg-white text-blue-600 font-semibold px-6 sm:px-8 py-2 sm:py-3 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
              探索AI工具
            </a>
          </div>
        </div>
      </header>

      {/* 主要内容 */}
      <main className="flex-1 py-12 sm:py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* 个人简介区域 */}
          <PersonalProfile />

          {/* AI工具导航区域 */}
          <AITools />

          {/* 联系区域 */}
          <ContactForm />
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
              <a href="#" className="text-gray-400 hover:text-white transition-colors duration-300">GitHub</a>
              <a href="#" className="text-gray-400 hover:text-white transition-colors duration-300">LinkedIn</a>
              <a href="#" className="text-gray-400 hover:text-white transition-colors duration-300">X</a>
              <a href="#" className="text-gray-400 hover:text-white transition-colors duration-300">Email</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}

export default App
