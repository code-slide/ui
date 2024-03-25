/*
 * codeslide.net
 *
 * @license
 * Copyright (c) Sebastian Stehle. All rights reserved.
*/

import * as React from 'react';
import { useDispatch } from 'react-redux';
import { useEventCallback, useOpenFile } from '@app/core';
import { texts } from '@app/texts';
import { downloadDiagramToFile, getDiagrams, loadDiagramFromFile, newDiagram, useStore } from '@app/wireframes/model';
import { UIAction } from './shared';

export function useLoading() {
    const dispatch = useDispatch();
    const diagrams = useStore(getDiagrams);

    const canSave = React.useMemo(() => {
        for (const diagram of diagrams.values) {
            if (diagram.items.size > 0) {
                return true;
            }
        }

        return false;
    }, [diagrams]);
    
    const openHandler = useOpenFile('.json', file => {
        dispatch(loadDiagramFromFile({ file }));
    });

    const doNew = useEventCallback(() => {
        dispatch(newDiagram(true));
    });

    const doDownload = useEventCallback(() => {
        dispatch(downloadDiagramToFile());
    });

    const doSaveToFile = useEventCallback(() => {
    });

    const newDiagramAction: UIAction = React.useMemo(() => ({
        disabled: false,
        icon: 'icon-new',
        label: texts.common.newDiagram,
        shortcut: 'MOD + N',
        tooltip: texts.common.newDiagramTooltip,
        onAction: doNew,
    }), [doNew]);

    const downloadDiagram: UIAction = React.useMemo(() => ({
        disabled: !canSave,
        icon: 'icon-floppy-o',
        label: texts.common.downloadDiagramTooltip,
        shortcut: 'MOD + S',
        tooltip: texts.common.downloadDiagramTooltip,
        onAction: doDownload,
    }), [doDownload, canSave]);

    const saveDiagramToFileAction: UIAction = React.useMemo(() => ({
        disabled: !canSave,
        icon: 'icon-save',
        label: texts.common.saveDiagramToFileTooltip,
        tooltip: texts.common.saveDiagramToFileTooltip,
        onAction: doSaveToFile,
    }), [doSaveToFile, canSave]);

    const openDiagramAction: UIAction = React.useMemo(() => ({
        disabled: false,
        icon: 'icon-folder-open',
        label: texts.common.openFromFile,
        tooltip: texts.common.openFromFileTooltip,
        onAction: openHandler,
    }), [openHandler]);

    return { newDiagram: newDiagramAction, openDiagramAction, downloadDiagram, saveDiagramToFile: saveDiagramToFileAction };
}
