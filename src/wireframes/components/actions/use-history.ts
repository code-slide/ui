/*
 * codeslide.net
 *
 * @license
 * Forked from mydraft.cc by Sebastian Stehle
 * Copyright (c) Do Duc Quan. All rights reserved.
*/

import * as React from 'react';
import { useAppDispatch } from '@app/store';
import { useEventCallback } from '@app/core';
import { texts } from '@app/const';
import { redo, undo, useStore } from '@app/wireframes/model';
import { keys } from '@app/const';
import { UIAction } from './shared';

export function useHistory() {
    const dispatch = useAppDispatch();
    const canRedo = useStore(s => s.editor.canRedo);
    const canUndo = useStore(s => s.editor.canUndo);

    const doRedo = useEventCallback(() => {
        dispatch(redo());
    });

    const doUndo = useEventCallback(() => {
        dispatch(undo());
    });

    const redoAction: UIAction = React.useMemo(() => ({
        disabled: !canRedo,
        icon: 'icon-redo',
        label: texts.common.redo,
        shortcut: keys.common.redo,
        tooltip: texts.common.redo,
        onAction: doRedo,
    }), [canRedo, doRedo]);

    const undoAction: UIAction = React.useMemo(() => ({
        disabled: !canUndo,
        icon: 'icon-undo',
        label: texts.common.undo,
        shortcut: keys.common.undo,
        tooltip: texts.common.undo,
        onAction: doUndo,
    }), [canUndo, doUndo]);

    return { redo: redoAction, undo: undoAction };
}
