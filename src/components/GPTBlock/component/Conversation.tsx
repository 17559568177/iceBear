import React, { useState } from 'react';

import { useChatStore } from '../store/useChatStore';
import { Input, List } from 'antd';
import { ScrollArea } from './ScrollArea';
import style from './index.module.less';
import { CheckOutlined, CloseOutlined, DeleteOutlined, EditOutlined } from '@ant-design/icons';

const ConversationList = ({ onChange }: { onChange?: () => void }) => {
    const [conversationList, switchConversation, delConversation, editConversation, currentConversation] = useChatStore(
        state => [
            state.conversationList,
            state.switchConversation,
            state.delConversation,
            state.editConversation,
            state.currentConversation
        ]
    );

    const [editTitle, setEditTitle] = useState('');
    const [inEditId, setInEditId] = useState('');

    const handleEditConversation = () => {
        setInEditId('');
        setEditTitle('');
        editConversation(inEditId, { title: editTitle });
        // e?.stopPropagation();
        onChange?.();
    };

    const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
        if (event.code == 'Enter') {
            handleEditConversation();
        }
    };

    return (
        <div className={style.conversationList}>
            <ScrollArea>
                <List
                    dataSource={conversationList}
                    renderItem={item => (
                        <List.Item>
                            <div
                                className={style.conversationListItem}
                                style={item.uuid === currentConversation.uuid ? { color: '#F89C34' } : {}}
                            >
                                {inEditId === item.uuid ? (
                                    <>
                                        <Input
                                            value={editTitle}
                                            autoFocus
                                            onChange={e => setEditTitle(e.target.value)}
                                            onKeyDown={handleKeyDown}
                                            style={{ marginRight: '10px' }}
                                        />

                                        <CloseOutlined
                                            className={style.iconStyle}
                                            onClick={() => {
                                                setInEditId('');
                                                setEditTitle('');
                                            }}
                                        />
                                        <CheckOutlined className={style.iconStyle} onClick={handleEditConversation} />
                                    </>
                                ) : (
                                    <>
                                        <p
                                            onClick={() => {
                                                switchConversation(item.uuid);
                                                onChange?.();
                                            }}
                                            style={{ cursor: 'pointer' }}
                                        >
                                            {item.title}
                                        </p>
                                        <div>
                                            <EditOutlined
                                                className={style.iconStyle}
                                                onClick={e => {
                                                    setInEditId(item.uuid);
                                                    setEditTitle(item.title);
                                                    e.stopPropagation();
                                                }}
                                            />
                                            <DeleteOutlined
                                                className={style.iconStyle}
                                                onClick={e => {
                                                    if (confirm('确定删除该对话吗？')) {
                                                        delConversation(item.uuid);
                                                        e.stopPropagation();
                                                    }
                                                }}
                                            />
                                        </div>
                                    </>
                                )}
                            </div>
                        </List.Item>
                    )}
                />
            </ScrollArea>
        </div>
    );
};

const Conversation = ({ onChange }: { onChange?: () => void }) => {
    return <ConversationList onChange={onChange} />;
};

export default Conversation;
