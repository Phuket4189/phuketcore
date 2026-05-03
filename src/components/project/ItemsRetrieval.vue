<script setup>
import { onMounted, onBeforeUnmount, ref, nextTick } from 'vue'
import { marked } from 'marked'
import readmeSource from './resource/README-IR.md?raw'

let observers = []
let animateObserver

// 懒加载状态
const featuresLoaded = ref(false)
const techLoaded = ref(false)
const linksLoaded = ref(false)
const readmeHtml = ref('')
const readmeLoading = ref(true)

onMounted(async () => {
  window.scrollTo(0, 0)

  try {
    readmeHtml.value = marked.parse(readmeSource)
  } catch (e) {
    console.error(e)
    readmeHtml.value = '<p>文档加载失败。</p>'
  } finally {
    readmeLoading.value = false
  }

  nextTick(() => {
    const elements = document.querySelectorAll('[data-animate]')

    const animateObserverOptions = {
      threshold: 0.1,
      rootMargin: '0px 0px -50px 0px'
    }

    animateObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('animated')
          animateObserver.unobserve(entry.target)
        }
      })
    }, animateObserverOptions)

    elements.forEach(el => {
      animateObserver.observe(el)
    })

    observers.push(animateObserver)

    const lazyLoadObserverOptions = {
      threshold: 0.01,
      rootMargin: '100px'
    }

    const lazyObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const target = entry.target
          if (target.dataset.lazyLoad === 'features') {
            featuresLoaded.value = true
            nextTick(() => {
              target.querySelectorAll('[data-animate]').forEach(el => animateObserver.observe(el))
            })
            lazyObserver.unobserve(target)
          } else if (target.dataset.lazyLoad === 'tech') {
            techLoaded.value = true
            nextTick(() => {
              target.querySelectorAll('[data-animate]').forEach(el => animateObserver.observe(el))
            })
            lazyObserver.unobserve(target)
          } else if (target.dataset.lazyLoad === 'links') {
            linksLoaded.value = true
            nextTick(() => {
              target.querySelectorAll('[data-animate]').forEach(el => animateObserver.observe(el))
            })
            lazyObserver.unobserve(target)
          }
        }
      })
    }, lazyLoadObserverOptions)

    const lazyElements = document.querySelectorAll('[data-lazy-load]')
    lazyElements.forEach(el => {
      lazyObserver.observe(el)
    })

    observers.push(lazyObserver)
  })
})

onBeforeUnmount(() => {
  observers.forEach(observer => observer.disconnect())
  observers = []
})
</script>

