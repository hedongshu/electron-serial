<template>
    <div class="setting-container">
        串口设置
        <n-card :bordered="true">
            <div class="picker-container">
                <div class="picker-box">
                    <span>串口</span>
                    <n-select
                        v-model:value="currentOptions.port"
                        :options="protsList"
                        :consistent-menu-width="false"
                    />
                    <n-button text style="font-size: 24px;" @click="refreshList">
                        <n-icon>
                            <RefreshCircleOutline />
                        </n-icon>
                    </n-button>
                </div>

                <div class="picker-box">
                    <span>波特率</span>
                    <n-select
                        v-model:value="currentOptions.baudRate"
                        :options="opts.baudRateList"
                        :consistent-menu-width="false"
                    />
                </div>

                <div class="picker-box">
                    <span>校验位</span>
                    <n-select
                        v-model:value="currentOptions.parity"
                        :options="opts.parityList"
                        :consistent-menu-width="false"
                    />
                </div>

                <div class="picker-box">
                    <span>数据位</span>
                    <n-select
                        v-model:value="currentOptions.dataBits"
                        :options="opts.dataBitList"
                        :consistent-menu-width="false"
                    />
                </div>

                <div class="picker-box">
                    <span>停止位</span>
                    <n-select
                        v-model:value="currentOptions.stopBits"
                        :options="opts.stopBitList"
                        :consistent-menu-width="false"
                    />
                </div>

                <div class="picker-box">
                    <n-icon size="25" v-if="!isOpen">
                        <RadioButtonOff />
                    </n-icon>
                    <n-icon size="25" color="#0e7a0d" v-else>
                        <RadioButtonOn />
                    </n-icon>
                    <n-button
                        :disabled="!(currentOptions.port.length > 0)"
                        @click="openPort"
                    >{{ isOpen ? '关闭串口' : '打开串口' }}</n-button>
                </div>
            </div>
        </n-card>
    </div>
</template>

<script lang="ts" setup>
import { computed, onMounted, reactive, ref, watch } from 'vue';
import { RefreshCircleOutline, RadioButtonOff, RadioButtonOn } from '@vicons/ionicons5'
import { useMessage } from 'naive-ui'
import { IPortData } from '../../../../../types'
import { Serial } from '../../Serial';

const message = useMessage()

const opts = reactive({
    isShowPullDate: true,   // 是否显示
    labelPosition: 'right', // 对齐方式
    pullData: '',   // 接收到的数据
    pushData: '',   // 发送的数据
    pushBit: 0, // 发送字节数
    pullBit: 0, // 接收字节数
    autoSendRate: 1000, // 自动发送频率 ms
    autoClean: false,   // 自动清空
    hexDisplay: false,  // 16 进制显示
    autoSend: false,    // 自动发送状态
    hexSend: false, // 16 进制发送
    sendState: false, // 发送状态

    baudRateList: [
        {
            label: '300',
            value: 300
        },
        {
            label: '600',
            value: 600
        },
        {
            label: '1200',
            value: 1200
        },
        {
            label: '2400',
            value: 2400
        },
        {
            label: '4800',
            value: 4800
        },
        {
            label: '9600',
            value: 9600
        },
        {
            label: '19200',
            value: 19200
        },
        {
            label: '38400',
            value: 38400
        },
        {
            label: '43000',
            value: 43000
        },
        {
            label: '56000',
            value: 56000
        },
        {
            label: '57600',
            value: 57600
        },
        {
            label: '115200',
            value: 115200
        },
        {
            label: '128000',
            value: 128000
        },
        {
            label: '230400',
            value: 230400
        },
        {
            label: '256000',
            value: 256000
        },
        {
            label: '460800',
            value: 460800
        }
    ],
    parityList: [
        {
            label: 'None',
            value: 'none'
        },
        {
            label: 'Odd',
            value: 'odd'
        },
        {
            label: 'Even',
            value: 'even'
        },
        {
            label: 'Mark',
            value: 'mark'
        },
        {
            label: 'Space',
            value: 'space'
        }
    ],
    dataBitList: [
        {
            label: '5',
            value: 5
        },
        {
            label: '6',
            value: 6
        },
        {
            label: '7',
            value: 7
        },
        {
            label: '8',
            value: 8
        }
    ],
    stopBitList: [
        {
            label: '1',
            value: 1
        },
        {
            label: '2',
            value: 2
        }
    ]
})

// 串口配置信息
const currentOptions = ref<IPortData>({
    port: '',
    baudRate: 115200,
    parity: 'none',
    dataBits: 8,
    stopBits: 1,
    autoOpen: false
})




// const { bindListener, ports, headers, serialDatas, disconnect, refreshList, connect, isOpen, onError, onClose } = useSerial()
const ports = Serial.getInstance().ports
const isOpen = Serial.getInstance().isOpen

const connect = (opt: IPortData) => Serial.getInstance().connect(opt)
const onError = (func: Function) => Serial.getInstance().onError(func)
const onClose = (func: Function) => Serial.getInstance().onClose(func)
const refreshList = () => Serial.getInstance().refreshList()
const disconnect = () => Serial.getInstance().disconnect()

watch(isOpen, () => {
    isOpen.value ? message.success(currentOptions.value.port + '串口连接成功') : message.warning('串口已断开')
})
const protsList = computed(() => {
    let list: { label: string, value: string }[] = []
    ports.value.forEach(item => {
        list.push({
            label: item,
            value: item
        })
    })
    return list
})

const openPort = async () => {
    try {
        if (isOpen.value) {
            await disconnect()
        } else {
            connect(currentOptions.value)
        }
    } catch (error: any) {
        message.error(error)
    }

}

onMounted(() => {
    onError((err: any) => {
        console.log(err)
        message.error(err)
    })

    onClose(() => {
        message.warning('串口关闭')
    })
})

</script>

<style lang="scss">
.setting-container {
    width: 100%;
    height: 100%;
    display: flex;
    flex-direction: column;
    .picker-container {
        width: 100%;
        display: flex;
        flex-direction: column;
        height: 100%;
        justify-content: center;
        align-content: center;

        .picker-box {
            display: flex;
            justify-content: center;
            align-items: center;
            span {
                flex-shrink: 0;
            }
        }
    }

    .n-card {
        width: 100%;
        height: 100%;
    }
}
</style>