/*
 * codeslide.net
 *
 * @license
 * Forked from mydraft.cc by Sebastian Stehle
 * Copyright (c) Do Duc Quan. All rights reserved.
*/

/* eslint-disable one-var */
/* eslint-disable one-var-declaration-per-line */

import * as React from 'react';
import { useAppDispatch } from '@app/store';
import { Color, Types, useEventCallback } from '@app/core';
import { changeItemsAppearance, DiagramItemSet } from '@app/wireframes/model';

export interface UIAction {
    // The label.
    label: string;

    // The icon.
    icon: string;

    // The tooltip.
    tooltip: string;

    // The shortcut.
    shortcut?: string;

    // True when disabled.
    disabled: boolean;

    // The method to invoke the action.
    onAction: () => void;
}

export type UniqueValue<TValue> = { value?: TValue; empty?: boolean };
export type UniqueConverter<TInput> = { parse: (value: any) => TInput; write: (value: TInput) => any };

const DEFAULT_CONVERTER = {
    parse: (value: any) => {
        if (value === 'undefined') {
            return undefined!;
        }

        return value;
    },
    write: (value: any) => {
        return value;
    },
};

const COLOR_CONVERTER: UniqueConverter<Color> = {
    parse: (value: any) => {
        if (value === 'undefined') {
            return undefined!;
        }

        return Color.fromValue(value);
    },
    write: (value: Color) => {
        return value.toString();
    },
};

type Result<T> = [UniqueValue<T>, (value: T) => void];

type RefDiagramId = string | null | undefined;
type RefDiagramItemSet = DiagramItemSet | null | undefined;

export function useColorAppearance(selectedDiagramId: RefDiagramId, selectedSet: RefDiagramItemSet, key: string): Result<Color> {
    return useAppearanceCore(selectedDiagramId, selectedSet, key, COLOR_CONVERTER);
}

export function useAppearance<T>(selectedDiagramId: RefDiagramId, selectedSet: RefDiagramItemSet, key: string, allowUndefined = false, force = false): Result<T> {
    return useAppearanceCore(selectedDiagramId, selectedSet, key, DEFAULT_CONVERTER, allowUndefined, force);
}

export function useAppearanceCore<T>(selectedDiagramId: RefDiagramId, selectedSet: RefDiagramItemSet, key: string, converter: UniqueConverter<T>, allowUndefined = false, force = false): Result<T> {
    const dispatch = useAppDispatch();

    const value = React.useMemo(() => {
        if (!selectedSet) {
            return { empty: true };
        }

        let value: T | undefined, empty = true;

        for (const item of selectedSet.nested.values()) {
            if (item.type === 'Group') {
                continue;
            }

            const appearance = item.appearance.get(key);

            if (!Types.isUndefined(appearance) || allowUndefined) {
                empty = false;

                const parsed = converter.parse(appearance);

                if (parsed && value && !Types.equals(value, parsed)) {
                    value = undefined;
                } else {
                    value = parsed;
                }
            }
        }

        return { value, empty };
    }, [allowUndefined, converter, key, selectedSet]);

    const doChangeAppearance = useEventCallback((value: T) => {
        if (selectedDiagramId && selectedSet) {
            dispatch(changeItemsAppearance(selectedDiagramId, selectedSet.deepEditableItems, key, converter.write(value), force));
        }
    });

    return [value, doChangeAppearance];
}
