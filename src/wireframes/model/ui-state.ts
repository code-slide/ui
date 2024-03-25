/*
 * codeslide.net
 *
 * @license
 * Copyright (c) Sebastian Stehle. All rights reserved.
*/

import { AnimationType, ModeType } from '@app/core';

export interface UIState {
    // The current zoom level.
    zoom: number;

    // The error toast from any loading operation.
    errorToast?: string;

    // The info toast from any loading operation.
    infoToast?: string;

    // The size for left sidebar
    sidebarLeftSize: number;

    // The size for right sidebar
    sidebarRightSize: number;

    // The mode for the application.
    selectedMode: ModeType;

    // The animation tab.
    selectedAnimation: AnimationType;

    // The color tab.
    selectedColor: string;

    // The filter for the diagram.
    diagramsFilter?: string;
}

export interface UIStateInStore {
    ui: UIState;
}

export const createInitialUIState: () => UIState = () => {
    return {
        zoom: 1,
        selectedColor: 'palette',
        selectedMode: 'design',
        selectedAnimation: 'script',
        sidebarLeftSize: 200,
        sidebarRightSize: 0,
    };
};
