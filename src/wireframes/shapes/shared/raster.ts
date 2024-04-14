/*
 * codeslide.net
 *
 * @license
 * Forked from mydraft.cc by Sebastian Stehle
 * Copyright (c) Do Duc Quan. All rights reserved.
*/

import { RenderContext, ShapePlugin, ShapeSource } from '@app/wireframes/interface';
import { vogues, shapes } from '@app/const';

const SOURCE = 'SOURCE';

const DEFAULT_APPEARANCE = {
    [shapes.key.text]: true,
};

export class Raster implements ShapePlugin {
    public identifier(): string {
        return 'Raster';
    }

    public defaultAppearance() {
        return DEFAULT_APPEARANCE;
    }

    public defaultSize() {
        return { x: 80, y: 30 };
    }

    public create(source: ShapeSource) {
        if (source.type === 'Image') {
            let { width: w, height: h, source: data } = source.image;

            if (w > vogues.common.maxImgSize || h > vogues.common.maxImgSize) {
                const ratio = w / h;

                if (ratio > 1) {
                    w = vogues.common.maxImgSize;
                    h = vogues.common.maxImgSize / ratio;
                } else {
                    h = vogues.common.maxImgSize;
                    w = vogues.common.maxImgSize * ratio;
                }
            }

            return { 
                renderer: this.identifier(),
                size: {
                    x: w,
                    y: h,
                }, 
                appearance: { 
                    [SOURCE]: data,
                },
            };
        }

        return null;
    }

    public showInGallery() {
        return false;
    }

    public render(ctx: RenderContext) {
        ctx.renderer2.raster(ctx.shape.getAppearance(SOURCE), ctx.rect, true);
    }
}
