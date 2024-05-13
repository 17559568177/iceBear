import { useUserStore } from '@/store/user';
import { ChatItemType, RoleTypeEnum, useChatStore } from '@/components/GPTBlock/store/useChatStore';
import { copyToClipboard } from '../hooks/copyToClipboard';
import { Avatar, Button, message } from 'antd';
import { StatusEnum } from '@/components/GPTBlock/requests/gpt-api';
import { LoadingOutlined, ReloadOutlined } from '@ant-design/icons';
import dayjs from 'dayjs';
import { Markdown } from './MarkDown';
import style from './index.module.less';

// import { useKeyStore } from '@/components/GPTBlock/store/useKeyStore';
import { ICopyOutlined, IFrownFilled, IFrownOutlined, ISmileFilled, ISmileOutlined } from './IconButton';
import { useState } from 'react';

export const ChatItem = ({ data, questionData }: { data: ChatItemType; questionData: ChatItemType }) => {
    const [name] = useUserStore(state => [state.name]);
    // const [chatName] = useKeyStore(state => [state.model]);
    const [regenerateChat] = useChatStore(state => [state.regenerateChat]);
    // const [appConfig] = useAppStore(state => [state.appConfig]);
    const [like, setLike] = useState<boolean>(false);
    const [dislike, setDislike] = useState<boolean>(false);

    const handleCopy = () => {
        copyToClipboard(data.text);
        message.success('已复制到剪贴板');
    };

    const renderContent = () => {
        if (data.status === StatusEnum.START) {
            return <LoadingOutlined />;
        } else if (data.status === StatusEnum.ERROR) {
            return data.error;
        } else {
            return <Markdown content={data.text} />;
        }
    };

    return (
        <div className={style.chatItem}>
            <div className={`${style.chatItemMain} ${data.role === RoleTypeEnum.USER ? style.rev : void 0}`}>
                {data.role === RoleTypeEnum.USER ? (
                    <>
                        <Avatar style={{ backgroundColor: '#f56a00', verticalAlign: 'middle' }} size="default" gap={4}>
                            {name ? (name.length > 2 ? name.slice(0, 1)?.toUpperCase() : name) : 'U'}
                        </Avatar>
                    </>
                ) : (
                    <>
                        {/* <Avatar style={{ backgroundColor: '#7265e6', verticalAlign: 'middle' }} size="default" gap={4}>
                            {chatName ? (chatName.length > 2 ? chatName.slice(0, 1)?.toUpperCase() : chatName) : 'A'}
                        </Avatar> */}
                        <Avatar src="src/assets/imgs/mobile-logo.svg"></Avatar>
                    </>
                )}
                <div className={`${style.chatItemBlock}  ${data.role === RoleTypeEnum.USER ? style.rev : void 0}`}>
                    <div className={style.chatItemB}>
                        <p className={`${style.chatp}  ${data.role === RoleTypeEnum.USER ? style.prev : void 0}`}>
                            {dayjs(data.dateTime).format('YYYY-MM-DD HH:mm:ss')}
                        </p>
                        <div className={`${style.chatBlock} ${data.role === RoleTypeEnum.USER ? style.rev : void 0}`}>
                            <div className={style.chatMd}>
                                {renderContent()}
                                {[RoleTypeEnum.ASSISTANT].includes(data.role) && (
                                    <div className={style.chatMdFooter}>
                                        <div style={{ display: 'flex', gap: '14px' }}>
                                            {!like ? (
                                                <ISmileOutlined
                                                    onClick={() => {
                                                        setLike(true);
                                                        setDislike(false);
                                                    }}
                                                />
                                            ) : (
                                                <ISmileFilled onClick={() => setLike(false)} />
                                            )}
                                            {!dislike ? (
                                                <IFrownOutlined
                                                    onClick={() => {
                                                        setDislike(true);
                                                        setLike(false);
                                                    }}
                                                />
                                            ) : (
                                                <IFrownFilled onClick={() => setDislike(false)} />
                                            )}

                                            <ICopyOutlined onClick={handleCopy} />
                                        </div>
                                        <div>
                                            <Button
                                                style={{ marginRight: 'auto', marginLeft: '20px' }}
                                                onClick={() => {
                                                    console.log('regenerateChat', questionData);
                                                    regenerateChat(questionData.requestId);
                                                }}
                                            >
                                                {data.status === StatusEnum.START ? (
                                                    <LoadingOutlined />
                                                ) : (
                                                    <ReloadOutlined />
                                                )}
                                                重新生成
                                            </Button>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};
