<template>
  <nav class="sidebar">
    <div class="brand"><p>PhuketCore<span class="cursor">_</span></p></div>
    <ul>
      <li><router-link to="/">首页</router-link></li>
      <li><router-link to="/about">关于</router-link></li>
      <li><router-link to="/project">项目列表</router-link></li>
      <li><router-link to="/dlog">开发日志</router-link></li>
    </ul>
    <div class="footer-info">
      <p>湘ICP备2026005726号</p>
    </div>
  </nav>
</template>

<script setup>
</script>

<style scoped>
.sidebar {
  position: fixed;
  left: 0;
  top: 0;
  bottom: 0;
  width: 220px;
  background: #0f172a;
  color: #e6eef8;
  padding: 1rem 0.75rem;
  box-shadow: 2px 0 8px rgba(2,6,23,0.3);
  display: flex;
  flex-direction: column;
  z-index: 9999;
}
.sidebar .brand{
  font-weight: 700;
  font-size: 1.5rem;
  padding: 0.5rem 0.25rem;
}
.sidebar ul {
  list-style: none;
  padding: 0;
  margin: 1rem 0 0 0;
  flex: 1;
}
.sidebar li {
  margin: 0.25rem 0;
}
.sidebar a {
  color: #cfe8ff;
  text-decoration: none;
  display: block;
  padding: 0.5rem 0.5rem;
  border-radius: 4px;
}
.sidebar a.router-link-active {
  background: rgba(255,255,255,0.06);
}

.footer-info {
  margin-top: auto;
  padding-top: 1rem;
  border-top: 1px solid rgba(255,255,255,0.1);
  text-align: center;
}

.footer-info p {
  margin: 0;
  font-size: 0.75rem;
  color: #8ca3c8;
  line-height: 1.4;
  word-break: break-word;
}

/* 闪烁光标样式 */
.brand p { display: inline-flex; align-items: center; gap: 0.2rem; }
.cursor {
  display: inline-block;
  color: #cfe8ff;
  margin-left: 0.1rem;
  width: 0.6ch;
  animation: blink 1s steps(2, start) infinite;
}
@keyframes blink {
  0% { opacity: 1 }
  50% { opacity: 0 }
  100% { opacity: 0 }
}
</style>
