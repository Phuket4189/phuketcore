<script setup>
import { onMounted, onBeforeUnmount, ref, nextTick } from 'vue'

let observers = []
let animateObserver // keep reference so we can reuse when lazy sections load

// 懒加载状态
const featuresLoaded = ref(false)
const usersLoaded = ref(false)
const techLoaded = ref(false)
const linksLoaded = ref(false)

onMounted(() => {
  // 页面挂载时滚动到顶部，确保用户能看到标题
  window.scrollTo(0, 0)
  
  // 动画监听器
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
  
  // 懒加载监听器
  const lazyLoadObserverOptions = {
    threshold: 0.01,
    rootMargin: '100px'
  }
  
  const lazyObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const target = entry.target
        // when a section becomes visible we mark it loaded and start observing its animation elements
        if (target.dataset.lazyLoad === 'features') {
          featuresLoaded.value = true
          nextTick(() => {
            target.querySelectorAll('[data-animate]').forEach(el => animateObserver.observe(el))
          })
          lazyObserver.unobserve(target)
        } else if (target.dataset.lazyLoad === 'users') {
          usersLoaded.value = true
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

onBeforeUnmount(() => {
  // 清理观察器
  observers.forEach(observer => observer.disconnect())
  observers = []
})
</script>


<template>
  <div class="bsl-page">
    <div class="bsl-hero">
      <!-- 背景悬浮玻璃圆饼装饰 -->
      <div class="glass-blob blob-1"></div>
      <div class="glass-blob blob-2"></div>
      <div class="glass-blob blob-3"></div>
      <div class="glass-blob blob-4"></div>
      
      <div class="hero-content" data-animate>
        <h1 class="hero-title">BlockServerLauncher</h1>
        <p class="hero-subtitle">一体化 Minecraft 服务器管理启动器</p>
        <div class="hero-tags">
          <span class="tag">Python</span>
          <span class="tag">PySide6</span>
          <span class="tag">跨平台</span>
          <span class="tag">开源</span>
        </div>
      </div>
    </div>

    <div class="bsl-main">
      <div class="bsl-intro" data-animate>
        <div class="intro-text">
          <h2>项目概述</h2>
          <p>BSL 是一款功能强大、用户友好的 Minecraft 服务器启动器，填补客户端启动器和服务器面板之间的市场空白。采用现代化 GUI 设计，集成内网穿透、性能监控、Mod 管理等核心功能，为个人用户和小型服务器提供专业级的管理体验。</p>
        </div>
        <div class="intro-stats">
          <div class="stat-item">
            <div class="stat-number">10+</div>
            <div class="stat-label">功能模块</div>
          </div>
          <div class="stat-item">
            <div class="stat-number">72</div>
            <div class="stat-label">细分功能</div>
          </div>
          <div class="stat-item">
            <div class="stat-number">3</div>
            <div class="stat-label">支持平台</div>
          </div>
        </div>
      </div>

      <div class="bsl-features" data-lazy-load="features">
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
                <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z"></path>
              </svg>
            </div>
            <h3>一键开服</h3>
            <p>自动检测 Java 版本，下载服务端 JAR，生成配置文件，快速启动服务器</p>
          </div>
          <div class="feature-card" data-animate>
            <div class="feature-icon">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
                <circle cx="12" cy="12" r="10"></circle>
                <line x1="2" y1="12" x2="22" y2="12"></line>
                <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"></path>
              </svg>
            </div>
            <h3>内网穿透</h3>
            <p>内置 FRP 内网穿透，一键配置端口映射，无需公网 IP 即可让好友访问</p>
          </div>
          <div class="feature-card" data-animate>
            <div class="feature-icon">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
                <line x1="18" y1="20" x2="18" y2="10"></line>
                <line x1="12" y1="20" x2="12" y2="4"></line>
                <line x1="6" y1="20" x2="6" y2="14"></line>
              </svg>
            </div>
            <h3>性能监控</h3>
            <p>实时监控 CPU、内存、磁盘、网络使用情况，提供性能评分和优化建议</p>
          </div>
          <div class="feature-card" data-animate>
            <div class="feature-icon">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
                <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"></path>
                <polyline points="3.27 6.96 12 12.01 20.73 6.96"></polyline>
                <line x1="12" y1="22.08" x2="12" y2="12"></line>
              </svg>
            </div>
            <h3>Mod 管理</h3>
            <p>集成 CurseForge 和 Modrinth API，支持 Mod 搜索、下载、安装、依赖管理</p>
          </div>
          <div class="feature-card" data-animate>
            <div class="feature-icon">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
                <circle cx="12" cy="12" r="3"></circle>
                <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"></path>
              </svg>
            </div>
            <h3>配置管理</h3>
            <p>可视化编辑 server.properties，配置模板、备份恢复、历史记录功能</p>
          </div>
          <div class="feature-card" data-animate>
            <div class="feature-icon">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
                <polyline points="4 17 10 11 4 5"></polyline>
                <line x1="12" y1="19" x2="20" y2="19"></line>
              </svg>
            </div>
            <h3>控制台</h3>
            <p>实时日志显示，颜色区分，命令输入，日志搜索过滤和导出</p>
          </div>
        </div>
        </template>
      </div>

      <div class="bsl-users" data-lazy-load="users">
        <div v-if="!usersLoaded" class="lazy-placeholder">
          <div class="spinner"></div>
          <p>加载中...</p>
        </div>
        <template v-else>
        <h2 data-animate>目标用户</h2>
        <div class="users-list">
          <div class="user-item" data-animate>
            <div class="user-icon">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                <circle cx="12" cy="7" r="4"></circle>
              </svg>
            </div>
            <div class="user-content">
              <h3>个人服务器用户</h3>
              <p>降低技术门槛，一键开服，自动化配置，实时监控</p>
            </div>
          </div>
          <div class="user-item" data-animate>
            <div class="user-icon">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
                <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
                <circle cx="9" cy="7" r="4"></circle>
                <path d="M23 21v-2a4 4 0 0 0-3-3.87"></path>
                <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
              </svg>
            </div>
            <div class="user-content">
              <h3>小型服务器管理员</h3>
              <p>专业级功能，零成本部署，多服务器支持，性能监控</p>
            </div>
          </div>
          <div class="user-item" data-animate>
            <div class="user-icon">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
                <rect x="2" y="3" width="20" height="14" rx="2" ry="2"></rect>
                <line x1="8" y1="21" x2="16" y2="21"></line>
                <line x1="12" y1="17" x2="12" y2="21"></line>
              </svg>
            </div>
            <div class="user-content">
              <h3>Mod 服务器运营者</h3>
              <p>简化 Mod 管理，自动处理依赖，提高更新效率</p>
            </div>
          </div>
          <div class="user-item" data-animate>
            <div class="user-icon">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
                <polyline points="16 18 22 12 16 6"></polyline>
                <polyline points="8 6 2 12 8 18"></polyline>
              </svg>
            </div>
            <div class="user-content">
              <h3>测试和开发者</h3>
              <p>快速部署测试环境，配置灵活，日志查看方便</p>
            </div>
          </div>
        </div>
      </template>
      </div>

      <div class="bsl-tech" data-lazy-load="tech">
        <div v-if="!techLoaded" class="lazy-placeholder">
          <div class="spinner"></div>
          <p>加载中...</p>
        </div>
        <template v-else>
        <h2 data-animate>技术栈</h2>
        <div class="tech-grid">
          <div class="tech-item" data-animate>
            <div class="tech-label">开发语言</div>
            <div class="tech-value">Python</div>
          </div>
          <div class="tech-item" data-animate>
            <div class="tech-label">GUI 框架</div>
            <div class="tech-value">PySide6 (Qt6)</div>
          </div>
          <div class="tech-item" data-animate>
            <div class="tech-label">目标平台</div>
            <div class="tech-value">Windows / Linux / macOS</div>
          </div>
          <div class="tech-item" data-animate>
            <div class="tech-label">项目状态</div>
            <div class="tech-value planning">长期开发阶段</div>
          </div>
        </div>
      </template>
      </div>

      <div class="bsl-links" data-lazy-load="links">
        <div v-if="!linksLoaded" class="lazy-placeholder">
          <div class="spinner"></div>
          <p>加载中...</p>
        </div>
        <template v-else>
        <h2 data-animate>相关链接</h2>
        <div class="links-container">
          <a href="#" class="link-button" data-animate>
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
              <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"></path>
              <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"></path>
            </svg>
            <span>项目文档</span>
          </a>
          <a href="https://github.com/Phuket4189/BSL" target="_blank" class="link-button" data-animate>
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
              <path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22"></path>
            </svg>
            <span>GitHub</span>
            <span class="badge">BSL</span>
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
  /* optionally offset for upward animation */
  transform: translateY(20px);
}

[data-animate].animated {
  opacity: 1;
  transform: translateY(0);
}

.bsl-page {
  min-height: 100vh;
}

.bsl-hero {
  width: 100vw;
  min-width: 100vw;
  margin-left: calc(50% - 50vw);
  height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(180deg, #e3eafe 0%, #f5f5fa 100%);
  position: relative;
  overflow: hidden;
}

/* 玻璃质感悬浮圆饼装饰 */
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
  color: #2d3748;
  text-shadow: 0 2px 16px #b6c6e6aa;
}

.hero-content[data-animate].animated .hero-title {
  animation: slideInDown 0.8s ease-out 0.1s both;
}

.hero-subtitle {
  margin: 0 0 1.25rem;
  color: #4a5568;
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
  background: rgba(59, 130, 246, 0.15);
  color: #3b82f6;
  padding: 0.5rem 1rem;
  border-radius: 8px;
  font-size: 0.9rem;
  font-weight: 600;
}

.bsl-main {
  max-width: 1200px;
  margin: 0 auto;
  padding: 3rem 2rem;
}

.bsl-intro {
  display: grid;
  grid-template-columns: 1fr auto;
  gap: 3rem;
  margin-bottom: 4rem;
  align-items: center;
}

.bsl-intro[data-animate].animated {
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

.bsl-intro[data-animate].animated .stat-item {
  animation: slideInUp 0.8s ease-out both;
}

.bsl-intro[data-animate].animated .stat-item:nth-child(1) { animation-delay: 0.7s; }
.bsl-intro[data-animate].animated .stat-item:nth-child(2) { animation-delay: 0.8s; }
.bsl-intro[data-animate].animated .stat-item:nth-child(3) { animation-delay: 0.9s; }

.stat-number {
  font-size: 2.5rem;
  font-weight: 700;
  color: #3b82f6;
  margin-bottom: 0.25rem;
}

.stat-label {
  font-size: 0.9rem;
  color: #64748b;
  font-weight: 500;
}

.bsl-features {
  margin-bottom: 4rem;
}

.bsl-features h2,
.bsl-users h2,
.bsl-tech h2,
.bsl-links h2 {
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
  border-color: #3b82f6;
}

.feature-icon {
  width: 56px;
  height: 56px;
  background: linear-gradient(135deg, #3b82f6 0%, #2563eb 100%);
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

.bsl-users {
  margin-bottom: 4rem;
}

.users-list {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 1.5rem;
}

.user-item {
  display: flex;
  gap: 1rem;
  background: white;
  border-radius: 12px;
  padding: 1.5rem;
  border: 1px solid #e2e8f0;
  transition: all 0.3s ease;
}

.user-item[data-animate].animated {
  animation: slideInUp 0.8s ease-out both;
}


.user-item:hover {
  border-color: #3b82f6;
  box-shadow: 0 8px 16px rgba(0,0,0,0.06);
}

.user-icon {
  width: 48px;
  height: 48px;
  background: #f1f5f9;
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.user-icon svg {
  width: 24px;
  height: 24px;
  color: #64748b;
}

.user-content h3 {
  font-size: 1.1rem;
  font-weight: 600;
  margin: 0 0 0.5rem 0;
  color: #1e293b;
}

.user-content p {
  font-size: 0.9rem;
  color: #64748b;
  line-height: 1.5;
  margin: 0;
}

.bsl-tech {
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

.tech-value.planning {
  color: #f59e0b;
}

.bsl-links {
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
  background: #3b82f6;
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
  background: #2563eb;
  transform: translateY(-2px);
  box-shadow: 0 8px 16px rgba(59, 130, 246, 0.3);
}

.link-button.disabled {
  background: #94a3b8;
  cursor: not-allowed;
}

.link-button.disabled:hover {
  background: #94a3b8;
  transform: none;
  box-shadow: none;
}

.badge {
  background: rgba(255,255,255,0.2);
  padding: 0.25rem 0.75rem;
  border-radius: 6px;
  font-size: 0.8rem;
  font-weight: 500;
}

/* 懒加载占位符样式 */
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
  border-top-color: #3b82f6;
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
  
  .bsl-intro {
    grid-template-columns: 1fr;
    gap: 2rem;
  }
  
  .intro-stats {
    justify-content: center;
  }
  
  .features-grid {
    grid-template-columns: 1fr;
  }
  
  .users-list {
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
}
</style>
