/*
 * codeslide.net
 *
 * Do Duc Quan
 * 8 Nov 2023
*/

import { Button, Dropdown, Form, Input } from 'antd';
import type { MenuProps } from 'antd';
import { getDiagramId, useStore, addShape } from '@app/wireframes/model';
import * as React from 'react';
import { ArrowIcon, CircleIcon, FunctionIcon, ImageIcon, RectangleIcon, TableIcon, TextIcon, TriangleIcon, ShapesIcon, LinkIcon, HeadingIcon, SubHeadingIcon, ParagraphIcon, DiamondIcon, VectorIcon, LineUpIcon, BezierIcon } from '@app/icons/icon';
import { useAppDispatch } from '@app/store';
import './styles/ShapeView.scss';
import { useState } from 'react';
import classNames from 'classnames';
import { FormModal, ShapeModal } from './modal/FormModal';
import { shapes } from '@app/const';

export const ShapeView = React.memo(() => {
    const dispatch = useAppDispatch();
    const selectedDiagramId = useStore(getDiagramId);
    const [selectedCell, setSelectedCell] = useState(0);
    const [isShapeModal, setIsShapeModal] = useState<ShapeModal>('');

    const OFFSET_DROPDOWN = [45, -45];  // Place to the left
    const CELL_ATTR = { size: 16, cols: 8, rows: 8 }; // Max table creation size
    const DROPDOWN_PADD = 16 * 2;
    const dropdownWidth = (CELL_ATTR.size + 4) * CELL_ATTR.cols - 4;
    const numRow = Math.floor(selectedCell / CELL_ATTR.cols) + 1;
    const numCol = selectedCell % CELL_ATTR.cols + 1;

    const handleImageURLOk = (values: any) => {
        const customAppearance: { [key: string]: any } = {};
        customAppearance[shapes.key.imageUrl] = values.image_url;

        createNewShape(shapes.id.image, customAppearance)
        setIsShapeModal('');
    };

    const handleCustomShapeOk = (values: any) => {
        const customAppearance: { [key: string]: any } = {};
        customAppearance[shapes.key.svgCode] = values.svg_code;

        createNewShape(shapes.id.graphic, customAppearance);
        setIsShapeModal('');
    };

    const createNewShape = (renderer: string, appearance?: any) => {
        if (selectedDiagramId) {
            dispatch(addShape(selectedDiagramId, renderer, { position: { x: 10, y: 10 }, appearance: appearance }));
        }
    };

    const textMenu: MenuProps['items'] = [
        { key: 'Heading', label: 'Heading', icon: <HeadingIcon />, className: 'menu-shape', },
        { key: 'Subheading', label: 'Subheading', icon: <SubHeadingIcon />, className: 'menu-shape', },
        { key: 'Paragraph', label: 'Paragraph', icon: <ParagraphIcon />, className: 'menu-shape', },
        { type: 'divider' },
        { key: shapes.id.equation, label: shapes.id.equation, icon: <FunctionIcon />, className: 'menu-shape', }
    ];
    const textMenuEvt: MenuProps['onClick'] = ({ key }) => {
        const customAppearance: { [key: string]: any } = {};
        
        if (key == 'Heading') {
            customAppearance[shapes.key.text] = 'Add a heading';
            customAppearance[shapes.key.fontSize] = 60;
            createNewShape(shapes.id.textbox, customAppearance);
        } else if (key == 'Subheading') {
            customAppearance[shapes.key.text] = 'Add a subheading';
            customAppearance[shapes.key.fontSize] = 40;
            createNewShape(shapes.id.textbox, customAppearance);
        } else if (key == 'Paragraph') {
            customAppearance[shapes.key.text] = 'Add a paragraph';
            customAppearance[shapes.key.fontSize] = 24;
            createNewShape(shapes.id.textbox, customAppearance);
        } else if (key == shapes.id.equation) {
            createNewShape(shapes.id.equation)
        }
    };

    const cellMenu: MenuProps['items'] = [
        {
            key: 'Cell', className: 'menu-table', label: <>
                <div className='menu-table' style={{ width: dropdownWidth }} >
                    {[...Array(CELL_ATTR.rows * CELL_ATTR.cols)].map((_, i) =>
                        <div
                            key={i}
                            className={classNames('menu-cell', { active: (i <= selectedCell) && ((i % CELL_ATTR.cols) < numCol) })}
                            style={{ width: CELL_ATTR.size, height: CELL_ATTR.size }}
                            onMouseEnter={() => setSelectedCell(i)} />
                    )}
                </div>
                <p className='menu-table-text'>
                    {`${numCol} x ${numRow}`}
                </p>
            </>
        }
    ];
    const cellMenuEvtClick: MenuProps['onClick'] = () => {
        const customAppearance: { [key: string]: any } = {};
        customAppearance[shapes.key.text] = Array(numCol).join(',') + Array(numRow).join(';');
        createNewShape(shapes.id.table, customAppearance);
    };
    const cellMenuEvtLeave: MenuProps['onMouseLeave'] = () => {
        setSelectedCell(0);
    };

    const shapeMenu: MenuProps['items'] = [
        { key: 'Rectangle', label: 'Rectangle', icon: <RectangleIcon />, className: 'menu-shape', },
        { key: 'Ellipse', label: 'Ellipse', icon: <CircleIcon />, className: 'menu-shape', },
        { key: 'Triangle', label: 'Triangle', icon: <TriangleIcon />, className: 'menu-shape', },
        { key: 'Rhombus', label: 'Rhombus', icon: <DiamondIcon />, className: 'menu-shape', },
        { type: 'divider' },
        { key: 'Custom', label: 'Custom', icon: <VectorIcon />, className: 'menu-shape', },
    ];
    const shapeMenuEvt: MenuProps['onClick'] = ({ key }) => {
        const customAppearance: { [key: string]: any } = {};

        if (key == 'Custom') {
            setIsShapeModal('shape');
        } else {
            customAppearance[shapes.key.fontSize] = 24;
            customAppearance[shapes.key.shape] = key;
            createNewShape(shapes.id.shape, customAppearance);
        }
    };

    const lineMenu: MenuProps['items'] = [
        { key: 'Arrow', label: 'Arrow', icon: <ArrowIcon />, className: 'menu-shape', },
        { key: 'Curve', label: 'Curve', icon: <BezierIcon />, className: 'menu-shape', },
    ];
    const lineMenuEvt: MenuProps['onClick'] = ({ key }) => {
        const customAppearance: { [key: string]: any } = {};
        customAppearance[shapes.key.fontSize] = 24;

        if (key == 'Curve') customAppearance[shapes.key.lineType] = 'Quadratic'; 
        createNewShape(shapes.id.line, customAppearance);
    };

    const imageMenu: MenuProps['items'] = [
        { key: 'url', label: 'By URL', icon: <LinkIcon />, className: 'menu-shape', },
    ]
    const imageMenuEvt: MenuProps['onClick'] = () => {
        setIsShapeModal('image');
    };

    return (
        <>
            <Dropdown
                menu={{
                    items: textMenu,
                    onClick: textMenuEvt,
                    style: { width: dropdownWidth + DROPDOWN_PADD },
                }}
                align={{ offset: OFFSET_DROPDOWN }}
                trigger={['click']}
            >
                <Button className='item' type='text' aria-label='Add Text'>
                    <TextIcon />
                </Button>
            </Dropdown>

            <Dropdown
                menu={{
                    items: cellMenu,
                    onClick: cellMenuEvtClick, onMouseLeave: cellMenuEvtLeave,
                    className: 'menu-table',
                }}
                align={{ offset: OFFSET_DROPDOWN }}
                trigger={['click']}
            >
                <Button className='item' type='text' aria-label='Add table'>
                    <TableIcon />
                </Button>
            </Dropdown>

            <Dropdown
                menu={{
                    items: shapeMenu,
                    onClick: shapeMenuEvt,
                    style: { width: dropdownWidth + DROPDOWN_PADD },
                }}
                align={{ offset: OFFSET_DROPDOWN }}
                trigger={['click']}
            >
                <Button className='item' type='text' aria-label='Add Shape'>
                    <ShapesIcon />
                </Button>
            </Dropdown>

            <Dropdown
                menu={{
                    items: lineMenu,
                    onClick: lineMenuEvt,
                    style: { width: dropdownWidth + DROPDOWN_PADD },
                }}
                align={{ offset: OFFSET_DROPDOWN }}
                trigger={['click']}
            >
                <Button className='item' type='text' aria-label='Add Line'>
                    <LineUpIcon />
                </Button>
            </Dropdown>

            <Dropdown
                menu={{
                    items: imageMenu,
                    onClick: imageMenuEvt,
                    style: { width: dropdownWidth + DROPDOWN_PADD },
                }}
                align={{ offset: OFFSET_DROPDOWN }}
                trigger={['click']}
            >
                <Button className='item' type='text' aria-label='Add Image'>
                    <ImageIcon />
                </Button>
            </Dropdown>

            <FormModal
                title='Add Image'
                okText='Add'
                open={isShapeModal == 'image'}
                onCancel={() => setIsShapeModal('')}
                onCreate={handleImageURLOk}
                formItems={
                    <>
                        <Form.Item name="image_url">
                            <Input type="textarea" placeholder="Paste URL of image..." />
                        </Form.Item>
                    </>
                }
            />

            <FormModal
                title='Add Custom Shape'
                okText='Add'
                open={isShapeModal == 'shape'}
                onCancel={() => setIsShapeModal('')}
                onCreate={handleCustomShapeOk}
                formItems={
                    <>
                        <Form.Item name="svg_code">
                            <Input.TextArea rows={10} placeholder="Paste SVG code..." />
                        </Form.Item>
                    </>
                }
            />
        </>
    );
});
