/*
 * codeslide.net
 *
 * @license
 * Copyright (c) Sebastian Stehle. All rights reserved.
*/

import { sizeInPx } from '@app/core';

describe('React Helpers', () => {
    it('should convert number to pixels', () => {
        expect(sizeInPx(10)).toEqual('10px');
    });
});
