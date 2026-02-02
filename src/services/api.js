import axios from 'axios';

// API请求缓存
const apiCache = new Map();
const CACHE_EXPIRY = {
  SHORT: 300000, // 5分钟
  MEDIUM: 1800000, // 30分钟
  LONG: 3600000 // 1小时
};

// API请求节流器
const requestThrottle = {
  lastRequestTime: 0,
  minimumInterval: 1000, // 最小请求间隔（毫秒）
  async throttle(callback) {
    const now = Date.now();
    if (now - this.lastRequestTime < this.minimumInterval) {
      await new Promise(resolve => setTimeout(resolve, this.minimumInterval - (now - this.lastRequestTime)));
    }
    this.lastRequestTime = Date.now();
    return callback();
  }
};

// 缓存管理工具
const cacheManager = {
  set(key, data, expiry = CACHE_EXPIRY.MEDIUM) {
    apiCache.set(key, {
      data,
      timestamp: Date.now(),
      expiry
    });
  },
  get(key) {
    if (!apiCache.has(key)) return null;
    
    const cachedData = apiCache.get(key);
    if (Date.now() - cachedData.timestamp < cachedData.expiry) {
      return cachedData.data;
    }
    
    // 缓存过期，删除
    apiCache.delete(key);
    return null;
  },
  clear() {
    apiCache.clear();
  },
  size() {
    return apiCache.size;
  }
};

// 创建OpenRouter API实例
export const openRouterAPI = axios.create({
  baseURL: import.meta.env.VITE_OPENROUTER_BASE_URL || 'https://openrouter.ai/api/v1',
  timeout: 30000, // 添加超时处理（30秒）
  headers: {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${import.meta.env.VITE_OPENROUTER_API_KEY}`,
    'HTTP-Referer': import.meta.env.VITE_SITE_URL || 'https://your-website.com',
    'X-Title': import.meta.env.VITE_SITE_NAME || 'Personal AI Tools'
  }
});

// 请求拦截器（添加节流）
openRouterAPI.interceptors.request.use(
  async (config) => {
    // 节流处理
    await requestThrottle.throttle(() => {});
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// 响应拦截器（添加缓存）
openRouterAPI.interceptors.response.use(
  (response) => {
    // 缓存处理（仅缓存GET请求）
    if (response.config.method === 'get') {
      const cacheKey = response.config.url;
      cacheManager.set(cacheKey, response.data, CACHE_EXPIRY.MEDIUM);
    }
    return response;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// AI总结个人简介
export const generateAISummary = async (personalInfo) => {
  try {
    // 生成缓存键
    const cacheKey = `summary_${btoa(unescape(encodeURIComponent(personalInfo))).slice(0, 32)}`;
    
    // 检查缓存
    const cachedData = cacheManager.get(cacheKey);
    if (cachedData) {
      return cachedData;
    }
    
    // 节流处理
    const result = await requestThrottle.throttle(async () => {
      const response = await openRouterAPI.post('/chat/completions', {
        model: 'deepseek-ai/deepseek-v3.2',
        messages: [
          {
            role: 'system',
            content: '你是一个专业的个人品牌顾问，擅长为个人简历和简介生成专业、简洁的总结。请用中文回复，保持语气专业友好，突出个人优势和特色。'
          },
          {
            role: 'user',
            content: `请为以下个人信息生成一个专业的总结：\n${personalInfo}`
          }
        ],
        max_tokens: 500,
        temperature: 0.7
      });
      return response.data.choices[0].message.content;
    });
    
    // 缓存结果
    cacheManager.set(cacheKey, result, CACHE_EXPIRY.LONG);
    
    return result;
  } catch (error) {
    console.error('AI总结生成失败:', error);
    throw error;
  }
};

// AI工具推荐
export const generateAIToolRecommendations = async (userBehavior, tools) => {
  try {
    // 构建工具信息摘要
    const toolsSummary = tools.map(tool => ({
      id: tool.id,
      name: tool.name,
      category: tool.category,
      description: tool.description,
      tags: tool.tags
    })); // 不限制工具数量，让AI有更多选择

    // 生成缓存键
    const cacheKey = `recommendation_${btoa(unescape(encodeURIComponent(userBehavior))).slice(0, 32)}`;
    
    // 检查缓存
    const cachedData = cacheManager.get(cacheKey);
    if (cachedData) {
      return cachedData;
    }
    
    // 节流处理
    const result = await requestThrottle.throttle(async () => {
      try {
        const response = await openRouterAPI.post('/chat/completions', {
          model: 'openai/gpt-3.5-turbo',
          messages: [
            {
              role: 'system',
              content: '你是一个智能AI工具推荐助手，根据用户的浏览行为和工具信息，为用户推荐最适合的AI工具。请用中文回复，每个推荐工具包含工具名称、推荐理由和适用场景。'
            },
            {
              role: 'user',
              content: `根据以下用户行为和工具信息，推荐3-5个最适合的AI工具：${toolsSummary.map(t => t.name).join(', ')}`
            }
          ],
          max_tokens: 500,
          temperature: 0.7
        });
        return response.data.choices[0].message.content;
      } catch (error) {
        console.error('API请求失败:', error.response?.data);
        // 如果API请求失败，返回一个默认的推荐结果
        let defaultRecommendations = '# AI工具推荐\n\n';
        // 随机选择3个工具作为默认推荐
        const recommendedTools = toolsSummary.sort(() => 0.5 - Math.random()).slice(0, 3);
        recommendedTools.forEach((tool, index) => {
          defaultRecommendations += `## ${index + 1}. ${tool.name}\n\n`;
          defaultRecommendations += `### 推荐理由\n${tool.description}\n\n`;
          defaultRecommendations += `### 适用场景\n适合用于${tool.category}类别的任务\n\n`;
          defaultRecommendations += `### 相关标签\n${tool.tags.join(', ')}\n\n`;
        });
        defaultRecommendations += `## 总结\n以上推荐基于工具的功能特点和适用场景，希望能满足您的需求。`;
        return defaultRecommendations;
      }
    });
    
    // 缓存结果
    cacheManager.set(cacheKey, result, CACHE_EXPIRY.MEDIUM);
    
    return result;
  } catch (error) {
    console.error('AI工具推荐生成失败:', error);
    throw error;
  }
};

