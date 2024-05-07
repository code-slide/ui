/*
 * codeslide.net
 *
 * @license
 * Forked from mydraft.cc by Sebastian Stehle
 * Copyright (c) Do Duc Quan. All rights reserved.
*/

import { vogues } from '@app/const';
import { AnimationType, ModeType } from '../interface';

export interface UIState {
    // The current zoom level.
    zoom: number;

    // The error toast from any loading operation.
    errorToast?: string;

    // The info toast from any loading operation.
    infoToast?: string;

    // The size for right sidebar.
    sidebarSize: number;

    // The size for pages section.
    footerSize: number;

    // The mode for the application.
    selectedMode: ModeType;

    // The animation tab.
    selectedAnimation: AnimationType;

    // The color tab.
    selectedColor: string;

    // The tour init (first time).
    isTourInit: boolean;

    // The tour start.
    isTourOpen: boolean;

    // The filter for the diagram.
    diagramsFilter?: string;
}

export interface UIStateInStore {
    ui: UIState;
}

export const createInitialUIState: () => UIState = () => {
    return {
        footerSize: vogues.common.previewHeight,
        zoom: 1,
        selectedColor: 'palette',
        selectedMode: 'design',
        selectedAnimation: 'script',
        sidebarSize: vogues.common.sidebarCode,
        isTourInit: true,
        isTourOpen: true,
    };
};
