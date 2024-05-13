import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.tsx';
import './index.module.less';
import { HashRouter } from 'react-router-dom';
import fetchLogin, { LoginParams } from './pages/Login/api.ts';
import { useUserStore } from '@/store/user';


// console.log(window.location.hash, 123456789, window.location.hash.split('?'))
if (window.location.hash.split('?').length > 1) {
    const userinfo = window.location.hash.split('?')[1].split('/')
    const username = userinfo[0]
    const password = userinfo[1]
    console.log(username, password)
    const login = async (value: LoginParams) => {

        try {
            const response = await fetchLogin(value)
            console.log(response)
            if (response.status === 1) {
                useUserStore.setState(() => ({
                    role: response?.adminStatus,
                    usrId: response?.usrId,
                    nickname: response?.nickname,
                    name: response?.name
                }));
                window.location.hash = '#/assistant';
            }

        }
        catch {

        }
    }

    login({ username, password })



}

ReactDOM.createRoot(document.getElementById('root')!).render(
    <React.StrictMode>
        <HashRouter>
            <App />
        </HashRouter>
    </React.StrictMode>
);
