/**
 * @author liuyuan
 * @date 2022-09-26 11:20
 * @since 0.0.0
 */

import React, { useCallback, useEffect, useRef, useState } from 'react'
//import classnames from 'classnames'
import style from './style.module.scss'
import { ResultRegType, reg } from '@/lib/ipc'
import { useUnmount } from 'ahooks'

interface IframeAppProps {
    src: string
    timeout?: number
    show?: boolean
    scrolling?: 'auto' | 'yes' | 'no'
    onLoad: (ipc: ResultRegType, iframe: HTMLIFrameElement) => void
    onClose: () => void
}

const IframeApp: React.FC<IframeAppProps> = (props) => {
    const { timeout = 5000, scrolling = 'auto', show = true } = props

    const iframe = useRef<HTMLIFrameElement>(null)

    const ipc = useRef<ResultRegType>()

    const isTimeout = useRef(false)

    const timer = useRef(0)

    useUnmount(() => {
        if (ipc.current) {
            console.log('ipc dest')
            ipc.current.destroy()
        }
        clearTimeout(timer.current)
    })

    const watchTimeout = useCallback(() => {
        clearTimeout(timer.current)

        timer.current = setTimeout(() => {
            isTimeout.current = true
            console.log('is-timeout')

            props.onClose()
        }, timeout)
    }, [props, timeout])

    useEffect(() => {
        watchTimeout()
    }, [watchTimeout])

    useEffect(() => {
        if (props.show) {
            watchTimeout()
        }
    }, [props.show, watchTimeout])

    const onIframeLoad = useCallback(() => {
        if (isTimeout.current) {
            return
        }

        clearTimeout(timer.current)

        if (iframe.current) {
            ipc.current = reg(iframe.current)

            if (ipc.current) {
                props.onLoad(ipc.current, iframe.current)
            }
        }
    }, [props])

    return (
        <>
            {show && (
                <iframe
                    ref={iframe}
                    title='iframe'
                    src={props.src}
                    scrolling={scrolling}
                    onLoad={onIframeLoad}
                    className={style.app}
                ></iframe>
            )}
        </>
    )
}

export default React.memo(IframeApp)
