import React from 'react'; 
 
 // 模拟数据 
 const tools = [ 
   { id: 1, name: "ChatGPT", category: "ChatBot", desc: "OpenAI开发的强大语言模型，擅长对话与写作。", icon: "🤖", color: "from-green-400 to-emerald-600" }, 
   { id: 2, name: "Midjourney", category: "Image", desc: "目前最强的AI绘画工具，艺术感极强。", icon: "🎨", color: "from-purple-400 to-indigo-600" }, 
   { id: 3, name: "Notion AI", category: "Productivity", desc: "集成在笔记中的AI助手，提升写作效率。", icon: "📝", color: "from-gray-400 to-gray-600" }, 
   { id: 4, name: "Stable Diffusion", category: "Image", desc: "开源的图像生成模型，可本地部署。", icon: "🖼️", color: "from-orange-400 to-red-600" }, 
   { id: 5, name: "Github Copilot", category: "Coding", desc: "你的AI结对编程助手，代码自动补全。", icon: "💻", color: "from-blue-400 to-cyan-600" }, 
   { id: 6, name: "Runway", category: "Video", desc: "专业的AI视频编辑和生成工具。", icon: "🎬", color: "from-pink-400 to-rose-600" }, 
 ]; 
 
 const AITools = () => { 
   return ( 
     <section id="tools" className="py-20 bg-gray-50 dark:bg-gray-900/50"> 
       <div className="container mx-auto px-6"> 
         <div className="text-center mb-16"> 
           <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">精选 AI 工具</h2> 
           <p className="text-gray-600 dark:text-gray-400 max-w-2xl mx-auto"> 
             这些是我日常工作中最常用的工具，它们能极大地提升生产力。 
           </p> 
         </div> 
 
         {/* 响应式网格布局 */} 
         <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8"> 
           {tools.map((tool) => ( 
             <div 
               key={tool.id} 
               className="group relative h-full" 
             > 
               {/* 卡片主体 - 包含3D悬浮效果的CSS类 */} 
               <div className="h-full bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg border border-gray-100 dark:border-gray-700 transition-all duration-300 transform hover:-translate-y-2 hover:shadow-2xl overflow-hidden relative z-10"> 
                 
                 {/* 顶部彩色渐变条 */} 
                 <div className={`absolute top-0 left-0 w-full h-1 bg-gradient-to-r ${tool.color}`}></div> 
                 
                 <div className="flex items-start justify-between mb-4"> 
                   <span className="text-4xl">{tool.icon}</span> 
                   <span className="px-3 py-1 text-xs font-semibold bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 rounded-full"> 
                     {tool.category} 
                   </span> 
                 </div> 
                 
                 <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2 group-hover:text-blue-600 transition-colors"> 
                   {tool.name} 
                 </h3> 
                 
                 <p className="text-gray-600 dark:text-gray-400 text-sm leading-relaxed mb-4"> 
                   {tool.desc} 
                 </p> 
                 
                 <a href="#" className="inline-flex items-center text-blue-600 dark:text-blue-400 font-medium text-sm hover:underline"> 
                   访问官网 
                   <svg className="w-4 h-4 ml-1 transform group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 8l4 4m0 0l-4 4m4-4H3"></path></svg> 
                 </a> 
               </div> 
 
               {/* 背景装饰 - 仅悬停显示 */} 
               <div className={`absolute -inset-0.5 bg-gradient-to-r ${tool.color} rounded-2xl opacity-0 group-hover:opacity-30 blur transition duration-300 -z-10`}></div> 
             </div> 
           ))} 
         </div> 
       </div> 
     </section> 
   ); 
 }; 
 
 export default AITools;