/// <reference types="vite/client" />

declare module '*.vue' {
    import { DefineComponent } from 'vue'
    // eslint-disable-next-line @typescript-eslint/no-explicit-any, @typescript-eslint/ban-types
    const component: DefineComponent<{}, {}, any>
    export default component
}
interface IcommandBtn {
    name: string
    command: string
    tips: string
    encoding: 'ascii' | 'utf8' | 'utf16le' | 'ucs2' | 'base64' | 'binary' | 'hex'
}

interface IcommandBtnList {
    group: string
    commands: IcommandBtn[]
}

interface IsendMsgType {
    data: string | number[] | Buffer
    encoding: 'ascii' | 'utf8' | 'utf16le' | 'ucs2' | 'base64' | 'binary' | 'hex'
}
declare module 'vue3-highlightjs';