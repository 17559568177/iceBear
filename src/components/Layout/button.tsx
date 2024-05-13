import React from 'react'
import style from './index.module.less';

export default function Button() {
    return (
        <div className={style.buttondiv}>
            <div className={style.button}>
                <span>MyAgent&nbsp;</span>
                <img src="src/assets/imgs/Subtract.svg" />
            </div>
        </div>
    )
}
