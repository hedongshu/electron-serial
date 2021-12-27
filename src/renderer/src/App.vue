<template>
    <n-config-provider :theme="theme">
        <router-view></router-view>
    </n-config-provider>
</template>

<script lang="ts" setup>
import { computed, onMounted, ref } from 'vue'
import { darkTheme, NConfigProvider, useOsTheme } from 'naive-ui'
const osThemeRef = useOsTheme()
const theme = computed(() => (osThemeRef.value === 'dark' ? darkTheme : null))
</script>

<style>
* {
    box-sizing: border-box;
}
.app-main {
    background: #fff;
}
</style>
