/*
 * codeslide.net
 *
 * @license
 * Forked from mydraft.cc by Sebastian Stehle
 * Copyright (c) Do Duc Quan. All rights reserved.
*/

import { RenderContext, ShapePlugin, ShapeSource } from '@app/wireframes/interface';
import { shapes } from '@app/const';

const DEFAULT_APPEARANCE = {
    [shapes.key.foregroundColor]: 0,
    [shapes.key.text]: true,
};

export class Icon implements ShapePlugin {
    public identifier(): string {
        return shapes.id.icon;
    }

    public defaultAppearance() {
        return DEFAULT_APPEARANCE;
    }

    public defaultSize() {
        return { x: 40, y: 40 };
    }

    public create(source: ShapeSource) {
        if (source.type == 'Icon') {
            const { text, fontFamily } = source;

            return {
                renderer: this.identifier(),
                appearance: { 
                    [shapes.key.text]: text, 
                    [shapes.key.iconFontFamily]: fontFamily,
                },
            };
        }

        return null;
    }

    public showInGallery() {
        return false;
    }

    public render(ctx: RenderContext) {
        const fontSize = Math.min(ctx.rect.w, ctx.rect.h) - 10;

        const config = { fontSize, text: ctx.shape.text, alignment: 'center' };

        ctx.renderer2.text(config, ctx.rect, p => {
            p.setForegroundColor(ctx.shape);
            p.setFontFamily(ctx.shape.getAppearance(shapes.key.iconFontFamily) || 'FontAwesome');
        });
    }
}
