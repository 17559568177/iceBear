import { Content } from 'antd/es/layout/layout';
import React, { MouseEventHandler, useEffect, useState } from 'react';

import {
    Layout,
    Input,
    Button,
    Space,
    Tooltip,
    Upload,
    Table,
    Row,
    Col,
    Card,
    Pagination,
    List,
    Tabs,
    notification,
    Divider,
    Modal,
    Form,
    Radio,
    Select,
    message,
    Switch
} from 'antd';
import {
    SearchOutlined,
    DeleteOutlined,
    UploadOutlined,
    AppstoreOutlined,
    MailOutlined,
    FolderOutlined,
    PlusOutlined,
    BackwardOutlined,
    CheckOutlined,
    CloseOutlined
} from '@ant-design/icons';
import { useUserStore } from '@/store/user';
import { useNavigate } from 'react-router-dom';

const BASE_URL = import.meta.env.VITE_BASE_URL;

const { TabPane } = Tabs;

const LeftColumn = ({
    onSelectItem,
    selectedItem,
    handleCreateRep,
    handleRefreshRep,
    myKnowledgeBaseList,
    companyKnowledgeBaseList
}: {
    onSelectItem: (item: string) => void;
    selectedItem: string | null;
    handleRefreshRep: Function;
    handleCreateRep: Function;
    myKnowledgeBaseList: any[];
    companyKnowledgeBaseList: any[];
}) => {
    const [activeTab, setActiveTab] = useState('myKnowledgeBase');

    const handleTabChange = (key: string) => {
        setActiveTab(key);
    };

    const handleClickItem = (item: string) => {
        onSelectItem(item);
    };

    useEffect(() => {
        handleRefreshRep();
    }, []);

    const userRole = useUserStore(state => state.role);

    return (
        <div style={{ display: 'flex', justifyContent: 'space-between', flexDirection: 'column', height: '100%' }}>
            {/* <Button onClick={testFetch}>TEST</Button> */}
            <Tabs activeKey={activeTab} onChange={handleTabChange}>
                <TabPane tab="我的知识库" key="myKnowledgeBase" icon={<MailOutlined />}>
                    <List
                        dataSource={myKnowledgeBaseList}
                        renderItem={item => (
                            <List.Item
                                onClick={() => handleClickItem(item.repId)}
                                style={{
                                    background: selectedItem === item.repId ? '#f0f0f0' : 'transparent',
                                    cursor: 'pointer'
                                }}
                            >
                                {item.title}
                            </List.Item>
                        )}
                    />
                </TabPane>
                {userRole >= 1 && (
                    <TabPane tab="企业知识库" key="companyKnowledgeBase" icon={<AppstoreOutlined />}>
                        <List
                            dataSource={companyKnowledgeBaseList}
                            renderItem={item => (
                                <List.Item
                                    onClick={() => handleClickItem(item.repId)}
                                    style={{
                                        background: selectedItem === item.repId ? '#f0f0f0' : 'transparent',
                                        cursor: 'pointer'
                                    }}
                                >
                                    {item.title}
                                </List.Item>
                            )}
                        />
                    </TabPane>
                )}
            </Tabs>
            <Button
                type="primary"
                icon={<PlusOutlined />}
                style={{ marginTop: 'auto', textAlign: 'center' }}
                onClick={handleCreateRep as MouseEventHandler<HTMLElement>}
            >
                新建我的知识库
            </Button>
        </div>
    );
};

