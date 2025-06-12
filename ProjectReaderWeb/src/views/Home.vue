<template>
  <el-container direction="vertical" class="home-container">
    <Header />

    <el-main class="main-content no-padding">
      <el-carousel height="200px" arrow="always">
        <el-carousel-item v-for="item in 4" :key="item" class="carousel-item" @click="goToNovelDetail(1)" style="cursor: pointer;">
          <h3>Carousel Slide {{ item }}</h3>
        </el-carousel-item>
      </el-carousel>

      <div class="content-body">
        <el-row :gutter="20">
          <el-col :span="18">
            <h3 class="section-title">推荐书籍</h3>
            <el-row :gutter="15">
              <el-col :span="8" v-for="book in recommendedBooks" :key="book.id">
                <el-card shadow="hover" class="book-card" @click="goToNovelDetail(book.id)" style="cursor: pointer;">
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
            <h3 class="section-title">书籍排行</h3>
            <el-tabs v-model="activeRankTab" class="ranking-tabs">
              <el-tab-pane label="总排行" name="total">
                <ol class="ranking-list">
                  <li v-for="(item, index) in rankingData.total" :key="index" @click="goToNovelDetail(1)" style="cursor: pointer;">
                    {{ index + 1 }} {{ item.name }}
                  </li>
                </ol>
              </el-tab-pane>
              <el-tab-pane label="月排行" name="monthly">
                <ol class="ranking-list">
                  <li v-for="(item, index) in rankingData.monthly" :key="index" @click="goToNovelDetail(1)" style="cursor: pointer;">
                    {{ index + 1 }} {{ item.name }}
                  </li>
                </ol>
              </el-tab-pane>
              <el-tab-pane label="周排行" name="weekly">
                <ol class="ranking-list">
                  <li v-for="(item, index) in rankingData.weekly" :key="index" @click="goToNovelDetail(1)" style="cursor: pointer;">
                    {{ index + 1 }} {{ item.name }}
                  </li>
                </ol>
              </el-tab-pane>
              <el-tab-pane label="日排行" name="daily">
                <ol class="ranking-list">
                  <li v-for="(item, index) in rankingData.daily" :key="index" @click="goToNovelDetail(1)" style="cursor: pointer;">
                    {{ index + 1 }} {{ item.name }}
                  </li>
                </ol>
              </el-tab-pane>
            </el-tabs>
          </el-col>
        </el-row>
      </div>
    </el-main>

    <Footer />
  </el-container>
</template>

<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router'; // 引入 useRouter
import { UserFilled } from '@element-plus/icons-vue'; // Import icons
import Header from '../components/Header.vue'; // 引入 Header 组件
import Footer from '../components/Footer.vue'; // 引入 Footer 组件

// --- Router ---
const router = useRouter(); // 获取 router 实例

// --- State ---
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

// 更新 rankingData 为包含 id 的对象数组（示例）
// 注意：实际应用中，这些数据应该从后端获取
const rankingData = ref({
  total: [
    { id: 1, name: '小说' },
    { id: 1, name: '小说 J' }, // 示例：都指向 ID 1
    { id: 1, name: '小说 I' }, // 示例：都指向 ID 1
    { id: 1, name: '小说 B' }, // 示例：都指向 ID 1
  ],
  monthly: [
    { id: 1, name: '月榜小说A' },
    { id: 1, name: '月榜小说B' },
    { id: 1, name: '月榜小说C' },
    { id: 1, name: '月榜小说D' },
  ],
  weekly: [
    { id: 1, name: '周榜书1' },
    { id: 1, name: '周榜书2' },
    { id: 1, name: '周榜书3' },
    { id: 1, name: '周榜书4' },
  ],
  daily: [
    { id: 1, name: '日榜Top1' },
    { id: 1, name: '日榜Top2' },
    { id: 1, name: '日榜Top3' },
    { id: 1, name: '日榜Top4' },
  ],
});

// --- Methods ---
// Add methods here if needed (e.g., for handling search, fetching data)

// 跳转到书籍详情页
const goToNovelDetail = (bookId) => {
  if (bookId) {
    router.push(`/novels/${bookId}`);
  } else {
    console.warn('Missing book ID for navigation');
  }
};
</script>

<style scoped>
.home-container {
  min-height: 100vh;
  background-color: #FEF7FF; /* Light background for the page from Figma */
}

.main-content {
  padding: 0; /* Remove default main padding */
  background-color: #FFFFFF; /* Background color from Figma */
}

.carousel-item {
  display: flex;
  align-items: center;
  justify-content: center;
  color: #475669;
}
/* Style for carousel indicators */
:deep(.el-carousel__indicator button) {
    background-color: #C0C4CC; /* Indicator color from Figma */
}
:deep(.el-carousel__indicator.is-active button) {
    background-color: #65558F; /* Active indicator color (using header color as a guess) */
}
:deep(.el-carousel__arrow) {
    background-color: rgba(0, 0, 0, 0.12); /* Arrow background from Figma */
    color: #303133; /* Arrow color from Figma */
}


.content-body {
    padding: 20px; /* Add padding for the main content below carousel */
}

.section-title {
  margin-bottom: 15px;
  font-size: 24px; /* Font size from Figma */
  color: #1E1E1E; /* Color from Figma */
  font-weight: 600; /* Font weight from Figma */
  letter-spacing: -2%; /* Letter spacing from Figma */
}

