/*
 * codeslide.net
 *
 * @license
 * Forked from mydraft.cc by Sebastian Stehle
 * Copyright (c) Do Duc Quan. All rights reserved.
*/

import * as React from 'react';
import { useAppDispatch } from '@app/store';
import { useEventCallback, useOpenFile } from '@app/core';
import { texts } from '@app/const';
import { downloadDiagramToFile, getDiagrams, loadDiagramFromFile, newDiagram, saveDiagramTemp, useStore } from '@app/wireframes/model';
import { keys } from '@app/const';
import { UIAction } from './shared';

export function useLoading() {
    const dispatch = useAppDispatch();
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

    const doSave = useEventCallback(() => {
        dispatch(saveDiagramTemp());
    });

    const newDiagramAction: UIAction = React.useMemo(() => ({
        disabled: false,
        icon: 'icon-new',
        label: texts.common.newDiagram,
        shortcut: keys.common.new,
        tooltip: texts.common.newDiagramTooltip,
        onAction: doNew,
    }), [doNew]);

    const downloadDiagramAction: UIAction = React.useMemo(() => ({
        disabled: !canSave,
        icon: 'icon-floppy-o',
        label: texts.common.saveDiagramTooltip,
        shortcut: keys.common.download,
        tooltip: texts.common.saveDiagramTooltip,
        onAction: doDownload,
    }), [doDownload, canSave]);

    const saveDiagramAction: UIAction = React.useMemo(() => ({
        disabled: !canSave,
        icon: 'icon-floppy-o',
        label: texts.common.saveDiagramTempTooltip,
        shortcut: keys.common.save,
        tooltip: texts.common.saveDiagramTempTooltip,
        onAction: doSave,
    }), [doSave, canSave]);

    const openDiagramAction: UIAction = React.useMemo(() => ({
        disabled: false,
        icon: 'icon-folder-open',
        label: texts.common.openFromFile,
        tooltip: texts.common.openFromFileTooltip,
        onAction: openHandler,
    }), [openHandler]);

    return { newDiagram: newDiagramAction, openDiagramAction, downloadDiagram: downloadDiagramAction, saveDiagram: saveDiagramAction };
}
