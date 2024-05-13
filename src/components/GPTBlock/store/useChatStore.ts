import { create } from 'zustand';
import { StatusEnum, streamAPI } from '../requests/gpt-api';
import { persist } from 'zustand/middleware';
import { StoreKey } from '../contants';
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import { v4 as uuidv4 } from 'uuid';

// import updataCurConversation from '../requests/patchCurConversation';

export type ConversationType = {
    uuid: string;
    title: string;
    system: string;
};

export enum RoleTypeEnum {
    USER = 'user',
    ASSISTANT = 'assistant',
    SYSTEM = 'system'
}

export type ChatItemType = {
    id: string;
    text: string;
    error?: string;
    role: RoleTypeEnum;
    useful?: number;
    advice?: string;
    dateTime: string;
    messageId?: string;
    requestId: string;
    status?: StatusEnum;
};

interface ChatState {
    isStream: boolean; // 用于控制聊天进程状态，非流式聊天
    currentConversation: ConversationType;
    conversationList: ConversationType[];
    chatDataMap: Record<string, ChatItemType[]>;
    initConversationList: (historyList: DefaultConversationType[]) => void;
    putConversationList: (historyList: DefaultConversationType[]) => void;
    addConversation: (title?: string, icon?: string, system?: string) => void;
    switchConversation: (id: string) => void;
    patchCurConversation: (id: string) => Promise<void>;
    clearCurrentConversation: () => void;
    editConversation: (id: string, data: Partial<ConversationType>) => void;
    delConversation: (id: string) => void;
    sendUserMessage: (message: string) => void;
    regenerateChat: (requestId: string) => void;
    currentChatData: () => ChatItemType[];
    stopStream: () => void;
    setStream: (val: boolean) => void;
    chatProgress: (message: string, requestId: string, lastId: string, chatIndex: number, id: string) => void;
}

const DefaultConversation = {
    uuid: uuidv4(),
    title: '新话题',
    system: ''
};

export type DefaultConversationType = typeof DefaultConversation;

const initialState = {
    isStream: false,
    currentConversation: DefaultConversation,
    conversationList: [DefaultConversation],
    chatDataMap: {}
};

