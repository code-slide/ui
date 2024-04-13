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
    [theme.key.backgroundColor]: theme.common.backgroundColor,
    [theme.key.fontSize]: theme.common.fontSize,
    [theme.key.foregroundColor]: theme.common.textColor,
    [theme.key.strokeColor]: theme.common.borderColor,
    [theme.key.strokeThickness]: theme.common.borderThickness,
    [theme.key.textAlignment]: 'center',
    [theme.key.text]: 'Button',
};

export class Button implements ShapePlugin {
    public identifier(): string {
        return 'Button';
    }

    public defaultAppearance() {
        return DEFAULT_APPEARANCE;
    }

    public defaultSize() {
        return { x: 100, y: 30 };
    }

    public render(ctx: RenderContext) {
        this.createBorder(ctx);
        this.createText(ctx);
    }

    private createBorder(ctx: RenderContext) {
        ctx.renderer2.rectangle(ctx.shape, theme.common.borderRadius, ctx.rect, p => {
            p.setBackgroundColor(ctx.shape);
            p.setStrokeColor(ctx.shape);
        });
    }

    private createText(ctx: RenderContext) {
        ctx.renderer2.text(ctx.shape, ctx.rect.deflate(14, 4), p => {
            p.setForegroundColor(ctx.shape);
        });
    }
}
