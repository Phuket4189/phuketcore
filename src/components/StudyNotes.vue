<script setup>
import { ref, computed, onMounted, nextTick } from 'vue'
import { marked } from 'marked'
import { fetchTextOrThrow } from '../utils/http'

const notes = ref([])
const searchQuery = ref('')
const selectedCategory = ref('all')
const selectedLevel = ref('all')

function slugify(text) {
  return text.toLowerCase().replace(/[^a-z0-9\-]+/g, '-').replace(/(^-|-$)/g, '')
}

function parseNotes(mdText) {
  const lines = mdText.split(/\r?\n/)
  const result = []
  let current = null

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i]
    const h1Match = line.match(/^#\s+(.+)$/)
    
    if (h1Match) {
      if (current) {
        result.push(current)
      }
      current = {
        title: h1Match[1].trim(),
        lines: [],
        category: '其他',
        level: '入门',
        tags: []
      }
    } else if (current) {
      const metaMatch = line.match(/^(category|level|tags):\s*(.+)$/)
      if (metaMatch) {
        const [, key, value] = metaMatch
        if (key === 'category') {
          current.category = value.trim()
        } else if (key === 'level') {
          current.level = value.trim()
        } else if (key === 'tags') {
          current.tags = value.split(',').map(t => t.trim())
        }
      } else {
        current.lines.push(line)
      }
    }
  }

  if (current) {
    result.push(current)
  }

  return result
}

const allCategories = computed(() => {
  const cats = new Set()
  notes.value.forEach(n => cats.add(n.category))
  return ['all', ...Array.from(cats)]
})

const allLevels = computed(() => {
  const levels = new Set()
  notes.value.forEach(n => levels.add(n.level))
  return ['all', ...Array.from(levels)]
})

const filteredNotes = computed(() => {
  let filtered = notes.value

  if (selectedCategory.value !== 'all') {
    filtered = filtered.filter(n => n.category === selectedCategory.value)
  }

  if (selectedLevel.value !== 'all') {
    filtered = filtered.filter(n => n.level === selectedLevel.value)
  }

  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase()
    filtered = filtered.filter(n =>
      n.title.toLowerCase().includes(query) ||
      n.plainText?.toLowerCase().includes(query)
    )
  }

  return filtered
})

const noteCount = computed(() => notes.value.length)

function getLevelBadgeClass(level) {
  const map = {
    '入门': 'badge-beginner',
    '进阶': 'badge-intermediate',
    '高级': 'badge-advanced',
    '专家': 'badge-expert'
  }
  return map[level] || 'badge-default'
}

function getCategoryIcon(category) {
  return category
}

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
    const text = await fetchTextOrThrow('/api/docs/study.md')
    const parts = parseNotes(text)
    const renderer = new marked.Renderer()
    renderer.heading = (txt, level) => {
      const id = slugify(txt)
      return `<h${level} id="${id}">${txt}</h${level}>`
    }

    notes.value = parts.map((p, idx) => {
      const content = p.lines.join('\n')
      const html = marked.parse(content, { renderer })
      const plainText = content.replace(/[#*`_\[\]]/g, '').trim()
      const slug = slugify(p.title || `note-${idx}`)
      return {
        title: p.title,
        slug,
        html,
        tags: p.tags,
        category: p.category,
        level: p.level,
        plainText,
        open: false
      }
    })
  } catch (e) {
    notes.value = [{
      title: '暂无笔记',
      slug: 'empty',
      html: '<p>还没有编程笔记，敬请期待！</p>',
      tags: [],
      category: '其他',
      level: '入门',
      plainText: '',
      open: true
    }]
    console.error(e)
  }
})

function toggleNote(n) {
  n.open = !n.open
  if (n.open) {
    nextTick(() => {
      const el = document.getElementById(n.slug)
      if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' })
    })
  }
}
</script>

