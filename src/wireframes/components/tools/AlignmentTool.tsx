/*
 * codeslide.net
 *
 * @license
 * Forked from mydraft.cc by Sebastian Stehle
 * Copyright (c) Do Duc Quan. All rights reserved.
*/

import { ActionMenuButton, useAlignment } from '../actions';
import { getDiagram, useStore } from '@app/wireframes/model';

export const AlignmentTool = () => {
    const diagram = useStore(getDiagram);
    const forAlignment = useAlignment();

    if (!diagram) {
        return null;
    }

    return (
        <>
            <span className='menu-separator' />
            <ActionMenuButton type='text' action={forAlignment.alignHorizontalLeft} />
            <ActionMenuButton type='text' action={forAlignment.alignHorizontalCenter} />
            <ActionMenuButton type='text' action={forAlignment.alignHorizontalRight} />
            
            <span className='menu-separator' />
            <ActionMenuButton type='text' action={forAlignment.alignVerticalTop} />
            <ActionMenuButton type='text' action={forAlignment.alignVerticalCenter} />
            <ActionMenuButton type='text' action={forAlignment.alignVerticalBottom} />

            {
                !(forAlignment.distributeHorizontally.disabled || forAlignment.distributeVertically.disabled)
                    && <span className='menu-separator' />
            }
            <ActionMenuButton type='text' action={forAlignment.distributeHorizontally} hideWhenDisabled />
            <ActionMenuButton type='text' action={forAlignment.distributeVertically} hideWhenDisabled />
        </>
    );
};