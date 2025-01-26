<template>
  <!-- 新增全局包裹容器 -->
  <div class="global-wrapper">
    <el-container>
      <el-header class="global-header">
        <el-menu
        :router="true"
        mode="horizontal"
        :ellipsis="false"
        class="nav-menu"
      >
        <el-menu-item index="/">
          <el-icon><House /></el-icon>
          首页
        </el-menu-item>
        <el-menu-item index="/novels">
          <el-icon><List /></el-icon>
          小说列表
        </el-menu-item>
        <div class="flex-grow" />
        <el-menu-item index="/bookshelf" class="bookshelf-item">
          <el-icon><Collection /></el-icon>
          我的书架
        </el-menu-item>
      </el-menu>
      </el-header>

      <!-- 新增内容容器 -->
      <el-main class="main-container">
        <div class="content-wrapper">
          <router-view />
        </div>
      </el-main>
    </el-container>
  </div>
</template>

<style scoped>
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
  
  .nav-menu {
    width: 100%;
    max-width: 1600px;
    height: 60px;
    margin: 0 auto;
    padding: 0 32px;
    box-sizing: border-box;
  }
}

/* 响应式调整 */
@media (max-width: 1200px) {
  .content-wrapper {
    padding: 20px 24px;
  }
  
  .global-header .nav-menu {
    padding: 0 24px;
  }
}

@media (max-width: 768px) {
  .content-wrapper {
    padding: 16px;
  }

  .global-header .nav-menu {
    padding: 0 16px;
    
    :deep(.el-menu-item) {
      padding: 0 8px;
      font-size: 0.9rem;
    }
  }
}
</style>
