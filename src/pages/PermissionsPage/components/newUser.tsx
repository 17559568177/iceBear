import { Form, Input, Modal, Select, message } from 'antd';
import { forwardRef, useEffect, useImperativeHandle, useState } from 'react';

import { Role } from '../contants';
import { fetchDpPermissions, fetchUserPermissions, newUserAPI } from '../api';
import { DepartmentDataType } from '..';

export const fetchUserList = async () => {
    const res = await fetchUserPermissions();
    const usrList = res.usrList?.map((item: any) => ({
        key: item.usrId,
        id: item.username,
        name: item.nickname,
        department: item.groupList.map((item: any) => item.groupName).join(','),
        status: item.stopped,
        role: Role[convertRole(item.adminStatus)]
    }));
    return usrList;
};
export interface NewUserModalHandles {
    showModal: () => void;
    hideModal: () => void;
}

const NewUser = forwardRef<
    NewUserModalHandles,
    { title: string; dpList: Omit<DepartmentDataType, 'operation'>[]; setData: (value: any) => void }
>(({ title, setData }, ref) => {
    const [confirmLoading, setConfirmLoading] = useState(false);
    const [visible, setVisible] = useState(false);
    const [form] = Form.useForm();
    const [departmentOptions, setDepartmentOptions] = useState<{ department: string; key: string }[]>([]);

    useImperativeHandle(ref, () => ({
        showModal() {
            setVisible(true);
        },
        hideModal() {
            setVisible(false);
        }
    }));

    useEffect(() => {
        const fetchData = async () => {
            const resDpList = await fetchDpPermissions();
            const dpList = resDpList.identityGroups?.map((item: any) => ({
                department: item.groupName,
                key: item.groupId
            }));
            setDepartmentOptions(dpList);
        };

        fetchData();
    }, [visible]);

    const handleOk = () => {
        setConfirmLoading(true);
        form.submit();
        newUserAPI(form.getFieldsValue()).then(async res => {
            if (res.status === 1) {
                setConfirmLoading(false);
                const newData = await fetchUserList();
                setData(newData);
                message.success('添加成功');
            } else {
                message.error('添加失败');
            }
        });
        setVisible(false);
    };

    return (
        <Modal
            title={title}
            open={visible}
            onOk={handleOk}
            confirmLoading={confirmLoading}
            onCancel={() => setVisible(false)}
        >
            <Form form={form} layout="vertical" autoComplete="off" initialValues={{ role: 'U' }}>
                <Form.Item
                    name="usrId"
                    label="用户账号"
                    rules={[{ required: true, message: 'Please input your userID!' }]}
                >
                    <Input />
                </Form.Item>
                <Form.Item
                    name="name"
                    label="用户名称"
                    rules={[{ required: true, message: 'Please input your username!' }]}
                >
                    <Input />
                </Form.Item>
                <Form.Item
                    name="password"
                    label="用户密码"
                    rules={[{ required: true, message: 'Please input your password!' }]}
                >
                    <Input />
                </Form.Item>
                <Form.Item
                    name="department"
                    label="部门"
                    rules={[{ required: true, message: 'Please select your department!' }]}
                >
                    <Select
                        mode="multiple"
                        allowClear
                        style={{ width: '100%' }}
                        placeholder="Please select"
                        options={departmentOptions.map(item => ({
                            value: item.key,
                            label: item.department
                        }))}
                    />
                </Form.Item>
                <Form.Item name="role" label="角色" rules={[{ required: true }]}>
                    <Select
                        style={{ width: 120 }}
                        options={Object.keys(Role).map(key => ({
                            value: key,
                            label: Role[key as keyof typeof Role]
                        }))}
                    />
                </Form.Item>
            </Form>
        </Modal>
    );
});

export default NewUser;

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
