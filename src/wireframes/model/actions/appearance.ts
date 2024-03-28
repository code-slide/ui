/*
 * codeslide.net
 *
 * @license
 * Forked from mydraft.cc by Sebastian Stehle
 * Copyright (c) Do Duc Quan. All rights reserved.
*/

import { ActionReducerMapBuilder, createAction } from '@reduxjs/toolkit';
import { Color, Types } from '@app/core/utils';
import { DiagramItemSet, EditorState, RendererService, Transform } from './../internal';
import { createItemsAction, DiagramRef, ItemsRef } from './utils';

export const changeColors =
    createAction('items/color', (oldColor: Color, newColor: Color) => {
        return { payload: { oldColor: oldColor.toString(), newColor: newColor.toString() } };
    });

export const changeItemsAppearance =
    createAction('items/appearance', (diagram: DiagramRef, shapes: ItemsRef, key: string, value: any, force = false) => {
        return { payload: createItemsAction(diagram, shapes, { appearance: { key, value }, force }) };
    });

export const transformItems =
    createAction('items/transform', (diagram: DiagramRef, items: ItemsRef, oldBounds: Transform, newBounds: Transform) => {
        return { payload: createItemsAction(diagram, items, { oldBounds: oldBounds.toJS(), newBounds: newBounds.toJS() }) };
    });

export function buildAppearance(builder: ActionReducerMapBuilder<EditorState>) {
    return builder
        .addCase(changeColors, (state, action) => {
            const oldColor = Color.fromValue(action.payload.oldColor);
    
            const newColorValue = Color.fromValue(action.payload.newColor);
            const newColorNumber = newColorValue.toNumber();

            return state.updateAllDiagrams(diagram => {
                return diagram.updateAllItems(item => {
                    if (item.type === 'Group') {
                        return item;
                    }

                    const appearance = item.appearance.mutate(mutator => {
                        for (const [key, value] of Object.entries(item.appearance.raw)) {
                            if (key.endsWith('COLOR')) {
                                const parsedColor = Color.fromValue(value);

                                if (parsedColor.eq(oldColor)) {
                                    mutator.set(key, newColorNumber);
                                }
                            }
                        }
                    });

                    return item.replaceAppearance(appearance);
                });
            });
        })
        .addCase(changeItemsAppearance, (state, action) => {
            const { diagramId, appearance, itemIds, force } = action.payload;

            return state.updateDiagram(diagramId, diagram => {
                const { key, value } = appearance;

                const set = DiagramItemSet.createFromDiagram(itemIds, diagram);

                return diagram.updateItems(set.allShapes.map(x => x.id), item => {
                    const rendererInstance = RendererService.get(item.renderer);

                    if (!rendererInstance) {
                        throw new Error(`Cannot find renderer for ${item.renderer}.`);
                    }

                    if (force || !Types.isUndefined(rendererInstance.defaultAppearance()[key])) {
                        return item.setAppearance(key, value);
                    }

                    return item;
                });
            });
        })
        .addCase(transformItems, (state, action) => {
            const { diagramId, itemIds } = action.payload;

            return state.updateDiagram(diagramId, diagram => {
                const boundsOld = Transform.fromJS(action.payload.oldBounds);
                const boundsNew = Transform.fromJS(action.payload.newBounds);

                const set = DiagramItemSet.createFromDiagram(itemIds, diagram);

                return diagram.updateItems(set.allItems.map(x => x.id), item => {
                    return item.transformByBounds(boundsOld, boundsNew);
                });
            });
        });
}