// 智能搜索增强
export const enhanceSearch = async (query, tools) => {
  try {
    // 构建工具信息摘要
    const toolsSummary = tools.map(tool => ({
      id: tool.id,
      name: tool.name,
      category: tool.category,
      description: tool.description,
      tags: tool.tags
    }));

    // 生成缓存键
    const cacheKey = `search_${btoa(unescape(encodeURIComponent(query))).slice(0, 32)}`;
    
    // 检查缓存
    const cachedData = cacheManager.get(cacheKey);
    if (cachedData) {
      return cachedData;
    }
    
    // 节流处理
    const result = await requestThrottle.throttle(async () => {
      try {
        const response = await openRouterAPI.post('/chat/completions', {
          model: 'openai/gpt-3.5-turbo',
          messages: [
            {
              role: 'system',
              content: '你是一个智能搜索助手，能够理解用户的搜索意图，并从提供的工具列表中找到最相关的工具。请分析用户查询，理解其真实意图，然后返回最相关的工具ID列表，按相关性排序。\n\n要求：\n1. 理解用户的自然语言查询，包括同义词、相关概念和上下文含义\n2. 分析工具的名称、描述和标签，找到最匹配的工具\n3. 考虑语义相关性，不仅仅是关键词匹配\n4. 对结果进行智能排序，最相关的工具排在前面\n5. 返回工具ID列表，每个ID占一行\n6. 只返回工具ID，不要添加任何其他内容'
            },
            {
              role: 'user',
              content: `用户查询：${query}\n\n工具列表：\n${JSON.stringify(toolsSummary, null, 2)}`
            }
          ],
          max_tokens: 300,
          temperature: 0.3
        });
        
        // 解析返回的工具ID列表
        const result = response.data.choices[0].message.content;
        const toolIds = result.match(/\d+/g) || [];
        return toolIds.map(id => parseInt(id));
      } catch (error) {
        console.error('API请求失败:', error.response?.data);
        // 如果API请求失败，返回默认的搜索结果（基于简单的关键词匹配）
        const lowerQuery = query.toLowerCase();
        const matchedTools = toolsSummary.filter(tool => 
          tool.name.toLowerCase().includes(lowerQuery) ||
          tool.description.toLowerCase().includes(lowerQuery) ||
          tool.tags.some(tag => tag.toLowerCase().includes(lowerQuery))
        );
        return matchedTools.slice(0, 5).map(tool => tool.id);
      }
    });
    
    // 缓存结果
    cacheManager.set(cacheKey, result, CACHE_EXPIRY.SHORT);
    
    return result;
  } catch (error) {
    console.error('智能搜索增强失败:', error);
    throw error;
  }
};

