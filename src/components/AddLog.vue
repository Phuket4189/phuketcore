<template>
  <div class="add-log">
    <h2>提交开发日志（隐藏页面）</h2>
    <p>在此输入日志内容，提交后会追加到 `public/docs/devlog.md`。</p>
    <textarea v-model="content" rows="8" placeholder="输入日志内容..."></textarea>
    <div style="margin-top:8px">
      <button @click="submit">提交</button>
      <span style="margin-left:8px;color:green" v-if="msg">{{ msg }}</span>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'

// 简单的管理员页面：使用 fetch POST 到后端 API /api/devlog
// 我没有把这个路由放入导航，这样它对外是"隐藏的"。
const content = ref('')
const msg = ref('')

onMounted(() => {
  // 页面挂载时滚动到顶部
  window.scrollTo(0, 0)
})

async function submit() {
  if (!content.value.trim()) {
    msg.value = '内容为空'
    return
  }
  try {
    const res = await fetch('/api/devlog', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ text: content.value })
    })
    const j = await res.json()
    if (res.ok && j.ok) {
      msg.value = '已添加'
      content.value = ''
    } else {
      msg.value = '提交失败'
      console.error(j)
    }
  } catch (e) {
    msg.value = '提交异常'
    console.error(e)
  }
}
</script>

<style scoped>
.add-log { padding: 1rem; max-width:760px }
textarea { width:100%; font-family: inherit }
button { padding: 0.4rem 0.8rem }
</style>
