import request from '@/service';

// 定义请求参数和响应数据的接口
export interface LoginParams {
    username: string;
    password: string;
}

interface LoginResponse {
    status: number; // 1成功 0密码错误 2用户已停用 3用户不存在 4未知错误
    admin_status: number; // 0用户 1管理员 2超级管理员
    userId: string; // 用户的id
}

async function fetchLogin(body: LoginParams) {
    return request<LoginResponse>(`rag/login/`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        data: body
    });
}

export default fetchLogin;
