import { NextRequest, NextResponse } from 'next/server';

// 模拟AI配置数据
let aiConfig = {
  provider: 'deepseek',
  model: 'deepseek-chat',
  baseUrl: 'https://api.deepseek.com',
  temperature: 0.7,
  maxTokens: 2000,
  apiKey: '',
  enabled: true,
};

// 可用的大模型列表
const availableProviders = [
  {
    id: 'deepseek',
    name: 'DeepSeek',
    logo: '/models/deepseek.png',
    baseUrl: 'https://api.deepseek.com/v1',
    models: [
      { id: 'deepseek-chat', name: 'DeepSeek Chat', description: '通用对话模型' },
      { id: 'deepseek-coder', name: 'DeepSeek Coder', description: '代码生成模型' },
    ],
  },
  {
    id: 'kimi',
    name: 'Kimi (月之暗面)',
    logo: '/models/kimi.png',
    baseUrl: 'https://api.moonshot.cn/v1',
    models: [
      { id: 'moonshot-v1-8k', name: 'Moonshot V1 8K', description: '8K上下文' },
      { id: 'moonshot-v1-32k', name: 'Moonshot V1 32K', description: '32K上下文' },
      { id: 'moonshot-v1-128k', name: 'Moonshot V1 128K', description: '128K超长上下文' },
    ],
  },
  {
    id: 'qwen',
    name: '通义千问 (阿里)',
    logo: '/models/qwen.png',
    baseUrl: 'https://dashscope.aliyuncs.com/compatible-mode/v1',
    models: [
      { id: 'qwen-turbo', name: 'Qwen Turbo', description: '快速响应' },
      { id: 'qwen-plus', name: 'Qwen Plus', description: '增强版' },
      { id: 'qwen-max', name: 'Qwen Max', description: '最强版本' },
      { id: 'qwen-max-longcontext', name: 'Qwen Max 长文本', description: '超长上下文' },
    ],
  },
  {
    id: 'ernie',
    name: '文心一言 (百度)',
    logo: '/models/ernie.png',
    baseUrl: 'https://qianfan.baidubce.com/v2/chat/completions',
    models: [
      { id: 'ernie-bot', name: '文心一言', description: '通用对话' },
      { id: 'ernie-bot-4', name: '文心一言 4.0', description: '旗舰版' },
      { id: 'ernie-bot-turbo', name: '文心一言 Turbo', description: '快速版' },
    ],
  },
  {
    id: 'doubao',
    name: '豆包 (字节跳动)',
    logo: '/models/doubao.png',
    baseUrl: 'https://ark.cn-beijing.volces.com/api/v3',
    models: [
      { id: 'doubao-pro-32k', name: '豆包 Pro 32K', description: '32K上下文' },
      { id: 'doubao-lite-32k', name: '豆包 Lite 32K', description: '轻量版' },
    ],
  },
  {
    id: 'yuanbao',
    name: '元宝 (腾讯)',
    logo: '/models/yuanbao.png',
    baseUrl: 'https://hunyuan.cloud.tencent.com/hunyuan/v1/chat/completions',
    models: [
      { id: 'hunyuan-pro', name: '混元 Pro', description: '旗舰版' },
      { id: 'hunyuan-standard', name: '混元 Standard', description: '标准版' },
      { id: 'hunyuan-lite', name: '混元 Lite', description: '轻量版' },
    ],
  },
  {
    id: 'openai',
    name: 'OpenAI',
    logo: '/models/openai.png',
    baseUrl: 'https://api.openai.com/v1',
    models: [
      { id: 'gpt-4o', name: 'GPT-4o', description: '最新旗舰' },
      { id: 'gpt-4-turbo', name: 'GPT-4 Turbo', description: '高性能' },
      { id: 'gpt-3.5-turbo', name: 'GPT-3.5 Turbo', description: '快速响应' },
    ],
  },
  {
    id: 'zhipu',
    name: '智谱GLM',
    logo: '/models/zhipu.png',
    baseUrl: 'https://open.bigmodel.cn/api/paas/v4',
    models: [
      { id: 'glm-4', name: 'GLM-4', description: '旗舰版' },
      { id: 'glm-4-plus', name: 'GLM-4 Plus', description: '增强版' },
      { id: 'glm-4-flash', name: 'GLM-4 Flash', description: '快速版' },
    ],
  },
];

// GET - 获取AI配置
export async function GET() {
  return NextResponse.json({
    success: true,
    data: {
      config: aiConfig,
      availableProviders,
    },
  });
}

// PUT - 更新AI配置
export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    aiConfig = {
      ...aiConfig,
      ...body,
    };
    return NextResponse.json({
      success: true,
      message: '配置更新成功',
      data: { config: aiConfig },
    });
  } catch (error) {
    return NextResponse.json({
      success: false,
      message: '配置更新失败',
    }, { status: 400 });
  }
}
