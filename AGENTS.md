# 产业学院质量监控与智能评估管理系统

## 项目概述

产业学院质量监控与智能评估管理系统是一个企业级Web应用，用于管理产业学院的评估工作。

## 技术栈

- **Framework**: Next.js 16 (App Router)
- **Core**: React 19
- **Language**: TypeScript 5
- **UI 组件**: shadcn/ui (基于 Radix UI)
- **Styling**: Tailwind CSS 4
- **数据库**: PostgreSQL + Drizzle ORM

## 数据库设计

本系统包含 **26 张核心数据表**，分为 7 大类：

### 第一类：系统权限类（3张）
- `sys_user` - 用户管理员表
- `sys_role` - 角色表
- `sys_permission` - 菜单权限表

### 第二类：学校组织归口类（2张）
- `sys_department` - 学校部门表
- `sys_notice` - 系统通知公告表

### 第三类：基础主数据类（5张）
- `sys_dict` - 公共字典表
- `industry_college` - 产业学院基本信息表
- `college_level` - 产业学院等级认定表
- `coop_enterprise` - 合作企业信息表
- `major_group` - 专业群对接信息表

### 第四类：治理运行类（2张）
- `council_member` - 理事会管委会成员表
- `system_meeting` - 制度与会议记录表

### 第五类：业务核心类（9张）
- `fund_invest` - 经费投入明细表
- `training_base` - 实训基地场地设备表
- `info_resource` - 图书与信息化资源表
- `train_plan` - 人才培养方案表
- `course_textbook` - 课程与教材建设表
- `student_train` - 学生培养过程统计表
- `full_teacher` - 专任教师信息表
- `part_teacher` - 企业兼职教师表
- `research_service` - 科研与社会服务表

### 第六类：评估管理类（3张）
- `evaluate_batch` - 评估批次表
- `evaluate_index` - 评估指标字典表
- `evidence_file` - 佐证材料关联表

### 第七类：归档整改类（2张）
- `evaluate_archive` - 年度评估归档表
- `rectify_record` - 评估问题整改记录表

## 页面路由

- `/` - 首页（重定向到 /dashboard）
- `/dashboard` - 数据概览仪表盘
- `/college` - 产业学院管理
- `/evaluate/batch` - 评估批次管理
- `/evaluate/fill` - 数据填报
- `/evaluate/review` - 专家评审
- `/evaluate/result` - 结果公示

## API 接口

- `POST /api/auth/login` - 用户登录
- `GET/POST/PUT/DELETE /api/college` - 产业学院管理
- `GET /api/evaluate/batch` - 评估批次管理
- `GET /api/statistics` - 统计数据
- `GET /api/dict` - 字典数据

## 开发命令

```bash
# 安装依赖
pnpm install

# 开发环境
pnpm dev

# 构建生产版本
pnpm build

# 生产环境
pnpm start
```

## 数据库初始化

运行 SQL 文件初始化数据库：

```bash
psql -U postgres -d industry_college -f database/schema.sql
```

## 环境变量

```env
DATABASE_URL=postgresql://postgres:postgres@localhost:5432/industry_college
```
