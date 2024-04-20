/*
 * codeslide.net
 *
 * @license
 * Forked from mydraft.cc by Sebastian Stehle
 * Copyright (c) Do Duc Quan. All rights reserved.
*/

import * as React from 'react';
import { useAppDispatch } from '@app/store';
import { ClipboardCopyEvent, ClipboardPasteEvent, useClipboard as useClipboardProvider } from '@app/core';
import { texts, vogues } from '@app/const';
import { getDiagram, getSelection, pasteItems, removeItems, Serializer, useStore } from '@app/wireframes/model';
import { UIAction } from './shared';

const prefix = `${texts.common.prefix}:`;

export function useClipboard() {
    const dispatch = useAppDispatch();
    const offset = React.useRef(0);
    const selectedDiagram = useStore(getDiagram);
    const selectedItems = useStore(getSelection);
    const canCopy = selectedItems.selection.size > 0;

    const clipboard = useClipboardProvider({ 
        onPaste: (event: ClipboardPasteEvent) => {
            const text = (event.items[0] as any)['text'] as string;
    
            if (selectedDiagram && text && text.indexOf(prefix) === 0) {
                offset.current += vogues.common.offset;
    
                dispatch(pasteItems(selectedDiagram, text.substring(prefix.length), offset.current, offset.current));
                return true;
            }
    
            return;
        },
        onCopy: (event: ClipboardCopyEvent) => {
            if (selectedDiagram) {
                event.clipboard.set(`${prefix}${JSON.stringify(Serializer.serializeSet(selectedItems))}`);
    
                if (event.isCut) {
                    dispatch(removeItems(selectedDiagram, selectedItems.selectedItems));
                }
                
                offset.current = 0;
            }

            return true;
        },
    });

    const copy: UIAction = React.useMemo(() => ({
        disabled: !canCopy,
        icon: 'icon-copy',
        label: texts.common.copy,
        tooltip: texts.common.copyTooltip,
        onAction: clipboard.copy,
    }), [canCopy, clipboard]);

    const cut: UIAction = React.useMemo(() => ({
        disabled: !canCopy,
        icon: 'icon-cut',
        label: texts.common.cut,
        tooltip: texts.common.cutTooltip,
        onAction: clipboard.cut,
    }), [canCopy, clipboard]);

    const paste: UIAction = React.useMemo(() => ({
        disabled: !clipboard,
        icon: 'icon-paste',
        label: texts.common.paste,
        tooltip: texts.common.pasteTooltip,
        onAction: clipboard.paste,
    }), [clipboard]);

    return { copy, cut, paste };
}