const KnowledgeBaseMainPage = ({
    handleSelectItem,
    handleCreateRep,
    handleRefreshRep
}: {
    handleSelectItem: Function;
    handleCreateRep: Function;
    handleRefreshRep: Function;
}) => {
    const [searchQuery, setSearchQuery] = useState('');
    const [searchActive, setSearchActive] = useState(false);
    const [recentPages, setRecentPages] = useState([]);

    useEffect(() => {
        // fetch recent pages, it should be recent page API, since backend do not have such API, I just use fetch all my knowledge base and sort by last edit time
        fetch(BASE_URL + 'rag/get_allMyRepBase/', {
            method: 'POST',
            body: JSON.stringify({ usrId: useUserStore.getState().usrId, queryType: 'edit' })
        })
            .then(response => response.json())
            .then(data => {
                console.log('recent', data);
                setRecentPages(data.myRepository.sort((a: any, b: any) => b.lastEdit - a.lastEdit));
            });
    }, []);

    const handleSearchQueryChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setSearchQuery(event.target.value);
    };

    const handleSearch = () => {
        // console.log('search', searchQuery);
        setSearchActive(true);
    };

    const handleCreate = () => {
        // console.log('create');
        handleCreateRep();
    };

    const [page, setPage] = useState(1);
    const pageSize = 6;

    const handleDeleteRep = (repId: any) => {
        fetch(BASE_URL + 'rag/delete_repBase/', {
            method: 'POST',
            body: JSON.stringify({ usrId: useUserStore.getState().usrId, repId: repId })
        })
            .then(response => response.json())
            .then(data => {
                console.log('delete rep', data);
                fetch(BASE_URL + 'rag/get_allMyRepBase/', {
                    method: 'POST',
                    body: JSON.stringify({ usrId: useUserStore.getState().usrId, queryType: 'edit' })
                })
                    .then(response => response.json())
                    .then(data => {
                        // console.log('myreq', data);
                        setRecentPages(data.myRepository.sort((a: any, b: any) => b.lastEdit - a.lastEdit));
                    });
                handleRefreshRep();
            });
    };

    return (
        <div>
            <div style={{ textAlign: 'center', marginBottom: '20px' }}>
                <h2 style={{ marginBottom: '10px', fontSize: '25px' }}>我的知识库</h2>
                <p style={{ marginBottom: '10px' }}>管理和检索您的知识库</p>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginBottom: '20px' }}>
                <Input
                    style={{ width: '300px', marginBottom: '10px' }}
                    placeholder="搜索知识库"
                    value={searchQuery}
                    onChange={handleSearchQueryChange}
                    suffix={<SearchOutlined />}
                />
                <div style={{ display: 'flex', justifyContent: 'center' }}>
                    <Button type="default" onClick={handleCreate} style={{ width: '120px', marginRight: '20px' }}>
                        创建知识库
                    </Button>
                    <Button type="primary" onClick={handleSearch} style={{ width: '120px' }}>
                        搜索知识库
                    </Button>
                </div>
            </div>
            <div>
                {!searchActive && searchQuery === '' ? (
                    <div>
                        <h2 style={{ marginBottom: '10px' }}>最近编辑</h2>
                        <p style={{ marginBottom: '15px' }}>最近编辑的知识库</p>
                    </div>
                ) : (
                    <div>
                        {/* back to main page */}
                        <Button
                            type="link"
                            style={{ marginLeft: '-20px', color: 'grey' }}
                            icon={<BackwardOutlined />}
                            onClick={() => {
                                setSearchQuery('');
                                setSearchActive(false);
                            }}
                        >
                            返回
                        </Button>

                        <h2 style={{ marginBottom: '10px' }}>搜索结果</h2>
                    </div>
                )}

                <Row gutter={[16, 16]}>
                    {recentPages.length > 0 &&
                        recentPages
                            .filter((page: any) => page.title.includes(searchQuery))
                            .slice((page - 1) * pageSize, page * pageSize)
                            .map((page: any, index) => (
                                <Col key={index} span={8}>
                                    <Card style={{ height: '100%' }}>
                                        <h3 style={{ marginTop: '-10px', marginBottom: '4px' }}>{page.title}</h3>
                                        <p style={{ color: 'grey', fontSize: '12px', marginBottom: '4px' }}>
                                            上次编辑时间: {new Date(parseInt(page.timeStamp) * 1000).toLocaleString()}
                                        </p>
                                        <p>
                                            允许访问的部门:{' '}
                                            {page.type === 'personal_assistant'
                                                ? '仅自己'
                                                : page.allowedDepartments.length !== 0
                                                    ? page.allowedDepartments.map((data: any) => data.name).join('、')
                                                    : '无'}
                                        </p>
                                        <p style={{ marginBottom: '10px' }}>{page.description}</p>
                                        <Row justify="space-between" style={{ marginBottom: '-10px' }}>
                                            <Col style={{ marginLeft: '-8px' }}>
                                                <Tooltip>
                                                    <Button
                                                        type="text"
                                                        onClick={() => {
                                                            handleSelectItem(page.repId);
                                                        }}
                                                        icon={<FolderOutlined />}
                                                    />
                                                    {page.count}
                                                </Tooltip>
                                            </Col>
                                            <Col>
                                                <Tooltip title="删除该知识库">
                                                    <Button
                                                        type="text"
                                                        icon={<DeleteOutlined />}
                                                        onClick={() => {
                                                            handleDeleteRep(page.repId);
                                                        }}
                                                    />
                                                </Tooltip>
                                            </Col>
                                        </Row>
                                    </Card>
                                </Col>
                            ))}
                </Row>
                <Pagination
                    style={{ marginTop: '20px', textAlign: 'center' }}
                    current={page}
                    pageSize={pageSize}
                    onChange={page => {
                        setPage(page);
                    }}
                    total={recentPages.length}
                />
            </div>
        </div>
    );
};

