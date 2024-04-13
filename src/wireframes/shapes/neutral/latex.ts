/*
 * codeslide.net
 *
 * @license
 * Forked from mydraft.cc by Sebastian Stehle
 * Copyright (c) Do Duc Quan. All rights reserved.
*/

import { RenderContext, ShapePlugin } from '@app/wireframes/interface';
import { theme } from '@app/const';

const DEFAULT_APPEARANCE = {
    [theme.key.fontSize]: theme.common.fontSize,
    [theme.key.foregroundColor]: theme.common.textColor,
    [theme.key.textAlignment]: 'left',
    [theme.key.text]: '',
};

export class Latex implements ShapePlugin {
    public identifier(): string {
        return 'Equation';
    }

    public defaultAppearance() {
        return DEFAULT_APPEARANCE;
    }

    public defaultSize() {
        return { x: 140, y: 50 };
    }

    public render(ctx: RenderContext) {
        ctx.renderer2.equation(ctx.shape, ctx.rect, undefined);
    }
}
