import { Form, Modal, Select, message } from 'antd';
import { forwardRef, useEffect, useImperativeHandle, useState } from 'react';
import { removeUserFromDpAPI, fetchDpPermissions } from '../api';
import { fetchUserList } from './newUser';

export interface RemoveUserFromDpModalHandles {
    showModal: (record: any) => void;
    hideModal: () => void;
}

const RemoveUserFromDp = forwardRef<RemoveUserFromDpModalHandles, { title: string; setData: (value: any) => void }>(
    ({ title, setData }, ref) => {
        const [confirmLoading, setConfirmLoading] = useState(false);
        const [visible, setVisible] = useState(false);
        const [form] = Form.useForm();
        const [initData, setInitData] = useState({});
        const [departmentOptions, setDepartmentOptions] = useState<{ department: string; key: string }[]>([]);

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
            console.log('initData', initData);
            console.log('form values', form.getFieldsValue());

            removeUserFromDpAPI({ rowKeys: initData, ...form.getFieldsValue() }).then(async res => {
                if (res.status === 1) {
                    setConfirmLoading(false);
                    const newData = await fetchUserList();

                    setData(newData);
                    message.success('批量修改成功');
                } else {
                    message.error('批量修改失败');
                }
            });
            setConfirmLoading(false);
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
                <Form form={form} layout="vertical" autoComplete="off" initialValues={initData}>
                    <Form.Item name="department" label="部门">
                        <Select
                            mode="multiple"
                            options={departmentOptions.map(item => ({
                                value: item.key,
                                label: item.department
                            }))}
                        />
                    </Form.Item>
                </Form>
            </Modal>
        );
    }
);

export default RemoveUserFromDp;
