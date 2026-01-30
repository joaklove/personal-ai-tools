import React, { useState, useEffect } from 'react'
import { tools, categories, getCategoryDisplayName } from '../data/tools'

const AITools = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [filteredTools, setFilteredTools] = useState(tools);
  const [searchSuggestions, setSearchSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [isSearching, setIsSearching] = useState(false);
  const [favorites, setFavorites] = useState([]);
  const [showFavorites, setShowFavorites] = useState(false);
  const [sortOption, setSortOption] = useState('name'); // name, category, newest
  const [searchHistory, setSearchHistory] = useState([]);
  const [showSearchHistory, setShowSearchHistory] = useState(false);

  // 添加错误处理和序列化保护
  const saveToStorage = (key, data) => {
    try {
      const serialized = JSON.stringify(data);
      if (serialized.length > 4 * 1024 * 1024) { // 4MB预警
        console.warn('Storage quota approaching limit');
        // 实现LRU淘汰或数据压缩
        if (key === 'searchHistory' && data.length > 0) {
          // 只保留最近3条搜索历史
          const trimmedData = data.slice(0, 3);
          localStorage.setItem(key, JSON.stringify(trimmedData));
        }
      } else {
        localStorage.setItem(key, serialized);
      }
    } catch (e) {
      if (e.name === 'QuotaExceededError') {
        console.error('Storage quota exceeded');
        // 清理旧数据
        if (key === 'searchHistory') {
          localStorage.setItem(key, JSON.stringify([]));
        }
      }
      console.error('Error saving to localStorage:', e);
    }
  };

  // 从本地存储加载数据
  const loadFromStorage = (key, defaultValue = []) => {
    try {
      const saved = localStorage.getItem(key);
      if (saved) {
        return JSON.parse(saved);
      }
    } catch (e) {
      console.error('Error loading from localStorage:', e);
    }
    return defaultValue;
  };

  // 从本地存储加载收藏工具和搜索历史
  useEffect(() => {
    setFavorites(loadFromStorage('favorites', []));
    setSearchHistory(loadFromStorage('searchHistory', []));
  }, []);

  // 保存收藏工具到本地存储
  useEffect(() => {
    saveToStorage('favorites', favorites);
  }, [favorites]);

  // 保存搜索历史到本地存储
  useEffect(() => {
    saveToStorage('searchHistory', searchHistory);
  }, [searchHistory]);

  // 搜索建议
  useEffect(() => {
    if (searchTerm.length > 1) {
      setIsSearching(true);
      const suggestions = tools.filter(tool => 
        tool.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        tool.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        tool.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()))
      ).slice(0, 5);
      setSearchSuggestions(suggestions);
      setShowSuggestions(true);
      setIsSearching(false);
    } else {
      setShowSuggestions(false);
      setSearchSuggestions([]);
    }
  }, [searchTerm]);

  // 过滤和排序工具
  useEffect(() => {
    setIsSearching(true);
    let filtered = tools.filter(tool => {
      const matchesSearch = tool.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         tool.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         tool.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()));
      const matchesCategory = selectedCategory === 'all' || tool.category === selectedCategory;
      return matchesSearch && matchesCategory;
    });
    
    // 排序
    if (sortOption === 'name') {
      filtered.sort((a, b) => a.name.localeCompare(b.name));
    } else if (sortOption === 'category') {
      filtered.sort((a, b) => a.category.localeCompare(b.category));
    } else if (sortOption === 'newest') {
      filtered.sort((a, b) => b.id - a.id);
    }
    
    setFilteredTools(filtered);
    setIsSearching(false);
  }, [searchTerm, selectedCategory, sortOption]);

  // 选择搜索建议
  const selectSuggestion = (tool) => {
    setSearchTerm(tool.name);
    setShowSuggestions(false);
    addToSearchHistory(tool.name);
  };

  // 清除搜索
  const clearSearch = () => {
    setSearchTerm('');
    setShowSuggestions(false);
  };

  // 添加到搜索历史
  const addToSearchHistory = (term) => {
    if (term && !searchHistory.includes(term)) {
      setSearchHistory(prev => [term, ...prev].slice(0, 5)); // 只保留最近5个
    }
  };

  // 从搜索历史中选择
  const selectFromHistory = (term) => {
    setSearchTerm(term);
    setShowSearchHistory(false);
  };

  // 清除搜索历史
  const clearSearchHistory = () => {
    setSearchHistory([]);
    localStorage.removeItem('searchHistory');
  };

  // 切换收藏状态
  const toggleFavorite = (tool) => {
    setFavorites(prev => {
      const isFav = prev.some(fav => fav.id === tool.id);
      if (isFav) {
        return prev.filter(fav => fav.id !== tool.id);
      } else {
        return [...prev, tool];
      }
    });
  };

  // 检查是否已收藏
  const isFavorite = (toolId) => {
    return favorites.some(fav => fav.id === toolId);
  };

  return (
    <section id="tools" className="mb-16 sm:mb-20">
      <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-8 sm:mb-10 text-center">AI工具导航</h2>
      
      {/* 搜索框 */}
      <div className="mb-8 sm:mb-10 max-w-3xl mx-auto">
        <div className="relative">
          <input
            type="text"
            placeholder="搜索AI工具、标签或描述..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            onFocus={() => searchHistory.length > 0 && setShowSearchHistory(true)}
            onBlur={() => setTimeout(() => setShowSearchHistory(false), 200)}
            className="w-full px-4 sm:px-5 py-2 sm:py-3 border border-gray-300 rounded-full focus:outline-none focus:ring-3 focus:ring-blue-500 focus:border-transparent shadow-sm"
          />
          {searchTerm && (
            <button
              onClick={clearSearch}
              className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
              aria-label="清除搜索"
            >
              ✕
            </button>
          )}
          <div className="absolute right-3 sm:right-4 top-1/2 transform -translate-y-1/2 text-gray-400">
            {isSearching ? '⏳' : '🔍'}
          </div>
          
          {/* 搜索历史 */}
          {showSearchHistory && searchHistory.length > 0 && !searchTerm && (
            <div className="absolute top-full left-0 right-0 mt-1 bg-white rounded-lg shadow-lg border border-gray-200 z-20 max-h-[60vh] overflow-y-auto">
              <div className="flex justify-between items-center px-4 py-2 border-b border-gray-200">
                <h4 className="font-medium text-gray-700">搜索历史</h4>
                <button
                  onClick={clearSearchHistory}
                  className="text-sm text-gray-500 hover:text-gray-700"
                >
                  清除
                </button>
              </div>
              {searchHistory.map((term, index) => (
                <div
                  key={index}
                  className="px-4 py-3 hover:bg-gray-100 cursor-pointer transition-colors"
                  onClick={() => selectFromHistory(term)}
                >
                  <div className="font-medium">{term}</div>
                </div>
              ))}
            </div>
          )}
          
          {/* 搜索建议 */}
          {showSuggestions && searchSuggestions.length > 0 && (
            <div className="absolute top-full left-0 right-0 mt-1 bg-white rounded-lg shadow-lg border border-gray-200 z-20 max-h-[60vh] overflow-y-auto">
              {searchSuggestions.map((tool) => (
                <div
                  key={tool.id}
                  className="px-4 py-3 hover:bg-gray-100 cursor-pointer transition-colors"
                  onClick={() => selectSuggestion(tool)}
                >
                  <div className="font-medium">{tool.name}</div>
                  <div className="text-sm text-gray-600 truncate">{tool.description}</div>
                  <div className="flex flex-wrap gap-1 mt-2">
                    {tool.tags.slice(0, 3).map((tag, index) => (
                      <span key={index} className="text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded">
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
      
      {/* 工具分类、排序和收藏切换 */}
      <div className="flex flex-wrap justify-center gap-2 sm:gap-3 mb-8 sm:mb-10">
        <button
          className={`px-4 sm:px-6 py-2 sm:py-3 rounded-full transition-all duration-300 font-medium transform hover:scale-105 ${
            showFavorites
              ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-md'
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
          }`}
          onClick={() => setShowFavorites(!showFavorites)}
        >
          {showFavorites ? '查看全部工具' : `收藏工具 (${favorites.length})`}
        </button>
        {!showFavorites && categories.map((category) => (
          <button
            key={category.id}
            className={`px-4 sm:px-6 py-2 sm:py-3 rounded-full transition-all duration-300 font-medium transform hover:scale-105 ${
              selectedCategory === category.id
                ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-md'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
            onClick={() => setSelectedCategory(category.id)}
          >
            {category.name}
          </button>
        ))}
        {!showFavorites && (
          <div className="relative">
            <select
              value={sortOption}
              onChange={(e) => setSortOption(e.target.value)}
              className="px-4 sm:px-6 py-2 sm:py-3 rounded-full border border-gray-300 bg-white text-gray-700 hover:bg-gray-50 transition-all duration-300"
            >
              <option value="name">按名称排序</option>
              <option value="category">按分类排序</option>
              <option value="newest">按最新添加</option>
            </select>
          </div>
        )}
      </div>

      {/* 工具数量统计 */}
      <div className="mb-6 text-center">
        <p className="text-gray-600">
          {showFavorites ? (
            <>共收藏 <span className="font-bold text-blue-600">{favorites.length}</span> 个AI工具</>
          ) : (
            <>共找到 <span className="font-bold text-blue-600">{filteredTools.length}</span> 个AI工具</>
          )}
        </p>
      </div>

      {/* 工具卡片列表 */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
        {(showFavorites ? favorites : filteredTools).map((tool) => (
          <div key={tool.id} className="card rounded-xl hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2">
            <div className="mb-4 flex justify-between items-start">
              <span className="inline-block px-2 sm:px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-xs font-medium mb-3 sm:mb-4">
                {getCategoryDisplayName(tool.category)}
              </span>
              <button
                onClick={() => toggleFavorite(tool)}
                className={`p-2 rounded-full transition-all duration-300 transform hover:scale-110 ${
                  isFavorite(tool.id)
                    ? 'bg-red-100 text-red-500'
                    : 'bg-gray-100 text-gray-400 hover:bg-gray-200 hover:text-gray-600'
                }`}
                aria-label={isFavorite(tool.id) ? '取消收藏' : '添加到收藏'}
              >
                {isFavorite(tool.id) ? '❤️' : '🤍'}
              </button>
            </div>
            <h3 className="text-xl sm:text-2xl font-bold text-gray-900 mb-3">{tool.name}</h3>
            <p className="text-gray-600 mb-4 sm:mb-6 leading-relaxed">{tool.description}</p>
            <div className="flex flex-wrap gap-2 mb-4 sm:mb-6">
              {tool.tags.map((tag, index) => (
                <span
                  key={index}
                  className="bg-gradient-to-r from-blue-100 to-indigo-100 text-blue-800 px-2 sm:px-3 py-1 rounded-full text-xs font-medium"
                >
                  {tag}
                </span>
              ))}
            </div>
            <a href={tool.url} target="_blank" rel="noopener noreferrer" className="inline-flex items-center text-blue-600 hover:text-blue-800 font-medium transition-colors duration-300">
              访问链接
              <svg className="ml-2 w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
              </svg>
            </a>
          </div>
        ))}
        
        {/* 无结果提示 */}
        {(showFavorites ? favorites.length === 0 : filteredTools.length === 0) && (
          <div className="col-span-full text-center py-12 sm:py-16">
            <div className="inline-block p-4 sm:p-6 bg-gray-100 rounded-full mb-4 sm:mb-6">
              {showFavorites ? '❤️' : '🤖'}
            </div>
            <h3 className="text-xl sm:text-2xl font-semibold text-gray-900 mb-3">
              {showFavorites ? '暂无收藏工具' : '未找到相关工具'}
            </h3>
            <p className="text-gray-500 max-w-md mx-auto">
              {showFavorites 
                ? '浏览工具列表，点击收藏按钮添加你喜欢的工具' 
                : '请尝试其他搜索词或分类，我们会不断更新更多优质AI工具。'
              }
            </p>
            {!showFavorites && (
              <button
                onClick={() => {
                  setSearchTerm('');
                  setSelectedCategory('all');
                }}
                className="mt-6 px-6 py-2 bg-blue-600 text-white rounded-full hover:bg-blue-700 transition-colors"
              >
                重置筛选
              </button>
            )}
            {showFavorites && (
              <button
                onClick={() => setShowFavorites(false)}
                className="mt-6 px-6 py-2 bg-blue-600 text-white rounded-full hover:bg-blue-700 transition-colors"
              >
                浏览全部工具
              </button>
            )}
          </div>
        )}
      </div>
    </section>
  )
}

export default AITools