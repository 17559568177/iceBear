import { Button, Checkbox, Col, Layout, Menu, Row, Select, Slider, SliderSingleProps, Space, Tag } from 'antd';
import './index.module.less';
import Sider from 'antd/es/layout/Sider';

import ISlider from './components/ISlider';
import GPTBlock from '@/components/GPTBlock';
import { FileSearchOutlined, SearchOutlined, SlidersOutlined } from '@ant-design/icons';
import style from './index.module.less';
import { memo, useEffect, useState } from 'react';
import initHistoryList from '@/components/GPTBlock/requests/fetchHistoryList';

import { useKeyStore } from '@/components/GPTBlock/store/useKeyStore';
import { useUserStore } from '@/store/user';
import { useNavigate } from 'react-router-dom';

const { CheckableTag } = Tag;
const BASE_URL = import.meta.env.VITE_BASE_URL;

const LeftSide = memo(() => {
    const [myKnowledgeBaseList, setMyKnowledgeBaseList] = useState<any[]>([]);

    useEffect(() => {
        fetch(BASE_URL + 'rag/get_allMyRepBase/', {
            method: 'POST',
            body: JSON.stringify({ usrId: useUserStore.getState().usrId, queryType: 'query' })
        })
            .then(response => response.json())
            .then(data => {
                // console.log('myreq', data);
                setMyKnowledgeBaseList(processMyKnowledgeBaseList(data));
            });
    }, []);

    const processMyKnowledgeBaseList = (data: any) => {
        console.log(data.myRepository);
        return data.myRepository;
    };

    const [selectedTags, setSelectedTags] = useState<string[]>([]);

    const { multiplicity, platformSearch, knowledgeSearch } = useKeyStore(state => ({
        // model: state.model,
        // temperature: state.temperature,
        multiplicity: state.multiplicity,
        // maxToken: state.maxToken,
        platformSearch: state.platformSearch,
        knowledgeSearch: state.knowledgeSearch
    }));

    const filterOption = (input: string, option?: { label: string; value: string }) =>
        (option?.label ?? '').toLowerCase().includes(input.toLowerCase());

    const knowledgeTagsChange = (tag: string, checked: boolean) => {
        const nextSelectedTags = checked ? [...selectedTags, tag] : selectedTags.filter(t => t !== tag);
        console.log('You are interested in: ', nextSelectedTags);
        setSelectedTags(nextSelectedTags);
        useKeyStore.setState({ repository: nextSelectedTags });
    };

    const marksRec: SliderSingleProps['marks'] = {
        0: '经济召回',
        1: ' ',
        2: '精准召回'
    };
    const marksSearch: SliderSingleProps['marks'] = {
        0: '快速搜索',
        1: ' ',
        2: '深度搜索'
    };
    const marksStyle: SliderSingleProps['marks'] = {
        0: '忠于原文',
        1: '总结推理'
    };

    return (
        <Sider width={350} breakpoint="sm" collapsedWidth="0">
            <Menu
                style={{ width: '100%', height: '100%' }}
                defaultSelectedKeys={['search']}
                defaultOpenKeys={['search']}
                mode="inline"
                inlineIndent={16}
            >
                <Menu.SubMenu key="search" title="自定义参数" icon={<SlidersOutlined />}>
                    <Menu.Item key="search-input" style={{ height: 'auto' }}>
                        <>
                            <p>模型</p>
                            <Select
                                style={{ width: '250px' }}
                                showSearch
                                placeholder="Select a person"
                                optionFilterProp="children"
                                filterOption={filterOption}
                                options={[
                                    { label: 'GPT-4', value: 'GPT-4' },
                                    { label: 'ChatGLM', value: 'ChatGLM' },
                                    { label: '文心一言', value: 'Wenxin' },
                                    { label: 'Claude-2', value: 'Claude-2' },
                                    { label: 'Gemini', value: 'Gemini' },
                                    { label: '通义千问', value: 'Qwen' }
                                ]}
                                defaultValue={{ label: 'GPT-4', value: 'GPT-4' }}
                                onChange={value => useKeyStore.setState({ model: value })}
                            />
                            {/* <p>温度</p>
                            <ISlider
                                range={[0, 1]}
                                initValue={temperature}
                                onChangeComplete={value => useKeyStore.setState({ temperature: value })}
                            /> */}
                            <p>多样性</p>
                            <ISlider
                                range={[0, 1]}
                                initValue={multiplicity}
                                onChangeComplete={value => useKeyStore.setState({ multiplicity: value })}
                            />
                            {/* <p>maxTokens</p>
                            <ISlider
                                range={[0, 1]}
                                initValue={maxToken}
                                onChangeComplete={value => useKeyStore.setState({ maxToken: value })}
                            /> */}
                            <p>模式选择</p>
                            <Slider
                                style={{ marginLeft: '10%', width: '80%' }}
                                min={0}
                                max={1}
                                marks={marksStyle}
                                step={null}
                                defaultValue={useKeyStore.getState().style}
                                onChange={value => useKeyStore.setState({ style: value })}
                                tooltip={{ open: false }}
                            />
                        </>
                    </Menu.Item>
                </Menu.SubMenu>
                <Menu.Item key="platformSearch" icon={<SearchOutlined />}>
                    <div>
                        <p style={{ display: 'inline-block', minWidth: '100px' }}>联网搜索</p>
                        <Checkbox
                            onChange={() => useKeyStore.setState({ platformSearch: !platformSearch })}
                            checked={platformSearch}
                        />
                    </div>
                </Menu.Item>
                {platformSearch && (
                    <Menu.Item key="search-input" style={{ height: 'auto' }}>
                        <Slider
                            style={{ marginLeft: '10%', width: '80%' }}
                            min={0}
                            max={2}
                            marks={marksSearch}
                            step={null}
                            defaultValue={useKeyStore.getState().searchType}
                            onChange={value => useKeyStore.setState({ searchType: value })}
                            tooltip={{ open: false }}
                        />
                    </Menu.Item>
                )}
                <Menu.Item key="knowledgeSearch" icon={<FileSearchOutlined />}>
                    <p style={{ display: 'inline-block', minWidth: '100px' }}>知识库搜索</p>
                    <Checkbox
                        onChange={() => useKeyStore.setState({ knowledgeSearch: !knowledgeSearch })}
                        checked={knowledgeSearch}
                    />
                </Menu.Item>
                {knowledgeSearch && (
                    <Menu.Item key="search-input" style={{ height: 'auto' }}>
                        <Slider
                            style={{ marginLeft: '10%', width: '80%' }}
                            min={0}
                            max={2}
                            marks={marksRec}
                            step={null}
                            defaultValue={useKeyStore.getState().recType}
                            onChange={value => useKeyStore.setState({ recType: value })}
                            tooltip={{ open: false }}
                        />
                    </Menu.Item>
                )}
                <Menu.SubMenu key="knowledgeSelect" title="知识库选择" icon={<SlidersOutlined />}>
                    <Menu.Item key="search-input" style={{ height: 'auto' }}>
                        <Row justify="space-between" wrap={false}>
                            <Col span={16}>
                                <span>已选择知识库 {selectedTags.length} 个</span>
                            </Col>
                            <Col span={8}>
                                <Button
                                    type="text"
                                    onClick={() => {
                                        setSelectedTags([]);
                                        useKeyStore.setState({ repository: [] });
                                    }}
                                >
                                    清空
                                </Button>
                            </Col>
                        </Row>
                        <Row>
                            {/* <Button
                                onClick={() => {
                                    console.log('mkb', myKnowledgeBaseList);
                                }}
                            >
                                TEST KB
                            </Button> */}
                            <Space size={[0, 8]} wrap>
                                {myKnowledgeBaseList.map(tag => (
                                    <CheckableTag
                                        key={tag.repId}
                                        checked={selectedTags.includes(tag.repId)}
                                        onChange={checked => knowledgeTagsChange(tag.repId, checked)}
                                    >
                                        {tag.title}
                                    </CheckableTag>
                                ))}
                            </Space>
                        </Row>
                    </Menu.Item>
                </Menu.SubMenu>
            </Menu>
        </Sider>
    );
});

const AssistantPage = () => {
    const navigate = useNavigate();
    useEffect(() => {
        // check permission
        const usrId = useUserStore.getState().usrId;
        if (usrId === 'Guest') {
            console.log('AssistantPage: usrId is Guest');
            // jump to login page
            navigate('/login');
            // debugger;
        } else {
            const params = { usrId: useUserStore.getState().usrId, type: 'personal_assistant' };
            initHistoryList(params);
        }
    }, []);
    return (
        <Layout style={{ height: '100%' }}>
            <LeftSide />

            <div className={style.content} style={{ width: '80%'}}>
                <GPTBlock />
            </div>
        </Layout>
    );
};
export default AssistantPage;
