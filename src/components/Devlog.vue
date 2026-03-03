<template>
  <!-- page wrapper – animations applied on mount -->
  <div class="doc-page page-enter">
    <aside class="doc-toc">
      <h3>按日期</h3>
      <ul>
        <li v-for="s in sections" :key="s.slug">
          <a :href="`#${s.slug}`" @click.prevent="toggleAndScroll(s)">{{ s.title }}</a>
        </li>
      </ul>
    </aside>

    <section class="doc-content">
      <article v-for="s in sections" :key="s.slug" :id="s.slug" class="doc-section">
        <header class="section-header" :class="{ open: s.open }" :aria-expanded="s.open" @click="s.open = !s.open">
          <button class="chev" aria-hidden="true">{{ s.open ? '▾' : '▸' }}</button>
          <h4>{{ s.title }}</h4>
        </header>
        <transition name="collapse">
          <div class="section-body" v-show="s.open" v-html="s.html"></div>
        </transition>
      </article>
    </section>
    </div>
  </template>

<script setup>
import { ref, onMounted, nextTick } from 'vue'
import { marked } from 'marked'

const sections = ref([]) // each: { title, slug, html, open }

function slugify(text) {
  return text.toLowerCase().replace(/[^a-z0-9\-]+/g, '-').replace(/(^-|-$)/g, '')
}

function splitByDateSections(mdText) {
  // 按行解析，以 `## ` 开头的二级标题作为“日期”分区
  const lines = mdText.split(/\r?\n/)
  const result = []
  let current = { title: '未分类', lines: [] }
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i]
    const m = line.match(/^##\s+(.*)$/)
    if (m) {
      // 新分区
      if (current.lines.length > 0 || current.title !== '未分类') {
        result.push(current)
      }
      current = { title: m[1].trim() || '未命名', lines: [] }
    } else {
      current.lines.push(line)
    }
  }
  // push last
  if (current.lines.length > 0 || current.title !== '未分类') result.push(current)
  return result
}

// 挂载时从后端 API 拉取最新的 devlog 内容（生产部署时由 server.js 提供）
// 这里改为请求 `/api/devlog`，便于在隐藏管理页提交后能即时读取到新增内容
onMounted(async () => {
  // 页面挂载时滚动到顶部
  window.scrollTo(0, 0)
  
  // 清理进入动画类，动画完成后移除避免重复影响
  nextTick(() => {
    const page = document.querySelector('.page-enter')
    if (page) {
      const handler = () => page.classList.remove('page-enter')
      page.addEventListener('animationend', handler, { once: true })
    }
  })
  try {
    // 注意：开发时 vite 会直接把 public/docs/devlog.md 当静态资源提供，
    // 但我们在服务器端也提供了 `/api/devlog` 接口来读取/追加同一文件。
    const res = await fetch('/api/devlog')
    const text = await res.text()
    // 分割为按日期的章节
    const parts = splitByDateSections(text)
    const renderer = new marked.Renderer()
    renderer.heading = (txt, level) => {
      const id = slugify(txt)
      return `<h${level} id="${id}">${txt}</h${level}>`
    }

    sections.value = parts.map((p, idx) => {
      const content = p.lines.join('\n')
      const html = marked.parse(content, { renderer })
      const slug = slugify(p.title || `section-${idx}`)
      return { title: p.title, slug, html, open: idx === 0 }
    })
  } catch (e) {
    sections.value = [{ title: '加载失败', slug: 'error', html: '<p>加载文档失败。</p>', open: true }]
    console.error(e)
  }
})

function toggleAndScroll(s) {
  s.open = !s.open
  // 打开后滚动到该节顶部
  nextTick(() => {
    const el = document.getElementById(s.slug)
    if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' })
  })
}
</script>

<style scoped>
/* 布局：把目录放到右侧（row-reverse），内容区增宽 */
.doc-page { display:flex; gap:1rem; padding:1rem; flex-direction: row-reverse; align-items:flex-start; justify-content: center; }

/* 目录：透明玻璃材质 + 阴影 */
.doc-toc {
  position: relative;
  z-index: 2; /* 在动画期间始终处于内容之上 */
  width: 260px;
  flex: 0 0 260px;
  background: rgba(255,255,255,0.55);
  color: #213547;
  padding: 0.75rem;
  border-radius: 12px;
  height: fit-content;
  backdrop-filter: blur(8px);
  -webkit-backdrop-filter: blur(8px);
  box-shadow: 0 8px 24px rgba(16,24,40,0.12);
  border: 1px solid rgba(255,255,255,0.6);
}
.doc-toc h3 { margin:0 0 0.5rem 0; font-size:1rem }
.doc-toc a { color: #154e8a; text-decoration: none }
.doc-toc a:hover { text-decoration: underline }

/* 文档内容区：更宽、更舒适的阅读宽度 */
.doc-content {
  position: relative;
  z-index: 1; /* 位于目录之下 */
  flex: 0 0 auto;
  width: 720px;
  background: rgba(255,255,255,0.98);
  color: #111;
  padding: 1.5rem 2rem;
  border-radius: 8px;
  box-shadow: 0 6px 18px rgba(16,24,40,0.08);
  max-width: 760px;
  text-align: left;
}
.doc-content h1, .doc-content h2, .doc-content h3 { margin-top:1rem }
.doc-content pre { background:#0f1720; color:#e6eef8; padding:0.75rem; border-radius:4px; overflow:auto }
.doc-content code { background:#f3f4f6; padding:0.1rem 0.25rem; border-radius:3px }

/* 折叠节样式 */
.doc-section { margin-bottom: 1rem; border-radius: 6px; overflow: hidden; border: 1px solid rgba(0,0,0,0.04); }
.section-header { display:flex; align-items:center; gap:0.5rem; padding:0.6rem 0.8rem; background: rgba(0,0,0,0.03); cursor: pointer }
.section-header h4 { margin:0; font-size:1rem }
.chev { background:transparent; border:0; font-size:1rem; width:24px; text-align:center; transition: transform 0.2s ease }
.section-header.open .chev { transform: rotate(90deg); }
.section-body { padding:1rem; border-top:1px solid rgba(0,0,0,0.04); overflow:hidden; }

/* 段落缩进以及基线外观优化 */
.doc-content p {
  text-indent: 2em;
  margin: 0 0 1rem 0;
  line-height: 1.6;
}

/* 折叠/展开动画 */
.collapse-enter-active, .collapse-leave-active {
  transition: max-height 0.3s ease;
}
.collapse-enter-from, .collapse-leave-to {
  max-height: 0;
}
.collapse-enter-to, .collapse-leave-from {
  max-height: 1000px; /* 大于预期内容高度 */
}

/* 响应式：窄屏时堆叠，目录变为顶部 */
@media (max-width: 900px) {
  .doc-page { flex-direction: column; }
  .doc-toc { width: 100%; flex: 0 0 auto; }
  .doc-content { max-width: 100%; }
}

/* 进入动画：内容从左，目录从右 */
.page-enter .doc-content {
  opacity: 0;
  transform: translateX(-100%);
  animation: slide-in-left 1s ease forwards;
}
.page-enter .doc-toc {
  opacity: 0;
  transform: translateX(100%);
  animation: slide-in-right 1s ease forwards;
}

@keyframes slide-in-left {
  to { opacity: 1; transform: translateX(0); }
}
@keyframes slide-in-right {
  to { opacity: 1; transform: translateX(0); }
}

</style>
