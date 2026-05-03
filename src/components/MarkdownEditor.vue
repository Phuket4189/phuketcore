<template>
  <div class="markdown-editor">
    <h2>{{ title }}</h2>
    <p v-if="mode === 'append'" class="mode-hint">这里提交的是新增内容，保存后会追加到文档末尾，不会覆盖原文件。</p>
    <textarea v-model="content" rows="20" placeholder="Markdown 内容..."></textarea>
    <div style="margin-top:8px">
      <button @click="save">保存</button>
      <span style="margin-left:8px;color:green" v-if="msg">{{ msg }}</span>
    </div>
  </div>
</template>

<script setup>
import { ref, watch } from 'vue'
import { fetchJsonOrThrow, fetchTextOrThrow } from '../utils/http'

const props = defineProps({
  endpoint: { type: String, required: true },
  title: { type: String, default: '' },
  mode: { type: String, default: 'overwrite' } // 'overwrite' 或 'append'
})
const content = ref('')
const msg = ref('')

async function load() {
  if (props.mode === 'append') {
    content.value = ''
    msg.value = ''
    return
  }

  try {
    content.value = await fetchTextOrThrow(props.endpoint)
    msg.value = ''
  } catch (e) {
    console.error(e)
    msg.value = '加载失败'
  }
}

async function save() {
  if (!content.value.trim()) {
    msg.value = '内容为空'
    return
  }

  try {
    let payload
    if (props.mode === 'append') {
      payload = { text: content.value }
    } else {
      payload = { content: content.value }
    }

    await fetchJsonOrThrow(props.endpoint, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    })

    msg.value = '保存成功'

    if (props.mode === 'append') {
      content.value = ''
    } else {
      await load()
    }
  } catch (e) {
    console.error(e)
    msg.value = '保存错误'
  }
}

watch(() => [props.endpoint, props.mode], load, { immediate: true })
</script>

<style scoped>
.markdown-editor {
  text-align: left;
}

.markdown-editor h2 {
  margin-bottom: 0.5rem;
}

.mode-hint {
  margin: 0 0 1rem 0;
  color: #64748b;
  font-size: 0.95rem;
}

.markdown-editor textarea {
  width: 100%;
  font-family: inherit;
  font-size: 1rem;
  box-sizing: border-box;
}
button {
  padding: 0.4rem 0.8rem;
}
</style>
