<template>
    <div class="wellcome">
        <n-card hoverable>
            <img src="../assets/logo.png" />
            <h2>天航调试助手 V1.0</h2>

            <template #action>
                <n-button @click="start" color="#438eb9" type="primary" size="large">开始</n-button>
            </template>
        </n-card>
    </div>
</template>

<script lang="ts" setup>

import { useRouter } from 'vue-router';
const router = useRouter()
const start = () => {
    router.push('/home')
}
</script>
<style lang="scss">
.wellcome {
    position: relative;
    background: rgb(236, 236, 236);
    width: 100vw;
    height: 100vh;
    .n-card {
        width: 90%;
        background: #438eb9;
        border-radius: 10px;
        position: absolute;
        left: 50%;
        top: 50%;
        transform: translate(-50%, -50%);
        img {
            width: 100%;
        }
    }
}
</style>