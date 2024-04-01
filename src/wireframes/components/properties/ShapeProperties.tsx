/*
 * codeslide.net
 *
 * @license
 * Forked from mydraft.cc by Sebastian Stehle
 * Copyright (c) Do Duc Quan. All rights reserved.
*/

import { Button, Col, Input, Row, Space } from 'antd';
import * as React from 'react';
import { texts } from '@app/const';
import { getDiagram, getSelectedItems, replaceId, useStore } from '@app/wireframes/model';
import { useState } from 'react';
import { useDispatch } from 'react-redux';

export const ShapeProperties = React.memo(() => {
    const dispatch = useDispatch();
    const diagram = useStore(getDiagram);
    const [ selectedItem ] = useStore(getSelectedItems);
    const id = !selectedItem ? '' : selectedItem.id;
    const [newId, setNewId] = useState<string>(id);
    const [isUpdate, setIsUpdate] = useState<boolean>(false);

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
    };

    React.useEffect(() => {
        cancelUpdateId();
    }, [id]);

    return (
        <>
            <Row className='property'>
                <Col span={4} className='property-label'>{texts.common.id}</Col>
                <Col span={20} className='property-value'>
                    <Space direction="vertical"> 
                        <Input value={newId} onChange={updateId} />
                        {
                            isUpdate 
                                ? <Space.Compact style={{ width: '100%' }}>
                                    <Button 
                                        className='item' type='text' 
                                        size='small' shape='round' 
                                        onClick={cancelUpdateId}>
                                            Cancel
                                        </Button>
                                    <Button 
                                        className='item' type='text' 
                                        size='small' shape='round' 
                                        onClick={acceptUpdateId}>
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
