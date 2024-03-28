/*
 * codeslide.net
 *
 * @license
 * Forked from mydraft.cc by Sebastian Stehle
 * Copyright (c) Do Duc Quan. All rights reserved.
*/

import * as React from 'react';
import { ActionMenuButton, useGrouping } from '../actions';

export const GroupingMenu = React.memo(() => {
    const forGrouping = useGrouping();

    return (
        <>
            <ActionMenuButton type='text' action={forGrouping.group} />
            <ActionMenuButton type='text' action={forGrouping.ungroup} />
        </>
    );
});

