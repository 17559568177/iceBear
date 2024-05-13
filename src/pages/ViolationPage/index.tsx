import { Button, Col, Input, InputRef, Layout, MenuProps, Modal, Row, message } from 'antd';
import { Content } from 'antd/es/layout/layout';

import GPTBlock from '@/components/GPTBlock';
import { CSSProperties, useEffect, useRef, useState } from 'react';
import initHistoryList from '@/components/GPTBlock/requests/fetchHistoryList';

import { useUserStore } from '@/store/user';
import { CommentOutlined, HistoryOutlined, LoadingOutlined, SendOutlined } from '@ant-design/icons';

import TextArea from 'antd/es/input/TextArea';
import { useChatStore } from '@/components/GPTBlock/store/useChatStore';
// import { useMobileScreen } from '@/components/GPTBlock/hooks/useMobileScreen';

const IconStyle: CSSProperties = {
    fontSize: '24px',
    fontWeight: '700',
    cursor: 'pointer'
};

const StartBlock = ({ handleStartStatusChange }: { handleStartStatusChange: any }) => {
    const [userInput, setUserInput] = useState('');
    const newChatNameRef = useRef<InputRef>(null);
    const [sendUserMessage, isStream, addConversation, clearCurrentConversation, currentChatData, setStream] =
        useChatStore(state => [
            state.sendUserMessage,
            state.isStream,
            state.addConversation,
            state.clearCurrentConversation,
            state.stopStream,
            state.currentChatData(),
            state.setStream
        ]);

    const [currentConversation, editConversation] = useChatStore(state => [
        state.currentConversation,
        state.editConversation
    ]);

    const questionList = [
        '问题1',
        '问题2',
        '问题3',
        '问题4',
        '问题5',
        '问题6',
        '问题7',
        '问题8',
        '问题9',
        '问题10',
        '问题11',
        '问题12'
    ];

    // const [modal, contextHolder] = Modal.useModal();

    // const isMobileScreen = useMobileScreen();
    // const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    //     if (e.code === 'Enter' && !e.shiftKey && userInput.replace(/\n/g, '')) {
    //         handleSendUserMessage();
    //     }
    // };

    const handleSendUserMessage = async () => {
        if (!currentChatData.length) {
            editConversation(currentConversation.uuid, { title: userInput });
        }
        sendUserMessage(userInput);
        setUserInput('');
        setTimeout(() => {
            textAreaRef.current?.focus();
        }, 1000);
    };

    const textAreaRef = useRef<HTMLTextAreaElement>(null);

    useEffect(() => {
        // setStream(false);
        // check permission
        const usrId = useUserStore.getState().usrId;
        if (usrId === 'Guest') {
            // jump to login page
            window.location.href = '/login';
        }
    }, [setStream]);

    const confirmModal = () => {
        Modal.confirm({
            title: '新建对话',
            icon: <HistoryOutlined />,
            content: <Input ref={newChatNameRef} />,
            okText: '确认',
            cancelText: '取消',
            onOk: () => addConversation(newChatNameRef.current?.input?.value ?? '新话题')
        });
    };

    // const dropDownOnClick: MenuProps['onClick'] = ({ key }) => {
    //     switch (key) {
    //         case '1':
    //             if (confirm('你确定要清除所有的消息吗？')) {
    //                 clearCurrentConversation();
    //                 setUserInput('');
    //             }
    //             break;
    //         case '2':
    //             confirmModal();
    //             console.log('currentConversation', currentConversation);

    //             break;
    //         default:
    //             message.info('Error Click!');
    //     }
    // };

    const handleQuestionSelection = ({ question }: { question: string }) => {
        setUserInput(question);
        // handleSendUserMessage();
        console.log('question', question);
    };

    return (
        <div
            style={{
                display: 'flex',
                flexDirection: 'column',
                gap: '10px',
                justifyContent: 'space-between',
                height: '100%'
            }}
        >
            <Row
                gutter={[16, 16]}
                justify="center"
                style={{ marginRight: '15%', marginLeft: '15%', alignContent: 'center', textAlign: 'center' }}
            >
                <Col span={10}>
                    <img src="src/assets/imgs/mobile-logo.svg" style={{ width: '150px' }} />
                </Col>
                <Col span={6} style={{ marginTop: '25px' }}>
                    <Row style={{ fontSize: '20px' }}>
                        <strong>企业大脑</strong>
                    </Row>
                    <Row style={{ color: 'grey', marginTop: '5px' }}>你的AI好帮手</Row>
                </Col>
            </Row>
            <Row
                gutter={[16, 16]}
                justify="center"
                style={{
                    marginRight: '30%',
                    marginLeft: '30%',
                    alignContent: 'center',
                    textAlign: 'center',
                    alignItems: 'center'
                }}
            >
                <Col span={8}>
                    <img src="src/assets/imgs/ai-1.png" style={{ width: '80px' }} />
                    <Row style={{ justifyContent: 'center' }}>日常办公</Row>
                    <Row style={{ justifyContent: 'center', color: 'grey' }}>工作时间、文档合同等</Row>
                </Col>
                <Col span={8}>
                    <img src="src/assets/imgs/ai-2.png" style={{ width: '80px' }} />
                    <Row style={{ justifyContent: 'center' }}>人力资源</Row>
                    <Row style={{ justifyContent: 'center', color: 'grey' }}>员工档案、离职流程等</Row>
                </Col>
                <Col span={8}>
                    <img src="src/assets/imgs/ai-3.png" style={{ width: '80px' }} />
                    <Row style={{ justifyContent: 'center' }}>日常办公</Row>
                    <Row style={{ justifyContent: 'center', color: 'grey' }}>设备维护、会议安排等</Row>
                </Col>
            </Row>
            <Row
                gutter={[16, 16]}
                justify="center"
                style={{
                    marginRight: '30%',
                    marginLeft: '30%',
                    alignContent: 'center',
                    textAlign: 'center',
                    color: 'orange'
                }}
            >
                <CommentOutlined></CommentOutlined>试着问我以下问题或输入你的问题
            </Row>
            <Row
                gutter={[16, 16]}
                justify="center"
                style={{ marginRight: '30%', marginLeft: '30%', alignContent: 'center', textAlign: 'center' }}
            >
                {questionList.map((question, index) => (
                    <Col key={index} xs={24} sm={12} md={8} lg={6}>
                        <Button
                            type="default"
                            style={{ width: '100%', borderColor: 'orange' }}
                            onClick={() => {
                                handleQuestionSelection({ question: question });
                            }}
                        >
                            {question}
                        </Button>
                    </Col>
                ))}
            </Row>
            <Row
                gutter={[16, 16]}
                justify="center"
                style={{
                    marginRight: '30%',
                    marginLeft: '30%',
                    marginTop: 'auto',
                    marginBottom: '20px',
                    alignContent: 'center',
                    textAlign: 'center',
                    alignItems: 'center'
                }}
            >
                <Col span={20}>
                    <TextArea
                        // ref={textAreaRef}
                        // onKeyDown={handleKeyDown}
                        // disabled={isStream}
                        value={userInput}
                        placeholder={'来说点什么...(Shift + Enter = 换行）'}
                        onChange={val => setUserInput(val.target.value)}
                    />
                </Col>
                <Col span={2}>
                    <Button
                        type="primary"
                        // disabled={isStream || !userInput.replace(/\n/g, '')}
                        onClick={() => {
                            addConversation('新话题');
                            handleStartStatusChange();
                            handleSendUserMessage();
                        }}
                    >
                        {!isStream ? <SendOutlined style={IconStyle} title="发送" /> : <LoadingOutlined />}
                    </Button>
                </Col>
            </Row>
        </div>
    );
};

const ViolationPage = () => {
    const [isStart, setIsStart] = useState(true);

    useEffect(() => {
        const params = { usrId: useUserStore.getState().usrId, type: 'personal_assistant' };
        initHistoryList(params);
    }, []);

    return (
        <Layout style={{ height: '100%' }}>
            <Content>
                {isStart ? (
                    <StartBlock
                        handleStartStatusChange={() => {
                            setIsStart(false);
                            console.log('isStart', isStart);
                        }}
                    />
                ) : (
                    <GPTBlock />
                )}
            </Content>
        </Layout>
    );
};

export default ViolationPage;