<template>
  <div class="notes-page page-enter">
    <section class="notes-hero">
      <div class="glass-blob blob-1"></div>
      <div class="glass-blob blob-2"></div>
      <div class="hero-content">
        <h1 class="hero-title">编程笔记</h1>
        <p class="hero-subtitle">记录学习过程中的知识与技巧</p>
        <div class="hero-stats">
          <div class="stat-item">
            <span class="stat-value">{{ noteCount }}</span>
            <span class="stat-label">篇笔记</span>
          </div>
          <div class="stat-item">
            <span class="stat-value">{{ allCategories.length - 1 }}</span>
            <span class="stat-label">个分类</span>
          </div>
        </div>
      </div>
    </section>

    <div class="notes-main">
      <aside class="notes-sidebar">
        <div class="sidebar-card">
          <h3>筛选</h3>
          <div class="search-box">
            <input 
              v-model="searchQuery" 
              type="text" 
              placeholder="搜索笔记..." 
              class="search-input"
            />
          </div>

          <div class="filter-section">
            <label class="filter-label">分类</label>
            <div class="filter-list">
              <button 
                v-for="cat in allCategories" 
                :key="cat" 
                :class="['filter-btn', { active: selectedCategory === cat }]"
                @click="selectedCategory = cat"
              >
                {{ cat === 'all' ? '全部' : cat }}
              </button>
            </div>
          </div>

          <div class="filter-section">
            <label class="filter-label">难度</label>
            <div class="filter-list">
              <button 
                v-for="lvl in allLevels" 
                :key="lvl" 
                :class="['filter-btn', { active: selectedLevel === lvl }]"
                @click="selectedLevel = lvl"
              >
                {{ lvl === 'all' ? '🎯 全部' : lvl }}
              </button>
            </div>
          </div>
        </div>

        <nav class="notes-nav">
          <h4>目录</h4>
          <ul>
            <li v-for="n in filteredNotes" :key="n.slug">
              <a 
                :href="`#${n.slug}`" 
                @click.prevent="toggleNote(n)" 
                class="nav-link"
              >
                <span class="nav-title">{{ n.title }}</span>
                <span class="nav-meta">
                  <span :class="['level-badge', getLevelBadgeClass(n.level)]">
                    {{ n.level }}
                  </span>
                </span>
              </a>
            </li>
          </ul>
        </nav>
      </aside>

      <section class="notes-content">
        <div v-if="filteredNotes.length === 0" class="empty-state">
          <p>没有找到匹配的笔记</p>
          <button @click="searchQuery = ''; selectedCategory = 'all'; selectedLevel = 'all'" class="clear-btn">
            清除筛选条件
          </button>
        </div>

        <article 
          v-for="n in filteredNotes" 
          :key="n.slug" 
          :id="n.slug" 
          class="note-card"
          :class="{ open: n.open }"
        >
          <header class="note-header" @click="toggleNote(n)">
            <button class="note-chev">{{ n.open ? '▾' : '▸' }}</button>
            <div class="note-info">
              <h3>{{ n.title }}</h3>
              <div class="note-tags">
                <span class="category-tag">{{ getCategoryIcon(n.category) }} {{ n.category }}</span>
                <span :class="['level-badge', getLevelBadgeClass(n.level)]">
                  {{ n.level }}
                </span>
                <span v-for="tag in n.tags.slice(0, 3)" :key="tag" class="tag">
                  {{ tag }}
                </span>
              </div>
            </div>
          </header>
          <transition name="note-collapse">
            <div class="note-body" v-show="n.open" v-html="n.html"></div>
          </transition>
        </article>
      </section>
    </div>
  </div>
</template>

<style scoped>
.notes-page {
  min-height: 100vh;
}

.notes-hero {
  width: 100vw;
  min-width: 100vw;
  margin-left: calc(50% - 50vw);
  height: 40vh;
  min-height: 300px;
  display: flex;
  align-items: center;
  justify-content: center;
  background:
    radial-gradient(circle at 20% 20%, rgba(255,255,255,0.82), transparent 22%),
    radial-gradient(circle at 84% 20%, rgba(255, 205, 104, 0.2), transparent 24%),
    linear-gradient(180deg, #fbf9f2 0%, #f2f2f6 56%, #eceef5 100%);
  position: relative;
  overflow: hidden;
}

.glass-blob {
  position: absolute;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.28);
  backdrop-filter: blur(24px);
  -webkit-backdrop-filter: blur(24px);
  border: 1px solid rgba(255, 255, 255, 0.66);
  box-shadow: 0 24px 52px rgba(102, 92, 54, 0.1), inset 0 1px 0 rgba(255,255,255,0.88);
  z-index: 1;
  pointer-events: none;
}

.blob-1 {
  width: 240px;
  height: 240px;
  top: 10%;
  left: 5%;
  animation: float 8s ease-in-out infinite;
}

.blob-2 {
  width: 200px;
  height: 200px;
  bottom: 10%;
  right: 8%;
  animation: float 10s ease-in-out infinite 1s;
}

@keyframes float {
  0%, 100% { transform: translateY(0px); }
  50% { transform: translateY(-30px); }
}

