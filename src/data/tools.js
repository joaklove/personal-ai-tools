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
