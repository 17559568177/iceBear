import { Button, Input, Layout, Table, TableColumnsType, Tag, message } from 'antd';
import { Content } from 'antd/es/layout/layout';
import style from './index.module.less';
import { PlusCircleOutlined, SwapOutlined, UserOutlined } from '@ant-design/icons';
import { useEffect, useMemo, useRef, useState } from 'react';

import UpdatePermission, { PermissionModalHandles } from './components/updatePermission';
import { Role } from './contants';
import NewUser, { NewUserModalHandles, fetchUserList } from './components/newUser';
import { activateUserAPI, deactivateUserAPI, fetchDpPermissions, fetchUserPermissions } from './api';
import NewDepartment, { NewDepartmentModalHandles } from './components/newDepartment';
import UpdatePassword, { UpdatePasswordModalHandles } from './components/updatePassword';
import DeleteMemeberModal, { DeleteMemeberModalHandles } from './components/deleteSomething';
import AddUserToDp, { AddUserToDpModalHandles } from './components/addUserToDp';
import RemoveUserFromDp, { RemoveUserFromDpModalHandles } from './components/removeUserFromDp';
const { Search } = Input;
export interface UserDataType {
    key: React.Key;
    id: string;
    name: string;
    department: string;
    status: string;
    role: string;
    operation: React.ReactNode;
}

export interface DepartmentDataType {
    key: React.Key;
    department: string;
    operation: React.ReactNode;
}

