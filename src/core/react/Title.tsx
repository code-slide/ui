/*
 * codeslide.net
 *
 * @license
 * Forked from mydraft.cc by Sebastian Stehle
 * Copyright (c) Do Duc Quan. All rights reserved.
*/

import * as React from 'react';

export const Title = React.memo(({ text }: { text: string }) => {
    React.useEffect(() => {
        document.title = text;
    }, [text]);

    return null;
});
