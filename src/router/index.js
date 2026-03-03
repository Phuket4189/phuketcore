import { createRouter, createWebHistory } from 'vue-router'
import Home from '../components/index.vue'
import About from '../components/About.vue'
import Dlog from '../components/Devlog.vue'
import AddLog from '../components/AddLog.vue'
import Project from '../components/Project.vue'
import BSL from '../components/project/BSL.vue'
import Admin from '../components/Admin.vue'

const routes = [
  { path: '/', name: 'Home', component: Home },
  { path: '/about', name: 'About', component: About },
  { path: '/dlog', name: 'Dlog', component: Dlog },
  { path: '/project', name: 'Project', component: Project },
  { path: '/project/bsl', name: 'BSL', component: BSL },
  // 专用后台页面，可在属性中隐藏或手动访问
  { path: '/admin', name: 'Admin', component: Admin },
  // 旧的隐藏简易页面仍保留以兼容以前的链接
  { path: '/__admin', name: 'LegacyAddLog', component: AddLog },
]

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
})

export default router
