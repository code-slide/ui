/*
 * codeslide.net
 *
 * @license
 * Copyright (c) Sebastian Stehle. All rights reserved.
*/

import { ConfigurableFactory, DefaultAppearance, RenderContext, ShapePlugin, ShapeProperties } from '@app/wireframes/interface';
import { CommonTheme } from './_theme';

const SHAPE = 'SHAPE';
const SHAPE_STYLE = {
    Rectangle: 'Rectangle',
    RoundedRetangle: 'Rounded Rectangle',
    Ellipse: 'Ellipse',
    Triangle: 'Triangle',
    Rhombus: 'Rhombus',
};

const DEFAULT_APPEARANCE = {
    [DefaultAppearance.BACKGROUND_COLOR]: 0xEEEEEE,
    [DefaultAppearance.FONT_SIZE]: CommonTheme.CONTROL_FONT_SIZE,
    [DefaultAppearance.FOREGROUND_COLOR]: 0,
    [DefaultAppearance.STROKE_COLOR]: CommonTheme.CONTROL_BORDER_COLOR,
    [DefaultAppearance.STROKE_THICKNESS]: CommonTheme.CONTROL_BORDER_THICKNESS,
    [DefaultAppearance.TEXT_ALIGNMENT]: 'center',
    [DefaultAppearance.TEXT]: '',
    [SHAPE]: SHAPE_STYLE.Rectangle,
};

export class Shape implements ShapePlugin {
    public identifier(): string {
        return 'Shape';
    }

    public defaultAppearance() {
        return DEFAULT_APPEARANCE;
    }

    public defaultSize() {
        return { x: 100, y: 100 };
    }

    public configurables(factory: ConfigurableFactory) {
        return [
            factory.selection(SHAPE, 'Shape', [
                SHAPE_STYLE.Rectangle,
                SHAPE_STYLE.RoundedRetangle,
                SHAPE_STYLE.Ellipse,
                SHAPE_STYLE.Triangle,
                SHAPE_STYLE.Rhombus,
            ]),
        ];
    }

    public render(ctx: RenderContext) {
        this.createShape(ctx);
        this.createText(ctx);
    }

    private createShape(ctx: RenderContext) {
        const b = ctx.rect;

        const shapeType = ctx.shape.getAppearance(SHAPE);

        if (shapeType === SHAPE_STYLE.RoundedRetangle) {
            ctx.renderer2.rectangle(ctx.shape, 10, ctx.rect, p => {
                this.styleShape(ctx, p);
            });
        } else if (shapeType === SHAPE_STYLE.Ellipse) {
            ctx.renderer2.ellipse(ctx.shape, ctx.rect, p => {
                this.styleShape(ctx, p);
            });
        } else if (shapeType === SHAPE_STYLE.Triangle) {
            const path = `M0 ${b.bottom} L${b.cx} ${b.top} L${b.right} ${b.bottom} z`;

            ctx.renderer2.path(ctx.shape, path, p => {
                this.styleShape(ctx, p);
            });
        } else if (shapeType === SHAPE_STYLE.Rhombus) {
            const path = `M${b.cx} ${b.top} L${b.right} ${b.cy} L${b.cx} ${b.bottom} L${b.left} ${b.cy} z`;

            ctx.renderer2.path(ctx.shape, path, p => {
                this.styleShape(ctx, p);
            });
        } else {
            ctx.renderer2.rectangle(ctx.shape, 0, ctx.rect, p => {
                this.styleShape(ctx, p);
            });
        }
    }

    private styleShape(ctx: RenderContext, p: ShapeProperties) {
        p.setStrokeColor(ctx.shape);
        p.setBackgroundColor(ctx.shape);
    }

    private createText(ctx: RenderContext) {
        ctx.renderer2.text(ctx.shape, ctx.rect.deflate(10, 10), p => {
            p.setForegroundColor(ctx.shape);
        });
    }
}
