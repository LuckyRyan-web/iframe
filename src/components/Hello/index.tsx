/**
 * @author liuyuan
 * @date 2022-09-24 16:59
 * @since 0.0.0
 */

import React, { useCallback, useRef, useState, useEffect } from 'react'
//import classnames from 'classnames'
import style from './style.module.scss'
import IframeApp from '../IframeApp'

interface HelloProps {}

const Hello: React.FC<HelloProps> = (props) => {
    return (
        <div>
            <IframeApp
                src={'http://127.0.0.1:5174/'}
                show
                onLoad={(ipc, iframe) => {
                    ipc.on('vue-load', (ctx) => {
                        console.log('ctx', ctx)
                    })

                    ipc.send({
                        name: 'load',
                        context: {
                            id: '1',
                        },
                    })
                }}
                onClose={() => {
                    console.log('close iframe')
                }}
            />
        </div>
    )
}

export default React.memo(Hello)
