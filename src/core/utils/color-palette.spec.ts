/*
 * codeslide.net
 *
 * @license
 * Forked from mydraft.cc by Sebastian Stehle
 * Copyright (c) Do Duc Quan. All rights reserved.
*/

import { ColorPalette } from '@app/core/utils';

describe('ColorPalatte', () => {
    it('should generate colors', () => {
        const palette = ColorPalette.colors();

        expect(palette.colors.length).toBeGreaterThan(20);
    });
});
