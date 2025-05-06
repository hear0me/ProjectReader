<template>
  <el-container direction="vertical" class="home-container">
    <el-header class="home-header">
      <div class="logo-title">ProjectReader</div>
      <div class="search-bar">
        <el-input
          v-model="searchInput"
          placeholder="搜索书名"
          :prefix-icon="Search"
          clearable
        />
      </div>
      <div class="header-icons">
        <el-icon :size="24"><Reading /></el-icon>
        <el-icon :size="24"><User /></el-icon>
      </div>
    </el-header>

    <el-main class="main-content no-padding">
      <el-carousel height="200px" arrow="always">
        <el-carousel-item v-for="item in 4" :key="item" class="carousel-item">
          <h3>Carousel Slide {{ item }}</h3>
        </el-carousel-item>
      </el-carousel>

      <div class="content-body">
        <el-row :gutter="20">
          <el-col :span="18">
            <h3 class="section-title">推荐书籍</h3>
            <el-row :gutter="15">
              <el-col :span="8" v-for="book in recommendedBooks" :key="book.id">
                <el-card shadow="hover" class="book-card">
                  <div class="book-content">
                    <el-image
                      :src="book.coverUrl"
                      fit="cover"
                      class="book-cover"
                    />
                    <div class="book-info">
                      <div class="book-title">{{ book.title }}</div>
                      <div class="book-author">
                         <el-icon><UserFilled /></el-icon> {{ book.author }}
                      </div>
                       <div class="book-status">{{ book.status }}</div>
                      <div class="book-description">{{ book.description }}</div>
                      <div class="book-latest-chapter">{{ book.latestChapter }}</div>
                    </div>
                  </div>
                </el-card>
              </el-col>
            </el-row>
          </el-col>

          <el-col :span="6">
            <el-tabs v-model="activeRankTab" class="ranking-tabs">
              <el-tab-pane label="总排行" name="total">
                <ol class="ranking-list">
                  <li v-for="(item, index) in rankingData.total" :key="index">
                    {{ index + 1 }} {{ item }}
                  </li>
                </ol>
              </el-tab-pane>
              <el-tab-pane label="月排行" name="monthly">
                 <ol class="ranking-list">
                  <li v-for="(item, index) in rankingData.monthly" :key="index">
                     {{ index + 1 }} {{ item }}
                  </li>
                </ol>
              </el-tab-pane>
              <el-tab-pane label="周排行" name="weekly">
                 <ol class="ranking-list">
                  <li v-for="(item, index) in rankingData.weekly" :key="index">
                     {{ index + 1 }} {{ item }}
                  </li>
                </ol>
              </el-tab-pane>
              <el-tab-pane label="日排行" name="daily">
                 <ol class="ranking-list">
                  <li v-for="(item, index) in rankingData.daily" :key="index">
                    {{ index + 1 }} {{ item }}
                  </li>
                </ol>
              </el-tab-pane>
            </el-tabs>
          </el-col>
        </el-row>
      </div>
    </el-main>

    <el-footer class="home-footer">
      <span>版权信息</span>
      <span>联系方式: xxx-xxxx-xxxx</span>
    </el-footer>
  </el-container>
</template>

<script setup>
import { ref } from 'vue';
import { Search, User, Reading, UserFilled } from '@element-plus/icons-vue'; // Import icons

// --- State ---
const searchInput = ref('');
const activeRankTab = ref('total'); // Default active tab

// Placeholder data - Replace with actual data fetching
const recommendedBooks = ref([
  { id: 1, title: '书籍名', author: '作者名', status: '连载中', description: '书籍简介...', latestChapter: '最新章节 第100章...', coverUrl: 'https://via.placeholder.com/100x150/eee/aaa?text=Cover' },
  { id: 2, title: '书籍名', author: '作者名', status: '连载中', description: '书籍简介...', latestChapter: '最新章节 第123章...', coverUrl: 'https://via.placeholder.com/100x150/eee/aaa?text=Cover' },
  { id: 3, title: '书籍名', author: '作者名', status: '连载中', description: '书籍简介...', latestChapter: '最新章节 第99章...', coverUrl: 'https://via.placeholder.com/100x150/eee/aaa?text=Cover' },
  { id: 4, title: '书籍名', author: '作者名', status: '连载中', description: '书籍简介...', latestChapter: '最新章节 第205章...', coverUrl: 'https://via.placeholder.com/100x150/eee/aaa?text=Cover' },
  { id: 5, title: '书籍名', author: '作者名', status: '连载中', description: '书籍简介...', latestChapter: '最新章节 第50章...', coverUrl: 'https://via.placeholder.com/100x150/eee/aaa?text=Cover' },
  { id: 6, title: '书籍名', author: '作者名', status: '连载中', description: '书籍简介...', latestChapter: '最新章节 第88章...', coverUrl: 'https://via.placeholder.com/100x150/eee/aaa?text=Cover' },
    { id: 7, title: '书籍名', author: '作者名', status: '连载中', description: '书籍简介...', latestChapter: '最新章节 第100章...', coverUrl: 'https://via.placeholder.com/100x150/eee/aaa?text=Cover' },
  { id: 8, title: '书籍名', author: '作者名', status: '连载中', description: '书籍简介...', latestChapter: '最新章节 第123章...', coverUrl: 'https://via.placeholder.com/100x150/eee/aaa?text=Cover' },
  { id: 9, title: '书籍名', author: '作者名', status: '连载中', description: '书籍简介...', latestChapter: '最新章节 第99章...', coverUrl: 'https://via.placeholder.com/100x150/eee/aaa?text=Cover' },
]);

