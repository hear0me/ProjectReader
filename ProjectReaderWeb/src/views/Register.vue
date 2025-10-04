<template>
  <div class="register-container">
    <div class="register-card">
      <div class="register-header">
        <h2 class="register-title">注册</h2>
        <p class="register-subtitle">创建您的 ProjectReader 账号</p>
      </div>

      <el-form
        ref="registerFormRef"
        :model="registerForm"
        :rules="registerRules"
        class="register-form"
        @submit.prevent="handleRegister"
      >
        <el-form-item prop="email">
          <el-input
            v-model="registerForm.email"
            placeholder="请输入邮箱地址"
            size="large"
            prefix-icon="Message"
            type="email"
          />
        </el-form-item>

        <el-form-item prop="password">
          <el-input
            v-model="registerForm.password"
            placeholder="请输入密码（至少6位）"
            size="large"
            prefix-icon="Lock"
            type="password"
            show-password
          />
        </el-form-item>

        <el-form-item prop="confirmPassword">
          <el-input
            v-model="registerForm.confirmPassword"
            placeholder="请再次输入密码"
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
            class="register-button"
            :loading="isLoading"
            native-type="submit"
          >
            {{ isLoading ? '注册中...' : '注册' }}
          </el-button>
        </el-form-item>

        <div class="register-links">
          <router-link to="/login" class="link">已有账号？立即登录</router-link>
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

      <!-- 成功提示 -->
      <el-alert
        v-if="isSuccess"
        title="注册成功！请检查您的邮箱以验证账号。"
        type="success"
        show-icon
        :closable="false"
        class="success-alert"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, computed } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'
import type { FormInstance, FormRules } from 'element-plus'
import { useAuth } from '../composables/useAuth'

const router = useRouter()
const { signUp, isLoading, error, clearError } = useAuth()

// 表单引用
const registerFormRef = ref<FormInstance>()

// 表单数据
const registerForm = reactive({
  email: '',
  password: '',
  confirmPassword: ''
})

// 注册成功状态
const isSuccess = ref(false)

// 密码验证函数
const validatePassword = (rule: any, value: string, callback: any) => {
  if (value === '') {
    callback(new Error('请输入密码'))
  } else if (value.length < 6) {
    callback(new Error('密码长度不能少于6个字符'))
  } else {
    callback()
  }
}

// 确认密码验证函数
const validateConfirmPassword = (rule: any, value: string, callback: any) => {
  if (value === '') {
    callback(new Error('请再次输入密码'))
  } else if (value !== registerForm.password) {
    callback(new Error('两次输入的密码不一致'))
  } else {
    callback()
  }
}

// 表单验证规则
const registerRules: FormRules = {
  email: [
    { required: true, message: '请输入邮箱地址', trigger: 'blur' },
    { type: 'email', message: '请输入有效的邮箱地址', trigger: 'blur' }
  ],
  password: [
    { required: true, validator: validatePassword, trigger: 'blur' }
  ],
  confirmPassword: [
    { required: true, validator: validateConfirmPassword, trigger: 'blur' }
  ]
}

// 处理注册
const handleRegister = async () => {
  if (!registerFormRef.value) return

  try {
    const valid = await registerFormRef.value.validate()
    if (!valid) return

    clearError()
    isSuccess.value = false

    const result = await signUp(registerForm.email, registerForm.password)
    
    if (result.success) {
      isSuccess.value = true
      ElMessage.success('注册成功！请检查您的邮箱以验证账号。')
      
      // 清空表单
      registerForm.email = ''
      registerForm.password = ''
      registerForm.confirmPassword = ''
      
      // 3秒后跳转到登录页面
      setTimeout(() => {
        router.push('/login')
      }, 3000)
    }
  } catch (err) {
    // 错误已经在 composable 中处理
    console.error('注册失败:', err)
  }
}
</script>

<style scoped lang="scss">
.register-container {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  padding: 20px;
}

.register-card {
  background: white;
  border-radius: 12px;
  padding: 40px;
  width: 100%;
  max-width: 400px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
}

.register-header {
  text-align: center;
  margin-bottom: 32px;
}

.register-title {
  font-size: 2rem;
  font-weight: 600;
  color: #2c3e50;
  margin: 0 0 8px 0;
}

.register-subtitle {
  color: #666;
  margin: 0;
  font-size: 1rem;
}

.register-form {
  .el-form-item {
    margin-bottom: 24px;
  }

  .el-input {
    :deep(.el-input__wrapper) {
      border-radius: 8px;
    }
  }
}

.register-button {
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

.register-links {
  text-align: center;
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

.error-alert,
.success-alert {
  margin-top: 16px;
  border-radius: 8px;
}

// 响应式设计
@media (max-width: 480px) {
  .register-container {
    padding: 16px;
  }
  
  .register-card {
    padding: 24px;
  }
  
  .register-title {
    font-size: 1.5rem;
  }
}
</style>
