import { Form, Input, Modal } from 'antd';
import { forwardRef, useImperativeHandle, useRef, useState } from 'react';

import { updatePasswordAPI } from '../api';
import { UserDataType } from '..';
import { fetchUserList } from './newUser';

export interface UpdatePasswordModalHandles {
    showModal: (record: Omit<UserDataType, 'operation'>) => void;
    hideModal: () => void;
}

const UpdatePassword = forwardRef<UpdatePasswordModalHandles, { title: string; setData: (value: any) => void }>(
    ({ title, setData }, ref) => {
        const [confirmLoading, setConfirmLoading] = useState(false);
        const [visible, setVisible] = useState(false);

        const usrRef = useRef<Omit<UserDataType, 'operation'>>();
        const [form] = Form.useForm();

        useImperativeHandle(ref, () => ({
            showModal(record) {
                usrRef.current = record;
                setVisible(true);
            },
            hideModal() {
                setVisible(false);
            }
        }));

        const handleOk = () => {
            setConfirmLoading(true);

            form.submit();
            console.log('usrRef.current');

            updatePasswordAPI({ ...usrRef.current, ...form.getFieldsValue() }).then(async res => {
                console.log('res2', res);
                if (res.status === 1) {
                    setConfirmLoading(false);
                    const newData = await fetchUserList();
                    setData(newData);
                    // message.success('添加成功');
                } else {
                    // message.error('添加失败');
                }

                // close modal
                setVisible(false);
            });
        };

        const validatePasswordsMatch = ({ getFieldValue }: any) => ({
            validator(_: any, value: any) {
                if (!value || getFieldValue('password') === value) {
                    return Promise.resolve();
                }
                return Promise.reject(new Error('两次密码不一致'));
            }
        });

        return (
            <Modal
                title={title}
                open={visible}
                onOk={handleOk}
                confirmLoading={confirmLoading}
                onCancel={() => setVisible(false)}
            >
                <Form form={form} layout="vertical" autoComplete="off">
                    <Form.Item name="password" label="密码" rules={[{ required: true, message: '请输入密码' }]}>
                        <Input />
                    </Form.Item>
                    <Form.Item
                        name="rpassword"
                        label="重复输入密码"
                        rules={[{ required: true, message: '请再次输入密码' }, validatePasswordsMatch]}
                    >
                        <Input />
                    </Form.Item>
                </Form>
            </Modal>
        );
    }
);

export default UpdatePassword;
