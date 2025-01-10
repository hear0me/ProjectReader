<template>
  <div class="reader">
    <div class="reader-header">
      <h1>{{ chapter.title }}</h1>
      <button @click="goBack">返回</button>
    </div>
    
    <div class="reader-content">
      <p v-for="(paragraph, index) in content" :key="index">
        {{ paragraph }}
      </p>
    </div>

    <div class="reader-controls">
      <button 
        :disabled="!hasPrevChapter" 
        @click="goToChapter(prevChapterId)"
      >
        上一章
      </button>
      <button 
        :disabled="!hasNextChapter" 
        @click="goToChapter(nextChapterId)"
      >
        下一章
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'

const route = useRoute()
const router = useRouter()
const novelId = Number(route.params.novelId)
const chapterId = Number(route.params.chapterId)

const chapter = ref({
  id: chapterId,
  title: `第${chapterId}章 示例章节`
})

const content = ref([
  '这是示例小说的内容。',
  '这是第一段内容。',
  '这是第二段内容。',
  '这是第三段内容。',
  '这是第四段内容。'
])

const chapters = [1, 2, 3] // 示例章节ID列表

const hasPrevChapter = computed(() => chapterId > 1)
const hasNextChapter = computed(() => chapterId < chapters.length)
const prevChapterId = computed(() => chapterId - 1)
const nextChapterId = computed(() => chapterId + 1)

function goToChapter(newChapterId: number) {
  router.push(`/novels/${novelId}/read/${newChapterId}`)
}

function goBack() {
  router.push(`/novels/${novelId}`)
}
</script>

<style scoped>
.reader {
  padding: 2rem;
  max-width: 800px;
  margin: 0 auto;
}

.reader-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
}

.reader-content {
  line-height: 1.8;
  font-size: 1.1rem;
}

.reader-controls {
  display: flex;
  justify-content: space-between;
  margin-top: 2rem;
}

button {
  padding: 0.5rem 1rem;
  background-color: #42b983;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

button:disabled {
  background-color: #ccc;
  cursor: not-allowed;
}
</style>
