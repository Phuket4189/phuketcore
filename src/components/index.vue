<template>
  <div class="home">
    <section class="hero">
      <div class="glass-blob blob-1"></div>
      <div class="glass-blob blob-2"></div>
      <div class="glass-blob blob-3"></div>
      <div class="glass-blob blob-4"></div>
      <div class="hero-content">
        <transition-group name="fadeup" tag="div">
          <h1 v-if="showHero" key="h1">PhuketCore</h1>
          <p class="subtitle" v-if="showHero" key="subtitle">编程玩家个人博客</p>
          <button class="down" v-if="showHero" key="down" @click="scrollToIntro" aria-label="Scroll to intro">⤓</button>
        </transition-group>
      </div>
    </section>

    <section id="intro" ref="introRef" :class="['intro', { visible: visible }]">
      <div class="intro-inner">
        <h2>我的世界BSL启动器</h2>
        <div class="project-card">
          <div class="project-header">
            <span class="project-badge">工具</span>
            <h3>BSL启动器</h3>
          </div>
          <p class="project-desc">BSL（Block Server Launcher）启动器是一个为《我的世界》玩家打造的一键式开服与管理工具，支持快速搭建本地/局域网/公网服务器，适合小白和进阶玩家。</p>
          <ul class="project-features">
            <li>一键下载与部署服务端，自动配置端口与参数</li>
            <li>支持多种服务端类型（原版、Forge、Fabric等）</li>
            <li>内置插件/模组管理，自动备份与还原</li>
            <li>简洁UI，开服、关服、日志查看一站式完成</li>
            <li>支持自定义脚本与高级参数</li>
          </ul>
          <div class="project-meta">
            <span>技术栈：Python、pyqt6</span>
          </div>
          <router-link class="project-link" to="/project/bsl">了解更多 &rarr;</router-link>
          <!-- https://github.com/Phuket4189/BSL -->
        </div>
      </div>

      <div class="intro-inner">
        <h2>items-retrieval</h2>
        <div class="project-card">
          <div class="project-header">
            <span class="project-badge">工具</span>
            <h3>items-retrieval</h3>
          </div>
          <p class="project-desc">items-retrieval 是一个《我的世界》物品检索工具，帮助玩家快速查找和管理游戏中的物品。</p>
          <ul class="project-features">
            <li>快速查找游戏中的物品</li>
            <li>支持多个物品分类的查找</li>
            <li>内置物品检索范围设置，方便玩家调整宿舍容器的半径范围</li>
            <li>简洁UI，操作直观易用</li>
          </ul>
          <div class="project-meta">
            <span>技术栈：Java</span>
          </div>
          <router-link class="project-link" to="/project/items-retrieval">了解更多 &rarr;</router-link>
          <!-- https://github.com/Phuket4189/items-retrieval -->
        </div>
      </div>
      
    </section>
    <p class="footer-info">
      © 2026 PhuketCore.&nbsp;&nbsp;
      <!-- https://beian.miit.gov.cn/#/Integrated/index -->
       <a href="https://beian.miit.gov.cn/#/Integrated/index" rel="noreferrer" target="_blank">湘ICP备2026005726号-1</a>
       &nbsp;&nbsp;
       <img src="/备案图标.png" alt="备案图标" style="width: 20px; height: 20px; vertical-align: middle;">
      <a href="https://beian.mps.gov.cn/#/query/webSearch?code=43010302002236" rel="noreferrer" target="_blank">湘公网安备43010302002236号</a>
    </p>
  </div>
</template>

<script setup>
import { ref, onMounted, onBeforeUnmount } from 'vue'

const introRef = ref(null)
const visible = ref(false)
const showHero = ref(false)

function scrollToIntro() {
  const el = document.getElementById('intro')
  if (el) el.scrollIntoView({ behavior: 'smooth' })
}

let io = null
onMounted(() => {
  // 页面挂载时滚动到顶部
  window.scrollTo(0, 0)
  
  // 首页 hero 聚合渐显效果
  setTimeout(() => { showHero.value = true }, 200)

  const el = introRef.value
  if ('IntersectionObserver' in window && el) {
    io = new IntersectionObserver((entries) => {
      entries.forEach(e => {
        if (e.isIntersecting) visible.value = true
      })
    }, { threshold: 0.2 })
    io.observe(el)
  } else {
    visible.value = true
  }
})

onBeforeUnmount(() => {
  if (io && introRef.value) io.disconnect()
})
</script>

<style scoped>

