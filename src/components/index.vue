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

const props = defineProps({ msg: { type: String, default: '你好! PhuketCore' } })
const count = ref(0)

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

.home { color: #222; }
.hero {
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
}
.hero h1 {
  font-size: 3.2rem;
  margin: 0 0 0.5rem;
  font-weight: 800;
  letter-spacing: 2px;
  color: #2d3748;
  text-shadow: 0 2px 16px #b6c6e6aa;
}
.subtitle {
  margin: 0 0 1.25rem;
  color: #4a5568;
  font-size: 1.25rem;
  letter-spacing: 1px;
}
.down {
  width: 56px;
  height: 56px;
  border-radius: 999px;
  border: none;
  background: linear-gradient(135deg, #2563eb 60%, #60a5fa 100%);
  color: #fff;
  cursor: pointer;
  font-size: 1.5rem;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 2px 12px #2563eb33;
  transition: background 0.2s, box-shadow 0.2s;
}
.down:hover {
  background: linear-gradient(135deg, #1d4ed8 60%, #3b82f6 100%);
  box-shadow: 0 4px 24px #2563eb44;
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
  padding: 4rem 1.5rem;
  max-width: 900px;
  margin: 0 auto;
  opacity: 0; transform: translateY(24px); transition: all 0.6s cubic-bezier(.2,.9,.3,1);
  text-align: left;
}
.intro.visible { opacity: 1; transform: translateY(0); }

.intro-inner {
  background: #fff;
  padding: 2.5rem 2rem 2rem 2rem;
  border-radius: 16px;
  box-shadow: 0 12px 32px rgba(16,24,40,0.08);
  min-height: 320px;
}
.intro h2 {
  margin-top: 0;
  font-size: 2rem;
  font-weight: 700;
  letter-spacing: 0.02em;
  color: #1a2233;
  margin-bottom: 2rem;
}

.project-card {
  background: linear-gradient(120deg, #f5f7fa 60%, #e9f0ff 100%);
  border-radius: 12px;
  box-shadow: 0 4px 16px rgba(80,120,200,0.08);
  padding: 2rem 1.5rem 1.5rem 1.5rem;
  margin-bottom: 1.5rem;
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

.footer-info a {
  color: inherit;
  text-decoration: none;
  transition: all 0.2s ease;
}

.footer-info a:hover {
  text-decoration: underline;
}

@media (min-width: 900px) {
  .hero h1 { font-size: 4rem; }
  .intro { padding: 6rem 1.5rem; }
}
</style>