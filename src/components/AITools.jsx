import React, { useState, useEffect } from 'react';
import { tools, categories, getCategoryDisplayName } from '../data/tools';
import { motion, AnimatePresence } from 'framer-motion';
import { generateAIToolRecommendations, enhanceSearch, processNaturalLanguageQuery, compareTools, generateToolAnalysisReport, handleAPIError } from '../services/api';

const AITools = ({ className = '' }) => {
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [favorites, setFavorites] = useState(() => {
    const savedFavorites = localStorage.getItem('aiToolFavorites');
    return savedFavorites ? JSON.parse(savedFavorites) : [];
  });
  const [showOnlyFavorites, setShowOnlyFavorites] = useState(false);
  const [sortOption, setSortOption] = useState('name');
  const [showRecommendationsModal, setShowRecommendationsModal] = useState(false);
  const [isGeneratingRecommendations, setIsGeneratingRecommendations] = useState(false);
  const [aiRecommendations, setAiRecommendations] = useState('');
  const [recommendationError, setRecommendationError] = useState('');
  const [userBehavior, setUserBehavior] = useState([]);
  const [isEnhancingSearch, setIsEnhancingSearch] = useState(false);
  const [enhancedToolIds, setEnhancedToolIds] = useState([]);
  const [searchError, setSearchError] = useState('');
  const [showEnhancedSearch, setShowEnhancedSearch] = useState(false);
  const [searchIntent, setSearchIntent] = useState('');
  const [selectedTools, setSelectedTools] = useState([]);
  const [showComparisonModal, setShowComparisonModal] = useState(false);
  const [toolComparison, setToolComparison] = useState('');
  const [isComparingTools, setIsComparingTools] = useState(false);
  const [comparisonError, setComparisonError] = useState('');
  const [showAnalysisModal, setShowAnalysisModal] = useState(false);
  const [currentToolAnalysis, setCurrentToolAnalysis] = useState('');
  const [isGeneratingAnalysis, setIsGeneratingAnalysis] = useState(false);
  const [analysisError, setAnalysisError] = useState('');
  const [currentTool, setCurrentTool] = useState(null);
  const [showFeedbackModal, setShowFeedbackModal] = useState(false);
  const [selectedToolForFeedback, setSelectedToolForFeedback] = useState(null);
  const [feedbackRating, setFeedbackRating] = useState(5);
  const [feedbackComment, setFeedbackComment] = useState('');
  const [isSubmittingFeedback, setIsSubmittingFeedback] = useState(false);
  const [feedbackSuccess, setFeedbackSuccess] = useState(false);
  const [toolRatings, setToolRatings] = useState(() => {
    const savedRatings = localStorage.getItem('toolRatings');
    return savedRatings ? JSON.parse(savedRatings) : {};
  });

  useEffect(() => {
    localStorage.setItem('aiToolFavorites', JSON.stringify(favorites));
  }, [favorites]);

  useEffect(() => {
    localStorage.setItem('toolRatings', JSON.stringify(toolRatings));
  }, [toolRatings]);

  const toggleFavorite = (toolId) => {
    setFavorites(prev => {
      if (prev.includes(toolId)) {
        return prev.filter(id => id !== toolId);
      } else {
        return [...prev, toolId];
      }
    });
  };

  const isFavorite = (toolId) => {
    return favorites.includes(toolId);
  };

  const recordUserBehavior = (toolId, action, additionalData = {}) => {
    const tool = tools.find(t => t.id === toolId);
    if (tool) {
      const behavior = {
        toolId,
        toolName: tool.name,
        toolCategory: tool.category,
        action,
        timestamp: new Date().toISOString(),
        ...additionalData
      };
      const newBehavior = [...userBehavior, behavior].slice(-50); // 增加历史记录长度到50条
      setUserBehavior(newBehavior);
      localStorage.setItem('userBehavior', JSON.stringify(newBehavior));
      
      // 更新工具使用频率
      updateToolUsageFrequency(toolId);
    }
  };

  // 更新工具使用频率
  const updateToolUsageFrequency = (toolId) => {
    const usageData = JSON.parse(localStorage.getItem('toolUsageFrequency') || '{}');
    const now = new Date().toISOString();
    
    if (!usageData[toolId]) {
      usageData[toolId] = {
        count: 1,
        lastUsed: now,
        totalTimeSpent: 0,
        sessions: [now]
      };
    } else {
      usageData[toolId].count += 1;
      usageData[toolId].lastUsed = now;
      usageData[toolId].sessions.push(now);
      // 只保留最近30天的使用记录
      usageData[toolId].sessions = usageData[toolId].sessions.filter(session => {
        const sessionDate = new Date(session);
        const thirtyDaysAgo = new Date();
        thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
        return sessionDate > thirtyDaysAgo;
      });
    }
    
    localStorage.setItem('toolUsageFrequency', JSON.stringify(usageData));
  };

  // 记录分类筛选行为
  const recordCategoryFilter = (categoryId) => {
    const behavior = {
      categoryId,
      categoryName: categories.find(c => c.id === categoryId)?.displayName || categoryId,
      action: '筛选分类',
      timestamp: new Date().toISOString()
    };
    const newBehavior = [...userBehavior, behavior].slice(-20);
    setUserBehavior(newBehavior);
    localStorage.setItem('userBehavior', JSON.stringify(newBehavior));
  };

  // 记录搜索行为
  const recordSearch = (searchTerm) => {
    const behavior = {
      searchTerm,
      action: '搜索',
      timestamp: new Date().toISOString()
    };
    const newBehavior = [...userBehavior, behavior].slice(-20);
    setUserBehavior(newBehavior);
    localStorage.setItem('userBehavior', JSON.stringify(newBehavior));
  };

  // 记录标签点击行为
  const recordTagClick = (toolId, tag) => {
    recordUserBehavior(toolId, '点击标签', { tag });
  };

  // 切换工具选择状态（用于对比）
  const toggleToolSelection = (toolId) => {
    setSelectedTools(prev => {
      if (prev.includes(toolId)) {
        return prev.filter(id => id !== toolId);
      } else {
        return [...prev, toolId];
      }
    });
  };

  // 清除选择的工具
  const clearToolSelection = () => {
    setSelectedTools([]);
  };

  // 处理工具对比分析
  const handleCompareTools = async () => {
    if (selectedTools.length < 2) {
      alert('请至少选择2个工具进行对比');
      return;
    }
    
    setIsComparingTools(true);
    setComparisonError('');
    setToolComparison('');
    
    try {
      const toolsToCompare = tools.filter(tool => selectedTools.includes(tool.id));
      const comparison = await compareTools(toolsToCompare);
      setToolComparison(comparison);
      setShowComparisonModal(true);
    } catch (error) {
      const errorMessage = handleAPIError(error);
      setComparisonError(errorMessage);
      setShowComparisonModal(true);
    } finally {
      setIsComparingTools(false);
    }
  };

  const handleGenerateToolAnalysis = async (tool) => {
    setIsGeneratingAnalysis(true);
    setAnalysisError('');
    setCurrentToolAnalysis('');
    setCurrentTool(tool);
    
    try {
      const analysis = await generateToolAnalysisReport(tool);
      setCurrentToolAnalysis(analysis);
      setShowAnalysisModal(true);
    } catch (error) {
      const errorMessage = handleAPIError(error);
      setAnalysisError(errorMessage);
      setShowAnalysisModal(true);
    } finally {
      setIsGeneratingAnalysis(false);
    }
  };

  // 打开反馈模态框
  const openFeedbackModal = (tool) => {
    setSelectedToolForFeedback(tool);
    setFeedbackRating(0); // 初始评分为0，这样星星都是灰色的
    setFeedbackComment('');
    setFeedbackSuccess(false);
    setShowFeedbackModal(true);
  };

  // 提交用户反馈
  const submitFeedback = async () => {
    if (!selectedToolForFeedback) return;
    
    setIsSubmittingFeedback(true);
    
    try {
      // 保存评分到本地存储
      const newRatings = {
        ...toolRatings,
        [selectedToolForFeedback.id]: {
          rating: feedbackRating,
          comment: feedbackComment,
          timestamp: new Date().toISOString()
        }
      };
      setToolRatings(newRatings);
      
      // 记录用户行为
      recordUserBehavior(selectedToolForFeedback.id, '提交反馈', {
        rating: feedbackRating,
        comment: feedbackComment
      });
      
      setFeedbackSuccess(true);
      
      // 3秒后关闭模态框
      setTimeout(() => {
        setShowFeedbackModal(false);
      }, 3000);
    } catch (error) {
      console.error('提交反馈失败:', error);
    } finally {
      setIsSubmittingFeedback(false);
    }
  };

  // 获取工具的平均评分
  const getToolRating = (toolId) => {
    return toolRatings[toolId]?.rating || 0;
  };

  // 获取工具的评分数量
  const getToolRatingCount = (toolId) => {
    return toolRatings[toolId] ? 1 : 0; // 简化实现，实际可以扩展为多个评分
  };

  const handleGenerateRecommendations = async () => {
    setIsGeneratingRecommendations(true);
    setRecommendationError('');
    setAiRecommendations('');
    
    try {
      let behaviorSummary = '用户最近的行为：\n';
      
      if (userBehavior.length > 0) {
        // 按行为类型分组
        const behaviorGroups = userBehavior.reduce((groups, behavior) => {
          if (!groups[behavior.action]) {
            groups[behavior.action] = [];
          }
          groups[behavior.action].push(behavior);
          return groups;
        }, {});
        
        // 生成行为摘要
        if (behaviorGroups['筛选分类']) {
          const categories = [...new Set(behaviorGroups['筛选分类'].map(b => b.categoryName))];
          behaviorSummary += `- 筛选了分类：${categories.join('、')}\n`;
        }
        
        if (behaviorGroups['搜索']) {
          const searches = behaviorGroups['搜索'].slice(-3).map(b => b.searchTerm);
          behaviorSummary += `- 搜索了：${searches.join('、')}\n`;
        }
        
        if (behaviorGroups['收藏'] || behaviorGroups['取消收藏']) {
          const favoritedTools = [...new Set([...(behaviorGroups['收藏'] || []), ...(behaviorGroups['取消收藏'] || [])].map(b => b.toolName))];
          behaviorSummary += `- 收藏了工具：${favoritedTools.slice(0, 3).join('、')}\n`;
        }
        
        if (behaviorGroups['访问']) {
          const visitedTools = [...new Set(behaviorGroups['访问'].map(b => b.toolName))];
          behaviorSummary += `- 访问了工具：${visitedTools.slice(0, 3).join('、')}\n`;
        }
        
        if (behaviorGroups['点击标签']) {
          const tags = [...new Set(behaviorGroups['点击标签'].map(b => b.tag))];
          behaviorSummary += `- 点击了标签：${tags.slice(0, 3).join('、')}\n`;
        }
      } else {
        behaviorSummary += '- 浏览了AI工具导航站\n';
        behaviorSummary += '- 查看了多个AI工具类别\n';
      }
      
      // 添加使用频率数据
      const usageData = JSON.parse(localStorage.getItem('toolUsageFrequency') || '{}');
      const frequentTools = Object.entries(usageData)
        .sort(([,a], [,b]) => b.count - a.count)
        .slice(0, 3)
        .map(([toolId, data]) => {
          const tool = tools.find(t => t.id === parseInt(toolId));
          return tool ? tool.name : null;
        })
        .filter(Boolean);
      
      if (frequentTools.length > 0) {
        behaviorSummary += `- 频繁使用的工具：${frequentTools.join('、')}\n`;
      }
      
      behaviorSummary += '\n请根据用户的行为习惯、使用频率和时间因素，推荐3-5个最适合的AI工具，包括推荐理由。';
      
      const recommendations = await generateAIToolRecommendations(behaviorSummary, tools);
      setAiRecommendations(recommendations);
      setShowRecommendationsModal(true);
    } catch (error) {
      const errorMessage = handleAPIError(error);
      setRecommendationError(errorMessage);
      setShowRecommendationsModal(true);
    } finally {
      setIsGeneratingRecommendations(false);
    }
  };

  const handleEnhanceSearch = async (query) => {
    if (!query.trim()) return;
    
    setIsEnhancingSearch(true);
    setSearchError('');
    setEnhancedToolIds([]);
    setSearchIntent('');
    
    try {
      // 分析查询意图
      const intent = await processNaturalLanguageQuery(query);
      setSearchIntent(intent);
      
      // 执行搜索增强
      const enhancedIds = await enhanceSearch(query, tools);
      setEnhancedToolIds(enhancedIds);
      setShowEnhancedSearch(true);
    } catch (error) {
      const errorMessage = handleAPIError(error);
      setSearchError(errorMessage);
      setShowEnhancedSearch(true);
    } finally {
      setIsEnhancingSearch(false);
    }
  };

  const filteredTools = tools.filter(tool => {
    const matchesCategory = selectedCategory === 'all' || tool.category === selectedCategory;
    const matchesSearch = tool.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         tool.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         tool.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesFavorite = !showOnlyFavorites || isFavorite(tool.id);
    return matchesCategory && matchesSearch && matchesFavorite;
  }).sort((a, b) => {
    if (sortOption === 'favorite') {
      const aIsFavorite = isFavorite(a.id);
      const bIsFavorite = isFavorite(b.id);
      if (aIsFavorite && !bIsFavorite) return -1;
      if (!aIsFavorite && bIsFavorite) return 1;
    }
    if (sortOption === 'category') {
      return a.category.localeCompare(b.category);
    }
    return a.name.localeCompare(b.name);
  });

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

  // 处理Markdown内容，确保在网页中正确显示换行和格式
  const renderMarkdown = (content) => {
    if (!content) return '';
    
    // 处理换行
    let html = content.replace(/\n/g, '<br>');
    
    // 处理Markdown标题
    html = html.replace(/#{1,6}\s+([^#]+)/g, '<h3>$1</h3>');
    
    // 处理Markdown列表
    html = html.replace(/^\s*-\s+([^\n]+)/gm, '<li>$1</li>');
    html = html.replace(/(<li>.*<\/li>)/s, '<ul>$1</ul>');
    
    // 处理Markdown粗体
    html = html.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
    
    return html;
  };

  return (
    <section id="tools" className={`py-20 bg-gray-50 dark:bg-gray-900/50 ${className}`}>
      <div className="container mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">精选 AI 工具</h2>
          <p className="text-gray-600 dark:text-gray-400 max-w-2xl mx-auto mb-8">
            这些是我日常工作中最常用的工具，它们能极大地提升生产力。
          </p>
          
          {/* 个性化欢迎信息 */}
          <div className="bg-gradient-to-r from-green-50 to-blue-50 dark:from-green-900/20 dark:to-blue-900/20 rounded-xl p-6 shadow-sm border border-green-100 dark:border-green-800/30 max-w-2xl mx-auto mb-8">
            <div className="flex items-center justify-center gap-3 mb-4">
              <div className="text-2xl">👋</div>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white">个性化推荐</h3>
            </div>
            <p className="text-gray-600 dark:text-gray-400 mb-4">
              {(() => {
                const usageData = JSON.parse(localStorage.getItem('toolUsageFrequency') || '{}');
                const totalUsage = Object.values(usageData).reduce((sum, data) => sum + data.count, 0);
                const frequentTools = Object.entries(usageData)
                  .sort(([,a], [,b]) => b.count - a.count)
                  .slice(0, 1)
                  .map(([toolId, data]) => {
                    const tool = tools.find(t => t.id === parseInt(toolId));
                    return tool ? tool.name : null;
                  })
                  .filter(Boolean);
                
                if (totalUsage === 0) {
                  return '欢迎使用AI工具导航站！开始探索和使用工具，我们会根据您的使用习惯提供个性化推荐。';
                } else if (frequentTools.length > 0) {
                  return `您最近经常使用 ${frequentTools[0]}，我们已经为您准备了更多相关的AI工具推荐。`;
                } else {
                  return '根据您的使用习惯，我们为您准备了个性化的AI工具推荐。';
                }
              })()}
            </p>
            <div className="flex justify-center gap-4">
              <motion.button
                onClick={handleGenerateRecommendations}
                disabled={isGeneratingRecommendations}
                className={`px-6 py-2 rounded-lg text-sm font-medium transition-all duration-300 ${isGeneratingRecommendations ? 
                  'bg-gray-500 text-white shadow-md cursor-not-allowed' : 
                  'bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-md hover:shadow-lg'}`}
                whileHover={!isGeneratingRecommendations ? { scale: 1.05 } : {}}
                whileTap={!isGeneratingRecommendations ? { scale: 0.95 } : {}}
              >
                {isGeneratingRecommendations ? '加载中...' : '获取个性化推荐'}
              </motion.button>
            </div>
          </div>
          
          {/* AI功能总览 */}
          <div className="bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 rounded-2xl p-8 shadow-sm border border-blue-100 dark:border-blue-800/30 max-w-5xl mx-auto">
            <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-6">🤖 AI 增强功能</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <motion.div
                className="bg-white/80 dark:bg-gray-800/80 rounded-xl p-6 shadow-md border border-white/50 dark:border-gray-700/50"
                whileHover={{ y: -5, boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)" }}
                transition={{ duration: 0.3 }}
              >
                <div className="text-3xl mb-4">🎯</div>
                <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">AI 工具推荐</h4>
                <p className="text-gray-600 dark:text-gray-400 text-sm">
                  基于您的浏览行为，AI 为您推荐最适合的工具
                </p>
                <motion.button
                  onClick={handleGenerateRecommendations}
                  disabled={isGeneratingRecommendations}
                  className="mt-4 px-4 py-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg hover:from-blue-700 hover:to-purple-700 transition-colors"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  立即推荐
                </motion.button>
              </motion.div>
              
              <motion.div
                className="bg-white/80 dark:bg-gray-800/80 rounded-xl p-6 shadow-md border border-white/50 dark:border-gray-700/50"
                whileHover={{ y: -5, boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)" }}
                transition={{ duration: 0.3 }}
              >
                <div className="text-3xl mb-4">🔍</div>
                <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">AI 增强搜索</h4>
                <p className="text-gray-600 dark:text-gray-400 text-sm">
                  智能理解搜索意图，提供更准确的搜索结果
                </p>
                <div className="mt-4">
                  <input
                    type="text"
                    placeholder="输入搜索关键词..."
                    className="w-full px-4 py-2 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                    onChange={(e) => setSearchTerm(e.target.value)}
                    value={searchTerm}
                  />
                </div>
              </motion.div>
              
              <motion.div
                className="bg-white/80 dark:bg-gray-800/80 rounded-xl p-6 shadow-md border border-white/50 dark:border-gray-700/50"
                whileHover={{ y: -5, boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)" }}
                transition={{ duration: 0.3 }}
              >
                <div className="text-3xl mb-4">⚖️</div>
                <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">AI 工具对比</h4>
                <p className="text-gray-600 dark:text-gray-400 text-sm">
                  选择多个工具进行详细的对比分析
                </p>
                <div className="mt-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm text-gray-600 dark:text-gray-400">已选择工具</span>
                    <span className="text-sm font-medium text-blue-600 dark:text-blue-400">{selectedTools.length} 个</span>
                  </div>
                  <motion.button
                    onClick={clearToolSelection}
                    className="w-full px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600 transition-colors"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    清除选择
                  </motion.button>
                </div>
              </motion.div>
              
              <motion.div
                className="bg-white/80 dark:bg-gray-800/80 rounded-xl p-6 shadow-md border border-white/50 dark:border-gray-700/50"
                whileHover={{ y: -5, boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)" }}
                transition={{ duration: 0.3 }}
              >
                <div className="text-3xl mb-4">📊</div>
                <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">AI 工具分析</h4>
                <p className="text-gray-600 dark:text-gray-400 text-sm">
                  生成单个工具的详细分析报告
                </p>
                <p className="text-gray-500 dark:text-gray-400 text-xs mt-2">
                  点击工具卡片上的「分析」按钮查看详细报告
                </p>
              </motion.div>
            </div>
          </div>
        </div>

        <div className="mb-12">
          <div className="max-w-md mx-auto mb-8">
            <div className="relative">
              <input
                type="text"
                placeholder="搜索AI工具..."
                value={searchTerm}
                onChange={(e) => {
                  setSearchTerm(e.target.value);
                  if (e.target.value.trim()) {
                    recordSearch(e.target.value);
                  }
                }}
                className="w-full px-4 py-3 pl-10 pr-28 bg-white dark:bg-gray-800 rounded-full shadow-md border border-gray-200 dark:border-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
                🔍
              </span>
              {searchTerm.trim() && (
                <button
                  onClick={() => handleEnhanceSearch(searchTerm)}
                  disabled={isEnhancingSearch}
                  className="absolute right-2 top-1/2 transform -translate-y-1/2 px-3 py-1.5 text-xs font-medium rounded-full bg-blue-600 text-white hover:bg-blue-700 disabled:bg-gray-500 disabled:cursor-not-allowed transition-colors"
                >
                  {isEnhancingSearch ? '增强中...' : '🤖 AI增强'}
                </button>
              )}
            </div>
          </div>

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

            <motion.button
              onClick={handleGenerateRecommendations}
              disabled={isGeneratingRecommendations}
              className={`flex items-center gap-2 px-5 py-2 rounded-full text-sm font-medium transition-all duration-300 ${isGeneratingRecommendations ? 
                'bg-gray-500 text-white shadow-md cursor-not-allowed' : 
                'bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-md hover:shadow-lg'}`}
              whileHover={!isGeneratingRecommendations ? { scale: 1.05 } : {}}
              whileTap={!isGeneratingRecommendations ? { scale: 0.95 } : {}}
            >
              {isGeneratingRecommendations ? (
                <>
                  <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  推荐中...
                </>
              ) : (
                <>
                  🤖 AI推荐
                </>
              )}
            </motion.button>

            {selectedTools.length > 0 && (
              <div className="flex items-center gap-2">
                <motion.button
                  onClick={handleCompareTools}
                  disabled={isComparingTools || selectedTools.length < 2}
                  className={`flex items-center gap-2 px-5 py-2 rounded-full text-sm font-medium transition-all duration-300 ${isComparingTools ? 
                    'bg-gray-500 text-white shadow-md cursor-not-allowed' : 
                    selectedTools.length >= 2 ? 
                    'bg-gradient-to-r from-green-600 to-emerald-600 text-white shadow-md hover:shadow-lg' : 
                    'bg-gray-300 text-gray-600 cursor-not-allowed'}`}
                  whileHover={!isComparingTools && selectedTools.length >= 2 ? { scale: 1.05 } : {}}
                  whileTap={!isComparingTools && selectedTools.length >= 2 ? { scale: 0.95 } : {}}
                >
                  {isComparingTools ? (
                    <>
                      <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      分析中...
                    </>
                  ) : (
                    <>
                      🔄 AI对比 ({selectedTools.length})
                    </>
                  )}
                </motion.button>
                <motion.button
                  onClick={clearToolSelection}
                  className={`flex items-center gap-2 px-3 py-2 rounded-full text-sm font-medium transition-all duration-300 bg-gray-100 text-gray-700 hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700`}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  清除选择
                </motion.button>
              </div>
            )}

            <div className="flex gap-2">
              {
                [
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
                ))
              }
            </div>
          </div>

          <div className="flex flex-wrap justify-center gap-3">
            {categories.map((category, index) => (
              <motion.button
                key={category.id}
                onClick={() => {
                  setSelectedCategory(category.id);
                  recordCategoryFilter(category.id);
                }}
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

        <div className="text-center mb-8">
          <p className="text-gray-600 dark:text-gray-400 mb-4">
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
          
          {/* 用户使用统计 */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 max-w-2xl mx-auto">
            {(() => {
              const usageData = JSON.parse(localStorage.getItem('toolUsageFrequency') || '{}');
              const totalUsage = Object.values(usageData).reduce((sum, data) => sum + data.count, 0);
              const uniqueTools = Object.keys(usageData).length;
              const recentActivity = userBehavior.length;
              
              return [
                {
                  icon: '📈',
                  label: '总使用次数',
                  value: totalUsage,
                  color: 'bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400'
                },
                {
                  icon: '🛠️',
                  label: '使用工具数',
                  value: uniqueTools,
                  color: 'bg-green-100 text-green-600 dark:bg-green-900/30 dark:text-green-400'
                },
                {
                  icon: '🕒',
                  label: '最近活动',
                  value: recentActivity,
                  color: 'bg-purple-100 text-purple-600 dark:bg-purple-900/30 dark:text-purple-400'
                }
              ];
            })().map((stat, index) => (
              <motion.div
                key={index}
                className={`${stat.color} rounded-xl p-4 shadow-sm`}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <div className="text-2xl mb-2">{stat.icon}</div>
                <h4 className="text-sm font-medium mb-1">{stat.label}</h4>
                <p className="text-xl font-bold">{stat.value}</p>
              </motion.div>
            ))}
          </div>
        </div>

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
                <motion.div
                  className="h-full bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg border border-gray-100 dark:border-gray-700 overflow-hidden relative z-10"
                  whileHover={{ 
                    boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)",
                    scale: 1.02
                  }}
                >
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
                        onClick={() => {
                          const currentStatus = isFavorite(tool.id);
                          toggleFavorite(tool.id);
                          recordUserBehavior(tool.id, currentStatus ? '取消收藏' : '收藏');
                        }}
                        className={`p-2 rounded-full ${isFavorite(tool.id) ? 'bg-red-100 text-red-500' : 'bg-gray-100 text-gray-400'} hover:bg-red-100 hover:text-red-500 transition-colors`}
                        whileHover={{ scale: 1.2, rotate: 5 }}
                        whileTap={{ scale: 0.9 }}
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
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
                      <motion.button
                        onClick={() => toggleToolSelection(tool.id)}
                        className={`p-2 rounded-full ${selectedTools.includes(tool.id) ? 'bg-green-100 text-green-500' : 'bg-gray-100 text-gray-400'} hover:bg-green-100 hover:text-green-500 transition-colors`}
                        whileHover={{ scale: 1.2, rotate: 5 }}
                        whileTap={{ scale: 0.9 }}
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                      >
                        <motion.span
                          key={selectedTools.includes(tool.id)}
                          initial={{ scale: 0.8, opacity: 0 }}
                          animate={{ scale: 1, opacity: 1 }}
                          transition={{ duration: 0.3 }}
                        >
                          {selectedTools.includes(tool.id) ? '🔄' : '🔳'}
                        </motion.span>
                      </motion.button>
                      <motion.button
                        onClick={() => handleGenerateToolAnalysis(tool)}
                        className={`p-2 rounded-full bg-blue-100 text-blue-500 hover:bg-blue-200 hover:text-blue-600 transition-colors`}
                        whileHover={{ scale: 1.2, rotate: 5 }}
                        whileTap={{ scale: 0.9 }}
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                      >
                        📊
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

                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-medium text-gray-700 dark:text-gray-300">评分：</span>
                      <div className="flex">
                        {'⭐'.repeat(Math.min(5, Math.max(0, getToolRating(tool.id))))}
                        {'☆'.repeat(Math.max(0, 5 - getToolRating(tool.id)))} 
                        <span className="text-xs text-gray-500 dark:text-gray-400 ml-1">
                          ({getToolRatingCount(tool.id)})
                        </span>
                      </div>
                    </div>
                    <motion.button
                      onClick={() => openFeedbackModal(tool)}
                      className="px-3 py-1 text-xs font-medium rounded-full bg-yellow-100 text-yellow-600 hover:bg-yellow-200 transition-colors"
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      反馈
                    </motion.button>
                  </div>

                  <div className="flex flex-wrap gap-2 mb-4">
                    {tool.tags.slice(0, 3).map((tag, tagIndex) => (
                      <motion.span
                        key={tagIndex}
                        className="px-2 py-1 text-xs bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 rounded cursor-pointer"
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.1 + tagIndex * 0.05 }}
                        whileHover={{ scale: 1.1, backgroundColor: "rgba(59, 130, 246, 0.1)", color: "rgb(37, 99, 235)" }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => recordTagClick(tool.id, tag)}
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
                    onClick={() => recordUserBehavior(tool.id, '访问')}
                  >
                    访问官网
                    <svg className="w-4 h-4 ml-1 transform group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 8l4 4m0 0l-4 4m4-4H3"></path></svg>
                  </motion.a>
                </motion.div>

                <motion.div
                  className={`absolute -inset-0.5 bg-gradient-to-r ${getToolColor(tool.category)} rounded-2xl opacity-0 blur -z-10`}
                  whileHover={{ opacity: 0.3 }}
                  transition={{ duration: 0.3 }}
                ></motion.div>
              </motion.div>
            ))}

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

        {showRecommendationsModal && (
          <div className="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className="bg-white/90 backdrop-blur-xl rounded-xl shadow-2xl max-w-2xl w-full p-6 sm:p-8 border border-white/20">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-xl sm:text-2xl font-bold text-gray-900">🤖 AI 工具推荐</h3>
                <button onClick={() => setShowRecommendationsModal(false)} className="p-2 rounded-full hover:bg-gray-100 transition-colors">
                  ✕
                </button>
              </div>
              
              {recommendationError ? (
                <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
                  <h4 className="font-semibold text-red-800 mb-2">推荐生成失败</h4>
                  <p className="text-red-700">{recommendationError}</p>
                </div>
              ) : (
                <div className="space-y-4">
                  <p className="text-gray-600 mb-4">基于您的浏览行为，AI 为您推荐了以下工具：</p>
                  <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-6 shadow-sm border border-gray-200">
                    <div className="prose max-w-none" dangerouslySetInnerHTML={{ __html: renderMarkdown(aiRecommendations) }}>
                    </div>
                  </div>
                </div>
              )}
              
              <div className="mt-6 flex gap-4">
                {!recommendationError && (
                  <button onClick={() => navigator.clipboard.writeText(aiRecommendations)} className="flex-1 py-2 bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200 transition-colors font-medium">
                    复制推荐
                  </button>
                )}
                <button onClick={() => setShowRecommendationsModal(false)} className={`flex-1 py-2 ${recommendationError ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-700'} rounded-lg hover:${recommendationError ? 'bg-blue-700' : 'bg-gray-200'} transition-colors font-medium`}>
                  {recommendationError ? '重试' : '关闭'}
                </button>
              </div>
            </div>
          </div>
        )}

        {showEnhancedSearch && (
          <div className="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className="bg-white/90 backdrop-blur-xl rounded-xl shadow-2xl max-w-2xl w-full p-6 sm:p-8 border border-white/20">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-xl sm:text-2xl font-bold text-gray-900">🤖 AI 增强搜索</h3>
                <button onClick={() => setShowEnhancedSearch(false)} className="p-2 rounded-full hover:bg-gray-100 transition-colors">
                  ✕
                </button>
              </div>
              
              {searchError ? (
                <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
                  <h4 className="font-semibold text-red-800 mb-2">搜索增强失败</h4>
                  <p className="text-red-700">{searchError}</p>
                </div>
              ) : (
                <div className="space-y-4">
                  <p className="text-gray-600 mb-4">基于您的搜索词 "{searchTerm}"，AI 为您找到了以下相关工具：</p>
                  
                  {searchIntent && (
                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
                      <h4 className="font-semibold text-blue-800 mb-2">🤖 查询意图分析</h4>
                      <p className="text-blue-700 text-sm">{searchIntent}</p>
                    </div>
                  )}
                  
                  {enhancedToolIds.length > 0 ? (
                    <div className="grid grid-cols-1 gap-3">
                      {enhancedToolIds.map((toolId) => {
                        const tool = tools.find(t => t.id === toolId);
                        return tool ? (
                          <div key={toolId} className="bg-white dark:bg-gray-800 rounded-lg p-4 shadow-sm border border-gray-200 flex items-center gap-3">
                            <div className="text-2xl">{getToolIcon(tool.category)}</div>
                            <div className="flex-1">
                              <h4 className="font-semibold text-gray-900 dark:text-white">{tool.name}</h4>
                              <p className="text-sm text-gray-600 dark:text-gray-400">{tool.description}</p>
                              <div className="flex flex-wrap gap-1 mt-2">
                                {tool.tags.slice(0, 3).map((tag, index) => (
                                  <span key={index} className="px-2 py-0.5 text-xs bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 rounded">
                                    {tag}
                                  </span>
                                ))}
                              </div>
                            </div>
                            <a 
                              href={tool.url} 
                              target="_blank" 
                              rel="noopener noreferrer"
                              className="px-3 py-1.5 text-xs font-medium rounded-full bg-blue-600 text-white hover:bg-blue-700 transition-colors"
                              onClick={() => recordUserBehavior(tool.id, '访问')}
                            >
                              访问
                            </a>
                          </div>
                        ) : null;
                      })}
                    </div>
                  ) : (
                    <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-6 shadow-sm border border-gray-200 text-center">
                      <p className="text-gray-600 dark:text-gray-400">未找到相关工具</p>
                    </div>
                  )}
                </div>
              )}
              
              <div className="mt-6">
                <button onClick={() => setShowEnhancedSearch(false)} className={`w-full py-2 ${searchError ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-700'} rounded-lg hover:${searchError ? 'bg-blue-700' : 'bg-gray-200'} transition-colors font-medium`}>
                  {searchError ? '重试' : '关闭'}
                </button>
              </div>
            </div>
          </div>
        )}

        {showComparisonModal && (
          <div className="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className="bg-white/90 backdrop-blur-xl rounded-xl shadow-2xl max-w-3xl w-full p-6 sm:p-8 border border-white/20 max-h-[90vh] overflow-y-auto">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-xl sm:text-2xl font-bold text-gray-900">🔄 AI 工具对比分析</h3>
                <button onClick={() => setShowComparisonModal(false)} className="p-2 rounded-full hover:bg-gray-100 transition-colors">
                  ✕
                </button>
              </div>
              
              {comparisonError ? (
                <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
                  <h4 className="font-semibold text-red-800 mb-2">对比分析失败</h4>
                  <p className="text-red-700">{comparisonError}</p>
                </div>
              ) : (
                <div className="space-y-4">
                  <p className="text-gray-600 mb-4">AI 对您选择的工具进行了详细的对比分析：</p>
                  <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-6 shadow-sm border border-gray-200">
                    <div className="prose max-w-none" dangerouslySetInnerHTML={{ __html: renderMarkdown(toolComparison) }}>
                    </div>
                  </div>
                </div>
              )}
              
              <div className="mt-6 flex gap-4">
                {!comparisonError && (
                  <button onClick={() => navigator.clipboard.writeText(toolComparison)} className="flex-1 py-2 bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200 transition-colors font-medium">
                    复制分析
                  </button>
                )}
                <button onClick={() => setShowComparisonModal(false)} className={`flex-1 py-2 ${comparisonError ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-700'} rounded-lg hover:${comparisonError ? 'bg-blue-700' : 'bg-gray-200'} transition-colors font-medium`}>
                  {comparisonError ? '重试' : '关闭'}
                </button>
              </div>
            </div>
          </div>
        )}

        {showAnalysisModal && (
          <div className="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className="bg-white/90 backdrop-blur-xl rounded-xl shadow-2xl max-w-3xl w-full p-6 sm:p-8 border border-white/20 max-h-[90vh] overflow-y-auto">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-xl sm:text-2xl font-bold text-gray-900">📊 AI 工具详细分析</h3>
                <button onClick={() => setShowAnalysisModal(false)} className="p-2 rounded-full hover:bg-gray-100 transition-colors">
                  ✕
                </button>
              </div>
              
              {currentTool && (
                <div className="mb-4">
                  <h4 className="text-lg font-semibold text-gray-900 dark:text-white">{currentTool.name}</h4>
                  <p className="text-sm text-gray-600 dark:text-gray-400">{currentTool.category}</p>
                </div>
              )}
              
              {analysisError ? (
                <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
                  <h4 className="font-semibold text-red-800 mb-2">分析报告生成失败</h4>
                  <p className="text-red-700">{analysisError}</p>
                </div>
              ) : (
                <div className="space-y-4">
                  <p className="text-gray-600 mb-4">AI 对工具进行了详细的分析报告：</p>
                  <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-6 shadow-sm border border-gray-200">
                    <div className="prose max-w-none" dangerouslySetInnerHTML={{ __html: renderMarkdown(currentToolAnalysis) }}>
                    </div>
                  </div>
                </div>
              )}
              
              <div className="mt-6 flex gap-4">
                {!analysisError && (
                  <button onClick={() => navigator.clipboard.writeText(currentToolAnalysis)} className="flex-1 py-2 bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200 transition-colors font-medium">
                    复制报告
                  </button>
                )}
                <button onClick={() => setShowAnalysisModal(false)} className={`flex-1 py-2 ${analysisError ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-700'} rounded-lg hover:${analysisError ? 'bg-blue-700' : 'bg-gray-200'} transition-colors font-medium`}>
                  {analysisError ? '重试' : '关闭'}
                </button>
              </div>
            </div>
          </div>
        )}

        {showFeedbackModal && (
          <div className="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className="bg-white/90 backdrop-blur-xl rounded-xl shadow-2xl max-w-md w-full p-6 sm:p-8 border border-white/20">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-xl font-bold text-gray-900">📝 工具反馈</h3>
                <button onClick={() => setShowFeedbackModal(false)} className="p-2 rounded-full hover:bg-gray-100 transition-colors">
                  ✕
                </button>
              </div>
              
              {selectedToolForFeedback && (
                <div className="mb-4">
                  <h4 className="text-lg font-semibold text-gray-900 dark:text-white">{selectedToolForFeedback.name}</h4>
                  <p className="text-sm text-gray-600 dark:text-gray-400">{selectedToolForFeedback.category}</p>
                </div>
              )}
              
              {feedbackSuccess ? (
                <div className="bg-green-50 border border-green-200 rounded-lg p-6 text-center mb-6">
                  <div className="text-4xl mb-4">✅</div>
                  <h4 className="font-semibold text-green-800 mb-2">反馈提交成功</h4>
                  <p className="text-green-700">感谢您的反馈！</p>
                </div>
              ) : (
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">评分</label>
                    <div className="flex items-center gap-2">
                      {[1, 2, 3, 4, 5].map((rating) => (
                        <motion.button
                          key={rating}
                          onClick={() => setFeedbackRating(rating)}
                          className={`text-2xl cursor-pointer ${rating <= feedbackRating ? 'text-yellow-400' : 'text-gray-300'}`}
                          whileHover={{ scale: 1.2 }}
                          whileTap={{ scale: 0.9 }}
                          type="button"
                        >
                          {rating <= feedbackRating ? '⭐' : '☆'}
                        </motion.button>
                      ))}
                    </div>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">评论</label>
                    <textarea
                      placeholder="请输入您的反馈..."
                      className="w-full px-4 py-2 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white resize-none"
                      rows={4}
                      value={feedbackComment}
                      onChange={(e) => setFeedbackComment(e.target.value)}
                    />
                  </div>
                  
                  <div className="mt-6">
                    <motion.button
                      onClick={submitFeedback}
                      disabled={isSubmittingFeedback}
                      className={`w-full px-6 py-3 rounded-lg font-medium transition-colors ${isSubmittingFeedback ? 'bg-gray-500 text-white cursor-not-allowed' : 'bg-gradient-to-r from-yellow-500 to-orange-500 text-white hover:from-yellow-600 hover:to-orange-600'}`}
                      whileHover={!isSubmittingFeedback ? { scale: 1.02 } : {}}
                      whileTap={!isSubmittingFeedback ? { scale: 0.98 } : {}}
                    >
                      {isSubmittingFeedback ? '提交中...' : '提交反馈'}
                    </motion.button>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </section>
  );
};

export default AITools;