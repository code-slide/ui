/*
 * codeslide.net
 *
 * @license
 * Forked from mydraft.cc by Sebastian Stehle
 * Copyright (c) Do Duc Quan. All rights reserved.
*/

import { ActionMenuButton, useClipboard } from '../actions';
import { Diagram, getDiagram, useStore } from '@app/wireframes/model';

export interface ClipboardMenuProps {
    canCopy: boolean
}

export const ClipboardMenu = (props: ClipboardMenuProps) => {
    const diagram = useStore(getDiagram);

    if (!diagram) {
        return null;
    }

    return (
        <ClipboardMenuInner {...props} diagram={diagram} />
    );
};

export const ClipboardMenuInner = ({ canCopy }: ClipboardMenuProps & { diagram: Diagram }) => {
    const forClipboard = useClipboard();

    return (
        <>
            { (canCopy) && <ActionMenuButton type='text' action={forClipboard.cut} />  }
            { (canCopy) && <ActionMenuButton type='text' action={forClipboard.copy} />  }
            <ActionMenuButton type='text' action={forClipboard.paste} />
        </>
    );
};
