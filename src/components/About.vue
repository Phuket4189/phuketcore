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
  background: var(--about-bg, #f7f8fa);
  padding: 2rem 0;
}

.about-card {
  background: #fff;
  border-radius: 16px;
  box-shadow: 0 4px 24px 0 rgba(0,0,0,0.08);
  padding: 2.5rem 2.5rem 2rem 2.5rem;
  max-width: 600px;
  width: 100%;
  margin: 2rem 1rem;
  animation: fadeIn 0.7s;
}

.about-title {
  font-size: 2rem;
  font-weight: 700;
  margin-bottom: 1.5rem;
  color: #2d3748;
  letter-spacing: 2px;
  text-align: left;
}

.about-desc {
  font-size: 1.08rem;
  color: #444;
  margin-bottom: 1.1rem;
  line-height: 1.8;
}

.about-list {
  list-style: none;
  padding: 0;
  margin: 1.2rem 0 0 0;
}
.about-list li {
  margin-bottom: 0.7rem;
  font-size: 1.05rem;
  color: #333;
}
.about-label {
  font-weight: 600;
  color: #3182ce;
  margin-right: 0.5em;
}
a {
  color: #3182ce;
  text-decoration: none;
  transition: color 0.2s;
}
a:hover {
  text-decoration: underline;
  color: #205080;
}

.email-copy {
  color: #3182ce;
  cursor: pointer;
  border-bottom: 1px solid #3182ce;
  padding-bottom: 2px;
  transition: color 0.2s, background-color 0.2s;
  position: relative;
}

.email-copy:hover {
  color: #205080;
  border-bottom-color: #205080;
}

.email-copy:active {
  transform: scale(0.98);
}

.copy-feedback {
  margin-left: 0.5rem;
  color: #48bb78;
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
</style>
