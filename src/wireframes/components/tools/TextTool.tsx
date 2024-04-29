/*
 * codeslide.net
 *
 * @license
 * Forked from mydraft.cc by Sebastian Stehle
 * Copyright (c) Do Duc Quan. All rights reserved.
*/

import { Button, Dropdown, InputNumber, Tooltip } from 'antd';
import * as React from 'react';
import { useAppDispatch } from '@app/store';
import { ColorPicker, useEventCallback } from '@app/core';
import { getColors, getDiagramId, getSelection, selectColorTab, useStore } from '@app/wireframes/model';
import { useAppearance, useColorAppearance } from '../actions';
import { ColorTextFill, IconOutline } from '@app/icons/icon';
import { vogues, shapes } from '@app/const';

export const TextTool = React.memo(() => {
    const dispatch = useAppDispatch();
    const recentColors = useStore(getColors);
    const selectedColorTab = useStore(s => s.ui.selectedColor as any);
    const selectedDiagramId = useStore(getDiagramId);
    const selectedSet = useStore(getSelection);

    const [fontSize, setFontSize] =
        useAppearance<number>(selectedDiagramId, selectedSet,
            shapes.key.fontSize);

    const [foregroundColor, setForegroundColor] =
        useColorAppearance(selectedDiagramId, selectedSet,
            shapes.key.foregroundColor);

    const [textAlignment, setTextAlignment] =
        useAppearance<string>(selectedDiagramId, selectedSet,
            shapes.key.textAlignment);

    const doSelectColorTab = useEventCallback((key: string) => {
        dispatch(selectColorTab(key));
    });
    
    if (!selectedDiagramId) {
        return null;
    }

    return (
        <>
            <Tooltip mouseEnterDelay={1} title={ 'Font size' }>
                <Dropdown 
                    className='tool-menu-item'
                    menu={{ 
                        items: vogues.option.fontSize.map(value => (
                            { key: value.toString(), label: value, value: value }
                        )),
                        onClick: (e) => setFontSize(Number(e.key)),
                        selectable: true,
                        defaultSelectedKeys: [`${fontSize.value}`],
                    }}
                    trigger={['click']}
                >
                    <InputNumber 
                        size="small" 
                        value={fontSize.value} 
                        variant="filled" 
                        style={{ width: 50 }}
                        controls={false}    
                        disabled={fontSize.empty}
                        onChange={(e) => !e ? null : setFontSize(e)}
                    />
                </Dropdown>
            </Tooltip>

            <Tooltip mouseEnterDelay={1} title={ 'Text color' }>
                <ColorPicker 
                    activeColorTab={selectedColorTab} 
                    disabled={foregroundColor.empty} 
                    value={foregroundColor.value}
                    onChange={setForegroundColor}
                    onActiveColorTabChanged={doSelectColorTab}
                    popoverPlacement='bottom'
                    icon={<IconOutline icon={ColorTextFill} />}
                    recentColors={recentColors} />
            </Tooltip>

            <Tooltip mouseEnterDelay={1} title={ `Align ${textAlignment.value}` }>
                <Button
                    className='tool-menu-item'
                    aria-label={`Align ${textAlignment.value}`}
                    type='text'
                    onClick={() => {
                        (textAlignment.value == 'left')
                        ? setTextAlignment('center') : (textAlignment.value == 'center')
                        ? setTextAlignment('right') : setTextAlignment('left')
                    }}
                >
                    <i className={`icon-format_align_${
                        (textAlignment.value == 'center')
                        ? 'center' : (textAlignment.value == 'right')
                        ? 'right' : 'left'}`} />
                </Button>
            </Tooltip>
        </>
    );
});