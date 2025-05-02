<template>
  <div class="home">
    <nav class="navbar">
      <router-link to="/" class="nav-home">首页</router-link>
      
      <div class="search-container">
        <input 
          type="text" 
          placeholder="搜索书籍/作者"
          v-model="searchQuery"
          @focus="showHistory = true"
          @blur="() => { showHistory = false }">
        <div class="search-history" v-show="showHistory">
          <div v-for="(item, index) in searchHistory" :key="index" class="history-item">
            {{ item }}
          </div>
        </div>
      </div>

      <div class="nav-right">
        <router-link to="/bookshelf" class="icon-link">
          <IconBookshelf />
        </router-link>
        <router-link to="/profile">
          <img src="https://picsum.photos/32/32?random=9" class="avatar" alt="用户头像">
        </router-link>
      </div>
    </nav>

    <div class="recommendations">
      <h2>热门推荐</h2>
      <div class="carousel-container">
        <div 
          class="carousel" 
          :style="{ transform: `translateX(-${currentIndex * 100}%)`, transition: isTransitioning ? 'transform 0.5s ease' : 'none' }"
          @transitionend="handleTransitionEnd"
        >
          <div 
            class="carousel-item" 
            v-for="(novel, index) in clonedNovels" 
            :key="index"
            @click="goToNovel(novel.id)"
          >
            <img :src="novel.cover" alt="novel cover">
            <h3>{{ novel.title }}</h3>
            <p>{{ novel.author }}</p>
          </div>
        </div>
        <div class="carousel-dots">
          <span 
            v-for="(_, index) in novels" 
            :key="index"
            :class="{ active: currentIndex === index + 1 }"
            @click="setActiveItem(index)"
          ></span>
        </div>
      </div>
    </div>

    <section class="ranking-section">
      <h2>本周热门排行</h2>
      <div class="ranking-list">
        <div class="rank-item" v-for="(novel, index) in rankingNovels" :key="novel.id">
          <span class="rank-number">{{ index + 1 }}</span>
          <img :src="novel.cover" :alt="novel.title">
          <div class="info">
            <h4>{{ novel.title }}</h4>
            <p class="author">{{ novel.author }}</p>
            <p class="stats">
              <span class="hot">🔥 {{ novel.hot }}</span>
              <span class="rating">⭐ {{ novel.rating }}</span>
            </p>
          </div>
        </div>
      </div>
    </section>

    <footer class="footer">
      <div class="copyright">© 2025 ProjectReader 版权所有</div>
      <div class="links">
        <a href="/help">帮助中心</a>
        <a href="/contact">联系我们</a>
      </div>
    </footer>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import { useRouter } from 'vue-router'
import IconBookshelf from '@/components/icons/IconBookshelf.vue'

const router = useRouter()
const searchQuery = ref('')
const showHistory = ref(false)
const searchHistory = ref(['玄幻小说', '科幻经典', '编程指南', '历史人文'])

const rankingNovels = [
  {
    id: 1,
    title: '无限轮回',
    author: '作者A',
    cover: 'https://picsum.photos/150/200?random=4',
    hot: '1.2万',
    rating: '4.5'
  },
  {
    id: 2,
    title: '星际穿越',
    author: '作者B',
    cover: 'https://picsum.photos/150/200?random=5',
    hot: '9.8k',
    rating: '4.7'
  },
  {
    id: 3,
    title: '末日求生',
    author: '作者C',
    cover: 'https://picsum.photos/150/200?random=6',
    hot: '8.5k',
    rating: '4.4'
  },
  {
    id: 4,
    title: '修仙之路',
    author: '作者D',
    cover: 'https://picsum.photos/150/200?random=7',
    hot: '7.2k',
    rating: '4.6'
  },
  {
    id: 5,
    title: '都市传说',
    author: '作者E',
    cover: 'https://picsum.photos/150/200?random=8',
    hot: '6.9k',
    rating: '4.3'
  }
]

const novels = [
  {
    id: 1,
    title: '小说1',
    author: '作者1',
    cover: 'https://picsum.photos/200/300?random=1'
  },
  {
    id: 2,
    title: '小说2', 
    author: '作者2',
    cover: 'https://picsum.photos/200/300?random=2'
  },
  {
    id: 3,
    title: '小说3',
    author: '作者3',
    cover: 'https://picsum.photos/200/300?random=3'
  }
]

// Add clones for infinite effect
const clonedNovels = [
  novels[novels.length - 1], // Last item
  ...novels,                 // Original items
  novels[0]                  // First item
]

const currentIndex = ref(1) // Start at first real item
const timer = ref<number>()
const isTransitioning = ref(true)

const setActiveItem = (index: number) => {
  isTransitioning.value = true
  currentIndex.value = index + 1 // Offset for cloned items
}

const handleTransitionEnd = () => {
  if (currentIndex.value === clonedNovels.length - 1) {
    isTransitioning.value = false
    currentIndex.value = 1
    // isTransitioning.value = true
  }
}

