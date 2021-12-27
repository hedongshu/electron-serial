<template>
    <div class="btn-container">
        功能区
        <n-card :bordered="true">
            <n-space vertical>
                <div v-for="(item, index) in btnList" :key="item.group">
                    {{ item.group }}
                    <n-tooltip
                        v-for="(citem, cindex) in item.commands"
                        :key="cindex"
                        trigger="hover"
                    >
                        <template #trigger>
                            <n-button @click="runCommand(citem)">{{ citem.name }}</n-button>
                        </template>
                        {{ citem.tips }}
                    </n-tooltip>
                </div>
            </n-space>
        </n-card>
    </div>
</template>

<script lang="ts" setup>
import { useMessage } from 'naive-ui';
import { Serial } from '../../Serial';

const isOpen = Serial.getInstance().isOpen

const message = useMessage()
const btnList: IcommandBtnList[] = [
    {
        group: 'fdb命令',
        commands: [
            {
                name: '运⾏参数',
                command: "fdb env",
                encoding: 'ascii',
                tips: '查看系统运⾏参数'
            },
        ]
    },
    {
        group: 'app命令',
        commands: [
            {
                name: '图片采集',
                command: "app ic",
                encoding: 'ascii',
                tips: '启动图⽚采集'
            }, {
                name: '数据采集',
                command: "app sa",
                encoding: 'ascii',
                tips: '启动数据采集'
            }, {
                name: '图片上传',
                command: "app iu",
                encoding: 'ascii',
                tips: '启动图⽚上传'
            }, {
                name: '数据上传',
                command: "app su",
                encoding: 'ascii',
                tips: '启动数据上传'
            }, {
                name: '杂项任务',
                command: "app misc",
                encoding: 'ascii',
                tips: '启动杂项任务'
            }
        ]
    },
    {
        group: 'ec20命令',
        commands: [
            {
                name: '获取运营商',
                command: "ec20 oper - ec20/ec200",
                encoding: 'ascii',
                tips: '获取运营商'
            },
            {
                name: '获取位置信息',
                command: "ec20 pos - ec20/ec200",
                encoding: 'ascii',
                tips: '获取位置信息'
            },
        ]
    },
]




const runCommand = (item: IcommandBtn) => {
    console.log(item)
    if (isOpen.value) {
        Serial.getInstance().sendCommand({
            data: item.command + '\r\n',
            encoding: item.encoding
        })
    } else {
        message.warning('串口未连接')
    }
}
</script>
<style lang="scss">
.btn-container {
    display: flex;
    flex-direction: column;
    height: 100%;
    width: 100%;
}
</style>