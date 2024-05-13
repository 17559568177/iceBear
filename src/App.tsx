import { Suspense, useEffect } from 'react';
import AppWithMenu from '@/routes';
import './App.css';
import Loading from './components/Loading';
import { ConfigProvider } from 'antd';

// const fetchPermissions = async (token: string) => {
//     try {
//         const res = await getPermissionsOpenApiPermissionsPost({token})
//         useAuthStore.setState(state => ({
//             permissions: {
//                 ...state.permissions,
//                 ...res.data?.auth_access ?? '',
//             }
//         }));
//     } catch (error) {
//         console.error('You need to login', error);
//     }
// };

function App() {
    useEffect(() => {
        document.title = '白熊企业大脑';
        const link = document.createElement('link');
        link.rel = 'icon';
        link.href = 'src/assets/imgs/mobile-logo.svg'; // 替换为你的图标路径
        const oldLink = document.querySelector('head link[rel="icon"]');
        if (oldLink) {
            document.head.removeChild(oldLink);
        }
        document.head.appendChild(link);

        // const token = localStorage.getItem('user');
        // const myToken = JSON.parse(token ?? '')?.state?.token
        // if (myToken !== "") {
        //     fetchPermissions(myToken);
        // }
        
    }, []);

    return (
        <ConfigProvider
            theme={{
                token: {
                    // Seed Token，影响范围大
                    colorPrimary: 'F89C34'
                    // borderRadius: 2

                    // 派生变量，影响范围小
                    // colorBgContainer: '#c94b4b'
                },
                components: {
                    Button: {
                        colorPrimary: 'F89C34',
                        algorithm: true // 启用算法
                    },
                    Input: {
                        colorPrimary: 'F89C34',
                        algorithm: true // 启用算法
                    },
                    Layout: {
                        headerBg: 'FFFFFF',
                        headerColor: 'F89C34',
                        siderBg: 'FFFFFF',
                        algorithm: true
                    },
                    Table: {
                        cellPaddingBlock: 20
                    }
                }
            }}
        >
            <Suspense fallback={<Loading />}>
                <AppWithMenu />
            </Suspense>
        </ConfigProvider>
    );
}

export default App;
