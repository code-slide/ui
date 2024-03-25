import { DiagramItem, setAnimation, setSidebarLeftSize, getDiagram, useStore, changeFrames } from '@app/wireframes/model';
import * as React from 'react';
import { ClipboardMenu } from './menu/ClipboardMenu';
import { TableMenu } from './menu/TableMenu';
import { GroupingMenu } from './menu/GroupingMenu';
import './styles/ToolView.scss';
import { HistoryMenu, VisualMenu, ZoomMenu } from './menu';
import { Button, Segmented, message } from 'antd';
import { ArrowsAltOutlined, FullscreenExitOutlined, SelectOutlined } from '@ant-design/icons';
import { useState } from 'react';
import { useDispatch } from 'react-redux';
import { SegmentedValue } from "antd/es/segmented";

export interface ToolDesignViewProps {
    item: DiagramItem | null;
    set: DiagramItem[] | null;
}

const FullscreenButton = () => {
    const SIDEBAR_LEFT_WIDTH = 200; 
    const dispatch = useDispatch();
    const [isFullscreen, setIsFullscreen] = useState(false);

    const hideSidebar = () => {
        if (isFullscreen) {
            dispatch(setSidebarLeftSize(SIDEBAR_LEFT_WIDTH));
            setIsFullscreen(!isFullscreen);
        } else {
            dispatch(setSidebarLeftSize(0));
            setIsFullscreen(!isFullscreen);
        }
    }

    return (
        <Button 
            type='text' shape='circle' 
            className='tool-toggle' 
            icon={isFullscreen ? <FullscreenExitOutlined /> : <ArrowsAltOutlined />}
            onClick={hideSidebar} />
    )
}

export const ToolDesignView = (props: ToolDesignViewProps) => {
    const { item, set } = props;

    return (
        <div className='tool-container'>
            <FullscreenButton />
            <div className='tool-menu'>
                <HistoryMenu />
                <span className='menu-separator' />
                <ZoomMenu />
                <span className='menu-separator' />

                {(set != null && set.length > 1) && 
                    <>
                        <GroupingMenu />
                        <span className='menu-separator' />
                    </>
                }

                <ClipboardMenu canCopy={(set != null && set.length > 1) || item != null} />

                {(item != null) && 
                    <>
                        <span className='menu-separator' />
                        <VisualMenu />
                    </>
                }

                {(item != null && item.renderer == 'Table') && 
                    <>
                        <span className='menu-separator' />
                        <TableMenu />
                    </>
                }
            </div>
        </div>
    )
};

export const ToolAnimationView = () => {
    const dispatch = useDispatch();
    const diagram = useStore(getDiagram);
    const [messageApi, contextHolder] = message.useMessage();

    if (!diagram) {
        return null;
    }

    const modeMenu = [
        { value: 'script', label: 'Animation Script' },
        { value: 'output', label: 'Output' },
    ];

    const modeMenuEvt = (key: SegmentedValue) => {
        if (key == 'script' || key == 'output')
            dispatch(setAnimation(key));
    }

    const strToList = (str: string) => {
        // Remove the outer brackets and split the string into separate items
        let items = str.slice(2, -2).split('], [');

        // Process each item to remove the quotes and split it into a list
        let result = items.map(item => {
            // Split into sub-items using `,` symbol, ignoring those inside curly brackets
            const regex = /,(?![^{]*})/;
            let subItems = item.split(regex);
            
            // Process each sub-item to remove the quotes
            let listItem = subItems.map(subItem => subItem.trim().slice(1, -1));
            
            return listItem;
        });
        
        return result;
    }
    
    const fetchFrames = () => {
        const script = diagram.script;

        if ((script != undefined)) {
            fetch('http://localhost:5002', {
                method: 'POST',
                headers: {
                    'Content-type': 'application/json; charset=UTF-8',
                },
                body: JSON.stringify({
                    script: script
                })
            })
                .then((response) => {
                    return response.json();
                })
                .then((data) => {
                    let frames = strToList(data.frames);
                    dispatch(changeFrames(diagram.id, frames));
                    messageApi.success('Script is loaded successfully');
                })
                .catch((err) => {
                    messageApi.error(`${err}`);
                });
            } else {
                messageApi.error('Empty script. Cannot perform action');
            }
    }

    return (
        <div className='tool-container'>
            <Segmented 
                options={modeMenu}
                onChange={(value) => modeMenuEvt(value)}
            />
            {contextHolder}
            <Button 
                type='text' shape='round'
                className="header-cta-right"
                icon={<SelectOutlined />}
                onClick={fetchFrames}>
                    <h4>Load script</h4>
            </Button>
        </div>
    )
};