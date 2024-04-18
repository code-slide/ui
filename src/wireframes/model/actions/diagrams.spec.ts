/*
 * codeslide.net
 *
 * @license
 * Forked from mydraft.cc by Sebastian Stehle
 * Copyright (c) Do Duc Quan. All rights reserved.
*/

/* eslint-disable @typescript-eslint/naming-convention */

import { Color, Vec2 } from '@app/core/utils';
import { addDiagram, buildDiagrams, changeColor, changeFrames, changeName, changeRevealConfig, changeScript, changeSize, createClassReducer, Diagram, duplicateDiagram, EditorState, moveDiagram, removeDiagram, renameDiagram, selectDiagram, setDiagramMaster, updateNextId } from '@app/wireframes/model';

describe('DiagramReducer', () => {
    const state =
        EditorState.create();

    const reducer = createClassReducer(state, builder => buildDiagrams(builder));

    it('should return same state if action is unknown', () => {
        const action = { type: 'UNKNOWN' };

        const state_1 = EditorState.create();
        const state_2 = reducer(state_1, action);

        expect(state_2).toBe(state_1);
    });

    it('should add diagram', () => {
        const action = addDiagram('1');

        const state_1 = EditorState.create();
        const state_2 = reducer(state_1, action);

        expect(state_2.diagrams.size).toBe(1);
        expect(state_2.diagrams.get('1')?.id).toBe('1');
        expect(state_2.selectedDiagramId).toBe('1');
    });

    it('should select diagram', () => {
        const diagram = Diagram.create({ id: '1' });

        const action = selectDiagram(diagram);

        const state_1 = EditorState.create().addDiagram(diagram);
        const state_2 = reducer(state_1, action);

        expect(state_2.selectedDiagramId).toBe(diagram.id);
    });

    it('should duplicate diagram', () => {
        const diagram = Diagram.create({ id: '1' });

        const action = duplicateDiagram(diagram);

        const state_1 = EditorState.create().addDiagram(diagram);
        const state_2 = reducer(state_1, action);

        expect(state_2.diagrams.size).toBe(2);
    });

    it('should remove diagram', () => {
        const diagram = Diagram.create({ id: '1' });

        const action = removeDiagram(diagram);

        const state_1 = EditorState.create().addDiagram(diagram);
        const state_2 = reducer(state_1, action);

        expect(state_2.diagrams.size).toBe(0);
    });

    it('should move diagram', () => {
        const diagram1 = Diagram.create({ id: '1' });
        const diagram2 = Diagram.create({ id: '2' });

        const action = moveDiagram(diagram2, 0);

        const state_1 = EditorState.create().addDiagram(diagram1).addDiagram(diagram2);
        const state_2 = reducer(state_1, action);

        expect(state_2.orderedDiagrams).toEqual([diagram2, diagram1]);
    });

    it('should change size', () => {
        const action = changeSize(1500, 1200);

        const state_1 = EditorState.create();
        const state_2 = reducer(state_1, action);

        expect(state_2.size).toEqual(new Vec2(1500, 1200));
    });

    it('should change color', () => {
        const action = changeColor(Color.RED);

        const state_1 = EditorState.create();
        const state_2 = reducer(state_1, action);

        expect(state_2.color).toEqual(Color.fromString('#ff0000'));
    });

    it('should rename title', () => {
        const diagram = Diagram.create({ id: '1' });

        const action = renameDiagram(diagram, 'New Title');

        const state_1 = EditorState.create().addDiagram(diagram);
        const state_2 = reducer(state_1, action);

        expect(state_2.diagrams.get('1')?.title).toEqual('New Title');
    });

    it('should change script', () => {
        const diagram = Diagram.create({ id: '1' });

        const action = changeScript(diagram, 'New Script');

        const state_1 = EditorState.create().addDiagram(diagram);
        const state_2 = reducer(state_1, action);

        expect(state_2.diagrams.get('1')?.script).toEqual('New Script');
    });

    it('should change frames', () => {
        const diagram = Diagram.create({ id: '1' });

        const action = changeFrames(diagram, [['Shape1']]);

        const state_1 = EditorState.create().addDiagram(diagram);
        const state_2 = reducer(state_1, action);

        expect(state_2.diagrams.get('1')?.frames).toEqual([['Shape1']]);
    });

    it('should increase nextId', () => {
        const diagram = Diagram.create({ id: '1' });
        const renderer = 'Textbox';

        const action = updateNextId(diagram, renderer, 10);

        const state_1 = EditorState.create().addDiagram(diagram);
        const state_2 = reducer(state_1, action);

        expect(state_2.diagrams.get('1')?.nextIds.get(renderer)).toEqual(10);
    });

    it('should not decrease nextId', () => {
        const diagram = Diagram.create({ id: '1' });
        const renderer = 'Textbox';

        const action1 = updateNextId(diagram, renderer, 10);
        const action2 = updateNextId(diagram, renderer, 5);

        const state_1 = EditorState.create().addDiagram(diagram);
        const state_2 = reducer(state_1, action1);
        const state_3 = reducer(state_2, action2);

        expect(state_3.diagrams.get('1')?.nextIds.get(renderer)).toEqual(10);
    });

    it('should not assign negative number to nextId', () => {
        const diagram = Diagram.create({ id: '1' });
        const renderer = 'Textbox';

        const action1 = updateNextId(diagram, renderer, -1);

        const state_1 = EditorState.create().addDiagram(diagram);
        const state_2 = reducer(state_1, action1);

        expect(state_2.diagrams.get('1')?.nextIds.get(renderer)).toEqual(undefined);
    });

    it('should rename project', () => {
        const action = changeName('New Name');

        const state_1 = EditorState.create();
        const state_2 = reducer(state_1, action);

        expect(state_2.name).toEqual('New Name');
    });

    it('should change reveal config', () => {
        const newConfig = JSON.stringify({ enabled: true, autoPlay: true, autoPlayDuration: 10 });
        const action = changeRevealConfig(newConfig);

        const state_1 = EditorState.create();
        const state_2 = reducer(state_1, action);

        expect(state_2.revealConfig).toEqual(newConfig);
    });

    it('should change reveal config', () => {
        const newConfig = JSON.stringify({ enabled: true, autoPlay: true, autoPlayDuration: 10 });
        const action = changeRevealConfig(newConfig);

        const state_1 = EditorState.create();
        const state_2 = reducer(state_1, action);

        expect(state_2.revealConfig).toEqual(newConfig);
    });

    it('should set master', () => {
        const diagram = Diagram.create({ id: '1' });

        const action = setDiagramMaster(diagram, 'Master');

        const state_1 = EditorState.create().addDiagram(diagram);
        const state_2 = reducer(state_1, action);

        expect(state_2.diagrams.get('1')?.master).toEqual('Master');
    });
});
