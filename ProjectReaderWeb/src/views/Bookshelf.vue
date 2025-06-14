<template>
  
  <div class="bookshelf">
    <!-- <el-page-header title="我的书架" /> -->
    <Header />
    <div class="bookshelf-controls">
      <el-radio-group v-model="sortBy" size="small">
        <el-radio-button label="lastReadTime">按阅读时间</el-radio-button>
        <el-radio-button label="updateTime">按更新时间</el-radio-button>
      </el-radio-group>
    </div>
    <el-empty v-if="sortedBooks.length === 0" description="书架空空如也，快去添加喜欢的小说吧！">
      <el-button type="primary" @click="$router.push('/novels')">去找小说</el-button>
    </el-empty>

    <div v-else class="book-list">
      <el-card v-for="book in sortedBooks" :key="book.id" class="book-card" :body-style="{ padding: '0px' }">
        <div class="card-content">
          <el-image :src="book.cover" fit="cover" class="book-cover" @click="goToNovel(book.id)">
            <template #error>
              <div class="image-slot">
                <el-icon><Picture /></el-icon>
              </div>
            </template>
          </el-image>

          <div class="book-info" @click="goToNovel(book.id)">
            <h3 class="book-title">{{ book.title }}</h3>
            <p class="book-author">
              <el-icon><User /></el-icon>
              {{ book.author }}
            </p>
            <p class="last-chapter">
              <el-icon><Reading /></el-icon>
              上次章节：{{ book.lastChapter }}
            </p>
            <p class="latest-chapter">
              <el-icon><Reading /></el-icon>
              最新章节：{{ book.latestChapter }}
            </p>
            <p class="last-read">
              <el-icon><Timer /></el-icon>
              上次阅读：{{ book.lastReadTime }}
            </p>
          </div>

          <div class="book-actions">
            <el-button type="primary" @click.stop="continueReading(book.id)">
              <el-icon><VideoPlay /></el-icon>
              继续阅读
            </el-button>
            <el-button type="danger" plain @click.stop="removeFromShelf(book.id)">
              <el-icon><Delete /></el-icon>
            </el-button>
          </div>
        </div>
      </el-card>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessageBox } from 'element-plus'
import Header from '@/components/Header.vue'
import { Picture, User, Timer, VideoPlay, Delete, Reading } from '@element-plus/icons-vue'
import { computed } from 'vue'

const router = useRouter()

const sortBy = ref('lastReadTime') // 默认按阅读时间排序

interface Book {
  id: number
  title: string
  author: string
  cover: string
  lastReadTime: string
  lastChapter: string
  updateTime: string
  latestChapter: string
}

const sortedBooks = computed(() => {
  return [...books.value].sort((a, b) => {
    const key = sortBy.value as 'lastReadTime' | 'updateTime'
    const dateA = new Date(a[key]).getTime()
    const dateB = new Date(b[key]).getTime()
    return dateB - dateA // 降序排列，最新的在前
  })
})


const books = ref<Book[]>([
  {
    id: 1,
    title: '示例小说1',
    author: '作者1',
    cover: 'https://picsum.photos/200/300?random=1',
    lastReadTime: '2024-01-09 23:15',
    lastChapter: '第100章 新的开始',
    updateTime: '2024-01-08 10:00',
    latestChapter: '第101章 新的篇章'
  },
  {
    id: 2,
    title: '示例小说2',
    author: '作者2',
    cover: 'https://picsum.photos/200/300?random=2',
    lastReadTime: '2024-01-08 15:30',
    lastChapter: '第50章 秘密揭示',
    updateTime: '2024-01-09 09:00',
    latestChapter: '第51章 秘密揭示（下）'
  },
  {
    id: 3,
    title: '示例小说3',
    author: '作者3',
    cover: 'https://picsum.photos/200/300?random=3',
    lastReadTime: '2024-01-11 10:00',
    lastChapter: '第200章 最终章',
    updateTime: '2024-01-11 11:00',
    latestChapter: '第201章 最终章（完）'
  }
])

const goToNovel = (id: number) => {
  router.push(`/novels/${id}`)
}

const continueReading = (id: number) => {
  router.push(`/novels/${id}/read/1`)
}

const removeFromShelf = async (id: number) => {
  try {
    await ElMessageBox.confirm(
      '确定要将这本书从书架中移除吗？',
      '提示',
      {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }
    )
    books.value = books.value.filter(book => book.id !== id)
  } catch {
    // 用户取消删除
  }
}
</script>

<style scoped>
.bookshelf {
  max-width: 100%;
  margin: 0 auto;
  padding: 0 20px;
}

.bookshelf-controls {
  display: flex;
  justify-content: flex-end;
  margin-top: 20px;
  margin-bottom: 20px;
}

.book-list {
  margin-top: 20px;
  display: grid;
  /* flex-direction: column; */
  gap: 20px;
}

.book-card {
  transition: transform 0.3s;
}

.book-card:hover {
  transform: translateY(-2px);
}

.card-content {
  display: flex;
  height: 180px;
}

.book-cover {
  width: 135px;
  height: 180px;
  cursor: pointer;
}

.image-slot {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  height: 100%;
  background: var(--el-fill-color-light);
  color: var(--el-text-color-secondary);
  font-size: 30px;
}

.book-info {
  flex: 1;
  padding: 15px 20px;
  cursor: pointer;
}

.book-title {
  margin: 0;
  font-size: 18px;
  color: var(--el-text-color-primary);
  margin-bottom: 10px;
}

.book-author {
  display: flex;
  align-items: center;
  gap: 5px;
  color: var(--el-text-color-regular);
  margin: 8px 0;
}

.last-chapter {
  display: flex;
  align-items: center;
  gap: 5px;
  color: var(--el-text-color-regular);
  font-size: 14px;
  margin: 8px 0;
}

.latest-chapter {
  display: flex;
  align-items: center;
  gap: 5px;
  color: var(--el-text-color-regular);
  font-size: 14px;
  margin: 8px 0;
}

.book-progress {
  margin: 15px 0;
}

.last-read {
  display: flex;
  align-items: center;
  gap: 5px;
  color: var(--el-text-color-secondary);
  font-size: 14px;
  margin: 0;
}

.book-actions {
  display: flex;
  flex-direction: column;
  justify-content: center;
  gap: 10px;
  padding: 15px;
  border-left: 1px solid var(--el-border-color);
  min-width: 140px;
}

.el-icon {
  vertical-align: middle;
}

@media (max-width: 768px) {
  .card-content {
    flex-direction: column;
    height: auto;
  }

  .book-cover {
    width: 100%;
    height: 200px;
  }

  .book-info {
    text-align: center;
  }

  .book-actions {
    flex-direction: row;
    justify-content: space-between;
    border-left: none;
    border-top: 1px solid var(--el-border-color);
    min-width: auto;
  }
}
</style>
