import React, { useState, useEffect } from 'react'
import { tools, categories, getCategoryDisplayName } from '../data/tools'

const AITools = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [filteredTools, setFilteredTools] = useState(tools);
  const [searchSuggestions, setSearchSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [isSearching, setIsSearching] = useState(false);

  // 搜索建议
  useEffect(() => {
    if (searchTerm.length > 1) {
      setIsSearching(true);
      const suggestions = tools.filter(tool => 
        tool.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        tool.description.toLowerCase().includes(searchTerm.toLowerCase())
      ).slice(0, 5);
      setSearchSuggestions(suggestions);
      setShowSuggestions(true);
      setIsSearching(false);
    } else {
      setShowSuggestions(false);
      setSearchSuggestions([]);
    }
  }, [searchTerm]);

  // 过滤工具
  useEffect(() => {
    setIsSearching(true);
    const filtered = tools.filter(tool => {
      const matchesSearch = tool.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         tool.description.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesCategory = selectedCategory === 'all' || tool.category === selectedCategory;
      return matchesSearch && matchesCategory;
    });
    setFilteredTools(filtered);
    setIsSearching(false);
  }, [searchTerm, selectedCategory]);

  // 选择搜索建议
  const selectSuggestion = (tool) => {
    setSearchTerm(tool.name);
    setShowSuggestions(false);
  };

  // 清除搜索
  const clearSearch = () => {
    setSearchTerm('');
    setShowSuggestions(false);
  };

  return (
    <section id="tools" className="mb-16 sm:mb-20">
      <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-8 sm:mb-10 text-center">AI工具导航</h2>
      
      {/* 搜索框 */}
      <div className="mb-8 sm:mb-10 max-w-3xl mx-auto">
        <div className="relative">
          <input
            type="text"
            placeholder="搜索AI工具..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
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
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
      
      {/* 工具分类 */}
      <div className="flex flex-wrap justify-center gap-2 sm:gap-3 mb-8 sm:mb-10">
        {categories.map((category) => (
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
      </div>

      {/* 工具数量统计 */}
      <div className="mb-6 text-center">
        <p className="text-gray-600">
          共找到 <span className="font-bold text-blue-600">{filteredTools.length}</span> 个AI工具
        </p>
      </div>

      {/* 工具卡片列表 */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
        {filteredTools.map((tool) => (
          <div key={tool.id} className="card rounded-xl hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2">
            <div className="mb-4">
              <span className="inline-block px-2 sm:px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-xs font-medium mb-3 sm:mb-4">
                {getCategoryDisplayName(tool.category)}
              </span>
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
        {filteredTools.length === 0 && (
          <div className="col-span-full text-center py-12 sm:py-16">
            <div className="inline-block p-4 sm:p-6 bg-gray-100 rounded-full mb-4 sm:mb-6">
              🤖
            </div>
            <h3 className="text-xl sm:text-2xl font-semibold text-gray-900 mb-3">未找到相关工具</h3>
            <p className="text-gray-500 max-w-md mx-auto">请尝试其他搜索词或分类，我们会不断更新更多优质AI工具。</p>
            <button
              onClick={() => {
                setSearchTerm('');
                setSelectedCategory('all');
              }}
              className="mt-6 px-6 py-2 bg-blue-600 text-white rounded-full hover:bg-blue-700 transition-colors"
            >
              重置筛选
            </button>
          </div>
        )}
      </div>
    </section>
  )
}

export default AITools