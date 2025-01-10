import { createRouter, createWebHistory } from 'vue-router'
import Home from '../views/Home.vue'
import NovelList from '../views/NovelList.vue'
import NovelDetail from '../views/NovelDetail.vue'
import Reader from '../views/Reader.vue'
import Bookshelf from '../views/Bookshelf.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: Home
    },
    {
      path: '/novels',
      name: 'novels',
      component: NovelList
    },
    {
      path: '/novels/:id',
      name: 'novel-detail',
      component: NovelDetail
    },
    {
      path: '/novels/:id/read/:chapterId',
      name: 'reader',
      component: Reader
    },
    {
      path: '/bookshelf',
      name: 'bookshelf',
      component: Bookshelf
    }
  ]
})

export default router