const rankingData = ref({
  total: ['小说', '小说 J', '小说 I', '小说 B'],
  monthly: ['月榜小说A', '月榜小说B', '月榜小说C', '月榜小说D'],
  weekly: ['周榜书1', '周榜书2', '周榜书3', '周榜书4'],
  daily: ['日榜Top1', '日榜Top2', '日榜Top3', '日榜Top4'],
});

// --- Methods ---
// Add methods here if needed (e.g., for handling search, fetching data)
</script>

<style scoped>
.home-container {
  min-height: 100vh;
  background-color: #f7f8fc; /* Light background for the page */
}

.home-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  background-color: #ffffff;
  border-bottom: 1px solid #ebeef5;
  padding: 0 20px;
  height: 60px;
}

.logo-title {
  font-size: 1.4rem;
  font-weight: bold;
  color: #303133;
}

.search-bar {
  width: 300px; /* Adjust width as needed */
  margin: 0 20px;
}

.search-bar .el-input {
    background-color: #f4f4f5; /* Lighter background for search */
    border-radius: 4px;
}
.search-bar .el-input__wrapper{
     background-color: #f4f4f5;
     box-shadow: none;
}

.header-icons {
  display: flex;
  align-items: center;
  gap: 15px; /* Space between icons */
  color: #606266;
}
.header-icons .el-icon {
    cursor: pointer;
}
.header-icons .el-icon:hover {
    color: var(--el-color-primary);
}

.main-content {
  padding: 0; /* Remove default main padding */
}

.carousel-item {
  background-color: #d3dce6; /* Placeholder background */
  display: flex;
  align-items: center;
  justify-content: center;
  color: #475669;
}

.content-body {
    padding: 20px; /* Add padding for the main content below carousel */
}

.section-title {
  margin-bottom: 15px;
  font-size: 1.2rem;
  color: #303133;
  font-weight: 600;
}

.book-card {
  margin-bottom: 15px;
  background-color: #f0e6ff; /* Light purple background like image */
  border: 1px solid #e1d4f5; /* Slightly darker border */
}

.book-content {
  display: flex;
  gap: 15px;
}

.book-cover {
  width: 80px; /* Fixed width for cover */
  height: 120px; /* Fixed height for cover */
  flex-shrink: 0; /* Prevent image from shrinking */
  border-radius: 4px;
}

.book-info {
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  font-size: 0.85rem;
  color: #606266;
  overflow: hidden; /* Prevent text overflow issues */
}

.book-title {
  font-size: 1rem;
  font-weight: bold;
  color: #303133;
  margin-bottom: 5px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
.book-author, .book-status {
    display: flex;
    align-items: center;
    gap: 4px;
    margin-bottom: 4px;
    color: #888;
}
.book-author .el-icon {
    font-size: 0.9em;
}


.book-description {
  display: -webkit-box;
  -webkit-line-clamp: 2; /* Limit description to 2 lines */
  -webkit-box-orient: vertical;
  overflow: hidden;
  text-overflow: ellipsis;
  margin-bottom: 5px;
   line-height: 1.4;
}

.book-latest-chapter {
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  color: #a0a0a0;
  font-size: 0.8rem;
}

.ranking-tabs {
    background-color: #fff;
    padding: 10px 15px;
    border-radius: 4px;
    box-shadow: 0 2px 12px 0 rgba(0,0,0,.1);
}

/* Style the tabs */
:deep(.ranking-tabs .el-tabs__header) {
  margin-bottom: 10px;
}
:deep(.ranking-tabs .el-tabs__item) {
    font-size: 0.9rem;
}


.ranking-list {
  list-style: none;
  padding-left: 5px;
  margin: 0;
}

.ranking-list li {
  padding: 6px 0;
  font-size: 0.9rem;
  border-bottom: 1px dashed #ebeef5;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  color: #606266;
}
.ranking-list li:last-child {
    border-bottom: none;
}
.ranking-list li:first-child {
    font-weight: bold;
    color: #e6a23c; /* Highlight top rank */
}
.ranking-list li:nth-child(2) {
   font-weight: 500;
   color: #f56c6c; /* Highlight 2nd rank */
}
.ranking-list li:nth-child(3) {
   font-weight: 500;
    color: #67c23a; /* Highlight 3rd rank */
}


.home-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  background-color: #e9ecef; /* Footer background */
  color: #6c757d; /* Footer text color */
  padding: 10px 20px;
  font-size: 0.85rem;
  height: 40px;
  border-top: 1px solid #dee2e6;
}
</style>