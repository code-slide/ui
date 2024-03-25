/*
 * codeslide.net
 *
 * @license
 * Copyright (c) Sebastian Stehle. All rights reserved.
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

