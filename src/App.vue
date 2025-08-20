<template>
  <router-view />
</template>

<script setup>
import useSettingsStore from '@/store/modules/settings'
import { handleThemeStyle } from '@/utils/theme'

onMounted(() => {
  nextTick(() => {
    // 初始化主题样式
    handleThemeStyle(useSettingsStore().theme)
    // 获取屏幕的分辨率
    const screenWidth = window.screen.width
    // 这里可以根据屏幕分辨率进行一些适配操作
    if (screenWidth < 1400) {
      document.body.style.zoom = 0.8
    } else if (screenWidth < 1280) {
      document.body.style.zoom = 0.7
    }
  })
})
</script>
