<script setup>
import Sidebar from './components/Sidebar.vue'
</script>

<template>
  <div class="app">
    <Sidebar />
    <main class="content">
      <router-view />
    </main>
  </div>
</template>

<style>
.app{
  display: flex;
}
.content{
  margin-left: 220px; /* 与 sidebar 宽度一致 */
  flex: 1 1 auto;
}
</style>
