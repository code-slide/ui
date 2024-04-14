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
    [shapes.key.backgroundColor]: shapes.common.backgroundColor,
    [shapes.key.fontSize]: shapes.common.fontSize,
    [shapes.key.foregroundColor]: shapes.common.textColor,
    [shapes.key.strokeColor]: shapes.common.borderColor,
    [shapes.key.strokeThickness]: shapes.common.borderThickness,
    [shapes.key.textAlignment]: 'center',
    [shapes.key.text]: 'Button',
};

export class Button implements ShapePlugin {
    public identifier(): string {
        return shapes.id.button;
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
        ctx.renderer2.rectangle(ctx.shape, shapes.common.borderRadius, ctx.rect, p => {
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
