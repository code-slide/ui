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
    [shapes.key.backgroundColor]: 0xFFFFFF,
    [shapes.key.strokeColor]: shapes.common.borderColor,
    [shapes.key.strokeThickness]: shapes.common.borderThickness,
    [shapes.key.text]: '',
    [shapes.key.imageUrl]: '',
    [shapes.key.aspectRatio]: true,
};

export class Image implements ShapePlugin {
    public identifier(): string {
        return shapes.id.image;
    }

    public defaultAppearance() {
        return DEFAULT_APPEARANCE;
    }

    public defaultSize() {
        return { x: 100, y: 100 };
    }

    public render(ctx: RenderContext) {
        const url = ctx.shape.getAppearance(shapes.key.imageUrl);

        if (url) {
            const aspectRatio = ctx.shape.getAppearance(shapes.key.aspectRatio);
            ctx.renderer2.raster(url, ctx.rect, aspectRatio);
        } else {
            this.createText(ctx);
            this.createBorder(ctx);
            this.createCross(ctx);
        }
    }

    private createText(ctx: RenderContext) {
        ctx.renderer2.textMultiline(ctx.shape, ctx.rect, p => {
            p.setForegroundColor(ctx.shape);
        }, true);
    }

    private createCross(ctx: RenderContext) {
        const l = ctx.rect.left + 0.5;
        const r = ctx.rect.right - 0.5;
        const t = ctx.rect.top + 0.5;
        const b = ctx.rect.bottom - 0.5;

        const path = `M${l},${t} L${r},${b} M${l},${b} L${r},${t}`;

        ctx.renderer2.path(ctx.shape, path, p => {
            p.setStrokeColor(ctx.shape);
            p.setStrokeStyle('butt', 'butt');
        });
    }

    private createBorder(ctx: RenderContext) {
        ctx.renderer2.rectangle(ctx.shape, 0, ctx.rect, p => {
            p.setBackgroundColor(ctx.shape);
            p.setStrokeColor(ctx.shape);
        });
    }
}