export const useChatStore = create<ChatState>()(
    persist(
        (set, get) => ({
            ...initialState,
            initConversationList(historyList) {
                historyList &&
                    set(() => ({
                        conversationList: historyList,
                        currentConversation: historyList?.[0]
                    }));
            },
            putConversationList(historyList) {
                set(() => ({
                    conversationList: historyList
                }));
            },
            addConversation(title = '新话题', system = '') {
                const uuid = uuidv4();

                const newConversation = { title, uuid, system };

                set(state => ({
                    currentConversation: newConversation,
                    conversationList: [newConversation, ...state.conversationList],
                    chatDataMap: {
                        [uuid]: system
                            ? [
                                  {
                                      id: uuidv4(),
                                      text: system,
                                      role: RoleTypeEnum.SYSTEM,
                                      dateTime: new Date().toISOString(),
                                      requestId: ''
                                  }
                              ]
                            : [],
                        ...state.chatDataMap
                    }
                }));
            },
            switchConversation(id: string) {
                set(state => ({
                    currentConversation: state.conversationList.find(item => item.uuid === id)
                }));
                get()
                    .patchCurConversation(id)
                    .then(() => {
                        console.log('Conversation data patched', get().currentConversation);
                    })
                    .catch(error => {
                        console.error('Error patching conversation data:', error);
                    });
            },
            patchCurConversation: async () => { 
            // patchCurConversation: async (id: string) => {
                // try {
                //     const response = await updataCurConversation({ id });
                //     set(state => ({
                //         chatDataMap: response
                //             ? {
                //                   ...state.chatDataMap,
                //                   [id]: response
                //               }
                //             : { ...state.chatDataMap }
                //     }));
                // } catch (error) {
                //     console.error('Failed to patch conversation data:', error);
                //     throw error;
                // }
            },
            clearCurrentConversation() {
                const { uuid } = get().currentConversation;
                set(state => ({
                    chatDataMap: {
                        ...state.chatDataMap,
                        [uuid]: []
                    }
                }));
            },
            editConversation(id: string, data: Partial<ConversationType>) {
                const newConversationList = get().conversationList.map(item => {
                    if (item.uuid == id) {
                        return {
                            ...item,
                            ...data
                        };
                    } else {
                        return item;
                    }
                });

                set(() => ({
                    conversationList: newConversationList
                }));
            },
            delConversation(id: string) {
                console.log('0', id);

                let newConversationList = get().conversationList.filter(item => item.uuid !== id);
                if (newConversationList.length === 0) {
                    newConversationList = [DefaultConversation];
                }
                const newChatDataMap = get().chatDataMap;

                delete newChatDataMap[id];

                set(() => ({
                    chatDataMap: newChatDataMap,
                    conversationList: newConversationList
                }));

                if (id === get().currentConversation.uuid) {
                    set({ currentConversation: newConversationList[0] });
                }
            },
            chatProgress(message: string, requestId: string, lastId = '', chatIndex: number, id: string) {
                const currentChatData = get().currentChatData();
                const chatData = get().currentChatData();
                const chatDataMap = get().chatDataMap;
                const currentConversationId = get().currentConversation.uuid;
                chatDataMap[currentConversationId] = chatData;

                streamAPI.send({
                    message: message,
                    requestId,
                    lastId,
                    onProgress: data => {
                        currentChatData[currentChatData.length - 1] = {
                            id,
                            text: data.messages!,
                            role: RoleTypeEnum.ASSISTANT,
                            useful: 0,
                            advice: '',
                            status: StatusEnum.PENDING,
                            dateTime: new Date().toISOString(),
                            messageId: data.id,
                            requestId
                        };
                        set({ chatDataMap });
                    },
                    onFinish: data => {
                        currentChatData[chatIndex] = {
                            ...currentChatData[chatIndex],
                            text: data.messages ?? data.content!,
                            requestId: data.liId!,
                            status: StatusEnum.SUCCESS
                        };
                        set({ chatDataMap, isStream: false });
                    },
                    onError: reason => {
                        currentChatData[chatIndex] = {
                            ...currentChatData[chatIndex],
                            error: reason,
                            status: StatusEnum.ERROR
                        };
                        set({ chatDataMap, isStream: false });
                    }
                });
            },
            sendUserMessage(message: string) {
                const chatData = get().currentChatData();
                const requestId = uuidv4();
                const id = uuidv4();

                const newChatData = [
                    ...chatData,
                    {
                        text: message,
                        role: RoleTypeEnum.USER,
                        dateTime: new Date().toISOString(),
                        requestId,
                        id: uuidv4()
                    },
                    {
                        id,
                        text: '',
                        role: RoleTypeEnum.ASSISTANT,
                        dateTime: new Date().toISOString(),
                        requestId,
                        status: StatusEnum.START
                    }
                ];
                const chatDataMap = get().chatDataMap;
                const currentConversationId = get().currentConversation.uuid;
                chatDataMap[currentConversationId] = newChatData;
                set({ chatDataMap, isStream: true });

                const lastId = chatData.filter(item => item.role === RoleTypeEnum.ASSISTANT)?.pop()?.messageId || '';

                get().chatProgress(message, requestId, lastId, newChatData.length - 1, id);
            },
            regenerateChat(requestId) {
                const chatData = get().currentChatData();
                const chatDataMap = get().chatDataMap;
                const currentConversationId = get().currentConversation.uuid;
                const id = uuidv4();

                const userInputIndex = chatData.findIndex(
                    item => item.role === RoleTypeEnum.USER && item.requestId === requestId
                );
                const userInputText = chatData[userInputIndex].text;

                const lastId =
                    chatData
                        .slice(0, userInputIndex)
                        .filter(item => item.role === RoleTypeEnum.ASSISTANT)
                        ?.pop()?.messageId || '';

                const assistantIndex = chatData.findIndex(
                    item => item.role === RoleTypeEnum.ASSISTANT && item.requestId === requestId
                );

                chatData[assistantIndex] = {
                    ...chatData[assistantIndex],
                    status: StatusEnum.START
                };
                chatDataMap[currentConversationId] = chatData;
                set({ chatDataMap });

                get().chatProgress(userInputText, requestId, lastId, assistantIndex, id);
            },
            currentChatData() {
                return get().chatDataMap[get().currentConversation.uuid] || [];
            },
            stopStream() {
                streamAPI.abort();
                set({ isStream: true });
            },
            setStream(val) {
                set({ isStream: val });
            }
        }),
        {
            name: StoreKey.Chat
        }
    )
);
