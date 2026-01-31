import React from 'react'
import PropTypes from 'prop-types'

const Navbar = ({ 
  isDarkMode, 
  setIsDarkMode, 
  isMobileMenuOpen, 
  setIsMobileMenuOpen, 
  isScrolled, 
  showShareModal = false, 
  setShowShareModal = () => {}
}) => {
  return (
    <nav className={`fixed top-4 left-4 right-4 rounded-xl z-50 transition-all duration-300 ${
      isScrolled 
        ? 'bg-white/80 backdrop-blur-xl shadow-lg' 
        : 'bg-white/90 backdrop-blur-md shadow-md'
    }`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <a href="#" className="text-xl sm:text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">个人主页</a>
          </div>
          
          {/* 桌面导航 */}
          <div className="hidden md:flex items-center space-x-6">
            <a href="#profile-section" className="nav-link text-base font-medium">个人简介</a>
            <a href="#tools" className="nav-link text-base font-medium">AI工具</a>
            <a href="#contact" className="nav-link text-base font-medium">联系我</a>
            <button
              onClick={() => setShowShareModal(true)}
              className="p-2 rounded-full hover:bg-gray-100 transition-all duration-300 transform hover:scale-110"
              aria-label="分享网站"
            >
              📤
            </button>
            <button
              onClick={() => setIsDarkMode(!isDarkMode)}
              className="p-2 rounded-full hover:bg-gray-100 transition-all duration-300 transform hover:scale-110"
              aria-label={isDarkMode ? '切换到浅色模式' : '切换到深色模式'}
            >
              {isDarkMode ? '☀️' : '🌙'}
            </button>
          </div>
          
          {/* 移动导航 */}
          <div className="md:hidden flex items-center">
            <button
              onClick={() => setShowShareModal(true)}
              className="p-2 rounded-full hover:bg-gray-100 transition-all duration-300 mr-2"
              aria-label="分享网站"
            >
              📤
            </button>
            <button
              onClick={() => setIsDarkMode(!isDarkMode)}
              className="p-2 rounded-full hover:bg-gray-100 transition-all duration-300 mr-2"
              aria-label={isDarkMode ? '切换到浅色模式' : '切换到深色模式'}
            >
              {isDarkMode ? '☀️' : '🌙'}
            </button>
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="p-2 rounded-md hover:bg-gray-100 transition-colors"
              aria-label="打开菜单"
            >
              {isMobileMenuOpen ? '✕' : '☰'}
            </button>
          </div>
        </div>
        
        {/* 移动菜单 */}
        {isMobileMenuOpen && (
          <div className="md:hidden py-4 space-y-4">
            <a href="#profile-section" className="block nav-link text-base font-medium py-2" onClick={() => setIsMobileMenuOpen(false)}>个人简介</a>
            <a href="#tools" className="block nav-link text-base font-medium py-2" onClick={() => setIsMobileMenuOpen(false)}>AI工具</a>
            <a href="#contact" className="block nav-link text-base font-medium py-2" onClick={() => setIsMobileMenuOpen(false)}>联系我</a>
            <button 
              className="block nav-link text-base font-medium py-2" 
              onClick={() => {
                setShowShareModal(true);
                setIsMobileMenuOpen(false);
              }}
            >
              分享网站
            </button>
          </div>
        )}
      </div>
    </nav>
  )
}

Navbar.propTypes = {
  isDarkMode: PropTypes.bool.isRequired,
  setIsDarkMode: PropTypes.func.isRequired,
  isMobileMenuOpen: PropTypes.bool.isRequired,
  setIsMobileMenuOpen: PropTypes.func.isRequired,
  isScrolled: PropTypes.bool.isRequired,
  showShareModal: PropTypes.bool,
  setShowShareModal: PropTypes.func
}

export default Navbar