<template>
  <div class="ir-page">
    <div class="ir-hero">
      <div class="glass-blob blob-1"></div>
      <div class="glass-blob blob-2"></div>
      <div class="glass-blob blob-3"></div>
      <div class="glass-blob blob-4"></div>

      <div class="hero-content" data-animate>
        <h1 class="hero-title">Items Retrieval</h1>
        <p class="hero-subtitle">Minecraft 客户端物品检索辅助模组</p>
        <div class="hero-tags">
          <span class="tag">Java</span>
          <span class="tag">Fabric</span>
          <span class="tag">Minecraft 1.21.10</span>
          <span class="tag">Mod</span>
        </div>
      </div>
    </div>

    <div class="ir-main">
      <div class="ir-intro" data-animate>
        <div class="intro-text">
          <h2>项目概述</h2>
          <p>客户端物品检索辅助模组。打开检索面板后添加要查找的物品，点击执行附近检索或开启持续检索，即可查看附近命中容器并获得高亮与方向提示。</p>
        </div>
        <div class="intro-stats">
          <div class="stat-item">
            <div class="stat-number">128</div>
            <div class="stat-label">最大目标物品</div>
          </div>
          <div class="stat-item">
            <div class="stat-number">12</div>
            <div class="stat-label">检索半径（格）</div>
          </div>
          <div class="stat-item">
            <div class="stat-number">768</div>
            <div class="stat-label">最大扫描容器</div>
          </div>
        </div>
      </div>

      <div class="ir-features" data-lazy-load="features">
        <div v-if="!featuresLoaded" class="lazy-placeholder">
          <div class="spinner"></div>
          <p>加载中...</p>
        </div>
        <template v-else>
          <h2 data-animate>核心功能</h2>
          <div class="features-grid">
            <div class="feature-card" data-animate>
              <div class="feature-icon">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
                  <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
                  <line x1="3" y1="9" x2="21" y2="9"></line>
                  <line x1="9" y1="21" x2="9" y2="9"></line>
                </svg>
              </div>
              <h3>检索面板</h3>
              <p>按 U 键打开专属 GUI，可添加最多 128 种目标物品</p>
            </div>
            <div class="feature-card" data-animate>
              <div class="feature-icon">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
                  <circle cx="11" cy="11" r="8"></circle>
                  <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
                </svg>
              </div>
              <h3>附近检索</h3>
              <p>按 O 键执行单次检索，扫描范围内的容器</p>
            </div>
            <div class="feature-card" data-animate>
              <div class="feature-icon">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
                  <polyline points="23 4 23 10 17 10"></polyline>
                  <path d="M20.49 15a9 9 0 1 1-2.12-9.36L23 10"></path>
                </svg>
              </div>
              <h3>持续检索</h3>
              <p>开启后每 10 秒自动刷新，高亮持续显示</p>
            </div>
            <div class="feature-card" data-animate>
              <div class="feature-icon">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
                  <path d="M12 2.69l5.66 5.66a8 8 0 1 1-11.31 0z"></path>
                </svg>
              </div>
              <h3>高亮渲染</h3>
              <p>命中的容器以彩色方框高亮（可自定义颜色）</p>
            </div>
            <div class="feature-card" data-animate>
              <div class="feature-icon">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
                  <line x1="12" y1="19" x2="12" y2="5"></line>
                  <polyline points="5 12 12 5 19 12"></polyline>
                </svg>
              </div>
              <h3>方向指引</h3>
              <p>最多显示 6 条方向引导线，指向最近的命中容器</p>
            </div>
            <div class="feature-card" data-animate>
              <div class="feature-icon">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
                  <rect x="3" y="3" width="7" height="7"></rect>
                  <rect x="14" y="3" width="7" height="7"></rect>
                  <rect x="14" y="14" width="7" height="7"></rect>
                  <rect x="3" y="14" width="7" height="7"></rect>
                </svg>
              </div>
              <h3>结果分页</h3>
              <p>中央展示区支持翻页，浏览所有检索结果</p>
            </div>
          </div>
        </template>
      </div>

      <div class="ir-tech" data-lazy-load="tech">
        <div v-if="!techLoaded" class="lazy-placeholder">
          <div class="spinner"></div>
          <p>加载中...</p>
        </div>
        <template v-else>
          <h2 data-animate>技术栈</h2>
          <div class="tech-grid">
            <div class="tech-item" data-animate>
              <div class="tech-label">游戏版本</div>
              <div class="tech-value">Minecraft 1.21.10</div>
            </div>
            <div class="tech-item" data-animate>
              <div class="tech-label">Mod Loader</div>
              <div class="tech-value">Fabric Loader 0.18.1</div>
            </div>
            <div class="tech-item" data-animate>
              <div class="tech-label">编程语言</div>
              <div class="tech-value">Java 21</div>
            </div>
            <div class="tech-item" data-animate>
              <div class="tech-label">构建工具</div>
              <div class="tech-value">Gradle + fabric-loom</div>
            </div>
            <div class="tech-item" data-animate>
              <div class="tech-label">代码注入</div>
              <div class="tech-value">Mixin</div>
            </div>
            <div class="tech-item" data-animate>
              <div class="tech-label">项目状态</div>
              <div class="tech-value active">已完成</div>
            </div>
          </div>
        </template>
      </div>

      <div class="ir-readme" data-lazy-load="readme">
        <h2 data-animate>项目文档</h2>
        <div v-if="readmeLoading" class="lazy-placeholder">
          <div class="spinner"></div>
          <p>文档加载中...</p>
        </div>
        <div v-else class="readme-content markdown-body" data-animate v-html="readmeHtml"></div>
      </div>

      <div class="ir-links" data-lazy-load="links">
        <div v-if="!linksLoaded" class="lazy-placeholder">
          <div class="spinner"></div>
          <p>加载中...</p>
        </div>
        <template v-else>
          <h2 data-animate>相关链接</h2>
          <div class="links-container">
            <a href="https://github.com/Phuket4189/item-retrieval-template-1.21.10" target="_blank" class="link-button" data-animate>
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
                <path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22"></path>
              </svg>
              <span>GitHub</span>
              <span class="badge">源码仓库</span>
            </a>
          </div>
        </template>
      </div>
    </div>
  </div>
