<template>
  <div class="reader">
    <div class="reader-header">
      <h1>{{ chapter.title }}</h1>
      <button @click="goBack">返回</button>
    </div>
    
    <div class="reader-content">
      <div v-if="loading" class="loading">加载中...</div>
      <div v-else-if="error" class="error-message">{{ error }}</div>
      <template v-else>
        <p v-for="(paragraph, index) in chapter.content" :key="index">
          {{ paragraph }}
        </p>
      </template>
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
import { ref, computed, onMounted, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'

const route = useRoute()
const router = useRouter()

// 验证并获取有效的ID值
const getValidId = (param: string | string[] | undefined): number => {
  const id = typeof param === 'string' ? parseInt(param, 10) : NaN
  return isNaN(id) ? -1 : id
}

// 使用ref使ID值具有响应性
const novelId = ref<number>(getValidId(route.params.novelId))
const chapterId = ref<number>(getValidId(route.params.chapterId))

const loading = ref(false) // 初始状态设为false
const error = ref<string | null>(null)

interface Chapter {
  id: number
  title: string
  content: string[]
}

const chapter = ref<Chapter>({
  id: chapterId.value,
  title: `第${chapterId.value}章`,
  content: []
})

const chapters = ref<number[]>([])

// 模拟API调用获取章节列表
const fetchChaptersList = async () => {
  try {
    // 模拟网络延迟
    await new Promise(resolve => setTimeout(resolve, 300))
    const response = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]
    chapters.value = response
    return response
  } catch (e) {
    error.value = '获取章节列表失败'
    console.error(e)
    return []
  }
}

// 模拟API调用获取章节内容
const fetchChapterContent = async (id: number) => {
  // 先重置错误状态
  error.value = null
  
  // 参数验证
  if (id < 0) {
    error.value = '无效的章节ID'
    return
  }

  try {
    loading.value = true // 开始加载
    
    // 模拟网络延迟
    await new Promise(resolve => setTimeout(resolve, 300))
    
    const response = {
      id: id,
      title: `第${id}章`,
      content: [
        `这是第${id}章的示例内容。`,
        '这是第一段内容。',
        '这是第二段内容。',
        '这是第三段内容。',
        '这是第四段内容。'
      ]
    }
    
    chapter.value = response
  } catch (e) {
    error.value = '获取章节内容失败'
    console.error(e)
  } finally {
    loading.value = false // 确保总是关闭加载状态
  }
}

// 计算当前章节在列表中的索引
const currentChapterIndex = computed(() => chapters.value.indexOf(chapterId.value))

// 根据实际章节列表判断是否有上/下章
const hasPrevChapter = computed(() => currentChapterIndex.value > 0)
const hasNextChapter = computed(() => currentChapterIndex.value < chapters.value.length - 1)

// 获取上/下章的实际ID
const prevChapterId = computed(() => 
  hasPrevChapter.value ? chapters.value[currentChapterIndex.value - 1] : null
)
const nextChapterId = computed(() => 
  hasNextChapter.value ? chapters.value[currentChapterIndex.value + 1] : null
)

// 章节导航
async function goToChapter(newChapterId: number | null) {
  if (newChapterId === null || novelId.value < 0) {
    error.value = '无效的导航参数'
    return
  }

  try {
    await router.push(`/novels/${novelId.value}/read/${newChapterId}`)
  } catch (e) {
    error.value = '页面跳转失败'
    console.error(e)
  }
}

// 返回按钮处理
function goBack() {
  if (novelId.value < 0) {
    router.push('/novels') // 如果没有有效的小说ID，返回小说列表页面
    return
  }
  router.push(`/novels/${novelId.value}`)
}

// 监听路由参数变化
watch(() => route.params.novelId, (newNovelId) => {
  const newId = getValidId(newNovelId)
  if (novelId.value !== newId) {
    novelId.value = newId
  }
})

watch(() => route.params.chapterId, (newChapterId) => {
  const newId = getValidId(newChapterId)
  if (chapterId.value !== newId) {
    chapterId.value = newId
    if (newId >= 0) {
      fetchChapterContent(newId)
    }
  }
})

// 组件挂载时初始化数据
onMounted(async () => {
  // 参数验证
  if (novelId.value < 0 || chapterId.value < 0) {
    error.value = '无效的参数'
    return
  }

  // 初始化数据加载
  loading.value = true
  try {
    await Promise.all([
      fetchChaptersList(),
      fetchChapterContent(chapterId.value)
    ])
  } catch (e) {
    error.value = '加载失败'
    console.error(e)
  } finally {
    loading.value = false
  }
})
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
  min-height: 400px;
  position: relative;
}

.reader-controls {
  display: flex;
  justify-content: space-between;
  margin-top: 2rem;
}

.error-message {
  color: red;
  text-align: center;
  margin: 1rem 0;
}

.loading {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
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
