import { forwardRef, memo, useImperativeHandle, useState } from 'react';
import style from './Customnode.module.less'



const Customnode = forwardRef((props, ref) => {

    // 暴露给父组件的方法
    useImperativeHandle(ref, () => ({
        // 暴露给父组件的方法
    }));

    return (
        <div className={style.customnode}>
            <div className={style.customnode_top}>

                <div className={style.customnode_top_title}>
                    <div className={style.customnode_top_title_left}>
                        <img src="src/assets/imgs/myagent/workflownode/home.svg" alt="" />
                        <span>生成节点</span>
                    </div>

                    <div className={style.customnode_top_title_right}>
                        <div>
                            <img src="src/assets/imgs/myagent/workflownode/Group 3562.svg" alt="" />
                            <img src="src/assets/imgs/myagent/workflownode/Group 357.svg" alt="" />
                            <img src="src/assets/imgs/myagent/workflownode/Group 358.svg" alt="" />
                        </div>
                        <img src="src/assets/imgs/myagent/workflownode/del.svg" alt="" />
                    </div>
                </div>  ``

                <input type="text" className={style.customnode_top_txt} placeholder='在此处添加解释与描述' />


            </div>



            <div className={style.customnode_buttom}>

            </div>
        </div>
    );
})

export default Customnode