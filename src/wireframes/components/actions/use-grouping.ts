/*
 * codeslide.net
 *
 * @license
 * Forked from mydraft.cc by Sebastian Stehle
 * Copyright (c) Do Duc Quan. All rights reserved.
*/

import * as React from 'react';
import { useAppDispatch } from '@app/store';
import { IDHelper } from '@app/core';
import { useEventCallback } from '@app/core';
import { texts } from '@app/const';
import { getDiagram, getSelection, groupItems, ungroupItems, useStore } from '@app/wireframes/model';
import { keys } from '@app/const';
import { UIAction } from './shared';

export function useGrouping() {
    const dispatch = useAppDispatch();
    const selectedDiagram = useStore(getDiagram);
    const selectedDiagramId = selectedDiagram?.id;
    const selectedItems = useStore(getSelection);
    const selectedGroups = React.useMemo(() => selectedItems.selectedItems.filter(x => x.type === 'Group'), [selectedItems]);
    const canGroup = selectedItems.selectedItems.length > 1;
    const canUngroup = selectedGroups.length > 0;

    const doGroup = useEventCallback(() => {
        if (selectedDiagramId) {
            dispatch(groupItems(selectedDiagramId, selectedItems.selectedItems, IDHelper.nextId(selectedDiagram, 'Group').id));
        }
    });

    const doUngroup = useEventCallback(() => {
        if (selectedDiagramId) {
            dispatch(ungroupItems(selectedDiagramId, selectedGroups));
        }
    });

    const group: UIAction = React.useMemo(() => ({
        disabled: !canGroup,
        icon: 'icon-group',
        label: texts.common.group,
        shortcut: keys.common.group,
        tooltip: texts.common.groupTooltip,
        onAction: doGroup,
    }), [canGroup, doGroup]);

    const ungroup: UIAction = React.useMemo(() => ({
        disabled: !canUngroup,
        icon: 'icon-ungroup',
        label: texts.common.ungroup,
        shortcut: keys.common.ungroup,
        tooltip: texts.common.ungroupTooltip,
        onAction: doUngroup,
    }), [canUngroup, doUngroup]);

    return { group, ungroup };
}
