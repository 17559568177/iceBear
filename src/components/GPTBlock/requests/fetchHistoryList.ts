import request from '@/service';
import { ConversationType, useChatStore } from '../store/useChatStore';

// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
// import { v4 as uuidv4 } from 'uuid';
type historyListRequsetType = {
    usrId: string;
    type: string;
};

type historyListResponseType = {
    historyId: string;
    historyTitle: string;
};

async function fetchHistoryList(body: historyListRequsetType) {
    return request<historyListResponseType[]>(`rag/get_historyList/`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        data: body
    });
}

export default async function initHistoryList(params: historyListRequsetType) {
    const res = await fetchHistoryList(params)
        .then(res => {
            const historyList = res.data?.map((item): ConversationType => {
                return {
                    uuid: item.historyId,
                    title: item.historyTitle,
                    system: ''
                };
            });
            // const fakeres = historyList ?? ([{ title: '新对话', uuid: uuidv4() }] as DefaultConversationType[]);
            useChatStore.getState().initConversationList(historyList);
            return true;
        })
        .catch(error => {
            console.error('请求错误:', error);
            return false;
        });

    return res;
}