</template>

<style scoped>
[data-animate] {
  opacity: 0;
  transform: translateY(20px);
}

[data-animate].animated {
  opacity: 1;
  transform: translateY(0);
}

.ir-page {
  min-height: 100vh;
}

.ir-hero {
  width: 100vw;
  min-width: 100vw;
  margin-left: calc(50% - 50vw);
  height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(180deg, #e8f5e9 0%, #f5f5fa 100%);
  position: relative;
  overflow: hidden;
}

.glass-blob {
  position: absolute;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.3);
  backdrop-filter: blur(20px);
  -webkit-backdrop-filter: blur(20px);
  border: 1px solid rgba(255, 255, 255, 0.5);
  box-shadow: inset 0 0 30px rgba(255, 255, 255, 0.3);
  z-index: 1;
  pointer-events: none;
}

.blob-1 {
  width: 320px;
  height: 320px;
  top: 5%;
  left: 2%;
  animation: float 8s ease-in-out infinite;
}

.blob-2 {
  width: 260px;
  height: 260px;
  top: 55%;
  right: 5%;
  animation: float 10s ease-in-out infinite 1s;
}

.blob-3 {
  width: 300px;
  height: 300px;
  bottom: 5%;
  left: 10%;
  animation: float 12s ease-in-out infinite 2s;
}

.blob-4 {
  width: 240px;
  height: 240px;
  top: 25%;
  right: 2%;
  animation: float 9s ease-in-out infinite 0.5s;
}

@keyframes float {
  0%, 100% {
    transform: translateY(0px) translateX(0px);
  }
  25% {
    transform: translateY(-30px) translateX(15px);
  }
  50% {
    transform: translateY(-50px) translateX(-10px);
  }
  75% {
    transform: translateY(-20px) translateX(20px);
  }
}

.hero-content {
  text-align: center;
  padding: 2rem;
  min-width: 320px;
  position: relative;
  z-index: 10;
}

.hero-content[data-animate].animated {
  animation: slideInDown 0.8s ease-out;
}

