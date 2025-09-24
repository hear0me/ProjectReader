import { createRouter, createWebHistory } from 'vue-router'
import Home from '../views/Home.vue'
import NovelList from '../views/NovelList.vue'
import NovelDetail from '../views/NovelDetail.vue'
import Reader from '../views/Reader.vue'
import Bookshelf from '../views/Bookshelf.vue'
import UserCenter from '../views/UserCenter.vue'
import ChapterEditor from '../views/ChapterEditor.vue' // 导入新的编辑器组件

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: Home
    },
    {
      path: '/novels/:novelId/chapter/:parentChapterId/create',
      name: 'ChapterEditor',
      component: ChapterEditor,
      props: true // 允许将路由参数作为 props 传递给组件
    },
    {
      path: '/novels',
      name: 'novels',
      component: NovelList
    },
    {
      path: '/novels/:novelId',
      name: 'novel-detail',
      component: NovelDetail
    },
    {
      path: '/novels/:novelId/read/:chapterId',
      name: 'reader',
      component: Reader
    },
    {
      path: '/bookshelf',
      name: 'bookshelf',
      component: Bookshelf
    },
    {
      path: '/user-center',
      name: 'user-center',
      component: UserCenter
    }
  ]
})

export default router
