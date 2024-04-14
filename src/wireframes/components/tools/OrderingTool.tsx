/*
 * codeslide.net
 *
 * @license
 * Forked from mydraft.cc by Sebastian Stehle
 * Copyright (c) Do Duc Quan. All rights reserved.
*/

import { ActionMenuButton, useAlignment } from '../actions';
import { getDiagram, useStore } from '@app/wireframes/model';

export const OrderingTool = () => {
    const diagram = useStore(getDiagram);
    const forAlignment = useAlignment();

    if (!diagram) {
        return null;
    }

    return (
        <>
            <span className='menu-separator' />
            <ActionMenuButton type='text' action={forAlignment.bringToFront} />
            <ActionMenuButton type='text' action={forAlignment.bringForwards} />
            <ActionMenuButton type='text' action={forAlignment.sendBackwards} />
            <ActionMenuButton type='text' action={forAlignment.sendToBack} />
        </>
    );
};