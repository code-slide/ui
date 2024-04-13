/*
 * codeslide.net
 *
 * @license
 * Forked from mydraft.cc by Sebastian Stehle
 * Copyright (c) Do Duc Quan. All rights reserved.
*/

/* eslint-disable @typescript-eslint/no-loop-func */

import { AnyAction, createAction } from '@reduxjs/toolkit';
import { MathHelper } from '@app/core/utils';
import { vogues, theme } from '@app/const';
import { addShape } from './items';
import { createDiagramAction, DiagramRef } from './utils';

/**
 * @deprecated Replaced with addShape
 */
export const addImage =
    createAction('items/addImage', (diagram: DiagramRef, source: string, x: number, y: number, w: number, h: number, shapeId?: string) => {
        return { payload: createDiagramAction(diagram, { shapeId: shapeId || MathHelper.nextId(), source, position: { x, y }, size: { w, h } }) };
    });

/**
 * @deprecated Replaced with addShape
 */
export const addIcon =
    createAction('items/addIcon', (diagram: DiagramRef, text: string, fontFamily: string, x: number, y: number, shapeId?: string) => {
        return { payload: createDiagramAction(diagram, { shapeId: shapeId || MathHelper.nextId(), text, fontFamily, position: { x, y } }) };
    });

/**
 * @deprecated Replaced with addShape
 */
export const addVisual =
    createAction('items/addVisual', (diagram: DiagramRef, renderer: string, x: number, y: number, appearance?: object, shapeId?: string, width?: number, height?: number) => {
        return { payload: createDiagramAction(diagram, { shapeId: shapeId || MathHelper.nextId(), renderer, position: { x, y }, appearance, width, height }) };
    });

export function migrateOldAction(action: AnyAction) {
    if (addVisual.match(action)) {
        const { diagramId, appearance, width, height, position, renderer, shapeId } = action.payload;

        return addShape(diagramId,
            renderer,
            {
                appearance,
                position,
                size: width && height ? {
                    x: width,
                    y: height,
                } : undefined,
            },
            shapeId);
    } if (addIcon.match(action)) {
        const { diagramId, fontFamily, position, shapeId, text } = action.payload;

        return addShape(diagramId,
            'Icon',
            {
                position,
                appearance: {
                    [theme.key.text]: text,
                    [theme.key.fontFamily]: fontFamily,
                },
            },
            shapeId);
    } else if (addImage.match(action)) {
        const { diagramId, position, size, shapeId, source } = action.payload;

        let w = size.w;
        let h = size.h;

        if (w > vogues.common.maxImgSize || h > vogues.common.maxImgSize) {
            const ratio = w / h;

            if (ratio > 1) {
                w = vogues.common.maxImgSize;
                h = vogues.common.maxImgSize / ratio;
            } else {
                w = vogues.common.maxImgSize * ratio;
                h = vogues.common.maxImgSize;
            }
        }

        return addShape(diagramId,
            'Raster',
            {
                position,
                appearance: {
                    SOURCE: source,
                },
                size: { x: w, y: h },
            },
            shapeId);
    } else {
        return action;
    }
}