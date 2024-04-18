/*
 * codeslide.net
 *
 * @license
 * Forked from mydraft.cc by Sebastian Stehle
 * Copyright (c) Do Duc Quan. All rights reserved.
*/

/* eslint-disable @typescript-eslint/naming-convention */

import { filterDiagrams, selectColorTab, setZoom, showToast, ui, UIState } from '@app/wireframes/model';

describe('UIReducer', () => {
    const state: UIState = {} as any;

    const reducer = ui(state);

    it('should set zoom', () => {
        const state_1 = reducer(state, setZoom(1.5));

        expect(state_1.zoom).toEqual(1.5);
    });

    it('should select color tab', () => {
        const state_1 = reducer(state, selectColorTab('Recent'));

        expect(state_1.selectedColor).toEqual('Recent');
    });

    it('should set diagrams filter', () => {
        const state_1 = reducer(state, filterDiagrams('Filter'));

        expect(state_1.diagramsFilter).toEqual('Filter');
    });

    it('should do nothing for toast', () => {
        const state_1 = reducer(state, showToast('My Toast'));

        expect(state_1).toBe(state);
    });
});