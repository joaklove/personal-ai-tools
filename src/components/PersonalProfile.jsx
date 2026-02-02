import React, { useEffect, useState } from 'react';
import catAvatar from '../assets/cat-avatar.png';
import { generateAISummary, handleAPIError } from '../services/api';
 
 
 const PersonalProfile = ({ className = '' }) => {
  const [isVisible, setIsVisible] = useState(false);
  const [showSummaryModal, setShowSummaryModal] = useState(false);
  const [isGeneratingSummary, setIsGeneratingSummary] = useState(false);
  const [aiSummary, setAiSummary] = useState('');
  const [summaryError, setSummaryError] = useState('');
 
   // 简单的滚动监听，触发入场动画
   useEffect(() => {
     const observer = new IntersectionObserver(
       ([entry]) => {
         if (entry.isIntersecting) {
           setIsVisible(true);
         }
       },
       { threshold: 0.1 }
     );
     const element = document.getElementById('profile-section');
     if (element) observer.observe(element);
     return () => element && observer.unobserve(element);
   }, []);
 
   const skills = ['React', 'Tailwind', 'Node.js', 'Python', 'UI/UX Design', 'Prompt Engineering'];

  // 生成AI总结
  const handleGenerateSummary = async () => {
    setIsGeneratingSummary(true);
    setSummaryError('');
    setAiSummary('');
    
    try {
      // 收集个人信息
      const personalInfo = `
        职业: 前端开发者和 AI 探索者
        简介: 我是一名前端开发者和 AI 探索者。这个网站不仅是我的作品集，也是我整理的高效 AI 工具库。希望这些工具能激发你的创造力。
        技能: ${skills.join(', ')}
        项目: 个人主页 + AI工具导航站
      `;
      
      // 调用API生成总结
      const summary = await generateAISummary(personalInfo);
      setAiSummary(summary);
      setShowSummaryModal(true);
    } catch (error) {
      const errorMessage = handleAPIError(error);
      setSummaryError(errorMessage);
      setShowSummaryModal(true);
    } finally {
      setIsGeneratingSummary(false);
    }
  };
 
   return (
    <section id="profile-section" className={`py-20 relative overflow-hidden ${className}`}>
       <div className="container mx-auto px-6">
         <div className="flex flex-col md:flex-row items-center gap-12">
            
           {/* 左侧：文字内容 (不对称布局 - 占据较大空间) */}
           <div className={`md:w-3/5 space-y-6 transition-all duration-1000 transform ${isVisible ? 'translate-x-0 opacity-100' : '-translate-x-10 opacity-0'}`}>
             <div className="inline-block px-4 py-2 bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-300 rounded-full text-sm font-semibold mb-2">
               👋 欢迎来到我的空间
             </div>
             <h2 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white leading-tight">
               探索 <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600">AI 技术</span> <br/>
               与设计的无限可能
             </h2>
             <p className="text-lg text-gray-600 dark:text-gray-300 leading-relaxed max-w-2xl">
              我是一名前端开发者和 AI 探索者。这个网站不仅是我的作品集，也是我整理的高效 AI 工具库。希望这些工具能激发你的创造力。
            </p>
            
            {/* AI总结按钮 */}
            <button 
              onClick={handleGenerateSummary}
              disabled={isGeneratingSummary}
              className="mt-6 px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold rounded-full shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 flex items-center gap-2"
              aria-label="生成AI总结"
            >
              {isGeneratingSummary ? (
                <>
                  <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  生成中...
                </>
              ) : (
                <>
                  🤖 AI总结我的简历
                </>
              )}
            </button>
             
             {/* 技能标签 - 逐个延迟入场 */}
             <div className="flex flex-wrap gap-3 mt-8">
               {skills.map((skill, index) => (
                 <span  
                   key={skill}  
                   className={`px-4 py-2 bg-white dark:bg-gray-800 shadow-sm border border-gray-100 dark:border-gray-700 rounded-lg text-sm font-medium text-gray-700 dark:text-gray-200 transition-all duration-500 hover:-translate-y-1 hover:shadow-md hover:border-blue-500 cursor-default`}
                   style={{  
                     transitionDelay: `${index * 100}ms`,
                     opacity: isVisible ? 1 : 0,
                     transform: isVisible ? 'translateY(0)' : 'translateY(20px)'
                   }}
                 >
                   {skill}
                 </span>
               ))}
             </div>
           </div>
 
           {/* 右侧：头像区域 (不对称布局 - 视觉重心) */}
           <div className={`md:w-2/5 flex justify-center md:justify-end transition-all duration-1000 delay-300 transform ${isVisible ? 'translate-x-0 opacity-100' : 'translate-x-10 opacity-0'}`}>
             <div className="relative group">
               {/* 装饰背景圆环 (动画) */}
               <div className="absolute -inset-1 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full blur opacity-25 group-hover:opacity-75 transition duration-1000 group-hover:duration-200"></div>
               
               {/* 头像容器 */}
               <div className="relative w-64 h-64 md:w-80 md:h-80 rounded-full overflow-hidden border-4 border-white dark:border-gray-800 shadow-2xl transform transition-transform duration-500 group-hover:scale-105 group-hover:rotate-2">
                 <img  
                  src={catAvatar} // 黑猫头像
                  alt="Profile"  
                  className="w-full h-full object-cover bg-gray-100"
                  loading="lazy"
                />
                 
                 {/* 悬停时的玻璃拟态遮罩 */}
                 <div className="absolute inset-0 bg-blue-600/20 backdrop-blur-sm opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                   <span className="text-white font-bold text-lg tracking-widest">HELLO!</span>
                 </div>
               </div>
 
               {/* 悬浮装饰元素 */}
               <div className="absolute -bottom-4 -right-4 w-20 h-20 bg-white dark:bg-gray-800 rounded-2xl shadow-xl flex items-center justify-center animate-bounce duration-[3000ms]">
                 <span className="text-4xl">🚀</span>
               </div>
             </div>
           </div>
           
         </div>
          
        </div>

        {/* AI总结模态框 */}
        {showSummaryModal && (
          <div className="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className="bg-white/90 backdrop-blur-xl rounded-xl shadow-2xl max-w-2xl w-full p-6 sm:p-8 border border-white/20">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-xl sm:text-2xl font-bold text-gray-900">🤖 AI 简历总结</h3>
                <button 
                  onClick={() => setShowSummaryModal(false)}
                  className="p-2 rounded-full hover:bg-gray-100 transition-colors"
                  aria-label="关闭"
                >
                  ✕
                </button>
              </div>
              
              {summaryError ? (
                <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
                  <h4 className="font-semibold text-red-800 mb-2">生成失败</h4>
                  <p className="text-red-700">{summaryError}</p>
                </div>
              ) : (
                <div className="space-y-4">
                  <p className="text-gray-600 mb-4">基于您的个人信息，AI 为您生成了以下专业总结：</p>
                  <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-6 shadow-sm border border-gray-200">
                    <div className="prose max-w-none">
                      {aiSummary}
                    </div>
                  </div>
                </div>
              )}
              
              <div className="mt-6 flex gap-4">
                {!summaryError && (
                  <button 
                    onClick={() => navigator.clipboard.writeText(aiSummary)}
                    className="flex-1 py-2 bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200 transition-colors font-medium"
                  >
                    复制总结
                  </button>
                )}
                <button 
                  onClick={() => setShowSummaryModal(false)}
                  className={`flex-1 py-2 ${summaryError ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-700'} rounded-lg hover:${summaryError ? 'bg-blue-700' : 'bg-gray-200'} transition-colors font-medium`}
                >
                  {summaryError ? '重试' : '关闭'}
                </button>
              </div>
            </div>
          </div>
        )}
      </section>
   );
 };

export default PersonalProfile;