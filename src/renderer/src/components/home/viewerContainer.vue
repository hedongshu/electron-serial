<template>
    <div class="viewer-container">
        接收区
        <div class="content">
            <!-- <n-scrollbar style="height: 100%;" ref="scroll"> -->
            <pre v-highlight class="Bash">
<code>{{ log }}</code>
                </pre>
            <!-- </n-scrollbar> -->
        </div>
    </div>
</template>

<script lang="ts" setup>
import { Serial } from '../../Serial';
import { computed, ref, watch } from 'vue';

const serialDatas = Serial.getInstance().serialDatas

const scroll = ref<any>(null)

const log = computed(() => {
    let log: string[] = []
    serialDatas.value.forEach(item => {
        // 第一行
        if (item.type == 'headers') {
            log.push(`
            
[${new Date(item.timestamp).toTimeString()}]
============接收=============`)
        }
        log.push((item.raw))
    })

    return log.join('\r\n')
})

watch(log, () => {
    if (scroll.value) scroll.value.scrollTo({ top: 99999999 })
})

</script>

<style lang="scss">
.viewer-container {
    height: 100%;
    width: 100%;
    overflow: hidden;
    display: flex;
    flex-direction: column;
    .content {
        height: 100%;
        background-color: #fff;
        overflow: auto;
    }
    // .n-scrollbar > .n-scrollbar-container > .n-scrollbar-content {
    //     min-height: 100%;
    // }
}
</style>