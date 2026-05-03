import { createRouter, createWebHistory } from 'vue-router'
import Home from '../components/index.vue'
import About from '../components/About.vue'
import Dlog from '../components/Devlog.vue'
import StudyNotes from '../components/StudyNotes.vue'
import AddLog from '../components/AddLog.vue'
import Project from '../components/Project.vue'
import BSL from '../components/project/BSL.vue'
import Admin from '../components/Admin.vue'
import ItemsRetrieval from '../components/project/ItemsRetrieval.vue'

const routes = [
  { path: '/', name: 'Home', component: Home },
  { path: '/about', name: 'About', component: About },
  { path: '/dlog', name: 'Dlog', component: Dlog },
  { path: '/notes', name: 'StudyNotes', component: StudyNotes },
  { path: '/project', name: 'Project', component: Project },
  { path: '/project/bsl', name: 'BSL', component: BSL },
  { path: '/admin', name: 'Admin', component: Admin },
  { path: '/__admin', name: 'LegacyAddLog', component: AddLog },
  { path: '/project/items-retrieval', name: 'ItemsRetrieval', component: ItemsRetrieval },
]

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
})

export default router
