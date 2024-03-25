import { Form, Modal } from 'antd';
import * as React from 'react';

type ModalFormProps = {
    // Modal title
    title: string;

    // Modal state
    open: boolean;

    // OK button text
    okText?: string;

    // Cancel button text
    cancelText?: string;

    // Form items
    formItems: JSX.Element;

    // Initial value
    initValue?: string[];

    // Action onOK
    onCreate: (values: any) => void;

    // Action onCancel
    onCancel: () => void;
}

export const ModalForm: React.FC<ModalFormProps> = (props: ModalFormProps) => {
    const { title, open, okText, cancelText, formItems, initValue, onCreate, onCancel } = props;
    const [form] = Form.useForm();
    return (
        <Modal
            open={open}
            title={title}
            okText={okText ?? 'OK'}
            cancelText={cancelText ?? "Cancel"}
            centered={true}
            onCancel={onCancel}
            onOk={() => {
                form
                    .validateFields()
                    .then((values) => {
                        form.resetFields();
                        onCreate(values);
                    })
                    .catch((info) => {
                        console.log('Validate Failed:', info);
                    });
            }}
        >
            <Form
                form={form}
                layout="vertical"
                name="form_in_modal"
                initialValues={!initValue ? {} : { [initValue[0]]: initValue[1] }}
            >
                {formItems}
            </Form>
        </Modal>
    );
};