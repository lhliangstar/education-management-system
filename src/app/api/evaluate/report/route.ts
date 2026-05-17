import { NextRequest, NextResponse } from 'next/server';

// 生成评估报告
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { collegeId, batchId, apiKey, provider, model } = body;
    
    // 获取产业学院数据
    const collegeRes = await fetch(`${request.nextUrl.origin}/api/college`);
    const collegeData = await collegeRes.json();
    const college = collegeData.data?.list?.find((c: any) => c.collegeId === collegeId);
    
    // 获取统计数据
    const statsRes = await fetch(`${request.nextUrl.origin}/api/statistics?type=college`);
    const statsData = await statsRes.json();
    const statsRanking = statsData.data?.ranking || [];
    const collegeStats = statsRanking.find((c: any) => c.collegeId === collegeId);
    const statsOverview = statsData.data?.overview || {};
    
    // 获取评估结果
    const resultRes = await fetch(`${request.nextUrl.origin}/api/evaluate/result`);
    const resultData = await resultRes.json();
    const evaluation = resultData.data?.list?.find((r: any) => r.collegeId === collegeId);
    
    // 构建提示词
    const prompt = buildReportPrompt(college, collegeStats, evaluation);
    
    // 如果提供了API密钥，调用AI生成报告
    if (apiKey) {
      const aiResponse = await callAI(prompt, apiKey, provider || 'deepseek', model || 'deepseek-chat');
      return NextResponse.json({
        success: true,
        data: {
          report: aiResponse,
          rawData: { college, stats: collegeStats, evaluation },
        }
      });
    }
    
    // 未提供API密钥，返回基于模板的报告
    return NextResponse.json({
      success: true,
      data: {
        report: generateTemplateReport(college, collegeStats, evaluation),
        rawData: { college, stats: collegeStats, evaluation },
      }
    });
  } catch (error) {
    console.error('生成报告失败:', error);
    return NextResponse.json({
      success: false,
      message: '生成报告失败'
    }, { status: 500 });
  }
}

function buildReportPrompt(college: any, stats: any, evaluation: any): string {
  return `
请为以下产业学院生成一份专业的评估报告：

产业学院名称：${college?.collegeName || '未知'}
对接产业链：${college?.industryChain || '未知'}
成立时间：${college?.establishTime || '未知'}
负责人：${college?.directorName || '未知'}

评估得分：${stats?.score || evaluation?.totalScore || '待评估'}分
评估等级：${stats?.level || evaluation?.evaluateLevel || '待评定'}

各维度得分：
- 治理结构：${stats?.dimensions?.[0]?.avgScore || '待评估'}分
- 人才培养：${stats?.dimensions?.[1]?.avgScore || '待评估'}分
- 师资队伍：${stats?.dimensions?.[2]?.avgScore || '待评估'}分
- 产教融合：${stats?.dimensions?.[3]?.avgScore || '待评估'}分
- 经费投入：${stats?.dimensions?.[4]?.avgScore || '待评估'}分
- 社会服务：${stats?.dimensions?.[5]?.avgScore || '待评估'}分

专家意见：${evaluation?.expertOpinion || '暂无'}

请生成一份结构清晰的评估报告，包括：
1. 执行摘要
2. 基本情况概述
3. 各维度详细分析
4. 主要成效与亮点
5. 存在问题与不足
6. 改进建议
7. 结论
`;
}

// 模型Provider到BaseUrl的映射
const providerBaseUrls: Record<string, string> = {
  // DeepSeek
  deepseek: 'https://api.deepseek.com/v1',
  // Kimi (月之暗面)
  kimi: 'https://api.moonshot.cn/v1',
  // 通义千问 (阿里)
  qwen: 'https://dashscope.aliyuncs.com/compatible-mode/v1',
  // 文心一言 (百度) - 使用兼容模式
  ernie: 'https://qianfan.baidubce.com/v2/chat/completions',
  // 豆包 (字节跳动)
  doubao: 'https://ark.cn-beijing.volces.com/api/v3',
  // 元宝 (腾讯)
  yuanbao: 'https://hunyuan.cloud.tencent.com/hunyuan/v1/chat/completions',
  // OpenAI
  openai: 'https://api.openai.com/v1',
  // 智谱GLM
  zhipu: 'https://open.bigmodel.cn/api/paas/v4',
};

