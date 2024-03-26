/*
 * codeslide.net
 *
 * @license
 * Copyright (c) Sebastian Stehle. All rights reserved.
*/

/* eslint-disable @typescript-eslint/naming-convention */

import { Color, Vec2 } from '@app/core/utils';
import { Diagram, EditorState } from '@app/wireframes/model';

describe('EditorState', () => {
    const state_1 = EditorState.create();

    const diagram = Diagram.create({ id: '1' });

    it('should instantiate', () => {
        const state = EditorState.create();

        expect(state).toBeDefined();
    });

    it('should add diagram', () => {
        const state_2 = state_1.addDiagram(diagram);

        expect(state_2.diagrams.has(diagram.id)).toBeTruthy();
    });

    it('should return original state when diagram is already added', () => {
        const state_2 = state_1.addDiagram(diagram);
        const state_3 = state_2.addDiagram(diagram);

        expect(state_3).toBe(state_2);
    });

    it('should remove diagram', () => {
        const state_2 = state_1.addDiagram(diagram);
        const state_3 = state_2.removeDiagram(diagram.id);

        expect(state_3.diagrams.has(diagram.id)).toBeFalsy();
    });

    it('should return original state when diagram to remove is not found', () => {
        const state_2 = state_1.addDiagram(diagram);
        const state_3 = state_2.removeDiagram('unfound');

        expect(state_3).toBe(state_2);
    });

    it('should unselect diagram when diagram to remove is selected', () => {
        const state_2 = state_1.addDiagram(diagram);
        const state_3 = state_2.selectDiagram(diagram.id);
        const state_4 = state_3.removeDiagram(diagram.id);

        expect(state_4.diagrams.has(diagram.id)).toBeFalsy();
        expect(state_4.selectedDiagramId).toBeNull();
    });

    it('should move diagram', () => {
        const diagram1 = Diagram.create({ id: '1' });
        const diagram2 = Diagram.create({ id: '2' });

        const state_2 = state_1.addDiagram(diagram1).addDiagram(diagram2);
        const state_3 = state_2.moveDiagram(diagram2.id, 0);

        expect(state_3.orderedDiagrams).toEqual([diagram2, diagram1]);
    });

    it('should select diagram', () => {
        const state_2 = state_1.addDiagram(diagram);
        const state_3 = state_2.selectDiagram(diagram.id);

        expect(state_3.selectedDiagramId).toBe(diagram.id);
    });

    it('should return original state when diagram to select is not found', () => {
        const state_2 = state_1.addDiagram(diagram);
        const state_3 = state_2.selectDiagram('unfound');

        expect(state_3).toBe(state_2);
    });

    it('should update diagram', () => {
        const newDiagram = Diagram.create({ id: diagram.id });

        const state_2 = state_1.addDiagram(diagram);
        const state_3 = state_2.updateDiagram(diagram.id, () => newDiagram);

        expect(state_3.diagrams.size).toBe(1);
        expect(state_3.diagrams.get(diagram.id)).toEqual(newDiagram);
    });

    it('should return orignal state when diagram to update is not found', () => {
        const state_2 = state_1.addDiagram(diagram);
        const state_3 = state_2.updateDiagram('unfound', d => Diagram.create({ id: d.id }));

        expect(state_3).toBe(state_2);
    });

    it('should return orignal state when updater returns same diagram', () => {
        const state_2 = state_1.addDiagram(diagram);
        const state_3 = state_2.updateDiagram(diagram.id, d => d);

        expect(state_3).toBe(state_2);
    });

    it('should update all diagrams', () => {
        const newDiagram = Diagram.create({ id: diagram.id });

        const state_2 = state_1.addDiagram(diagram);
        const state_3 = state_2.updateAllDiagrams(() => newDiagram);

        expect(state_3.diagrams.size).toBe(1);
        expect(state_3.diagrams.get(diagram.id)).toEqual(newDiagram);
    });

    it('should return orignal state when all updater returns same diagrams', () => {
        const state_2 = state_1.addDiagram(diagram);
        const state_3 = state_2.updateAllDiagrams(d => d);

        expect(state_3).toBe(state_2);
    });

    it('should change size', () => {
        const newSize = new Vec2(1500, 1200);

        const state_2 = state_1.changeSize(newSize);

        expect(state_2.size).toEqual(newSize);
    });

    it('should change color', () => {
        const newColor = Color.fromString('#f00');

        const state_2 = state_1.changeColor(newColor);

        expect(state_2.color).toEqual(newColor);
    });

    it('should return orignal state when size not changed', () => {
        const state_2 = state_1.changeSize(new Vec2(1280, 720));

        expect(state_2).toBe(state_1);
    });
});
