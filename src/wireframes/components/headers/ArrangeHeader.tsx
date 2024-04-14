/*
 * codeslide.net
 *
 * @license
 * Forked from mydraft.cc by Sebastian Stehle
 * Copyright (c) Do Duc Quan. All rights reserved.
*/

import * as React from 'react';
import { useDispatch } from 'react-redux';
import { Shortcut, useEventCallback } from '@app/core';
import { calculateSelection, getDiagram, selectItems, useStore } from '@app/wireframes/model';
import { keys } from '@app/const';
import { useRemove } from '../actions';

export const ArrangeHeader = React.memo(() => {
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
            {
                keys.option.remove.map((key) => (
                    <Shortcut disabled={forRemove.remove.disabled} onPressed={forRemove.remove.onAction} keys={key} key={key} />
                ))
            }

            <Shortcut disabled={!selectedDiagram} onPressed={doSelectAll} keys={keys.common.selectAll} />
        </>
    );
});

