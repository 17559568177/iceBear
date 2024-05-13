import request from '@/service';
import { ChatItemType } from '../store/useChatStore';

type curConversationRequsetType = {
    id: string;
};

type curConversationResponseType = ChatItemType[];

async function patchCurConversation(body: curConversationRequsetType) {
    return request<curConversationResponseType[]>(`rag/query_curChat/`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        data: body
    });
}

export default async function updataCurConversation(params: curConversationRequsetType): Promise<any> {
    await patchCurConversation(params)
        .then(res => {
            return res.data;
        })
        .catch(error => {
            console.error('请求错误:', error);
            return false;
        });
}
