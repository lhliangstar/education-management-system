import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';

export async function POST() {
  const response = NextResponse.json({
    success: true,
    message: '登出成功'
  });
  
  response.cookies.delete('auth_token');
  
  return response;
}
