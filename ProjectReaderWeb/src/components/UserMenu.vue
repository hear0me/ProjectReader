<template>
  <el-dropdown
    trigger="click"
    placement="bottom-end"
    @command="handleCommand"
  >
    <div class="user-menu-trigger">
      <el-avatar
        :size="32"
        :src="userAvatar"
        class="user-avatar"
      >
        {{ userName.charAt(0).toUpperCase() }}
      </el-avatar>
      <span class="user-name">{{ userName }}</span>
      <el-icon class="dropdown-icon"><ArrowDown /></el-icon>
    </div>

    <template #dropdown>
      <el-dropdown-menu>
        <el-dropdown-item command="profile">
          <el-icon><User /></el-icon>
          <span>个人资料</span>
        </el-dropdown-item>
        
        <el-dropdown-item command="bookshelf">
          <el-icon><Collection /></el-icon>
          <span>我的书架</span>
        </el-dropdown-item>
        
        <el-dropdown-item command="settings" divided>
          <el-icon><Setting /></el-icon>
          <span>设置</span>
        </el-dropdown-item>
        
        <el-dropdown-item command="logout" divided>
          <el-icon><SwitchButton /></el-icon>
          <span>退出登录</span>
        </el-dropdown-item>
      </el-dropdown-menu>
    </template>
  </el-dropdown>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage, ElMessageBox } from 'element-plus'
import { 
  User, 
  Collection, 
  Setting, 
  SwitchButton, 
  ArrowDown 
} from '@element-plus/icons-vue'
import { useAuth } from '../composables/useAuth'

const router = useRouter()
const { user, userName, signOut } = useAuth()

// 计算用户头像
const userAvatar = computed(() => user.value?.user_metadata?.avatar_url || '')

// 处理菜单命令
const handleCommand = async (command: string) => {
  switch (command) {
    case 'profile':
      router.push('/user-center')
      break
      
    case 'bookshelf':
      router.push('/bookshelf')
      break
      
    case 'settings':
      // 设置页面（待实现）
      ElMessage.info('设置功能开发中...')
      break
      
    case 'logout':
      await handleLogout()
      break
  }
}

// 处理退出登录
const handleLogout = async () => {
  try {
    await ElMessageBox.confirm(
      '确定要退出登录吗？',
      '退出确认',
      {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
      }
    )
    
    const result = await signOut()
    if (result.success) {
      ElMessage.success('已退出登录')
      router.push('/login')
    }
  } catch (error) {
    // 用户取消退出
    if (error !== 'cancel') {
      ElMessage.error('退出登录失败')
    }
  }
}
</script>

<style scoped lang="scss">
.user-menu-trigger {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px 12px;
  border-radius: 8px;
  cursor: pointer;
  transition: background-color 0.3s ease;
  
  &:hover {
    background-color: rgba(66, 185, 131, 0.1);
  }
}

.user-avatar {
  background: linear-gradient(45deg, #42b983, #3aa876);
  color: white;
  font-weight: 600;
}

.user-name {
  font-size: 0.9rem;
  font-weight: 500;
  color: #2c3e50;
  max-width: 100px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.dropdown-icon {
  color: #666;
  font-size: 0.8rem;
}

// 下拉菜单样式
:deep(.el-dropdown-menu__item) {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px 16px;
  
  .el-icon {
    font-size: 1rem;
  }
}

// 响应式设计
@media (max-width: 768px) {
  .user-name {
    display: none;
  }
  
  .user-menu-trigger {
    padding: 6px;
  }
}
</style>
