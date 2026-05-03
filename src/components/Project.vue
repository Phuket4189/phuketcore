<template>
  <div class="project-page page-enter">
    <section class="project-hero">
      <div class="glass-blob blob-1"></div>
      <div class="glass-blob blob-2"></div>
      <div class="glass-blob blob-3"></div>
      <div class="glass-blob blob-4"></div>
      <div class="hero-content" data-animate>
        <h1 class="hero-title">项目列表</h1>
        <p class="hero-subtitle">探索我的开源项目与工具集合</p>
      </div>
    </section>

    <section class="intro project-intro" id="project-intro">
      <div class="intro-inner project-intro-inner">
        <div class="intro-box project-card bsl-box" role="button" tabindex="0" @click="$router.push('/project/bsl')">
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
          <a href="#" @click.stop.prevent="$router.push('/project/bsl')" class="project-link">查看详情 &rarr;</a>
        </div>
        <div class="intro-box project-card items-retrieval-box" role="button" tabindex="0" @click="$router.push('/project/items-retrieval')">
          <div class="project-header">
            <span class="project-badge">Mod</span>
            <h3>Items Retrieval</h3>
          </div>
          <p class="project-desc">Minecraft 客户端物品检索辅助模组。打开检索面板后添加要查找的物品，点击执行附近检索或开启持续检索，即可查看附近命中容器并获得高亮与方向提示。</p>
          <ul class="project-features">
            <li>检索面板：按 U 键打开专属 GUI，可添加最多 128 种目标物品</li>
            <li>附近检索：按 O 键执行单次检索，扫描范围内的容器</li>
            <li>持续检索：开启后每 10 秒自动刷新，高亮持续显示</li>
            <li>高亮渲染：命中的容器以彩色方框高亮（可自定义颜色）</li>
            <li>方向指引：最多显示 6 条方向引导线，指向最近的命中容器</li>
            <li>结果分页：中央展示区支持翻页，浏览所有检索结果</li>
          </ul>
          <div class="project-meta">
            <span>技术栈：Java、Fabric | 状态：已完成</span>
          </div>
          <a href="#" @click.stop.prevent="$router.push('/project/items-retrieval')" class="project-link">查看详情 &rarr;</a>
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
import { onMounted, onBeforeUnmount, nextTick } from 'vue'

let boxObserver = null

onMounted(() => {
  window.scrollTo(0, 0)

  nextTick(() => {
    const page = document.querySelector('.page-enter')
    if (page) {
      const handler = () => page.classList.remove('page-enter')
      page.addEventListener('animationend', handler, { once: true })
    }

    const boxElements = document.querySelectorAll('.intro-box')
    if ('IntersectionObserver' in window && boxElements.length > 0) {
      boxObserver = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              entry.target.classList.add('box-visible')
              boxObserver.unobserve(entry.target)
            }
          })
        },
        { threshold: 0.1, rootMargin: '0px 0px -50px 0px' }
      )
      boxElements.forEach((el) => boxObserver.observe(el))
    }
  })
})

onBeforeUnmount(() => {
  if (boxObserver) {
    boxObserver.disconnect()
    boxObserver = null
  }
})
</script>

<style scoped>
.project-hero {
  width: 100vw;
  min-width: 100vw;
  margin-left: calc(50% - 50vw);
  height: 46vh;
  min-height: 340px;
  display: flex;
  align-items: center;
  justify-content: center;
  background:
    radial-gradient(circle at 22% 24%, rgba(255,255,255,0.84), transparent 22%),
    radial-gradient(circle at 78% 22%, rgba(113, 137, 255, 0.16), transparent 24%),
    linear-gradient(180deg, #f7f9fd 0%, #eef2f8 58%, #e8edf6 100%);
  position: relative;
  overflow: hidden;
}

.glass-blob {
  position: absolute;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.28);
  backdrop-filter: blur(24px);
  -webkit-backdrop-filter: blur(24px);
  border: 1px solid rgba(255, 255, 255, 0.68);
  box-shadow: 0 24px 52px rgba(80, 98, 136, 0.12), inset 0 1px 0 rgba(255, 255, 255, 0.9);
  z-index: 1;
  pointer-events: none;
}

