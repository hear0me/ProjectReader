import { createClient } from '@supabase/supabase-js'

// 从环境变量获取配置
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

// 创建 Supabase 客户端实例
export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// 导出类型定义
export type User = {
  id: string
  email: string
  user_metadata?: {
    name?: string
    avatar_url?: string
  }
  created_at: string
  updated_at: string
}

export type AuthError = {
  message: string
  status?: number
}
