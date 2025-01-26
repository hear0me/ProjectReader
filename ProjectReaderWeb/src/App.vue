<template>
  <div>
    <el-container>
    <el-header height="60px">
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

    <el-main>
      <router-view />
    </el-main>
  </el-container>
  </div>
  
</template>

<style>
.el-container {
  min-height: 100vh;
}

.el-header {
  padding: 0;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  background: white;
}

.nav-menu {
  height: 60px;
  padding: 0 20px;
}

.flex-grow {
  flex-grow: 1;
}

.bookshelf-item {
  background-color: var(--el-color-primary) !important;
  color: white !important;
  border-radius: 4px;
  margin: 10px 0;
}

.bookshelf-item:hover {
  background-color: var(--el-color-primary-light-3) !important;
}

.el-main {
  padding-top: 20px;
  background-color: var(--el-bg-color-page);
}
</style>
