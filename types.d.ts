
declare namespace NodeJS {
    interface ProcessEnv {
        NODE_ENV: 'development' | 'production'
        readonly PORT: string
        readonly HOST: string
    }
}

export interface IPortData {
    port: string;
    baudRate: number
    parity?: "none" | "even" | "mark" | "odd" | "space" | undefined
    dataBits?: 8 | 7 | 6 | 5 | undefined
    stopBits?: 1 | 2 | undefined
    autoOpen?: boolean
}
export interface IReceivedData {
    port: string;
    baudRate: number
    timestamp: string;
    type: 'values' | 'headers';
    data: string[];
    raw: string;
}

