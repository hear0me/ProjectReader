<template>
  <div class="reader" :class="{ 'night-mode': isNightMode }">
    <div class="reader-header">
      <div class="header-left">
        <el-button @click="goBack" icon="ArrowLeft" circle />
        <h1>{{ chapter.title }}</h1>
      </div>
      <div class="header-right">
        <el-button @click="toggleSettings" icon="Setting" circle />
        <el-button @click="toggleNightMode" :icon="isNightMode ? 'Sunny' : 'Moon'" circle />
      </div>
    </div>

    <!-- 设置面板 -->
    <el-drawer
      v-model="showSettings"
      title="阅读设置"
      :size="300"
      direction="rtl"
    >
      <div class="settings-panel">
        <div class="setting-item">
          <span>字体大小</span>
          <el-slider
            v-model="fontSize"
            :min="12"
            :max="24"
            :step="1"
            @change="updateFontSize"
          />
        </div>
        <div class="setting-item">
          <span>行间距</span>
          <el-slider
            v-model="lineHeight"
            :min="1.5"
            :max="3"
            :step="0.1"
            @change="updateLineHeight"
          />
        </div>
        <div class="setting-item">
          <span>背景颜色</span>
          <div class="bg-options">
            <div
              v-for="color in bgColors"
              :key="color"
              class="bg-option"
              :style="{ backgroundColor: color }"
              :class="{ active: backgroundColor === color }"
              @click="updateBgColor(color)"
            ></div>
          </div>
        </div>
      </div>
    </el-drawer>
    
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
import { ref, computed, onMounted, onUnmounted, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'

const route = useRoute()
const router = useRouter()

// 阅读设置相关
const showSettings = ref(false)
const isNightMode = ref(false)
const fontSize = ref(16)
const lineHeight = ref(1.8)
const backgroundColor = ref('#ffffff')
const bgColors = ref([
  '#ffffff', // 白色
  '#f4ecd8', // 米色
  '#cce8cf', // 淡绿
  '#e6e6e6'  // 浅灰
])

// 设置相关方法
const toggleSettings = () => {
  showSettings.value = !showSettings.value
}

const toggleNightMode = () => {
  isNightMode.value = !isNightMode.value
  if (isNightMode.value) {
    document.body.style.backgroundColor = '#1a1a1a'
  } else {
    document.body.style.backgroundColor = backgroundColor.value
  }
}

const updateFontSize = (size: number) => {
  fontSize.value = size
}

const updateLineHeight = (height: number) => {
  lineHeight.value = height
}

const updateBgColor = (color: string) => {
  backgroundColor.value = color
  if (!isNightMode.value) {
    document.body.style.backgroundColor = color
  }
}

// 组件卸载时清理
onUnmounted(() => {
  document.body.style.backgroundColor = ''
})

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

<style scoped lang="scss">
.reader {
  padding: 2rem;
  max-width: 800px;
  margin: 0 auto;
  min-height: 100vh;
  transition: all 0.3s;

  &.night-mode {
    background-color: #1a1a1a;
    color: #e0e0e0;

    .reader-content {
      p {
        color: #e0e0e0;
      }
    }

    .reader-controls {
      button {
        background-color: #333;
        color: #e0e0e0;
        &:disabled {
          background-color: #444;
        }
        &:not(:disabled):hover {
          background-color: #444;
        }
      }
    }
  }
}

.reader-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
  padding: 1rem;
  background-color: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(5px);
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  position: sticky;
  top: 1rem;
  z-index: 10;

  .header-left,
  .header-right {
    display: flex;
    align-items: center;
    gap: 1rem;

    h1 {
      margin: 0;
      font-size: 1.5rem;
    }
  }
}

.reader-content {
  line-height: v-bind(lineHeight);
  font-size: v-bind('`${fontSize}px`');
  min-height: 400px;
  position: relative;
  padding: 2rem;
  background-color: rgba(255, 255, 255, 0.95);
  border-radius: 8px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.1);
  margin-bottom: 2rem;

  p {
    margin: 1em 0;
    text-indent: 2em;
  }
}

.reader-controls {
  display: flex;
  justify-content: space-between;
  margin-top: 2rem;
  padding: 1rem;
  background-color: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(5px);
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  position: sticky;
  bottom: 1rem;

  button {
    padding: 0.8rem 2rem;
    background-color: #42b983;
    color: white;
    border: none;
    border-radius: 4px;
    cursor: pointer;
    transition: all 0.2s;
    font-weight: 500;
    min-width: 120px;

    &:disabled {
      background-color: #ccc;
      cursor: not-allowed;
    }

    &:not(:disabled):hover {
      background-color: #3aa876;
      transform: translateY(-1px);
    }
  }
}

.error-message {
  color: #ff4757;
  text-align: center;
  margin: 1rem 0;
  padding: 1rem;
  background-color: #ffe0e3;
  border-radius: 4px;
}

.loading {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
}

.settings-panel {
  padding: 2rem;

  .setting-item {
    margin-bottom: 2rem;

    span {
      display: block;
      margin-bottom: 1rem;
      font-weight: 500;
    }
  }

  .bg-options {
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    gap: 1rem;

    .bg-option {
      width: 100%;
      aspect-ratio: 1;
      border-radius: 8px;
      cursor: pointer;
      border: 2px solid transparent;
      transition: all 0.2s;

      &.active {
        border-color: #42b983;
      }

      &:hover {
        transform: scale(1.05);
      }
    }
  }
}

:deep(.el-drawer__header) {
  margin-bottom: 2rem;
  padding: 1rem 2rem;
  border-bottom: 1px solid #eee;
}

:deep(.el-slider) {
  width: 100%;
}
</style>
