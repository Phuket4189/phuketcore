<template>
  <div class="markdown-editor">
    <h2>{{ title }}</h2>
    <textarea v-model="content" rows="20" placeholder="Markdown 内容..."></textarea>
    <div style="margin-top:8px">
      <button @click="save">保存</button>
      <span style="margin-left:8px;color:green" v-if="msg">{{ msg }}</span>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, watch } from 'vue'

const props = defineProps({
  endpoint: { type: String, required: true },
  title: { type: String, default: '' },
  mode: { type: String, default: 'overwrite' } // 'overwrite' 或 'append'
})
const content = ref('')
const msg = ref('')

async function load() {
  try {
    const res = await fetch(props.endpoint)
    const text = await res.text()
    content.value = text
    msg.value = ''
  } catch (e) {
    console.error(e)
    msg.value = '加载失败'
  }
}

async function save() {
  try {
    let body
    if (props.mode === 'append') {
      // 追加模式：发送 { text: content }
      body = JSON.stringify({ text: content.value })
    } else {
      // 覆盖模式：发送 { content: text }
      body = JSON.stringify({ content: content.value })
    }
    
    const res = await fetch(props.endpoint, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: body
    })
    const j = await res.json()
    if (res.ok && j.ok) {
      msg.value = '保存成功'
    } else {
      msg.value = '保存失败'
      console.error(j)
    }
  } catch (e) {
    console.error(e)
    msg.value = '保存错误'
  }
}

onMounted(load)
</script>

<style scoped>
.markdown-editor textarea {
  width: 100%;
  font-family: inherit;
  font-size: 1rem;
}
button {
  padding: 0.4rem 0.8rem;
}
</style>
