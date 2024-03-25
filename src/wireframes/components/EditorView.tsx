/*
 * codeslide.net
 *
 * @license
 * Copyright (c) Sebastian Stehle. All rights reserved.
*/

import { Dropdown } from 'antd';
import type { MenuProps } from 'antd';
import * as React from 'react';
import { DropTargetMonitor, useDrop } from 'react-dnd';
import { NativeTypes } from 'react-dnd-html5-backend';
import { findDOMNode } from 'react-dom';
import { useDispatch } from 'react-redux';
import { loadImagesToClipboardItems, sizeInPx, useClipboard as useClipboardProvider, useEventCallback } from '@app/core';
import { addShape, changeItemsAppearance, Diagram, getDiagram, getDiagramId, getEditor, getMasterDiagram, getSelectedItems, getSelectedItemsWithLocked, RendererService, selectItems, Transform, transformItems, useStore } from '@app/wireframes/model';
import { Editor } from '@app/wireframes/renderer/Editor';
import { DiagramRef, ItemsRef } from '../model/actions/utils';
import { ShapeSource } from '../interface';
import { MenuIcon } from '@app/style/icomoon/icomoon_icon';
import { texts } from '@app/texts';
import { useAlignment, useClipboard, useGrouping, useRemove } from './actions';
import './styles/EditorView.scss';

export interface EditorViewProps {
    // The spacing.
    spacing: number;
}

export const EditorView = (props: EditorViewProps) => {
    const diagram = useStore(getDiagram);

    if (!diagram) {
        return null;
    }

    return (
        <EditorViewInner {...props} diagram={diagram} />
    );
};

