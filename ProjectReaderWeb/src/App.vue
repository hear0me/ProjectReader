<template>
  <!-- 新增全局包裹容器 -->
  <div class="global-wrapper">
    <el-container>
      
      <!-- 新增内容容器 -->
      <el-main class="main-container">
        <div class="content-wrapper">
          <router-view />
        </div>
      </el-main>
    </el-container>
  </div>
</template>

<script setup lang="ts">
import { House, List, Collection } from '@element-plus/icons-vue'
</script>

<style scoped lang="scss">
/* 新增全局包裹层 */
.global-wrapper {
  width: 100%;
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  background: var(--el-bg-color-page);
  position: relative;
}

/* 统一容器样式 */
.main-container {
  flex: 1;
  display: flex;
  padding: 0 !important;
}

/* 内容区域约束 */
.content-wrapper {
  width: 100%;
  max-width: 1600px;
  margin: 0 auto;
  padding: 20px 32px;
  box-sizing: border-box;
}

/* 优化头部样式 */
.global-header {
  width: 100% !important;
  background: white;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.08);
  z-index: 1000;
  padding: 0;
  height: 60px;

  .nav-container {
    max-width: 1600px;
    height: 100%;
    margin: 0 auto;
    padding: 0 32px;
    display: flex;
    justify-content: space-between;
    align-items: center;
  }

  .nav-left {
    display: flex;
    align-items: center;
    gap: 32px;

    .site-title {
      font-size: 1.5rem;
      font-weight: 600;
      color: #2c3e50;
      margin: 0;
      white-space: nowrap;
    }

    .nav-menu {
      border: none;
      height: 60px;
      margin: 0;
      padding: 0;
      background: transparent;

      :deep(.el-menu-item) {
        height: 60px;
        line-height: 60px;
        font-size: 1rem;
        color: #606266;
        transition: all 0.3s ease;

        &.is-active {
          color: #42b983;
          font-weight: 500;
        }

        &:hover {
          color: #42b983;
          background: rgba(66, 185, 131, 0.1);
        }

        .el-icon {
          margin-right: 4px;
          font-size: 1.2em;
        }
      }
    }
  }

  .nav-right {
    .bookshelf-btn {
      height: 40px;
      padding: 0 24px;
      border-radius: 20px;
      font-size: 1rem;
      background: linear-gradient(45deg, #42b983, #3aa876);
      border: none;
      transition: all 0.3s ease;

      &:hover {
        transform: translateY(-2px);
        box-shadow: 0 4px 12px rgba(66, 185, 131, 0.2);
      }

      .el-icon {
        margin-right: 6px;
        font-size: 1.2em;
      }
    }
  }
}

/* 响应式调整 */
@media (max-width: 1200px) {
  .content-wrapper {
    padding: 20px 24px;
  }
  
  .global-header {
    .nav-container {
      padding: 0 24px;
    }
    
    .nav-left {
      gap: 24px;
    }
  }
}

@media (max-width: 768px) {
  .content-wrapper {
    padding: 16px;
  }

  .global-header {
    .nav-container {
      padding: 0 16px;
    }

    .nav-left {
      gap: 16px;

      .site-title {
        font-size: 1.2rem;
      }

      .nav-menu {
        :deep(.el-menu-item) {
          padding: 0 12px;
          font-size: 0.9rem;

          .el-icon {
            margin-right: 2px;
          }
        }
      }
    }

    .nav-right {
      .bookshelf-btn {
        padding: 0 16px;
        height: 36px;
        font-size: 0.9rem;

        .el-icon {
          margin-right: 4px;
        }
      }
    }
  }
}

@media (max-width: 480px) {
  .global-header {
    .nav-left {
      .site-title {
        display: none;
      }

      .nav-menu {
        :deep(.el-menu-item) {
          padding: 0 8px;
          
          span {
            display: none;
          }

          .el-icon {
            margin-right: 0;
            font-size: 1.4em;
          }
        }
      }
    }

    .nav-right {
      .bookshelf-btn {
        width: 36px;
        height: 36px;
        padding: 0;
        border-radius: 50%;

        span {
          display: none;
        }

        .el-icon {
          margin: 0;
          font-size: 1.4em;
        }
      }
    }
  }
}
</style>
