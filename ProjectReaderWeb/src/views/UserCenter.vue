<template>
  <el-container direction="vertical" class="user-center-container">
    <Header />

    <el-main class="main-content">
      <el-row :gutter="20" class="content-row">
        <el-col :span="6" class="nav-col">
          <el-menu :default-active="activeIndex" class="nav-menu" @select="handleSelect">
            <el-menu-item index="1">
              <span slot="title">个人信息管理</span>
            </el-menu-item>
            <el-menu-item index="2">
              <span slot="title">我的创作</span>
            </el-menu-item>
            <el-menu-item index="3">
              <span slot="title">我的参与</span>
            </el-menu-item>
            <el-menu-item index="4">
              <span slot="title">我的通知</span>
            </el-menu-item>
          </el-menu>
        </el-col>

        <el-col :span="18" class="content-col">
          <div v-if="activeIndex === '1'" class="content-section">
            <h3 class="section-title">个人信息管理</h3>
            <el-card shadow="always" class="profile-card">
              <div class="profile-header">
                <el-avatar :size="100" :src="user.avatarUrl" class="profile-avatar"></el-avatar>
                <div class="profile-info">
                  <h3>{{ user.nickname }}</h3>
                  <p>{{ user.bio }}</p>
                </div>
              </div>
              <el-button type="primary" class="edit-button" @click="editProfile">编辑资料</el-button>
            </el-card>
          </div>

          <div v-if="activeIndex === '2'" class="content-section">
            <h3 class="section-title">我的创作</h3>
            <el-row :gutter="15">
              <el-col :span="8" v-for="book in createdBooks" :key="book.id">
                <el-card shadow="hover" class="book-card" @click="goToNovelDetail(book.id)" style="cursor: pointer;">
                  <div class="book-content">
                    <el-image :src="book.coverUrl" fit="cover" class="book-cover" />
                    <div class="book-info">
                      <div class="book-title">{{ book.title }}</div>
                      <div class="book-status">{{ book.status }}</div>
                      <div class="book-description">{{ book.description }}</div>
                    </div>
                  </div>
                </el-card>
              </el-col>
            </el-row>
          </div>

          <div v-if="activeIndex === '3'" class="content-section">
            <h3 class="section-title">我的参与</h3>
            <el-tabs v-model="activeParticipationTab" class="participation-tabs">
              <el-tab-pane label="章节参与" name="chapters">
                <el-row :gutter="15">
                  <el-col :span="8" v-for="book in chapterParticipation" :key="book.id">
                    <el-card shadow="hover" class="book-card" @click="goToNovelDetail(book.id)" style="cursor: pointer;">
                      <div class="book-content">
                        <el-image :src="book.coverUrl" fit="cover" class="book-cover" />
                        <div class="book-info">
                          <div class="book-title">{{ book.title }}</div>
                          <div class="book-description">{{ book.contribution }}</div>
                        </div>
                      </div>
                    </el-card>
                  </el-col>
                </el-row>
              </el-tab-pane>
              <el-tab-pane label="设定参与" name="settings">
                <el-row :gutter="15">
                  <el-col :span="8" v-for="book in settingParticipation" :key="book.id">
                    <el-card shadow="hover" class="book-card" @click="goToNovelDetail(book.id)" style="cursor: pointer;">
                      <div class="book-content">
                        <el-image :src="book.coverUrl" fit="cover" class="book-cover" />
                        <div class="book-info">
                          <div class="book-title">{{ book.title }}</div>
                          <div class="book-description">{{ book.contribution }}</div>
                        </div>
                      </div>
                    </el-card>
                  </el-col>
                </el-row>
              </el-tab-pane>
            </el-tabs>
          </div>

          <div v-if="activeIndex === '4'" class="content-section">
            <h3 class="section-title">我的通知</h3>
            <el-timeline class="notification-timeline">
              <el-timeline-item v-for="(notification, index) in notifications" :key="index" :timestamp="notification.timestamp" placement="top">
                <el-card shadow="hover" class="notification-card">
                  <h4>{{ notification.title }}</h4>
                  <p>{{ notification.content }}</p>
                  <el-button type="text" class="mark-read-button" @click="markAsRead(index)">标记为已读</el-button>
                </el-card>
              </el-timeline-item>
            </el-timeline>
          </div>

        </el-col>
      </el-row>
    </el-main>

    <Footer />
  </el-container>
</template>

<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import Header from '../components/Header.vue';
import Footer from '../components/Footer.vue';

const router = useRouter();
const activeIndex = ref('1');
const activeParticipationTab = ref('chapters');

const user = ref({
  avatarUrl: 'https://via.placeholder.com/100/eee/aaa?text=Avatar',
  nickname: '用户昵称',
  bio: '这是一段用户简介...'
});

