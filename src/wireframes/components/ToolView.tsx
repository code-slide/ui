import { DiagramItem, setAnimation } from '@app/wireframes/model';
import { ClipboardTool } from './tools/ClipboardTool';
import { TableTool } from './tools/TableTool';
import './styles/ToolView.scss';
import { AlignmentTool, GraphicTool, HistoryTool, LineTool, OrderingTool, TextTool, VisualTool, ZoomTool } from './tools';
import { Segmented } from 'antd';
import { useDispatch } from 'react-redux';
import { SegmentedValue } from "antd/es/segmented";
import { shapes } from '@app/const';
import { ModeType } from '../interface';

export interface ToolViewProps {
    // Application's mode
    mode: ModeType;

    // Item
    item: DiagramItem | null;

    // Group
    set: DiagramItem[] | null;
}

export const ToolView = (props: ToolViewProps) => {
    const { item, set } = props;
    const dispatch = useDispatch();

    const MoreTools = (props: {item: DiagramItem}) => {
        const renderer = props.item.renderer;

        if (renderer == shapes.id.table) {
            return (
                <>
                    <span className='menu-separator' />
                    <TextTool />
                    <span className='menu-separator' />
                    <VisualTool />
                    <span className='menu-separator' />
                    <TableTool />
                </>
            )
        } else if (renderer == shapes.id.image || renderer == shapes.id.graphic) {
            return (
                <>
                    <span className='menu-separator' />
                    <GraphicTool />
                </>
            )
        } else if (renderer == shapes.id.textbox || renderer == shapes.id.equation) {
            return (
                <>
                    <span className='menu-separator' />
                    <TextTool />
                </>
            )
        } else if (renderer == shapes.id.line) {
            return (
                <>
                    <span className='menu-separator' />
                    <TextTool />
                    <span className='menu-separator' />
                    <VisualTool />
                    <span className='menu-separator' />
                    <LineTool lineType={props.item.appearance.get(shapes.key.lineType)}  />
                </>
            )
        } else {
            return (
                <>
                    <span className='menu-separator' />
                    <VisualTool />
                </>
            )
        }
    }

    const modeMenu = [
        { value: 'script', label: 'Script' },
        { value: 'output', label: 'Output' },
    ];

    const modeMenuEvt = (key: SegmentedValue) => {
        if (key == 'script' || key == 'output')
            dispatch(setAnimation(key));
    }

    return (
        <div className='tool-container'>
            <div className='tool-menu'>
                <div className='tool-scroll'>
                    <HistoryTool />
                    <span className='menu-separator' />
                    <ZoomTool />
                    <span className='menu-separator' />
                    <ClipboardTool canCopy={(set != null && set.length > 1) || item != null} />
                    { (item != null) && <MoreTools item={item} /> }
                    { (set != null && set.length > 1) && <AlignmentTool /> }
                    { (item != null) && <OrderingTool /> }
                </div>
            </div>

            <Segmented 
                style={{ display: props.mode == 'design' ? 'none' : '' }}
                className='menu-segment'
                options={modeMenu}
                onChange={(value) => modeMenuEvt(value)}
            />
        </div>
    )
};