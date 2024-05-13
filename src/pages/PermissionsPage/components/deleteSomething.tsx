import { Modal, message } from 'antd';
import { forwardRef, useImperativeHandle, useState } from 'react';

import { deleteDpAPI, fetchDpPermissions } from '../api';
import { DepartmentDataType } from '..';

export interface DeleteMemeberModalHandles {
    showModal: (record: Omit<DepartmentDataType, 'operation'>) => void;
    hideModal: () => void;
}

const DeleteMemeberModal = forwardRef<DeleteMemeberModalHandles, { title: string; setData: (value: any) => void }>(
    ({ title, setData }, ref) => {
        const [confirmLoading, setConfirmLoading] = useState(false);
        const [visible, setVisible] = useState(false);
        // const [form] = Form.useForm();
        const [initData, setInitData] = useState<Omit<DepartmentDataType, 'operation'>>();

        useImperativeHandle(ref, () => ({
            showModal(record) {
                setVisible(true);
                setInitData(record);
            },
            hideModal() {
                setVisible(false);
            }
        }));

        const handleOk = () => {
            setConfirmLoading(true);
            console.log('initData', initData);
            deleteDpAPI({ ...initData }).then(async res => {
                if (res.status === 1) {
                    setConfirmLoading(false);
                    setTimeout(async () => {
                        console.log('sleep');
                        const newData = await fetchDpPermissions();
                        const newDpList = newData.identityGroups?.map((item: any) => ({
                            department: item.groupName,
                            key: item.groupId
                        }));
                        console.log('newDpList', newDpList);
                        setData(newDpList);
                        message.success('删除成功');
                    }, 1000);
                } else {
                    message.error('删除失败');
                }
            });
            //tmp test
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
                你确定要删除吗？
            </Modal>
        );
    }
);

export default DeleteMemeberModal;
