/*
 * codeslide.net
 *
 * @license
 * Forked from mydraft.cc by Sebastian Stehle
 * Copyright (c) Do Duc Quan. All rights reserved.
*/

import { LineCurve, LineNode, LinePivot } from "@app/wireframes/interface";

export const vogues = {
    common: {
        canvasWidth: 1280,
        canvasHeight: 720,
        close: 0,
        dragSize: 12,
        editorMargin: 13,
        editorPad: 10,
        headerHeight: 56,
        iconSmall: 16,
        iconDefault: 18,
        iconLarge: 20,
        offset: 20,
        maxImgSize: 300,
        shapeWidth: 38,
        sidebarCode: 600,
        sidebarShape: 38,
        selectionThickness: 1,
        previewWidth: 128,
        previewHeight: 72,
        previewPadBot: 20,
        projectName: 'Untitled Presentation',
    },
    color: {
        blue: '#00f',
        codeEditor: '#f5f5f5',
        purple: '#a020f0',
        red: '#f00',
        selectionFill: '#0f0',
        selectionLock: '#f00',
        selectionStroke: '#080',
        transparent: 'rgba(0, 0, 0, 0)',
        white: '#fff',
    },
    option: {
        strokeThickness: [0, 1, 2, 3, 4, 6, 8, 10],
        fontSize: [4, 6, 8, 10, 12, 14, 16, 18, 20, 24, 28, 32, 36, 40, 48, 60],
        lineNode: new Array<LineNode>('None', 'Arrow', 'Triangle'),
        lineCurve: new Array<LineCurve>('Up', 'Down'),
        linePivot: new Array<LinePivot>('Top', 'Bottom'),
    }
}