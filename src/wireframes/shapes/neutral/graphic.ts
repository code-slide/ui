/*
 * codeslide.net
 *
 * @license
 * Forked from mydraft.cc by Sebastian Stehle
 * Copyright (c) Do Duc Quan. All rights reserved.
*/

import SVGPathCommander, { ShapeTypes } from 'svg-path-commander';
import { RenderContext, ShapePlugin, ShapeProperties } from '@app/wireframes/interface';
import { theme } from '@app/const';

const DEFAULT_APPEARANCE = {
    [theme.key.backgroundColor]: 0xEEEEEE,
    [theme.key.fontSize]: theme.common.fontSize,
    [theme.key.foregroundColor]: 0,
    [theme.key.strokeColor]: theme.common.borderColor,
    [theme.key.strokeThickness]: theme.common.borderThickness,
    [theme.key.textAlignment]: 'center',
    [theme.key.text]: '',
    [theme.key.svgCode]: SVGAElement,
    [theme.key.aspectRatio]: true,
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
        const svgCode: string = ctx.shape.getAppearance(theme.key.svgCode);
        const hasSVG = svgCode.includes('<svg');
        const value = hasSVG ? svgCode.trim() : `<svg>\n${svgCode.trim()}</svg>`;

        // Parse SVG input into paths
        const SVG = new DOMParser().parseFromString(value, 'text/html').querySelector('svg');
        if (!SVG) return;
        const viewBox = SVG.getAttribute('viewBox')?.split(' ');
        const shapes: ShapeTypes[] = Array.from(SVG.querySelectorAll('circle,ellipse,rect,polygon,polyline,glyph'));
        shapes.forEach((shape) => SVGPathCommander.shapeToPath(shape, true));
  
        // Create paths
        const aspectRatio = ctx.shape.getAppearance(theme.key.aspectRatio);
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
