<template>
  <div class="user-center-container">
    <h1>个人中心</h1>

    <section class="my-bookshelf">
      <h2>我的书架</h2>
      <!-- 书籍卡片列表将在这里显示 -->
      <div class="book-cards-list">
        <!-- 这里将放置书籍卡片组件 -->
      </div>
    </section>

    <section class="my-creations">
      <h2>我的创作</h2>
      <!-- 创作书籍卡片列表将在这里显示 -->
      <div class="book-cards-list">
        <!-- 这里将放置书籍卡片组件 -->
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
// 导入可能需要的组件或数据
</script>

<style scoped>
.user-center-container {
  padding: 20px;
  max-width: 1200px;
  margin: 0 auto;
}

h1 {
  font-size: 2.5em;
  margin-bottom: 30px;
  text-align: center;
  color: var(--color-heading);
}

section {
  margin-bottom: 40px;
  border: 1px solid var(--color-border);
  border-radius: 8px;
  padding: 20px;
  background-color: var(--color-background-soft);
}

h2 {
  font-size: 1.8em;
  margin-bottom: 20px;
  color: var(--color-text);
  border-bottom: 2px solid var(--color-border-hover);
  padding-bottom: 10px;
}

.book-cards-list {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(180px, 1fr));
  gap: 20px;
}
</style>
