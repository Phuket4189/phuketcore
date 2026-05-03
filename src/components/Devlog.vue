<script setup>
import { ref, computed, onMounted, nextTick } from 'vue'
import { marked } from 'marked'
import { fetchTextOrThrow } from '../utils/http'

const sections = ref([])
const searchQuery = ref('')
const selectedTag = ref('all')

function slugify(text) {
  return text.toLowerCase().replace(/[^a-z0-9\-]+/g, '-').replace(/(^-|-$)/g, '')
}

function splitByDateSections(mdText) {
  const lines = mdText.split(/\r?\n/)
  const result = []
  let current = { title: '未分类', lines: [], tags: ['其他'] }
  
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i]
    const tagMatch = line.match(/^tags:\s*(.+)$/)
    if (tagMatch) {
      current.tags = tagMatch[1].split(',').map(t => t.trim())
    } else {
      const m = line.match(/^##\s+(.*)$/)
      if (m) {
        if (current.lines.length > 0 || current.title !== '未分类') {
          result.push(current)
        }
        current = { title: m[1].trim() || '未命名', lines: [], tags: ['其他'] }
      } else {
        current.lines.push(line)
      }
    }
  }
  if (current.lines.length > 0 || current.title !== '未分类') {
    result.push(current)
  }
  return result
}

const allTags = computed(() => {
  const tags = new Set()
  sections.value.forEach(s => {
    s.tags.forEach(t => tags.add(t))
  })
  return ['all', ...Array.from(tags)]
})

const filteredSections = computed(() => {
  let filtered = sections.value
  
  if (selectedTag.value !== 'all') {
    filtered = filtered.filter(s => s.tags.includes(selectedTag.value))
  }
  
  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase()
    filtered = filtered.filter(s => 
      s.title.toLowerCase().includes(query) || 
      s.plainText?.toLowerCase().includes(query)
    )
  }
  
  return filtered
})

const sectionCount = computed(() => sections.value.length)
const totalTags = computed(() => allTags.value.length - 1)

onMounted(async () => {
  window.scrollTo(0, 0)
  
  nextTick(() => {
    const page = document.querySelector('.page-enter')
    if (page) {
      const handler = () => page.classList.remove('page-enter')
      page.addEventListener('animationend', handler, { once: true })
    }
  })
  
  try {
    const text = await fetchTextOrThrow('/api/devlog')
    const parts = splitByDateSections(text)
    const renderer = new marked.Renderer()
    renderer.heading = (txt, level) => {
      const id = slugify(txt)
      return `<h${level} id="${id}">${txt}</h${level}>`
    }

    sections.value = parts.map((p, idx) => {
      const content = p.lines.join('\n')
      const html = marked.parse(content, { renderer })
      const plainText = content.replace(/[#*`_\[\]]/g, '').trim()
      const slug = slugify(p.title || `section-${idx}`)
      return { title: p.title, slug, html, tags: p.tags, plainText, open: idx === 0 }
    })
  } catch (e) {
    sections.value = [{ 
      title: '加载失败', 
      slug: 'error', 
      html: '<p>加载文档失败。</p>', 
      tags: ['其他'], 
      plainText: '',
      open: true 
    }]
    console.error(e)
  }
})

function toggleAndScroll(s) {
  s.open = !s.open
  if (s.open) {
    nextTick(() => {
      const el = document.getElementById(s.slug)
      if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' })
    })
  }
}

function formatDate(dateStr) {
  const date = new Date(dateStr)
  if (Number.isNaN(date.getTime())) {
    return dateStr
  }

  return date.toLocaleDateString('zh-CN', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  })
}

function getTagClass(tag) {
  const colors = {
    'Vue': 'tag-vue',
    'React': 'tag-react',
    'Python': 'tag-python',
    'Minecraft': 'tag-minecraft',
    '前端': 'tag-frontend',
    '后端': 'tag-backend',
    'Bug修复': 'tag-bugfix',
    '新功能': 'tag-feature',
    '优化': 'tag-optimization'
  }
  return colors[tag] || 'tag-default'
}
</script>

<template>
  <div class="doc-page page-enter">
    <aside class="doc-toc">
      <div class="toc-header">
        <h3>开发日志</h3>
        <span class="toc-badge">{{ sectionCount }} 篇</span>
      </div>

      <div class="toc-search">
        <input 
          v-model="searchQuery" 
          type="text" 
          placeholder="搜索日志..." 
          class="search-input"
        />
      </div>

      <div class="toc-tags">
        <span class="tag-label">分类</span>
        <div class="tags-list">
          <button 
            v-for="tag in allTags" 
            :key="tag" 
            :class="['tag-item', { active: selectedTag === tag }]"
            @click="selectedTag = tag"
          >
            {{ tag === 'all' ? '全部' : tag }}
          </button>
        </div>
      </div>

      <nav class="toc-nav">
        <h4>目录</h4>
        <ul>
          <li v-for="s in filteredSections" :key="s.slug">
            <a :href="`#${s.slug}`" @click.prevent="toggleAndScroll(s)" class="toc-link">
              <span class="toc-date">{{ formatDate(s.title) }}</span>
              <span v-if="s.tags" class="toc-tags">
                <span v-for="tag in s.tags.slice(0, 2)" :key="tag" :class="['toc-tag', getTagClass(tag)]">
                  {{ tag }}
                </span>
              </span>
            </a>
          </li>
        </ul>
      </nav>
    </aside>

    <section class="doc-content">
      <div v-if="filteredSections.length === 0" class="empty-state">
        <p>没有找到匹配的开发日志</p>
        <button @click="searchQuery = ''; selectedTag = 'all'" class="clear-btn">
          清除筛选条件
        </button>
      </div>

      <article 
        v-for="s in filteredSections" 
        :key="s.slug" 
        :id="s.slug" 
        class="doc-section"
      >
        <header class="section-header" :class="{ open: s.open }" :aria-expanded="s.open" @click="s.open = !s.open">
          <button class="chev" aria-hidden="true">{{ s.open ? '▾' : '▸' }}</button>
          <div class="header-info">
            <h4>{{ formatDate(s.title) }}</h4>
            <span class="section-tags">
              <span v-for="tag in s.tags" :key="tag" :class="['tag', getTagClass(tag)]">
                {{ tag }}
              </span>
            </span>
          </div>
        </header>
        <transition name="collapse">
          <div class="section-body" v-show="s.open" v-html="s.html"></div>
        </transition>
      </article>
    </section>
  </div>
</template>

<style scoped>
.doc-page { 
  display: flex; 
  gap: 1.5rem; 
  padding: 2rem 1.5rem; 
  flex-direction: row-reverse; 
  align-items: flex-start; 
  justify-content: center;
  max-width: 1180px;
  margin: 0 auto;
}

.doc-toc {
  position: sticky;
  top: 2rem;
  z-index: 2;
  width: 280px;
  flex: 0 0 280px;
  background: var(--bg-panel-strong);
  color: var(--text-primary);
  padding: 1.25rem;
  border-radius: 24px;
  max-height: calc(100vh - 4rem);
  overflow-y: auto;
  backdrop-filter: blur(14px);
  -webkit-backdrop-filter: blur(14px);
  box-shadow: var(--shadow-soft), var(--shadow-inset);
  border: 1px solid var(--border-soft);
}

.toc-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
}

