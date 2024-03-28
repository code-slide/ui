/*
 * codeslide.net
 *
 * @license
 * Forked from mydraft.cc by Sebastian Stehle
 * Copyright (c) Do Duc Quan. All rights reserved.
*/

/* eslint-disable @typescript-eslint/naming-convention */

import { diff } from 'deep-object-diff';
import { Types } from '@app/core';
import { EditorState, loadDiagramInternal, RendererService, selectDiagram, selectItems } from '@app/wireframes/model';
import * as Reducers from '@app/wireframes/model/actions';
import { Button } from '@app/wireframes/shapes/neutral/button';
import { AbstractControl } from '@app/wireframes/shapes/utils/abstract-control';

import v1 from './diagram_v1.json?raw';
import v2 from './diagram_v2.json?raw';
import v3 from './diagram_v3.json?raw';

describe('LoadingReducer', () => {
    const editorState = EditorState.create();

    RendererService.addRenderer(new AbstractControl(new Button()));

    const editorReducer = Reducers.createClassReducer(editorState, builder => {
        Reducers.buildAlignment(builder);
        Reducers.buildAppearance(builder);
        Reducers.buildDiagrams(builder);
        Reducers.buildGrouping(builder);
        Reducers.buildItems(builder);
        Reducers.buildOrdering(builder);
    });  

    const undoableReducer = Reducers.undoable(
        editorReducer,
        editorState, {
            capacity: 20,
            actionMerger: Reducers.mergeAction,
            actionsToIgnore: [
                selectDiagram.name,
                selectItems.name,
            ],
        });
    
    const rootReducer = Reducers.rootLoading(undoableReducer, editorReducer);

    const cleanupDiffs = (input: Record<string, any>, path: string[]) => {
        for (const [key, value] of Object.entries(input)) {
            if (path.length === 1 && path[0] === 'values' && key === 'id') {
                delete input[key];
                continue;
            }

            if (~['instanceId', 'selectedIds', 'parents', 'computed'].indexOf(key)) {
                delete input[key];
                continue;
            } 

            if (typeof value === 'object') {
                const diff = cleanupDiffs(value, [...path, key]);

                if (Types.isUndefined(diff)) {
                    delete input[key];
                }
            }
        }

        if (Object.keys(input).length === 0) {
            return undefined;
        }

        return input;
    }

    it('should load from old and new format V2', () => {
        const initial = undoableReducer(undefined, { type: 'NOOP' });

        const editorV1 = rootReducer(initial, loadDiagramInternal(JSON.parse(v1), '1'));
        const editorV2 = rootReducer(initial, loadDiagramInternal(JSON.parse(v2), '2'));

        expect(editorV1.present.diagrams.values[0].items.values.length).toEqual(10);
        expect(editorV2.present.diagrams.values[0].items.values.length).toEqual(10);

        const diffsV2 = cleanupDiffs(diff(editorV1.present, editorV2.present), []);

        expect(diffsV2).toEqual(undefined);
    });

    it('should load from old and new format V3', () => {
        const initial = undoableReducer(undefined, { type: 'NOOP' });

        const editorV1 = rootReducer(initial, loadDiagramInternal(JSON.parse(v1), '1'));
        const editorV3 = rootReducer(initial, loadDiagramInternal(JSON.parse(v3), '2'));

        expect(editorV1.present.diagrams.values[0].items.values.length).toEqual(10);
        expect(editorV3.present.diagrams.values[0].items.values.length).toEqual(10);

        const diffsV3 = cleanupDiffs(diff(editorV1.present, editorV3.present), []);

        expect(diffsV3).toEqual(undefined);
    });
});