const KnowledgeBaseSelectedPage = ({
    selectedItem,
    handleBackward
}: {
    selectedItem: string | null;
    handleBackward: Function;
}) => {
    // Fetch file data
    useEffect(() => {
        fetch(BASE_URL + 'rag/query_repBase/', {
            method: 'POST',
            body: JSON.stringify({ usrId: useUserStore.getState().usrId, repId: selectedItem })
        })
            .then(response => response.json())
            .then(data => {
                console.log('fetch file', data);
                const { fileData, count, lastModify } = processFileData(data);
                setTableData(fileData);
                setFilteredTableData(fileData);
                setLastEdit(lastModify);
                setFileCount(count);
            });
    }, [selectedItem]);

    // Process file data
    const processFileData = (data: any) => {
        const fileData = data.repBase.map((item: any) => {
            // console.log('time', new Date(parseInt(item.timeStamp) * 1000));
            return {
                key: item.fileId,
                name: item.name,
                size: item.size,
                upload_time: new Date(item.timeStamp * 1000).toLocaleString(),
                status: item.condition,
                actions: item.fileId,
                active: {
                    key: item.fileId,
                    active: item.active
                }
            };
        });
        const count = data.count;
        const lastModify = data.lastModify != -1 ? new Date(data.lastModify * 1000).toLocaleString() : 'NA';

        return { fileData, count, lastModify };
    };

    const handleActiveFile = (key: string, active: number) => {
        console.log('active file', key);
        // Active file
        fetch(BASE_URL + 'rag/activeFile/', {
            method: 'POST',
            body: JSON.stringify({
                usrId: useUserStore.getState().usrId,
                repId: selectedItem,
                fileId: key,
                active: active == 0 ? 0 : 1
            })
        });
    };

    // Delete file
    const handleDelete = (key: string) => {
        console.log('delete function', key);
        // Delete file
        fetch(BASE_URL + 'rag/delete_repBaseFile/', {
            method: 'POST',
            body: JSON.stringify({
                usrId: useUserStore.getState().usrId,
                repId: selectedItem,
                fileId: key
            })
        })
            .then(response => response.json())
            .then(data => {
                console.log('fetch file after delete', data);
                const { fileData, count, lastModify } = processFileData(data);
                setTableData(fileData);
                setFilteredTableData(fileData);
                setLastEdit(lastModify);
                setFileCount(count);
            });
    };

    // file table data
    const [tableData, setTableData] = useState([]);
    const [filteredTableData, setFilteredTableData] = useState([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [lastEdit, setLastEdit] = useState('NA');
    const [fileCount, setFileCount] = useState(0);

    const columns = [
        {
            title: '是否启用',
            dataIndex: 'active',
            key: 'active',
            render: (active: any) =>
                active.active == 1 ? (
                    <Switch
                        checkedChildren={<CheckOutlined />}
                        unCheckedChildren={<CloseOutlined />}
                        defaultChecked
                        onChange={e => handleActiveFile(active.key, e ? 1 : 0)}
                    />
                ) : (
                    <Switch
                        checkedChildren={<CheckOutlined />}
                        unCheckedChildren={<CloseOutlined />}
                        onChange={e => handleActiveFile(active.key, e ? 1 : 0)}
                    />
                )
        },
        { title: '文件名称', dataIndex: 'name', key: 'name' },
        { title: '文件字数', dataIndex: 'size', key: 'size' },
        { title: '上传时间', dataIndex: 'upload_time', key: 'upload_time' },
        {
            title: '文件状态',
            dataIndex: 'status',
            key: 'status',
            render: (status: number) => {
                switch (status) {
                    case 0:
                        return '解析失败';
                    case 1:
                        return '解析完成';
                    case 2:
                        return '正在解析';
                    default:
                        return '未知';
                }
            }
        },
        {
            title: '操作',
            key: 'actions',
            render: (actions: any) => (
                <Space>
                    {/* <Tooltip title="查看">
                        <Button type="text" icon={<FolderViewOutlined />} />
                    </Tooltip> */}
                    <Tooltip title="删除">
                        <Button
                            type="text"
                            onClick={() => {
                                console.log('delete clicked', actions.key);
                                handleDelete(actions.key);
                            }}
                            icon={<DeleteOutlined />}
                        />
                    </Tooltip>
                </Space>
            )
        }
    ];

    // Search file
    const handleSearch = () => {
        if (searchQuery === '') {
            setFilteredTableData(tableData);
            return;
        }
        const filteredData = tableData.filter(item =>
            Object.values(item).some(
                value => typeof value === 'string' && value.toLowerCase().includes(searchQuery.toLowerCase())
            )
        );
        setFilteredTableData(filteredData);
    };

    const handleChangeSearchQuery = (event: any) => {
        setSearchQuery(event.target.value);
    };

    const handleUpload = (file: any) => {
        console.log(`${file.name} uploaded successfully`);

        const formData = new FormData();
        formData.append('file', file);
        formData.append('usrId', useUserStore.getState().usrId);
        formData.append('repId', selectedItem);

        fetch(BASE_URL + 'rag/upload_repBaseFile/', {
            method: 'POST',
            body: formData
        })
            .then(response => {
                if (response.status !== 200) {
                    throw new Error('Error uploading file');
                }
                return response.json();
            })
            .then(data => {
                console.log('Fetch data after upload:', data);
                notification.success({
                    message: file.name + ' 文件上传成功',
                    description: '文件上传成功'
                });
                // update the file list
                fetch(BASE_URL + 'rag/query_repBase/', {
                    method: 'POST',
                    body: JSON.stringify({ usrId: useUserStore.getState().usrId, repId: selectedItem })
                })
                    .then(response => response.json())
                    .then(data => {
                        console.log('fetch file', data);
                        const { fileData, count, lastModify } = processFileData(data);
                        setTableData(fileData);
                        setFilteredTableData(fileData);
                        setLastEdit(lastModify);
                        setFileCount(count);
                    });
            })
            .catch(error => {
                console.error('Error uploading file:', error);
                notification.error({
                    message: file.name + ' 文件上传失败',
                    description: '文件上传失败'
                });
            });
    };

    return (
        <div>
            <Button
                type="link"
                icon={<BackwardOutlined />}
                style={{ color: 'grey', marginLeft: '-20px' }}
                onClick={() => {
                    console.log('fanhui');
                    handleBackward();
                }}
            >
                返回
            </Button>
            <div style={{ textAlign: 'left', marginBottom: '20px', marginTop: '20px' }}>
                <h2>我的知识库</h2>
                <p></p>
            </div>
            <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '20px' }}>
                <Input
                    style={{ width: '200px', marginRight: '10px' }}
                    placeholder="搜索文档"
                    suffix={<SearchOutlined />}
                    value={searchQuery}
                    onChange={handleChangeSearchQuery}
                />
                <Button type="primary" style={{ marginRight: '10px' }} onClick={handleSearch}>
                    搜索
                </Button>
                <Upload multiple beforeUpload={handleUpload} showUploadList={false}>
                    <Button icon={<UploadOutlined />}>上传文件</Button>
                </Upload>
            </div>
            <Table
                dataSource={filteredTableData}
                columns={columns}
                // pagination={{ pageSize: 10 }}
                footer={() => {
                    // console.log('footer', lastEdit);
                    return (
                        <div>
                            <p>
                                文件数: {fileCount} &nbsp;&nbsp; 最后修改时间: {lastEdit === '-1' ? '未修改' : lastEdit}
                            </p>
                        </div>
                    );
                }}
            />
        </div>
    );
};

