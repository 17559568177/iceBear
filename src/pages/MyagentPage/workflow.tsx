import React, { useState, useCallback, useMemo } from 'react'
import style from './css/workflow.module.less'
import { useParams } from 'react-router-dom'
import { Button, Input, Timeline, message, Collapse, ConfigProvider } from 'antd'
import { AgentAvatarnum } from './components/methods'
import { copyToClipboard } from '@/components/GPTBlock/hooks/copyToClipboard';
import ReactFlow, {
    useNodesState,
    useEdgesState,
    addEdge,
    MiniMap,
    Controls,
    Background,
    BackgroundVariant,
    useReactFlow,
    Panel,
} from 'reactflow';
import { SearchOutlined } from '@ant-design/icons'
import 'reactflow/dist/base.css';
import initNodes from './node/initNodes.ts'
import initEdges from './node/initEdges.ts'
import CustomNode from './components/CustomNode.tsx';
import SCnode from './components/SCnode.tsx'


import { toollist } from '../MyagentPage/components/methods.ts'


const { TextArea } = Input;

// 自定义节点
const nodeTypes = {
    custom: CustomNode,
};


export default function workflow() {

    const { id } = useParams()
    const [leftflag, setleftflag] = useState<boolean>(true)

    const [scalenum, setscalenum] = useState<number>(1)

    const itemlist = [
        { item: '输入1', flag: false },
        { item: '输入2', flag: false },
        { item: '输入3', flag: false }
    ]

    const [value, setValue] = useState('');

    const handleCopy = (value: string) => {
        copyToClipboard(value)
    }






    const process = () => {

        return <div className={style.word_process}>

            <p>
                运行过程
            </p>
            <Timeline
                items={[
                    {
                        color: 'green',
                        children: <div className={style.word_process_item}>
                            <img src="src/assets/imgs/myagent/workflownode/Group 368.svg" alt="" />
                            <p>&nbsp;&nbsp;开始</p>
                        </div>,
                    },
                    {
                        color: 'green',
                        children: <div className={style.word_process_item}>
                            <Collapse ghost items={[
                                {
                                    key: '1',
                                    label: <div style={{ display: 'flex' }}>
                                        <img src="src/assets/imgs/myagent/workflownode/Group 3602.svg" alt="" />
                                        <p>&nbsp;&nbsp;生成节点</p>
                                    </div>,
                                    children: <div className={style.word_process_collapse}>
                                        <p>输入</p>
                                        <Input></Input>
                                        <p>输出</p>
                                        <TextArea
                                            placeholder="是咧文字"
                                            autoSize={{
                                                minRows: 5,
                                                maxRows: 15,
                                            }}
                                        />
                                    </div>,
                                }
                            ]} />

                        </div>
                    },
                    {
                        color: 'green',
                        children: <div className={style.word_process_item}>
                            <img src="src/assets/imgs/myagent/workflownode/Group 3682.svg" alt="" />
                            <p>&nbsp;&nbsp;结束</p>
                        </div>
                    },
                ]}
            />
        </div>


    }


    const [Toollist, setToollist] = useState(toollist)


    const Lookup = (targetContent: string) => {

        if (targetContent.trim() == "") return
        for (const category of toollist) {
            const tool = category.children.find(tool => tool.content.includes(targetContent));
            if (tool) {
                console.log(category, tool);
                const newtool = { ...category }
                newtool.children = [tool]
                setToollist([newtool])
                break;
            }
        }
    }
    const handleInputChange = (e: any) => {
        const value = e.target.value.trim();
        if (value === '') {
            setToollist(toollist)
        }
    };

    const memoizedHandleInputChange = useMemo(() => handleInputChange, []);



    // flow
    const [nodes, setNodes, onNodesChange] = useNodesState(initNodes);
    const [edges, setEdges, onEdgesChange] = useEdgesState(initEdges);

    const onConnect = useCallback((params: any) => setEdges((eds) => addEdge(params, eds)), []);
    const defaultViewport = { x: 800, y: 100, zoom: 1 };



    return (
        <div className={style.workflow}>
            {
                leftflag
                    ? <div className={style.left}>
                        <div className={style.left_input}>
                            <Input
                                placeholder="搜索节点"
                                prefix={
                                    <SearchOutlined style={{
                                        color: 'rgba(0,0,0,.25)',
                                    }} />
                                }
                                onPressEnter={(e) => Lookup(e.target.value)}
                                onChange={memoizedHandleInputChange}
                            />
                        </div>

                        <ConfigProvider
                            theme={{
                                components: {
                                    Collapse: {
                                        contentBg: '#F7F7F7'
                                    },
                                },
                            }}
                        >
                            {
                                Toollist.map((item, index) => {
                                    return <Collapse
                                        defaultActiveKey={0}
                                        ghost={true}
                                        items={[
                                            {
                                                key: index,
                                                label: item?.label,
                                                children: <div>
                                                    {
                                                        item?.children.map((ele) => {
                                                            return <div className={style.left_content_item}>
                                                                <img src={ele.img} alt="" />
                                                                <span className={style.left_content_item_span}>{ele.content}</span>
                                                            </div>
                                                        })
                                                    }
                                                </div>
                                            },
                                        ]}
                                    />
                                })
                            }
                        </ConfigProvider>

                    </div>
                    : ''
            }

            <div className={style.right}>
                <ReactFlow
                    nodes={nodes}
                    edges={edges}
                    onNodesChange={onNodesChange}
                    onEdgesChange={onEdgesChange}
                    onConnect={onConnect}
                    nodeTypes={nodeTypes}
                    // fitView
                    defaultViewport={defaultViewport}
                >

                    <Background variant={BackgroundVariant.Lines} />
                    {/* 小地图 <MiniMap /> */}
                    <Controls />
                </ReactFlow>


                {/* <div className={style.top}>
                    <CustomButton title='返回Agent' url={`../AgentChatpage/${id}`}></CustomButton>
                    <div className={style.top_button}>
                        <Button onClick={() => {
                            setleftflag(!leftflag)
                        }}>
                            <img src="src/assets/imgs/myagent/PlayCircle.svg" alt="" />&nbsp;运行
                        </Button>
                        <Button style={{ background: '#F89C34' }}>
                            <img src="src/assets/imgs/myagent/star.svg" alt="" />&nbsp;保存
                        </Button>
                    </div>
                </div>
                <div className={style.bottom}>
                    <div className={style.bottom_item}>
                        <img src="src/assets/imgs/myagent/workflow/undo.svg" alt="" />
                        <img src="src/assets/imgs/myagent/workflow/redo.svg" alt="" />
                    </div>
                    <div className={style.bottom_item}>
                        <img src="src/assets/imgs/myagent/workflow/big.svg" alt="" onClick={() => {
                            setscalenum(scalenum + 0.1)
                        }} />
                        <img src="src/assets/imgs/myagent/workflow/small.svg" alt="" onClick={() => {
                            setscalenum(scalenum - 0.1)
                        }} />
                    </div>
                    <img src="src/assets/imgs/myagent/workflow/Group.svg" alt="" />
                </div> */}

            </div>



            <div className={style.word}>
                {/* <div className={style.word_top}>
                    <div className={style.word_top_left}>
                        <div style={{ width: '32px', height: '32px', overflow: 'hidden' }}>
                            <img src={AgentAvatarnum(1)} alt="" />
                        </div>
                        &nbsp;&nbsp;&nbsp;
                        <p>
                            建筑设计师
                        </p>
                    </div>
                    <img src="src/assets/imgs/myagent/workflownode/del.svg" alt="" />
                </div>

                <div className={style.word_text}>
                    在此处添加解释与描述
                </div>

                <div className={style.word_start}>
                    <p>开始</p>
                    <div className={style.word_start_int}>
                        <Input style={{ width: '190px', height: '37px' }}></Input>
                        <Button onClick={() => {
                            setleftflag(!leftflag)
                        }}>
                            <img src="src/assets/imgs/myagent/PlayCircle.svg" alt="" />&nbsp;运行
                        </Button>
                    </div>

                </div>
                {
                    leftflag ? '' : process()

                }
                <div className={style.word_end}>
                    <p>结果输出</p>
                    <TextArea
                        style={{
                            margin: '15px 0',
                        }}
                        value={value}
                        onChange={(e) => setValue(e.target.value)}
                        placeholder="Controlled autosize"

                        autoSize={{
                            minRows: 10,
                            maxRows: 15,
                        }}
                    />
                    <img src="src/assets/imgs/myagent/copy.svg" onClick={() => {
                        handleCopy(value)
                        message.success('已复制到剪贴板');
                    }} />
                </div> */}

                {/* <Customnode /> */}

                <SCnode />

            </div>
        </div>

    )
}
