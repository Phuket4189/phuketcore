<script setup>
import { onMounted, ref } from 'vue'

const copyFeedback = ref('')
const email = '2473239542@qq.com'

async function copyEmail() {
  try {
    await navigator.clipboard.writeText(email)
    copyFeedback.value = '已复制邮箱'
    setTimeout(() => { copyFeedback.value = '' }, 2000)
  } catch (e) {
    console.error('复制失败:', e)
  }
}

onMounted(() => {
  // 页面挂载时滚动到顶部
  window.scrollTo(0, 0)
})
</script>


<template>
  <div class="about-container">
    <div class="about-card">
      <h2 class="about-title">关于</h2>
      <p class="about-desc">PhuketCore 是一个工具集合网站，也是个个人博客，包括 BSL 启动器、服务器管理工具等。</p>
      <p class="about-desc">这个项目的初衷是为了给我的一些工具提供一个展示和下载的平台，同时也记录一些开发日志和技术文章。未来可能会扩展更多内容，欢迎关注！</p>
      <p class="about-desc">关于这个名称Phuket，是由“不知道啊”演化而来的，就像“不知道啊=>不到啊=>布吉岛啊=>Phuket!!”</p>
      <p class="about-desc">如果你对这个项目感兴趣，或者有任何建议和反馈，欢迎通过以下方式联系我：</p>
      <ul class="about-list">
        <li>
          <span class="about-label">邮箱:</span>
          <span class="email-copy" @click="copyEmail" role="button" tabindex="0" :title="copyFeedback || '点击复制'">{{ email }}</span>
          <span v-if="copyFeedback" class="copy-feedback">{{ copyFeedback }}</span>
        </li>
        <li><span class="about-label">GitHub:</span> <a href="https://github.com/Phuket4189">Phuket</a></li>
      </ul>
    </div>
  </div>
</template>

<style scoped>
.about-container {
  display: flex;
  justify-content: center;
  align-items: flex-start;
  min-height: 60vh;
  padding: 3.5rem 1.5rem;
}

.about-card {
  background: var(--bg-panel-strong);
  border-radius: var(--radius-lg);
  border: 1px solid var(--border-soft);
  box-shadow: var(--shadow-medium), var(--shadow-inset);
  backdrop-filter: blur(14px);
  padding: 3rem;
  max-width: 760px;
  width: 100%;
  margin: 0 auto;
  animation: fadeIn 0.7s;
}

.about-title {
  font-size: 2.5rem;
  font-weight: 800;
  margin-bottom: 1.6rem;
  color: var(--text-primary);
  letter-spacing: -0.03em;
  text-align: left;
}

.about-desc {
  font-size: 1.02rem;
  color: var(--text-secondary);
  margin-bottom: 1.15rem;
  line-height: 1.9;
}

.about-list {
  list-style: none;
  padding: 0;
  margin: 1.8rem 0 0 0;
  padding-top: 1.4rem;
  border-top: 1px solid var(--border-soft);
}
.about-list li {
  margin-bottom: 0.95rem;
  font-size: 1rem;
  color: var(--text-primary);
}
.about-label {
  font-weight: 600;
  color: var(--brand);
  margin-right: 0.5em;
}
a {
  color: var(--brand);
  transition: color 0.2s;
}
a:hover {
  color: var(--brand-strong);
}

.email-copy {
  color: var(--brand);
  cursor: pointer;
  border-bottom: 1px solid rgba(49, 70, 208, 0.3);
  padding-bottom: 2px;
  transition: color 0.2s, background-color 0.2s;
  position: relative;
}

.email-copy:hover {
  color: var(--brand-strong);
  border-bottom-color: var(--brand-strong);
}

.email-copy:active {
  transform: scale(0.98);
}

.copy-feedback {
  margin-left: 0.5rem;
  color: #1d8f58;
  font-weight: 500;
  font-size: 0.9rem;
  animation: popIn 0.3s ease-out;
}

@keyframes popIn {
  from {
    opacity: 0;
    transform: scale(0.8);
  }
  to {
    opacity: 1;
    transform: scale(1);
  }
}

@keyframes fadeIn {
  from { opacity: 0; transform: translateY(30px); }
  to { opacity: 1; transform: translateY(0); }
}

@media (max-width: 720px) {
  .about-container {
    padding: 1.5rem 1rem 2rem;
  }

  .about-card {
    padding: 2rem 1.3rem;
    border-radius: 22px;
  }

  .about-title {
    font-size: 2rem;
  }
}
</style>
