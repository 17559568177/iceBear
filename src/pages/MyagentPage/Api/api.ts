import request from '@/service';
import { useUserStore } from '@/store/user';

const BASE_URL = 'http://13.114.40.121:9880';

const headers = {
    'Content-Type': 'application/json',
}

export async function GetmyAgentsApi() {
    return request(`rag/get_myAgents/`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        data: { usrId: useUserStore.getState().usrId }
    })
}


export async function GetagentConfigApi(agentId: string) {
    return request(`rag/get_agentConfig/`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        data: { agentId: agentId }
    })
}

export async function UpdateagentConfigApi(agentId: string, config: any) {
    return request(`rag/update_agentConfig/`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        data: {
            usrId: useUserStore.getState().usrId,
            agentId: agentId,
            config: config
        }
    })
}

export async function ChatagentMakerApi(config: any) {
    return request(`rag/chat_agentMaker//`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        data: {
            usrId: useUserStore.getState().usrId,
        }
    }
    )
}
export default BASE_URL