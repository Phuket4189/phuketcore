<template>
  <nav class="sidebar">
    <div class="brand">
      <p>PhuketCore<span class="cursor">_</span></p>
      <span class="brand-subtitle">个人博客 · 工具作品集</span>
    </div>
    <ul class="nav-list">
      <li><router-link to="/">首页</router-link></li>
      <li><router-link to="/about">关于</router-link></li>
      <li class="nav-divider">项目</li>
      <li><router-link to="/project">项目列表</router-link></li>
      <li class="nav-divider">文档</li>
      <li><router-link to="/dlog">开发日志</router-link></li>
      <li><router-link to="/notes">编程笔记</router-link></li>
    </ul>
    <div class="footer-info">
      <p>做偏长期价值的内容与工具，不做模板感站点。</p>
    </div>
  </nav>
</template>

<script setup>
</script>

<style scoped>
.sidebar {
  position: fixed;
  left: 18px;
  top: 18px;
  bottom: 18px;
  width: 244px;
  border-radius: 28px;
  background:
    linear-gradient(180deg, rgba(22, 30, 48, 0.96), rgba(30, 40, 64, 0.92)),
    rgba(17, 23, 36, 0.88);
  color: #eef3ff;
  padding: 1.2rem 0.95rem;
  box-shadow: 0 22px 50px rgba(16, 23, 37, 0.28);
  border: 1px solid rgba(255,255,255,0.08);
  backdrop-filter: blur(18px);
  display: flex;
  flex-direction: column;
  z-index: 999;
}

.sidebar .brand{
  font-weight: 700;
  font-size: 1.5rem;
  padding: 0.7rem 0.45rem 1rem;
  border-bottom: 1px solid rgba(255,255,255,0.08);
}

.brand-subtitle {
  display: block;
  margin-top: 0.3rem;
  font-size: 0.82rem;
  letter-spacing: 0.02em;
  color: rgba(212, 222, 245, 0.72);
}

.nav-list {
  list-style: none;
  padding: 0;
  margin: 1rem 0 0 0;
  flex: 1;
}

.sidebar li {
  margin: 0.15rem 0;
}
.sidebar a {
  color: #dde7ff;
  display: block;
  padding: 0.8rem 0.82rem;
  border-radius: 14px;
  transition: background 0.2s, transform 0.2s, color 0.2s;
  font-size: 0.96rem;
  border: 1px solid transparent;
}
.sidebar a:hover {
  background: rgba(255,255,255,0.08);
  color: #ffffff;
  transform: translateX(2px);
}
.sidebar a.router-link-active {
  background: linear-gradient(135deg, rgba(91, 111, 255, 0.26), rgba(130, 153, 255, 0.14));
  border-color: rgba(153, 173, 255, 0.24);
  font-weight: 600;
  color: #ffffff;
  box-shadow: inset 0 1px 0 rgba(255,255,255,0.08);
}

.nav-divider {
  padding: 0.85rem 0.7rem 0.3rem;
  margin-top: 0.65rem;
  font-size: 0.72rem;
  font-weight: 600;
  color: rgba(174, 188, 220, 0.56);
  text-transform: uppercase;
  letter-spacing: 0.14em;
  border-top: 1px solid rgba(255,255,255,0.06);
  padding-top: 0.75rem;
}

.footer-info {
  margin-top: auto;
  padding: 1rem 0.45rem 0.2rem;
  border-top: 1px solid rgba(255,255,255,0.08);
  text-align: left;
}

.footer-info p {
  margin: 0;
  font-size: 0.78rem;
  color: rgba(202, 214, 244, 0.66);
  line-height: 1.6;
  word-break: break-word;
}

.brand p { display: inline-flex; align-items: center; gap: 0.2rem; }
.cursor {
  display: inline-block;
  color: #d8e5ff;
  margin-left: 0.1rem;
  width: 0.6ch;
  animation: blink 1s steps(2, start) infinite;
}
@keyframes blink {
  0% { opacity: 1 }
  50% { opacity: 0 }
  100% { opacity: 0 }
}

@media (max-width: 960px) {
  .sidebar {
    left: 14px;
    right: 14px;
    top: 14px;
    bottom: auto;
    width: auto;
    height: auto;
    border-radius: 22px;
    padding: 0.9rem;
  }

  .nav-list {
    display: grid;
    grid-template-columns: repeat(2, minmax(0, 1fr));
    gap: 0.3rem;
  }

  .nav-divider {
    grid-column: 1 / -1;
  }

  .footer-info {
    display: none;
  }
}
</style>
