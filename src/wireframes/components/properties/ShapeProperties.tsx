/*
 * codeslide.net
 *
 * @license
 * Copyright (c) Sebastian Stehle. All rights reserved.
*/

import { Button, Col, Input, Row, Space } from 'antd';
import * as React from 'react';
import { texts } from '@app/texts';
import { getDiagram, getSelectedItems, replaceID, useStore } from '@app/wireframes/model';
import { useState } from 'react';
import { useDispatch } from 'react-redux';

export const ShapeProperties = React.memo(() => {
    const dispatch = useDispatch();
    const diagram = useStore(getDiagram);
    const [ selectedItem ] = useStore(getSelectedItems);
    const id = !selectedItem ? '' : selectedItem.id;
    const [newID, setNewID] = useState<string>(id);
    const [isUpdate, setIsUpdate] = useState<boolean>(false);

    const updateID = (e: React.ChangeEvent<HTMLInputElement>) => {
        setNewID(e.target.value);
        setIsUpdate(true);
    }
    const cancelUpdateID = () => {
        setNewID(id);
        setIsUpdate(false);
    };
    const acceptUpdateID = () => {
        dispatch(replaceID(diagram!, id, newID));
    };

    React.useEffect(() => {
        cancelUpdateID();
    }, [id]);

    return (
        <>
            <Row className='property'>
                <Col span={4} className='property-label'>{texts.common.id}</Col>
                <Col span={20} className='property-value'>
                    <Space direction="vertical"> 
                        <Input value={newID} onChange={updateID} />
                        {
                            isUpdate 
                                ? <Space.Compact style={{ width: '100%' }}>
                                    <Button 
                                        className='item' type='text' 
                                        size='small' shape='round' 
                                        onClick={cancelUpdateID}>
                                            Cancel
                                        </Button>
                                    <Button 
                                        className='item' type='text' 
                                        size='small' shape='round' 
                                        onClick={acceptUpdateID}>
                                            Done
                                        </Button>
                                </Space.Compact>
                                : <></>
                        }
                        
                    </Space>
                </Col>
            </Row>
        </>
    );
});
