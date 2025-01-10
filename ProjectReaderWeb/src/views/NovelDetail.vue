<template>
  <div class="novel-detail">
    <div class="detail-header">
      <div class="book-info">
        <div class="cover-container">
          <img :src="novel.cover" alt="小说封面" class="novel-cover">
        </div>
        <div class="basic-info">
          <h1>{{ novel.title }}</h1>
          <div class="meta-info">
            <div class="meta-item">
              <span class="label">作者：</span>
              <span class="value">{{ novel.author }}</span>
            </div>
            <div class="meta-item">
              <span class="label">字数：</span>
              <span class="value">95.7万字</span>
            </div>
            <div class="meta-item">
              <span class="label">总推荐：</span>
              <span class="value">10.44万</span>
            </div>
          </div>
          <div class="action-buttons">
            <button class="primary-btn" @click="startReading">开始阅读</button>
            <button class="secondary-btn">加入书架</button>
          </div>
        </div>
      </div>
      <div class="author-info">
        <div class="author-avatar">
          <img src="https://via.placeholder.com/100" alt="作者头像">
        </div>
        <h3>{{ novel.author }}</h3>
        <p class="author-desc">网文作家</p>
        <div class="author-stats">
          <div class="stat-item">
            <div class="stat-value">11</div>
            <div class="stat-label">作品总数</div>
          </div>
          <div class="stat-item">
            <div class="stat-value">4213万</div>
            <div class="stat-label">累计字数</div>
          </div>
          <div class="stat-item">
            <div class="stat-value">5732</div>
            <div class="stat-label">创作天数</div>
          </div>
        </div>
      </div>
    </div>

    <div class="detail-content">
      <div class="book-intro">
        <h2>作品简介</h2>
        <p>{{ novel.description }}</p>
      </div>
      
      <div class="chapter-list">
        <h2>章节列表</h2>
        <ul>
          <li 
            v-for="chapter in chapters" 
            :key="chapter.id"
            @click="readChapter(chapter.id)"
          >
            {{ chapter.title }}
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'

interface Novel {
  id: number
  title: string
  author: string
  cover: string
  description: string
}

interface Chapter {
  id: number
  title: string
}

const route = useRoute()
const router = useRouter()
const novelId = Number(route.params.id)

const novel = ref<Novel>({
  id: novelId,
  title: '示例小说',
  author: '示例作者',
  cover: 'https://via.placeholder.com/300',
  description: '这是一个示例小说的简介'
})

const chapters = ref<Chapter[]>([
  { id: 1, title: '第一章 开始' },
  { id: 2, title: '第二章 发展' },
  { id: 3, title: '第三章 高潮' }
])

function startReading() {
  router.push(`/novels/${novelId}/read/1`)
}

function readChapter(chapterId: number) {
  router.push(`/novels/${novelId}/read/${chapterId}`)
}
</script>

<style scoped>
.novel-detail {
  padding: 2rem;
  max-width: 1200px;
  margin: 0 auto;
}

.detail-header {
  display: flex;
  gap: 2rem;
  margin-bottom: 2rem;
}

.book-info {
  flex: 2;
  display: flex;
  gap: 2rem;
  background-color: #f8f9fa;
  padding: 2rem;
  border-radius: 12px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.08);
}

.cover-container {
  flex-shrink: 0;
}

.novel-cover {
  width: 200px;
  height: 266px;
  object-fit: cover;
  border-radius: 8px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
}

.basic-info {
  flex: 1;
}

.basic-info h1 {
  font-size: 2rem;
  margin: 0 0 1.5rem 0;
  color: #2c3e50;
  line-height: 1.2;
}

.meta-info {
  margin-bottom: 2rem;
}

.meta-item {
  margin-bottom: 0.8rem;
  font-size: 1.1rem;
}

.meta-item .label {
  color: #666;
  margin-right: 0.5rem;
}

.meta-item .value {
  color: #2c3e50;
  font-weight: 500;
}

.action-buttons {
  display: flex;
  gap: 1rem;
}

.primary-btn, .secondary-btn {
  padding: 0.8rem 2rem;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  font-size: 1rem;
  transition: all 0.3s ease;
}

.primary-btn {
  background-color: #42b983;
  color: white;
}

.secondary-btn {
  background-color: #e9ecef;
  color: #2c3e50;
}

.primary-btn:hover, .secondary-btn:hover {
  transform: translateY(-2px);
}

.author-info {
  flex: 1;
  background-color: #f8f9fa;
  padding: 2rem;
  border-radius: 12px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.08);
  text-align: center;
}

.author-avatar {
  margin-bottom: 1rem;
}

.author-avatar img {
  width: 100px;
  height: 100px;
  border-radius: 50%;
  object-fit: cover;
}

.author-info h3 {
  font-size: 1.5rem;
  margin: 0 0 0.5rem 0;
  color: #2c3e50;
}

.author-desc {
  color: #666;
  margin-bottom: 1.5rem;
}

.author-stats {
  display: flex;
  justify-content: space-around;
  padding-top: 1rem;
  border-top: 1px solid #dee2e6;
}

.stat-item {
  text-align: center;
}

.stat-value {
  font-size: 1.2rem;
  font-weight: 600;
  color: #2c3e50;
}

.stat-label {
  font-size: 0.9rem;
  color: #666;
  margin-top: 0.3rem;
}

.detail-content {
  background-color: #fff;
  border-radius: 12px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.08);
  overflow: hidden;
}

.book-intro {
  padding: 2rem;
  border-bottom: 1px solid #dee2e6;
}

.book-intro h2, .chapter-list h2 {
  font-size: 1.5rem;
  color: #2c3e50;
  margin: 0 0 1rem 0;
}

.book-intro p {
  color: #34495e;
  line-height: 1.6;
  margin: 0;
}

.chapter-list {
  padding: 2rem;
}

ul {
  list-style: none;
  padding: 0;
  margin: 0;
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: 1rem;
}

li {
  padding: 0.8rem 1rem;
  border: 1px solid #dee2e6;
  border-radius: 6px;
  cursor: pointer;
  transition: all 0.2s ease;
  color: #2c3e50;
}

li:hover {
  background-color: #f8f9fa;
  transform: translateY(-2px);
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

@media (max-width: 992px) {
  .detail-header {
    flex-direction: column;
  }
  
  .book-info {
    flex-direction: column;
    align-items: center;
    text-align: center;
  }
  
  .action-buttons {
    justify-content: center;
  }
  
  .author-info {
    width: 100%;
  }
}

@media (max-width: 576px) {
  .novel-detail {
    padding: 1rem;
  }
  
  .book-info, .author-info {
    padding: 1rem;
  }
  
  .novel-cover {
    width: 160px;
    height: 213px;
  }
  
  .basic-info h1 {
    font-size: 1.5rem;
  }
  
  ul {
    grid-template-columns: 1fr;
  }
}
</style>