// 自然语言查询处理
export const processNaturalLanguageQuery = async (query) => {
  try {
    // 生成缓存键
    const cacheKey = `intent_${btoa(unescape(encodeURIComponent(query))).slice(0, 32)}`;
    
    // 检查缓存
    const cachedData = cacheManager.get(cacheKey);
    if (cachedData) {
      return cachedData;
    }
    
    // 节流处理
    const result = await requestThrottle.throttle(async () => {
      const response = await openRouterAPI.post('/chat/completions', {
        model: 'deepseek-ai/deepseek-v3.2',
        messages: [
          {
            role: 'system',
            content: '你是一个自然语言理解助手，能够分析用户的查询意图，并提取关键信息。请分析用户查询，理解其真实意图，然后返回结构化的查询信息。'
          },
          {
            role: 'user',
            content: `分析以下查询的意图：${query}`
          }
        ],
        max_tokens: 200,
        temperature: 0.3
      });
      return response.data.choices[0].message.content;
    });
    
    // 缓存结果
    cacheManager.set(cacheKey, result, CACHE_EXPIRY.MEDIUM);
    
    return result;
  } catch (error) {
    console.error('自然语言查询处理失败:', error);
    throw error;
  }
};

// 工具对比分析
export const compareTools = async (tools) => {
  try {
    // 生成缓存键
    const cacheKey = `compare_${btoa(JSON.stringify(tools.map(t => t.id))).slice(0, 32)}`;
    
    // 检查缓存
    const cachedData = cacheManager.get(cacheKey);
    if (cachedData) {
      return cachedData;
    }
    
    // 节流处理
    const result = await requestThrottle.throttle(async () => {
      try {
        const response = await openRouterAPI.post('/chat/completions', {
          model: 'openai/gpt-3.5-turbo',
          messages: [
            {
              role: 'system',
              content: '你是一个专业的AI工具分析师，擅长对比分析不同的AI工具。请对提供的工具进行详细的对比分析，包括功能特点、适用场景、优势和局限性等方面。\n\n要求：\n1. 使用Markdown格式，确保适当的换行和缩进\n2. 每个要点都要单独成行\n3. 使用清晰的标题和列表格式\n4. 每个工具的分析要分开，先分析完一个工具再分析下一个工具\n5. 使用中文回复，语言专业但易于理解'
            },
            {
              role: 'user',
              content: `请对比分析以下AI工具：${tools.map(t => t.name).join(', ')}`
            }
          ],
          max_tokens: 500,
          temperature: 0.7
        });
        return response.data.choices[0].message.content;
      } catch (error) {
        console.error('API请求失败:', error.response?.data);
        // 如果API请求失败，返回一个默认的对比分析报告
        let defaultReport = '# AI工具对比分析\n\n';
        tools.forEach(tool => {
          defaultReport += `## ${tool.name}\n\n`;
          defaultReport += `### 功能特点\n${tool.description}\n\n`;
          defaultReport += `### 适用场景\n适合用于${tool.category}类别的任务\n\n`;
          defaultReport += `### 优势\n- 功能强大\n- 易于使用\n- 效率高\n\n`;
          defaultReport += `### 局限性\n- 可能需要付费\n- 学习曲线较陡\n\n`;
        });
        defaultReport += `## 总结\n根据具体需求选择合适的工具，不同工具各有其适用场景。`;
        return defaultReport;
      }
    });
    
    // 缓存结果
    cacheManager.set(cacheKey, result, CACHE_EXPIRY.MEDIUM);
    
    return result;
  } catch (error) {
    console.error('工具对比分析失败:', error);
    throw error;
  }
};

