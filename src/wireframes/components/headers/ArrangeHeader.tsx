/*
 * codeslide.net
 *
 * @license
 * Forked from mydraft.cc by Sebastian Stehle
 * Copyright (c) Do Duc Quan. All rights reserved.
*/

import * as React from 'react';
import { useAppDispatch } from '@app/store';
import { Shortcut, useEventCallback } from '@app/core';
import { calculateSelection, getDiagram, selectItems, useStore } from '@app/wireframes/model';
import { keys } from '@app/const';
import { useLoading, useRemove } from '../actions';

export const ArrangeHeader = React.memo(() => {
    const dispatch = useAppDispatch();
    const forRemove = useRemove();
    const forLoading = useLoading();
    const selectedDiagram = useStore(getDiagram);
    const saveDiagram = forLoading.saveDiagram;
    const downloadDiagram = forLoading.downloadDiagram;

    const doSelectAll = useEventCallback(() => {
        if (selectedDiagram) {
            const selection =
                calculateSelection(
                    selectedDiagram.items.values,
                    selectedDiagram);

            dispatch(selectItems(selectedDiagram, selection));
        }
    });

    return (
        <>
            {
                keys.option.remove.map((key) => (
                    <Shortcut disabled={forRemove.remove.disabled} onPressed={forRemove.remove.onAction} keys={key} key={key} />
                ))
            }

            <Shortcut disabled={!selectedDiagram} onPressed={doSelectAll} keys={keys.common.selectAll} />

            <Shortcut disabled={saveDiagram.disabled} onPressed={saveDiagram.onAction} keys={saveDiagram.shortcut ?? keys.common.save} />

            <Shortcut disabled={downloadDiagram.disabled} onPressed={downloadDiagram.onAction} keys={downloadDiagram.shortcut ?? keys.common.download} />
        </>
    );
});

