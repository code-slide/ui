import * as React from 'react';
import { getDiagram, getSelection, replaceId, useStore } from '@app/wireframes/model';
import { Button, Input, Space, message } from "antd";
import { useState } from "react";
import '../styles/HeaderView.scss'
import { useAppDispatch } from '@app/store';
import { CheckOutlined } from '@ant-design/icons';

export const IdHeader = () => {
    const dispatch = useAppDispatch();
    const diagram = useStore(getDiagram);
    const selectedItems = useStore(getSelection);
    const id = (!selectedItems || selectedItems.selection.size != 1) ? '' : selectedItems.selectedItems[0].id;
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
        dispatch(replaceId(diagram!, id, newId));
        setIsUpdate(false);
    };

    const handleUpdateId = () => {
        if (diagram!.items.has(newId)) {
            messageApi.error(`Cannot change ID. ${newId} is assigning to another shape.`);
            cancelUpdateId();
        } else {
            acceptUpdateId();
        }
    };

    React.useEffect(() => {
        cancelUpdateId();
    }, [id]);

    if (!selectedItems || selectedItems.selection.size != 1) return <></>;
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
                            onClick={handleUpdateId} />
                        : <></>
                }
            </Space.Compact>
        </>
    );
};