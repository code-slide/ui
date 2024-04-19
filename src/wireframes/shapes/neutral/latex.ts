/*
 * codeslide.net
 *
 * @license
 * Forked from mydraft.cc by Sebastian Stehle
 * Copyright (c) Do Duc Quan. All rights reserved.
*/

import { RenderContext, ShapePlugin } from '@app/wireframes/interface';
import { shapes } from '@app/const';

const DEFAULT_APPEARANCE = {
    [shapes.key.fontSize]: shapes.common.fontSize,
    [shapes.key.foregroundColor]: shapes.common.textColor,
    [shapes.key.textAlignment]: 'left',
    [shapes.key.text]: 'Equation',
};

export class Latex implements ShapePlugin {
    public identifier(): string {
        return shapes.id.equation;
    }

    public defaultAppearance() {
        return DEFAULT_APPEARANCE;
    }

    public defaultSize() {
        return { x: 140, y: 50 };
    }

    public render(ctx: RenderContext) {
        ctx.renderer2.equation(ctx.shape, ctx.rect, p => {
            p.setForegroundColor(ctx.shape);
        });
    }
}
