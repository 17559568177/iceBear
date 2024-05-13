import { useUserStore } from '@/store/user';
import { CopyOutlined, FireOutlined } from '@ant-design/icons';

import { Button, Flex, Input, message } from 'antd';
import { useEffect, useState } from 'react';

const BASE_URL = import.meta.env.VITE_BASE_URL;

const WritingPage = () => {
    const [sampleText, setSampleText] = useState('');
    const [theme, setTheme] = useState('');
    const [result, setResult] = useState('');

    useEffect(() => {
        // check permission
        const usrId = useUserStore.getState().usrId;
        if (usrId === 'Guest') {
            // jump to login page
            window.location.href = '/login';
        }
    }, []);

    // const handleWriting = () => {
    //     // console.log('writing');

    //     fetch(BASE_URL + 'rag/imitate_text/', {
    //         method: 'POST',
    //         body: JSON.stringify({ text: sampleText, instruction: theme })
    //     })
    //         .then(response => response.json())
    //         .then(data => {
    //             // console.log('writing result:', data);
    //             setResult(data.text);
    //         });
    // };

    const handleStreaming = async () => {
        const usrId = useUserStore.getState().usrId;

        const requestData = {
            text: sampleText,
            instruction: theme,
            user_id: usrId
        };

        const response = await fetch(BASE_URL + 'rag/imitate_text/', {
            method: 'POST',
            headers: {
                'Content-Type': 'text/event-stream'
            },
            body: JSON.stringify(requestData) // 发送包含 user_id 的请求数据给服务器
        });
        setResult('');
        const reader = response.body?.pipeThrough(new TextDecoderStream()).getReader();
        while (true) {
            if (!reader) break; // Add null check for 'reader'
            const { value, done } = await reader.read();
            if (done) break;
            // console.log('Received', value);
            setResult(prevResult => prevResult + value);
        }
    };

    return (
        <Flex gap="middle" vertical align="center" justify="space-between" style={{ margin: '20px', height: '90%' }}>
            <h1>AI 内容仿写</h1>
            <h3>写得更快、写得更好、写得更轻松</h3>
            <Flex gap="middle" align="center" justify="space-around" style={{ height: '80%', width: '80%' }}>
                <div style={{ height: '90%', width: '100%' }}>
                    <Input.TextArea
                        showCount
                        maxLength={100000}
                        onChange={e => {
                            setSampleText(e.target.value);
                        }}
                        placeholder="请输入仿写参考内容"
                        style={{ height: '60%', resize: 'none', marginBottom: '10%' }}
                    />
                    <Input.TextArea
                        showCount
                        maxLength={2000}
                        onChange={e => {
                            setTheme(e.target.value);
                        }}
                        placeholder="请输入需要仿写的主题"
                        style={{ height: '30%', resize: 'none' }}
                    />
                </div>
                <div>
                    <Button type="primary" icon={<FireOutlined></FireOutlined>} onClick={handleStreaming}>
                        开始仿写
                    </Button>
                    {/* <Button type="primary" onClick={handleStreaming}>
                        TEST STREAMING
                    </Button> */}
                </div>
                <div style={{ height: '90%', width: '100%' }}>
                    <Input.TextArea
                        onChange={() => {
                            console.log('text change');
                        }}
                        placeholder="仿写结果生成区域"
                        style={{ height: '100%', resize: 'none' }}
                        value={result}
                    />
                    <Flex gap="middle" align="center" justify="end" style={{ height: '7%', marginTop: '3%' }}>
                        {/* <Button type="primary">导出为 PDF</Button> */}
                        {/* <LikeOutlined
                            onClick={() => {
                                console.log('Click Like');
                            }}
                        /> */}
                        {/* <DislikeOutlined
                            onClick={() => {
                                console.log('Click Dislike');
                            }}
                        /> */}
                        <CopyOutlined
                            onClick={() => {
                                // copy to clipboard
                                navigator.clipboard.writeText(result);
                                // show a success message
                                message.success('复制成功');
                            }}
                        />
                        {/* <ExportOutlined
                            onClick={() => {
                                console.log('Click Export');
                            }}
                        /> */}
                    </Flex>
                </div>
            </Flex>
        </Flex>
    );
};
export default WritingPage;
