/*
 * codeslide.net
 *
 * @license
 * Copyright (c) Sebastian Stehle. All rights reserved.
*/

import { CaretDownOutlined, CaretRightOutlined, DeleteOutlined, FileOutlined } from '@ant-design/icons';
import { Col, Dropdown, Input, Row } from 'antd';
import type { InputRef, MenuProps } from 'antd'
import classNames from 'classnames';
import * as React from 'react';
import { Keys, useEventCallback } from '@app/core';
import { texts } from '@app/texts';
import { Diagram, DiagramItem, OrderMode } from '@app/wireframes/model';
import { CircleIcon, FunctionIcon, ImageIcon, RectangleIcon, TableIcon, TextIcon, TriangleIcon } from '@app/icons/icon';

export type OutlineMenuAction = 'Delete' | 'Rename' | 'Move' | 'Select';

export interface OutlineMenuProps {
    // The item.
    diagramItem: DiagramItem;

    // The diagram.
    diagram: Diagram;

    // The level.
    level: number;

    // True, if the item is the first.
    isFirst: boolean;

    // True, if the item is the last.
    isLast: boolean;

    // When an action should be executed.
    onAction: (itemId: string, action: OutlineMenuAction, arg?: any) => void;
}

export const OutlineMenu = (props: OutlineMenuProps) => {
    const {
        diagram,
        diagramItem,
        level,
        isFirst,
        isLast,
        onAction,
    } = props;


    const [editName, setEditName] = React.useState('');
    const [editing, setEditing] = React.useState(false);
    const [expanded, setExpanded] = React.useState(true);
    const isGroup = diagramItem.type === 'Group';
    const DefaultName =  diagramItem.id;
    const itemName = DefaultName || (isGroup ? texts.common.group : diagramItem.renderer);
    const rendererName = diagramItem.renderer;

    const setText = useEventCallback((event: React.ChangeEvent<HTMLInputElement>) => {
        setEditName(event.target.value);
    });

    const doRenameStart = useEventCallback(() => {
        setEditName(itemName);
        setEditing(true);
    });

    const doRenameCancel = useEventCallback(() => {
        setEditing(false);
    });

    const doDelete = useEventCallback(() => {
        onAction(diagramItem.id, 'Delete');
    });

    const doSelect = useEventCallback(() => {
        onAction(diagramItem.id, 'Select');
    });

    const doMove = useEventCallback((event: { key: string }) => {
        onAction(diagramItem.id, 'Move', event.key);
    });

    const doEnter = useEventCallback((event: React.KeyboardEvent) => {
        if (Keys.isEnter(event) || Keys.isEscape(event)) {
            setEditing(false);
        }

        if (Keys.isEnter(event)) {
            onAction(diagramItem.id, 'Rename', editName);
        }
    });

    const initInput = React.useCallback((event: InputRef) => {
        event?.focus();
    }, []);

    const selected = diagram.selectedIds.has(diagramItem.id);

    const outlineDropdown: MenuProps['items'] = [
        { label: texts.common.rename, key: 'rename' },
        { type: 'divider' },
        { label: texts.common.bringToFront, key: OrderMode.BringToFront, disabled: isLast && level === 0 },
        { label: texts.common.bringForwards, key: OrderMode.BringForwards, disabled: isLast && level === 0 },
        { label: texts.common.sendBackwards, key: OrderMode.SendBackwards, disabled: isFirst && level === 0 },
        { label: texts.common.sendToBack, key: OrderMode.SendToBack, disabled: isFirst && level === 0 },
        { type: 'divider' },
        { label: texts.common.delete, key: 'delete', icon: <DeleteOutlined /> },
    ];

    const outlineClickEvt: MenuProps['onClick'] = ({ key }) => {
        if (key == 'rename') {
            doRenameStart;
        } else if (key == 'delete') {
            doDelete;
        } else {
            doMove;
        }
    };
    

    return (
        <div className='tree-item'>
            <div className='tree-item-header-container'>
                {editing ? (
                    <Input value={editName} onChange={setText} onBlur={doRenameCancel} onKeyUp={doEnter} ref={initInput} />
                ) : (
                    <Dropdown menu={{ items: outlineDropdown, onClick: outlineClickEvt }} trigger={['contextMenu']}>
                        <Row className={classNames('tree-item-header', { selected })} wrap={false} style={{ marginLeft: level * 20 }} onDoubleClick={doRenameStart} onClick={doSelect}>
                            <Col flex='none' style={{ display: 'flex' }}>
                                {isGroup ? (
                                    <span onClick={() => setExpanded(x => !x)}>
                                        {expanded ? (
                                            <CaretDownOutlined />
                                        ) : (
                                            <CaretRightOutlined />
                                        )}
                                    </span>
                                ) : (rendererName == 'Textbox') ? <TextIcon /> :
                                        (rendererName == 'Equation') ? <FunctionIcon /> :
                                            (rendererName == 'Cell') ? <TableIcon /> :
                                                (rendererName == 'Rectangle') ? <RectangleIcon /> :
                                                    (rendererName == 'Ellipse') ? <CircleIcon /> :
                                                        (rendererName == 'Triangle') ? <TriangleIcon /> :
                                                            (rendererName == 'Image') ? <ImageIcon /> :
                                                                <FileOutlined />
                                }
                            </Col>
                            <Col flex='auto' className='tree-item-title no-select'>
                                {itemName}
                            </Col>
                        </Row>
                    </Dropdown>
                )}
            </div>

            {expanded && isGroup &&
                <>{renderChildren(props)}</>
            }
        </div>
    );
};

function renderChildren(props: OutlineMenuProps) {
    const children = props.diagram.children(props.diagramItem);

    if (children.length === 0) {
        return null;
    }

    const newLevel = props.level + 1;

    return (
        <div>
            {children.map((item, index) =>
                <OutlineMenu key={item.id}
                    diagram={props.diagram}
                    diagramItem={item}
                    isFirst={index === 0}
                    isLast={index === children.length - 1}
                    level={newLevel}
                    onAction={props.onAction}
                />,
            )}
        </div>
    );
}