.blob-1 {
  width: 280px;
  height: 280px;
  top: 5%;
  left: 2%;
  animation: float 8s ease-in-out infinite;
}

.blob-2 {
  width: 220px;
  height: 220px;
  top: 55%;
  right: 5%;
  animation: float 10s ease-in-out infinite 1s;
}

.blob-3 {
  width: 260px;
  height: 260px;
  bottom: 5%;
  left: 10%;
  animation: float 12s ease-in-out infinite 2s;
}

.blob-4 {
  width: 200px;
  height: 200px;
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

.hero-title {
  font-size: clamp(2.6rem, 5vw, 4.2rem);
  margin: 0 0 0.65rem;
  font-weight: 800;
  letter-spacing: -0.04em;
  color: var(--text-primary);
  text-shadow: 0 14px 34px rgba(90, 106, 146, 0.12);
}

.hero-subtitle {
  margin: 0;
  color: var(--text-secondary);
  font-size: 1.02rem;
  letter-spacing: 0.08em;
  text-transform: uppercase;
}

.intro.project-intro {
  padding: 3rem 1.5rem 2rem;
  max-width: 1080px;
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
  padding: 2.1rem;
  border-radius: 24px;
  background: linear-gradient(180deg, rgba(255,255,255,0.96), rgba(243,246,252,0.98));
  cursor: default;
  opacity: 0;
  transform: translateY(30px);
  transition: transform 0.2s, box-shadow 0.2s, opacity 0.2s;
  box-shadow: var(--shadow-soft), var(--shadow-inset);
  border: 1px solid var(--border-soft);
}

.intro-box.box-visible {
  animation: slideInUp 0.6s ease-out forwards;
}

.intro-box:nth-child(2).box-visible {
  animation-delay: 0.1s;
}

.intro-box:nth-child(3).box-visible {
  animation-delay: 0.2s;
}

@keyframes slideInUp {
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.intro-box:hover {
  transform: translateY(-4px);
  box-shadow: 0 28px 48px rgba(24, 33, 47, 0.12);
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

.items-retrieval-box {
  cursor: pointer;
  background: linear-gradient(180deg, rgba(249,255,252,0.98), rgba(239,247,243,0.96));
  border: 1px solid rgba(78, 143, 98, 0.16);
}

.items-retrieval-box:hover {
  box-shadow: 0 28px 48px rgba(31, 91, 52, 0.12);
}

.items-retrieval-box .project-badge {
  background: rgba(39, 174, 96, 0.1);
  color: #22774a;
}

.items-retrieval-box .project-link {
  color: #22774a;
  border-bottom-color: rgba(39, 174, 96, 0.16);
}

.items-retrieval-box .project-link:hover {
  color: #1b613c;
  border-bottom-color: #1b613c;
}

.other-box {
  background: linear-gradient(180deg, rgba(255,251,245,0.98), rgba(250,245,238,0.96));
  border: 1px solid rgba(168, 124, 69, 0.16);
}

.other-box .project-badge {
  background: rgba(197, 126, 27, 0.12);
  color: #9f6512;
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
  padding: 0.32em 0.92em;
  font-weight: 600;
  letter-spacing: 0.08em;
}

.project-header h3 {
  margin: 0;
  font-size: 1.42rem;
  font-weight: 700;
  color: var(--text-primary);
}

.project-desc {
  margin: 0.5rem 0 1.2rem 0;
  color: var(--text-secondary);
  font-size: 1rem;
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
  margin: 0.35rem 0;
  line-height: 1.5;
}

.project-meta {
  font-size: 0.95rem;
  color: var(--text-muted);
  margin-bottom: 1rem;
}

.project-link {
  display: inline-block;
  color: var(--brand);
  font-weight: 600;
  border-bottom: 1px solid rgba(49, 70, 208, 0.18);
  padding-bottom: 2px;
  transition: color .2s;
}

.project-link:hover {
  color: var(--brand-strong);
  border-bottom: 1px solid var(--brand-strong);
}

@media (max-width: 768px) {
  .hero-title {
    font-size: 2rem;
  }

  .hero-subtitle {
    font-size: 1rem;
  }

  .project-intro-inner {
    flex-direction: column;
  }

  .intro-box {
    padding: 1.5rem 1.2rem;
  }
}
</style>
