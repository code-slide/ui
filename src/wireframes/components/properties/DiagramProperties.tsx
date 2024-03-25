/*
 * codeslide.net
 *
 * @license
 * Copyright (c) Sebastian Stehle. All rights reserved.
*/

import { Col, InputNumber, Row } from 'antd';
import * as React from 'react';
import { useDispatch } from 'react-redux';
import { Color, ColorPicker, useEventCallback } from '@app/core';
import { texts } from '@app/texts';
import { changeColor, changeSize, getColors, getEditor, useStore } from '@app/wireframes/model';

export const DiagramProperties = React.memo(() => {
    const dispatch = useDispatch();
    const editor = useStore(getEditor);
    const editorSize = editor.size;
    const editorColor = editor.color;
    const recentColors = useStore(getColors);
    const [color, setColor] = React.useState(Color.WHITE);
    const [sizeWidth, setWidth] = React.useState(0);
    const [sizeHeight, setHeight] = React.useState(0);

    React.useEffect(() => {
        setWidth(editorSize.x);
        setHeight(editorSize.y);
    }, [editorSize]);

    React.useEffect(() => {
        setColor(editorColor);
    }, [editorColor]);

    const doChangeWidth = useEventCallback((width: number) => {
        setWidth(width);
        dispatch(changeSize(width, sizeHeight));
    });

    const doChangeHeight = useEventCallback((height: number) => {
        setHeight(height);
        dispatch(changeSize(sizeWidth, height));
    });

    const doChangeColor = useEventCallback((color: Color) => {
        dispatch(changeColor(color));
    });

    return (
        <>
            <Row className='property'>
                <Col span={12} className='property-label'>{texts.common.width}</Col>
                <Col span={12} className='property-value'>
                    <InputNumber value={sizeWidth} min={100} max={3000} onChange={(e) => !e ? null : doChangeWidth(e)} />
                </Col>
            </Row>

            <Row className='property'>
                <Col span={12} className='property-label'>{texts.common.height}</Col>
                <Col span={12} className='property-value'>
                    <InputNumber value={sizeHeight} min={100} max={3000} onChange={(e) => !e ? null : doChangeHeight(e)} />
                </Col>
            </Row>

            <Row className='property'>
                <Col span={12} className='property-label'>{texts.common.background}</Col>
                <Col span={12} className='property-value'>
                    <ColorPicker value={color} onChange={doChangeColor} recentColors={recentColors} />
                </Col>
            </Row>
        </>
    );
});
