import { createApp } from 'vue'
import App from './App.vue'
import { router } from './route'
import naive from 'naive-ui'

const app = createApp(App)


import hljs from 'highlight.js' //导入代码高亮文件
import 'highlight.js/styles/github.css'
//自定义一个代码高亮指令
app.directive('highlight', function (el: HTMLElement) {
    const blocks = el.querySelectorAll('code');
    blocks.forEach((block) => {
        hljs.highlightElement(block)
    })
})


app
    .use(router)
    .use(naive)
    .mount('#app')
    .$nextTick(window.removeLoading)

console.log('fs', window.fs)
console.log('ipcRenderer', window.ipcRenderer)
