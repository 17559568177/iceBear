import React, { memo } from 'react';
import { Handle, Position } from 'reactflow';
import style from '../css/CustomNode.module.less'
import Radiusbtn from './Radiusbtn';

function CustomNode({ data, id }) {

    const Model = () => {
        switch (data.type) {
            case 'start':
                return <div className={style.start}>
                    <div className={style.start_left}>
                        <img src="src/assets/imgs/myagent/workflownode/home.svg" alt="" />
                        <div className={style.start_left_text}>
                            <b>开始</b>
                            <span>节点名</span>
                        </div>
                    </div>
                    <div className={style.start_right}>
                        <p>输出</p>
                        <Handle type="source" position={Position.Right} className="w-16 !bg-teal-500" />
                    </div>
                </div>

            case 'node':
                return <div className={style.wfnode}>
                    <div className={style.wfnode_top}>
                        <div className={style.wfnode_top_left}>
                            <img src="src/assets/imgs/myagent/workflownode/home.svg" alt="" />
                            <div className={style.wfnode_top_left_text}>
                                <b>生成节点</b>
                                <span>节点名</span>
                            </div>
                        </div>
                        <div>
                            <img src="src/assets/imgs/myagent/workflownode/Group 360.svg" alt="" />
                        </div>
                    </div>
                    <div className={style.wfnode_lower}>
                        <div className={style.wfnode_lower_left}>

                            {
                                [1, 2, 3].map((ele, index) => {
                                    return <div className={style.wfnode_lower_left_item}>
                                        <Radiusbtn></Radiusbtn>&nbsp;&nbsp;&nbsp;输出
                                    </div>
                                })
                            }
                        </div>
                        <div className={style.wfnode_lower_right}>
                            输出&nbsp;&nbsp;&nbsp;
                            <img src="src/assets/imgs/myagent/workflownode/Group 337.svg" alt="" />
                        </div>
                        <img src="src/assets/imgs/myagent/workflownode/Group356.svg" alt="" className={style.wfnode_lower_img} />
                    </div>
                    <Handle type="target" position={Position.Left} className="w-16 !bg-teal-500" />
                    <Handle type="source" position={Position.Right} className="w-16 !bg-teal-500" />
                </div>
        }
    }

    return (
        <div className={style.customnode}>
            {
                Model()
            }


        </div>
    );
} 

export default memo(CustomNode);
