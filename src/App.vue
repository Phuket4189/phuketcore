<script setup>
import Sidebar from './components/Sidebar.vue'
</script>

<template>
  <div class="app">
    <Sidebar />
    <main class="content">
      <div class="content-shell">
        <router-view />
      </div>
    </main>
  </div>
</template>

<style>
.app{
  display: flex;
  min-height: 100vh;
}
.content{
  margin-left: 280px;
  flex: 1 1 auto;
  min-width: 0;
}

.content-shell {
  min-height: 100vh;
}

@media (max-width: 960px) {
  .app {
    display: block;
  }

  .content {
    margin-left: 0;
    padding-top: 96px;
  }
}
</style>
