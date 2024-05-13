import React, { forwardRef, useImperativeHandle, useState } from 'react'
import style from '../css/Allnode.module.less'

const SCnode = forwardRef((props, ref) => {


    useImperativeHandle(ref, () => ({
        // 暴露给父组件的方法
    }))

    return <div className={style.SCnode}>
            
    </div>
})

export default SCnode