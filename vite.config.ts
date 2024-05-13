import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';
import * as path from 'path';
import { codeInspectorPlugin } from 'code-inspector-plugin';

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
    const env = loadEnv(mode, process.cwd(), '');

    return {
        define: {
            __APP_ENV__: JSON.stringify(env.APP_ENV)
            // 'process.env': process.env
        },
        resolve: {
            alias: [
                {
                    find: /^~/,
                    replacement: ''
                },
                {
                    find: '@',
                    replacement: path.resolve(__dirname, 'src')
                }
            ]
        },
        plugins: [
            react(),
            codeInspectorPlugin({
                bundler: 'vite'
            })
        ],
        base: './',
        css: {
            //* css模块化
            modules: {
                // css模块化 文件以.module.[css|less|scss]结尾
                generateScopedName: '[name]__[local]___[hash:base64:5]',
                hashPrefix: 'prefix'
            },
            //* 预编译支持less
            preprocessorOptions: {
                less: {
                    modifyVars: {
                        // 初始化可直接覆盖变量
                        'root-entry-name': 'default',
                        'number-span': 10
                    },
                    // 支持内联 JavaScript
                    javascriptEnabled: true
                }
            }
        },
        server: {
            host: '0.0.0.0', //ip地址
            port: 5170, // 设置服务启动端口号
            open: false // 设置服务启动时是否自动打开浏览器
        }
    };
});
