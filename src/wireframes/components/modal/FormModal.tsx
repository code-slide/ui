/*
 * codeslide.net
 *
 * @license
 * Forked from mydraft.cc by Sebastian Stehle
 * Copyright (c) Do Duc Quan. All rights reserved.
*/

import { Form, Modal } from 'antd';
import * as React from 'react';

export type ShapeModal = 'image' | 'shape' | '';

type FormModalProps = {
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

export const FormModal: React.FC<FormModalProps> = (props: FormModalProps) => {
    const { title, open, okText, cancelText, formItems, initValue, onCreate, onCancel } = props;
    const [form] = Form.useForm();

    React.useEffect(() => {
        if (open) form.setFieldsValue(!initValue ? {} : { [initValue[0]]: initValue[1] });
    }, [initValue]);

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