const PermissionsPage: React.FC = () => {
    const [originalUserData, setOriginalUserData] = useState<Omit<UserDataType, 'operation'>[]>([]);
    const [originalDpData, setOriginalDpData] = useState<Omit<DepartmentDataType, 'operation'>[]>([]);
    const [filteredUserData, setFilteredUserData] = useState<Omit<UserDataType, 'operation'>[]>([]);
    const [filteredDpData, setFilteredDpData] = useState<Omit<DepartmentDataType, 'operation'>[]>([]);
    const [checkoutMessage, setCheckOutMessage] = useState<boolean>(false);
    const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([]);
    const [loading, setLoading] = useState(false);
    const [search, setSearch] = useState('');

    const permissionRef = useRef<PermissionModalHandles>(null);
    const newUserRef = useRef<NewUserModalHandles>(null);
    const newDepartmentRef = useRef<NewDepartmentModalHandles>(null);
    const updatePasswordRef = useRef<UpdatePasswordModalHandles>(null);
    const deleteMemeberRef = useRef<DeleteMemeberModalHandles>(null);
    const addUserToDpRef = useRef<AddUserToDpModalHandles>(null);
    const removeUserFromDpRef = useRef<RemoveUserFromDpModalHandles>(null);

    const showPermissionModal = (record: UserDataType) => {
        permissionRef.current?.showModal(record);
    };
    const showNewUserModal = () => {
        newUserRef.current?.showModal();
    };
    const showNewDepartmentModal = () => {
        newDepartmentRef.current?.showModal();
    };
    const showUpdatePasswordRef = (record: UserDataType) => {
        updatePasswordRef.current?.showModal(record);
    };
    const showDeleteMemeberRefRef = (record: DepartmentDataType) => {
        deleteMemeberRef.current?.showModal(record);
    };

    const userColumns: TableColumnsType<UserDataType> = [
        { title: '用户账号', dataIndex: 'id', align: 'center' },
        {
            title: '姓名',
            dataIndex: 'name',
            align: 'center'
        },
        {
            title: '部门',
            dataIndex: 'department',
            align: 'center'
        },
        {
            title: '用户角色',
            dataIndex: 'role',
            align: 'center'
        },
        {
            title: '账号状态',
            dataIndex: 'status',
            align: 'center',
            render: (_: any, record: UserDataType) => (
                <>{record?.status ? <Tag color="red">停用</Tag> : <Tag color="green">启用</Tag>}</>
            )
        },
        {
            title: '操作',
            dataIndex: 'operation',
            align: 'center',
            render: (_: any, record: UserDataType) => (
                <>
                    <Button
                        type="text"
                        style={{ color: '#F89C34' }}
                        onClick={() => {
                            showPermissionModal(record);
                        }}
                    >
                        权限设置
                    </Button>
                    <Button
                        type="text"
                        style={{ color: '#2FB4FF' }}
                        onClick={() => {
                            showUpdatePasswordRef(record);
                            console.log('call', record);
                        }}
                    >
                        密码修改
                    </Button>
                    {/* <Button type="text" style={{ color: '#FA5E3C' }} onClick={() => showDeleteMemeberRefRef(record)}>
                        删除
                    </Button> */}
                </>
            )
        }
    ];

    const departmentColumns: TableColumnsType<DepartmentDataType> = [
        {
            title: '部门',
            dataIndex: 'department'
        },
        {
            title: '操作',
            dataIndex: 'operation',
            align: 'center',
            width: '10%',
            render: (_: any, record: DepartmentDataType) => (
                <>
                    <Button
                        type="text"
                        style={{ color: '#FA5E3C' }}
                        onClick={() => {
                            showDeleteMemeberRefRef(record);
                        }}
                    >
                        删除
                    </Button>
                </>
            )
        }
    ];
    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true);
                const [resUserList, resDpList] = await Promise.all([fetchUserPermissions(), fetchDpPermissions()]);

                const usrList = resUserList.usrList?.map((item: any) => ({
                    key: item.usrId,
                    id: item.username,
                    name: item.nickname,
                    department: item.groupList.map((item: any) => item.groupName).join(','),
                    status: item.stopped,
                    role: Role[convertRole(item.adminStatus)]
                }));
                setOriginalUserData(usrList);
                setFilteredUserData(usrList);
                const dpList = resDpList.identityGroups?.map((item: any) => ({
                    department: item.groupName,
                    key: item.groupId
                }));
                setOriginalDpData(dpList);
                setFilteredDpData(dpList);
                setLoading(false);
            } catch (error) {
                console.error('Error fetching data:', error);
            }
        };
        fetchData();
    }, []);

    const countMember = useMemo(() => {
        return originalUserData?.length;
    }, [originalUserData]);

    const handleSearch = (value: string, data: any) => {
        if (checkoutMessage) {
            if (value === '') {
                setFilteredUserData(data);
            } else {
                const filteredData = data?.filter((entry: any) =>
                    Object.entries(entry).some(
                        ([key, val]) =>
                            key !== 'usrId' && // Skip the 'id' field
                            typeof val === 'string' &&
                            val.toLowerCase().includes(value.toLowerCase())
                    )
                );
                setFilteredUserData(filteredData);
            }
        } else {
            if (value === '') {
                setFilteredDpData(data);
            } else {
                const filteredData = data?.filter((entry: any) =>
                    Object.entries(entry).some(
                        ([key, val]) =>
                            key !== 'key' && // Skip the 'id' field
                            typeof val === 'string' &&
                            val.toLowerCase().includes(value.toLowerCase())
                    )
                );
                setFilteredDpData(filteredData);
            }
        }
    };

    const onSelectChange = (newSelectedRowKeys: React.Key[]) => {
        console.log('selectedRowKeys changed: ', newSelectedRowKeys);
        setSelectedRowKeys(newSelectedRowKeys);
    };

    const activateUsers = (rowKeys: any) => {
        if (rowKeys.length === 0) {
            message.error('请选择用户');
            return;
        }
        activateUserAPI(rowKeys).then(async res => {
            const newData = await fetchUserList();
            setOriginalUserData(newData);
            handleSearch(search, newData);
            message.success('启用成功');
        });
    };

    const deactivateUsers = (rowKeys: any) => {
        if (rowKeys.length === 0) {
            message.error('请选择用户');
            return;
        }
        deactivateUserAPI(rowKeys).then(async res => {
            const newData = await fetchUserList();
            setOriginalUserData(newData);
            handleSearch(search, newData);
            message.success('停用成功');
        });
    };

    const addUsersToDp = (rowKeys: any) => {
        if (rowKeys.length === 0) {
            message.error('请选择用户');
            return;
        }
        addUserToDpRef.current?.showModal(rowKeys);
    };

    const removeUserFromDp = (rowKeys: any) => {
        if (rowKeys.length === 0) {
            message.error('请选择用户');
            return;
        }
        removeUserFromDpRef.current?.showModal(rowKeys);
    };

    const rowSelection = {
        selectedRowKeys,
        onChange: onSelectChange
    };

    const switchMessage = () => {
        setSelectedRowKeys([]);
        // checkoutMessage ? setOriginalUserData(data2) : setOriginalUserData(data);
        setCheckOutMessage(!checkoutMessage);
    };

    // interface TableParams {
    //     pagination?: TablePaginationConfig;
    //     sortField?: string;
    //     sortOrder?: string;
    //     filters?: Parameters<GetProp<TableProps, 'onChange'>>[1];
    // }

    return (
        <Layout>
            <Content className={style.content}>
                {checkoutMessage ? <h2>用户管理</h2> : <h2>部门管理</h2>}
                <br></br>
                <div className={style.main}>
                    <div className={style.fr}>
                        <Button size="large" icon={<SwapOutlined />} onClick={() => switchMessage()}>
                            {!checkoutMessage ? '用户管理' : '部门管理'}
                        </Button>
                        <div>
                            <Search
                                placeholder="搜索"
                                onSearch={() => {
                                    handleSearch(search, checkoutMessage ? originalUserData : originalDpData);
                                }}
                                enterButton
                                size="large"
                                onChange={e => {
                                    setSearch(e.target.value);
                                }}
                            />
                            <Button
                                icon={<PlusCircleOutlined />}
                                type="primary"
                                size="large"
                                onClick={() => (checkoutMessage ? showNewUserModal() : showNewDepartmentModal())}
                            >
                                {checkoutMessage ? '新建用户' : '新建部门'}
                            </Button>
                        </div>
                    </div>
                    <div className={style.table}>
                        {loading ? (
                            <div className={style.loading}>加载中...</div>
                        ) : checkoutMessage ? (
                            <Table
                                rowSelection={rowSelection}
                                columns={userColumns}
                                dataSource={filteredUserData}
                                pagination={{
                                    pageSize: 10
                                }}
                                scroll={{ y: 400 }}
                                footer={() => (
                                    <div style={{ display: 'flex', gap: '10px' }}>
                                        <Button onClick={() => addUsersToDp(selectedRowKeys)}>加入部门</Button>
                                        <Button onClick={() => removeUserFromDp(selectedRowKeys)}>移出部门</Button>
                                        <Button onClick={() => activateUsers(selectedRowKeys)}>启用账号</Button>
                                        <Button type="primary" danger onClick={() => deactivateUsers(selectedRowKeys)}>
                                            批量停用
                                        </Button>
                                        <span style={{ marginLeft: '16px' }}>
                                            <UserOutlined style={{ marginRight: '10px' }} />
                                            用户总数 {countMember} 人, 已选择 {selectedRowKeys.length} 人
                                        </span>
                                    </div>
                                )}
                            />
                        ) : (
                            <Table
                                // rowSelection={rowSelection}
                                columns={departmentColumns}
                                dataSource={filteredDpData}
                                pagination={{
                                    pageSize: 10
                                }}
                                scroll={{ y: 400 }}
                            />
                        )}
                    </div>
                </div>
            </Content>
            <UpdatePermission
                title="权限控制"
                ref={permissionRef}
                setData={data => {
                    setOriginalUserData(data);
                    setFilteredUserData(data);
                }}
            />
            <NewUser
                title="新建用户"
                dpList={originalDpData}
                setData={data => {
                    setOriginalUserData(data);
                    setFilteredUserData(data);
                }}
                ref={newUserRef}
            />
            <NewDepartment
                title="新建部门"
                setData={data => {
                    setOriginalDpData(data);
                    setFilteredDpData(data);
                }}
                ref={newDepartmentRef}
            />
            <UpdatePassword title="修改密码" ref={updatePasswordRef} setData={setOriginalUserData} />
            <DeleteMemeberModal title="删除该行" ref={deleteMemeberRef} setData={setOriginalDpData} />
            <AddUserToDp title="加入部门" ref={addUserToDpRef} setData={setOriginalUserData} />
            <RemoveUserFromDp title="移出部门" ref={removeUserFromDpRef} setData={setOriginalUserData} />
        </Layout>
    );
};

export default PermissionsPage;

const convertRole = (id: number) => {
    switch (id) {
        case 0:
            return 'U';
        case 1:
            return 'R';
        case 2:
            return 'S';
        default:
            return 'U';
    }
};
