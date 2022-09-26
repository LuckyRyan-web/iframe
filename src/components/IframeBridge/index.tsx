/**
 * @author liuyuan
 * @date 2022-09-26 16:54
 * @since 0.0.0
 */

import React, { useRef } from 'react'
//import classnames from 'classnames'
//import style from './style.module.scss'
import { ResultRegType } from '@/lib/ipc'
import useBridge, { MsgData } from '@/hooks/useBridge'

interface IframeBridgeProps {
    src: string
    timeout?: number
    show?: boolean
    scrolling?: 'auto' | 'yes' | 'no'
    onLoad: (ipc: ResultRegType, iframe: HTMLIFrameElement) => void
    onClose: () => void
    width: number
    height: number
}

const IframeBridge: React.FC<IframeBridgeProps> = (props) => {
    const iframeRef = useRef<HTMLIFrameElement | null>(null)

    const bridge = useBridge(
        {
            onLoad: () => {
                bridge.sendMessage({
                    method: 'load',
                    data: {
                        name: 'ryan',
                    },
                })
            },
            onClose: () => {
                if (props.onClose) {
                    props.onClose()
                }
            },
        },
        // @ts-ignore
        iframeRef.current?.contentWindow,
    )

    return (
        <iframe
            ref={iframeRef}
            src={props.src}
            style={{
                width: props.width || '100%',
                height: props.height || '100vh',
                border: 'none',
                overflow: 'hidden',
            }}
            title='iframe-test'
        />
    )
}

export default React.memo(IframeBridge)
