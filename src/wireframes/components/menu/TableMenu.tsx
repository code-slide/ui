/*
 * codeslide.net
 *
 * Do Duc Quan
 * 15 Oct 2023
*/

import { DeleteColumnOutlined, DeleteRowOutlined, InsertRowAboveOutlined, InsertRowBelowOutlined, InsertRowLeftOutlined, InsertRowRightOutlined } from '@ant-design/icons';
import { useEventCallback } from '@app/core';
import { Button, Tooltip } from 'antd';
import { useStore, getSelectedShape, changeItemsAppearance, getDiagram } from '@app/wireframes/model';
import * as React from 'react';
import { getAddToTable, getRemoveFromTable } from '@app/wireframes/shapes/neutral/table';
import { useDispatch } from 'react-redux';
import { texts } from '@app/texts';

export const TableMenu = React.memo(() => {
    const dispatch = useDispatch();
    const selectedItem = useStore(getSelectedShape);
    const selectedDiagram = useStore(getDiagram);

    const modifyTable = useEventCallback((mode: string, type: string) => {
        if (selectedItem && selectedDiagram) {
            let delimiter: string;
            let attribute: string;
            let selectedIndex: number;
            let newText: string;

            switch (type) {
                case 'column':
                case 'left':
                    attribute = 'SELECTED_CELL_X';
                    selectedIndex = selectedItem.getAppearance(attribute);
                    delimiter = texts.common.tableDelimiterCol;
                    break;
                case 'right':
                    attribute = 'SELECTED_CELL_X';
                    selectedIndex = selectedItem.getAppearance(attribute) + 1;
                    delimiter = texts.common.tableDelimiterCol;
                    break;
                case 'row':
                case 'above':
                    attribute = 'SELECTED_CELL_Y';
                    selectedIndex = selectedItem.getAppearance(attribute);
                    delimiter = texts.common.tableDelimiterRow;
                    break;
                case 'below':
                    attribute = 'SELECTED_CELL_Y';
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

            dispatch(changeItemsAppearance(selectedDiagram, [selectedItem.id], 'TEXT', newText));
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
