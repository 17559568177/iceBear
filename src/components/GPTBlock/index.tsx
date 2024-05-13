import { CSSProperties, useEffect, useRef, useState } from 'react';
import style from './index.module.less';
import { useChatStore } from '@/components/GPTBlock/store/useChatStore';
import { Button, Dropdown, FloatButton, Input, InputRef, MenuProps, Modal, message } from 'antd';
import {
    ClearOutlined,
    EllipsisOutlined,
    HistoryOutlined,
    LoadingOutlined,
    SendOutlined
} from '@ant-design/icons';
import { useMobileScreen } from './hooks/useMobileScreen';
import { Textarea } from './component/Texterea';

import { ChatItem } from './component/ChatItem';
import Conversation from './component/Conversation';
// import updataHistoryList from './requests/putHistoryList';
// import { useUserStore } from '@/store/user';

let scrollIntoViewTimeId: ReturnType<typeof setInterval>;

const IconStyle: CSSProperties = {
    fontSize: '24px',
    fontWeight: '700',
    cursor: 'pointer'
};

const items: MenuProps['items'] = [
    {
        key: '1',
        label: (
            <>
                <ClearOutlined /> 清空消息
            </>
        )
    },
    {
        key: '2',
        label: (
            <>
                <HistoryOutlined /> 创建新对话
            </>
        )
    }
];

const Footer = () => {
    const [userInput, setUserInput] = useState('');
    const newChatNameRef = useRef<InputRef>(null);
    const [
        sendUserMessage,
        isStream,
        addConversation,
        clearCurrentConversation,
        stopStream,
        currentChatData,
        setStream
    ] = useChatStore(state => [
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

    const [modal, contextHolder] = Modal.useModal();

    const isMobileScreen = useMobileScreen();
    const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
        if (e.code === 'Enter' && !e.shiftKey && userInput.replace(/\n/g, '')) {
            handleSendUserMessage();
        }
    };

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
        setStream(false);
    }, [setStream]);

    const confirmModal = () => {
        modal.confirm({
            title: '新建对话',
            icon: <HistoryOutlined />,
            content: <Input ref={newChatNameRef} />,
            okText: '确认',
            cancelText: '取消',
            onOk: () => addConversation(newChatNameRef.current?.input?.value ?? '新话题')
        });
    };

    const dropDownOnClick: MenuProps['onClick'] = ({ key }) => {
        switch (key) {
            case '1':
                if (confirm('你确定要清除所有的消息吗？')) {
                    clearCurrentConversation();
                    setUserInput('');
                }
                break;
            case '2':
                confirmModal();
                console.log('currentConversation', currentConversation);

                break;
            default:
                message.info('Error Click!');
        }
    };

    return (
        <footer>
            <div className={style.footer}>
                <Dropdown menu={{ items, onClick: dropDownOnClick }}>
                    <a onClick={e => e.preventDefault()}>
                        <Button type="primary">
                            <EllipsisOutlined style={IconStyle} />
                        </Button>
                    </a>
                </Dropdown>
                <Textarea
                    ref={textAreaRef}
                    onKeyPress={handleKeyDown}
                    disabled={isStream}
                    value={userInput}
                    placeholder={isMobileScreen ? '来说点什么...' : '来说点什么...（Shift + Enter = 换行）'}
                    onChange={val => setUserInput(val.target.value)}
                />
                <Button
                    type="primary"
                    disabled={isStream || !userInput.replace(/\n/g, '')}
                    onClick={() => {
                        handleSendUserMessage();
                    }}
                >
                    <span>{!isStream ? <SendOutlined style={IconStyle} title="发送" /> : <LoadingOutlined />}</span>
                </Button>
                {isStream && (
                    <div>
                        <Button onClick={() => stopStream()}>
                            停止生成
                        </Button>
                    </div>
                )}
            </div>
            {contextHolder}
        </footer>
    );
};

const ChatBody = () => {
    const [isStream, currentChatData] = useChatStore(state => [state.isStream, state.currentChatData()]);

    const bottomRef = useRef<HTMLDivElement>(null);
    const mainRef = useRef<HTMLDivElement>(null);

    const [modal, contextHolder] = Modal.useModal();

    const scrollLastMessageIntoView = (behavior: ScrollBehavior = 'smooth') => {
        if (!bottomRef.current) return;
        bottomRef.current.scrollIntoView({ behavior, block: 'end' });
    };

    const confirm = () => {
        modal.confirm({
            title: '历史对话',
            icon: <HistoryOutlined />,
            content: <Conversation />,
            okText: '确认',
            cancelText: '取消',
            onOk: () => {
                // const historyList = useChatStore.getState().conversationList.map(item => ({
                //     historyId: item.uuid,
                //     historyTitle: item.title
                // }));
                // const params = {
                //     historyList: historyList,
                //     usrId: useUserStore.getState().usrId,
                //     type: 'personal_assistant'
                // };
                // updataHistoryList(params);
            }
        });
    };

    useEffect(() => {
        scrollLastMessageIntoView('auto');
    }, []);

    // 自动跟踪信息
    useEffect(() => {
        if (isStream) {
            scrollLastMessageIntoView();
            // scrollIntoViewTimeId = setInterval(() => {
            //     scrollLastMessageIntoView();
            // }, 1000);
        } else {
            clearInterval(scrollIntoViewTimeId);
        }
    }, [isStream]);

    return (
        <div className={style.chatMain} ref={mainRef}>
            <main className={style.main} ref={bottomRef}>
                {currentChatData.length === 0 && <div className={style.title}>开始提问吧～</div>}
                {currentChatData.map((item, index) => (
                    <ChatItem key={index} data={item} questionData={currentChatData[index - 1]} />
                ))}
            </main>
            <FloatButton.Group shape="circle">
                <FloatButton icon={<HistoryOutlined />} type="primary" onClick={confirm} />
                <FloatButton.BackTop type="primary" visibilityHeight={0} target={() => mainRef.current!} />
            </FloatButton.Group>
            {contextHolder}
        </div>
    );
};

const GPTBlock = () => {
    return (
        <div className={style.gptMain}>
            <ChatBody />
            <Footer />
        </div>
    );
};

export default GPTBlock;
