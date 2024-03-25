/*
 * codeslide.net
 *
 * @license
 * Copyright (c) Sebastian Stehle. All rights reserved.
*/

import SVGPathCommander, { ShapeTypes } from 'svg-path-commander';
import { ConfigurableFactory, DefaultAppearance, RenderContext, ShapePlugin, ShapeProperties } from '@app/wireframes/interface';
import { CommonTheme } from './_theme';

const SVG_CODE = 'SVG_CODE';
const SVG_ASPECT_RATIO = 'ASPECT_RATIO';

const DEFAULT_APPEARANCE = {
    [DefaultAppearance.BACKGROUND_COLOR]: 0xEEEEEE,
    [DefaultAppearance.FONT_SIZE]: CommonTheme.CONTROL_FONT_SIZE,
    [DefaultAppearance.FOREGROUND_COLOR]: 0,
    [DefaultAppearance.STROKE_COLOR]: CommonTheme.CONTROL_BORDER_COLOR,
    [DefaultAppearance.STROKE_THICKNESS]: CommonTheme.CONTROL_BORDER_THICKNESS,
    [DefaultAppearance.TEXT_ALIGNMENT]: 'center',
    [DefaultAppearance.TEXT]: '',
    [SVG_CODE]: SVGAElement,
    [SVG_ASPECT_RATIO]: true,
};

export class Graphic implements ShapePlugin {
    public identifier(): string {
        return 'Graphic';
    }

    public defaultAppearance() {
        return DEFAULT_APPEARANCE;
    }

    public defaultSize() {
        return { x: 100, y: 100 };
    }

    public configurables(factory: ConfigurableFactory) {
        return [
            factory.text(SVG_CODE, 'SVG Code'),
            factory.toggle(SVG_ASPECT_RATIO, 'Preserve aspect ratio'),
        ];
    }

    public render(ctx: RenderContext) {
        this.createShape(ctx);
        this.createText(ctx);
    }

    private createText(ctx: RenderContext) {
        ctx.renderer2.text(ctx.shape, ctx.rect.deflate(10, 10), p => {
            p.setForegroundColor(ctx.shape);
        });
    }

    private createShape(ctx: RenderContext) {
        // Trim SVG input
        const svgCode: string = ctx.shape.getAppearance(SVG_CODE);
        const hasSVG = svgCode.includes('<svg');
        const value = hasSVG ? svgCode.trim() : `<svg>\n${svgCode.trim()}</svg>`;

        // Parse SVG input into paths
        const SVG = new DOMParser().parseFromString(value, 'text/html').querySelector('svg');
        if (!SVG) return;
        const viewBox = SVG.getAttribute('viewBox')?.split(' ');
        const shapes: ShapeTypes[] = Array.from(SVG.querySelectorAll('circle,ellipse,rect,polygon,polyline,glyph'));
        shapes.forEach((shape) => SVGPathCommander.shapeToPath(shape, true));
  
        // Create paths
        const aspectRatio = ctx.shape.getAppearance(SVG_ASPECT_RATIO);
        const scaleX = ctx.rect.width / Number(viewBox && viewBox[2]);
        const scaleY = ctx.rect.height / Number(viewBox && viewBox[3]);
        const scaleUniform = Math.min(scaleX, scaleY);

        Array.from(SVG.children).forEach((shape) => {
            const path = shape.getAttribute('d') ?? '';
            const transform = {
                scale: [aspectRatio ? scaleUniform : scaleX, aspectRatio ? scaleUniform : scaleY],
                origin: [0, 0],
            };
            const transformedPath = new SVGPathCommander(path).transform(transform).toString();
            ctx.renderer2.path(ctx.shape, transformedPath, p => {
                this.styleShape(ctx, p);
            });
        });
      
        SVG.remove();
    }

    private styleShape(ctx: RenderContext, p: ShapeProperties) {
        p.setStrokeColor(ctx.shape);
        p.setBackgroundColor(ctx.shape);
    }
}
