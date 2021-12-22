<template>
    <n-config-provider :theme="theme">
        <div>{{ ports }}</div>
        <div>{{ headers }}</div>
        <div>{{ serialDatas }}</div>
    </n-config-provider>
</template>

<script lang="ts" setup>
import { computed, onMounted, ref } from 'vue'
import { darkTheme, NConfigProvider, useOsTheme } from 'naive-ui'
import { useSerial } from './useSerial'
const osThemeRef = useOsTheme()
const theme = computed(() => (osThemeRef.value === 'dark' ? darkTheme : null))

const { ports, headers, serialDatas, refreshList } = useSerial()

onMounted(() => {
    refreshList()
})

</script>

<style>
.app-main {
    background: #fff;
}
</style>
