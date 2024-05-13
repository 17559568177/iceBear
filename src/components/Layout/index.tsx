import { Avatar, Dropdown, Layout, Menu, MenuProps, Space } from 'antd';
import { Content, Header } from 'antd/es/layout/layout';
import { useEffect, useMemo, useState } from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import style from './index.module.less';
import { UserOutlined } from '@ant-design/icons';
import { useUserStore } from '@/store/user';
import Button from './button';
const items: MenuProps['items'] = [
    {
        label: '权限管理',
        key: '/permissions'
    },
    {
        label: '个人助理',
        key: '/assistant'
    },
    // {
    //     label: '规章查询',
    //     key: '/violation'
    // },
    {
        label: '知识库',
        key: '/repository'
    },
    {
        label: 'AI仿写',
        key: '/writing'
    },
    {
        label: 'Workflow',
        key: '/myagent/workflow'
    },
    {
        label: <Button></Button>,
        key: '/myagent',
        className: 'myagent',
    }
];

const ILayout: React.FC = () => {
    const [current, setCurrent] = useState('/assistant');

    const [screenWidth, setScreenWidth] = useState(false);

    const navigate = useNavigate();
    const avatarItems: MenuProps['items'] = [
        {
            label: (
                <div>
                    <p>账号：{useUserStore.getState().nickname}</p>
                    <p>姓名：{useUserStore.getState().name}</p>
                    <p>
                        身份：
                        {useUserStore.getState().role.toString() == '2'
                            ? '超级管理员'
                            : useUserStore.getState().role.toString() == '1'
                                ? '管理员'
                                : '用户'}
                    </p>
                </div>
            ),
            key: '1'
        },
        {
            label: '退出登录',
            key: '2',
            danger: true
        }
    ];
    useEffect(() => {
        // 定义处理屏幕尺寸变化的函数
        const handleResize = () => {
            console.log(window.innerWidth);

            setScreenWidth(window.innerWidth < 768 ? true : false);
        };

        window.addEventListener('resize', handleResize);

        return () => {
            window.removeEventListener('resize', handleResize);
        };
    }, []);

    const onClick: MenuProps['onClick'] = e => {
        navigate(e.key, { replace: true });
        setCurrent(e.key);
    };

    const avatarOnClick: MenuProps['onClick'] = e => {
        if (e.key === '2') {
            navigate('/login');
        }
    };

    const permissionVaild = useMemo(() => {
        let initItems = items;
        if (useUserStore.getState().role !== 2) {
            initItems = items.filter(item => item?.key !== '/permissions');
        }
        return initItems;
    }, []);

    return (
        <Layout style={{ height: '100vh' }}>
            <Header className={style.header}>
                <div className={style.logo}>
                    {screenWidth ? (
                        <img src="src/assets/imgs/mobile-logo.svg" alt="logo" />
                    ) : (
                        <img src="src/assets/imgs/logo.svg" alt="logo" />
                    )}
                </div>
                <div className={style.menu}>
                    <Menu
                        mode="horizontal"
                        items={permissionVaild}
                        selectedKeys={[current]}
                        style={{ flex: 'auto', minWidth: 0 }}
                        onClick={onClick}
                    />
                    <Dropdown menu={{ items: avatarItems, onClick: avatarOnClick }}>
                        <a onClick={e => e.preventDefault()}>
                            <Space>
                                <Avatar
                                    style={{ backgroundColor: '#f56a00', verticalAlign: 'middle', marginBottom: '4px' }}
                                    size={{ sm: 24, md: 30, lg: 36 }}
                                    gap={2}
                                    icon={<UserOutlined />}
                                >
                                    {'user'}
                                </Avatar>
                            </Space>
                        </a>
                    </Dropdown>
                </div>
            </Header>
            <Content style={{ height: '100%' }}>
                <Outlet />
            </Content>
        </Layout>
    );
};

export default ILayout;
