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
import { getDiagramId, getSelection, removeItems, useStore } from '@app/wireframes/model';
import { UIAction } from './shared';

export function useRemove() {
    const dispatch = useAppDispatch();
    const selectedDiagramId = useStore(getDiagramId);
    const selectedItems = useStore(getSelection);
    const canRemove = selectedItems.selectedItems.length > 0;

    const doRemove = useEventCallback(() => {
        if (selectedDiagramId) {
            dispatch(removeItems(selectedDiagramId, selectedItems.selectedItems));
        }
    });

    const remove: UIAction = React.useMemo(() => ({
        disabled: !canRemove,
        icon: 'icon-delete',
        label: texts.common.remove,
        shortcut: 'DELETE',
        tooltip: texts.common.removeTooltip,
        onAction: doRemove,
    }), [canRemove, doRemove]);

    return { remove };
}
