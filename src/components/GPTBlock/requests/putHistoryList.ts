import request from '@/service';
// import { ConversationType, DefaultConversationType, useChatStore } from '../store/useChatStore';

type historyListRequsetType = {
    historyList: {
        historyId: string;
        historyTitle: string;
    }[];
    usrId: string;
};

type historyListResponseType = {
    historyId: string;
    historyTitle: string;
};

async function putHistoryList(body: historyListRequsetType) {
    return request<historyListResponseType[]>(`rag/set_historyList/`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        data: body
    });
}

export default async function updataHistoryList(params: historyListRequsetType) {
    const res = await putHistoryList(params)
        .then(() => {
            // todo: 后期后端应返回全量的historyList数据
            // const historyList = res?.data?.map((item): ConversationType => {
            //     return {
            //         uuid: item.historyId,
            //         title: item.historyTitle,
            //         system: ''
            //     };
            // });
            // const fakeres = historyList ?? ([] as DefaultConversationType[]);
            // useChatStore.getState().putConversationList(fakeres);
            return true;
        })
        .catch(error => {
            console.error('请求错误:', error);
            return false;
        });

    return res;
}
