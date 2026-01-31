import React, { useEffect, useState } from 'react';
 
 
 const PersonalProfile = () => {
   const [isVisible, setIsVisible] = useState(false);
 
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
 
   return (
     <section id="profile-section" className="py-20 relative overflow-hidden">
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
                   src="https://api.dicebear.com/7.x/avataaars/svg?seed=Felix" // 这里使用示例头像，你可以换成你自己的图片
                   alt="Profile"  
                   className="w-full h-full object-cover bg-gray-100"
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
     </section>
   );
 };
 
 export default PersonalProfile;