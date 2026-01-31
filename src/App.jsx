import React, { useState, useEffect, useRef } from 'react'
import Navbar from './components/Navbar'
import PersonalProfile from './components/PersonalProfile'
import AITools from './components/AITools'
import ContactForm from './components/ContactForm'
// import Particles from 'react-tsparticles'

function App() {
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [showShareModal, setShowShareModal] = useState(false);
  const [shareLinkCopied, setShareLinkCopied] = useState(false);

  // 粒子背景初始化
  const particlesInit = async (main) => {
    try {
      // 只加载必要的模块，避免版本检查错误
      await import('tsparticles');
      console.log('Particles initialized successfully');
    } catch (error) {
      console.error('Error initializing particles:', error);
    }
  };

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

  // 复制链接到剪贴板
  const copyShareLink = () => {
    const currentUrl = window.location.href;
    navigator.clipboard.writeText(currentUrl)
      .then(() => {
        setShareLinkCopied(true);
        setTimeout(() => setShareLinkCopied(false), 2000);
      })
      .catch(err => {
        console.error('复制链接失败:', err);
      });
  };

  // 生成社交媒体分享链接
  const getSocialShareLink = (platform) => {
    const currentUrl = window.location.href;
    const title = '个人主页 + AI工具导航站';
    const text = '发现最优质的AI工具，提升你的工作效率和创造力';

    switch (platform) {
      case 'twitter':
        return `https://twitter.com/intent/tweet?url=${encodeURIComponent(currentUrl)}&text=${encodeURIComponent(text)}`;
      case 'facebook':
        return `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(currentUrl)}`;
      case 'linkedin':
        return `https://www.linkedin.com/shareArticle?mini=true&url=${encodeURIComponent(currentUrl)}&title=${encodeURIComponent(title)}&summary=${encodeURIComponent(text)}`;
      default:
        return currentUrl;
    }
  };

  // 打开社交媒体分享
  const openSocialShare = (platform) => {
    const shareUrl = getSocialShareLink(platform);
    window.open(shareUrl, '_blank', 'width=600,height=400');
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      {/* 导航栏 */}
      <Navbar 
        isDarkMode={isDarkMode} 
        setIsDarkMode={setIsDarkMode} 
        isMobileMenuOpen={isMobileMenuOpen} 
        setIsMobileMenuOpen={setIsMobileMenuOpen} 
        isScrolled={isScrolled} 
        showShareModal={showShareModal}
        setShowShareModal={setShowShareModal}
      />

      {/* 头部区域 */}
      <header className="pt-28 pb-16 sm:pt-32 sm:pb-20 bg-gradient-to-br from-blue-600 via-indigo-600 to-purple-600 text-white relative overflow-hidden">
        {/* 粒子背景已临时移除，避免初始化错误 */}
        {/* 
        <Particles
          id="tsparticles"
          options={{
            fullScreen: false,
            particles: {
              number: {
                value: 30, // 减少粒子数量，提高性能
                density: {
                  enable: true,
                  value_area: 800
                }
              },
              color: {
                value: "#ffffff"
              },
              shape: {
                type: "circle"
              },
              opacity: {
                value: 0.5,
                random: true
              },
              size: {
                value: 3,
                random: true
              },
              line_linked: {
                enable: true,
                distance: 100,
                color: "#ffffff",
                opacity: 0.2,
                width: 1
              },
              move: {
                enable: true,
                speed: 1,
                direction: "none",
                random: true
              }
            },
            retina_detect: true
          }}
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            zIndex: -1
          }}
        />
        */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-6 leading-tight">个人主页 + AI工具导航站</h1>
          <p className="text-base sm:text-lg lg:text-xl opacity-90 max-w-3xl mx-auto">发现最优质的AI工具，提升你的工作效率和创造力</p>
          <div className="mt-10 flex flex-col sm:flex-row justify-center gap-4">
            <a href="#tools" className="inline-block bg-white text-blue-600 font-semibold px-6 sm:px-8 py-2 sm:py-3 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
              探索AI工具
            </a>
            <button 
              onClick={() => setShowShareModal(true)}
              className="inline-block bg-blue-700 text-white font-semibold px-6 sm:px-8 py-2 sm:py-3 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 border border-white/20"
            >
              分享网站
            </button>
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
              <a href="https://github.com" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-white transition-colors duration-300">GitHub</a>
              <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-white transition-colors duration-300">LinkedIn</a>
              <a href="https://x.com" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-white transition-colors duration-300">X</a>
              <a href="mailto:example@email.com" className="text-gray-400 hover:text-white transition-colors duration-300">Email</a>
              <button 
                onClick={() => setShowShareModal(true)}
                className="text-gray-400 hover:text-white transition-colors duration-300"
              >
                分享
              </button>
            </div>
          </div>
        </div>
      </footer>

      {/* 分享模态框 */}
      {showShareModal && (
        <div className="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white/80 backdrop-blur-xl rounded-xl shadow-2xl max-w-md w-full p-6 sm:p-8 border border-white/20">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl sm:text-2xl font-bold text-gray-900">分享网站</h3>
              <button 
                onClick={() => setShowShareModal(false)}
                className="p-2 rounded-full hover:bg-gray-100 transition-colors"
                aria-label="关闭"
              >
                ✕
              </button>
            </div>
            
            <p className="text-gray-600 mb-6">通过以下方式分享这个AI工具导航站：</p>
            
            {/* 社交媒体分享 */}
            <div className="flex justify-center gap-4 mb-8">
              <button 
                onClick={() => openSocialShare('twitter')}
                className="p-3 rounded-full bg-blue-100 text-blue-600 hover:bg-blue-200 transition-colors"
                aria-label="分享到X"
              >
                🐦
              </button>
              <button 
                onClick={() => openSocialShare('facebook')}
                className="p-3 rounded-full bg-blue-700 text-white hover:bg-blue-800 transition-colors"
                aria-label="分享到Facebook"
              >
                📘
              </button>
              <button 
                onClick={() => openSocialShare('linkedin')}
                className="p-3 rounded-full bg-blue-600 text-white hover:bg-blue-700 transition-colors"
                aria-label="分享到LinkedIn"
              >
                💼
              </button>
            </div>
            
            {/* 链接复制 */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">复制链接</label>
              <div className="flex">
                <input 
                  type="text" 
                  value={window.location.href} 
                  readOnly 
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-l-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <button 
                  onClick={copyShareLink}
                  className="px-4 py-2 bg-blue-600 text-white rounded-r-lg hover:bg-blue-700 transition-colors"
                >
                  {shareLinkCopied ? '已复制' : '复制'}
                </button>
              </div>
              {shareLinkCopied && (
                <p className="mt-2 text-sm text-green-600">链接已成功复制到剪贴板！</p>
              )}
            </div>
            
            <button 
              onClick={() => setShowShareModal(false)}
              className="w-full py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
            >
              取消
            </button>
          </div>
        </div>
      )}
    </div>
  )
}

export default App
