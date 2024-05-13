import { useState, memo, useEffect } from 'react'
import style from './css/index.module.less'
import { Layout, Input, Dropdown, Space, message } from 'antd';
import Sider from 'antd/es/layout/Sider';
import { SearchOutlined } from '@ant-design/icons';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import { useUserStore } from '@/store/user';
import { AgentAvatarnum } from './components/methods'
import BASE_URL from './Api/api'




const { Content } = Layout;



export default function index() {

    const navigate = useNavigate();
    const location = useLocation();

    const [collapsed, setCollapsed] = useState<boolean>(true);
    const width = collapsed ? '80px' : '371px'
    const CustomerOptions = [
        {
            CustomerOptionsurl: 'AgentApplicationCenter', img: 'src/assets/imgs/global.svg'
        },
        {
            CustomerOptionsurl: 'Agentcollection', img: 'src/assets/imgs/star.svg'
        },
        {
            CustomerOptionsurl: 'AgentApplicationCenter', img: 'src/assets/imgs/setting.svg'
        }
    ]
    const [CustomerOptionsIndex, setCustomerOptionsIndex] = useState<number>(-1)
    const [AgentAccessList, setAgentAccessList] = useState<any[]>([])

    const [agentinfo, setagentinfo] = useState<any>({})



    useEffect(() => {
        try {
            fetch(BASE_URL + 'rag/get_myAgents/', {
                method: 'POST',
                body: JSON.stringify({
                    userId: useUserStore.getState().usrId
                })
            }).then(response => response.json())
                .then(data => {
                    data.agents[0].agentId = 15
                    setAgentAccessList(data.agents)
                });

        }
        catch {
            message.error('出错了');
            console.log('请求失败')
        }
    }, [location.key])

    const items = [
        {
            label: '复制',
            key: '1',
        },
        {
            label: '置顶',
            key: '2',
        },
        {
            label: <span style={{ color: 'red' }}>删除</span>,
            key: '3',
        },
    ];

    const onClick = ({ key }: any) => {
        if (key === '1') {
            try {
                fetch(BASE_URL + 'rag/duplicate_agent/', {
                    method: 'POST',
                    body: JSON.stringify({
                        userId: useUserStore.getState().usrId,
                        agentId: agentinfo.agentId
                    })
                }).then(response => response.json())
                    .then(response => {
                        console.log(response, '123456')
                    })
            }
            catch (error) {
                console.log(error)
                message.error('出错了');
            }
            console.log(agentinfo, '123456789')
        }
    };



    const Userchatlist = memo(() => {
        return (
            <div className={style.Sidenavigationbaruser}>

                <div className={style.SidenavigationbaruserInput}>
                    <Input size="large" placeholder="搜索历史聊天" style={{ fontSize: '13px' }} prefix={<SearchOutlined style={{ color: '#D9D9D9' }} />} />
                </div>
                <div>
                    {
                        AgentAccessList.map((item, index) => {
                            return <div className={style.Sidenavigationbaritem} key={index} onClick={(e) => {
                                e.stopPropagation();
                                setCustomerOptionsIndex(-1)
                                navigate(`AgentChatpage/${item.agentId}`);

                                setagentinfo(item)
                            }}>
                                <div style={{ width: '238px', height: '41px', margin: '0 auto', display: 'flex', position: 'relative' }}>
                                    <div style={{ width: '41px', height: '41px', marginRight: '10px' }}>
                                        <img src={AgentAvatarnum(item.avatar)} alt="" />
                                    </div>
                                    <div>
                                        <p style={{ fontSize: '15px' }}>{item.avatar}</p>
                                        <p style={{ fontSize: '12px', marginTop: '4px', color: '#929292' }}>{item.description}</p>
                                        <div style={{ top: '0', right: '0', position: 'absolute', color: '#929292', fontSize: '13px' }}>14:30</div>
                                        <div className={style.agentedit}>
                                            <Dropdown
                                                placement="bottomLeft"
                                                menu={{
                                                    items,
                                                    onClick,
                                                }}
                                            >
                                                <a onClick={(e) => {
                                                    e.preventDefault()
                                                }}>
                                                    <Space style={{ color: '#929292' }}>
                                                        ...
                                                    </Space>
                                                </a>
                                            </Dropdown>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        })
                    }

                </div>
            </div>
        )
    })






    return (
        <Layout style={{ height: '100%', width: '100%' }}>
            <Sider width={width} style={{ backgroundColor: '#F7F7F7', display: 'flex' }}>
                <div className={style.siderleft}>
                    {/* style={{ borderRight: '1px solid #cecece' }} */}
                    <div>
                        <div style={{ width: '36px', height: '36px', margin: '16px auto', backgroundColor: '#292D32D9', borderRadius: '8px' }}>
                            <img src="src/assets/imgs/add-circle.svg" style={{ width: '14px', height: '14px', margin: '11px' }} />
                        </div>
                        <img src="src/assets/imgs/arrow-right.svg" style={{ width: '16px', height: '15px', margin: '0px 30px' }}
                            onClick={() => setCollapsed(!collapsed)} />
                    </div>

                    <div style={{ width: '80px', position: 'relative', display: 'flex', flexWrap: 'wrap', alignContent: 'space-between', justifyContent: 'center' }}>
                        {
                            CustomerOptions.map((item, index) => {
                                return (
                                    <div style={{
                                        width: '60px', height: '60px', borderRadius: '10px', textAlign: 'center', lineHeight: '75px',
                                        backgroundColor: CustomerOptionsIndex === index ? '#EAECED' : ''
                                    }}
                                        onClick={() => {
                                            setCustomerOptionsIndex(index)
                                            navigate({ pathname: item.CustomerOptionsurl })

                                        }}>
                                        <img src={item.img} alt="" />
                                    </div>
                                )
                            })
                        }
                    </div>
                </div>

                {
                    collapsed ? null : <Userchatlist></Userchatlist>
                }


            </Sider>
            <Content className={style.Agentcontent}>

                <Outlet></Outlet>



            </Content>
        </Layout >



    )
}
