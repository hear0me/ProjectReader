<template>
  <div class="login-container">
    <div class="login-card">
      <div class="login-header">
        <h2 class="login-title">登录</h2>
        <p class="login-subtitle">欢迎回到 ProjectReader</p>
      </div>

      <el-form
        ref="loginFormRef"
        :model="loginForm"
        :rules="loginRules"
        class="login-form"
        @submit.prevent="handleLogin"
      >
        <el-form-item prop="email">
          <el-input
            v-model="loginForm.email"
            placeholder="请输入邮箱地址"
            size="large"
            prefix-icon="Message"
            type="email"
          />
        </el-form-item>

        <el-form-item prop="password">
          <el-input
            v-model="loginForm.password"
            placeholder="请输入密码"
            size="large"
            prefix-icon="Lock"
            type="password"
            show-password
          />
        </el-form-item>

        <el-form-item>
          <el-button
            type="primary"
            size="large"
            class="login-button"
            :loading="isLoading"
            native-type="submit"
          >
            {{ isLoading ? '登录中...' : '登录' }}
          </el-button>
        </el-form-item>

        <div class="login-links">
          <router-link to="/register" class="link">还没有账号？立即注册</router-link>
          <router-link to="/forgot-password" class="link">忘记密码？</router-link>
        </div>
      </el-form>

      <!-- 错误提示 -->
      <el-alert
        v-if="error"
        :title="error"
        type="error"
        show-icon
        :closable="false"
        class="error-alert"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'
import type { FormInstance, FormRules } from 'element-plus'
import { useAuth } from '../composables/useAuth'

const router = useRouter()
const { signIn, isLoading, error, clearError } = useAuth()

// 表单引用
const loginFormRef = ref<FormInstance>()

// 表单数据
const loginForm = reactive({
  email: '',
  password: ''
})

// 表单验证规则
const loginRules: FormRules = {
  email: [
    { required: true, message: '请输入邮箱地址', trigger: 'blur' },
    { type: 'email', message: '请输入有效的邮箱地址', trigger: 'blur' }
  ],
  password: [
    { required: true, message: '请输入密码', trigger: 'blur' },
    { min: 6, message: '密码长度不能少于6个字符', trigger: 'blur' }
  ]
}

// 处理登录
const handleLogin = async () => {
  if (!loginFormRef.value) return

  try {
    const valid = await loginFormRef.value.validate()
    if (!valid) return

    clearError()

    const result = await signIn(loginForm.email, loginForm.password)
    
    if (result.success) {
      ElMessage.success('登录成功！')
      router.push('/')
    }
  } catch (err) {
    // 错误已经在 composable 中处理
    console.error('登录失败:', err)
  }
}
</script>

<style scoped lang="scss">
.login-container {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  padding: 20px;
}

.login-card {
  background: white;
  border-radius: 12px;
  padding: 40px;
  width: 100%;
  max-width: 400px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
}

.login-header {
  text-align: center;
  margin-bottom: 32px;
}

.login-title {
  font-size: 2rem;
  font-weight: 600;
  color: #2c3e50;
  margin: 0 0 8px 0;
}

.login-subtitle {
  color: #666;
  margin: 0;
  font-size: 1rem;
}

.login-form {
  .el-form-item {
    margin-bottom: 24px;
  }

  .el-input {
    :deep(.el-input__wrapper) {
      border-radius: 8px;
    }
  }
}

.login-button {
  width: 100%;
  height: 48px;
  border-radius: 8px;
  font-size: 1rem;
  font-weight: 500;
  background: linear-gradient(45deg, #42b983, #3aa876);
  border: none;
  
  &:hover {
    background: linear-gradient(45deg, #3aa876, #42b983);
    transform: translateY(-1px);
    box-shadow: 0 4px 12px rgba(66, 185, 131, 0.3);
  }
}

.login-links {
  display: flex;
  justify-content: space-between;
  margin-top: 16px;
  
  .link {
    color: #42b983;
    text-decoration: none;
    font-size: 0.9rem;
    
    &:hover {
      text-decoration: underline;
    }
  }
}

.error-alert {
  margin-top: 16px;
  border-radius: 8px;
}

// 响应式设计
@media (max-width: 480px) {
  .login-container {
    padding: 16px;
  }
  
  .login-card {
    padding: 24px;
  }
  
  .login-title {
    font-size: 1.5rem;
  }
  
  .login-links {
    flex-direction: column;
    gap: 8px;
    text-align: center;
  }
}
</style>
