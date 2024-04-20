import { DiagramItem, DiagramItemSet, setAnimation } from '@app/wireframes/model';
import { ClipboardTool } from './tools/ClipboardTool';
import { TableTool } from './tools/TableTool';
import './styles/ToolView.scss';
import { AlignmentTool, GraphicTool, HistoryTool, LineTool, OrderingTool, TextTool, VisualTool, ZoomTool } from './tools';
import { Segmented } from 'antd';
import { useAppDispatch } from '@app/store';
import { SegmentedValue } from "antd/es/segmented";
import { shapes } from '@app/const';
import { ModeType } from '../interface';

export interface ToolViewProps {
    // Application's mode
    mode: ModeType;

    // Group
    set: DiagramItemSet | null;
}

export const ToolView = (props: ToolViewProps) => {
    const { set } = props;
    const dispatch = useAppDispatch();

    const item = set?.selectedItems[0];
    const isMultiItems = set != null && set.selection.size > 1;
    const isSingleItem = !(!item) && item != null;

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
                    <ClipboardTool canCopy={isSingleItem || isMultiItems} />
                    { isSingleItem && <MoreTools item={item} /> }
                    { isMultiItems && <AlignmentTool /> }
                    { isSingleItem && <OrderingTool /> }
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