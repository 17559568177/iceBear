import React, { useState, useEffect } from 'react'
import style from './css/AgentChatpage.module.less'
import BASE_URL from './api';
import { useNavigate, useParams } from 'react-router-dom';
import { AgentAvatarnum } from './methods'
import { copyToClipboard } from '@/components/GPTBlock/hooks/copyToClipboard';
import { useUserStore } from '@/store/user';

import { Input, Button, message, Drawer, Select, ConfigProvider, Form, Spin } from 'antd';
import { LoadingOutlined } from '@ant-design/icons';
import CustomButton from './components/CustomButton';


const { TextArea } = Input;
const { Option } = Select;

export default function AgentChatpage() {

    const navigate = useNavigate();
    const { id } = useParams();

    const [agentinfo, setagentinfo] = useState<any>({})
    const [initialValues, setinitialValues] = useState<any>({})
    useEffect(() => {
        try {
            fetch(BASE_URL + 'rag/get_agentConfig/', {
                method: 'POST',
                body: JSON.stringify({
                    agentId: id
                })
            }).then(response => response.json()).then(data => {

                setagentinfo(data)
                const faqslist = data.faqs
                data.faqs1 = faqslist[0]
                data.faqs2 = faqslist[1]
                data.faqs3 = faqslist[2]
                setinitialValues(data)
            })
        }
        catch (error) {

        }
    }, [id])

    const AgentInput = (e: any) => {
        console.log(e.target.value)
    }

    const handleCopy = () => {
        copyToClipboard('124567890')
    }

    const [openDrawer, setOpenDrawer] = useState(false);

    // 修改agent下拉列表选项
    const handleChange = (value: any) => {
        console.log(`selected ${value}`);
    };
    // 多行文本
    const onChange = (e: any) => {
        console.log('Change:', e.target.value);
    };

    const [form] = Form.useForm();
    const formsubmit = (value: any) => {
        console.log(value, 'value')
        try {
            fetch(BASE_URL + 'rag/update_agentConfig/', {
                method: 'POST',
                body: JSON.stringify({
                    userId: useUserStore.getState().usrId,
                    agentId: agentinfo.agentId,
                    config: {
                        avatar: 1,
                    }
                })
            }).then(response => response.json()).then(data => {
                console.log(agentinfo, 'AAA')

            })
        }
        catch (error) {
            console.log(error, 'error')
        }
    }

    return (
        <div className={style.agentchatpage}>
            {/* 第一次回复 */}
            <div className={style.topagentchat}>
                <div className={style.topagentchatimg} onClick={() => {
                    setOpenDrawer(true)
                }}>
                    <img src={AgentAvatarnum(agentinfo.avatar)} alt="" />
                </div>
                <div className={style.topagentchatcontent}>
                    <h2>你好，我是<span className={style.Gradient}>{agentinfo.avatar}</span>助手！</h2>
                    <br />
                    <p>描述文字描述文字描述文字描述文字描述文字描述文字描述文字描述文字描述文字描述文字描述文字描述文字描。</p>
                </div>
            </div>

            <div className={style.dialogue}>
                {/* 用户 */}
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
                {/* chat */}
                <div className={style.right}>
                    <div className={style.agentuserchartimg}>
                        <img src="src/assets/imgs/Group.svg" alt="网路错误" />
                    </div>
                    <div className={style.agentuserchartcontent}>
                        {/* 文本处 */}

                        <Spin
                            indicator={
                                <LoadingOutlined
                                    style={{
                                        fontSize: 24,
                                    }}
                                    spin
                                />
                            }
                        />


                        <div className={style.agentuserchartcontentoption}>
                            <div className={style.agentuserchartthree}>
                                <img src="src/assets/imgs/myagent/good.svg" />
                                <img src="src/assets/imgs/myagent/nogood.svg" />
                                <img src="src/assets/imgs/myagent/copy.svg" onClick={() => {
                                    handleCopy()
                                    message.success('已复制到剪贴板');
                                }} />
                            </div>
                            <div className={style.agentusercharttxt}>
                                <img src="src/assets/imgs/myagent/rotate-left.svg" />
                                重新生成
                            </div>
                        </div>
                    </div>
                </div>


            </div>
            {/* input */}
            <div className={style.contentbuttoninput}>
                <Input size="large" placeholder="说出你的需求吧！可以描述人设、功能、目标用户等"
                    onPressEnter={() => AgentInput(event)}
                    suffix={
                        <Button size='large' className={style.contentbuttoninputButton}>
                            <img src="src/assets/imgs/Icon-Wrapper.svg" style={{ verticalAlign: 'middle' }}
                                onClick={() => AgentInput(event)} />&nbsp;&nbsp;发送</Button>
                    } />
            </div>

            {/* 右侧定位 */}
            <div className={style.navigationbar}>
                <div>
                    <img src="src/assets/imgs/edit.svg" alt="" />
                </div>
                <div>
                    <img src="src/assets/imgs/Vector.svg" alt="" />
                </div>
            </div>


            {/* 抽屉 */}
            <Drawer getContainer={false} onClose={() => setOpenDrawer(false)} open={openDrawer}>

                <Form form={form}
                    initialValues={initialValues}>
                    <div className={style.draweragentchatpageinfo}>

                        {/* 头部 */}
                        <div className={style.drawertitle}>
                            <div style={{ display: 'flex', alignItems: 'center' }}>
                                <img src="src/assets/imgs/myagent/user.svg" alt="" />
                                &nbsp; &nbsp;
                                <span className={style.drawertitle}>基础信息</span>
                            </div>
                            <img src="src/assets/imgs/myagent/del.svg" alt="" />
                        </div>

                        <div className={style.draweruser}>
                            <span>头像</span>
                            <div className={style.draweruserimg}>
                                <img src="src/assets/imgs/myagent/magicpen.svg" alt="" />
                                &nbsp; &nbsp;
                                <img src={AgentAvatarnum(agentinfo.avatar)} alt="" />
                            </div>
                        </div>


                        {/* 选项 */}
                        <div className={style.draweragentchatoption}>
                            <span>模型</span>
                            <Form.Item
                                name="select"
                            >
                                <Select
                                    placeholder="Select"
                                    onChange={handleChange}
                                    allowClear
                                    style={{
                                        width: '80%',
                                        height: '36px'
                                    }}
                                >
                                    <Option value="male">male</Option>
                                    <Option value="female">female</Option>
                                    <Option value="other">other</Option>
                                </Select>
                            </Form.Item>

                        </div>
                        <div className={style.draweragentchatoption}>
                            <span>名称</span>
                            <Form.Item name="title">
                                <Input placeholder="Basic usage" style={{ width: '80%', height: '36px' }} />
                            </Form.Item>

                        </div>
                        <div className={style.draweragentchatoption}>
                            <span>介绍</span>
                            <Form.Item name="introduce">
                                <Input placeholder="Basic usage" style={{ width: '80%', height: '36px' }} defaultValue={agentinfo.description} />
                            </Form.Item>
                        </div>

                        {/* 角色设置 */}
                        <div className={style.drawertitle}>
                            <div style={{ display: 'flex', alignItems: 'center' }}>
                                <img src="src/assets/imgs/myagent/code.svg" alt="" />
                                &nbsp; &nbsp;
                                <span className={style.drawertitle}>角色设置</span>
                            </div>
                            <img src="src/assets/imgs/myagent/magicpen.svg" alt="" />
                        </div>
                        {/* 多行文本 */}
                        <div className={style.draweragendiv}>
                            <span>指令</span>
                            <Form.Item>
                                <TextArea
                                    onChange={onChange}
                                    placeholder="disable resize"
                                    style={{
                                        width: '80%',
                                        height: 360,
                                        resize: 'none',
                                    }}
                                />
                            </Form.Item>

                        </div>

                        <div className={style.draweragendiv}>
                            <span>开场白</span>
                            <Form.Item
                                name='intro'
                            >
                                <TextArea
                                    onChange={onChange}
                                    defaultValue={agentinfo.intro}
                                    placeholder="disable resize"
                                    style={{
                                        width: '80%',
                                        height: 150,
                                        resize: 'none',
                                    }}
                                    value={agentinfo.intro}
                                />
                            </Form.Item>
                        </div>
                        {/* 推荐问 */}
                        <div className={style.draweragentchatduo}>
                            <span>名称</span>
                            <div style={{ width: '215px' }}>
                                {
                                    agentinfo['faqs'] ? agentinfo['faqs'].map((item: string, index: number) => {
                                        return <div>
                                            <Form.Item name={`faqs${index + 1}`} style={{ width: '99%' }}>
                                                <Input placeholder="请输试列问题"
                                                    defaultValue={item}
                                                    style={{ width: '100%', height: '36px' }} />
                                            </Form.Item>
                                        </div>
                                    }) : ''
                                }



                            </div>
                        </div>



                        <div className={style.drawerbutton}>


                            <CustomButton title='切换为workflow' url={`../Workflow/${id}`}></CustomButton>


                            <Button style={{ backgroundColor: '#F89C34' }} onClick={() => {
                                setOpenDrawer(false)
                                const value = form.getFieldsValue()
                                value.faqs = [value.faqs1, value.faqs2, value.faqs3]
                                delete value.faqs1
                                delete value.faqs2
                                delete value.faqs3
                                formsubmit(value)

                            }}>&nbsp;保存&nbsp;</Button>
                        </div>
                    </div>
                </Form>
            </Drawer>

        </div >
    )
}
