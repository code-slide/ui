/*
 * codeslide.net
 *
 * @license
 * Forked from mydraft.cc by Sebastian Stehle
 * Copyright (c) Do Duc Quan. All rights reserved.
*/

import { Button, Form, Input, Tooltip } from 'antd';
import * as React from 'react';
import { useDispatch } from 'react-redux';
import { Diagram, changeItemsAppearance, getDiagram, getSelectedShape, useStore } from '@app/wireframes/model';
import { useEffect, useState } from 'react';
import { AspectRatioIcon, IconOutline, LinkIcon, VectorIcon } from '@app/icons/icon';
import { texts, shapes } from '@app/const';
import { FormModal, ShapeModal } from '../modal';

interface ChangeProps {
    // Diagram
    diagram: Diagram,

    // Item's id
    id: string,

    // Item's renderer
    renderer: string,
}

export const GraphicTool = React.memo(() => {
    const dispatch = useDispatch();
    const selectedItem = useStore(getSelectedShape);
    const selectedDiagram = useStore(getDiagram);

    const [isKeepAspect, setIsKeepAspect] = useState(!selectedItem ? true : selectedItem.getAppearance(shapes.key.aspectRatio));

    useEffect(() => {
        setIsKeepAspect(!selectedItem ? true : selectedItem.getAppearance(shapes.key.aspectRatio));
    }, [selectedItem])
    
    const toggleAspectRatio = () => {
        if (selectedItem && selectedDiagram) {
            dispatch(changeItemsAppearance(selectedDiagram, [selectedItem.id], shapes.key.aspectRatio, !isKeepAspect));
        }
    };

    if (!selectedDiagram || !selectedItem) return <></>
    return (
        <>
            <Tooltip mouseEnterDelay={1} title={ texts.common.aspectRatio }>
                <Button
                    className={`tool-menu-item ${isKeepAspect ? 'active' : ''}`}
                    type='text'
                    icon={<IconOutline icon={AspectRatioIcon} />}
                    onClick={toggleAspectRatio}
                />
            </Tooltip>
            <SourceTool diagram={selectedDiagram} id={selectedItem.id} renderer={selectedItem.renderer} />
        </>
    );
});

const SourceTool = (props: ChangeProps) => {
    const dispatch = useDispatch();
    const [isShapeModal, setIsShapeModal] = useState<ShapeModal>('');
    
    const handleChange = (key: string, value: string) => {
        dispatch(changeItemsAppearance(props.diagram, [props.id], key, value));

        setIsShapeModal('');
    };

    const attrs: {[id: string]: any} = {
        toolTip: props.renderer == shapes.id.image ? texts.common.imageChangeURL : texts.common.shapeChangeSvg,
        icon: props.renderer == shapes.id.image ? LinkIcon : VectorIcon,
        open: props.renderer == shapes.id.image ? 'image' : 'shape',
        key: props.renderer == shapes.id.image ? 'imageUrl' : 'svgCode',
        field: props.renderer == shapes.id.image ? 'change_image_url' : 'change_svg_code',
        onCreate: props.renderer == shapes.id.image ? (e: any) => handleChange(shapes.key.imageUrl, e.change_image_url) : (e: any) => handleChange(shapes.key.svgCode, e.change_svg_code),
        input: props.renderer == shapes.id.image ? <Input type="textarea" placeholder="Paste URL of image..." /> : <Input.TextArea rows={10} placeholder="Paste SVG code..." />,
    }

    return (
        <>
            <Tooltip mouseEnterDelay={1} title={attrs.toolTip}>
                <Button
                    className={`tool-menu-item`}
                    type='text'
                    icon={<IconOutline icon={attrs.icon} />}
                    onClick={() => setIsShapeModal(attrs.open)}
                />
            </Tooltip>
            <FormModal
                title={attrs.toolTip}
                okText='Replace'
                open={isShapeModal == attrs.open}
                onCancel={() => setIsShapeModal('')}
                onCreate={attrs.onCreate}
                formItems={
                    <>
                        <Form.Item name={attrs.field}>
                            {attrs.input}
                        </Form.Item>
                    </>
                }
            />
        </>
    )
}