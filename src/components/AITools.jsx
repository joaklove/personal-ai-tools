import React, { useState, useEffect } from 'react'; 
import { tools, categories, getCategoryDisplayName } from '../data/tools';
import { motion, AnimatePresence } from 'framer-motion';

 const AITools = ({ className = '' }) => { 
   const [selectedCategory, setSelectedCategory] = useState('all');
   const [searchTerm, setSearchTerm] = useState('');
   const [favorites, setFavorites] = useState(() => {
     // 从localStorage读取初始收藏状态
     const savedFavorites = localStorage.getItem('aiToolFavorites');
     return savedFavorites ? JSON.parse(savedFavorites) : [];
   });
   const [showOnlyFavorites, setShowOnlyFavorites] = useState(false);
   const [sortOption, setSortOption] = useState('name'); // name, category, favorite

   // 监听favorites变化并保存到localStorage
   useEffect(() => {
     localStorage.setItem('aiToolFavorites', JSON.stringify(favorites));
   }, [favorites]);

   // 切换收藏状态
   const toggleFavorite = (toolId) => {
     setFavorites(prev => {
       if (prev.includes(toolId)) {
         return prev.filter(id => id !== toolId);
       } else {
         return [...prev, toolId];
       }
     });
   };

   // 检查工具是否已收藏
   const isFavorite = (toolId) => {
     return favorites.includes(toolId);
   };

   // 过滤工具
   const filteredTools = tools.filter(tool => {
     const matchesCategory = selectedCategory === 'all' || tool.category === selectedCategory;
     const matchesSearch = tool.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          tool.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          tool.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()));
     const matchesFavorite = !showOnlyFavorites || isFavorite(tool.id);
     return matchesCategory && matchesSearch && matchesFavorite;
   }).sort((a, b) => {
     // 排序逻辑
     if (sortOption === 'favorite') {
       // 收藏优先
       const aIsFavorite = isFavorite(a.id);
       const bIsFavorite = isFavorite(b.id);
       if (aIsFavorite && !bIsFavorite) return -1;
       if (!aIsFavorite && bIsFavorite) return 1;
     }
     if (sortOption === 'category') {
       // 按分类排序
       return a.category.localeCompare(b.category);
     }
     // 默认按名称排序
     return a.name.localeCompare(b.name);
   });

   // 工具图标映射
   const getToolIcon = (category) => {
     const iconMap = {
       all: '🤖',
       writing: '📝',
       design: '🎨',
       programming: '💻',
       research: '🔍'
     };
     return iconMap[category] || '🤖';
   };

   // 工具颜色映射
   const getToolColor = (category) => {
     const colorMap = {
       all: 'from-blue-400 to-purple-600',
       writing: 'from-green-400 to-emerald-600',
       design: 'from-purple-400 to-indigo-600',
       programming: 'from-blue-400 to-cyan-600',
       research: 'from-orange-400 to-red-600'
     };
     return colorMap[category] || 'from-gray-400 to-gray-600';
   };

   return ( 
    <section id="tools" className={`py-20 bg-gray-50 dark:bg-gray-900/50 ${className}`}> 
       <div className="container mx-auto px-6"> 
         <div className="text-center mb-16"> 
           <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">精选 AI 工具</h2> 
           <p className="text-gray-600 dark:text-gray-400 max-w-2xl mx-auto"> 
             这些是我日常工作中最常用的工具，它们能极大地提升生产力。 
           </p> 
         </div> 

         {/* 搜索和分类筛选 */}
         <div className="mb-12">
           {/* 搜索框 */}
           <div className="max-w-md mx-auto mb-8">
             <div className="relative">
               <input
                 type="text"
                 placeholder="搜索AI工具..."
                 value={searchTerm}
                 onChange={(e) => setSearchTerm(e.target.value)}
                 className="w-full px-4 py-3 pl-10 bg-white dark:bg-gray-800 rounded-full shadow-md border border-gray-200 dark:border-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
               />
               <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
                 🔍
               </span>
             </div>
           </div>

           {/* 收藏筛选和排序 */}
           <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-6">
             <motion.button
               onClick={() => setShowOnlyFavorites(!showOnlyFavorites)}
               className={`flex items-center gap-2 px-5 py-2 rounded-full text-sm font-medium transition-all duration-300 ${showOnlyFavorites ? 
                 'bg-red-600 text-white shadow-md' : 
                 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'}`}
               whileHover={{ scale: 1.05 }}
               whileTap={{ scale: 0.95 }}
             >
               {showOnlyFavorites ? '❤️ 已选择收藏' : '🤍 只看收藏'}
             </motion.button>
             
             {/* 排序选项 */}
             <div className="flex gap-2">
               {[
                 { id: 'name', label: '名称' },
                 { id: 'category', label: '分类' },
                 { id: 'favorite', label: '收藏' }
               ].map((option) => (
                 <motion.button
                   key={option.id}
                   onClick={() => setSortOption(option.id)}
                   className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 ${sortOption === option.id ? 
                     'bg-blue-600 text-white shadow-md' : 
                     'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'}`}
                   whileHover={{ scale: 1.05 }}
                   whileTap={{ scale: 0.95 }}
                 >
                   {option.label}
                 </motion.button>
               ))}
             </div>
           </div>

           {/* 分类筛选 */}
           <div className="flex flex-wrap justify-center gap-3">
             {categories.map((category, index) => (
               <motion.button
                 key={category.id}
                 onClick={() => setSelectedCategory(category.id)}
                 className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 ${selectedCategory === category.id ? 
                   'bg-blue-600 text-white shadow-md' : 
                   'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'}`}
                 initial={{ opacity: 0, y: 20 }}
                 animate={{ opacity: 1, y: 0 }}
                 transition={{ delay: index * 0.1 }}
                 whileHover={{ scale: 1.05 }}
                 whileTap={{ scale: 0.95 }}
               >
                 {getToolIcon(category.id)} {category.displayName}
               </motion.button>
             ))}
           </div>
         </div>

         {/* 工具数量统计 */}
         <div className="text-center mb-8">
           <p className="text-gray-600 dark:text-gray-400">
             {showOnlyFavorites ? (
               <>
                 共收藏了 {favorites.length} 个AI工具，当前显示 {filteredTools.length} 个{selectedCategory !== 'all' ? ` ${getCategoryDisplayName(selectedCategory)}` : ''} 收藏工具
               </>
             ) : (
               <>
                 找到 {filteredTools.length} 个{selectedCategory !== 'all' ? ` ${getCategoryDisplayName(selectedCategory)}` : ''} AI工具
                 {favorites.length > 0 && ` (已收藏 ${favorites.length} 个)`}
               </>
             )}
           </p>
         </div>

         {/* 响应式网格布局 */} 
         <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8"> 
           <AnimatePresence>
             {filteredTools.map((tool, index) => ( 
               <motion.div 
                 key={tool.id} 
                 className="group relative h-full"
                 initial={{ opacity: 0, y: 50 }}
                 animate={{ opacity: 1, y: 0 }}
                 exit={{ opacity: 0, scale: 0.8 }}
                 transition={{
                   duration: 0.5,
                   delay: index * 0.1,
                   ease: "easeOut"
                 }}
                 whileHover={{ y: -5 }}
               > 
                 {/* 卡片主体 - 包含3D悬浮效果的CSS类 */} 
                 <motion.div 
                   className="h-full bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg border border-gray-100 dark:border-gray-700 overflow-hidden relative z-10"
                   whileHover={{ 
                     boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)",
                     scale: 1.02
                   }}
                 > 
                   
                   {/* 顶部彩色渐变条 */} 
                   <div className={`absolute top-0 left-0 w-full h-1 bg-gradient-to-r ${getToolColor(tool.category)}`}></div> 
                   
                   <div className="flex items-start justify-between mb-4"> 
                     <motion.span 
                       className="text-4xl"
                       whileHover={{ scale: 1.2, rotate: 10 }}
                       transition={{ type: "spring", stiffness: 400, damping: 10 }}
                     >
                       {getToolIcon(tool.category)}
                     </motion.span> 
                     <div className="flex items-center gap-2">
                       <motion.button
                         onClick={() => toggleFavorite(tool.id)}
                         className={`p-2 rounded-full ${isFavorite(tool.id) ? 'bg-red-100 text-red-500' : 'bg-gray-100 text-gray-400'} hover:bg-red-100 hover:text-red-500 transition-colors`}
                         whileHover={{ scale: 1.2, rotate: 5 }}
                         whileTap={{ scale: 0.9 }}
                         initial={{ opacity: 0, y: -10 }}
                         animate={{ opacity: 1, y: 0 }}
                         transition={{ delay: 0.2 }}
                         aria-label={isFavorite(tool.id) ? '取消收藏' : '收藏工具'}
                       >
                         <motion.span
                           key={isFavorite(tool.id)}
                           initial={{ scale: 0.8, opacity: 0 }}
                           animate={{ scale: 1, opacity: 1 }}
                           transition={{ duration: 0.3 }}
                         >
                           {isFavorite(tool.id) ? '❤️' : '🤍'}
                         </motion.span>
                       </motion.button>
                       <span className="px-3 py-1 text-xs font-semibold bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 rounded-full"> 
                         {getCategoryDisplayName(tool.category)} 
                       </span>
                     </div>
                   </div> 
                   
                   <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2 group-hover:text-blue-600 transition-colors"> 
                     {tool.name} 
                   </h3> 
                   
                   <p className="text-gray-600 dark:text-gray-400 text-sm leading-relaxed mb-4"> 
                     {tool.description} 
                   </p>

                   {/* 推荐指数 */}
                   <div className="flex items-center gap-2 mb-4">
                     <span className="text-sm font-medium text-gray-700 dark:text-gray-300">推荐指数：</span>
                     <div className="flex">
                       {'⭐'.repeat(Math.min(5, Math.floor(Math.random() * 3) + 3))}
                     </div>
                   </div>

                   {/* 标签 */}
                   <div className="flex flex-wrap gap-2 mb-4">
                     {tool.tags.slice(0, 3).map((tag, tagIndex) => (
                       <motion.span 
                         key={tagIndex} 
                         className="px-2 py-1 text-xs bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 rounded"
                         initial={{ opacity: 0, x: -10 }}
                         animate={{ opacity: 1, x: 0 }}
                         transition={{ delay: index * 0.1 + tagIndex * 0.05 }}
                         whileHover={{ scale: 1.1, backgroundColor: "rgba(59, 130, 246, 0.1)", color: "rgb(37, 99, 235)" }}
                       >
                         {tag}
                       </motion.span>
                     ))}
                   </div>
                   
                   <motion.a 
                     href={tool.url} 
                     target="_blank" 
                     rel="noopener noreferrer" 
                     className="inline-flex items-center text-blue-600 dark:text-blue-400 font-medium text-sm hover:underline"
                     whileHover={{ x: 5 }}
                     whileTap={{ scale: 0.95 }}
                   > 
                     访问官网 
                     <svg className="w-4 h-4 ml-1 transform group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 8l4 4m0 0l-4 4m4-4H3"></path></svg> 
                   </motion.a> 
                 </motion.div> 

                 {/* 背景装饰 - 仅悬停显示 */} 
                 <motion.div 
                   className={`absolute -inset-0.5 bg-gradient-to-r ${getToolColor(tool.category)} rounded-2xl opacity-0 blur -z-10`}
                   whileHover={{ opacity: 0.3 }}
                   transition={{ duration: 0.3 }}
                 ></motion.div> 
               </motion.div> 
             ))}
             
             {/* 无结果提示 */}
             {filteredTools.length === 0 && (
               <motion.div 
                 className="col-span-full py-16 text-center"
                 initial={{ opacity: 0, scale: 0.9 }}
                 animate={{ opacity: 1, scale: 1 }}
                 exit={{ opacity: 0, scale: 0.9 }}
                 transition={{ duration: 0.3 }}
               >
                 <motion.div 
                   className="inline-block p-4 bg-gray-100 dark:bg-gray-800 rounded-full mb-4"
                   animate={{ 
                     scale: [1, 1.1, 1],
                     rotate: [0, 5, -5, 0]
                   }}
                   transition={{ 
                     duration: 2,
                     repeat: Infinity,
                     repeatType: "reverse"
                   }}
                 >
                   🔍
                 </motion.div>
                 <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">未找到匹配的工具</h3>
                 <p className="text-gray-600 dark:text-gray-400">
                   尝试调整搜索条件或选择其他分类
                 </p>
               </motion.div>
             )} 
           </AnimatePresence>
         </div> 
       </div> 
     </section> 
   ); 
 }; 

export default AITools;