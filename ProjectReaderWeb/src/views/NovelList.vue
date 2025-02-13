<template>
  <div class="novel-list">
    <!-- 轮播图 -->
    <div class="carousel-section">
      <el-carousel 
        height="400px" 
        :autoplay="true"
        trigger="click"
        :interval="5000"
      >
        <el-carousel-item v-for="novel in featuredNovels" :key="novel.id">
          <div class="carousel-content" @click="goToNovel(novel.id)">
            <img :src="novel.cover" :alt="novel.title">
            <div class="carousel-info">
              <h2>{{ novel.title }}</h2>
              <p class="author">{{ novel.author }}</p>
              <p class="desc">{{ novel.description }}</p>
            </div>
          </div>
        </el-carousel-item>
      </el-carousel>
    </div>

    <div class="novel-section">
      <h2 class="section-title">
        <span class="title-text">全部作品</span>
        <span class="title-desc">海量小说等你来看</span>
      </h2>
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
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()

// 推荐小说数据
const featuredNovels = ref([
  {
    id: 1001,
    title: '推荐小说1',
    author: '著名作家1',
    cover: 'https://picsum.photos/800/400?random=1',
    description: '这是一部精彩的小说，融合了奇幻与现实...'
  },
  {
    id: 1002,
    title: '推荐小说2',
    author: '著名作家2',
    cover: 'https://picsum.photos/800/400?random=2',
    description: '一个关于成长与冒险的故事...'
  },
  {
    id: 1003,
    title: '推荐小说3',
    author: '著名作家3',
    cover: 'https://picsum.photos/800/400?random=3',
    description: '震撼人心的史诗巨作...'
  }
])

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

<style scoped lang="scss">
.novel-list {
  padding: 20px;
  width: 100%;
  margin: 0 auto;
  background: linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%);
  min-height: 100vh;
}

.carousel-section {
  max-width: 1200px;
  margin: 0 auto 40px;
  padding: 0 20px;

  .carousel-content {
    width: 100%;
    height: 100%;
    position: relative;
    cursor: pointer;
    overflow: hidden;
    border-radius: 12px;
    
    img {
      width: 100%;
      height: 100%;
      object-fit: cover;
      transition: transform 0.3s ease;
    }

    &:hover img {
      transform: scale(1.05);
    }

    .carousel-info {
      position: absolute;
      bottom: 0;
      left: 0;
      right: 0;
      padding: 30px;
      background: linear-gradient(to top, rgba(0,0,0,0.8), transparent);
      color: white;

      h2 {
        font-size: 2rem;
        margin: 0 0 10px;
      }

      .author {
        font-size: 1.1rem;
        margin: 0 0 8px;
        opacity: 0.9;
      }

      .desc {
        font-size: 1rem;
        margin: 0;
        opacity: 0.8;
        display: -webkit-box;
        -webkit-line-clamp: 2;
        -webkit-box-orient: vertical;
        overflow: hidden;
      }
    }
  }
}

.novel-section {
  max-width: 1600px;
  margin: 0 auto;
  padding: 0 20px;

  .section-title {
    display: flex;
    align-items: baseline;
    gap: 12px;
    margin-bottom: 32px;
    padding-left: 40px;

    .title-text {
      font-size: 1.8rem;
      font-weight: 600;
      color: #2c3e50;
      
      &::before {
        content: '';
        display: inline-block;
        width: 4px;
        height: 24px;
        background: linear-gradient(to bottom, #42b983, #3aa876);
        margin-right: 12px;
        vertical-align: middle;
        border-radius: 2px;
      }
    }

    .title-desc {
      color: #666;
      font-size: 1rem;
    }
  }
}

.grid-container {
  display: grid;
  grid-template-columns: repeat(3, minmax(300px, 1fr));
  gap: 40px;
  margin: 40px auto;
  padding: 0 40px;
  width: 100%;
}

.grid-item {
  cursor: pointer;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.1);
  transition: all 0.3s ease;
  width: 100%;
  aspect-ratio: 2/3;
  display: flex;
  flex-direction: column;
  min-width: 300px;
  background: white;

  &:hover {
    transform: translateY(-8px);
    box-shadow: 0 8px 24px rgba(0, 0, 0, 0.15);
  }

  img {
    width: 100%;
    height: 85%;
    object-fit: cover;
  }

  .novel-info {
    padding: 20px;
    background: white;
    height: 15%;
    display: flex;
    flex-direction: column;
    justify-content: center;

    h3 {
      margin: 0 0 8px;
      font-size: 1.2rem;
      font-weight: 600;
      color: #2c3e50;
      line-height: 1.2;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }

    p {
      margin: 0;
      color: #666;
      font-size: 0.9rem;
      line-height: 1.2;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }
  }
}

.pagination {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 20px;
  margin: 40px 0;
  padding: 20px 0;

  button {
    padding: 12px 24px;
    border: none;
    border-radius: 8px;
    background: #42b983;
    color: white;
    font-size: 1rem;
    cursor: pointer;
    transition: all 0.3s ease;
    min-width: 120px;

    &:disabled {
      background: #ccc;
      cursor: not-allowed;
    }

    &:not(:disabled):hover {
      background: #3aa876;
      transform: translateY(-2px);
    }
  }

  span {
    font-size: 1rem;
    color: #666;
  }
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

  .carousel-section {
    .carousel-content {
      .carousel-info {
        h2 {
          font-size: 1.5rem;
        }
      }
    }
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

  .carousel-section {
    .carousel-content {
      .carousel-info {
        padding: 20px;
        
        h2 {
          font-size: 1.2rem;
        }

        .author {
          font-size: 1rem;
        }

        .desc {
          display: none;
        }
      }
    }
  }

  .section-title {
    flex-direction: column;
    gap: 8px;
    padding-left: 20px;

    .title-text {
      font-size: 1.5rem;
    }
  }
}

@media (max-width: 480px) {
  .grid-container {
    grid-template-columns: 1fr;
    padding: 0 15px;
  }
}
</style>
