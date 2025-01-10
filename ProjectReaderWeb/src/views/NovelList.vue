<template>
  <div class="novel-list">
    <!-- 轮播图 -->

    <div class="grid-container">
      <div 
        class="grid-item"
        v-for="novel in paginatedNovels"
        :key="novel.id"
        @click="goToNovel(novel.id)"
      >
        <img :src="novel.cover" alt="novel cover">
        <div class="novel-info">
          <h3>{{ novel.title }}</h3>
          <p>{{ novel.author }}</p>
        </div>
      </div>
    </div>
    
    <div class="pagination">
      <button 
        :disabled="currentPage === 1"
        @click="prevPage"
      >
        上一页
      </button>
      <span>第 {{ currentPage }} 页</span>
      <button
        :disabled="currentPage === totalPages"
        @click="nextPage"
      >
        下一页
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()


// 模拟数据
const novels = ref(Array.from({ length: 27 }, (_, i) => ({
  id: i + 1,
  title: `小说${i + 1}`,
  author: `作者${i + 1}`,
  cover: `https://picsum.photos/200/300?random=${i + 1}`
})))

// 分页相关
const itemsPerPage = 9
const currentPage = ref(1)

const totalPages = computed(() => Math.ceil(novels.value.length / itemsPerPage))

const paginatedNovels = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage
  const end = start + itemsPerPage
  return novels.value.slice(start, end)
})

const prevPage = () => {
  if (currentPage.value > 1) {
    currentPage.value--
  }
}

const nextPage = () => {
  if (currentPage.value < totalPages.value) {
    currentPage.value++
  }
}

const goToNovel = (id: number) => {
  router.push(`/novels/${id}`)
}
</script>

<style scoped>
.novel-list {
  padding: 20px;
  width: 100%;
  margin: 0 auto;
}

.grid-container {
  display: grid;
  grid-template-columns: repeat(3, minmax(300px, 1fr));
  gap: 40px;
  margin: 40px auto;
  padding: 0 40px;
  width: 100%;
  max-width: 1600px;
}

.grid-item {
  cursor: pointer;
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.15);
  transition: transform 0.2s;
  width: 100%;
  aspect-ratio: 2/3;
  display: flex;
  flex-direction: column;
  min-width: 300px;
}

.grid-item:hover {
  transform: translateY(-5px);
}

.grid-item img {
  width: 100%;
  height: 85%;
  object-fit: cover;
}

.novel-info {
  padding: 15px;
  background: white;
  height: 15%;
  display: flex;
  flex-direction: column;
  justify-content: center;
}

.novel-info h3 {
  margin: 0 0 8px;
  font-size: 1.1rem;
  line-height: 1.2;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.novel-info p {
  margin: 0;
  color: #666;
  font-size: 0.9rem;
  line-height: 1.2;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.pagination {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 20px;
  margin-top: 30px;
}

.pagination button {
  padding: 8px 16px;
  border: 1px solid #ddd;
  border-radius: 4px;
  background: white;
  cursor: pointer;
  transition: all 0.2s;
}

.pagination button:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.pagination button:hover:not(:disabled) {
  background: #f5f5f5;
  border-color: #ccc;
}

@media (min-width: 1921px) {
  .grid-container {
    grid-template-columns: repeat(4, minmax(300px, 1fr));
  }
}

@media (max-width: 1920px) {
  .grid-container {
    grid-template-columns: repeat(3, minmax(300px, 1fr));
  }
}

@media (max-width: 1200px) {
  .grid-container {
    gap: 30px;
    padding: 0 30px;
    grid-template-columns: repeat(2, minmax(300px, 1fr));
  }
}

@media (max-width: 768px) {
  .grid-container {
    grid-template-columns: repeat(2, 1fr);
    gap: 20px;
    padding: 0 20px;
  }
  
  .grid-item {
    min-width: auto;
  }
}

@media (max-width: 480px) {
  .grid-container {
    grid-template-columns: 1fr;
    padding: 0 15px;
  }
}
</style>
