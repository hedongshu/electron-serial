<template >
    <n-message-provider>
        <div class="home">
            <div class="setting">
                <setting-container-vue></setting-container-vue>
            </div>
            <div class="status">
                <n-card style="width:100%; height: 100%">设备状态</n-card>
            </div>
            <div class="viewer">
                <viewer-container-vue></viewer-container-vue>
            </div>
            <div class="command">
                <btn-container-vue></btn-container-vue>
            </div>
        </div>
    </n-message-provider>
</template>

<script lang="ts" setup>
import settingContainerVue from './settingContainer.vue';
import viewerContainerVue from './viewerContainer.vue';
import btnContainerVue from './btnContainer.vue';
import { onMounted, provide } from 'vue';
import { Serial } from '../../Serial';

onMounted(() => {
    let serial = Serial.getInstance()
    serial.bindListener()
})
// const { bindListener, ports, headers, serialDatas, disconnect, refreshList, connect, isOpen, onError, onClose } = useSerial()
// bindListener()
// provide('isOpen', isOpen)
// provide('ports', ports)
// provide('serialDatas', serialDatas)
// provide('headers', headers)
// provide('disconnect', disconnect)
// provide('refreshList', refreshList)
// provide('connect', connect)
// provide('onError', onError)
// provide('onClose', onClose)
</script>

<style lang="scss">
.home {
    box-sizing: border-box;
    background: rgb(236, 236, 236);
    width: 100vw;
    height: 100vh;
    padding: 10px;
    overflow: hidden;

    display: grid;
    grid-template-columns: repeat(8, 1fr);
    grid-template-rows: repeat(6, 1fr);
    grid-column-gap: 10px;
    grid-row-gap: 10px;

    .setting {
        grid-area: 1 / 1 / 4 / 3;
    }
    .status {
        grid-area: 4 / 1 / 7 / 3;
    }
    .viewer {
        grid-area: 1 / 3 / 5 / 9;
    }
    .command {
        grid-area: 5 / 3 / 7 / 9;
    }
}
</style>