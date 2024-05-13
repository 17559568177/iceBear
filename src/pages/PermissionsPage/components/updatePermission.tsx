import { Form, Modal, Select, message } from 'antd';
import { forwardRef, useEffect, useImperativeHandle, useState } from 'react';
import { UserDataType } from '..';
import { Role } from '../contants';
import { changePermissionAPI, fetchDpPermissions } from '../api';
import { fetchUserList } from './newUser';

export interface PermissionModalHandles {
    showModal: (record: Omit<UserDataType, 'operation'>) => void;
    hideModal: () => void;
}

const UpdatePermission = forwardRef<PermissionModalHandles, { title: string; setData: (value: any) => void }>(
    ({ title, setData }, ref) => {
        const [confirmLoading, setConfirmLoading] = useState(false);
        const [visible, setVisible] = useState(false);
        const [form] = Form.useForm();
        const [initData, setInitData] = useState<Omit<UserDataType, 'operation'>>();
        // const [departmentOptions, setDepartmentOptions] = useState<{ department: string; key: string }[]>([]);

        useImperativeHandle(ref, () => ({
            showModal(record) {
                setInitData(record);
                setVisible(true);
            },
            hideModal() {
                setVisible(false);
            }
        }));

        useEffect(() => {
            const fetchData = async () => {
                const resDpList = await fetchDpPermissions();
                const dpList = resDpList.identityGroups?.map(item => ({
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

            changePermissionAPI({ ...initData, ...form.getFieldsValue() }).then(async res => {
                if (res.status === 1) {
                    setConfirmLoading(false);
                    const newData = await fetchUserList();

                    setData(newData);
                    message.success('修改成功');
                } else {
                    message.error('修改失败');
                }

                setVisible(false);
            });
        };

        return (
            <Modal
                title={title}
                open={visible}
                onOk={handleOk}
                confirmLoading={confirmLoading}
                onCancel={() => setVisible(false)}
            >
                <Form form={form} layout="vertical" autoComplete="off" initialValues={initData}>
                    {/* <Form.Item name="department" label="部门">
                        <Select
                            mode="multiple"
                            options={departmentOptions.map(item => ({
                                value: item.key,
                                label: item.department
                            }))}
                        />
                    </Form.Item> */}
                    <Form.Item name="role" label="角色">
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
    }
);

export default UpdatePermission;
