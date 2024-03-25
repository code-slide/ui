/*
 * codeslide.net
 *
 * Do Duc Quan
 * 8 Nov 2023
*/

import { useDispatch } from 'react-redux';
import { Button, Dropdown, Form, Input } from 'antd';
import type { MenuProps } from 'antd';
import { getDiagramId, useStore, addShape } from '@app/wireframes/model';
import * as React from 'react';
import { ArrowIcon, CircleIcon, FunctionIcon, ImageIcon, RectangleIcon, TableIcon, TextIcon, TriangleIcon, ShapesIcon, LinkIcon, HeadingIcon, SubHeadingIcon, ParagraphIcon, DiamondIcon, VectorIcon, LineIcon, BezierIcon } from '@app/icons/icon';
import './styles/ShapeView.scss';
import { useState } from 'react';
import classNames from 'classnames';
import { ModalForm } from './overlay/ModalForm';
import TextArea from 'antd/es/input/TextArea';

type ShapeModal = 'image' | 'shape' | '';

export const ShapeView = React.memo(() => {
    const dispatch = useDispatch();
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
        createNewShape('Image', { 'IMAGE_URL': values.image_url })
        setIsShapeModal('');
    };

    const handleCustomShapeOk = (values: any) => {
        createNewShape('Graphic', { 'SVG_CODE': values.svg_code });
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
        { key: 'Equation', label: 'Equation', icon: <FunctionIcon />, className: 'menu-shape', }
    ];
    const textMenuEvt: MenuProps['onClick'] = ({ key }) => {
        if (key == 'Heading') {
            createNewShape('Textbox', { 'TEXT': 'Add a heading', 'FONT_SIZE': 60 })
        } else if (key == 'Subheading') {
            createNewShape('Textbox', { 'TEXT': 'Add a subheading', 'FONT_SIZE': 40 })
        } else if (key == 'Paragraph') {
            createNewShape('Textbox', { 'TEXT': 'Add a paragraph', 'FONT_SIZE': 24 })
        } else if (key == 'Equation') {
            createNewShape('Equation')
        }
    };

    const cellMenu: MenuProps['items'] = [
        {
            key: 'Cell', className: 'menu-table', label: <>
                <div className='menu-table' style={{ width: dropdownWidth }} >
                    {[...Array(CELL_ATTR.rows * CELL_ATTR.cols)].map((e, i) =>
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
        createNewShape('Table', { 
            'TEXT': Array(numCol).join(',') + Array(numRow).join(';'),
        });
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
        if (key == 'Custom') {
            setIsShapeModal('shape');
        } else {
            createNewShape('Shape', { 'FONT_SIZE': 24, 'SHAPE': key });
        }
    };

    const lineMenu: MenuProps['items'] = [
        { key: 'Arrow', label: 'Arrow', icon: <ArrowIcon />, className: 'menu-shape', },
        { key: 'Curve', label: 'Curve', icon: <BezierIcon />, className: 'menu-shape', },
    ];
    const lineMenuEvt: MenuProps['onClick'] = ({ key }) => {
        if (key == 'Curve') {
            createNewShape('Line', { 'FONT_SIZE': 24, 'LINE_TYPE': 'Quadratic' });
        } else {
            createNewShape('Line', { 'FONT_SIZE': 24 });
        }
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
                <Button className='item' type='text' >
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
                <Button className='item' type='text' >
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
                <Button className='item' type='text' >
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
                <Button className='item' type='text' >
                    <LineIcon />
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
                <Button className='item' type='text' >
                    <ImageIcon />
                </Button>
            </Dropdown>

            <ModalForm
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

            <ModalForm
                title='Add Custom Shape'
                okText='Add'
                open={isShapeModal == 'shape'}
                onCancel={() => setIsShapeModal('')}
                onCreate={handleCustomShapeOk}
                formItems={
                    <>
                        <Form.Item name="svg_code">
                            <TextArea rows={10} type="textarea" placeholder="Paste SVG code..." />
                        </Form.Item>
                    </>
                }
            />
        </>
    );
});
