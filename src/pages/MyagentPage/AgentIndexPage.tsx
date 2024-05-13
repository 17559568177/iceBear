import { useState, memo, useEffect } from 'react'

import style from './css/index.module.less'
import { Input, Button } from 'antd';
import { useNavigate } from 'react-router-dom'







export default function AgentIndexPage() {


    const agentname = '建筑设计师'
    const introduceimg = [
        { title: '帮我生成一个会议助手，可以给我梳理复杂的会议纪要', src: 'src/assets/imgs/Page_perspective_matte_s.png' },
        { title: '为我创建一个日程助手，能够为我安排或制定行程计划', src: 'src/assets/imgs/Calendar_perspective_matte_s.png' },
        { title: '给我一个基于我知识库的办公应用，帮我解答工作问题', src: 'src/assets/imgs/Computer_perspective_matte_s.png' },
        { title: '我还不知道要做什么工具，......但我想试试！', src: 'src/assets/imgs/Light_bulb_perspective_matte_s.png' },
    ]
    const [introduceflag, setintroduceflag] = useState<boolean>(true)
    const navigator = useNavigate()



    const AgentInput = (e: any) => {
        setintroduceflag(false)
        console.log(e.target.value)
    }


    const Introduce = () => {
        return <div>
            <div style={{ width: '693px', height: '209px', margin: '0px auto', display: 'flex', justifyContent: 'space-between' }}>
                {
                    introduceimg.map((item) => {
                        return (

                            <div style={{
                                width: '157px', height: '209px', borderRadius: '20px', backgroundColor: '#FFFFFF',
                                display: 'flex', flexDirection: 'column', justifyContent: 'space-evenly', alignItems: 'center', boxShadow: '0 2px 12px 0 rgba(0, 0, 0, 0.1)'
                            }}>
                                <div style={{ width: '112px', height: '65px', color: '#929292', fontSize: '13px', fontWeight: '400' }}>
                                    {item?.title}
                                </div>
                                <img src={item?.src} />
                            </div>
                        )
                    })
                }
            </div>
            <p className={style.contentfirstp}>
                <img src="src/assets/imgs/messages.svg" style={{ verticalAlign: 'middle' }} />&nbsp;&nbsp;别忘了去<span style={{ color: '#F89C34' }} onClick={() => { navigator('AgentApplicationCenter') }}>应用中心</span>看看，或许你会发现好点子！
            </p>
            <p className={style.contenttwop}>
                <img src="src/assets/imgs/messages.svg" style={{ verticalAlign: 'middle' }} />&nbsp;&nbsp;保存后的助手会出现在<span style={{ color: '#F89C34' }} onClick={() => { navigator('Agentcollection') }}>我的Agent</span>中，方便再次使用！
            </p>
        </div>
    }

    const Communication = () => {
        return <div className={style.agentuserchart}>
            <div className={style.left}>
                <div className={style.agentuserchartcontent}>
                    你好！我是Agent创造师
                    你好！我是Agent创造师
                    你好！我是Agent创造师
                    你好！我是Agent创造师
                    你好！我是Agent创造师
                </div>
                <div className={style.agentuserchartimg}>
                    <img src="src/assets/imgs/Image-32.svg" alt="网路错误" />
                </div>
            </div>

            <div className={style.right}>
                <div className={style.agentuserchartimg}>
                    <img src="src/assets/imgs/Group.svg" alt="网路错误" />
                </div>
                <div className={style.agentuserchartcontent}>
                    没问题！我为你创建了<span>{agentname}</span>助手，你可以通过下面的通道直接开启对话！
                    <div className={style.agentuserchartpeople}>
                        <div className={style.agentuserchartpeopleimg}>
                            <img src="src/assets/imgs/ai-2.png" alt="网路错误" />
                        </div>
                        <div>
                            <p style={{ color: '#292D32', fontSize: '14px', fontWeight: '600', marginBottom: '5px' }}>{agentname}</p>
                            <p style={{ color: '#C1C1C1', fontSize: '11px' }}>可以帮我识别和分析建筑理念。</p>
                        </div>
                    </div>
                </div>
            </div>

        </div>
    }
    return (
        <div>
            <div style={{ textAlign: 'center', marginTop: '50px' }}>
                <h1>你好！我是Agent创造师<br />你的<span className={style.Gradient}>AI员工</span>开发平台</h1>
            </div>
            <p style={{ textAlign: 'center', margin: '20px 0px 50px 0px', fontWeight: '700', color: '#292D32D9', fontSize: '14px' }}>
                告诉我你的想法，我可以快速为你定制一位数字助手。你可以轻松与朋友分享，
                <br />
                也能一键发布到多个平台，让你的助手触及更多用户群体。
            </p>

            {
                introduceflag ? <Introduce></Introduce> : <Communication></Communication>
            }
            {/* <Outlet></Outlet> */}

            <div className={style.contentbuttoninput}>
                <Input size="large" placeholder="说出你的需求吧！可以描述人设、功能、目标用户等"
                    onPressEnter={() => AgentInput(event)}
                    suffix={
                        <Button size='large' className={style.contentbuttoninputButton}>
                            <img src="src/assets/imgs/Icon-Wrapper.svg" style={{ verticalAlign: 'middle' }}
                                onClick={() => AgentInput(event)} />&nbsp;&nbsp;发送</Button>
                    } />
            </div>
        </div>
    )
}
