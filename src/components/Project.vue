<template>
  <div class="project-page page-enter">
    

    <section class="intro project-intro" id="project-intro">
      <div class="intro-inner project-intro-inner">
        <div class="intro-box project-card bsl-box" role="button" tabindex="0">
          <div class="project-header">
            <span class="project-badge">工具</span>
            <h3>BSL 启动器</h3>
          </div>
          <p class="project-desc">BSL（Block Server Launcher）是一款功能强大的 Minecraft 服务器启动器，集成了服务端管理、内网穿透、性能监控、Mod 管理等核心功能，为个人用户和小型服务器提供专业级的管理体验。</p>
          <ul class="project-features">
            <li>一键开服：自动检测 Java 版本，快速启动服务器</li>
            <li>内网穿透：内置 FRP，无需公网 IP 即可让好友访问</li>
            <li>性能监控：实时监控 CPU、内存、磁盘、网络使用</li>
            <li>Mod 管理：集成 CurseForge 和 Modrinth API</li>
            <li>配置管理：可视化编辑 server.properties</li>
            <li>实时控制台：日志显示、命令输入、日志导出</li>
          </ul>
          <div class="project-meta">
            <span>技术栈：Python、PySide6 | 状态：规划阶段</span>
          </div>
          <a href="#" @click.prevent="$router.push('/project/bsl')" class="project-link">查看详情 &rarr;</a>
        </div>
        <div class="intro-box project-card other-box">
          <div class="project-header">
            <span class="project-badge">其它</span>
            <h3>其他项目</h3>
          </div>
          <p class="project-desc">其他项目：音频解码工具，免费追剧播放器，小说爬虫工具等等。这些项目大多为高中时期编写制作的雏形工具，源码已经丢失，目前无法展示，尽力还原中。</p>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup>
import { ref, onMounted, nextTick } from 'vue'
import { marked } from 'marked'

const html = ref('')

onMounted(async () => {
  // 页面挂载时滚动到顶部
  window.scrollTo(0, 0)
  
  try {
    const res = await fetch('/api/project-info')
    const text = await res.text()
    html.value = marked.parse(text)
  } catch (e) {
    console.error(e)
    html.value = '<p>加载失败。</p>'
  }

  nextTick(() => {
    const page = document.querySelector('.page-enter')
    if (page) {
      const handler = () => page.classList.remove('page-enter')
      page.addEventListener('animationend', handler, { once: true })
    }

    // Add scroll-triggered animation for intro-box elements
    const boxElements = document.querySelectorAll('.intro-box')
    if ('IntersectionObserver' in window && boxElements.length > 0) {
      const io = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              entry.target.classList.add('box-visible')
              io.unobserve(entry.target)
            }
          })
        },
        { threshold: 0.1, rootMargin: '0px 0px -50px 0px' }
      )
      boxElements.forEach((el) => io.observe(el))
    }
  })
})
</script>

<style scoped>
/* 重用与 Devlog.vue 相似的样式，把内容区居中 */
.doc-content {
  max-width: 760px;
  margin: 1rem auto;
  background: rgba(255,255,255,0.98);
  color: #111;
  padding: 1.5rem 2rem;
  border-radius: 8px;
  box-shadow: 0 6px 18px rgba(16,24,40,0.08);
  text-align: left;
}

.page-enter .doc-content {
  opacity: 0;
  transform: translateY(20px);
  animation: fade-in-up 0.8s ease forwards;
}
@keyframes fade-in-up {
  to { opacity: 1; transform: translateY(0); }
}

/* intro-inner style (reuse appearance from Home intro) */
.intro.project-intro {
  padding: 3rem 1rem;
  max-width: 900px;
  margin: 0 auto;
  text-align: left;
}

.project-intro-inner {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
  background: transparent;
  padding: 0;
  border-radius: 12px;
  box-shadow: none;
}

.intro-box {
  width: 100%;
  padding: 2rem;
  border-radius: 14px;
  background: linear-gradient(120deg, #f5f7fa 60%, #e9f0ff 100%);
  cursor: default;
  transition: transform 0.2s, box-shadow 0.2s;
  box-shadow: 0 4px 16px rgba(80,120,200,0.08);
  border: 1px solid rgba(224,237,255,0.6);
}

.intro-box {
  opacity: 0;
  transform: translateY(30px);
}

.intro-box.box-visible {
  animation: slideInUp 0.6s ease-out forwards;
}

.intro-box:nth-child(2).box-visible {
  animation-delay: 0.1s;
}

@keyframes slideInUp {
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.intro-box:hover {
  transform: translateY(-4px);
  box-shadow: 0 12px 32px rgba(80,120,200,0.15);
}

.intro-box.box-visible:hover {
  transform: translateY(-4px);
}

.bsl-box {
  cursor: pointer;
}

.bsl-box:active {
  transform: translateY(-2px);
}

.other-box {
  background: linear-gradient(120deg, #faf8f3 60%, #fff7ed 100%);
  border: 1px solid rgba(241,231,214,0.8);
}

/* project-card styles (from index.vue) */
.project-card {
  background: linear-gradient(120deg, #f5f7fa 60%, #e9f0ff 100%);
  border-radius: 12px;
  box-shadow: 0 4px 16px rgba(80,120,200,0.08);
  transition: box-shadow .2s;
}

.project-card:hover {
  box-shadow: 0 8px 32px rgba(80,120,200,0.16);
}

.project-header {
  display: flex;
  align-items: center;
  gap: 1rem;
  margin-bottom: 0.5rem;
}

.project-badge {
  display: inline-block;
  background: #3b82f6;
  color: #fff;
  font-size: 0.85rem;
  border-radius: 6px;
  padding: 0.2em 0.8em;
  font-weight: 600;
  letter-spacing: 0.04em;
}

.project-header h3 {
  margin: 0;
  font-size: 1.3rem;
  font-weight: 600;
  color: #1a2233;
}

.project-desc {
  margin: 0.5rem 0 1.2rem 0;
  color: #3b4252;
  font-size: 1.08rem;
}

.project-features {
  margin: 0 0 1.2rem 1.2rem;
  padding: 0;
  color: #2d3748;
  font-size: 1rem;
  list-style: disc;
}

.project-meta {
  font-size: 0.95rem;
  color: #6b7280;
  margin-bottom: 1rem;
}

.project-link {
  display: inline-block;
  color: #2563eb;
  font-weight: 600;
  text-decoration: none;
  border-bottom: 1px solid #2563eb22;
  padding-bottom: 2px;
  transition: color .2s;
}

.project-link:hover {
  color: #1d4ed8;
  border-bottom: 1px solid #1d4ed8;
}

@media (max-width: 768px) {
  .project-intro-inner { flex-direction: column; }
}
</style>