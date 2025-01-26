<template>
  <el-container class="novel-detail-container">
    <el-main class="main-content">
      <!-- 加载状态 -->
      <el-skeleton :rows="5" animated v-if="loading" />

      <!-- 错误提示 -->
      <el-alert 
        v-if="error"
        type="error"
        :title="error.message"
        show-icon
        closable
        class="error-alert"
      />

      <!-- 主要内容 -->
      <template v-if="!loading && !error">
        <!-- 书籍信息区块 -->
        <el-row :gutter="32" class="main-row">
          <el-col :xs="24" :lg="16" :xl="16" class="left-col">
            <el-card class="book-card">
              <el-row :gutter="32">
                <el-col :xs="24" :sm="8" :md="6">
                  <el-image
                    :src="novel.cover"
                    :alt="novel.title"
                    :aria-label="`${novel.title}封面图`"
                    class="novel-cover"
                    fit="cover"
                    :preview-src-list="[novel.cover]"
                  />
                </el-col>
                <el-col :xs="24" :sm="16" :md="18">
                  <div class="book-info">
                    <h1 class="book-title">{{ novel.title }}</h1>
                    <el-descriptions :column="1" border class="meta-info">
                      <el-descriptions-item label="作者">{{ novel.author }}</el-descriptions-item>
                      <el-descriptions-item label="字数">95.7万字</el-descriptions-item>
                      <el-descriptions-item label="总推荐">10.44万</el-descriptions-item>
                    </el-descriptions>
                    <div class="action-buttons">
                      <el-button 
                        type="primary" 
                        size="large"
                        icon="Reading"
                        @click="startReading"
                      >
                        立即阅读
                      </el-button>
                      <el-button 
                        size="large"
                        icon="Collection"
                      >
                        加入书架
                      </el-button>
                    </div>
                  </div>
                </el-col>
              </el-row>
            </el-card>
          </el-col>

          <!-- 作者信息区块 -->
          <el-col :xs="24" :lg="8" :xl="8" class="right-col">
            <el-card class="author-card">
              <div class="author-profile">
                <el-avatar :size="120" :src="authorAvatar" class="author-avatar" />
                <h3 class="author-name">{{ novel.author }}</h3>
                <p class="author-tag">签约作家</p>
                <el-row class="author-stats">
                  <el-col :span="8">
                    <el-statistic title="作品数" :value="11" />
                  </el-col>
                  <el-col :span="8">
                    <el-statistic title="总字数" :value="4213" suffix="万" />
                  </el-col>
                  <el-col :span="8">
                    <el-statistic title="创作日" :value="5732" />
                  </el-col>
                </el-row>
              </div>
            </el-card>
          </el-col>
        </el-row>

        <!-- 作品简介 -->
        <el-card class="description-card">
          <h2 class="section-title">作品简介</h2>
          <p class="description-content">{{ novel.description }}</p>
        </el-card>

        <!-- 章节列表 -->
        <el-card class="chapter-card">
          <div class="chapter-header">
            <h2 class="section-title">目录列表</h2>
            <el-tag type="info">共{{ chapters.length }}章</el-tag>
          </div>
          <el-empty 
            v-if="chapters.length === 0" 
            description="暂无章节" 
            class="empty-chapter"
          />
          <el-table
            v-else
            :data="chapters"
            stripe
            style="width: 100%"
            @row-click="handleRowClick"
            class="chapter-table"
          >
            <el-table-column
              prop="title"
              label="章节名称"
              min-width="300"
              class-name="chapter-title"
            />
            <el-table-column
              label="操作"
              width="120"
              align="right"
            >
              <template #default="{ row }">
                <el-button 
                  type="primary" 
                  link 
                  @click.stop="readChapter(row.id)"
                  :class="{ 'current-chapter': currentChapter === row.id }"
                >
                  阅读
                </el-button>
              </template>
            </el-table-column>
          </el-table>
        </el-card>
      </template>
    </el-main>
  </el-container>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { debounce } from 'lodash-es'

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
const loading = ref(true)
const error = ref<Error | null>(null)
const currentChapter = ref(1)

// 安全获取路由参数
// const novelId = computed(() => {
//   const id = route.params.id
//   return /^\d+$/.test(id) ? Number(id) : 0
// })

const novelId = computed(() => {
  const paramValue = route.params.id
  
  // 处理多段路由参数情况
  if (Array.isArray(paramValue)) {
    const validValues = paramValue.filter(v => typeof v === 'string' && /^\d+$/.test(v))
    return validValues.length > 0 ? Number(validValues[0]) : 0
  }

  // 处理字符串类型
  if (typeof paramValue === 'string') {
    return /^\d+$/.test(paramValue) ? Number(paramValue) : 0
  }

  return 0
})

const authorAvatar = ref('https://via.placeholder.com/100')
const novel = ref<Novel>({
  id: novelId.value,
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

// 模拟数据加载
onMounted(async () => {
  try {
    // 这里可以替换为真实API调用
    await new Promise(resolve => setTimeout(resolve, 1000))
    loading.value = false
  } catch (err) {
    error.value = err as Error
    loading.value = false
  }
})

function startReading() {
  currentChapter.value = 1
  router.push(`/novels/${novelId.value}/read/1`)
}

const handleRowClick = (row: Chapter) => {
  router.push(`/novels/${novelId.value}/read/${row.id}`)
}

const readChapter = debounce((id: number) => {
  currentChapter.value = id
  router.push(`/novels/${novelId.value}/read/${id}`)
}, 300)
</script>

<style scoped lang="scss">
.novel-detail-container {
  // 修改容器宽度为100%
  width: 100%;
  //max-width: 1600px;
  margin: 0 auto;
  padding: 32px;
  background: #f8f9fa;
  min-height: 100vh;

  // 新增全屏布局控制
  .el-main.main-content {
    width: 100%;
    max-width: 100%;
    padding: 0;
    margin: 0;
  }

  // 优化栅格布局
  .main-row {
    display: flex;
    flex-wrap: wrap;
    margin-left: -16px;
    margin-right: -16px;

    .left-col,
    .right-col {
      padding-left: 16px;
      padding-right: 16px;
    }
  }

  // 调整卡片布局
  .book-card {
    height: 100%;
    display: flex;
    flex-direction: column;

    .el-row {
      flex: 1;
    }
  }

  // 新增内容区域扩展
  .description-card,
  .chapter-card {
    width: 100%;
    margin-left: 0;
    margin-right: 0;
  }

  // 优化表格宽度
  .chapter-table {
    :deep(.el-table) {
      width: 99.9% !important; // 修复表格溢出问题
    }
  }

  // 调整响应式布局
  @media (min-width: 1200px) {
    .main-row {
      flex-wrap: nowrap;
    }
  }

  @media (max-width: 1199px) {
    padding: 24px;

    .book-title {
      font-size: 2rem !important;
    }

    // 调整图片比例
    .novel-cover {
      padding-bottom: 100%;
    }
  }

  @media (max-width: 992px) {
    // 强制栅格系统重置
    .el-col {
      width: 100% !important;
      max-width: 100% !important;
      flex: 0 0 100% !important;
    }

    .book-info {
      padding-left: 0 !important;
    }
  }

  @media (max-width: 768px) {
    padding: 16px;

    .novel-cover {
      padding-bottom: 140%;
    }

    // 优化按钮组布局
    .action-buttons {
      flex-direction: column;
      width: 100%;

      .el-button {
        width: 100%;
        margin-left: 0 !important;
      }
    }
  }
}
</style>