const createdBooks = ref([
  { id: 1, title: '我的书籍1', status: '连载中', description: '这是我创作的书籍简介...', coverUrl: 'https://via.placeholder.com/100x150/eee/aaa?text=Cover' },
  { id: 2, title: '我的书籍2', status: '已完结', description: '这是我创作的书籍简介...', coverUrl: 'https://via.placeholder.com/100x150/eee/aaa?text=Cover' },
  { id: 3, title: '我的书籍3', status: '连载中', description: '这是我创作的书籍简介...', coverUrl: 'https://via.placeholder.com/100x150/eee/aaa?text=Cover' }
]);

const chapterParticipation = ref([
  { id: 1, title: '协作书籍1', contribution: '贡献了第5章、第6章', coverUrl: 'https://via.placeholder.com/100x150/eee/aaa?text=Cover' },
  { id: 2, title: '协作书籍2', contribution: '贡献了第3章', coverUrl: 'https://via.placeholder.com/100x150/eee/aaa?text=Cover' }
]);

const settingParticipation = ref([
  { id: 1, title: '协作书籍3', contribution: '贡献了世界观设定', coverUrl: 'https://via.placeholder.com/100x150/eee/aaa?text=Cover' },
  { id: 2, title: '协作书籍4', contribution: '贡献了角色设定', coverUrl: 'https://via.placeholder.com/100x150/eee/aaa?text=Cover' }
]);

const notifications = ref([
  { title: '系统通知', content: '您的账户已成功注册。', timestamp: '2025-06-30 10:00:00', read: false },
  { title: '评论回复', content: '用户A回复了您的评论：感谢您的反馈！', timestamp: '2025-06-29 15:30:00', read: false },
  { title: '协作邀请', content: '用户B邀请您参与书籍《新世界》的创作。', timestamp: '2025-06-28 09:20:00', read: false }
]);


const handleSelect = (key) => {
  activeIndex.value = key;
};

const editProfile = () => {
  // 实现编辑资料的逻辑
  console.log('编辑资料');
};

const goToNovelDetail = (bookId) => {
  if (bookId) {
    router.push(`/novels/${bookId}`);
  } else {
    console.warn('Missing book ID for navigation');
  }
};

const markAsRead = (index) => {
  notifications.value[index].read = true;
  // 实现标记为已读的逻辑
  console.log('标记为已读', index);
};

</script>

<style scoped>
.user-center-container {
  min-height: 100vh;
  background-color: #FEF7FF;
}

.main-content {
  padding: 20px;
  background-color: #FFFFFF;
}

.content-row {
  min-height: calc(100vh - 140px);
}

.nav-col {
  background-color: #FFFFFF;
  border-right: 1px solid #E4E7ED;
}

.nav-menu {
  border-right: none;
}

.content-col {
  background-color: #FFFFFF;
}

.section-title {
  margin-bottom: 20px;
  font-size: 24px;
  color: #1E1E1E;
  font-weight: 600;
  letter-spacing: -2%;
}

.profile-card {
  margin-bottom: 20px;
  background-color: #FFFFFF;
  border: 1px solid #E4E7ED;
  box-shadow: 0px 8px 20px 0px rgba(0, 0, 0, 0.08), 0px 12px 32px 4px rgba(0, 0, 0, 0.04);
  border-radius: 4px;
}

.profile-header {
  display: flex;
  align-items: center;
  gap: 20px;
  margin-bottom: 20px;
}

.profile-avatar {
  flex-shrink: 0;
}

.profile-info {
  flex-grow: 1;
}

.edit-button {
  background-color: #65558F;
  border-color: #65558F;
}

.book-card {
  margin-bottom: 15px;
  background-color: #FFFFFF;
  border: 1px solid #E4E7ED;
  box-shadow: 0px 8px 20px 0px rgba(0, 0, 0, 0.08), 0px 12px 32px 4px rgba(0, 0, 0, 0.04);
  border-radius: 4px;
}

.book-content {
  display: flex;
  gap: 15px;
}

.book-cover {
  width: 110px;
  height: 140px;
  flex-shrink: 0;
  border-radius: 4px;
}

.book-info {
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  font-size: 0.85rem;
  color: #606266;
  overflow: hidden;
}

.book-title {
  font-size: 16px;
  font-weight: 500;
  color: #303133;
  margin-bottom: 5px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  letter-spacing: 0.9375%;
}

.book-author, .book-status {
  display: flex;
  align-items: center;
  gap: 5px;
  margin-bottom: 4px;
  color: #4F378A;
  font-size: 12px;
  line-height: 1.666em;
  letter-spacing: -0.0833%;
}

.book-description {
  display: -webkit-box;
  line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
  text-overflow: ellipsis;
  margin-bottom: 5px;
  line-height: 1.666em;
  font-size: 12px;
  color: #4F378A;
  letter-spacing: -0.0833%;
}

.remove-button {
  margin-top: 10px;
  width: 100%;
}

.participation-tabs {
  background-color: #fff;
  padding: 10px 15px;
  border-radius: 4px;
  box-shadow: 0 2px 12px 0 rgba(0,0,0,.1);
}

.notification-timeline {
  margin-top: 20px;
}

.notification-card {
  margin-bottom: 10px;
}

.mark-read-button {
  padding: 0;
  margin-top: 10px;
  color: #65558F;
}
</style>
