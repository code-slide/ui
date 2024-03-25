/*
 * codeslide.net
 *
 * @license
 * Copyright (c) Sebastian Stehle. All rights reserved.
*/

/* eslint-disable @typescript-eslint/naming-convention */

import { UndoableState } from '@app/wireframes/model';

describe('UndoableState', () => {
    it('should create new state', () => {
        const state_1: UndoableState<number> = UndoableState.create(13);

        expect(state_1.canRedo).toBeFalsy();
        expect(state_1.canUndo).toBeFalsy();
        expect(state_1.present).toBe(13);
    });

    it('should limit history', () => {
        const state_1: UndoableState<number> = UndoableState.create(13, undefined, 2);
        const state_2 = state_1.executed(14);
        const state_3 = state_2.executed(15);
        const state_4 = state_3.executed(16);
        const state_5 = state_4.undo();

        expect(state_5.present).toBe(15);

        const state_6 = state_5.undo();

        expect(state_6.present).toBe(14);
        expect(state_6.canUndo).toBeFalsy();
    });

    it('should return original state when cannot undo or redo', () => {
        const state_1: UndoableState<number> = UndoableState.create(13);
        const state_2 = state_1.undo();
        const state_3 = state_2.redo();

        expect(state_3).toBe(state_1);
    });

    it('should undo and redo execution', () => {
        const state_1: UndoableState<number> = UndoableState.create(13);
        const state_2 = state_1.executed(15);

        expect(state_2.canRedo).toBeFalsy();
        expect(state_2.canUndo).toBeTruthy();
        expect(state_2.present).toBe(15);

        const state_3 = state_2.undo();

        expect(state_3.canRedo).toBeTruthy();
        expect(state_3.canUndo).toBeFalsy();
        expect(state_3.present).toBe(13);

        const state_4 = state_3.redo();

        expect(state_4.canRedo).toBeFalsy();
        expect(state_4.canUndo).toBeTruthy();
        expect(state_4.present).toBe(15);
    });

    it('should keep past and future when replacing present', () => {
        const state_1: UndoableState<number> = UndoableState.create(13);
        const state_2 = state_1.executed(14);
        const state_3 = state_2.executed(15);
        const state_4 = state_3.undo();
        const state_5 = state_4.replacePresent(19);

        expect(state_5.canRedo).toBeTruthy();
        expect(state_5.canUndo).toBeTruthy();
        expect(state_5.present).toBe(19);
    });

    it('should provide history of actions', () => {
        const state_1: UndoableState<number> = UndoableState.create(13, { type: 'Initial' });
        const state_2 = state_1.executed(14, { type: 'action1' });
        const state_3 = state_2.executed(15, { type: 'action2' });
        const state_4 = state_3.executed(16, { type: 'action3' });

        expect(state_4.actions).toEqual([
            { type: 'Initial' },
            { type: 'action1' },
            { type: 'action2' },
            { type: 'action3' },
        ]);
    });

    it('should skip invalid actions', () => {
        const state_1: UndoableState<number> = UndoableState.create(13);
        const state_2 = state_1.executed(14, { type: 'action1' });
        const state_3 = state_2.executed(15);
        const state_4 = state_3.executed(16, { type: 'action3' });

        expect(state_4.actions).toEqual([
            { type: 'action1' },
            { type: 'action3' },
        ]);
    });

    it('should replace present without action', () => {
        const state_1: UndoableState<number> = UndoableState.create(13);
        const state_2 = state_1.executed(14, { type: 'action1' });
        const state_3 = state_2.executed(15, { type: 'action2' });
        const state_4 = state_3.replacePresent(16);

        expect(state_4.actions).toEqual([
            { type: 'action1' },
            { type: 'action2' },
        ]);

        expect(state_4.present).toEqual(16);
    });

    it('should replace present with action', () => {
        const state_1: UndoableState<number> = UndoableState.create(13);
        const state_2 = state_1.executed(14, { type: 'action1' });
        const state_3 = state_2.executed(15, { type: 'action2' });
        const state_4 = state_3.replacePresent(16, { type: 'action3' });

        expect(state_4.actions).toEqual([
            { type: 'action1' },
            { type: 'action3' },
        ]);

        expect(state_4.present).toEqual(16);
    });
});
