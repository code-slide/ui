/*
 * codeslide.net
 *
 * @license
 * Forked from mydraft.cc by Sebastian Stehle
 * Copyright (c) Do Duc Quan. All rights reserved.
*/

import { Button, Dropdown, Tooltip } from 'antd';
import * as React from 'react';
import { useDispatch } from 'react-redux';
import { ColorPicker, useEventCallback } from '@app/core';
import { getColors, getDiagramId, getSelectionSet, selectColorTab, useStore } from '@app/wireframes/model';
import { useAppearance, useColorAppearance } from '../actions';
import { BorderWidthIcon, ColorBackgroundFill, ColorBorderFill, IconOutline } from '@app/icons/icon';
import { vogues, shapes } from '@app/const';

export const VisualTool = React.memo(() => {
    const dispatch = useDispatch();
    const recentColors = useStore(getColors);
    const selectedColorTab = useStore(s => s.ui.selectedColor as any);
    const selectedDiagramId = useStore(getDiagramId);
    const selectedSet = useStore(getSelectionSet);

    const [backgroundColor, setBackgroundColor] =
        useColorAppearance(selectedDiagramId, selectedSet,
            shapes.key.backgroundColor);

    const [strokeColor, setStrokeColor] =
        useColorAppearance(selectedDiagramId, selectedSet,
            shapes.key.strokeColor);

    const [strokeThickness, setStrokeThickness] =
        useAppearance<number>(selectedDiagramId, selectedSet,
            shapes.key.strokeThickness);

    const doSelectColorTab = useEventCallback((key: string) => {
        dispatch(selectColorTab(key));
    });
    
    if (!selectedDiagramId) {
        return null;
    }

    return (
        <>
            <Tooltip mouseEnterDelay={1} title={ 'Background color' }>
                <ColorPicker 
                    activeColorTab={selectedColorTab} 
                    disabled={backgroundColor.empty} 
                    value={backgroundColor.value}
                    onChange={setBackgroundColor}
                    onActiveColorTabChanged={doSelectColorTab}
                    popoverPlacement='bottom'
                    icon={<IconOutline icon={ColorBackgroundFill} />}
                    recentColors={recentColors} />
            </Tooltip>

            <Tooltip mouseEnterDelay={1} title={ 'Stroke thickness' }>
                <Dropdown 
                    className='tool-menu-item'
                    menu={{ 
                        items: vogues.option.strokeThickness.map(value => (
                            { key: value.toString(), label: value, value: value }
                        )),
                        selectable: true,
                        defaultSelectedKeys: [`${strokeThickness.value}`],
                        onClick: ({key}) => {setStrokeThickness(Number(key))}
                    }}
                    trigger={['click']}
                >
                    <Button type='text' icon={<IconOutline icon={BorderWidthIcon} />} disabled={strokeThickness.empty} />
                </Dropdown>
            </Tooltip>

            <Tooltip mouseEnterDelay={1} title={ 'Stroke color' }>
                <ColorPicker 
                    activeColorTab={selectedColorTab} 
                    disabled={strokeColor.empty} 
                    value={strokeColor.value}
                    onChange={setStrokeColor}
                    onActiveColorTabChanged={doSelectColorTab}
                    popoverPlacement='bottom'
                    icon={<IconOutline icon={ColorBorderFill} />}
                    recentColors={recentColors}
                />
            </Tooltip>
        </>
    );
});