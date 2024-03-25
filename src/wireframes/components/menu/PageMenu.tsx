/*
 * codeslide.net
 *
 * @license
 * Copyright (c) Sebastian Stehle. All rights reserved.
*/

import * as svg from '@svgdotjs/svg.js';
import * as React from 'react';
import { Diagram, getEditor, useStore } from '@app/wireframes/model';
import { Card, Dropdown, Tooltip } from 'antd';
import { CopyOutlined, DeleteOutlined, FileAddOutlined, PlusOutlined } from '@ant-design/icons';
import classNames from 'classnames';
import { SVGHelper, Subscription, Vec2, useEventCallback } from '@app/core';
import { texts } from '@app/texts';
import { InteractionService } from '@app/wireframes/renderer/interaction-service';
import { RenderLayer } from '@app/wireframes/renderer/RenderLayer';
import { PreviewEvent } from '@app/wireframes/renderer/preview';
import type { MenuProps } from 'antd';

interface PageProps {
    // Width.
    cardWidth: number;

    // Height.
    cardHeight: number;
}

interface PageCoverProps extends PageProps {
    // The selected diagram.
    diagram: Diagram;

    // True when rendered.
    onRender?: () => void;
}

interface PageAddProps extends PageProps {
    // Action onClick.
    onClick: React.MouseEventHandler
}

interface PageThumbnailProps extends PageProps {
    // The diagram.
    diagram: Diagram;

    // Name.
    pageIndex: number;

    // True if selected.
    selected?: boolean;

    // When an action should be executed.
    onAction: (diagramId: string, action: PageAction, arg?: any) => void;
}

export type PageAction = 'Delete' | 'Add' | 'Select' | 'Duplicate';

const PageCover = (props: PageCoverProps) => {
    const { diagram, cardWidth, cardHeight, onRender } = props;
    
    const editor = useStore(getEditor);
    const color = editor.color;
    const zoomSize = new Vec2(cardWidth, cardHeight);
    const viewSize = editor.size;

    // Use a stream of preview updates to bypass react for performance reasons.
    const renderPreview = React.useRef(new Subscription<PreviewEvent>());
    const renderMainLayer = React.useRef<svg.Container>();
    const [interactionMainService, setInteractionMainService] = React.useState<InteractionService>();

    const onInit = React.useCallback((doc: svg.Svg) => {
        renderMainLayer.current = doc.group().id('parentLayer');

        setInteractionMainService(new InteractionService([],
        renderMainLayer.current, doc));
    }, []);

    React.useEffect(() => {
        if (!interactionMainService) return;
        
        SVGHelper.setSize(renderMainLayer.current!, cardWidth, cardHeight); 

    }, [viewSize, interactionMainService]);

    const [document, setDocument] = React.useState<svg.Svg>();

    const doInit = React.useCallback((ref: HTMLDivElement) => {
        if (!ref) {
            return;
        }

        const doc = svg.SVG().addTo(ref).css({ position: 'relative', overflow: 'visible' }).attr('tabindex', 0);

        setDocument(doc);
    }, []);

    React.useEffect(() => {
        if (document && onInit) {
            onInit(document);
        }
    }, [document, onInit]);

    React.useEffect(() => {
        if (document) {
            const x = 0;
            const y = 0;
            const w = viewSize.x;
            const h = viewSize.y;

            document.size(zoomSize.x, zoomSize.y).viewbox(x, y, w, h);
        }
    }, [viewSize, zoomSize, document]);

    return (
        <div style={{ background: color.toString() }}>
            <div style={{ width: cardWidth, height: cardHeight }} ref={doInit} />
            {interactionMainService && diagram && (
                <RenderLayer
                    diagram={diagram}
                    diagramLayer={renderMainLayer.current!}
                    preview={renderPreview.current}
                    onRender={onRender}
                />
            )}
        </div>
    )
}

export const PageAdd = (props: PageAddProps) => {
    const { cardWidth, cardHeight, onClick } = props;
    return (
        <Card
            className='pages-add'
            style={{ width: cardWidth, height: cardHeight, borderRadius: 20, overflow: "hidden" }} 
            bordered={false}
            onClick={onClick}
            cover={
                <div id='pages-cover' style={{ height: cardHeight }}>
                    <PlusOutlined />
                </div>   
            }
        />
    )
}

export const PageThumbnail = (props: PageThumbnailProps) => {
    const { diagram, pageIndex, cardWidth, cardHeight, selected, onAction } = props;

    const doSelect = useEventCallback(() => {
        onAction(diagram.id, 'Select');
    });

    const doAdd = useEventCallback(() => {
        onAction(diagram.id, 'Add', { index: pageIndex });
    });

    const doDuplicate = useEventCallback(() => {
        onAction(diagram.id, 'Duplicate', { index: pageIndex });
    });

    const doDelete = useEventCallback(() => {
        onAction(diagram.id, 'Delete');
    });

    const pageItem: MenuProps['items'] = [
        { key: 'add', label: `${texts.common.newDiagram} page`, icon: <FileAddOutlined />, className: 'action-item'},
        { key: 'duplicate', label: `${texts.common.duplicate} page`, icon: <CopyOutlined />, className: 'action-item'},
        { key: 'delete', label: `${texts.common.delete} page`, icon: <DeleteOutlined />, className: 'action-item'},
    ];

    const pageEvt: MenuProps['onClick'] = ({key}) => {
        if (key == 'add') {
            doAdd();
        } else if (key == 'duplicate') {
            doDuplicate();
        } else if (key == 'delete') {
            doDelete();
        }
    };

    return (
        <div className='tree-item'>
            <div className='tree-item-header-container'>
                <div
                    className={classNames('pages-thumbnail', { selected }) }
                    style={{ height: cardHeight }} >
                    <Tooltip title={`Page ${pageIndex}`}>
                        <Dropdown menu={{ items: pageItem, onClick: pageEvt }} trigger={['contextMenu']}>
                            <Card
                                className='pages-card'
                                style={{ width: cardWidth, height: cardHeight, borderRadius: 20, overflow: "hidden" }} 
                                onClick={doSelect}
                                cover={<PageCover diagram={diagram} cardWidth={cardWidth} cardHeight={cardHeight} />}
                            />
                        </Dropdown>
                    </Tooltip>
                    <h5 className='pages-index'>{pageIndex}</h5>
                </div>
            </div>
        </div>
    );
};