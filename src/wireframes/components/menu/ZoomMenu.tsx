/*
 * codeslide.net
 *
 * @license
 * Copyright (c) Sebastian Stehle. All rights reserved.
*/

import * as React from 'react';
import { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { useStore, getEditor, setZoom } from '@app/wireframes/model';
import { Button, Dropdown } from 'antd';
import { Vec2 } from '@app/core';
import type { MenuProps } from 'antd';

export const ZoomMenu = React.memo(() => {
    const PADD_VERT = 13 * 2 + 10 * 3 + 56 + 38 + (72 + 15 + 23) + 4; // EDITOR_MARGIN * 2 + INNER_PADD * 3 + headerHeight + SHAPE_HEIGHT + pagesHeight + (BORDER * 4)?
    const PADD_HORI = 13 * 2 + 13 * 2 + 10 * 2 + 38 + 4; // EDITOR_MARGIN * 2 + OUTER_PADD * 2 + INNER_PADD * 2 + SHAPE_WIDTH + (BORDER * 4)?;

    const dispatch = useDispatch();
    const editorSize = useStore(getEditor).size;
    const sidebarLeftSize = useStore(s => s.ui.sidebarLeftSize);
    const sidebarRightSize = useStore(s => s.ui.sidebarRightSize);
    const [zoomValue, setZoomValue] = useState('Fit');
    const [areaSize, setAreaSize] = useState(new Vec2(window.innerWidth - PADD_HORI - sidebarLeftSize - sidebarRightSize, window.innerHeight - PADD_VERT));

    const isZoom = (key: string) => {
        setZoomValue(key);
        dispatch(setZoom(getZoomValue(key)));
    };

    const getWindowSize = () => {
        setAreaSize(new Vec2(window.innerWidth - PADD_HORI - sidebarLeftSize - sidebarRightSize, window.innerHeight - PADD_VERT));
    }
    
    // Get area size value on resizing window
    useEffect(() => {
        if (zoomValue == 'Fit') {
            window.addEventListener('resize', getWindowSize);
            isZoom(zoomValue);
        }

        return () => {
            window.removeEventListener('resize', getWindowSize);
        };
    }, [isZoom]);

    // Get area size value on toggling sidebars / changing canvas size
    useEffect(() => {
        if (zoomValue == 'Fit') {
            getWindowSize();
            isZoom(zoomValue);
        }

    }, [sidebarLeftSize, sidebarRightSize, editorSize]);

    const getZoomValue = (value: string) => {
        switch (value) {
            case '50':
            case '75':
            case '100':
            case '125':
            case '150':
            case '200':
                return Number(value) / 100;
            case 'Fit':
            default:
                return Math.floor(Math.min(areaSize.x / editorSize.x, areaSize.y / editorSize.y) * 100) / 100;
        }
    }

    const zoomMenu: MenuProps['items'] = [
        { key: 'Fit', label: 'Fit', className: 'loading-action-item' },
        { type: 'divider' },
        { key: '50', label: '50%', className: 'loading-action-item' },
        { key: '75', label: '75%', className: 'loading-action-item' },
        { key: '100', label: '100%', className: 'loading-action-item' },
        { key: '125', label: '125%', className: 'loading-action-item' },
        { key: '150', label: '150%', className: 'loading-action-item' },
        { key: '200', label: '200%', className: 'loading-action-item' },
    ];

    const zoomEvt: MenuProps['onClick'] = ({key}) => {
        isZoom(key);
    };

    return (
        <>
            <Dropdown
                menu={{ items: zoomMenu, onClick: zoomEvt, selectable: true, defaultSelectedKeys: [zoomValue], }}
                className='tool-menu-item'
                trigger={['click']}>
                <Button type="text">
                    <h5>{`${Math.floor(getZoomValue(zoomValue) * 100)}%`}</h5>
                </Button>
            </Dropdown>
        </>
    );
});
