/*
 * codeslide.net
 *
 * @license
 * Forked from mydraft.cc by Sebastian Stehle
 * Copyright (c) Do Duc Quan. All rights reserved.
*/

import { sizeInPx } from '@app/core/utils';

describe('React Helpers', () => {
    it('should convert number to pixels', () => {
        expect(sizeInPx(10)).toEqual('10px');
    });
});
