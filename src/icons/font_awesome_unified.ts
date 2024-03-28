/*
 * codeslide.net
 *
 * @license
 * Forked from mydraft.cc by Sebastian Stehle
 * Copyright (c) Do Duc Quan. All rights reserved.
*/

import { ICONS } from './font-awesome';

export const ICONS_FONT_AWESOME = ICONS.icons.map(({ id, filter, name, unicode }) => {
    const text = String.fromCharCode(parseInt(unicode, 16));

    let displaySearch = id;

    if (filter) {
        for (const item of filter) {
            displaySearch += ' ';
            displaySearch += item;
        }
    }

    return {
        displayName: id || name,
        displaySearch,
        fontClass: 'fa',
        fontFamily: 'FontAwesome',
        name: `fa-${text}`,
        text,
    };
}).sort((l, r) => l.displayName.localeCompare(r.displayName));