const RightColumn = ({
    selectedItem,
    onSelectItem,
    handleBackward,
    handleCreateRep,
    handleRefreshRep
}: {
    selectedItem: string | null;
    onSelectItem: Function;
    handleBackward: Function;
    handleCreateRep: Function;
    handleRefreshRep: Function;
}) => {
    return selectedItem ? (
        <KnowledgeBaseSelectedPage selectedItem={selectedItem} handleBackward={handleBackward} />
    ) : (
        <KnowledgeBaseMainPage
            handleSelectItem={onSelectItem}
            handleCreateRep={handleCreateRep}
            handleRefreshRep={handleRefreshRep}
        />
    );
};

const RepositoryPage = () => {
    const [selectedItem, setSelectedItem] = useState(null);

    const [myKnowledgeBaseList, setMyKnowledgeBaseList] = useState<any[]>([]);
    const [companyKnowledgeBaseList, setCompanyKnowledgeBaseList] = useState<any[]>([]);
    const processMyKnowledgeBaseList = (data: any) => {
        return data.myRepository.filter((item: any) => (item.type === 'personal_assistant' ? true : false));
    };
    const processCompanyKnowledgeBaseList = (data: any) => {
        return data.myRepository.filter((item: any) => (item.type !== 'personal_assistant' ? true : false));
    };

    const handleSelectItem = (item: any) => {
        setSelectedItem(item);
    };

    const handleBackward = () => {
        setSelectedItem(null);
    };

    // Modal of creating knowledge base

    const [isModalVisible, setIsModalVisible] = useState(false);
    const [modalData, setModalData] = useState({ name: '', description: '', type: 'personal', allowedDepartments: [] });
    const [departmentOptions, setDepartmentOptions] = useState<{ department: string; key: string }[]>([]);

    const handleCreateRep = () => {
        console.log('create, open a modal');
        setIsModalVisible(true);
    };
    const handleRefreshRep = () => {
        // Get all my knowledge base
        fetch(BASE_URL + 'rag/get_allMyRepBase/', {
            method: 'POST',
            body: JSON.stringify({
                usrId: useUserStore.getState().usrId,
                queryType: 'edit'
                // type: 'personal_assistant'
            })
        })
            .then(response => response.json())
            .then(data => {
                // console.log('myreq', data);
                setMyKnowledgeBaseList(processMyKnowledgeBaseList(data));
                setCompanyKnowledgeBaseList(processCompanyKnowledgeBaseList(data));
            });

        // // Get all enterprise knowledge base
        // fetch(BASE_URL + 'rag/get_allMyRepBase/', {
        //     method: 'POST',
        //     body: JSON.stringify({ usrId: useUserStore.getState().usrId, queryType: 'edit', type: 'policy_query' })
        // })
        //     .then(response => response.json())
        //     .then(data => {
        //         console.log('entreq', data);
        //         setCompanyKnowledgeBaseList(processCompanyKnowledgeBaseList(data));
        //     });
    };

    const handleOk = () => {
        if (modalData.name === '') {
            message.error('请输入知识库名称');
            return;
        }
        setIsModalVisible(false);
        // Send request to backend with the form data
        fetch(BASE_URL + 'rag/new_repBase/', {
            method: 'POST',
            body: JSON.stringify({ usrId: useUserStore.getState().usrId, ...modalData })
        })
            .then(response => {
                if (response.status !== 200) {
                    throw new Error('Error creating knowledge base');
                }
                return response.json();
            })
            .then(data => {
                console.log('create rep', data);

                // Update the knowledge base list
                fetch(BASE_URL + 'rag/get_allMyRepBase/', {
                    method: 'POST',
                    body: JSON.stringify({ usrId: useUserStore.getState().usrId, queryType: 'edit' })
                })
                    .then(response => response.json())
                    .then(data => {
                        console.log('myreq', data);
                        setMyKnowledgeBaseList(processMyKnowledgeBaseList(data));
                    });

                fetch(BASE_URL + 'rag/get_allMyRepBase/', {
                    method: 'POST',
                    body: JSON.stringify({
                        usrId: useUserStore.getState().usrId,
                        queryType: 'edit',
                        type: 'policy_query'
                    })
                })
                    .then(response => response.json())
                    .then(data => {
                        console.log('entreq', data);
                        setCompanyKnowledgeBaseList(processCompanyKnowledgeBaseList(data));
                    });

                notification.success({
                    message: '创建知识库成功',
                    description: '创建知识库 ' + modalData.name + ' 成功'
                });
            })
            .catch(error => {
                console.error('Error creating knowledge base:', error);
                notification.error({
                    message: '创建知识库失败',
                    description: '创建知识库 ' + modalData.name + ' 失败'
                });
            })
            .finally(() => {
                console.log('finally: clear modal data');
                // setModalData({ name: '', description: '', type: 'personal' });
            });
        // todo: // clear form data
        // setModalData({ name: '', description: '', type: 'personal', allowedDepartments: [] });
        // Form.useForm().resetFields();
    };

    const handleCancel = () => {
        console.log("cancel, don't create");
        setIsModalVisible(false);
    };

    const navigate = useNavigate();

    useEffect(() => {
        // check permission
        const usrId = useUserStore.getState().usrId;
        if (usrId === 'Guest') {
            // jump to login page
            console.log('RepoPage: usrId is Guest');
            navigate('/login');
        } else {
            fetch(BASE_URL + 'rag/get_allIdentityGroup/', {
                method: 'POST',
                body: JSON.stringify({ adminId: useUserStore.getState().usrId })
            })
                .then(response => response.json())
                .then(data => {
                    setDepartmentOptions(
                        data.identityGroups?.map((item: any) => ({
                            department: item.groupName,
                            key: item.groupId
                        }))
                    );
                });
        }
    }, [isModalVisible]);

    //todo: add URL route

    return (
        <Layout>
            <Content style={{ padding: '50px' }}>
                <div style={{ display: 'flex' }}>
                    <div style={{ flex: 1, marginRight: '20px', minWidth: '20%', maxWidth: '20%', flexWrap: 'wrap' }}>
                        <LeftColumn
                            onSelectItem={handleSelectItem}
                            selectedItem={selectedItem}
                            myKnowledgeBaseList={myKnowledgeBaseList}
                            companyKnowledgeBaseList={companyKnowledgeBaseList}
                            handleCreateRep={handleCreateRep}
                            handleRefreshRep={handleRefreshRep}
                        />
                    </div>
                    <div style={{ flex: 0.01, margin: '30px' }}>
                        <Divider type="vertical" style={{ minHeight: '100%' }} />
                    </div>
                    <div style={{ flex: 4 }}>
                        <RightColumn
                            selectedItem={selectedItem}
                            onSelectItem={handleSelectItem}
                            handleBackward={handleBackward}
                            handleCreateRep={handleCreateRep}
                            handleRefreshRep={handleRefreshRep}
                        />
                    </div>
                </div>
                <Modal title="新建知识库" visible={isModalVisible} onOk={handleOk} onCancel={handleCancel}>
                    <Form>
                        <Form.Item label="名称" name="name" rules={[{ required: true, message: '请输入知识库名称' }]}>
                            <Input onChange={event => setModalData({ ...modalData, name: event.target.value })} />
                        </Form.Item>
                        <Form.Item
                            label="描述"
                            name="description"
                            rules={[{ required: true, message: '请输入知识库描述' }]}
                        >
                            <Input.TextArea
                                onChange={event => setModalData({ ...modalData, description: event.target.value })}
                            />
                        </Form.Item>
                        <Form.Item label="类型" name="type" rules={[{ required: true }]}>
                            <Radio.Group
                                defaultValue="personal"
                                onChange={event => setModalData({ ...modalData, type: event.target.value })}
                            >
                                <Radio value="personal">个人</Radio>
                                <Radio value="enterprise">企业</Radio>
                            </Radio.Group>
                        </Form.Item>
                        {modalData.type === 'enterprise' && (
                            <Form.Item label="允许访问的部门" name="allowedDepartments">
                                <Select
                                    mode="multiple"
                                    placeholder="请选择允许访问的部门"
                                    onChange={value => setModalData({ ...modalData, allowedDepartments: value })}
                                    options={departmentOptions.map(item => ({
                                        value: item.key,
                                        label: item.department
                                    }))}
                                ></Select>
                            </Form.Item>
                        )}
                    </Form>
                </Modal>
            </Content>
        </Layout>
    );
};

export default RepositoryPage;
