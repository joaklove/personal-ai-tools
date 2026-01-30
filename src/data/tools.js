// AI工具数据
export const tools = [
  {
    id: 1,
    name: "ChatGPT",
    description: "OpenAI开发的强大对话AI，可以帮助你完成各种任务，从写作到编程。",
    category: "all",
    tags: ["AI", "写作", "编程", "助手"],
    url: "https://chatgpt.com"
  },
  {
    id: 2,
    name: "MidJourney",
    description: "先进的AI图像生成工具，可以根据文本描述创建高质量的图像。",
    category: "design",
    tags: ["AI", "设计", "图像生成"],
    url: "https://www.midjourney.com"
  },
  {
    id: 3,
    name: "GitHub Copilot",
    description: "AI编程助手，可以在你编码时提供智能建议和自动完成。",
    category: "programming",
    tags: ["AI", "编程", "开发工具"],
    url: "https://github.com/features/copilot"
  },
  {
    id: 4,
    name: "Notion AI",
    description: "Notion集成的AI助手，可以帮助你写文档、总结内容和生成想法。",
    category: "writing",
    tags: ["AI", "写作", "生产力"],
    url: "https://www.notion.so/product/ai"
  },
  {
    id: 5,
    name: "Grammarly",
    description: "AI驱动的写作助手，可以检查语法、拼写和风格问题。",
    category: "writing",
    tags: ["AI", "写作", "语法检查"],
    url: "https://www.grammarly.com"
  },
  {
    id: 6,
    name: "DALL-E 3",
    description: "OpenAI的图像生成模型，可以创建详细、准确的图像。",
    category: "design",
    tags: ["AI", "设计", "图像生成"],
    url: "https://openai.com/dall-e-3"
  },
  {
    id: 7,
    name: "Claude",
    description: "Anthropic开发的AI助手，擅长长文本理解和创意写作。",
    category: "all",
    tags: ["AI", "写作", "助手"],
    url: "https://claude.ai"
  },
  {
    id: 8,
    name: "Codeium",
    description: "免费的AI编程助手，支持多种编程语言和IDE。",
    category: "programming",
    tags: ["AI", "编程", "开发工具"],
    url: "https://codeium.com"
  },
  {
    id: 9,
    name: "ResearchRabbit",
    description: "AI驱动的学术研究助手，可以帮助你发现和组织研究论文。",
    category: "research",
    tags: ["AI", "研究", "学术"],
    url: "https://www.researchrabbit.ai"
  },
  {
    id: 10,
    name: "Perplexity AI",
    description: "AI驱动的搜索引擎，可以提供更准确、更详细的搜索结果。",
    category: "research",
    tags: ["AI", "搜索", "研究"],
    url: "https://www.perplexity.ai"
  },
  {
    id: 11,
    name: "Canva AI",
    description: "Canva集成的AI设计工具，可以帮助你创建各种设计作品。",
    category: "design",
    tags: ["AI", "设计", "图形设计"],
    url: "https://www.canva.com/ai"
  },
  {
    id: 12,
    name: "Replit AI",
    description: "Replit的AI编程助手，可以帮助你编写、调试和优化代码。",
    category: "programming",
    tags: ["AI", "编程", "开发工具"],
    url: "https://replit.com/ai"
  },
  {
    id: 13,
    name: "Jasper",
    description: "AI内容生成工具，专为营销和商业内容创建而设计。",
    category: "writing",
    tags: ["AI", "写作", "营销"],
    url: "https://www.jasper.ai"
  },
  {
    id: 14,
    name: "Stable Diffusion",
    description: "开源的AI图像生成模型，可以创建各种风格的图像。",
    category: "design",
    tags: ["AI", "设计", "图像生成"],
    url: "https://stability.ai/stable-diffusion"
  },
  {
    id: 15,
    name: "Llama 3",
    description: "Meta开发的开源大语言模型，可用于各种AI任务。",
    category: "all",
    tags: ["AI", "开源", "大语言模型"],
    url: "https://ai.meta.com/llama/"
  },
  {
    id: 16,
    name: "DeepSeek",
    description: "深度求索开发的AI编程助手，专注于代码理解和生成。",
    category: "programming",
    tags: ["AI", "编程", "开发工具"],
    url: "https://www.deepseek.com"
  },
  {
    id: 17,
    name: "Zapier AI",
    description: "Zapier集成的AI自动化工具，可以帮助你创建智能工作流。",
    category: "all",
    tags: ["AI", "自动化", "生产力"],
    url: "https://zapier.com/ai"
  },
  {
    id: 18,
    name: "QuillBot",
    description: "AI驱动的文本重写工具，可以帮助你改进写作和避免 plagiarism。",
    category: "writing",
    tags: ["AI", "写作", "文本重写"],
    url: "https://quillbot.com"
  },
  {
    id: 19,
    name: "Wolfram Alpha",
    description: "AI驱动的计算知识引擎，可以回答各种科学和数学问题。",
    category: "research",
    tags: ["AI", "计算", "研究"],
    url: "https://www.wolframalpha.com"
  },
  {
    id: 20,
    name: "ElevenLabs",
    description: "AI语音生成工具，可以创建逼真的语音内容。",
    category: "design",
    tags: ["AI", "语音", "设计"],
    url: "https://elevenlabs.io"
  }
];

// 工具分类
export const categories = [
  { id: "all", name: "全部工具", displayName: "综合" },
  { id: "writing", name: "写作工具", displayName: "写作" },
  { id: "design", name: "设计工具", displayName: "设计" },
  { id: "programming", name: "编程工具", displayName: "编程" },
  { id: "research", name: "研究工具", displayName: "研究" }
];

// 获取分类显示名称
export const getCategoryDisplayName = (id) => {
  return categories.find(c => c.id === id)?.displayName || '其他';
};
