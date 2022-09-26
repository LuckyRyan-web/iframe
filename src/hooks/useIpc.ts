import { useEffect, useState } from 'react'
/**
 * 通过 postmessage 与主应用通信
 */
import * as EventEmitter from 'eventemitter3'

export interface MsgData {
    name: string
    context?: any
}
export type IPC = ReturnType<typeof init>

let source: MessageEventSource
let ipc: IPC | null = null
const eventEmitter = new EventEmitter()
const eventNames: string[] = []
const receiveMessage = (ev: MessageEvent<MsgData>) => {
    if (!eventNames.includes(ev.data.name)) {
        eventNames.push(ev.data.name)
    }
    if (!source && ev.source) {
        ipc = init(ev.source, ev.origin)
        setTimeout(() => {
            eventEmitter.emit(ev.data.name, ev.data.context)
        }, 60)
    } else {
        eventEmitter.emit(ev.data.name, ev.data.context)
    }
}

function init(ms: MessageEventSource, targetOrigin: string) {
    source = ms

    const ipc = {
        send: (msg: MsgData) => {
            // @ts-ignore
            source.postMessage(msg, targetOrigin)
        },
        on: eventEmitter.on.bind(eventEmitter),
        once: eventEmitter.once.bind(eventEmitter),
        off: eventEmitter.off.bind(eventEmitter),
        eventNames,
        destroy: () => {
            window.removeEventListener('message', receiveMessage, false)
            eventEmitter.removeAllListeners()
        },
        /**
         * 顶层框架的路由跳转
         * @param path
         */
        routerPush: (path: string) => {
            ipc.send({
                name: 'routerPush',
                context: {
                    path,
                },
            })
        },
    }

    return ipc
}

window.addEventListener('message', receiveMessage, false)

const getIpc = () => ipc

export default function useIpc() {
    const [ipc, setIpc] = useState(getIpc())

    useEffect(() => {
        if (!ipc) {
            const timer = window.setInterval(() => {
                const res = getIpc()
                if (res) {
                    clearInterval(timer)
                    setIpc(res)
                }
            }, 60)

            return () => {
                clearInterval(timer)
            }
        }
    }, [ipc])

    return ipc
}
