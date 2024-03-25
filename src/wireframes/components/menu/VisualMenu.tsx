/*
 * codeslide.net
 *
 * @license
 * Copyright (c) Sebastian Stehle. All rights reserved.
*/

import { Button, Dropdown, InputNumber, Tooltip } from 'antd';
import * as React from 'react';
import { useDispatch } from 'react-redux';
import { ColorPicker, useEventCallback } from '@app/core';
import { DefaultAppearance } from '@app/wireframes/interface';
import { getColors, getDiagramId, getSelectionSet, selectColorTab, useStore } from '@app/wireframes/model';
import { useAppearance, useColorAppearance } from '../actions';
import { BorderWidthIcon, ColorBackgroundFill, ColorBorderFill, ColorTextFill, IconOutline } from '@app/icons/icon';

export const VisualMenu = React.memo(() => {
    const dispatch = useDispatch();
    const recentColors = useStore(getColors);
    const selectedColorTab = useStore(s => s.ui.selectedColor as any);
    const selectedDiagramId = useStore(getDiagramId);
    const selectedSet = useStore(getSelectionSet);

    const [backgroundColor, setBackgroundColor] =
        useColorAppearance(selectedDiagramId, selectedSet,
            DefaultAppearance.BACKGROUND_COLOR);

    const [fontSize, setFontSize] =
        useAppearance<number>(selectedDiagramId, selectedSet,
            DefaultAppearance.FONT_SIZE);

    const [foregroundColor, setForegroundColor] =
        useColorAppearance(selectedDiagramId, selectedSet,
            DefaultAppearance.FOREGROUND_COLOR);

    const [strokeColor, setStrokeColor] =
        useColorAppearance(selectedDiagramId, selectedSet,
            DefaultAppearance.STROKE_COLOR);

    const [strokeThickness, setStrokeThickness] =
        useAppearance<number>(selectedDiagramId, selectedSet,
            DefaultAppearance.STROKE_THICKNESS);

    const [textAlignment, setTextAlignment] =
        useAppearance<string>(selectedDiagramId, selectedSet,
            DefaultAppearance.TEXT_ALIGNMENT);

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
                        items: DEFINED_FONT_SIZES.map(value => (
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

            <span className='menu-separator' />

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

            <span className='menu-separator' />

            <Tooltip mouseEnterDelay={1} title={ `Align ${textAlignment.value}` }>
                <Button
                    className='tool-menu-item'
                    type='text'
                    onClick={() => {
                        (textAlignment.value == 'left')
                        ? setTextAlignment('center') : (textAlignment.value == 'center')
                        ? setTextAlignment('right') : setTextAlignment('left')
                    }}
                >
                    <i className={`icon-align-${
                        (textAlignment.value == 'center')
                        ? 'center' : (textAlignment.value == 'right')
                        ? 'right' : 'left'}`} />
                </Button>
            </Tooltip>

            <span className='menu-separator' />

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
                        items: DEFINED_STROKE_THICKNESSES.map(value => (
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

const DEFINED_STROKE_THICKNESSES = [0, 1, 2, 4, 6, 8];
const DEFINED_FONT_SIZES = [4, 6, 8, 10, 12, 14, 16, 18, 20, 24, 28, 32, 36, 40, 48, 60];