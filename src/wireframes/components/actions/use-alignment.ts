/*
 * codeslide.net
 *
 * @license
 * Forked from mydraft.cc by Sebastian Stehle
 * Copyright (c) Do Duc Quan. All rights reserved.
*/

/* eslint-disable react-hooks/exhaustive-deps */

import * as React from 'react';
import { useEventCallback } from '@app/core';
import { texts } from '@app/const';
import { useAppDispatch } from '@app/store';
import { alignItems, AlignmentMode, getDiagramId, getSelection, orderItems, OrderMode, useStore } from '@app/wireframes/model';
import { UIAction } from './shared';

export function useAlignment() {
    const dispatch = useAppDispatch();
    const selectedDiagramId = useStore(getDiagramId);
    const selectedItems = useStore(getSelection);
    const canAlign = selectedItems.selection.size > 1;
    const canDistribute = selectedItems.selection.size > 2;
    const canOrder = selectedItems.selection.size > 0;

    const doAlign = useEventCallback((mode: AlignmentMode) => {
        if (selectedDiagramId) {
            dispatch(alignItems(mode, selectedDiagramId, selectedItems.selectedItems));
        }
    });

    const doOrder = useEventCallback((mode: OrderMode) => {
        if (selectedDiagramId) {
            dispatch(orderItems(mode, selectedDiagramId, selectedItems.selectedItems));
        }
    });

    function useAlign(mode: AlignmentMode, label: string, icon: string) {
        const action: UIAction = React.useMemo(() => ({
            disabled: !canAlign,
            icon,
            label,
            tooltip: label,
            onAction: () => doAlign(mode),
        }), [canAlign, doAlign]);

        return action;
    }

    function useDistribute(mode: AlignmentMode, label: string, icon: string) {
        const action: UIAction = React.useMemo(() => ({
            disabled: !canDistribute,
            icon,
            label,
            tooltip: label,
            onAction: () => doAlign(mode),
        }), [canAlign, doAlign]);

        return action;
    }

    function useOrder(mode: OrderMode, label: string, icon: string) {
        const action: UIAction = React.useMemo(() => ({
            context: mode,
            disabled: !canOrder,
            icon,
            label,
            tooltip: label,
            onAction: () => doOrder(mode),
        }), [canOrder, doOrder]);

        return action;
    }

    return {
        alignHorizontalCenter: useAlign(AlignmentMode.HorizontalCenter, texts.common.alignHorizontalCenter, 'icon-align_horizontal_center'),
        alignHorizontalLeft: useAlign(AlignmentMode.HorizontalLeft, texts.common.alignHorizontalLeft, 'icon-align_horizontal_left'),
        alignHorizontalRight: useAlign(AlignmentMode.HorizontalRight, texts.common.alignHorizontalRight, 'icon-align_horizontal_right'),
        alignVerticalBottom: useAlign(AlignmentMode.VerticalBottom, texts.common.alignVerticalBottom, 'icon-align_vertical_bottom'),
        alignVerticalCenter: useAlign(AlignmentMode.VerticalCenter, texts.common.alignVerticalCenter, 'icon-align_vertical_center'),
        alignVerticalTop: useAlign(AlignmentMode.VerticalTop, texts.common.alignVerticalTop, 'icon-align_vertical_top'),
        bringForwards: useOrder(OrderMode.BringForwards, texts.common.bringForwards, 'icon-to_front'),
        bringToFront: useOrder(OrderMode.BringToFront, texts.common.bringToFront, 'icon-flip_to_front'),
        distributeHorizontally: useDistribute(AlignmentMode.DistributeHorizontal, texts.common.distributeHorizontally, 'icon-distribute-h2'),
        distributeVertically: useDistribute(AlignmentMode.DistributeVertical, texts.common.distributeVertically, 'icon-distribute-v2'),
        sendBackwards: useOrder(OrderMode.SendBackwards, texts.common.sendBackwards, 'icon-to_back'),
        sendToBack: useOrder(OrderMode.SendToBack, texts.common.sendToBack, 'icon-flip_to_back'),
    };
}
