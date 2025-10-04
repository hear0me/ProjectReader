import { ref, computed } from 'vue'
import { defineStore } from 'pinia'
import { supabase, type User } from '../utils/supabase'

export const useAuthStore = defineStore('auth', () => {
  // 状态
  const user = ref<User | null>(null)
  const isLoading = ref(false)
  const error = ref<string | null>(null)

  // 计算属性
  const isAuthenticated = computed(() => !!user.value)
  const userName = computed(() => user.value?.user_metadata?.name || user.value?.email?.split('@')[0] || '用户')

  // 获取当前用户
  const getCurrentUser = async () => {
    try {
      const { data: { user: currentUser } } = await supabase.auth.getUser()
      user.value = currentUser as User | null
      return currentUser
    } catch (err) {
      console.error('获取用户信息失败:', err)
      user.value = null
      return null
    }
  }

  // 邮箱密码注册
  const signUp = async (email: string, password: string) => {
    isLoading.value = true
    error.value = null
    
    try {
      const { data, error: signUpError } = await supabase.auth.signUp({
        'email': email,
        'password': password
      })
      
      if (signUpError) throw signUpError
      
      user.value = data.user as User
      return data
    } catch (err: any) {
      error.value = err.message || '注册失败'
      throw err
    } finally {
      isLoading.value = false
    }
  }

  // 邮箱密码登录
  const signIn = async (email: string, password: string) => {
    isLoading.value = true
    error.value = null
    
    try {
      const { data, error: signInError } = await supabase.auth.signInWithPassword({
        email,
        password,
      })
      
      if (signInError) throw signInError
      
      user.value = data.user as User
      return data
    } catch (err: any) {
      error.value = err.message || '登录失败'
      throw err
    } finally {
      isLoading.value = false
    }
  }

  // 登出
  const signOut = async () => {
    isLoading.value = true
    error.value = null
    
    try {
      const { error: signOutError } = await supabase.auth.signOut()
      if (signOutError) throw signOutError
      
      user.value = null
    } catch (err: any) {
      error.value = err.message || '登出失败'
      throw err
    } finally {
      isLoading.value = false
    }
  }

  // 重置密码
  const resetPassword = async (email: string) => {
    isLoading.value = true
    error.value = null
    
    try {
      const { error: resetError } = await supabase.auth.resetPasswordForEmail(email)
      if (resetError) throw resetError
    } catch (err: any) {
      error.value = err.message || '密码重置邮件发送失败'
      throw err
    } finally {
      isLoading.value = false
    }
  }

  // 更新用户信息
  const updateUser = async (updates: { email?: string; password?: string; data?: any }) => {
    isLoading.value = true
    error.value = null
    
    try {
      const { data, error: updateError } = await supabase.auth.updateUser(updates)
      if (updateError) throw updateError
      
      user.value = data.user as User
      return data
    } catch (err: any) {
      error.value = err.message || '更新用户信息失败'
      throw err
    } finally {
      isLoading.value = false
    }
  }

  // 监听认证状态变化
  supabase.auth.onAuthStateChange((event, session) => {
    if (event === 'SIGNED_IN' && session) {
      user.value = session.user as User
    } else if (event === 'SIGNED_OUT') {
      user.value = null
    }
  })

  // 初始化时获取当前用户
  getCurrentUser()

  return {
    // 状态
    user,
    isLoading,
    error,
    
    // 计算属性
    isAuthenticated,
    userName,
    
    // 方法
    getCurrentUser,
    signUp,
    signIn,
    signOut,
    resetPassword,
    updateUser,
  }
})
