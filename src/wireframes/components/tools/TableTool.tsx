/*
 * codeslide.net
 *
 * @license
 * Forked from mydraft.cc by Sebastian Stehle
 * Copyright (c) Do Duc Quan. All rights reserved.
*/

import { DeleteColumnOutlined, DeleteRowOutlined, InsertRowAboveOutlined, InsertRowBelowOutlined, InsertRowLeftOutlined, InsertRowRightOutlined } from '@ant-design/icons';
import { useEventCallback } from '@app/core';
import { Button, Tooltip } from 'antd';
import { useStore, getSelection, changeItemsAppearance, getDiagram } from '@app/wireframes/model';
import * as React from 'react';
import { getAddToTable, getRemoveFromTable } from '@app/wireframes/shapes/neutral/table';
import { useAppDispatch } from '@app/store';
import { texts, shapes } from '@app/const';

export const TableTool = React.memo(() => {
    const dispatch = useAppDispatch();
    const selectedItems = useStore(getSelection);
    const selectedDiagram = useStore(getDiagram);

    if (selectedItems.selection.size !== 1) return;
    const selectedItem = useStore(getSelection).selectedItems[0];

    const modifyTable = useEventCallback((mode: string, type: string) => {
        if (selectedItem && selectedDiagram) {
            let delimiter: string;
            let attribute: string;
            let selectedIndex: number;
            let newText: string;

            switch (type) {
                case 'column':
                case 'left':
                    attribute = shapes.key.tableSelectedX;
                    selectedIndex = selectedItem.getAppearance(attribute);
                    delimiter = texts.common.tableDelimiterCol;
                    break;
                case 'right':
                    attribute = shapes.key.tableSelectedX;
                    selectedIndex = selectedItem.getAppearance(attribute) + 1;
                    delimiter = texts.common.tableDelimiterCol;
                    break;
                case 'row':
                case 'above':
                    attribute = shapes.key.tableSelectedY;
                    selectedIndex = selectedItem.getAppearance(attribute);
                    delimiter = texts.common.tableDelimiterRow;
                    break;
                case 'below':
                    attribute = shapes.key.tableSelectedY;
                    selectedIndex = selectedItem.getAppearance(attribute) + 1;
                    delimiter = texts.common.tableDelimiterRow;
                    break;
                default:
                    return;
            }

            switch (mode) {
                case 'add':
                    newText = getAddToTable(selectedItem, selectedIndex, delimiter);
                    break;
                case 'remove':
                    newText = getRemoveFromTable(selectedItem, selectedIndex, delimiter);
                    selectedIndex = (selectedIndex == 0) ? selectedIndex : selectedIndex - 1;
                    break;
                default:
                    return;
            }

            dispatch(changeItemsAppearance(selectedDiagram, [selectedItem.id], shapes.key.text, newText));
            dispatch(changeItemsAppearance(selectedDiagram, [selectedItem.id], attribute, selectedIndex));
        }
    });

    const addColumnLeft = useEventCallback(() => { modifyTable('add', 'left'); });
    const addColumnRight = useEventCallback(() => { modifyTable('add', 'right'); });
    const addRowAbove = useEventCallback(() => { modifyTable('add', 'above'); });
    const addRowBelow = useEventCallback(() => { modifyTable('add', 'below'); });
    const removeColumn = useEventCallback(() => { modifyTable('remove', 'column'); });
    const removeRow = useEventCallback(() => { modifyTable('remove', 'row'); });

    return (
        <>
            <Tooltip mouseEnterDelay={1} title={ 'Add Column Left' }>
                <Button type='text' className='tool-menu-item' onClick={ addColumnLeft }>
                    <InsertRowLeftOutlined />
                </Button>
            </Tooltip>
            
            <Tooltip mouseEnterDelay={1} title={ 'Add Column Right' }>
                <Button type='text' className='tool-menu-item' onClick={ addColumnRight }>
                    <InsertRowRightOutlined />
                </Button>
            </Tooltip>     
            <Tooltip mouseEnterDelay={1} title={ 'Add Row Above' }>
                <Button type='text' className='tool-menu-item' onClick={ addRowAbove }>
                    <InsertRowAboveOutlined />
                </Button>
            </Tooltip>
            <Tooltip mouseEnterDelay={1} title={ 'Add Row Below' }>
                <Button type='text' className='tool-menu-item' onClick={ addRowBelow }>
                    <InsertRowBelowOutlined />
                </Button>
            </Tooltip>

            <span className='menu-separator' />

            <Tooltip mouseEnterDelay={1} title={ 'Delete Column' }>
                <Button type='text' disabled={ !selectedItem?.text.includes(texts.common.tableDelimiterCol) } className='tool-menu-item' onClick={ removeColumn }>
                    <DeleteColumnOutlined />
                </Button>
            </Tooltip>
            <Tooltip mouseEnterDelay={1} title={ 'Delete Row' }>
                <Button type='text' disabled={ !selectedItem?.text.includes(texts.common.tableDelimiterRow) } className='tool-menu-item' onClick={ removeRow }>
                    <DeleteRowOutlined />
                </Button>
            </Tooltip>
        </>
    );
});
