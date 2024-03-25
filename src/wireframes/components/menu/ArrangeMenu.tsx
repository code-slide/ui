/*
 * codeslide.net
 *
 * @license
 * Copyright (c) Sebastian Stehle. All rights reserved.
*/

import * as React from 'react';
import { useDispatch } from 'react-redux';
import { Shortcut, useEventCallback } from '@app/core';
import { calculateSelection, getDiagram, selectItems, useStore } from '@app/wireframes/model';
import { useRemove } from '../actions';

export const ArrangeMenu = React.memo(() => {
    const dispatch = useDispatch();
    const forRemove = useRemove();
    const selectedDiagram = useStore(getDiagram);

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
            <Shortcut disabled={forRemove.remove.disabled} onPressed={forRemove.remove.onAction} keys='del' />
            <Shortcut disabled={forRemove.remove.disabled} onPressed={forRemove.remove.onAction} keys='backspace' />

            <Shortcut disabled={!selectedDiagram} onPressed={doSelectAll} keys='MOD + A' />
        </>
    );
});