export const EditorViewInner = ({ diagram, spacing }: EditorViewProps & { diagram: Diagram }) => {
    const dispatch = useDispatch();
    const editor = useStore(getEditor);
    const editorColor = editor.color;
    const editorSize = editor.size;
    const masterDiagram = useStore(getMasterDiagram);
    const renderRef = React.useRef<any>();
    const selectedPoint = React.useRef({ x: 0, y: 0 });
    const selectedDiagramId = useStore(getDiagramId);
    const state = useStore(s => s);
    const zoom = useStore(s => s.ui.zoom);
    const zoomedSize = editorSize.mul(zoom);
    const [menuVisible, setMenuVisible] = React.useState(false);

    const forAlignment = useAlignment();
    const forClipboard = useClipboard();
    const forGrouping = useGrouping();
    const forRemove = useRemove();

    const doChangeItemsAppearance = useEventCallback((diagram: DiagramRef, visuals: ItemsRef, key: string, value: any) => {
        dispatch(changeItemsAppearance(diagram, visuals, key, value));
    });

    const doSelectItems = useEventCallback((diagram: DiagramRef, items: ItemsRef) => {
        dispatch(selectItems(diagram, items));
    });

    const doTransformItems = useEventCallback((diagram: DiagramRef, items: ItemsRef, oldBounds: Transform, newBounds: Transform) => {
        dispatch(transformItems(diagram, items, oldBounds, newBounds));
    });

    const doHide = useEventCallback(() => {
        setMenuVisible(false);
        ContextMenuEvt;
    });

    const doSetPosition = useEventCallback((event: React.MouseEvent) => {
        selectedPoint.current = { x: event.nativeEvent.offsetX, y: event.nativeEvent.offsetY };
    });

    const doPaste = useEventCallback((sources: ReadonlyArray<ShapeSource>, x: number, y: number) => {
        if (!selectedDiagramId) {
            return;
        }

        const shapes = RendererService.createShapes(sources);

        for (const { appearance, renderer, size } of shapes) {
            dispatch(addShape(selectedDiagramId, renderer, { position: { x, y }, size, appearance }));

            x += 40;
            y += 40;
        }
    });

    useClipboardProvider({
        onPaste: event => {
            if (!selectedDiagramId) {
                return;
            }
    
            const x = selectedPoint.current.x;
            const y = selectedPoint.current.y;

            doPaste(event.items, x, y);
        },
    });

    const [, drop] = useDrop({
        accept: [
            NativeTypes.URL,
            NativeTypes.FILE,
            NativeTypes.TEXT,
            'DND_ASSET',
            'DND_ICON',
        ],
        drop: async (item: any, monitor: DropTargetMonitor) => {
            if (!monitor || !renderRef.current || !selectedDiagramId) {
                return;
            }

            let offset = monitor.getSourceClientOffset();

            if (!offset) {
                offset = monitor.getClientOffset();
            }

            if (!offset) {
                return;
            }

            const componentRect = (findDOMNode(renderRef.current) as HTMLElement)!.getBoundingClientRect();

            let x = ((offset?.x || 0) - spacing - componentRect.left) / zoom;
            let y = ((offset?.y || 0) - spacing - componentRect.top) / zoom;

            const itemType = monitor.getItemType();

            switch (itemType) {
                case 'DND_ASSET':
                    dispatch(addShape(selectedDiagramId, item['name'], { position: { x, y } }));
                    break;
                case 'DND_ICON':
                    doPaste([{ type: 'Icon', ...item }], x, y);
                    break;
                case NativeTypes.TEXT:
                    doPaste([{ type: 'Text', ...item }], x, y);
                    break;
                case NativeTypes.URL: {
                    const urls: string[] = item.urls;

                    doPaste(urls.map(url => ({ type: 'Url', url })), x, y);
                    break;
                }
                case NativeTypes.FILE: {
                    const files: FileList | File[] = item.files;

                    doPaste(await loadImagesToClipboardItems(files), x, y);
                    break;
                }
            }
        },
    });

    drop(renderRef);

    const zoomedOuterWidth = 2 * spacing + zoomedSize.x;
    const zoomedOuterHeight = 2 * spacing + zoomedSize.y;

    const w = sizeInPx(zoomedOuterWidth);
    const h = sizeInPx(zoomedOuterHeight);

    const padding = sizeInPx(spacing);

    const ContextMenuEvt: MenuProps['onClick'] = ({key}) => {
        switch (key) {
            case forClipboard.cut.label:
                forClipboard.cut.onAction;
                break;
            case forClipboard.copy.label:
                forClipboard.copy.onAction;
                break;
            case forClipboard.paste.label:
                forClipboard.paste.onAction;
                break;
            case forRemove.remove.label:
                forRemove.remove.onAction;
                break;
            case forAlignment.alignHorizontalLeft.label:
                forAlignment.alignHorizontalLeft.onAction;
                break;
            case forAlignment.alignHorizontalCenter.label:
                forAlignment.alignHorizontalCenter.onAction;
                break;
            case forAlignment.alignHorizontalRight.label:
                forAlignment.alignHorizontalRight.onAction;
                break;
            case forAlignment.alignVerticalTop.label:
                forAlignment.alignVerticalTop.onAction;
                break;
            case forAlignment.alignVerticalCenter.label:
                forAlignment.alignVerticalCenter.onAction;
                break;
            case forAlignment.alignVerticalBottom.label:
                forAlignment.alignVerticalBottom.onAction;
                break;
            case forAlignment.distributeHorizontally.label:
                forAlignment.distributeHorizontally.onAction;
                break;
            case forAlignment.distributeVertically.label:
                forAlignment.distributeVertically.onAction;
                break;
            case forAlignment.bringToFront.label:
                forAlignment.bringToFront.onAction;
                break;
            case forAlignment.bringForwards.label:
                forAlignment.bringForwards.onAction;
                break;
            case forAlignment.sendBackwards.label:
                forAlignment.sendBackwards.onAction;
                break;
            case forAlignment.sendToBack.label:
                forAlignment.sendToBack.onAction;
                break;
            case forGrouping.group.label:
                forGrouping.group.onAction;
                break;
            case forGrouping.ungroup.label:
                forGrouping.ungroup.onAction;
                break;
            default:
                break;
        }   
    };
    
    const ContextMenu: MenuProps['items'] = [
        {
            key: forClipboard.cut.label,
            label: forClipboard.cut.label,
            icon: <MenuIcon icon={forClipboard.cut.icon} />,
            disabled: forClipboard.cut.disabled,
        },
        {
            key: forClipboard.copy.label,
            label: forClipboard.copy.label,
            icon: <MenuIcon icon={forClipboard.copy.icon} />,
            disabled: forClipboard.copy.disabled,
        },
        {
            key: forClipboard.paste.label,
            label: forClipboard.paste.label,
            icon: <MenuIcon icon={forClipboard.paste.icon} />,
            disabled: forClipboard.paste.disabled,
        },
        {
            type: 'divider',
        },
        {
            key: forRemove.remove.label,
            label: forRemove.remove.label,
            icon: <MenuIcon icon={forRemove.remove.icon} />,
            disabled: forRemove.remove.disabled,
        },
        {
            type: 'divider',
        },
        {
            key: 'alignment',
            label: texts.common.alignment,
            className: 'force-color',
            children: [
                {
                    key: forAlignment.alignHorizontalLeft.label,
                    label: forAlignment.alignHorizontalLeft.label,
                    icon: <MenuIcon icon={forAlignment.alignHorizontalLeft.icon} />,
                    disabled: forAlignment.alignHorizontalLeft.disabled,
                },
                {
                    key: forAlignment.alignHorizontalCenter.label,
                    label: forAlignment.alignHorizontalCenter.label,
                    icon: <MenuIcon icon={forAlignment.alignHorizontalCenter.icon} />,
                    disabled: forAlignment.alignHorizontalCenter.disabled,
                },
                {
                    key: forAlignment.alignHorizontalRight.label,
                    label: forAlignment.alignHorizontalRight.label,
                    icon: <MenuIcon icon={forAlignment.alignHorizontalRight.icon} />,
                    disabled: forAlignment.alignHorizontalRight.disabled,
                },
    
                {
                    key: forAlignment.alignVerticalTop.label,
                    label: forAlignment.alignVerticalTop.label,
                    icon: <MenuIcon icon={forAlignment.alignVerticalTop.icon} />,
                    disabled: forAlignment.alignVerticalTop.disabled,
                },
                {
                    key: forAlignment.alignVerticalCenter.label,
                    label: forAlignment.alignVerticalCenter.label,
                    icon: <MenuIcon icon={forAlignment.alignVerticalCenter.icon} />,
                    disabled: forAlignment.alignVerticalCenter.disabled,
                },
                {
                    key: forAlignment.alignVerticalBottom.label,
                    label: forAlignment.alignVerticalBottom.label,
                    icon: <MenuIcon icon={forAlignment.alignVerticalBottom.icon} />,
                    disabled: forAlignment.alignVerticalBottom.disabled,
                },
    
                {
                    key: forAlignment.distributeHorizontally.label,
                    label: forAlignment.distributeHorizontally.label,
                    icon: <MenuIcon icon={forAlignment.distributeHorizontally.icon} />,
                    disabled: forAlignment.distributeHorizontally.disabled,
                },
                {
                    key: forAlignment.distributeVertically.label,
                    label: forAlignment.distributeVertically.label,
                    icon: <MenuIcon icon={forAlignment.distributeVertically.icon} />,
                    disabled: forAlignment.distributeVertically.disabled,
                },
            ],
        },
        {
            key: 'ordering',
            label: texts.common.ordering,
            className: 'force-color',
            children: [
                {
                    key: forAlignment.bringToFront.label,
                    label: forAlignment.bringToFront.label,
                    icon: <MenuIcon icon={forAlignment.bringToFront.icon} />,
                    disabled: forAlignment.bringToFront.disabled,
                },
                {
                    key: forAlignment.bringForwards.label,
                    label: forAlignment.bringForwards.label,
                    icon: <MenuIcon icon={forAlignment.bringForwards.icon} />,
                    disabled: forAlignment.bringForwards.disabled,
                },
                {
                    key: forAlignment.sendBackwards.label,
                    label: forAlignment.sendBackwards.label,
                    icon: <MenuIcon icon={forAlignment.sendBackwards.icon} />,
                    disabled: forAlignment.sendBackwards.disabled,
                },
                {
                    key: forAlignment.sendToBack.label,
                    label: forAlignment.sendToBack.label,
                    icon: <MenuIcon icon={forAlignment.sendToBack.icon} />,
                    disabled: forAlignment.sendToBack.disabled,
                },
            ],
        },
        {
            key: forGrouping.group.label,
            label: forGrouping.group.label,
            icon: <MenuIcon icon={forGrouping.group.icon} />,
            disabled: forGrouping.group.disabled,
        },
        {
            key: forGrouping.ungroup.label,
            label: forGrouping.ungroup.label,
            icon: <MenuIcon icon={forGrouping.ungroup.icon} />,
            disabled: forGrouping.ungroup.disabled,
        },
    ];

    return (
        <Dropdown
            menu={{
                items: ContextMenu,
                onClick: doHide,
                className: 'context-menu',
                activeKey: 'none'
            }}
            trigger={['contextMenu']}
            open={menuVisible}
            onOpenChange={setMenuVisible}
        >            
            <div className='editor-view' onClick={doSetPosition}>
                <div className='editor-diagram' style={{ width: w, height: h, padding }} ref={renderRef} >
                    <Editor
                        color={editorColor}
                        diagram={diagram}
                        masterDiagram={masterDiagram}
                        onChangeItemsAppearance={doChangeItemsAppearance}
                        onSelectItems={doSelectItems}
                        onTransformItems={doTransformItems}
                        selectedItems={getSelectedItems(state)}
                        selectedItemsWithLocked={getSelectedItemsWithLocked(state)}
                        viewSize={editor.size}
                        zoom={zoom}
                        zoomedSize={zoomedSize}
                        isDefaultView={true}
                    />
                </div>
            </div>
        </Dropdown>
    );
};
