/*
 * codeslide.net
 *
 * @license
 * Forked from mydraft.cc by Sebastian Stehle
 * Copyright (c) Do Duc Quan. All rights reserved.
*/

import * as React from 'react';
import { ActionMenuButton, useHistory } from '../actions';

export const HistoryTool = React.memo(() => {
    const forHistory = useHistory();

    return (
        <>
            <ActionMenuButton type='text' action={forHistory.undo} />
            <ActionMenuButton type='text' action={forHistory.redo} />
        </>
    );
});
