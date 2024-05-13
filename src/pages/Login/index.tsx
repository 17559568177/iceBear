import { LockOutlined, UserOutlined } from '@ant-design/icons';
import { Button, Form, Input, Layout, message } from 'antd';
import { Content, Footer, Header } from 'antd/es/layout/layout';
import style from './index.module.less';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import fetchLogin, { LoginParams } from './api';
import { useUserStore } from '@/store/user';
const layoutStyle = {
    height: '100%',
    minHeight: '100vh',
    overflow: 'hidden'
};

const headerStyle: React.CSSProperties = {
    textAlign: 'center',
    height: 64,
    paddingInline: 48,
    lineHeight: '64px',
    fontSize: 48,
    margin: '50px 16px'
};

const footerStyle: React.CSSProperties = {
    textAlign: 'center',
    height: '10%'
};

const LoginPage = () => {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);

    const onFinish = async (values: LoginParams) => {
        // console.log('Received values of form: ', values);
        setLoading(true);
        const response = await fetchLogin(values);
        // console.log(response);
        setLoading(false);

        if (response.status === 1) {
            message.success('登录成功');
            useUserStore.setState(() => ({
                role: response?.adminStatus,
                usrId: response?.usrId,
                nickname: response?.nickname,
                name: response?.name
            }));
            // console.log(useUserStore.getState());
            navigate('/assistant'); // 使用history.push进行页面跳转
        } else {
            // 根据不同的错误状态显示不同的错误信息
            const errorMessages: { [key: number]: string } = {
                0: '密码错误',
                2: '用户已停用',
                3: '用户不存在',
                4: '未知错误'
            };
            message.error(errorMessages[response.status] || '发生未知错误');
        }
    };

    return (
        <Layout style={layoutStyle}>
            <Header style={headerStyle}>白熊智数企业大脑</Header>
            <Layout>
                {/* <Sider width="25%" style={{ textAlign: 'center' }}>
                    Sider
                </Sider> */}
                <Content className={style.content}>
                    <div className={style.login}>
                        <Form
                            name="normal_login"
                            className="login-form"
                            initialValues={{ remember: true }}
                            onFinish={onFinish}
                        >
                            <Form.Item
                                name="username"
                                rules={[{ required: true, message: 'Please input your Username!' }]}
                            >
                                <Input
                                    prefix={<UserOutlined className="site-form-item-icon" />}
                                    placeholder="Username"
                                />
                            </Form.Item>
                            <Form.Item
                                name="password"
                                rules={[{ required: true, message: 'Please input your Password!' }]}
                            >
                                <Input
                                    prefix={<LockOutlined className="site-form-item-icon" />}
                                    type="password"
                                    placeholder="Password"
                                />
                            </Form.Item>
                            {/* <Form.Item>
                                <Form.Item name="remember" valuePropName="checked" noStyle>
                                    <Checkbox>Remember me</Checkbox>
                                </Form.Item>
                            </Form.Item> */}

                            <Form.Item>
                                <Button
                                    type="primary"
                                    htmlType="submit"
                                    className="login-form-button"
                                    loading={loading}
                                >
                                    Log in
                                </Button>
                            </Form.Item>
                        </Form>
                    </div>
                </Content>
            </Layout>
            <Footer style={footerStyle}>
                <p style={{ color: 'grey' }}>©白熊智数（北京）科技有限公司，2024，保留一切权利。</p>
            </Footer>
        </Layout>
    );
};

export default LoginPage;