const startAutoPlay = () => {
  timer.value = setInterval(() => {
    isTransitioning.value = true
    currentIndex.value++
    
    // If we're at the last clone, jump to first real item
    if (currentIndex.value >= clonedNovels.length) {
      // Reset immediately without waiting for transition
      isTransitioning.value = false
      currentIndex.value = 1
      isTransitioning.value = true
    }
  }, 3000)
}

const goToNovel = (id: number) => {
  router.push(`/novels/${id}`)
}

onMounted(() => {
  startAutoPlay()
})

onUnmounted(() => {
  if (timer.value) {
    clearInterval(timer.value)
  }
})
</script>

<style scoped>
.home {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  padding: 60px 0 0;
  width: 100%;
}

.navbar {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 60px;
  background: white;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 24px;
  z-index: 1000;
}

.nav-home {
  text-decoration: none;
  color: #333;
  font-size: 1.1rem;
  font-weight: 500;
  padding: 0.5rem 1rem;
  border-radius: 4px;
  transition: color 0.3s;
}

.nav-home:hover,
.nav-home.router-link-active {
  color: #007bff;
}

.search-container {
  position: relative;
  width: 40%;
  max-width: 480px;
}

.search-container input {
  width: 100%;
  height: 36px;
  padding: 0 16px;
  border: 1px solid #e0e0e0;
  border-radius: 18px;
  font-size: 0.95rem;
  outline: none;
  transition: border-color 0.3s, box-shadow 0.3s;
}

.search-container input:focus {
  border-color: #007bff;
  box-shadow: 0 0 0 2px rgba(0,123,255,0.1);
}

.search-history {
  position: absolute;
  top: calc(100% + 8px);
  left: 0;
  width: 100%;
  background: white;
  border-radius: 8px;
  box-shadow: 0 4px 12px rgba(0,0,0,0.1);
  padding: 8px 0;
  z-index: 1000;
}

.history-item {
  padding: 8px 16px;
  cursor: pointer;
  transition: background-color 0.2s;
}

.history-item:hover {
  background-color: #f5f5f5;
}

.nav-right {
  display: flex;
  align-items: center;
  gap: 24px;
}

.icon-link {
  color: #666;
  transition: color 0.3s;
  display: flex;
  align-items: center;
}

.icon-link:hover {
  color: #007bff;
}

.avatar {
  width: 32px;
  height: 32px;
  border-radius: 50%;
  object-fit: cover;
}


.recommendations {
  width: 100%;
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem;
  height: 300px;
  position: relative;
}

.carousel-container {
  position: relative;
  width: 100%;
  height: 100%;
  overflow: hidden;
}

.carousel {
  display: flex;
  height: 100%;
}

.carousel-item {
  flex: 0 0 100%;
  text-align: center;
  cursor: pointer;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}

.carousel-item img {
  width: 225px;
  height: 300px;
  object-fit: cover;
  border-radius: 8px;
  margin-bottom: 0.5rem;
}

.carousel-item:hover img {
  transform: scale(1.05);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
}

.carousel-dots {
  position: absolute;
  bottom: 10px;
  left: 50%;
  transform: translateX(-50%);
  display: flex;
  justify-content: center;
  gap: 1rem;
  z-index: 1;
}

.carousel-dots span {
  width: 10px;
  height: 10px;
  border-radius: 50%;
  background-color: #ddd;
  cursor: pointer;
  transition: background-color 0.3s;
}

.carousel-dots span.active {
  background-color: #666;
}

.ranking-section {
  width: 100%;
  max-width: 1200px;
  margin: 2rem auto;
  padding: 0 2rem;
}

.ranking-list {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 2rem;
  margin-top: 1.5rem;
}

.rank-item {
  display: flex;
  align-items: center;
  padding: 1rem;
  background: white;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0,0,0,0.05);
  transition: transform 0.3s ease;
}

.rank-item:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 8px rgba(0,0,0,0.1);
}

.rank-number {
  font-size: 1.5rem;
  font-weight: bold;
  color: #ff6b6b;
  margin-right: 1rem;
  min-width: 30px;
}

.rank-item img {
  width: 80px;
  height: 120px;
  object-fit: cover;
  border-radius: 4px;
  margin-right: 1rem;
}

.info {
  flex: 1;
}

.info h4 {
  font-size: 1.1rem;
  margin: 0 0 0.5rem;
  color: #333;
}

.info .author {
  color: #666;
  font-size: 0.9rem;
  margin-bottom: 0.5rem;
}

.stats {
  display: flex;
  gap: 1rem;
  font-size: 0.9rem;
  color: #666;
}

.hot {
  color: #ff6b6b;
}

.rating {
  color: #ffd700;
}

h2 {
  text-align: left;
  margin-bottom: 1rem;
  padding-left: 1rem;
  color: #333;
  font-size: 1.5rem;
}

h3 {
  font-size: 1.2rem;
  margin-bottom: 0.5rem;
}

p {
  color: #666;
  margin: 0;
}

.footer {
  margin-top: auto;
  padding: 2rem;
  background: #f5f5f5;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.footer .copyright {
  color: #666;
}

.footer .links {
  display: flex;
  gap: 2rem;
}

.footer a {
  color: #666;
  text-decoration: none;
  transition: color 0.3s;
}

.footer a:hover {
  color: #333;
}
</style>