.toc-header h3 {
  margin: 0;
  font-size: 1.1rem;
  font-weight: 700;
  color: var(--text-primary);
}

.toc-badge {
  background: rgba(49, 70, 208, 0.1);
  color: var(--brand);
  padding: 0.2rem 0.6rem;
  border-radius: 12px;
  font-size: 0.75rem;
  font-weight: 600;
}

.toc-search {
  margin-bottom: 1rem;
}

.search-input {
  width: 100%;
  padding: 0.6rem 0.8rem;
  border: 1px solid var(--border-soft);
  border-radius: 14px;
  font-size: 0.9rem;
  outline: none;
  transition: border-color 0.2s, box-shadow 0.2s;
  box-sizing: border-box;
  background: rgba(255,255,255,0.74);
  color: var(--text-primary);
}

.search-input:focus {
  border-color: rgba(49, 70, 208, 0.35);
  box-shadow: 0 0 0 4px rgba(49, 70, 208, 0.08);
}

.toc-tags {
  margin-bottom: 1rem;
}

.tag-label {
  font-size: 0.85rem;
  font-weight: 600;
  color: var(--text-muted);
  margin-bottom: 0.5rem;
  display: block;
}

.tags-list {
  display: flex;
  flex-wrap: wrap;
  gap: 0.4rem;
}

.tag-item {
  padding: 0.3rem 0.7rem;
  border: 1px solid var(--border-soft);
  border-radius: 999px;
  background: rgba(255,255,255,0.75);
  font-size: 0.8rem;
  cursor: pointer;
  transition: all 0.2s;
  color: var(--text-secondary);
}

.tag-item:hover {
  border-color: rgba(49, 70, 208, 0.35);
  color: var(--brand);
}

.tag-item.active {
  background: var(--brand-soft);
  border-color: rgba(49, 70, 208, 0.24);
  color: var(--brand);
}

.toc-nav h4 {
  margin: 0 0 0.75rem 0;
  font-size: 0.95rem;
  color: var(--text-muted);
  font-weight: 600;
}

.toc-nav ul {
  list-style: none;
  padding: 0;
  margin: 0;
}

.toc-nav li {
  margin: 0.3rem 0;
}

.toc-link {
  display: block;
  padding: 0.75rem;
  color: var(--text-primary);
  border-radius: 14px;
  transition: background 0.2s, transform 0.2s;
  font-size: 0.9rem;
  border: 1px solid transparent;
}

.toc-link:hover {
  background: rgba(49, 70, 208, 0.06);
  transform: translateX(2px);
}

.toc-date {
  font-weight: 500;
}

.toc-tags {
  display: flex;
  gap: 0.25rem;
  margin-top: 0.25rem;
  flex-wrap: wrap;
}

