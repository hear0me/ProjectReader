import { ref, computed } from 'vue'
import { useAuthStore } from '../stores/auth'

/**
 * 认证相关的 Composable 函数
 * 提供响应式的认证状态和操作方法
 */
export function useAuth() {
  const authStore = useAuthStore()

  // 响应式状态
  const user = computed(() => authStore.user)
  const isLoading = computed(() => authStore.isLoading)
  const error = computed(() => authStore.error)
  const isAuthenticated = computed(() => authStore.isAuthenticated)
  const userName = computed(() => authStore.userName)

  /**
   * 邮箱密码注册
   */
  const signUp = async (email: string, password: string) => {
    try {
      const result = await authStore.signUp(email, password)
      return { success: true, data: result }
    } catch (error) {
      return { success: false, error }
    }
  }

  /**
   * 邮箱密码登录
   */
  const signIn = async (email: string, password: string) => {
    try {
      const result = await authStore.signIn(email, password)
      return { success: true, data: result }
    } catch (error) {
      return { success: false, error }
    }
  }

  /**
   * 登出
   */
  const signOut = async () => {
    try {
      await authStore.signOut()
      return { success: true }
    } catch (error) {
      return { success: false, error }
    }
  }

  /**
   * 重置密码
   */
  const resetPassword = async (email: string) => {
    try {
      await authStore.resetPassword(email)
      return { success: true }
    } catch (error) {
      return { success: false, error }
    }
  }

  /**
   * 更新用户信息
   */
  const updateUser = async (updates: { email?: string; password?: string; data?: any }) => {
    try {
      const result = await authStore.updateUser(updates)
      return { success: true, data: result }
    } catch (error) {
      return { success: false, error }
    }
  }

  /**
   * 获取当前用户信息
   */
  const getCurrentUser = async () => {
    try {
      const user = await authStore.getCurrentUser()
      return { success: true, data: user }
    } catch (error) {
      return { success: false, error }
    }
  }

  /**
   * 清除错误信息
   */
  const clearError = () => {
    authStore.error = null
  }

  return {
    // 状态
    user,
    isLoading,
    error,
    isAuthenticated,
    userName,
    
    // 方法
    signUp,
    signIn,
    signOut,
    resetPassword,
    updateUser,
    getCurrentUser,
    clearError,
  }
}

/**
 * 路由守卫相关的认证检查
 */
export function useAuthGuard() {
  const authStore = useAuthStore()

  /**
   * 检查用户是否已认证
   */
  const requireAuth = () => {
    if (!authStore.isAuthenticated) {
      return { allowed: false, redirectTo: '/login' }
    }
    return { allowed: true }
  }

  /**
   * 检查用户是否未认证（用于登录/注册页面）
   */
  const requireGuest = () => {
    if (authStore.isAuthenticated) {
      return { allowed: false, redirectTo: '/' }
    }
    return { allowed: true }
  }

  return {
    requireAuth,
    requireGuest,
  }
}