.book-card {
  margin-bottom: 15px;
  background-color: #FFFFFF; /* White background from Figma */
  border: 1px solid #E4E7ED; /* Border from Figma */
  box-shadow: 0px 8px 20px 0px rgba(0, 0, 0, 0.08), 0px 12px 32px 4px rgba(0, 0, 0, 0.04); /* Box shadow from Figma */
  border-radius: 4px; /* Border radius from Figma */
}

.book-content {
  display: flex;
  gap: 15px;
}

.book-cover {
  width: 110px; /* Fixed width for cover from Figma */
  height: 140px; /* Fixed height for cover from Figma */
  flex-shrink: 0; /* Prevent image from shrinking */
  border-radius: 4px; /* Border radius from Figma */
}

.book-info {
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  font-size: 0.85rem; /* Keep existing font size or adjust based on Figma if needed */
  color: #606266; /* Keep existing color or adjust based on Figma if needed */
  overflow: hidden; /* Prevent text overflow issues */
}

.book-title {
  font-size: 16px; /* Font size from Figma */
  font-weight: 500; /* Font weight from Figma */
  color: #303133; /* Color from Figma */
  margin-bottom: 5px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  letter-spacing: 0.9375%; /* Letter spacing from Figma */
}
.book-author, .book-status {
    display: flex;
    align-items: center;
    gap: 5px; /* Gap from Figma */
    margin-bottom: 4px;
    color: #4F378A; /* Color from Figma */
    font-size: 12px; /* Font size from Figma */
    line-height: 1.666em; /* Line height from Figma */
    letter-spacing: -0.0833%; /* Letter spacing from Figma */
}
.book-author .el-icon {
    font-size: 1em; /* Adjust icon size relative to text */
    color: #1D1B20; /* Icon color from Figma */
}
.book-author::after { /* Add separator line from Figma */
    content: '';
    display: inline-block;
    width: 1px;
    height: 1em; /* Adjust height relative to text */
    background-color: #CAC4D0; /* Line color from Figma */
    margin-left: 5px; /* Gap from Figma */
}


.book-description {
  display: -webkit-box;
  line-clamp: 2; /* Limit description to 2 lines */
  -webkit-box-orient: vertical;
  overflow: hidden;
  text-overflow: ellipsis;
  margin-bottom: 5px;
   line-height: 1.666em; /* Line height from Figma */
   font-size: 12px; /* Font size from Figma */
   color: #4F378A; /* Color from Figma */
   letter-spacing: -0.0833%; /* Letter spacing from Figma */
}

.book-latest-chapter {
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  color: #625B71; /* Color from Figma */
  font-size: 12px; /* Font size from Figma */
  line-height: 1.666em; /* Line height from Figma */
  letter-spacing: -0.0833%; /* Letter spacing from Figma */
}

.ranking-tabs {
    background-color: #fff; /* Keep existing background */
    padding: 10px 15px; /* Keep existing padding */
    border-radius: 4px; /* Keep existing border radius */
    box-shadow: 0 2px 12px 0 rgba(0,0,0,.1); /* Keep existing box shadow */
}

/* Style the tabs */
:deep(.ranking-tabs .el-tabs__header) {
  margin-bottom: 10px; /* Keep existing margin */
}
:deep(.ranking-tabs .el-tabs__item) {
    font-size: 12px; /* Font size from Figma */
    font-weight: 400; /* Font weight from Figma */
    line-height: 1.666em; /* Line height from Figma */
    letter-spacing: -0.0833%; /* Letter spacing from Figma */
    color: #303133; /* Default tab color from Figma */
}
:deep(.ranking-tabs .el-tabs__item.is-active) {
    font-weight: 700; /* Active tab font weight from Figma */
    color: #65558F; /* Active tab color from Figma */
}
:deep(.ranking-tabs .el-tabs__active-bar) {
    background-color: #65558F; /* Active tab indicator color from Figma */
}


.ranking-list {
  list-style: none;
  padding-left: 5px; /* Keep existing padding */
  margin: 0; /* Keep existing margin */
}

.ranking-list li {
  padding: 8px 12px 9px; /* Padding from Figma */
  font-size: 14px; /* Font size from Figma */
  line-height: 1.642em; /* Line height from Figma */
  border-bottom: 1px solid #EBEEF5; /* Border from Figma */
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  color: #303133; /* Color from Figma */
}
.ranking-list li:last-child {
    border-bottom: none;
}
.ranking-list li:first-child {
    font-weight: bold; /* Keep existing bold for top rank */
    color: #303133; /* Color from Figma */
}
.ranking-list li:nth-child(2) {
   font-weight: 500; /* Keep existing font weight for 2nd rank */
   color: #303133; /* Color from Figma */
}
.ranking-list li:nth-child(3) {
   font-weight: 500; /* Keep existing font weight for 3rd rank */
    color: #303133; /* Color from Figma */
}


.home-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  background-color: #65558F; /* Deep purple background from Figma */
  color: #FFFFFF; /* White text color from Figma */
  padding: 10px 20px; /* Keep existing padding */
  font-size: 16px; /* Font size from Figma */
  line-height: 1.5em; /* Line height from Figma */
  letter-spacing: 3.125%; /* Letter spacing from Figma */
  height: 40px; /* Keep existing height */
  border-top: 1px solid rgba(0, 0, 0, 0.1); /* Border from Figma */
}
</style>
