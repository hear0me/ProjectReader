<template>
  <div class="home">
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
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()

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
  padding-top: 80px;
  width: 100%;
}

.recommendations {
  width: 100%;
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem;
}

.carousel-container {
  position: relative;
  width: 100%;
  overflow: hidden;
}

.carousel {
  display: flex;
}

.carousel-item {
  flex: 0 0 100%;
  text-align: center;
  cursor: pointer;
}

.carousel-item img {
  width: 300px;
  height: 400px;
  object-fit: cover;
  border-radius: 8px;
  margin-bottom: 1rem;
}

.carousel-item:hover img {
  transform: scale(1.05);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
}

.carousel-dots {
  display: flex;
  justify-content: center;
  gap: 1rem;
  margin-top: 1rem;
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

h2 {
  text-align: left;
  margin-bottom: 2rem;
  padding-left: 1rem;
}

h3 {
  font-size: 1.2rem;
  margin-bottom: 0.5rem;
}

p {
  color: #666;
}
</style>
