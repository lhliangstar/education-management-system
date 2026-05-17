# 产业学院质量监控与智能评估管理系统

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/your-username/industry-college-system)
[![Deploy on Railway](https://railway.app/button.svg)](https://railway.app/template/your-template-id)
[![Docker Build](https://github.com/your-username/industry-college-system/actions/workflows/deploy.yml/badge.svg)](https://github.com/your-username/industry-college-system/actions/workflows/deploy.yml)

## 📋 系统简介

产业学院质量监控与智能评估管理系统是一个企业级Web应用，集成了数据分析、数据可视化、推理预测、策略辅助及AI内容生成等功能。

### 核心功能

- 🏫 **产业学院管理** - 学院信息、合作企业、专业群管理
- 📊 **智能数据分析** - 多维度数据洞察、相关性分析
- 🔮 **趋势预测** - 基于历史数据的趋势预测模型
- 📝 **策略建议** - AI生成改进策略与执行方案
- 🤖 **AI评估报告** - 支持8大主流大模型生成专业报告
- 📈 **可视化大屏** - 实时数据监控与展示

## 🚀 一键部署

### 方式一：Vercel 部署（推荐）

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/your-username/industry-college-system)

1. 点击上方按钮
2. 连接 GitHub 账号
3. 配置环境变量
4. 自动部署完成

### 方式二：Railway 部署

[![Deploy on Railway](https://railway.app/button.svg)](https://railway.app/template/your-template-id)

### 方式三：Docker 部署

```bash
# 克隆项目
git clone https://github.com/your-username/industry-college-system.git
cd industry-college-system

# 使用 Docker Compose 启动
docker-compose up -d

# 访问系统
open http://localhost:5000
```

### 方式四：手动部署

```bash
# 克隆项目
git clone https://github.com/your-username/industry-college-system.git
cd industry-college-system

# 安装依赖
pnpm install

# 配置环境变量
cp .env.example .env.local
# 编辑 .env.local 填入配置

# 构建
pnpm build

# 启动
pnpm start
```

## 🛠️ 技术栈

| 类别 | 技术 |
|------|------|
| 框架 | Next.js 16 (App Router) |
| 核心 | React 19 |
| 语言 | TypeScript 5 |
| UI组件 | Ant Design 5 |
| 图表 | Recharts |
| 图标 | Lucide React |
| 样式 | Tailwind CSS 4 |
| 数据库 | PostgreSQL + Drizzle ORM |

## 📦 项目结构

```
.
├── .github/workflows/    # GitHub Actions 工作流
├── src/
│   ├── app/              # 页面路由
│   │   ├── dashboard/    # 智能工作台
│   │   ├── analysis/     # 智能分析
│   │   ├── college/      # 产业学院管理
│   │   ├── evaluate/     # 评估管理
│   │   └── system/       # 系统管理
│   ├── components/       # 组件
│   └── lib/              # 工具库
├── Dockerfile            # Docker 配置
├── docker-compose.yml    # Docker Compose 配置
├── vercel.json           # Vercel 配置
├── railway.toml          # Railway 配置
└── package.json
```

## 🔐 默认账号

| 账号 | 密码 | 角色 |
|------|------|------|
| admin | admin123 | 校管理员 |
| college_admin | college123 | 产业学院管理员 |
| expert | expert123 | 评审专家 |
| reviewer | reviewer123 | 部门审核员 |

## 🤖 AI模型支持

| 服务商 | 模型 |
|--------|------|
| DeepSeek | deepseek-chat, deepseek-coder |
| Kimi | moonshot-v1-8k/32k/128k |
| 通义千问 | qwen-turbo/plus/max |
| 文心一言 | ernie-bot/4/turbo |
| 豆包 | doubao-pro/lite |
| 元宝 | hunyuan-pro/standard |
| OpenAI | gpt-4o/4-turbo/3.5-turbo |
| 智谱GLM | glm-4/plus/flash |

## 🔧 环境变量

| 变量名 | 说明 | 必填 |
|--------|------|------|
| DATABASE_URL | PostgreSQL 数据库连接 | ✅ |
| JWT_SECRET | JWT 密钥 | ✅ |
| DEEPSEEK_API_KEY | DeepSeek API密钥 | ❌ |
| OPENAI_API_KEY | OpenAI API密钥 | ❌ |

## 📄 License

MIT License

## 🤝 贡献

欢迎提交 Issue 和 Pull Request！
