const AgentAvatar = [
    'src/assets/imgs/myagent/Ellipse0.svg',
    'src/assets/imgs/myagent/Ellipse1.svg',
    'src/assets/imgs/myagent/Ellipse2.svg',
    'src/assets/imgs/myagent/Ellipse3.svg',
    'src/assets/imgs/myagent/Ellipse4.svg',
    'src/assets/imgs/myagent/Ellipse5.svg',
]

export function AgentAvatarnum(num: number) {
    if (num > AgentAvatar.length) {
        num = 0
    }
    return AgentAvatar[num]
}



export const toollist = [
    {
        label: '基础节点',
        children: [
            {  
                img: 'src/assets/imgs/myagent/workflownode/Group 3682.svg',
                content: '开始'
            },
            {
                img: 'src/assets/imgs/myagent/workflownode/Group 368.svg',
                content: '结束'
            },
            {
                img: 'src/assets/imgs/myagent/workflownode/Group 3602.svg',
                content: '生成'
            },
            {
                img: 'src/assets/imgs/myagent/workflownode/Group 385.svg',
                content: '代码'
            }
        ]
    },
    {
        label: '逻辑节点',
        children: [
            {
                img: 'src/assets/imgs/myagent/workflownode/Group 390.svg',
                content: '字段提取'
            },
            {
                img: 'src/assets/imgs/myagent/workflownode/Group 389.svg',
                content: '文本合并'
            },
            {
                img: 'src/assets/imgs/myagent/workflownode/Group 396.svg',
                content: '条件判断'
            },
            {
                img: 'src/assets/imgs/myagent/workflownode/Group 391.svg',
                content: '意图识别'
            }
        ]
    },
    {
        label: '数据节点',
        children: [
            {
                img: 'src/assets/imgs/myagent/workflownode/Group 383.svg',
                content: '知识库'
            },
            {
                img: 'src/assets/imgs/myagent/workflownode/Group 384.svg',
                content: '联网搜索'
            },
            {
                img: 'src/assets/imgs/myagent/workflownode/Group 396.svg',
                content: '网页抓取'
            },
            {
                img: 'src/assets/imgs/myagent/workflownode/Group 397.svg',
                content: 'API请求'
            }
        ]
    },
    {
        label: '工具节点',
        children: [

        ]
    }
]