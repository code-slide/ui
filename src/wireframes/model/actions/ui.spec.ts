/*
 * codeslide.net
 *
 * @license
 * Forked from mydraft.cc by Sebastian Stehle
 * Copyright (c) Do Duc Quan. All rights reserved.
*/

/* eslint-disable @typescript-eslint/naming-convention */

import { filterDiagrams, selectColorTab, setAnimation, setFooterSize, setIsTourInit, setIsTourOpen, setMode, setSidebarSize, setZoom, showToast, ui, UIState } from '@app/wireframes/model';

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

    it('should set sizebar size', () => {
        const state_1 = reducer(state, setSidebarSize(600));
        const state_2 = reducer(state, setSidebarSize(0));

        expect(state_1.sidebarSize).toEqual(600);
        expect(state_2.sidebarSize).toEqual(0);
    });

    it('should set footer size', () => {
        const state_1 = reducer(state, setFooterSize(72));
        const state_2 = reducer(state, setFooterSize(0));

        expect(state_1.footerSize).toEqual(72);
        expect(state_2.footerSize).toEqual(0);
    });

    it('should change mode', () => {
        const state_1 = reducer(state, setMode('animation'));
        const state_2 = reducer(state_1, setMode('design'));

        expect(state_1.selectedMode).toEqual('animation');
        expect(state_2.selectedMode).toEqual('design');
    });

    it('should change animation tab', () => {
        const state_1 = reducer(state, setAnimation('output'));
        const state_2 = reducer(state_1, setAnimation('script'));

        expect(state_1.selectedAnimation).toEqual('output');
        expect(state_2.selectedAnimation).toEqual('script');
    });

    it('should init tour', () => {
        const state_1 = reducer(state, setIsTourInit(true));
        const state_2 = reducer(state_1, setIsTourInit(false));

        expect(state_1.isTourInit).toBeTruthy();
        expect(state_2.isTourInit).toBeFalsy();
    });

    it('should toggle tour', () => {
        const state_1 = reducer(state, setIsTourOpen(true));
        const state_2 = reducer(state_1, setIsTourOpen(false));

        expect(state_1.isTourOpen).toBeTruthy();
        expect(state_2.isTourOpen).toBeFalsy();
    });
});