@keyframes slideInDown {
  from {
    opacity: 0;
    transform: translateY(-40px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.hero-title {
  font-size: 3.2rem;
  margin: 0 0 0.5rem;
  font-weight: 800;
  letter-spacing: 2px;
  color: #1b4332;
  text-shadow: 0 2px 16px rgba(46, 204, 113, 0.25);
}

.hero-content[data-animate].animated .hero-title {
  animation: slideInDown 0.8s ease-out 0.1s both;
}

.hero-subtitle {
  margin: 0 0 1.25rem;
  color: #2d6a4f;
  font-size: 1.25rem;
  letter-spacing: 1px;
}

.hero-content[data-animate].animated .hero-subtitle {
  animation: slideInDown 0.8s ease-out 0.2s both;
}

.hero-tags {
  display: flex;
  justify-content: center;
  gap: 0.75rem;
  flex-wrap: wrap;
  margin-top: 1.5rem;
}

.hero-content[data-animate].animated .hero-tags {
  animation: slideInUp 0.8s ease-out 0.3s both;
}

@keyframes slideInUp {
  from {
    opacity: 0;
    transform: translateY(40px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.tag {
  background: rgba(46, 204, 113, 0.15);
  color: #27ae60;
  padding: 0.5rem 1rem;
  border-radius: 8px;
  font-size: 0.9rem;
  font-weight: 600;
}

.ir-main {
  max-width: 1200px;
  margin: 0 auto;
  padding: 3rem 2rem;
}

.ir-intro {
  display: grid;
  grid-template-columns: 1fr auto;
  gap: 3rem;
  margin-bottom: 4rem;
  align-items: center;
}

.ir-intro[data-animate].animated {
  animation: slideInUp 0.8s ease-out 0.6s both;
}

.intro-text h2 {
  font-size: 2rem;
  font-weight: 700;
  margin: 0 0 1rem 0;
  color: #1e293b;
}

.intro-text p {
  font-size: 1.1rem;
  color: #64748b;
  line-height: 1.8;
  margin: 0;
}

.intro-stats {
  display: flex;
  gap: 2rem;
}

.stat-item {
  text-align: center;
  min-width: 100px;
}

.ir-intro[data-animate].animated .stat-item {
  animation: slideInUp 0.8s ease-out both;
}

.ir-intro[data-animate].animated .stat-item:nth-child(1) { animation-delay: 0.7s; }
.ir-intro[data-animate].animated .stat-item:nth-child(2) { animation-delay: 0.8s; }
.ir-intro[data-animate].animated .stat-item:nth-child(3) { animation-delay: 0.9s; }

.stat-number {
  font-size: 2.5rem;
  font-weight: 700;
  color: #27ae60;
  margin-bottom: 0.25rem;
}

.stat-label {
  font-size: 0.9rem;
  color: #64748b;
  font-weight: 500;
}

.ir-features {
  margin-bottom: 4rem;
}

.ir-features h2,
.ir-tech h2,
.ir-links h2,
.ir-readme h2 {
  font-size: 1.75rem;
  font-weight: 700;
  margin: 0 0 2rem 0;
  color: #1e293b;
}

h2[data-animate].animated {
  animation: slideInUp 0.8s ease-out 0.4s both;
}

.features-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(320px, 1fr));
  gap: 1.5rem;
}

.feature-card {
  background: white;
  border-radius: 12px;
  padding: 2rem;
  border: 1px solid #e2e8f0;
  transition: all 0.3s ease;
}

.feature-card[data-animate].animated {
  animation: slideInUp 0.8s ease-out both;
}

.feature-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 12px 24px rgba(0,0,0,0.1);
  border-color: #27ae60;
}

.feature-icon {
  width: 56px;
  height: 56px;
  background: linear-gradient(135deg, #2ecc71 0%, #27ae60 100%);
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 1.25rem;
}

.feature-icon svg {
  width: 28px;
  height: 28px;
  color: white;
}

.feature-card h3 {
  font-size: 1.25rem;
  font-weight: 600;
  margin: 0 0 0.75rem 0;
  color: #1e293b;
}

.feature-card p {
  font-size: 0.95rem;
  color: #64748b;
  line-height: 1.6;
  margin: 0;
}

.ir-tech {
  margin-bottom: 4rem;
}

.tech-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
  gap: 1rem;
}

.tech-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  background: white;
  padding: 1.25rem 1.5rem;
  border-radius: 10px;
  border: 1px solid #e2e8f0;
}

.tech-item[data-animate].animated {
  animation: slideInUp 0.8s ease-out both;
}

.tech-label {
  font-size: 0.95rem;
  color: #64748b;
  font-weight: 500;
}

.tech-value {
  font-size: 0.95rem;
  color: #1e293b;
  font-weight: 600;
}

.tech-value.active {
  color: #27ae60;
}

.tech-value.planning {
  color: #f59e0b;
}

.ir-readme {
  margin-bottom: 4rem;
}

.readme-content {
  background: white;
  border-radius: 12px;
  padding: 2.5rem;
  border: 1px solid #e2e8f0;
  line-height: 1.8;
  color: #1e293b;
}

.readme-content :deep(h1) {
  font-size: 2rem;
  font-weight: 700;
  margin: 0 0 1.5rem 0;
  color: #1e293b;
  border-bottom: 2px solid #e2e8f0;
  padding-bottom: 0.75rem;
}

.readme-content :deep(h2) {
  font-size: 1.5rem;
  font-weight: 600;
  margin: 2rem 0 1rem 0;
  color: #1e293b;
}

.readme-content :deep(h3) {
  font-size: 1.25rem;
  font-weight: 600;
  margin: 1.5rem 0 0.75rem 0;
  color: #1e293b;
}

.readme-content :deep(p) {
  margin: 0 0 1rem 0;
  color: #475569;
}

.readme-content :deep(ul),
.readme-content :deep(ol) {
  margin: 0 0 1rem 0;
  padding-left: 1.5rem;
}

.readme-content :deep(li) {
  margin: 0.25rem 0;
  color: #475569;
}

.readme-content :deep(code) {
  background: #f1f5f9;
  padding: 0.2rem 0.4rem;
  border-radius: 4px;
  font-size: 0.9em;
  color: #c7254e;
}

.readme-content :deep(pre) {
  background: #1e293b;
  color: #e2e8f0;
  padding: 1.25rem;
  border-radius: 8px;
  overflow-x: auto;
  margin: 0 0 1rem 0;
}

.readme-content :deep(pre code) {
  background: transparent;
  color: inherit;
  padding: 0;
}

.readme-content :deep(table) {
  width: 100%;
  border-collapse: collapse;
  margin: 0 0 1rem 0;
}

.readme-content :deep(th),
.readme-content :deep(td) {
  border: 1px solid #e2e8f0;
  padding: 0.75rem;
  text-align: left;
}

.readme-content :deep(th) {
  background: #f8fafc;
  font-weight: 600;
  color: #1e293b;
}

.readme-content :deep(tr:nth-child(even)) {
  background: #f8fafc;
}

.readme-content :deep(img) {
  max-width: 100%;
  border-radius: 8px;
  margin: 1rem 0;
}

.readme-content :deep(blockquote) {
  border-left: 4px solid #27ae60;
  margin: 0 0 1rem 0;
  padding: 0.5rem 1rem;
  background: #f0fdf4;
  border-radius: 0 8px 8px 0;
}

.readme-content :deep(a) {
  color: #2563eb;
  text-decoration: none;
}

.readme-content :deep(a:hover) {
  text-decoration: underline;
}

.ir-links {
  margin-bottom: 2rem;
}

.links-container {
  display: flex;
  gap: 1rem;
  flex-wrap: wrap;
}

.link-button {
  display: inline-flex;
  align-items: center;
  gap: 0.75rem;
  padding: 1rem 1.5rem;
  background: #27ae60;
  color: white;
  border-radius: 10px;
  text-decoration: none;
  font-weight: 600;
  font-size: 1rem;
  transition: all 0.3s ease;
  position: relative;
}

.link-button[data-animate].animated {
  animation: slideInUp 0.8s ease-out 0.2s both;
}

.link-button svg {
  width: 20px;
  height: 20px;
}

.link-button:hover {
  background: #219a52;
  transform: translateY(-2px);
  box-shadow: 0 8px 16px rgba(39, 174, 96, 0.3);
}

.badge {
  background: rgba(255,255,255,0.2);
  padding: 0.25rem 0.75rem;
  border-radius: 6px;
  font-size: 0.8rem;
  font-weight: 500;
}

.lazy-placeholder {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 4rem 2rem;
  min-height: 300px;
  text-align: center;
}

.lazy-placeholder .spinner {
  display: inline-block;
  width: 40px;
  height: 40px;
  border: 4px solid #e0e7ff;
  border-top-color: #27ae60;
  border-radius: 50%;
  animation: spin 0.8s linear infinite;
  margin-bottom: 1rem;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}

.lazy-placeholder p {
  color: #64748b;
  font-size: 1rem;
}

@media (max-width: 768px) {
  .hero-title {
    font-size: 2rem;
  }

  .hero-subtitle {
    font-size: 1rem;
  }

  .ir-intro {
    grid-template-columns: 1fr;
    gap: 2rem;
  }

  .intro-stats {
    justify-content: center;
  }

  .features-grid {
    grid-template-columns: 1fr;
  }

  .tech-grid {
    grid-template-columns: 1fr;
  }

  .links-container {
    flex-direction: column;
  }

  .link-button {
    justify-content: center;
  }

  .readme-content {
    padding: 1.5rem;
  }
}
</style>