.toc-tag {
  font-size: 0.7rem;
  padding: 0.1rem 0.4rem;
  border-radius: 999px;
  background: rgba(30, 41, 59, 0.06);
  color: var(--text-muted);
}

.doc-content {
  position: relative;
  z-index: 1;
  flex: 0 0 auto;
  width: min(760px, 100%);
  background: var(--bg-panel-strong);
  color: var(--text-primary);
  padding: 2rem;
  border-radius: 28px;
  box-shadow: var(--shadow-soft), var(--shadow-inset);
  max-width: 760px;
  text-align: left;
  border: 1px solid var(--border-soft);
}

.doc-content h1, .doc-content h2, .doc-content h3 { 
  margin-top: 1rem;
  color: var(--text-primary);
}

.doc-content pre { 
  background: #0f172a; 
  color: #e2e8f0; 
  padding: 1rem; 
  border-radius: 8px; 
  overflow: auto;
  font-size: 0.9rem;
}

.doc-content code { 
  background: #edf1f8; 
  padding: 0.2rem 0.4rem; 
  border-radius: 8px;
  font-size: 0.9em;
}

.doc-content pre code {
  background: transparent;
  padding: 0;
}

.doc-section { 
  margin-bottom: 1rem; 
  border-radius: 20px; 
  overflow: hidden; 
  border: 1px solid var(--border-soft);
  transition: box-shadow 0.2s;
  background: rgba(255,255,255,0.72);
}

.doc-section:hover {
  box-shadow: 0 18px 36px rgba(24, 33, 47, 0.08);
}

.section-header { 
  display: flex; 
  align-items: flex-start; 
  gap: 0.75rem; 
  padding: 1.1rem 1.15rem; 
  background: linear-gradient(180deg, rgba(255,255,255,0.96), rgba(245,248,252,0.9));
  cursor: pointer;
  border-radius: 20px;
}

.section-header:hover {
  background: linear-gradient(180deg, rgba(255,255,255,0.98), rgba(239,244,250,0.94));
}

.header-info {
  flex: 1;
}

.header-info h4 { 
  margin: 0 0 0.5rem 0; 
  font-size: 1.1rem;
  font-weight: 600;
  color: var(--text-primary);
}

.section-tags {
  display: flex;
  gap: 0.4rem;
  flex-wrap: wrap;
}

.tag {
  font-size: 0.75rem;
  padding: 0.2rem 0.6rem;
  border-radius: 999px;
  background: rgba(30, 41, 59, 0.06);
  color: var(--text-muted);
  font-weight: 500;
}

.tag-vue { background: #dcfce7; color: #166534; }
.tag-react { background: #dbeafe; color: #1e40af; }
.tag-python { background: #fef3c7; color: #92400e; }
.tag-minecraft { background: #f3e8ff; color: #7c3aed; }
.tag-frontend { background: #e0f2fe; color: #0369a1; }
.tag-backend { background: #fce7f3; color: #9d174d; }
.tag-bugfix { background: #fee2e2; color: #991b1b; }
.tag-feature { background: #d1fae5; color: #065f46; }
.tag-optimization { background: #fef9c3; color: #854d0e; }
.tag-default { background: #f1f5f9; color: #64748b; }

.chev { 
  background: transparent; 
  border: 0; 
  font-size: 1rem; 
  width: 24px; 
  text-align: center; 
  transition: transform 0.2s ease;
  color: var(--text-muted);
  flex-shrink: 0;
  box-shadow: none;
}

.section-header.open .chev { 
  transform: rotate(90deg); 
}

.section-body { 
  padding: 1rem 1.5rem; 
  border-top: 1px solid var(--border-soft);
}

.doc-content p {
  margin: 0 0 1rem 0;
  line-height: 1.85;
  color: var(--text-secondary);
}

.doc-content ul, .doc-content ol {
  margin: 0 0 1rem 0;
  padding-left: 1.5rem;
}

.doc-content li {
  margin: 0.4rem 0;
  line-height: 1.6;
  color: var(--text-secondary);
}

.collapse-enter-active, .collapse-leave-active {
  transition: max-height 0.3s ease;
}

.collapse-enter-from, .collapse-leave-to {
  max-height: 0;
}

.collapse-enter-to, .collapse-leave-from {
  max-height: 2000px;
}

.empty-state {
  text-align: center;
  padding: 4rem 2rem;
  color: var(--text-muted);
}

.empty-icon {
  font-size: 4rem;
  margin-bottom: 1rem;
}

.empty-state p {
  margin: 0 0 1.5rem 0;
  font-size: 1.1rem;
}

.clear-btn {
  background: rgba(255,255,255,0.92);
  color: var(--brand);
}

.clear-btn:hover {
  color: var(--brand-strong);
}

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

@media (max-width: 900px) {
  .doc-page { flex-direction: column; }
  .doc-toc { 
    width: 100%; 
    flex: 0 0 auto; 
    position: static;
    max-height: none;
  }
  .doc-content {
    max-width: 100%;
    padding: 1.35rem;
  }
}
</style>
