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

export const ClipboardTool = (props: ClipboardMenuProps) => {
    const diagram = useStore(getDiagram);

    if (!diagram) {
        return null;
    }

    return (
        <ClipboardToolInner {...props} diagram={diagram} />
    );
};

export const ClipboardToolInner = ({ canCopy }: ClipboardMenuProps & { diagram: Diagram }) => {
    const forClipboard = useClipboard();

    return (
        <>
            { (canCopy) && <ActionMenuButton type='text' action={forClipboard.cut} />  }
            { (canCopy) && <ActionMenuButton type='text' action={forClipboard.copy} />  }
            <ActionMenuButton type='text' action={forClipboard.paste} />
        </>
    );
};
