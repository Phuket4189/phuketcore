<template>
  <div class="admin-panel page-enter">
    <h2>后台文档编辑</h2>
    <div class="menu">
      <button
        v-for="mod in modules"
        :key="mod.name"
        :class="{ active: selected && selected.name === mod.name }"
        @click="select(mod)">
        {{ mod.label }}
      </button>
    </div>
    <div class="editor" v-if="selected">
      <MarkdownEditor :endpoint="selected.endpoint" :title="selected.label" />
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import MarkdownEditor from './MarkdownEditor.vue'

const modules = [
  { name: 'devlog', label: '开发日志', endpoint: '/api/docs/devlog.md' },
  { name: 'project-readme', label: '项目 README', endpoint: '/api/docs/BSL-README.md' },
  { name: 'project-features', label: '项目 功能列表', endpoint: '/api/docs/BSL-FEATURES.md' },
  { name: 'project-issues', label: '项目 问题列表', endpoint: '/api/docs/BSL-ISSUES.md' },
  { name: 'study-plan', label: '学习计划', endpoint: '/api/docs/study.md' }
]
const selected = ref(modules[0])

onMounted(() => {
  // 页面挂载时滚动到顶部
  window.scrollTo(0, 0)
})

function select(mod) {
  selected.value = mod
}
</script>

<style scoped>
.menu {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
  margin-bottom: 1rem;
}
.menu button {
  padding: 0.4rem 0.8rem;
  border: 1px solid #ccc;
  background: transparent;
  cursor: pointer;
}
.menu button.active {
  background: #f0f0f0;
}
.editor {
  margin-top: 1rem;
}
</style>
