import { Form, Input, Modal, message } from 'antd';
import { forwardRef, useImperativeHandle, useState } from 'react';

import { fetchDpPermissions, newDpAPI } from '../api';
const { TextArea } = Input;
export interface NewDepartmentModalHandles {
    showModal: () => void;
    hideModal: () => void;
}

const fetchData = async () => {
    const res = await fetchDpPermissions();
    return res.identityGroups?.map((item: any) => ({
        department: item.groupName,
        key: item.groupId
    }));
};

const NewDepartment = forwardRef<NewDepartmentModalHandles, { title: string; setData: (value: any) => void }>(
    ({ title, setData }, ref) => {
        const [confirmLoading, setConfirmLoading] = useState(false);
        const [visible, setVisible] = useState(false);
        const [form] = Form.useForm();

        useImperativeHandle(ref, () => ({
            showModal() {
                setVisible(true);
            },
            hideModal() {
                setVisible(false);
            }
        }));

        const handleOk = () => {
            setConfirmLoading(true);
            form.submit();

            newDpAPI(form.getFieldsValue()).then(async res => {
                if (res.status === 1) {
                    message.success('添加成功');
                    const newData = await fetchData();

                    console.log('newData', newData);
                    setData(newData);
                } else {
                    message.error('添加失败');
                }
                setConfirmLoading(false);
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
                <Form form={form} layout="vertical" autoComplete="off">
                    <Form.Item name="department" label="部门名称" rules={[{ required: true, message: '输入部门名称' }]}>
                        <Input />
                    </Form.Item>
                    <Form.Item name="description" label="部门描述">
                        <TextArea placeholder="在这里输入" autoSize={{ minRows: 3, maxRows: 5 }} />
                    </Form.Item>
                </Form>
            </Modal>
        );
    }
);

export default NewDepartment;
