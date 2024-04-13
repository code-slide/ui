/*
 * codeslide.net
 *
 * @license
 * Forked from mydraft.cc by Sebastian Stehle
 * Copyright (c) Do Duc Quan. All rights reserved.
*/

import SVGPathCommander from 'svg-path-commander';
import { RenderContext, ShapePlugin } from '@app/wireframes/interface';
import { theme } from '@app/const';

type NodeType = 'None' | 'Arrow' | 'Triangle';
type EgdeType = 'Linear' | 'Quadratic';
type CurveType = 'Up' | 'Down';
type PivotType = 'Top Left' | 'Bottom Left';
type Position = 'x1' | 'x2' | 'y1' | 'y2';

const LINE_STYLE: { [index: string]: NodeType | EgdeType | CurveType | PivotType } = {
    None: 'None',
    Arrow: 'Arrow',
    Triangle: 'Triangle',
    Linear: 'Linear',
    Quadratic: 'Quadratic',
    Up: 'Up',
    Down: 'Down',
    TopLeft: 'Top Left',
    BottomLeft: 'Bottom Left',
};

const DEFAULT_APPEARANCE = {
    [theme.key.backgroundColor]: 0xEEEEEE,
    [theme.key.fontSize]: theme.common.fontSize,
    [theme.key.foregroundColor]: 0,
    [theme.key.strokeColor]: theme.common.borderColor,
    [theme.key.strokeThickness]: 2,
    [theme.key.textAlignment]: 'center',
    [theme.key.text]: '',
    [theme.key.lineStart]: LINE_STYLE.None,
    [theme.key.lineEnd]: LINE_STYLE.Arrow,
    [theme.key.lineType]: LINE_STYLE.Linear,
    [theme.key.lineCurve]: LINE_STYLE.Down,
    [theme.key.linePivot]: LINE_STYLE.TopLeft,
};

export class Line implements ShapePlugin {
    public identifier(): string {
        return 'Line';
    }

    public defaultAppearance() {
        return DEFAULT_APPEARANCE;
    }

    public defaultSize() {
        return { x: 200, y: 100 };
    }

    public render(ctx: RenderContext) {
        this.createShape(ctx);
        this.createText(ctx);
    }

    private createText(ctx: RenderContext) {
        ctx.renderer2.text(ctx.shape, ctx.rect.deflate(10, 10), p => {
            p.setForegroundColor(ctx.shape);
            p.setBackgroundColor(ctx.shape);
        });
    }

    private createShape(ctx: RenderContext) {
        const b = ctx.rect;

        const shapeRad = Math.atan2(b.height, b.width);
        const height = ctx.shape.strokeThickness * 6;
        const width = ctx.shape.strokeThickness * 4.5;

        const lineType = ctx.shape.getAppearance(theme.key.lineType);
        const isPivotTop = ctx.shape.getAppearance(theme.key.linePivot) == LINE_STYLE.TopLeft;

        if (lineType == LINE_STYLE.Quadratic) {
            // Quadratic line
            const ctlDir = ctx.shape.getAppearance(theme.key.lineCurve) == LINE_STYLE.Down ? 1 : -1;
            const ctlRad = shapeRad + ctlDir * Math.PI / 4;

            const pos: Record<Position, number> = {
                x1: b.left + height * Math.cos(ctlRad),
                x2: b.right - height * Math.cos(ctlRad - ctlDir * Math.PI / 2),
                y1: isPivotTop 
                    ? b.top + height * Math.sin(ctlRad)
                    : b.bottom - height * Math.sin(ctlRad - ctlDir * Math.PI / 2),
                y2: isPivotTop 
                    ? b.bottom - height * Math.sin(ctlRad - ctlDir * Math.PI / 2) 
                    : b.top + height * Math.sin(ctlRad),
            };

            // Control point, assuming isosceles triangle
            const ctlLen = Math.sqrt(((pos.x2 - pos.x1) ** 2 + (pos.y2 - pos.y1) ** 2) / 2);
            const ctlX = pos.x1 + ctlLen * Math.cos(ctlRad);
            const ctlY = pos.y1 + ctlLen * Math.sin(ctlRad);

            const path = `M${pos.x1} ${pos.y1} Q${ctlX} ${ctlY} ${pos.x2} ${pos.y2} Q${ctlX} ${ctlY} ${pos.x1} ${pos.y1} z`;
            this.createEdge(ctx, path);
            this.createNode(ctx, pos, ctlRad - ctlDir * Math.PI, ctlRad - ctlDir * Math.PI / 2, height, width, isPivotTop);

        } else if (lineType == LINE_STYLE.Linear) {
            // Linear line
            const pos: Record<Position, number> = {
                x1: b.left + height * Math.cos(shapeRad),
                x2: b.right - height * Math.cos(shapeRad),
                y1: isPivotTop 
                    ? b.top + height * Math.sin(shapeRad)
                    : b.bottom - height * Math.sin(shapeRad),
                y2: isPivotTop 
                    ? b.bottom - height * Math.sin(shapeRad) 
                    : b.top + height * Math.sin(shapeRad),
            };

            const path = `M${pos.x1} ${pos.y1} L${pos.x2} ${pos.y2} z`;
            this.createEdge(ctx, path);
            this.createNode(ctx, pos, shapeRad - Math.PI, shapeRad, height, width, isPivotTop);
        }
    }

    private createEdge(ctx: RenderContext, path: string) {
        ctx.renderer2.path(ctx.shape, path, p => {
            p.setStrokeColor(ctx.shape);
        });
    }

    private createNode(ctx: RenderContext, pos: Record<Position, number>, xRad: number, yRad: number, height: number, width: number, isPivotTop: boolean) {
        const startType = ctx.shape.getAppearance(theme.key.lineStart);
        const endType = ctx.shape.getAppearance(theme.key.lineEnd);

        const rotatingDegree = (radian: number) => {
            const relativeRad = isPivotTop ? radian : -radian;
            return 90 + Math.round(relativeRad * 180 / Math.PI);
        };

        const shapeEdge = (x: number, y: number, rotating: number, type: NodeType) => {
            const SHAPES: Record<NodeType, string> = {
                'Triangle': `M${x} ${y} l-${width / 2} 0 l${width / 2}-${height} l${width / 2} ${height} z`,
                'Arrow': `M${x} ${y} c-${width / 4} 0-${width / 2} ${height / 4}-${width / 2} ${height / 4} l${width / 2}-${height} l${width / 2} ${height} c0 0-${width / 4}-${height / 4}-${width / 2}-${height / 4} z`,
                'None': `M${x} ${y} l0-${height} z`,
            };

            const transformedPath = new SVGPathCommander(SHAPES[type])
                .transform({ rotate: rotatingDegree(rotating),  origin: [x, y] })
                .toString();
    
            ctx.renderer2.path(ctx.shape, transformedPath, p => {
                p.setBackgroundColor(ctx.shape.strokeColor);
                p.setStrokeColor(ctx.shape.strokeColor);
            });
        };

        shapeEdge(pos.x1, pos.y1, xRad, startType);
        shapeEdge(pos.x2, pos.y2, yRad, endType);
    }
}
