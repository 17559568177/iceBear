import React, { useState } from 'react'
import style from './css/Agentcollection.module.less'
import { Input, Button, Pagination, ConfigProvider } from 'antd';
import { SearchOutlined } from '@ant-design/icons';

export default function Agentcollection() {


    const itemlist = [
        { key: '1', label: '所有助手' },
        { key: '2', label: '未发布' },
        { key: '3', label: '已发布' },
    ]
    const [itemindex, setitemindex] = useState(0)

    const list = [1, 2, 3, 4, 5, 6]
    return (
        <div className={style.agentcollection}>
            <h1>我的Agent</h1>
            <p className={style.agentcollectionp}>在这里查看并使用Agent，也可以进行编辑修改和删除</p>
            <div className={style.tab}>
                <div className={style.tab_item}>
                    {
                        itemlist.map((item, index) => {
                            return <p onClick={() => { setitemindex(index) }} className={index == itemindex ? style.action : ''}>
                                {item.label}
                            </p>
                        })
                    }
                </div>
                <div className={style.tab_input}>
                    <Input size="large" placeholder="搜索应用" prefix={<SearchOutlined />} />
                    &nbsp;&nbsp;&nbsp;
                    <Button size='large' style={{ color: '#fff', backgroundColor: '#F89C34', fontSize: '14px' }}>搜索</Button>
                </div>
            </div>

            <div className={style.market}>
                {
                    list.map((item, index) => {
                        return <div className={style.market_item}>
                            <div className={style.market_item_top}>

                                <div className={style.market_item_top_first}>
                                    <div className={style.market_item_top_first_img}>
                                        <img src='src/assets/imgs/myagent/Ellipse4.svg' alt="" />
                                    </div>
                                    &nbsp; &nbsp; &nbsp; &nbsp;
                                    <div className={style.market_item_top_first_txt}>
                                        <h3>助手应用名称</h3>
                                        <span>编辑时间：2024-01-31</span>
                                    </div>
                                </div>

                                <span>
                                    描述文字描述文字描述文字描述文字描述文字描述文字描述文字描述文字
                                </span>
                            </div>
                            <div className={style.market_item_bottom}>
                                <div className={style.market_item_bottom_img}>
                                    <img src="src/assets/imgs/Agentcollection/edit.svg" alt="" />
                                    <img src="src/assets/imgs/Agentcollection/del.svg" alt="" />
                                </div>

                                {/* <button className={style.market_item_bottom_btn}>
                                    <img src="src/assets/imgs/Agentcollection/sendtrue.svg" />&nbsp;&nbsp;发&nbsp;布
                                </button> */}

                                {/* <button className={style.market_item_bottom_btnfalse}>
                                    <img src="src/assets/imgs/Agentcollection/sendfalse.svg" />&nbsp;&nbsp;发&nbsp;布
                                </button> */}

                                <button className={style.market_item_bottom_redo}>
                                    <img src="src/assets/imgs/Agentcollection/redo.svg" />&nbsp;&nbsp;取消发布
                                </button>

                            </div>
                        </div>
                    })
                }
            </div>
            <div className={style.pagesize}>
                <ConfigProvider
                    theme={{
                        components: {
                            Pagination: {
                                // itemBg:'red'
                            },
                        },
                    }}
                >
                    <Pagination defaultCurrent={1} total={50} pageSize={6} />
                </ConfigProvider>
            </div>




        </div >
    )
}
