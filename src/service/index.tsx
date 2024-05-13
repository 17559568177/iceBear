import axios from 'axios';
import { notification } from 'antd';
import { useUserStore } from '@/store/user';

const pendingRequests = new Map(); //用于判断是否取消请求

const request = axios.create({
    baseURL: import.meta.env.VITE_BASE_URL,
    timeout: 1000 * 60
});

request.interceptors.request.use(
    config => {
        // 用于取消请求
        const requestKey = `${config.url}_${config.method}`;
        const source = axios.CancelToken.source();
        config.cancelToken = source.token;
        if (pendingRequests.has(requestKey)) {
            const cancelSource = pendingRequests.get(requestKey);
            cancelSource.cancel('取消重复的请求');
            pendingRequests.delete(requestKey);
        }

        pendingRequests.set(requestKey, source);

        // 用于注册token
        const token = useUserStore.getState().token;
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    error => {
        console.log('error', error);
        if (error.code == 400) {
            notification.error({
                message: '数据库错误',
                description: '请至少选择一个数据库'
            });
        } else {
            notification.error({
                message: '网络错误',
                description: `Requeste接口：${error.config.url}错误`
            });
        }

        return Promise.reject(error);
    }
);

request.interceptors.response.use(
    response => {
        const requestKey = `${response.config.url}_${response.config.method}`;
        pendingRequests.delete(requestKey);

        return response.data;
    },
    error => {
        console.error('error', error);
        if (axios.isCancel(error)) {
            // notification.error({
            //     message: '多次重复请求'
            // });
        } else if (error?.response?.status === 401) {
            notification.error({
                message: error.response.data.message,
                description: error.response.data.data
            });
        } else if (error?.response?.status === 500) {
            notification.error({
                message: error.response.data.message,
                description: error.response.data.data
            });
        } else {
            notification.error({
                message: '网络错误',
                description: `Response接口：${error.config?.url ? error.config?.url : '还未标注的网络'}错误`
            });
        }

        return Promise.reject(error);
    }
);

export default request;
