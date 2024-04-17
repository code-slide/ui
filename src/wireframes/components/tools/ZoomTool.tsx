/*
 * codeslide.net
 *
 * @license
 * Forked from mydraft.cc by Sebastian Stehle
 * Copyright (c) Do Duc Quan. All rights reserved.
*/

import * as React from 'react';
import { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { useStore, getEditor, setZoom } from '@app/wireframes/model';
import { Button, Dropdown } from 'antd';
import { Vec2 } from '@app/core';
import { vogues } from '@app/const';
import type { MenuProps } from 'antd';

export const ZoomTool = React.memo(() => {
    const dispatch = useDispatch();
    const editorSize = useStore(getEditor).size;
    const sidebarWidth = useStore(s => s.ui.sidebarSize);
    const isFooter = useStore(s => s.ui.footerSize) == vogues.common.previewHeight ? 1 : 0;
    const [zoomValue, setZoomValue] = useState('Fit');

    const zoomPad = {
        vertical: vogues.common.editorMargin * 2 + vogues.common.editorPad  * 3 + vogues.common.headerHeight + vogues.common.shapeWidth + isFooter * (vogues.common.previewHeight + vogues.common.editorMargin + vogues.common.previewPadBot) + vogues.common.selectionThickness * 4,
        horizontal: vogues.common.editorMargin * 4 + vogues.common.editorPad * 3 + vogues.common.sidebarShape + vogues.common.selectionThickness * 4,
    }
    const [areaSize, setAreaSize] = useState(new Vec2(window.innerWidth - zoomPad.horizontal - sidebarWidth, window.innerHeight - zoomPad.vertical));

    const isZoom = (key: string) => {
        setZoomValue(key);
        dispatch(setZoom(getZoomValue(key)));
    };

    const getWindowSize = () => {
        setAreaSize(new Vec2(window.innerWidth - zoomPad.horizontal - sidebarWidth, window.innerHeight - zoomPad.vertical));
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
    }, [isFooter, sidebarWidth, editorSize]);

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
