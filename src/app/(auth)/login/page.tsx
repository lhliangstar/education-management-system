'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function LoginPage() {
  const router = useRouter();
  const [account, setAccount] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    
    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ account, password }),
      });
      
      const data = await res.json();
      
      if (data.success) {
        // 保存用户信息到 localStorage
        localStorage.setItem('user', JSON.stringify(data.data));
        // 跳转到首页
        router.push('/dashboard');
      } else {
        setError(data.message || '登录失败');
      }
    } catch (err) {
      setError('网络错误，请稍后重试');
    } finally {
      setLoading(false);
    }
  };

  const demoAccounts = [
    { account: 'admin', password: 'admin123', name: '校管理员', desc: '拥有全部权限' },
    { account: 'college_admin', password: 'college123', name: '产业学院管理员', desc: '管理本学院数据' },
    { account: 'expert', password: 'expert123', name: '评审专家', desc: '进行评估评审' },
    { account: 'reviewer', password: 'reviewer123', name: '部门审核员', desc: '审核各部门数据' },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-500 via-blue-600 to-indigo-700 flex items-center justify-center p-4">
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-white/10 rounded-full blur-3xl" />
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-indigo-300/10 rounded-full blur-3xl" />
      </div>
      
      <div className="relative w-full max-w-md">
        <div className="bg-white rounded-2xl shadow-2xl p-8">
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-100 rounded-full mb-4">
              <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
              </svg>
            </div>
            <h1 className="text-xl font-bold text-gray-800">产业学院质量监控与</h1>
            <h1 className="text-xl font-bold text-gray-800">智能评估管理系统</h1>
          </div>
          
          <form onSubmit={handleLogin} className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">账号</label>
              <input
                type="text"
                value={account}
                onChange={(e) => setAccount(e.target.value)}
                className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition"
                placeholder="请输入账号"
                required
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">密码</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition"
                placeholder="请输入密码"
                required
              />
            </div>
            
            {error && (
              <div className="bg-red-50 text-red-600 px-4 py-3 rounded-lg text-sm">
                {error}
              </div>
            )}
            
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-blue-600 text-white py-3 rounded-lg font-medium hover:bg-blue-700 transition disabled:opacity-50"
            >
              {loading ? '登录中...' : '登 录'}
            </button>
          </form>
          
          <div className="mt-8">
            <p className="text-sm text-gray-500 text-center mb-4">演示账号（点击快速填充）</p>
            <div className="grid grid-cols-2 gap-3">
              {demoAccounts.map((demo) => (
                <button
                  key={demo.account}
                  onClick={() => {
                    setAccount(demo.account);
                    setPassword(demo.password);
                  }}
                  className="p-3 border border-gray-200 rounded-lg hover:border-blue-400 hover:bg-blue-50 transition text-left group"
                >
                  <p className="font-medium text-gray-800 group-hover:text-blue-600">{demo.name}</p>
                  <p className="text-xs text-gray-500">{demo.desc}</p>
                </button>
              ))}
            </div>
          </div>
        </div>
        
        <p className="text-center text-white/60 text-sm mt-6">
          产业学院质量监控与智能评估管理系统 v1.0
        </p>
      </div>
    </div>
  );
}