.hero-content {
  text-align: center;
  padding: 2rem;
  min-width: 320px;
  position: relative;
  z-index: 10;
}

.hero-title {
  font-size: clamp(2.3rem, 5vw, 4rem);
  margin: 0 0 0.5rem;
  font-weight: 800;
  letter-spacing: -0.04em;
  color: #413119;
  text-shadow: 0 14px 34px rgba(138, 105, 27, 0.12);
}

.hero-subtitle {
  margin: 0 0 1rem;
  color: #6b5a3d;
  font-size: 1rem;
  letter-spacing: 0.08em;
  text-transform: uppercase;
}

.hero-stats {
  display: flex;
  gap: 2rem;
  justify-content: center;
}

.stat-item {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.stat-value {
  font-size: 1.8rem;
  font-weight: 700;
  color: #8b641e;
}

.stat-label {
  font-size: 0.85rem;
  color: #7c6950;
}

.notes-main {
  display: flex;
  gap: 1.5rem;
  padding: 2rem 1.5rem;
  max-width: 1180px;
  margin: 0 auto;
  align-items: flex-start;
}

.notes-sidebar {
  width: 300px;
  flex: 0 0 300px;
  position: sticky;
  top: 2rem;
  max-height: calc(100vh - 4rem);
  overflow-y: auto;
}

.sidebar-card {
  background: var(--bg-panel-strong);
  border-radius: 22px;
  padding: 1.25rem;
  box-shadow: var(--shadow-soft), var(--shadow-inset);
  margin-bottom: 1rem;
  border: 1px solid var(--border-soft);
}

.sidebar-card h3 {
  margin: 0 0 1rem 0;
  font-size: 1rem;
  color: var(--text-primary);
}

.search-box {
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
  border-color: rgba(151, 116, 42, 0.34);
  box-shadow: 0 0 0 4px rgba(197, 144, 31, 0.08);
}

.filter-section {
  margin-bottom: 1rem;
}

.filter-label {
  font-size: 0.85rem;
  font-weight: 600;
  color: var(--text-muted);
  margin-bottom: 0.5rem;
  display: block;
}

.filter-list {
  display: flex;
  flex-wrap: wrap;
  gap: 0.4rem;
}

.filter-btn {
  padding: 0.35rem 0.7rem;
  border: 1px solid var(--border-soft);
  border-radius: 999px;
  background: rgba(255,255,255,0.78);
  font-size: 0.8rem;
  cursor: pointer;
  transition: all 0.2s;
  color: var(--text-secondary);
}

.filter-btn:hover {
  border-color: rgba(151, 116, 42, 0.32);
  color: #8d6520;
}

.filter-btn.active {
  background: rgba(197, 144, 31, 0.12);
  border-color: rgba(151, 116, 42, 0.24);
  color: #8d6520;
}

.notes-nav {
  background: var(--bg-panel-strong);
  border-radius: 22px;
  padding: 1.25rem;
  box-shadow: var(--shadow-soft), var(--shadow-inset);
  border: 1px solid var(--border-soft);
}

.notes-nav h4 {
  margin: 0 0 0.75rem 0;
  font-size: 0.95rem;
  color: var(--text-muted);
}

.notes-nav ul {
  list-style: none;
  padding: 0;
  margin: 0;
}

.notes-nav li {
  margin: 0.3rem 0;
}

.nav-link {
  display: block;
  padding: 0.75rem;
  border-radius: 14px;
  transition: background 0.2s, transform 0.2s;
  border: 1px solid transparent;
}

.nav-link:hover {
  background: rgba(197, 144, 31, 0.08);
  transform: translateX(2px);
}

.nav-title {
  font-size: 0.9rem;
  color: var(--text-primary);
  display: block;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.nav-meta {
  margin-top: 0.25rem;
}

.level-badge {
  font-size: 0.7rem;
  padding: 0.15rem 0.5rem;
  border-radius: 999px;
  font-weight: 500;
}

.badge-beginner { background: #dcfce7; color: #166534; }
.badge-intermediate { background: #dbeafe; color: #1e40af; }
.badge-advanced { background: #fef3c7; color: #92400e; }
.badge-expert { background: #fee2e2; color: #991b1b; }
.badge-default { background: #f1f5f9; color: #64748b; }

.notes-content {
  flex: 1;
  min-width: 0;
}

.note-card {
  background: var(--bg-panel-strong);
  border-radius: 24px;
  box-shadow: var(--shadow-soft), var(--shadow-inset);
  margin-bottom: 1rem;
  overflow: hidden;
  transition: box-shadow 0.2s;
  border: 1px solid var(--border-soft);
}

.note-card:hover {
  box-shadow: 0 22px 40px rgba(24, 33, 47, 0.1);
}

.note-header {
  display: flex;
  align-items: flex-start;
  gap: 0.75rem;
  padding: 1.25rem;
  cursor: pointer;
  background: linear-gradient(180deg, rgba(255,255,255,0.98), rgba(248,245,238,0.92));
}

.note-header:hover {
  background: linear-gradient(180deg, rgba(255,255,255,0.98), rgba(245,239,227,0.94));
}

.note-chev {
  background: transparent;
  border: none;
  font-size: 1rem;
  color: #8d6520;
  flex-shrink: 0;
  box-shadow: none;
}

.note-info {
  flex: 1;
}

.note-info h3 {
  margin: 0 0 0.5rem 0;
  font-size: 1.15rem;
  font-weight: 600;
  color: var(--text-primary);
}

.note-tags {
  display: flex;
  gap: 0.4rem;
  flex-wrap: wrap;
}

.category-tag {
  font-size: 0.75rem;
  padding: 0.2rem 0.6rem;
  border-radius: 999px;
  background: rgba(197, 144, 31, 0.12);
  color: #8d6520;
  font-weight: 500;
}

.tag {
  font-size: 0.7rem;
  padding: 0.2rem 0.5rem;
  border-radius: 999px;
  background: rgba(30, 41, 59, 0.06);
  color: var(--text-muted);
}

.note-body {
  padding: 1rem 1.5rem 1.5rem;
  border-top: 1px solid var(--border-soft);
}

.note-body :deep(h1), .note-body :deep(h2), .note-body :deep(h3) {
  margin-top: 1.5rem;
  margin-bottom: 0.75rem;
  color: var(--text-primary);
}

.note-body :deep(h1) { font-size: 1.5rem; }
.note-body :deep(h2) { font-size: 1.3rem; }
.note-body :deep(h3) { font-size: 1.15rem; }

.note-body :deep(p) {
  margin: 0 0 1rem 0;
  line-height: 1.8;
  color: var(--text-secondary);
}

.note-body :deep(code) {
  background: #edf1f8;
  padding: 0.2rem 0.4rem;
  border-radius: 8px;
  font-size: 0.9em;
  color: #c7254e;
}

.note-body :deep(pre) {
  background: #0f172a;
  color: #e2e8f0;
  padding: 1rem;
  border-radius: 8px;
  overflow-x: auto;
  margin: 0 0 1rem 0;
}

.note-body :deep(pre code) {
  background: transparent;
  padding: 0;
}

.note-body :deep(ul), .note-body :deep(ol) {
  margin: 0 0 1rem 0;
  padding-left: 1.5rem;
}

.note-body :deep(li) {
  margin: 0.4rem 0;
  line-height: 1.6;
  color: var(--text-secondary);
}

.note-body :deep(blockquote) {
  border-left: 4px solid #c5901f;
  margin: 0 0 1rem 0;
  padding: 0.5rem 1rem;
  background: #fbf6ea;
  border-radius: 0 8px 8px 0;
}

.note-body :deep(table) {
  width: 100%;
  border-collapse: collapse;
  margin: 0 0 1rem 0;
}

.note-body :deep(th), .note-body :deep(td) {
  border: 1px solid var(--border-soft);
  padding: 0.75rem;
  text-align: left;
}

.note-body :deep(th) {
  background: #f7f8fb;
  font-weight: 600;
}

.note-collapse-enter-active, .note-collapse-leave-active {
  transition: max-height 0.3s ease;
}

.note-collapse-enter-from, .note-collapse-leave-to {
  max-height: 0;
}

.note-collapse-enter-to, .note-collapse-leave-from {
  max-height: 3000px;
}

.empty-state {
  text-align: center;
  padding: 4rem 2rem;
  background: var(--bg-panel-strong);
  border-radius: 24px;
  color: var(--text-muted);
  border: 1px solid var(--border-soft);
}

.empty-icon {
  font-size: 4rem;
  margin-bottom: 1rem;
}

.clear-btn {
  background: rgba(255,255,255,0.92);
  color: #8d6520;
}

.clear-btn:hover {
  color: #6f4f18;
}

@media (max-width: 900px) {
  .notes-main { flex-direction: column; }
  .notes-sidebar {
    width: 100%;
    position: static;
    max-height: none;
  }
}
</style>
