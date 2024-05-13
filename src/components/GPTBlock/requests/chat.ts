import axios from 'axios';

export interface RoleType {
    id: string;
    icon: string;
    name: string;
    prompt: string;
    desc: string;
}

export default {
    getRoleList(): Promise<RoleType[]> {
        return axios
            .create({
                baseURL: 'http://127.0.0.1:5173',
                timeout: 1000 * 60
            })
            .get(`chat-gpt-model?platform=1&is_all=true`);
    }
};
