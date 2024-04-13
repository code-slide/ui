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

export class Textbox implements ShapePlugin {
    public identifier(): string {
        return 'Textbox';
    }

    public defaultAppearance() {
        return DEFAULT_APPEARANCE;
    }

    public defaultSize() {
        return { x: 400, y: 100 };
    }

    public previewSize(desiredWidth: number, desiredHeight: number) {
        return { x: desiredWidth * 2, y: desiredHeight * 2 };
    }

    public render(ctx: RenderContext) {
        ctx.renderer2.textMultiline(ctx.shape, ctx.rect, p => {
            p.setForegroundColor(ctx.shape);
        }, true);
    }
}
