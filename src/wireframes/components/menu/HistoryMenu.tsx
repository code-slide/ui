/*
 * codeslide.net
 *
 * @license
 * Copyright (c) Sebastian Stehle. All rights reserved.
*/

import * as React from 'react';
import { ActionMenuButton, useHistory } from '../actions';

export const HistoryMenu = React.memo(() => {
    const forHistory = useHistory();

    return (
        <>
            <ActionMenuButton type='text' action={forHistory.undo} />
            <ActionMenuButton type='text' action={forHistory.redo} />
        </>
    );
});
