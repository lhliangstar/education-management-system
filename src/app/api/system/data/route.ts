import { NextRequest, NextResponse } from 'next/server';
import { writeFile, mkdir, readdir } from 'fs/promises';
import { existsSync } from 'fs';
import path from 'path';

// 导出数据
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { type, data, format } = body;

    if (format === 'json') {
      return NextResponse.json({
        success: true,
        data: {
          content: JSON.stringify(data, null, 2),
          filename: `${type}_${Date.now()}.json`,
          mimeType: 'application/json',
        }
      });
    }

    if (format === 'csv') {
      if (!data || data.length === 0) {
        return NextResponse.json({
          success: false,
          message: '没有数据可导出'
        }, { status: 400 });
      }

      const headers = Object.keys(data[0]);
      const csv = [
        headers.join(','),
        ...data.map((row: any) => headers.map(h => `"${row[h] || ''}"`).join(','))
      ].join('\n');

      return NextResponse.json({
        success: true,
        data: {
          content: '\ufeff' + csv,
          filename: `${type}_${Date.now()}.csv`,
          mimeType: 'text/csv',
        }
      });
    }

    return NextResponse.json({
      success: false,
      message: '不支持的格式'
    }, { status: 400 });

  } catch (error) {
    return NextResponse.json({
      success: false,
      message: '导出失败'
    }, { status: 500 });
  }
}

// 导入数据预览
export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const { content, type } = body;

    // 解析CSV或JSON
    let parsedData;
    if (content.trim().startsWith('[')) {
      parsedData = JSON.parse(content);
    } else {
      const lines = content.split('\n').filter((l: string) => l.trim());
      const headers = lines[0].split(',').map((h: string) => h.trim().replace(/"/g, ''));
      parsedData = lines.slice(1).map((line: string) => {
        const values = line.split(',').map((v: string) => v.trim().replace(/"/g, ''));
        const row: any = {};
        headers.forEach((h: string, i: number) => {
          row[h] = values[i] || '';
        });
        return row;
      });
    }

    return NextResponse.json({
      success: true,
      data: {
        preview: parsedData.slice(0, 5),
        total: parsedData.length,
        headers: parsedData.length > 0 ? Object.keys(parsedData[0]) : [],
      }
    });

  } catch (error) {
    return NextResponse.json({
      success: false,
      message: '解析文件失败，请检查文件格式'
    }, { status: 400 });
  }
}

// 列出可用的备份文件
export async function GET() {
  try {
    const backupDir = path.join(process.cwd(), 'backups');
    
    if (!existsSync(backupDir)) {
      return NextResponse.json({
        success: true,
        data: {
          backups: [],
        }
      });
    }

    const files = await readdir(backupDir);
    const backups = files
      .filter(f => f.endsWith('.json') || f.endsWith('.sql'))
      .map(f => ({
        filename: f,
        size: '未知',
        time: new Date().toISOString(),
      }))
      .sort((a, b) => b.time.localeCompare(a.time));

    return NextResponse.json({
      success: true,
      data: { backups }
    });

  } catch (error) {
    return NextResponse.json({
      success: false,
      message: '获取备份列表失败'
    }, { status: 500 });
  }
}
