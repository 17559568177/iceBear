import React, { useState } from 'react'
import style from './css/Agentcollection.module.less'
import { Input, Button, Pagination, ConfigProvider } from 'antd';
import { ControlOutlined, SearchOutlined } from '@ant-design/icons';

export default function Agentcollection() {


    const itemlist = [
        { key: '1', label: '所有类别' },
        { key: '2', label: '人力资源' },
        { key: '3', label: '绘画' },
        { key: '4', label: '翻译' },
        { key: '5', label: '写作' },
        { key: '6', label: '助手' },
        { key: '7', label: '智能助理' },
        { key: '8', label: '编程' },
    ]
    const [itemindex, setitemindex] = useState<number>(0)

    const [collectio_img, setcollection_img] = useState<boolean>(false)

    const list = [1, 2]
    return (
        <div className={style.agentcollection}>
            <h1>应用中心</h1>
            <p className={style.agentcollectionp}>查看当下最热门的Agent，探索无限可能</p>
            <div className={style.tab}>
                <div className={style.tab_item} style={{ width: '588px' }}>
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
                                        <img src='src/assets/imgs/myagent/Ellipse4.svg' />
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
                                    <div className={style.market_item_bottom_img_user}>
                                        <img src="src/assets/imgs/myagent/Ellipse1.svg" />
                                    </div>
                                    &nbsp; &nbsp;
                                    <p style={{ color: '#292D32D9', fontFamily: 'Microsoft YaHei' }}>
                                        用户名
                                    </p>
                                </div>

                                <img src={collectio_img ? "src/assets/imgs/Agentcollection/vuesaxtrue.svg" : "src/assets/imgs/Agentcollection/vuesaxfalse.svg"} onClick={() => {
                                    setcollection_img(!collectio_img)
                                    console.log(123546)
                                }} />


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
                                itemBg: 'red'

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
