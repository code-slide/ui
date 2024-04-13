import { DiagramItem, setAnimation, getDiagram, useStore, changeFrames, parseFrames } from '@app/wireframes/model';
import { ClipboardTool } from './tools/ClipboardTool';
import { TableTool } from './tools/TableTool';
import { GroupingTool } from './tools/GroupingTool';
import './styles/ToolView.scss';
import { GraphicTool, HistoryTool, VisualTool, ZoomTool } from './tools';
import { Button, Segmented, message } from 'antd';
import { SelectOutlined } from '@ant-design/icons';
import { useDispatch } from 'react-redux';
import { SegmentedValue } from "antd/es/segmented";

export interface ToolDesignViewProps {
    item: DiagramItem | null;
    set: DiagramItem[] | null;
}

export const ToolDesignView = (props: ToolDesignViewProps) => {
    const { item, set } = props;

    return (
        <div className='tool-container'>
            <div className='tool-menu'>
                <HistoryTool />
                <span className='menu-separator' />
                <ZoomTool />
                <span className='menu-separator' />

                {(set != null && set.length > 1) && 
                    <>
                        <GroupingTool />
                        <span className='menu-separator' />
                    </>
                }

                <ClipboardTool canCopy={(set != null && set.length > 1) || item != null} />

                {(item != null) && 
                    <>
                        <span className='menu-separator' />
                        <VisualTool />
                    </>
                }

                {(item != null && item.renderer == 'Table') && 
                    <>
                        <span className='menu-separator' />
                        <TableTool />
                    </>
                }

                {(item != null && (item.renderer == 'Image' || item.renderer == 'Graphic')) && 
                    <>
                        <span className='menu-separator' />
                        <GraphicTool />
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
                className='menu-segment'
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