// import request from '@/service';

import { useChatStore } from '../store/useChatStore';
import { useKeyStore } from '../store/useKeyStore';
import isEmpty from '../utils/isEmpty';
import { useUserStore } from '@/store/user';

export enum StatusEnum {
    START = 'start',
    PENDING = 'pending',
    SUCCESS = 'success',
    ERROR = 'error',
    ABORT = 'abort'
}

interface StreamResponseType {
    messages?: string;
    id?: string;
    liId?: string;
    role?: string;
    content?: string;
    // choices: { message: { user: string; content: string } }[];
}

type SendMessageType = {
    message: string;
    modelId?: string;
    requestId?: string;
    lastId?: string;
    onProgress: (_: StreamResponseType) => void;
    onFinish: (_: StreamResponseType) => void;
    onError: (_: string) => void;
};

// type SimplifiedChatItemType = {
//     role: RoleTypeEnum;
//     content: string;
// };

type sendDataType = {
    usrId: string;
    historyId: string;
    config: {
        model: string;
        // temperature: number;
        multiplicity: number;
        recType: number;
        searchType: number;
        // maxToken: number;
        platformSearch: boolean;
        knowledgeSearch: boolean;
        repository: string[];
    };
    message: {
        content: string;
    };
    stream: boolean;
};

// type responseDataType = {
//     ok: boolean;
//     reply: {
//         liId: string;
//         content: string;
//         role: string;
//     };
//     body: {
//         message: string;
//     };
// };

// const convertToGPTFormat = (record: Record<string, ChatItemType[]>, uuid: string): SimplifiedChatItemType[] =>
//     record?.[uuid]
//         .flat()
//         .filter(item => item.role !== RoleTypeEnum.ASSISTANT)
//         .map(({ role, text }) => ({ role, content: text }));

// function extractContentFromString(str: string): any[] {
//     const idRegex = /"id":"(.*?)"/g;
//     const contentRegex = /"content":"(.*?)"/g;
//     const ids = [];
//     const contents: any[] = [];
//     let match;

//     // 提取所有的id
//     while ((match = idRegex.exec(str)) !== null) {
//         ids.push(match[1]);
//     }

//     // 提取所有的content
//     while ((match = contentRegex.exec(str)) !== null) {
//         contents.push(match[1]);
//     }

//     // // 组合id和content
//     // const result = ids.map((id, index) => {
//     //     return { id: id, content: contents[index] || '' };
//     // });

//     return [ids, contents];
// }
export default class StreamAPI {
    private _status: string;

    constructor() {
        this._status = StatusEnum.START;
    }

    set status(status) {
        this._status = status;
    }

    get status() {
        return this._status;
    }

    abort() {
        this.status = StatusEnum.ABORT;
    }

    async send({ message, onProgress, onFinish, onError }: SendMessageType) {
        this.status = StatusEnum.START;
        // const beforeMsg = convertToGPTFormat(
        //     useChatStore.getState().chatDataMap,
        //     useChatStore.getState().currentConversation.uuid
        // );

        const sendData = {
            usrId: useUserStore.getState().usrId,
            historyId: useChatStore.getState().currentConversation.uuid,
            config: {
                model: useKeyStore.getState().model,
                // temperature: useKeyStore.getState().temperature,
                multiplicity: useKeyStore.getState().multiplicity,
                recType: useKeyStore.getState().recType,
                searchType: useKeyStore.getState().searchType,
                // maxToken: useKeyStore.getState().maxToken,
                platformSearch: useKeyStore.getState().platformSearch,
                knowledgeSearch: useKeyStore.getState().knowledgeSearch,
                repository: useKeyStore.getState().repository,
                style: useKeyStore.getState().style
            },
            message: { content: message },
            stream: useKeyStore.getState().isStream
        } as sendDataType;

        const BASE_URL = import.meta.env.VITE_BASE_URL

        const response = await fetch(BASE_URL+`rag/query_message/`, {
            method: 'POST',
            headers: {
                'Content-Type': 'text/event-stream'
            },
            body: JSON.stringify(sendData)
        });

        if (!useKeyStore.getState().isStream) {
            if (!response) {
                onError('无响应数据，请重试1');
                this.status = StatusEnum.ERROR;
                return;
            }
            // debugger;
            const trfResChunckValue = await response.json(); //todo:后端写入data里
            this.status = StatusEnum.SUCCESS;
            if (isEmpty(trfResChunckValue)) {
                onError('无响应数据，请重试2');
            } else {
                onFinish(trfResChunckValue);
            }

            return;
        }

        // if (!response.ok) {
        //     onError('连接失败，请重试');
        //     this.status = StatusEnum.ERROR;
        //     return;
        // }

        // const data = response;
        // if (!data) {
        //     onError('无响应数据，请重试3');
        //     this.status = StatusEnum.ERROR;
        //     return;
        // }

        if (this.status === StatusEnum.START) {
            this.status = StatusEnum.PENDING;
        }

        const reader = response.body?.pipeThrough(new TextDecoderStream()).getReader();

        // const reader = data.getReader();
        // const decoder = new TextDecoder('utf-8');
        let done = false;

        let resChunkValue;
        let trfResChunckValue: StreamResponseType = {};
        let sumChunkValue = '';

        while (!done && this.status === StatusEnum.PENDING) {
            if (!reader) {
                break;
            }
            const { value, done: doneReading } = await reader.read();

            done = doneReading;

            // const chunkValue = decoder.decode(value);
            // console.log(value, 'chunkValue');
            try {
                if (useKeyStore.getState().isStream) {
                    // const [ids, chunks] = extractContentFromString(value);
                    // sumChunkValue += chunks.join('').replace(/\\n/g, '\n');
                    if (value !== undefined) {
                        sumChunkValue += value;
                        trfResChunckValue = { id: '0', messages: sumChunkValue };
                        onProgress({ id: '0', messages: sumChunkValue });
                    }

                    // onProgress({ id: ids?.[0], messages: sumChunkValue });
                } else {
                    const dataList = (value ?? '').split('\n\ndata :');
                    const chunk = dataList[dataList.length - 2] || dataList[dataList.length - 1];

                    if (chunk) {
                        resChunkValue = JSON.parse(chunk);
                        trfResChunckValue = {
                            id: resChunkValue?.id,
                            messages: resChunkValue?.choices?.[0]?.message?.content
                        };
                        if (resChunkValue.err_code > 0) {
                            onError(resChunkValue.err_msg);
                            return;
                        }
                        onProgress(trfResChunckValue);
                    }
                }
            } catch (e) {
                console.log(e);
            }
        }

        if (this.status === StatusEnum.ABORT) {
            this.status = StatusEnum.SUCCESS;
            trfResChunckValue.messages = trfResChunckValue.messages + '\n[您中断了回答，若继续请刷新重试！]';
            onFinish(trfResChunckValue);
        }

        if (done || this.status === StatusEnum.SUCCESS) {
            this.status = StatusEnum.SUCCESS;
            if (isEmpty(trfResChunckValue)) {
                onError('无响应数据，请重试4');
            } else {
                onFinish(trfResChunckValue);
            }
        }
    }
}

export const streamAPI = new StreamAPI();
