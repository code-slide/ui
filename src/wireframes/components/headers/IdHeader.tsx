import * as React from 'react';
import { getDiagram, getSelectedItems, replaceId, useStore } from '@app/wireframes/model';
import { Button, Input, Space, message } from "antd";
import { useState } from "react";
import '../styles/HeaderView.scss'
import { useDispatch } from 'react-redux';
import { CheckOutlined } from '@ant-design/icons';

export const IdHeader = () => {
    const dispatch = useDispatch();
    const diagram = useStore(getDiagram);
    const [ selectedItem ] = useStore(getSelectedItems);
    const id = !selectedItem ? '' : selectedItem.id;
    const [newId, setNewId] = useState<string>(id);
    const [isUpdate, setIsUpdate] = useState<boolean>(false);
    const [messageApi, contextHolder] = message.useMessage();

    const updateId = (e: React.ChangeEvent<HTMLInputElement>) => {
        setNewId(e.target.value);
        setIsUpdate(true);
    }
    
    const cancelUpdateId = () => {
        setNewId(id);
        setIsUpdate(false);
    };

    const acceptUpdateId = () => {
        try {
            dispatch(replaceId(diagram!, id, newId));
        } catch (e) {
            if (e instanceof Error) messageApi.error(e.message);
            cancelUpdateId();
        }
    };

    React.useEffect(() => {
        cancelUpdateId();
    }, [id]);

    if (!selectedItem) return <></>;
    return (
        <>
            {contextHolder}
            <span className='menu-separator' />
            <Space.Compact className='shape-id'>
                <Input value={newId} className='shape-input' variant='borderless' onChange={updateId} />
                {
                    isUpdate 
                        ? 
                        <Button 
                            className='shape-cta'
                            type='text'
                            icon={<CheckOutlined />}
                            onClick={acceptUpdateId} />
                        : <></>
                }
            </Space.Compact>
        </>
    );
};