// 工具详细分析报告
export const generateToolAnalysisReport = async (tool) => {
  try {
    // 生成缓存键
    const cacheKey = `analysis_${btoa(tool.id.toString()).slice(0, 32)}`;
    
    // 检查缓存
    const cachedData = cacheManager.get(cacheKey);
    if (cachedData) {
      return cachedData;
    }
    
    // 节流处理
    const result = await requestThrottle.throttle(async () => {
      // 简化工具信息，避免请求体过大
      const simplifiedTool = {
        id: tool.id,
        name: tool.name,
        category: tool.category,
        description: tool.description,
        tags: tool.tags
      };
      
      try {
        const response = await openRouterAPI.post('/chat/completions', {
          model: 'openai/gpt-3.5-turbo', // 尝试使用不同的模型
          messages: [
            {
              role: 'system',
              content: '你是一个专业的AI工具分析师，擅长对单个AI工具进行深入分析。请对提供的工具进行详细的分析报告，包括功能特点、适用场景、优势和局限性等方面。\n\n要求：\n1. 使用Markdown格式，确保适当的换行和缩进\n2. 每个要点都要单独成行\n3. 使用清晰的标题和列表格式\n4. 功能特点、适用场景、优势和局限性等部分要分开\n5. 使用中文回复，语言专业但易于理解'
            },
            {
              role: 'user',
              content: `请对以下AI工具进行详细分析：${simplifiedTool.name}，类别：${simplifiedTool.category}，描述：${simplifiedTool.description}`
            }
          ],
          max_tokens: 500, // 进一步减少token数量
          temperature: 0.7
        });
        return response.data.choices[0].message.content;
      } catch (error) {
        console.error('API请求失败:', error.response?.data);
        // 如果API请求失败，返回一个默认的分析报告
        return `# ${simplifiedTool.name} 分析报告\n\n## 功能特点\n${simplifiedTool.description}\n\n## 适用场景\n适合用于${simplifiedTool.category}类别的任务\n\n## 优势\n- 功能强大\n- 易于使用\n- 效率高\n\n## 局限性\n- 可能需要付费\n- 学习曲线较陡\n\n## 最佳实践\n根据具体需求选择合适的功能模块`;
      }
    });
    
    // 缓存结果
    cacheManager.set(cacheKey, result, CACHE_EXPIRY.LONG);
    
    return result;
  } catch (error) {
    console.error('工具分析报告生成失败:', error);
    console.error('错误详情:', error.response?.data || error.message);
    throw error;
  }
};

// 错误处理函数
export const handleAPIError = (error) => {
  if (error.response) {
    // 服务器返回错误状态码
    if (error.response.status === 429) {
      return '请求过于频繁，请稍后再试';
    } else if (error.response.status === 401) {
      return 'API密钥无效，请检查配置';
    } else if (error.response.status === 403) {
      return '无权访问此资源';
    } else {
      return `服务器错误：${error.response.status}`;
    }
  } else if (error.request) {
    // 请求已发送但没有收到响应
    return '网络错误，请检查网络连接';
  } else {
    // 请求配置出错
    return `请求错误：${error.message}`;
  }
};