.home {
  color: var(--text-primary);
  padding-bottom: 2.5rem;
}
.hero {
  width: 100vw;
  min-width: 100vw;
  margin-left: calc(50% - 50vw);
  height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background:
    radial-gradient(circle at 18% 22%, rgba(255,255,255,0.82), transparent 0, transparent 26%),
    radial-gradient(circle at 82% 18%, rgba(115, 137, 255, 0.18), transparent 24%),
    linear-gradient(180deg, #f8f9fd 0%, #eef2f8 56%, #e8edf6 100%);
  position: relative;
  overflow: hidden;
}

.glass-blob {
  position: absolute;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.28);
  backdrop-filter: blur(28px);
  -webkit-backdrop-filter: blur(28px);
  border: 1px solid rgba(255, 255, 255, 0.65);
  box-shadow: 0 28px 60px rgba(96, 112, 146, 0.12), inset 0 1px 0 rgba(255,255,255,0.9);
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
  padding: 2.5rem;
  min-width: 320px;
  position: relative;
  z-index: 5;
}
.hero h1 {
  font-size: clamp(3rem, 7vw, 5.6rem);
  margin: 0 0 0.9rem;
  font-weight: 800;
  letter-spacing: -0.05em;
  color: #1a2235;
  text-shadow: 0 16px 40px rgba(90, 106, 146, 0.12);
}
.subtitle {
  margin: 0 0 1.6rem;
  color: var(--text-secondary);
  font-size: 1.1rem;
  letter-spacing: 0.08em;
  text-transform: uppercase;
}
.down {
  width: 60px;
  height: 60px;
  border-radius: 999px;
  border: 1px solid rgba(73, 93, 138, 0.16);
  background: rgba(255,255,255,0.78);
  color: #20304f;
  font-size: 1.5rem;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 18px 34px rgba(27, 39, 60, 0.1);
  transition: background 0.2s, box-shadow 0.2s, transform 0.2s;
}
.down:hover {
  background: rgba(255,255,255,0.96);
  box-shadow: 0 22px 42px rgba(27, 39, 60, 0.14);
  transform: translateY(-2px);
}

/* 聚合渐显动画 */
.fadeup-enter-active, .fadeup-leave-active {
  transition: all 0.7s cubic-bezier(.2,.9,.3,1);
}
.fadeup-enter-from {
  opacity: 0;
  transform: translateY(40px) scale(0.96);
}
.fadeup-enter-to {
  opacity: 1;
  transform: translateY(0) scale(1);
}
.fadeup-leave-from {
  opacity: 1;
  transform: translateY(0) scale(1);
}
.fadeup-leave-to {
  opacity: 0;
  transform: translateY(40px) scale(0.96);
}

.intro {
  padding: 5rem 1.5rem 2rem;
  max-width: 1080px;
  margin: 0 auto;
  opacity: 0; transform: translateY(24px); transition: all 0.6s cubic-bezier(.2,.9,.3,1);
  text-align: left;
}
.intro.visible { opacity: 1; transform: translateY(0); }

.intro-inner {
  background: var(--bg-panel-strong);
  padding: 2.6rem;
  border-radius: var(--radius-lg);
  box-shadow: var(--shadow-soft), var(--shadow-inset);
  min-height: 320px;
  margin-bottom: 1.5rem;
  border: 1px solid var(--border-soft);
  backdrop-filter: blur(12px);
}
.intro h2 {
  margin-top: 0;
  font-size: 2.1rem;
  font-weight: 700;
  letter-spacing: -0.03em;
  color: var(--text-primary);
  margin-bottom: 1.8rem;
}

.project-card {
  background: linear-gradient(180deg, rgba(255,255,255,0.96), rgba(243,246,252,0.98));
  border-radius: 22px;
  box-shadow: 0 18px 36px rgba(24, 33, 47, 0.08);
  padding: 2rem 1.6rem 1.7rem;
  margin-bottom: 0;
  transition: box-shadow .2s, transform .2s;
  border: 1px solid rgba(103, 120, 152, 0.14);
}
.project-card:hover {
  box-shadow: 0 24px 44px rgba(24, 33, 47, 0.12);
  transform: translateY(-3px);
}
.project-header {
  display: flex;
  align-items: center;
  gap: 1rem;
  margin-bottom: 0.5rem;
}
.project-badge {
  display: inline-block;
  background: rgba(49, 70, 208, 0.1);
  color: var(--brand);
  font-size: 0.78rem;
  border-radius: 999px;
  padding: 0.3em 0.9em;
  font-weight: 600;
  letter-spacing: 0.08em;
}
.project-header h3 {
  margin: 0;
  font-size: 1.45rem;
  font-weight: 700;
  color: var(--text-primary);
}
.project-desc {
  margin: 0.5rem 0 1.2rem 0;
  color: var(--text-secondary);
  font-size: 1.02rem;
  line-height: 1.85;
}
.project-features {
  margin: 0 0 1.2rem 1.2rem;
  padding: 0;
  color: var(--text-primary);
  font-size: 0.98rem;
  list-style: disc;
}
.project-features li {
  margin: 0.48rem 0;
  line-height: 1.7;
}
.project-meta {
  font-size: 0.95rem;
  color: var(--text-muted);
  margin-bottom: 1.1rem;
}
.project-link {
  display: inline-block;
  color: var(--brand);
  font-weight: 600;
  border-bottom: 1px solid rgba(49, 70, 208, 0.18);
  padding-bottom: 2px;
  transition: color .2s, border-color .2s;
}
.project-link:hover {
  color: var(--brand-strong);
  border-bottom-color: var(--brand-strong);
}

.footer-info {
  max-width: 1080px;
  margin: 0 auto;
  padding: 0 1.5rem;
  color: var(--text-muted);
  font-size: 0.92rem;
  line-height: 1.8;
}

.footer-info a {
  color: inherit;
  transition: all 0.2s ease;
}

.footer-info a:hover {
  text-decoration: underline;
}

@media (max-width: 900px) {
  .hero {
    height: 84vh;
    min-height: 680px;
  }

  .intro {
    padding-top: 3rem;
  }

  .intro-inner {
    padding: 1.6rem 1.2rem;
  }

  .project-header {
    flex-direction: column;
    align-items: flex-start;
    gap: 0.5rem;
  }
}
</style>
