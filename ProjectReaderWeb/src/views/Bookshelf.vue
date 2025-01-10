<template>
  <div class="bookshelf">
    <h1>我的书架</h1>
    
    <div class="book-grid" v-if="books.length > 0">
      <div class="book-card" v-for="book in books" :key="book.id" @click="goToNovel(book.id)">
        <div class="book-cover">
          <img :src="book.cover" :alt="book.title">
          <div class="reading-progress">
            已读：{{ book.progress }}%
          </div>
        </div>
        <div class="book-info">
          <h3>{{ book.title }}</h3>
          <p class="author">{{ book.author }}</p>
          <p class="last-read">上次阅读：{{ book.lastReadTime }}</p>
        </div>
        <div class="card-actions">
          <button class="continue-btn" @click.stop="continueReading(book.id)">
            继续阅读
          </button>
          <button class="remove-btn" @click.stop="removeFromShelf(book.id)">
            <i class="fas fa-times"></i>
          </button>
        </div>
      </div>
    </div>

    <div class="empty-state" v-else>
      <i class="fas fa-book-open empty-icon"></i>
      <p>书架空空如也，快去添加喜欢的小说吧！</p>
      <router-link to="/novels" class="browse-btn">
        去找小说
      </router-link>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()

interface Book {
  id: number
  title: string
  author: string
  cover: string
  progress: number
  lastReadTime: string
}

// 模拟数据，实际应该从本地存储或后端获取
const books = ref<Book[]>([
  {
    id: 1,
    title: '示例小说1',
    author: '作者1',
    cover: 'https://picsum.photos/200/300?random=1',
    progress: 35,
    lastReadTime: '2024-01-09 23:15'
  },
  {
    id: 2,
    title: '示例小说2',
    author: '作者2',
    cover: 'https://picsum.photos/200/300?random=2',
    progress: 68,
    lastReadTime: '2024-01-08 15:30'
  }
])

const goToNovel = (id: number) => {
  router.push(`/novels/${id}`)
}

const continueReading = (id: number) => {
  // 这里应该获取上次阅读的章节
  router.push(`/novels/${id}/read/1`)
}

const removeFromShelf = (id: number) => {
  if (confirm('确定要将这本书从书架中移除吗？')) {
    books.value = books.value.filter(book => book.id !== id)
  }
}
</script>

<style scoped>
.bookshelf {
  padding: 2rem;
  padding-top: 80px;
  max-width: 1200px;
  margin: 0 auto;
}

h1 {
  margin-bottom: 2rem;
  color: #2c3e50;
}

.book-grid {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.book-card {
  display: flex;
  background: white;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.08);
  transition: transform 0.3s ease;
  position: relative;
  height: 180px;
  width: 100%;
}

.book-card:hover {
  transform: translateY(-2px);
}

.book-cover {
  position: relative;
  width: 135px;
  height: 100%;
  flex-shrink: 0;
}

.book-cover img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.reading-progress {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  background: rgba(0, 0, 0, 0.7);
  color: white;
  padding: 0.4rem;
  font-size: 0.9rem;
  text-align: center;
}

.book-info {
  flex: 1;
  padding: 1.5rem 2rem;
  display: flex;
  flex-direction: column;
  justify-content: center;
  min-width: 0; /* 防止文本溢出 */
}

.book-info h3 {
  margin: 0;
  font-size: 1.3rem;
  color: #2c3e50;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.author {
  color: #666;
  margin: 0.6rem 0;
  font-size: 1rem;
}

.last-read {
  color: #999;
  font-size: 0.9rem;
  margin: 0;
}

.card-actions {
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 1.5rem;
  border-left: 1px solid #eee;
  min-width: 200px;
}

.continue-btn {
  flex: 1;
  background: #42b983;
  color: white;
  border: none;
  padding: 0.7rem 1.2rem;
  border-radius: 4px;
  cursor: pointer;
  transition: all 0.3s ease;
  white-space: nowrap;
  font-size: 0.95rem;
}

.continue-btn:hover {
  background: #3aa876;
  transform: translateY(-1px);
}

.remove-btn {
  width: 32px;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: none;
  border: none;
  color: #dc3545;
  cursor: pointer;
  border-radius: 50%;
  transition: all 0.3s ease;
}

.remove-btn:hover {
  background: #fee;
  transform: scale(1.1);
}

.empty-state {
  text-align: center;
  padding: 4rem 2rem;
  color: #666;
}

.empty-icon {
  font-size: 4rem;
  color: #ddd;
  margin-bottom: 1rem;
}

.browse-btn {
  display: inline-block;
  background: #42b983;
  color: white;
  text-decoration: none;
  padding: 0.8rem 2rem;
  border-radius: 6px;
  margin-top: 1rem;
  transition: background-color 0.3s;
}

.browse-btn:hover {
  background: #3aa876;
}

@media (max-width: 768px) {
  .bookshelf {
    padding: 1rem;
  }
  
  .book-card {
    flex-direction: column;
    height: auto;
  }
  
  .book-cover {
    width: 100%;
    height: 200px;
  }
  
  .book-info {
    padding: 1rem;
  }
  
  .card-actions {
    flex-direction: row;
    justify-content: space-between;
    padding: 1rem;
    border-left: none;
    border-top: 1px solid #eee;
    min-width: auto;
  }
  
  .continue-btn {
    flex: 1;
    margin-right: 1rem;
  }
}
</style> 