import { DiagramItem, setAnimation, setSidebarLeftSize, getDiagram, useStore, changeFrames, parseFrames } from '@app/wireframes/model';
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
        { value: 'script', label: 'Script' },
        { value: 'output', label: 'Output' },
    ];

    const modeMenuEvt = (key: SegmentedValue) => {
        if (key == 'script' || key == 'output')
            dispatch(setAnimation(key));
    }
    
    const fetchFrames = async () => {
        const script = diagram.script;

        if (!script) {
            messageApi.error('Empty script. Cannot perform action');
            return;
        };

        try {
            const frames = await parseFrames(script);
            dispatch(changeFrames(diagram.id, frames));
            messageApi.success('Script is loaded successfully');
        } catch (error) {
            messageApi.error(`${error}`);
        }
    }

    return (
        <div className='tool-container'>
            {contextHolder}
            <Segmented 
                options={modeMenu}
                onChange={(value) => modeMenuEvt(value)}
            />
            <Button 
                type='text' shape='round'
                className="header-cta-right"
                icon={<SelectOutlined />}
                onClick={fetchFrames}
                style={{ marginRight: 0 }}>
                    <h4>Load script</h4>
            </Button>
        </div>
    )
};