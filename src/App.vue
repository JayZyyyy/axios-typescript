<script setup lang="ts">
import jayRequest from './service'
import { onMounted } from 'vue'

const get15DaysWeatherByArea = () => {
  jayRequest.request({
    url: '/user/playlist?uid=32953014',
    method: 'GET'
  })
}
onMounted(async () => {
  get15DaysWeatherByArea()
})
</script>

<template>
  <div>
    <a href="https://vitejs.dev" target="_blank">
      <img src="/vite.svg" class="logo" alt="Vite logo" />
    </a>
    <a href="https://vuejs.org/" target="_blank">
      <img src="./assets/vue.svg" class="logo vue" alt="Vue logo" />
    </a>
  </div>
</template>

<style scoped>
.logo {
  height: 6em;
  padding: 1.5em;
  will-change: filter;
  transition: filter 300ms;
}
.logo:hover {
  filter: drop-shadow(0 0 2em #646cffaa);
}
.logo.vue:hover {
  filter: drop-shadow(0 0 2em #42b883aa);
}
</style>