async function callAI(prompt: string, apiKey: string, provider: string, model: string): Promise<string> {
  const baseUrl = providerBaseUrls[provider] || providerBaseUrls.deepseek;
  
  // 根据不同Provider构建请求体
  let requestBody: any = {
    model,
    messages: [{ role: 'user', content: prompt }],
    temperature: 0.7,
    max_tokens: 2000,
  };
  
  // 某些Provider可能有不同的参数要求
  if (provider === 'qwen') {
    requestBody.max_tokens = 2000;
  } else if (provider === 'ernie' || provider === 'yuanbao') {
    // 百度和腾讯的API可能需要不同的格式
    delete requestBody.max_tokens;
    requestBody.max_completion_tokens = 2000;
  }
  
  // 构建请求头
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
  };
  
  // 不同Provider使用不同的认证方式
  if (provider === 'ernie') {
    // 百度文心使用IAM认证或Access Token，这里简化处理
    headers['Authorization'] = `Bearer ${apiKey}`;
  } else if (provider === 'yuanbao') {
    // 腾讯混元使用SecretId/SecretKey，这里简化处理
    headers['Authorization'] = `Bearer ${apiKey}`;
  } else {
    headers['Authorization'] = `Bearer ${apiKey}`;
  }
  
  const response = await fetch(`${baseUrl}/chat/completions`, {
    method: 'POST',
    headers,
    body: JSON.stringify(requestBody),
  });
  
  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`AI API调用失败: ${response.status} - ${errorText}`);
  }
  
  const data = await response.json();
  
  // 尝试多种响应格式
  return data.choices?.[0]?.message?.content || 
         data.choices?.[0]?.text ||
         data.output?.text ||
         data.result ||
         'AI生成报告失败，请稍后重试';
}

function generateTemplateReport(college: any, stats: any, evaluation: any): string {
  const dimensions = stats?.dimensions || [];
  
  return `
# ${college?.collegeName || '产业学院'}质量评估报告

## 一、执行摘要

${college?.collegeName}成立于${college?.establishTime}，对接${college?.industryChain}产业链。本年度在各方共同努力下，紧紧围绕建设目标，扎实推进各项工作，取得了较好成效。

**评估结论**：综合得分${stats?.score || evaluation?.totalScore || '待评估'}分，评定等级为**${stats?.level || evaluation?.evaluateLevel || '待评定'}**。

## 二、基本情况概述

| 项目 | 内容 |
|------|------|
| 产业学院名称 | ${college?.collegeName || '未知'} |
| 对接产业链 | ${college?.industryChain || '未知'} |
| 成立时间 | ${college?.establishTime || '未知'} |
| 负责人 | ${college?.directorName || '未知'} |
| 联系电话 | ${college?.contactPhone || '未知'} |
| 建设状态 | ${college?.status || '未知'} |

## 三、各维度评估分析

### 3.1 治理结构（权重${dimensions[0]?.weight || 15}%）
**得分**：${dimensions[0]?.avgScore || '待评估'}分  
**分析**：${dimensions[0]?.detail || '理事会运作规范，制度建设完善。'}

### 3.2 人才培养（权重${dimensions[1]?.weight || 25}%）
**得分**：${dimensions[1]?.avgScore || '待评估'}分  
**分析**：${dimensions[1]?.detail || '专业群建设成效显著，招生规模稳步增长。'}

### 3.3 师资队伍（权重${dimensions[2]?.weight || 20}%）
**得分**：${dimensions[2]?.avgScore || '待评估'}分  
**分析**：${dimensions[2]?.detail || '双师型教师比例较高，师资队伍结构合理。'}

### 3.4 产教融合（权重${dimensions[3]?.weight || 15}%）
**得分**：${dimensions[3]?.avgScore || '待评估'}分  
**分析**：${dimensions[3]?.detail || '校企合作深度推进，合作模式多元化。'}

### 3.5 经费投入（权重${dimensions[4]?.weight || 15}%）
**得分**：${dimensions[4]?.avgScore || '待评估'}分  
**分析**：${dimensions[4]?.detail || '经费投入充足，使用规范，执行率高。'}

### 3.6 社会服务（权重${dimensions[5]?.weight || 10}%）
**得分**：${dimensions[5]?.avgScore || '待评估'}分  
**分析**：${dimensions[5]?.detail || '社会服务能力较强，基地利用率高。'}

## 四、主要成效与亮点

1. **治理体系完善**：建立健全理事会制度，形成科学决策机制
2. **培养模式创新**：深化产教融合，培养质量持续提升
3. **师资队伍优化**：双师型教师比例高，企业兼职教师队伍稳定
4. **校企合作深化**：与多家龙头企业建立战略合作关系
5. **条件保障有力**：经费投入充足，实训条件优良

## 五、存在问题与不足

${evaluation?.rectifyRequire || '部分维度得分偏低，需进一步加强建设。'}

## 六、改进建议

1. 加强制度建设，完善内部治理结构
2. 深化校企合作，提升产教融合深度
3. 加强师资培训，提高双师型教师比例
4. 拓宽合作渠道，引进优质企业资源
5. 规范经费管理，提高资金使用效益

## 七、结论

综合评估，${college?.collegeName}建设成效显著，达到了预期建设目标。建议继续保持并发扬优势，同时针对存在的问题制定整改措施，持续改进提升。

---
报告生成时间：${new Date().toLocaleString()}
`;
}
